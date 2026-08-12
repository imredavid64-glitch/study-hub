/**
 * Updater core — pure helpers shared by the Electron main process and the
 * unit tests (scripts/updater-test.js, run by `npm test`). No Electron
 * dependency: everything here works in plain Node.
 */
'use strict';

const crypto = require('crypto');

/** sha256 hex digest of a Buffer (or string). */
function sha256Hex(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

/**
 * Verify a downloaded buffer against an expected sha256 (accepts the
 * "sha256:…" prefix GitHub's release API uses). Returns false for missing
 * or malformed expectations — never throws.
 */
function verifySha256(buffer, expected) {
  try {
    const want = String(expected || '').replace(/^sha256:/i, '').trim().toLowerCase();
    if (!/^[0-9a-f]{64}$/.test(want)) return false;
    return sha256Hex(buffer) === want;
  } catch (e) {
    return false;
  }
}

/**
 * Pick the installer asset for the current platform from a release payload.
 * Prefers the primary format (mac dmg, Windows zip, Linux AppImage) and
 * falls back to the secondary one (mac zip, deb). Returns null if none match.
 */
function pickInstallerAsset(release, platform) {
  const assets = (release && Array.isArray(release.assets)) ? release.assets : [];
  const os = String(platform || '').toLowerCase();
  const preferred = os.includes('darwin') || os.includes('mac')
    ? ['mac.dmg', 'mac.zip']
    : os.includes('win')
      ? ['windows.zip', '-win.zip']
      : ['appimage', '.deb'];
  for (const frag of preferred) {
    const hit = assets.find(a => a && a.name && a.browser_download_url && a.name.toLowerCase().includes(frag));
    if (hit) return hit;
  }
  return null;
}

/** Human progress line, e.g. "128 MB of 310 MB (41%)". */
function formatProgress(received, total) {
  const mb = (n) => (n / 1024 / 1024).toFixed(0) + ' MB';
  if (!total) return mb(received) + ' downloaded';
  return mb(received) + ' of ' + mb(total) + ' (' + Math.round((received / total) * 100) + '%)';
}

module.exports = { sha256Hex, verifySha256, pickInstallerAsset, formatProgress };
