#!/usr/bin/env node
/**
 * Unit test for the window-position memory module (electron-window-state.js).
 * Pure Node — no Electron needed — so it runs inside the `npm test` step of CI.
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  defaultBounds, sanitizeBounds, loadWindowState, saveWindowState, recordWindow, MAX_WINDOWS,
} = require('../electron-window-state');

let passed = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  passed++;
  console.log('  ✓ ' + msg);
}

console.log('window-state unit test');

// 1. Defaults
const d = defaultBounds();
ok(d.width === 1400 && d.height === 900 && d.maximized === false, 'default bounds are 1400x900, not maximized');

// 2. On-screen bounds are preserved (clamped to sane ranges)
const area = { x: 0, y: 0, width: 1920, height: 1080 };
const kept = sanitizeBounds({ width: 1200, height: 800, x: 100, y: 100, maximized: false }, area);
ok(kept.width === 1200 && kept.height === 800 && kept.x === 100 && kept.y === 100, 'on-screen bounds are kept as-is');

// 3. Off-screen bounds are re-centered inside the display work area
const off = sanitizeBounds({ width: 1200, height: 800, x: 99999, y: -99999 }, area);
ok(off.x === 360 && off.y === 140, 'off-screen bounds re-center: (' + off.x + ',' + off.y + ')');

// 4. Absurd sizes are clamped
const huge = sanitizeBounds({ width: 50000, height: 40, x: 10, y: 10 }, area);
ok(huge.width === 4000 && huge.height === 480, 'sizes clamp to sane limits (4000x480)');

// 5. Corrupt input falls back to defaults
const bad = sanitizeBounds('garbage', area);
ok(bad.width === 1400 && bad.height === 900, 'garbage bounds fall back to defaults');

// 6. Maximized flag survives
const max = sanitizeBounds({ width: 1400, height: 900, x: 0, y: 0, maximized: true }, area);
ok(max.maximized === true, 'maximized flag is preserved');

// 6b. The per-window tab survives sanitization (bounded length)
const withTab = sanitizeBounds({ width: 1200, height: 800, x: 10, y: 10, tab: 'planner' }, area);
ok(withTab.tab === 'planner', 'tab survives sanitization');
const longTab = sanitizeBounds({ width: 1200, height: 800, x: 10, y: 10, tab: 'x'.repeat(200) }, area);
ok(longTab.tab === undefined, 'over-long tab is dropped');
ok(sanitizeBounds({ width: 1200, height: 800, x: 10, y: 10 }, area).tab === undefined, 'missing tab stays undefined');

// 7. Queue is capped at MAX_WINDOWS, most recent first
let q = [];
for (let i = 0; i < 12; i++) q = recordWindow(q, { width: i });
ok(q.length === MAX_WINDOWS, 'queue caps at ' + MAX_WINDOWS + ' entries');
ok(q[0].width === 11, 'most recently closed window comes first');

// 8. Load/save round-trip through a temp file
const file = path.join(os.tmpdir(), 'window-state-test-' + process.pid + '.json');
ok(saveWindowState(file, q) === true, 'save writes the file');
const loaded = loadWindowState(file);
ok(loaded.length === MAX_WINDOWS && loaded[0].width === 11, 'load round-trips the saved queue');
fs.unlinkSync(file);

// 9. Missing/corrupt files load as an empty queue
ok(loadWindowState('/nonexistent/nope.json').length === 0, 'missing file loads as empty queue');
const corrupt = path.join(os.tmpdir(), 'window-state-corrupt-' + process.pid + '.json');
fs.writeFileSync(corrupt, '{not json');
ok(loadWindowState(corrupt).length === 0, 'corrupt file loads as empty queue');
fs.unlinkSync(corrupt);

console.log('window-state unit test passed (' + passed + ' assertions)');
