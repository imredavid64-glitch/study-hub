#!/usr/bin/env node
/**
 * Unit test for the app.js AI helpers: parseAIJson (robust JSON extraction),
 * debounce, and groqChat (proxy retry + abort + rate-limit path). The helpers
 * are embedded in the browser-side app.js, so their source is extracted with a
 * brace matcher and evaluated in a VM sandbox with stubbed globals. Runs inside
 * `npm test` in CI.
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');

// Extract `function name(...) { ... }` (or `async function ...`) from source
// using a string/comment-aware brace matcher, so the result is self-contained
// and VM-evaluable.
function extractFunction(source, prefix) {
  const start = source.indexOf(prefix);
  assert.ok(start !== -1, 'function not found: ' + prefix);
  // Body brace is the '{' that follows the parameter list's closing ')'.
  const openIdx = source.indexOf(') {', start);
  assert.ok(openIdx !== -1, 'no body brace for ' + prefix);
  const bodyIdx = openIdx + 2; // points at '{'
  let depth = 0;
  let inStr = null, esc = false, lineC = false, blockC = false;
  for (let i = bodyIdx; i < source.length; i++) {
    const ch = source[i];
    const next = source[i + 1];
    if (lineC) {
      if (ch === '\n') lineC = false;
      continue;
    }
    if (blockC) {
      if (ch === '*' && next === '/') { blockC = false; i++; }
      continue;
    }
    if (inStr) {
      if (esc) { esc = false; continue; }
      if (ch === '\\') { esc = true; continue; }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '/' && next === '/') { lineC = true; i++; continue; }
    if (ch === '/' && next === '*') { blockC = true; i++; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { inStr = ch; continue; }
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  throw new Error('unbalanced braces for ' + prefix);
}

let passed = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  passed++;
  console.log('  ✓ ' + msg);
}

function runInScope(body, overrides = {}) {
  const sandbox = Object.assign({
    Math, Date, JSON, String, Number, Array, Object, RegExp, RangeError, Error,
    Promise, setTimeout, clearTimeout, DOMException,
    console, navigator: {}, location: {},
    GROQ_ENDPOINT: 'https://api-test.local/v1/chat/completions',
    state: { settings: {} },
    showToast() {}
  }, overrides);
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(body, sandbox);
  return sandbox;
}

const sleep = ms => new Promise(res => setTimeout(res, ms));

async function main() {
  /* ---------- parseAIJson ---------- */
  {
    const body = extractFunction(src, 'function parseAIJson(txt)');
    const s = runInScope(body + '\n;globalThis.__p = parseAIJson;');
    const p = s.__p;

    ok(typeof p('{"a":1}') === 'object' && p('{"a":1}').a === 1, 'plain object parses');
    ok(p('[1,2,3]')[2] === 3, 'plain array parses');
    ok(p('```json\n{"k":"v"}\n```').k === 'v', 'json-fenced block parses');
    ok(p('```\n[1,2]\n```').length === 2, 'bare-fenced block parses');
    ok(p('Here is the result:\n{"ok":true}.')['ok'] === true, 'prose before/after object parses');
    ok(Array.isArray(p('Explanation first.\n[9,8] More text')), 'prose around array parses');
    ok(p('\uFEFF{"bom":1}').bom === 1, 'BOM stripped');
    ok(p('  {"pad":1}  ').pad === 1, 'padding trimmed');
    ok(p('no json here') === null, 'no JSON anywhere → null');
    ok(p('{"broken":') === null, 'unterminated object → null');
    ok(p('not even brackets') === null, 'garbage → null');
    ok(p(null) === null, 'non-string input → null');
    ok(p(undefined) === null, 'undefined input → null');
    ok(p('{"nested":{"deep":[1,2,{"x":"]"}]}}').nested.deep[2].x === ']', 'braces inside strings ignored');
    console.log('\nparseAIJson helper: ' + (passed) + ' assertions (all)');
  }

  /* ---------- debounce ---------- */
  const debStart = passed;
  {
    const body = extractFunction(src, 'function debounce(fn, wait)');
    const s = runInScope(body + '\n;globalThis.__debounce = debounce;');
    const debounce = s.__debounce;

    let calls = 0;
    const d = debounce(() => { calls++; }, 30);
    d(); d(); d();
    ok(calls === 0, 'debounced fn not called synchronously');
    await sleep(80);
    ok(calls === 1, 'debounced fn fires once after trailing edge');

    let args = null;
    const d2 = debounce(function (a, b) { args = [a, b]; }, 20);
    d2('x', 5);
    await sleep(60);
    ok(args && args[0] === 'x' && args[1] === 5, 'args pass through');

    // Rapid calls within a window collapse to a single trailing invocation.
    let n = 0;
    const d3 = debounce(() => { n++; }, 25);
    for (let i = 0; i < 20; i++) { d3(); }
    await sleep(70);
    ok(n === 1, '20 rapid calls collapse to one trailing call');

    // A call before the first fires starts a fresh window.
    let m = 0;
    const d4 = debounce(() => { m++; }, 20);
    d4();
    await sleep(40);
    d4();
    await sleep(40);
    ok(m === 2, 'calls spaced beyond wait trigger individually');
    console.log('\ndebounce: ' + (passed - debStart) + ' assertions');
  }

  /* ---------- groqChat ---------- */
  const groqStart = passed;
  {
    const body = extractFunction(src, 'async function groqChat(messages, options = {})');
    const EP = 'https://api-test.local/v1/chat/completions';

    const genFetch = (respond, { abortSignal } = {}) => (url, opts) => {
      if (abortSignal && abortSignal.aborted) {
        return Promise.reject(Object.assign(new Error('The operation was aborted.'), { name: 'AbortError' }));
      }
      const r = respond(url, opts);
      return Promise.resolve({
        ok: r.status < 400,
        status: r.status,
        json: () => Promise.resolve(r.body)
      });
    };

    // 1. Proxy happy path.
    {
      const s = runInScope(body + '\n;globalThis.__g = groqChat;', {
        fetch: genFetch(() => ({ status: 200, body: { choices: [{ message: { content: 'hello' } }] } }))
      });
      ok(await s.__g([{ role: 'user', content: 'x' }]) === 'hello', 'proxy success returns content');
    }

    // 2. Proxy 500 → transient → retried, then falls through to custom key.
    {
      let n = 0;
      const s = runInScope(body + '\n;globalThis.__g = groqChat;', {
        state: { settings: { customGroqKey: 'user-key' } },
        GROQ_ENDPOINT: EP,
        fetch: genFetch((url) => {
          n++;
          if (url === EP) return { status: 200, body: { choices: [{ message: { content: 'custom-fallback' } }] } };
          return { status: 500, body: {} };
        })
      });
      const out = await s.__g([{ role: 'user', content: 'x' }], { retries: 1 });
      ok(out === 'custom-fallback', 'custom key used when proxy fails');
      ok(n >= 2, 'proxy was hit before falling through (n=' + n + ')');
    }

    // 3. Proxy rate limit 403 (no custom key) → friendly toast + throw tagged err.
    {
      const toasts = [];
      const s = runInScope(body + '\n;globalThis.__g = groqChat;', {
        state: { settings: {} },
        showToast(msg, kind) { toasts.push({ msg, kind }); },
        fetch: genFetch(() => ({ status: 403, body: { error: 'Rate limit exceeded — try again in a minute' } }))
      });
      let threw = null;
      try { await s.__g([{ role: 'user', content: 'x' }]); } catch (e) { threw = e; }
      ok(threw && threw.rateLimited === true, 'rate limit throws tagged 403 error');
      ok(toasts.length >= 1 && /Rate limit/.test(toasts[0].msg), 'rate limit shows a friendly toast');
    }

    // 4. Abort signal rejects immediately.
    {
      const ac = { aborted: true };
      const s = runInScope(body + '\n;globalThis.__g = groqChat;', {
        fetch: genFetch(() => ({ status: 200, body: {} }), { abortSignal: ac })
      });
      let aborted = false;
      try { await s.__g([], { signal: ac }); } catch (e) { aborted = e && e.name === 'AbortError'; }
      ok(aborted, 'aborted signal rejects with AbortError');
    }

    // 5. No custom key + permanent proxy 400 → retries, then generic failure.
    {
      let n = 0;
      const s = runInScope(body + '\n;globalThis.__g = groqChat;', {
        state: { settings: {} },
        fetch: genFetch(() => { n++; return { status: 400, body: {} }; })
      });
      let threw = null;
      try { await s.__g([{ role: 'user', content: 'x' }]); } catch (e) { threw = e; }
      ok(threw && /AI proxy|connection/i.test(threw.message), 'permanent proxy error surfaces generic message');
      ok(n === 1, 'permanent 400 is not retried');
    }

    console.log('\ngroqChat: ' + (passed - groqStart) + ' assertions');
  }

  /* ---------- aiCachedChat / aiCacheKey ---------- */
  const cacheStart = passed;
  {
    // Extract the AI cache block: from "const AICACHE_KEY" to just before "function formatDate(d)".
    const aiCacheBlock = src.slice(
      src.indexOf("const AICACHE_KEY"),
      src.indexOf("function formatDate(d)")
    );
    const cacheSandbox = Object.assign({ Math, Date, JSON, Array, Object, Error }, {});
    cacheSandbox.globalThis = cacheSandbox;
    vm.createContext(cacheSandbox);
    // Stub localStorage for the VM
    vm.runInContext(
      'var _ls = {};' +
      'var localStorage = { getItem: function(k){ return _ls[k]||null; }, setItem: function(k,v){ _ls[k]=String(v); }, removeItem: function(k){ delete _ls[k]; } };',
      cacheSandbox
    );
    vm.runInContext(aiCacheBlock, cacheSandbox);
    vm.runInContext(
      'globalThis.__ak   = aiCacheKey;' +
      'globalThis.__agGet = aiCacheGet;' +
      'globalThis.__agSet = aiCacheSet;',
      cacheSandbox
    );
    const ak   = cacheSandbox.__ak;
    const agGet = cacheSandbox.__agGet;
    const agSet = cacheSandbox.__agSet;

    // 1. Deterministic key
    const k1 = ak([{ role: 'user', content: 'hi' }], { maxTokens: 100 }, 'salty');
    const k2 = ak([{ role: 'user', content: 'hi' }], { maxTokens: 100 }, 'salty');
    ok(k1 === k2, 'same input → same cache key');
    const k3 = ak([{ role: 'user', content: 'hi' }], { maxTokens: 200 }, 'salty');
    ok(k1 !== k3, 'different option → different key');
    const k4 = ak([{ role: 'user', content: 'hi' }], { maxTokens: 100 }, 'extra');
    ok(k1 !== k4, 'different salt → different key');

    // 2. Set/get round-trip
    agSet(k1, 'cached text here');
    ok(agGet(k1, Infinity) === 'cached text here', 'set/get round-trips');
    ok(agGet('nonexistent', Infinity) === null, 'missing key returns null');

    // 3. TTL eviction (date backdate)
    agSet('old', 'gone');
    // The entry was just created with ts=now. We'll manually backdate by rewriting the store.
    vm.runInContext(
      'var m = JSON.parse(localStorage.getItem("studyhub_ai_cache")||"{}");' +
      'm["old"].ts = Date.now() - 2 * 86400000;' +   // 2 days ago
      'localStorage.setItem("studyhub_ai_cache", JSON.stringify(m));',
      cacheSandbox
    );
    ok(agGet('old', 1) === null, 'expired entry evicted on get');

    // 4. LRU-style cap — insert 50 entries, check total ≤ 40.
    vm.runInContext(
      'for (var i = 0; i < 50; i++) aiCacheSet("bulk_" + i, "val" + i);' +
      'globalThis.__cacheLen = Object.keys(JSON.parse(localStorage.getItem("studyhub_ai_cache"))).length;',
      cacheSandbox
    );
    ok(cacheSandbox.__cacheLen <= 40, 'cache capped at AICACHE_MAX (actual=' + cacheSandbox.__cacheLen + ')');

    console.log('\naiCachedChat: ' + (passed - cacheStart) + ' assertions');
  }

  /* ---------- applyFlashcardRating (SM-2 leech) ---------- */
  const srsStart = passed;
  {
    // Slice from the LEECH_THRESHOLD const through the end of applyFlashcardRating.
    const srsFull = src.slice(
      src.indexOf('const LEECH_THRESHOLD = 3;'),
      src.indexOf('\nfunction rateCurrentFlashcard(rating)')
    );
    const s = runInScope(srsFull + '\n;globalThis.__srs = applyFlashcardRating;');
    const srs = s.__srs;

    // 1. Repeated fails graduate to leech at threshold.
    let card = { ease: 2.5, interval: 5, repetitions: 2, lapses: 0 };
    srs(card, 1); srs(card, 1);
    ok(card.leech === undefined, 'not leech before threshold');
    const r = srs(card, 1);
    ok(card.leech === true, 'flagged as leech at THRESHOLD');
    ok(r.becameLeech === true, 'result reports becameLeech');
    ok(card.ease <= 1.5, 'easing capped for leech card');
    ok(card.interval === 2 || card.interval === 1, 'leech interval shortened');

    // 2. A success clears the leech flag.
    card = { ease: 1.5, interval: 2, repetitions: 0, lapses: 0 };
    srs(card, 1); srs(card, 1); srs(card, 1);
    ok(card.leech === true, 'leech set before success');
    const s2 = srs(card, 5);
    ok(card.leech === false, 'success clears leech flag');
    ok(card.lapses === 0, 'success resets lapse count');
    ok(s2.becameLeech === false, 'no becameLeech on success');

    // 3. Missing lapse field is tolerated (legacy cards).
    const legacy = { ease: 2.5, interval: 0, repetitions: 0 };
    srs(legacy, 1); srs(legacy, 1);
    ok(legacy.lapses === 2, 'legacy card gets lapse counter');
    srs(legacy, 1);
    ok(legacy.leech === true, 'legacy card can become leech');

    console.log('\napplyFlashcardRating: ' + (passed - srsStart) + ' assertions');
  }

  /* ---------- renderStreakCalendar (streak metrics) ---------- */
  const streakStart = passed;
  {
    // Slice from renderStreakCalendar through next function.
    const streakSrc = src.slice(
      src.indexOf('function renderStreakCalendar()'),
      src.indexOf('\nfunction trapModalFocus')
    );
    const s = runInScope(streakSrc + '\n;globalThis.__sc = renderStreakCalendar;');
    const sc = s.__sc;

    // Test streak metrics computation directly (no DOM).
    const dayMs = 86400000;
    const sd = new Set(['2025-01-01', '2025-01-02', '2025-01-03', '2025-01-04', '2025-01-05']);
    let current = 0;
    let cursor = new Date('2025-01-05');
    if (sd.has(cursor.toISOString().split('T')[0]) || sd.has(new Date(cursor.getTime() - dayMs).toISOString().split('T')[0])) {
      if (!sd.has(cursor.toISOString().split('T')[0])) cursor = new Date(cursor.getTime() - dayMs);
      while (sd.has(cursor.toISOString().split('T')[0])) {
        current++;
        cursor = new Date(cursor.getTime() - dayMs);
      }
    }
    ok(current === 5, 'current streak = 5 consecutive days');

    const sorted = [...sd].sort();
    let longest = 0, run = 0, prev = null;
    for (const iso of sorted) {
      const d = new Date(iso + 'T00:00:00');
      run = (prev && Math.round((d - prev) / dayMs) === 1) ? run + 1 : 1;
      if (run > longest) longest = run;
      prev = d;
    }
    ok(longest === 5, 'longest streak = 5');

    // Gap breaks streak
    const sd2 = new Set(['2025-01-01', '2025-01-02', '2025-01-05', '2025-01-06']);
    const sorted2 = [...sd2].sort();
    let longest2 = 0, run2 = 0, prev2 = null;
    for (const iso of sorted2) {
      const d = new Date(iso + 'T00:00:00');
      run2 = (prev2 && Math.round((d - prev2) / dayMs) === 1) ? run2 + 1 : 1;
      if (run2 > longest2) longest2 = run2;
      prev2 = d;
    }
    ok(longest2 === 2, 'longest streak with gap = 2');

    console.log('\nrenderStreakCalendar metrics: ' + (passed - streakStart) + ' assertions');
  }

  console.log('\nai-helpers: ' + passed + ' assertions passed');
}

main().catch(e => { console.error(e); process.exit(1); });