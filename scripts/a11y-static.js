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
if (!/LAYOUT_SUBMENU/.test(mainJs)) fails.push('electron-main.js does not mount LAYOUT_SUBMENU');
if (!/layout-changed/.test(mainJs)) fails.push('electron-main.js has no layout-changed IPC handler');
if (!/New Window/.test(mainJs)) fails.push('electron-main.js Window menu has no New Window item');
if (!/notifyLayout/.test(preloadJs)) fails.push('electron-preload.js does not expose notifyLayout');
if (!/syncNativeMenu/.test(js)) fails.push('app.js has no syncNativeMenu renderer hook');

if (fails.length) {
  console.error('a11y static guard FAILED:\n - ' + fails.join('\n - '));
  process.exit(1);
}
console.log('a11y static guard passed (' + controls.length + ' static controls, ' + imgs.length + ' images, skip link + electron menu ok)');
