#!/usr/bin/env node
/**
 * Unit test for the updater core (electron-updater-core.js) — sha256
 * verification and per-platform installer selection. Pure Node, so it runs
 * inside the `npm test` step of CI without Electron or network.
 */
'use strict';

const assert = require('assert');
const { sha256Hex, verifySha256, pickInstallerAsset, formatProgress } = require('../electron-updater-core');

let passed = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  passed++;
  console.log('  ✓ ' + msg);
}

console.log('updater core unit test');

// 1. sha256 matches known vectors
ok(sha256Hex(Buffer.from('')) === 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'empty-string sha256 matches RFC 6234 vector');
ok(sha256Hex('abc') === 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad', 'sha256 of "abc" matches known vector');

// 2. verifySha256 accepts "sha256:" prefixes and rejects everything else
const buf = Buffer.from('study-hub-installer-content');
const good = sha256Hex(buf);
ok(verifySha256(buf, good) === true, 'exact digest verifies');
ok(verifySha256(buf, 'sha256:' + good) === true, '"sha256:"-prefixed digest verifies');
ok(verifySha256(buf, 'deadbeef') === false, 'wrong digest fails');
ok(verifySha256(buf, good.toUpperCase()) === true, 'uppercase digest verifies');
ok(verifySha256(buf, '') === false, 'missing digest fails');
ok(verifySha256(buf, 'not-a-digest') === false, 'malformed digest fails');
ok(verifySha256(null, good) === false, 'null buffer never throws and fails');

// 3. Platform asset selection
const release = {
  assets: [
    { name: 'Study-Hub-Linux.AppImage', browser_download_url: 'https://x/AppImage' },
    { name: 'Study-Hub-Linux.deb', browser_download_url: 'https://x/deb' },
    { name: 'Study-Hub-mac.dmg', browser_download_url: 'https://x/dmg', digest: 'sha256:aa' },
    { name: 'Study-Hub-mac.zip', browser_download_url: 'https://x/maczip' },
    { name: 'Study-Hub-Windows.zip', browser_download_url: 'https://x/winzip' },
  ],
};
ok(pickInstallerAsset(release, 'darwin').name === 'Study-Hub-mac.dmg', 'mac prefers the dmg');
ok(pickInstallerAsset(release, 'win32').name === 'Study-Hub-Windows.zip', 'windows picks the zip');
ok(pickInstallerAsset(release, 'linux').name === 'Study-Hub-Linux.AppImage', 'linux prefers the AppImage');
ok(pickInstallerAsset({ assets: [{ name: 'x', browser_download_url: 'u' }] }, 'darwin') === null, 'no matching asset returns null');
ok(pickInstallerAsset(null, 'darwin') === null, 'null release returns null');
ok(pickInstallerAsset({ assets: [{ name: 'Study-Hub-mac.zip', browser_download_url: 'https://x/maczip' }] }, 'darwin').name === 'Study-Hub-mac.zip', 'mac falls back to the zip when no dmg exists');

// 4. Progress formatting
ok(formatProgress(134217728, 325058560) === '128 MB of 310 MB (41%)', 'progress line formats received/total/pct');

console.log('updater core unit test passed (' + passed + ' assertions)');
