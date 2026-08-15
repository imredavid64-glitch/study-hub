#!/usr/bin/env node
/**
 * Verifies the durable Upstash rate limiter in lib/guard.js against a real
 * Upstash Redis database (not the in-memory fallback).
 *
 * Usage:
 *   UPSTASH_REDIS_REST_URL=... UPSTASH_REDIS_REST_TOKEN=... \
 *     node scripts/upstash-ratelimit-test.js           # INCR a key, print count
 *   … node scripts/upstash-ratelimit-test.js --reset   # delete the test key
 *
 * Durability proof: run the script twice (two separate processes). The
 * "durable count" must go 1 → 2, proving the counter survives process
 * boundaries — i.e. Vercel serverless cold starts.
 */
'use strict';

const { redisIncr, checkRequest, redisClient } = require('../lib/guard');

const KEY = 'test:rl:durable';

async function main() {
  const reset = process.argv.includes('--reset');
  const c = redisClient();
  if (!c) {
    console.error('UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are not set.');
    process.exit(1);
  }

  if (reset) {
    const res = await fetch(c.url + '/del/' + KEY, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + c.token }
    });
    console.log('reset response:', await res.text());
    return;
  }

  // 1. Durability: INCR a fixed key and print the count.
  const n = await redisIncr(KEY, 60);
  if (n === null) {
    console.error('redisIncr returned null — durable store unavailable. Check the env vars.');
    process.exit(1);
  }
  console.log('durable count:', n);

  // 2. Guard behaviour: with maxPerMinute = 2 and a fresh IP each run, the
  //    first two requests pass and the next two are blocked.
  const ip = '203.0.113.' + (Math.floor(Math.random() * 250) + 1);
  const outcomes = [];
  for (let i = 0; i < 4; i++) {
    outcomes.push(await checkRequest(
      { headers: { 'x-forwarded-for': ip, origin: 'https://study-hub-plum-omega.vercel.app' } },
      { maxPerMinute: 2, dailyMax: 0 }
    ));
  }
  console.log('checkRequest outcomes (max 2/min):', JSON.stringify(outcomes));
}

main().catch(e => { console.error('test failed:', e); process.exit(1); });
