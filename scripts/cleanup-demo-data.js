#!/usr/bin/env node
/**
 * Study Hub — demo-data cleanup
 * =============================
 * Purges demo / QA / test study-mate profiles and leaderboard rows from the
 * live Supabase project so a launch starts with a clean community (or only
 * real users). Uses the service_role key, which bypasses RLS and can remove
 * rows owned by other auth users (the client can only ever touch its own row).
 *
 * Usage:
 *   node scripts/cleanup-demo-data.js                 # dry run — list only
 *   node scripts/cleanup-demo-data.js --yes           # actually delete
 *   node scripts/cleanup-demo-data.js --yes --wipe-scholars
 *
 * Credentials (first match wins):
 *   $SUPABASE_SERVICE_KEY  → $SUPABASE_URL (defaults to the live project)
 *   .env.local             → SUPABASE_SERVICE_KEY / SUPABASE_URL
 *   /tmp/sb_service_key    → service key written by the setup runbook
 *
 * What it removes:
 *   1. mate_profiles whose name matches demo markers (case-insensitive):
 *        'demo scholar', 'qa ', 'test ', 'judge'
 *   2. leaderboard_entries whose name matches the demo markers OR whose
 *      user_id no longer exists in users (orphaned/legacy rows).
 *   3. The users rows behind those profiles (their snapshots + analytics
 *      events + mate profile cascade away via the FK).
 *   4. With --wipe-scholars: zero-activity leaderboard rows left by anon
 *      sign-in tests (name = 'Scholar', xp = 0, streak = 0, study_minutes = 0).
 *
 * Exits 0 when nothing matched, 1 on error.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DEFAULT_URL = 'https://nnrdkdisjfudibvrggxb.supabase.co';
// Markers that identify demo/QA/test rows by name (case-insensitive).
const DEMO_MARKERS = ['demo scholar', 'qa ', 'test ', 'judge'];

function readEnvFile(key) {
  try {
    const raw = fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8');
    const m = raw.match(new RegExp('^' + key + '=(.*)$', 'm'));
    if (m) return m[1].trim().replace(/^['"]|['"]$/g, '');
  } catch (e) { /* no .env.local */ }
  return null;
}

function loadSecret() {
  if (process.env.SUPABASE_SERVICE_KEY) return process.env.SUPABASE_SERVICE_KEY;
  const fromEnv = readEnvFile('SUPABASE_SERVICE_KEY');
  if (fromEnv) return fromEnv;
  try {
    const t = fs.readFileSync('/tmp/sb_service_key', 'utf8').trim();
    if (t) return t;
  } catch (e) { /* not written yet */ }
  return null;
}

async function pg(url, key, method, table, opts) {
  let q = table;
  if (opts.select) q += '?select=' + encodeURIComponent(opts.select);
  if (opts.filter) q += (opts.select ? '&' : '?') + opts.filter;
  if (opts.limit) q += (q.includes('?') ? '&' : '?') + 'limit=' + opts.limit;
  const res = await fetch(url + '/rest/v1/' + q, {
    method,
    headers: {
      apikey: key,
      Authorization: 'Bearer ' + key,
      'Content-Type': 'application/json',
      Prefer: opts.prefer || 'return=representation'
    }
  });
  const text = await res.text();
  let body;
  try { body = text ? JSON.parse(text) : null; } catch (e) { body = text; }
  if (!res.ok) {
    throw new Error(method + ' ' + table + ' → ' + res.status + ': ' + text.slice(0, 300));
  }
  return body;
}

const ilike = (col, markers) =>
  markers.map(m => col + '.ilike.*' + m.replace(/ /g, '%20') + '*').join(',');

async function main() {
  const args = process.argv.slice(2);
  const yes = args.includes('--yes');
  const wipeScholars = args.includes('--wipe-scholars');

  const key = loadSecret();
  if (!key) {
    console.error('No SUPABASE_SERVICE_KEY found. Set it via $SUPABASE_SERVICE_KEY,');
    console.error('.env.local, or /tmp/sb_service_key (see docs/supabase-setup.md).');
    process.exit(1);
  }
  const url = process.env.SUPABASE_URL || readEnvFile('SUPABASE_URL') || DEFAULT_URL;

  const demoFilter = 'or=(' + ilike('name', DEMO_MARKERS) + ')';

  // 1. Demo mate profiles (and their user_ids).
  const demoMates = await pg(url, key, 'GET', 'mate_profiles', { select: 'user_id,name,major', filter: demoFilter + '&limit=1000' });

  // 2. Demo + orphaned leaderboard rows.
  const demoBoard = await pg(url, key, 'GET', 'leaderboard_entries', { select: 'id,user_id,name,xp,streak', filter: demoFilter + '&limit=1000' });
  const orphanedBoard = await pg(url, key, 'GET', 'leaderboard_entries', {
    select: 'id,user_id,name,xp,streak',
    filter: 'user_id=not.is.null&limit=1000'
  });
  // Resolve which leaderboard user_ids are orphaned (not present in users).
  const allUserIds = Array.from(new Set(orphanedBoard.map(r => r.user_id).filter(Boolean)));
  let existing = new Set();
  for (let i = 0; i < allUserIds.length; i += 50) {
    const chunk = allUserIds.slice(i, i + 50);
    const rows = await pg(url, key, 'GET', 'users', {
      select: 'id',
      filter: 'id=in.(' + chunk.join(',') + ')&limit=1000'
    });
    (rows || []).forEach(r => existing.add(r.id));
  }
  const orphaned = orphanedBoard.filter(r => r.user_id && !existing.has(r.user_id));

  // Zero-activity "Scholar" rows from anon sign-in tests (optional).
  let scholarNoise = [];
  if (wipeScholars) {
    scholarNoise = await pg(url, key, 'GET', 'leaderboard_entries', {
      select: 'id,user_id,name,xp,streak',
      filter: 'name=eq.Scholar&xp=eq.0&streak=eq.0&study_minutes=eq.0&limit=1000'
    });
  }

  const boardTargets = Array.from(new Set([...demoBoard, ...orphaned, ...scholarNoise].map(r => r.id)));
  const userTargets = Array.from(new Set([
    ...demoMates.map(r => r.user_id),
    ...demoBoard.map(r => r.user_id),
    ...(wipeScholars ? scholarNoise.map(r => r.user_id) : [])
  ].filter(Boolean)));

  // Summary
  console.log((yes ? 'DELETING' : 'DRY RUN (add --yes to delete)') + ' against ' + url);
  console.log('  mate profiles  : ' + demoMates.length + (demoMates.length ? ' → ' + demoMates.map(r => r.name).join(', ') : ''));
  console.log('  demo board rows: ' + demoBoard.length);
  console.log('  orphaned board : ' + orphaned.length);
  console.log('  scholar noise  : ' + scholarNoise.length + (wipeScholars ? '' : ' (use --wipe-scholars)'));
  console.log('  users to purge : ' + userTargets.length);

  if (!yes) {
    if (!demoMates.length && !boardTargets.length && !userTargets.length) {
      console.log('\nNothing to clean — the backend already has no demo data.');
      return;
    }
    console.log('\nNothing deleted. Re-run with --yes to apply.');
    return;
  }

  if (boardTargets.length) {
    await pg(url, key, 'DELETE', 'leaderboard_entries', {
      filter: 'id=in.(' + boardTargets.join(',') + ')'
    });
  }
  if (userTargets.length) {
    // Deleting users cascades their mate profile, snapshots and events.
    await pg(url, key, 'DELETE', 'users', { filter: 'id=in.(' + userTargets.join(',') + ')' });
  }
  console.log('\nDone. Deleted ' + boardTargets.length + ' leaderboard rows and ' +
    userTargets.length + ' user rows (mate profiles/snapshots/events cascade).');
}

main().catch(e => { console.error('cleanup failed: ' + e.message); process.exit(1); });
