#!/usr/bin/env node
/**
 * Static a11y guard — no browser needed. Fails the build when tracked
 * markup regresses accessibility basics:
 *   1. Every static <input>/<select>/<textarea> has an id (so the runtime
 *      auto-labeler and real <label for> can name it).
 *   2. ensureInputLabels() is defined and wired into init().
 *   3. No static <img> is missing alt text.
 *
 * Usage:
 *   node scripts/a11y-static.js
 *
 * Exits 0 when clean, 1 on any violation. (The runtime sweep in
 * qa-smoke.js additionally checks live DOM labels, icon-only buttons, and
 * the keyboard focus ring.)
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');

const fails = [];

// 1. Form controls must carry an id (needed for label association).
const controls = html.match(/<(input|select|textarea)\b[^>]*>/g) || [];
const noId = controls.filter(m => !/\bid=/.test(m));
if (noId.length) {
  fails.push(noId.length + ' form controls without id: ' + noId.slice(0, 3).join(' | '));
}

// 2. The runtime auto-labeler must exist and run at startup.
if (!/function ensureInputLabels/.test(js)) fails.push('ensureInputLabels is not defined in app.js');
if (!/safeCall\(ensureInputLabels\)/.test(js)) fails.push('ensureInputLabels is not wired into init()');

// 3. Images need alt text.
const imgs = html.match(/<img\b[^>]*>/g) || [];
const noAlt = imgs.filter(m => !/\balt\s*=/.test(m));
if (noAlt.length) {
  fails.push(noAlt.length + ' images without alt: ' + noAlt.slice(0, 3).map(m => m.slice(0, 50)).join(' | '));
}

// 4. The topbar quick-layout controls must be accessible (labelled select, pressed-state button).
if (!/id="densityQuickSelect"[^>]*aria-label/.test(html)) fails.push('densityQuickSelect is missing an aria-label');
if (!/id="powerModeQuickBtn"[^>]*aria-pressed/.test(html)) fails.push('powerModeQuickBtn is missing aria-pressed');

// 5. Skip-to-content link must exist, be first in the body, and target #appMain.
const bodyStart = html.indexOf('<body');
const afterBody = html.slice(bodyStart, bodyStart + 600);
if (!/class="skip-link"[^>]*href="#appMain"/.test(html)) fails.push('skip-link is missing or does not target #appMain');
if (!afterBody.includes('skip-link')) fails.push('skip-link is not the first element inside <body>');
if (!/id="appMain"/.test(html)) fails.push('main content has no id="appMain" anchor');

// 6. Modals must announce dialog semantics (role, aria-modal, labelledby).
if (!/setAttribute\('role', 'dialog'\)/.test(js)) fails.push('app.js modal helper does not set role="dialog"');
if (!/aria-modal/.test(js)) fails.push('app.js modal helper does not set aria-modal');
if (!/aria-labelledby/.test(js)) fails.push('app.js modal helper does not wire aria-labelledby');

// 7. The Electron menu must expose the layout switch (density + power mode),
//    sync checkmarks from the renderer, and support multiple windows.
const menuJs = fs.readFileSync(path.join(ROOT, 'electron-menu.js'), 'utf8');
const mainJs = fs.readFileSync(path.join(ROOT, 'electron-main.js'), 'utf8');
const preloadJs = fs.readFileSync(path.join(ROOT, 'electron-preload.js'), 'utf8');
if (!/label: 'Layout'/.test(menuJs)) fails.push('electron-menu.js has no Layout menu');
if (!/Compact power mode/.test(menuJs)) fails.push('electron-menu.js Layout menu has no power-mode item');
if (!/function applyLayout/.test(menuJs)) fails.push('electron-menu.js has no applyLayout handler');
if (!/function syncMenuState/.test(menuJs)) fails.push('electron-menu.js has no syncMenuState helper');
if (!/layoutTitleSuffix/.test(menuJs)) fails.push('electron-menu.js has no layoutTitleSuffix helper');
if (!/LAYOUT_SUBMENU/.test(mainJs)) fails.push('electron-main.js does not mount LAYOUT_SUBMENU');
if (!/layout-changed/.test(mainJs)) fails.push('electron-main.js has no layout-changed IPC handler');
if (!/New Window/.test(mainJs)) fails.push('electron-main.js Window menu has no New Window item');
if (!/notifyLayout/.test(preloadJs)) fails.push('electron-preload.js does not expose notifyLayout');
if (!/syncNativeMenu/.test(js)) fails.push('app.js has no syncNativeMenu renderer hook');

// 8. Per-window tab memory must be wired end to end (renderer → preload → main).
if (!/notifyTab/.test(preloadJs) || !/getWindowTab/.test(preloadJs)) fails.push('electron-preload.js is missing notifyTab/getWindowTab');
if (!/tab-changed/.test(mainJs) || !/get-window-tab/.test(mainJs)) fails.push('electron-main.js is missing the tab IPC handlers');
if (!/Restore Window Arrangement/.test(mainJs)) fails.push('electron-main.js Window menu has no Restore Window Arrangement item');
if (!/restoreInitialTab/.test(js)) fails.push('app.js has no restoreInitialTab boot hook');

// 10. Session-memory opt-in must be wired end to end (setting, menu, IPC).
if (!/session-memory/.test(menuJs)) fails.push('electron-menu.js Layout menu has no session-memory item');
if (!/session-memory-changed/.test(mainJs)) fails.push('electron-main.js has no session-memory-changed IPC handler');
if (!/notifySessionMemory/.test(preloadJs)) fails.push('electron-preload.js does not expose notifySessionMemory');
if (!/notifySessionMemory/.test(js)) fails.push('app.js has no notifySessionMemory helper');
if (!/id="sessionMemoryToggle"/.test(html)) fails.push('Settings has no sessionMemoryToggle checkbox');

// 11. The Downloads tab must have the live-release panel wired up.
if (!/id="liveReleaseBox"/.test(html)) fails.push('Downloads tab has no liveReleaseBox container');
if (!/loadLiveDownloads/.test(js) || !/DL_RELEASE_URL/.test(js)) fails.push('app.js is missing the live downloads loader');
if (!/dl-copy/.test(js)) fails.push('app.js is missing the checksum copy button');

// 12. In-app update prompt + PWA integrity checksums must be wired up.
if (!/id="updateBanner"/.test(html) || !/id="updateGoBtn"/.test(html)) fails.push('index.html is missing the update banner');
if (!/checkForUpdates/.test(js) || !/showUpdateBanner/.test(js) || !/compareVersions/.test(js)) fails.push('app.js is missing the update-prompt helpers');
if (!/id="pwaChecksumList"/.test(html)) fails.push('Downloads tab has no pwaChecksumList container');
if (!/loadPwaChecksums/.test(js) || !/PWA_INTEGRITY_FILES/.test(js)) fails.push('app.js is missing the PWA checksum loader');

// 13. One-click updater must be wired end to end (renderer → preload → main),
//    with periodic polling and About-dialog self-checksums.
const updaterJs = fs.readFileSync(path.join(ROOT, 'electron-updater-core.js'), 'utf8');
if (!/runUpdaterFlow/.test(js)) fails.push('app.js has no runUpdaterFlow updater');
if (!/UPDATE_POLL_MS/.test(js)) fails.push('app.js has no periodic update polling');
if (!/download-update/.test(mainJs)) fails.push('electron-main.js has no download-update IPC handler');
if (!/get-app-fingerprint/.test(mainJs)) fails.push('electron-main.js has no get-app-fingerprint IPC');
if (!/downloadUpdate/.test(preloadJs) || !/onUpdateProgress/.test(preloadJs) || !/getAppFingerprint/.test(preloadJs)) fails.push('electron-preload.js is missing updater APIs');
if (!/electron-updater-core/.test(mainJs)) fails.push('electron-main.js does not use the updater core module');
if (!/verifySha256/.test(updaterJs) || !/pickInstallerAsset/.test(updaterJs)) fails.push('electron-updater-core.js is missing its helpers');

// 14. Automatic apply + verify-install must be wired end to end.
const applyJs = fs.readFileSync(path.join(ROOT, 'scripts/apply-update.js'), 'utf8');
if (!/apply-update/.test(mainJs)) fails.push('electron-main.js has no apply-update IPC handler');
if (!/verify-install/.test(mainJs)) fails.push('electron-main.js has no verify-install IPC handler');
if (!/scripts[\\/]apply-update/.test(mainJs)) fails.push('electron-main.js does not use the apply-update helper');
if (!/applyUpdate/.test(preloadJs) || !/onUpdateResult/.test(preloadJs) || !/verifyInstall/.test(preloadJs)) fails.push('electron-preload.js is missing auto-update APIs');
if (!/applyAutomaticUpdate/.test(js) || !/setupVerifyInstall/.test(js) || !/setupUpdateResultToast/.test(js)) fails.push('app.js is missing the auto-apply/verify/report helpers');
if (!/id="verifyInstallBtn"/.test(html) || !/id="verifyInstallResult"/.test(html)) fails.push('Settings has no verify-install button/result');
if (!/swapInstall/.test(applyJs)) fails.push('scripts/apply-update.js is missing the swapInstall helper');
if (!/id="runHealthCheckBtn"/.test(html) || !/id="healthCheckResults"/.test(html)) fails.push('Settings is missing the system health check card');
if (!/id="examEstimator"/.test(html) || !/id="examEstimatePreview"/.test(html)) fails.push('Exam grade estimator cards missing from Analytics/Dashboard');
if (!/computeExamEstimate/.test(js) || !/renderExamEstimator/.test(js) || !/renderExamEstimatePreview/.test(js)) fails.push('app.js is missing the exam grade estimator model/renderers');
if (!/id="predictionAccuracy"/.test(html) || !/id="predictionAccuracyCount"/.test(html)) fails.push('Estimator vs Reality card missing from Analytics');
if (!/recordEstimatorPrediction/.test(js) || !/renderPredictionAccuracy/.test(js) || !/computePredictionStats/.test(js)) fails.push('app.js is missing the prediction tracker wiring');
if (!/autoEnqueueAtRisk/.test(js) || !/computeAtRiskAdditions/.test(js)) fails.push('app.js is missing the at-risk auto-recovery wiring');
if (!/estimateCalibration/.test(js)) fails.push('app.js is missing the self-calibration helper');

// 15. Command palette + undo-able deletes + topic knowledge base.
if (!/openCommandPalette/.test(js) || !/cmdPalette/.test(js) || !/paletteBtn/.test(js)) fails.push('app.js is missing the command palette (open/palette/dialog)');
if (!/toastWithUndo/.test(js) || !/__undoPending/.test(js) || !/attachUndoButton/.test(js)) fails.push('app.js is missing the undo-able toast helpers');
if (!/TOPIC_KB/.test(js) || !/kbMindMap/.test(js)) fails.push('app.js is missing the offline topic knowledge base');
if (!/id="paletteBtn"/.test(html)) fails.push('Topbar has no Search / command-palette button');

// 9. Window-position memory must be wired into the main process and be
//    unit-tested (electron-window-state.js is loaded by npm test).
const winStateJs = fs.readFileSync(path.join(ROOT, 'electron-window-state.js'), 'utf8');
if (!/electron-window-state/.test(mainJs)) fails.push('electron-main.js does not use the window-state module');
if (!/window-state\.json/.test(mainJs)) fails.push('electron-main.js does not persist a window-state.json');
if (!/sanitizeBounds/.test(winStateJs)) fails.push('electron-window-state.js has no sanitizeBounds helper');
if (!/recordWindow/.test(winStateJs)) fails.push('electron-window-state.js has no recordWindow helper');

if (fails.length) {
  console.error('a11y static guard FAILED:\n - ' + fails.join('\n - '));
  process.exit(1);
}
console.log('a11y static guard passed (' + controls.length + ' static controls, ' + imgs.length + ' images, skip link + electron menu ok)');
