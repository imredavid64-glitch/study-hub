#!/usr/bin/env node
/**
 * Detached update applier — spawned by the Electron main process AFTER the new
 * installer has been downloaded and sha256-verified. Runs as plain Node (no
 * Electron) so it survives the app quitting. It:
 *
 *   1. waits for the old app process to exit,
 *   2. backs up the current install, swaps in the staged build,
 *   3. rolls back on any failure and writes result.json either way,
 *   4. relaunches the updated app.
 *
 * The swap logic (`swapInstall`) is pure and unit-tested; the extraction and
 * relaunch steps are platform-specific but guarded so a failure anywhere
 * results in a clean rollback instead of a broken install.
 */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawn } = require('child_process');

// ---- Pure helpers (unit-tested by scripts/updater-test.js) ----

/**
 * Swap a new install into place: rename old → backup, copy new → old.
 * On any error the backup is restored so the previous version survives.
 * Returns { ok:true } or { ok:false, error }.
 */
function swapInstall(oldPath, newPath, backupPath) {
  try {
    if (!fs.existsSync(newPath)) return { ok: false, error: 'staged build missing: ' + newPath };
    if (fs.existsSync(backupPath)) fs.rmSync(backupPath, { recursive: true, force: true });
    if (fs.existsSync(oldPath)) fs.renameSync(oldPath, backupPath);
    fs.cpSync(newPath, oldPath, { recursive: true });
    // Remove the backup only once the new install is in place.
    if (fs.existsSync(backupPath)) fs.rmSync(backupPath, { recursive: true, force: true });
    return { ok: true };
  } catch (e) {
    try {
      if (fs.existsSync(backupPath) && !fs.existsSync(oldPath)) fs.renameSync(backupPath, oldPath);
    } catch (e2) { /* rollback best-effort */ }
    return { ok: false, error: String(e && e.message ? e.message : e) };
  }
}

/** Write result.json (atomically via a temp file) for the app to read on boot. */
function writeResult(resultFile, data) {
  try {
    const tmp = resultFile + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(data));
    fs.renameSync(tmp, resultFile);
    return true;
  } catch (e) {
    return false;
  }
}

/** Wait (polling) until a process no longer exists. Resolves when gone. */
function waitForExit(pid, timeoutMs) {
  const deadline = Date.now() + (timeoutMs || 60000);
  return new Promise((resolve) => {
    const tick = () => {
      let alive = true;
      try { process.kill(pid, 0); } catch (e) { alive = false; }
      if (!alive || Date.now() > deadline) return resolve(!alive);
      setTimeout(tick, 500);
    };
    tick();
  });
}

// ---- Platform helpers ----

/** Extract an installer file into a staging dir; returns the path to the app. */
async function extractInstaller(file, stagingDir, platform) {
  fs.mkdirSync(stagingDir, { recursive: true });
  const p = String(platform || process.platform);
  if (p === 'darwin') {
    // Mount the dmg, copy the .app bundle out, unmount.
    const mountPoint = path.join(os.tmpdir(), 'sh-mount-' + process.pid);
    fs.mkdirSync(mountPoint, { recursive: true });
    execFileSync('hdiutil', ['attach', file, '-nobrowse', '-mountpoint', mountPoint], { stdio: 'ignore' });
    try {
      const entries = fs.readdirSync(mountPoint);
      const appName = entries.find(n => n.endsWith('.app'));
      if (!appName) throw new Error('no .app found inside the dmg');
      const dest = path.join(stagingDir, appName);
      if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true });
      execFileSync('ditto', [path.join(mountPoint, appName), dest], { stdio: 'ignore' });
      return dest;
    } finally {
      try { execFileSync('hdiutil', ['detach', mountPoint, '-force'], { stdio: 'ignore' }); } catch (e) { /* best-effort */ }
    }
  }
  if (p === 'win32') {
    // Expand-Archive is available on every supported Windows.
    execFileSync('powershell', ['-NoProfile', '-NonInteractive', '-Command',
      'Expand-Archive -Force -LiteralPath "' + file + '" -DestinationPath "' + stagingDir + '"'],
      { stdio: 'ignore' });
    const exe = findFile(stagingDir, /\.exe$/i);
    if (!exe) throw new Error('no .exe found in the zip');
    return exe;
  }
  // Linux: the AppImage is the app — copy it into staging.
  const dest = path.join(stagingDir, path.basename(file));
  fs.copyFileSync(file, dest);
  fs.chmodSync(dest, 0o755);
  return dest;
}

function findFile(dir, re) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    let stat;
    try { stat = fs.statSync(full); } catch (e) { continue; }
    if (stat.isFile() && re.test(name)) return full;
    if (stat.isDirectory()) { const hit = findFile(full, re); if (hit) return hit; }
  }
  return null;
}

/** Where the running app lives (the install target to swap). */
function installTarget(platform) {
  const p = String(platform || process.platform);
  if (p === 'darwin') {
    // /path/Study Hub.app/Contents/MacOS/Study Hub → the .app bundle
    let dir = path.dirname(process.execPath);
    while (dir && path.dirname(dir) !== dir) {
      if (dir.endsWith('.app')) return dir;
      dir = path.dirname(dir);
    }
    return process.execPath;
  }
  if (p === 'win32') return process.execPath;
  // Linux: prefer APPIMAGE (electron-builder sets it for AppImage runs).
  return process.env.APPIMAGE || process.execPath;
}

function relaunch(target) {
  const p = String(process.platform);
  const cmd = p === 'darwin' ? path.join(target, 'Contents', 'MacOS', path.basename(target, '.app')) : target;
  const child = spawn(cmd, [], { detached: true, stdio: 'ignore' });
  child.unref();
}

// ---- Main (only when run directly) ----

async function main(pendingFile) {
  const resultFile = path.join(path.dirname(pendingFile), 'update-result.json');
  let pending;
  try {
    pending = JSON.parse(fs.readFileSync(pendingFile, 'utf8'));
  } catch (e) {
    writeResult(resultFile, { ok: false, error: 'pending-update missing/corrupt' });
    return;
  }
  try {
    const exited = await waitForExit(pending.oldPid, 60000);
    if (!exited) {
      writeResult(resultFile, { ok: false, error: 'old app did not exit in time' });
      return;
    }
    const target = pending.target;
    const backup = target + '.sh-bak-' + Date.now();
    const res = swapInstall(target, pending.newApp, backup);
    if (!res.ok) {
      writeResult(resultFile, { ok: false, error: res.error, version: pending.version });
      return;
    }
    writeResult(resultFile, { ok: true, version: pending.version });
    relaunch(target);
  } catch (e) {
    writeResult(resultFile, { ok: false, error: String(e && e.message ? e.message : e), version: pending.version });
  }
}

if (require.main === module) {
  main(process.argv[2] || path.join(os.tmpdir(), 'pending-update.json')).catch((e) => {
    try { writeResult(path.join(path.dirname(process.argv[2] || os.tmpdir()), 'update-result.json'), { ok: false, error: String(e) }); } catch (e2) {}
    process.exit(1);
  });
}

module.exports = { swapInstall, writeResult, waitForExit, extractInstaller, findFile, installTarget, relaunch };
