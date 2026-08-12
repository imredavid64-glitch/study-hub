#!/usr/bin/env node
/**
 * Unit test for the updater core (electron-updater-core.js) — sha256
 * verification and per-platform installer selection. Pure Node, so it runs
 * inside the `npm test` step of CI without Electron or network.
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { sha256Hex, verifySha256, pickInstallerAsset, formatProgress } = require('../electron-updater-core');
const { swapInstall, writeResult, findFile } = require('../scripts/apply-update');

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

// 5. apply-update swap: successful swap backs up, replaces, cleans up
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sh-upd-test-'));
const oldApp = path.join(tmp, 'Study Hub.app');
const newApp = path.join(tmp, 'staged', 'Study Hub.app');
fs.mkdirSync(oldApp, { recursive: true });
fs.mkdirSync(newApp, { recursive: true });
fs.writeFileSync(path.join(oldApp, 'old.txt'), 'old-build');
fs.writeFileSync(path.join(newApp, 'new.txt'), 'new-build');
const backup = path.join(tmp, 'backup.app');
const swapOk = swapInstall(oldApp, newApp, backup);
ok(swapOk.ok === true, 'swapInstall succeeds');
ok(fs.readFileSync(path.join(oldApp, 'new.txt'), 'utf8') === 'new-build', 'swap replaced the old install with the new one');
ok(!fs.existsSync(backup), 'swap cleans up the backup after success');

// 6. swap rollback: a missing staged build must not damage the current install
const keep = path.join(tmp, 'keep.txt');
fs.writeFileSync(keep, 'untouched');
const failSwap = swapInstall(keep, path.join(tmp, 'does-not-exist'), path.join(tmp, 'keep.bak'));
ok(failSwap.ok === false, 'swapInstall fails when the staged build is missing');
ok(fs.readFileSync(keep, 'utf8') === 'untouched', 'failed swap leaves the current install untouched');

// 7. writeResult writes atomically and overwrites
const resultFile = path.join(tmp, 'result.json');
ok(writeResult(resultFile, { ok: true, version: '1.1.4' }) === true, 'writeResult succeeds');
ok(JSON.parse(fs.readFileSync(resultFile, 'utf8')).version === '1.1.4', 'writeResult round-trips');
ok(writeResult(resultFile, { ok: false, error: 'x' }) === true, 'writeResult overwrites');
ok(JSON.parse(fs.readFileSync(resultFile, 'utf8')).ok === false, 'overwrite lands');

// 8. findFile finds a .exe recursively (Windows staging)
const winDir = path.join(tmp, 'win', 'nested', 'app');
fs.mkdirSync(winDir, { recursive: true });
fs.writeFileSync(path.join(winDir, 'Study Hub.exe'), 'x');
ok(findFile(path.join(tmp, 'win'), /\.exe$/i) === path.join(winDir, 'Study Hub.exe'), 'findFile finds the exe recursively');
ok(findFile(tmp, /\.exe$/i) === path.join(winDir, 'Study Hub.exe'), 'findFile recurses from the root');
fs.rmSync(tmp, { recursive: true, force: true });

console.log('updater core unit test passed (' + passed + ' assertions)');
