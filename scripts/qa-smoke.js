#!/usr/bin/env node
/**
 * QA smoke test — boots the real app in headless Electron and verifies:
 *   1. The page loads without fatal errors
 *   2. All tabs render (panel exists, visible, non-empty)
 *   3. No unexpected console errors / page exceptions
 *
 * Usage:
 *   node scripts/qa-smoke.js            (from the project root)
 *   npm run test:qa
 *
 * Exits 0 on success, 1 on any failure. Print a JSON report to stdout.
 */
'use strict';

const path = require('path');
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const { LAYOUT_SUBMENU, setWindowAccessor, syncMenuState, layoutTitleSuffix } = require('../electron-menu');

const ROOT = path.join(__dirname, '..');
const APP_HTML = path.join(ROOT, 'index.html');
const SWEEP_TIMEOUT_MS = 120000;
const INIT_SETTLE_MS = 6000;

const report = {
  started: new Date().toISOString(),
  url: 'file://' + APP_HTML,
  console: [],
  tabs: [],
  failures: [],
  ok: true,
};

let finished = false;
function finish(code) {
  if (finished) return;
  finished = true;
  report.ok = report.failures.length === 0;
  report.finished = new Date().toISOString();
  console.log(JSON.stringify(report, null, 2));
  try { app.exit(code); } catch (e) { process.exit(code); }
}

// Hard timeout — never hang CI
setTimeout(() => {
  report.failures.push('TIMEOUT: sweep did not finish within ' + (SWEEP_TIMEOUT_MS / 1000) + 's');
  finish(1);
}, SWEEP_TIMEOUT_MS);

// Ignore expected noise so the report highlights real problems
const EXPECTED_CONSOLE = [
  /Service worker/i,            // local file:// preview has no SW
  /Anonymous sign-in unavailable/, // Supabase config not applied yet
  /leaderboard_entries/i,       // RLS migration not run yet
  /Failed to load resource/i,   // favicon/assets absent in single-file previews
  /Automatic publicPath/i,      // inlined-lib edge cases
];

function isExpectedConsole(text) {
  return EXPECTED_CONSOLE.some((re) => re.test(text));
}

app.disableHardwareAcceleration();

// Chromium's sandbox needs disabling on CI runners (root user, no user
// namespaces). Harmless on dev machines.
if (process.env.CI || process.env.ELECTRON_DISABLE_SANDBOX) {
  app.commandLine.appendSwitch('no-sandbox');
  app.commandLine.appendSwitch('disable-gpu');
}

app.whenReady().then(() => {
  const win = new BrowserWindow({
    show: false,
    width: 1280,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(ROOT, 'electron-preload.js'),
    },
  });
  // Install the real Layout menu so the menu-driven test exercises the
  // same code path desktop users get (electron-menu.js shared module).
  Menu.setApplicationMenu(Menu.buildFromTemplate([LAYOUT_SUBMENU]));
  // Same focused-window routing as the real app, so menu actions land on
  // whichever test window is active (multi-window test relies on this).
  setWindowAccessor(() => BrowserWindow.getFocusedWindow() || win);
  // Renderer → menu sync: same handler the real main process registers, plus
  // the window-title update so the multi-window test can assert titles.
  ipcMain.on('layout-changed', (event, s) => {
    syncMenuState(s);
    const w = BrowserWindow.fromWebContents(event.sender);
    if (w && !w.isDestroyed()) w.setTitle('Study Hub' + layoutTitleSuffix(s));
  });
  // Per-window tab memory: mirror the real main process handlers so the
  // multi-window test can verify tab reporting and boot-time restore.
  const testTabs = new Map();
  ipcMain.on('tab-changed', (event, tab) => { if (typeof tab === 'string') testTabs.set(event.sender.id, tab); });
  ipcMain.handle('get-window-tab', (event) => testTabs.get(event.sender.id) || 'dashboard');
  // Session-memory opt-in: mirror the real handler (menu + per-window flag).
  const testMemory = new Map();
  ipcMain.on('session-memory-changed', (event, enabled) => {
    testMemory.set(event.sender.id, enabled !== false);
    const item = Menu.getApplicationMenu() && Menu.getApplicationMenu().getMenuItemById('session-memory');
    if (item) item.checked = enabled !== false;
  });
  // Version lookup for the in-app update prompt (the real main process
  // returns app.getVersion(); tests use an old version to exercise the path).
  ipcMain.handle('get-app-version', () => '1.0.0');
  // One-click updater: stub the download so tests never touch the network.
  // Records the payload so we can assert the updater flow actually fired.
  const dlCalls = [];
  ipcMain.handle('download-update', async (_event, opts) => { dlCalls.push(opts); return { ok: false, error: 'test stub' }; });

  // Capture console messages (Electron API changed across versions)
  const webContents = win.webContents;
  if (typeof webContents.on === 'function') {
    webContents.on('console-message', (event, level, message) => {
      // Electron >= 32 passes a single event object; older passes (level, message)
      let lvl = level;
      let msg = message;
      if (event && typeof event === 'object' && 'message' in event) {
        lvl = event.level;
        msg = event.message;
      }
      report.console.push({ level: lvl, message: String(msg).slice(0, 300) });
    });
  }

  webContents.on('did-fail-load', (e, code, desc) => {
    report.failures.push('did-fail-load: ' + code + ' ' + desc);
    finish(1);
  });

  webContents.on('render-process-gone', (e, details) => {
    report.failures.push('render-process-gone: ' + JSON.stringify(details));
    finish(1);
  });

  const sweepScript = `
    (() => {
      const out = { tabs: [], exceptions: [] };
      try {
        const loa = document.getElementById('landingOpenApp');
        if (loa) loa.click();
      } catch (e) { out.exceptions.push('landing dismiss: ' + e); }
      const tabIds = [...document.querySelectorAll('.nav-btn[data-tab]')].map(b => b.dataset.tab);
      const all = ['dashboard', ...tabIds.filter(t => t !== 'dashboard')];
      for (const t of all) {
        try {
          if (typeof showTab === 'function') showTab(t);
          const panel = document.getElementById(t);
          const st = panel ? getComputedStyle(panel) : null;
          const hidden = st ? st.display === 'none' || st.visibility === 'hidden' : true;
          const chars = panel ? panel.textContent.trim().length : 0;
          out.tabs.push({ tab: t, panel: !!panel, hidden, chars, ok: !!panel && !hidden && chars > 0 });
        } catch (e) {
          out.exceptions.push('tab ' + t + ': ' + e);
          out.tabs.push({ tab: t, ok: false, error: String(e) });
        }
      }
      out.cssRules = [...document.styleSheets].reduce((n, s) => { try { return n + s.cssRules.length; } catch (e) { return n; } }, 0);
      out.font = getComputedStyle(document.body).fontFamily;
      out.healthFns = typeof runHealthCheck === 'function';
      // Accessibility sweep: no unlabeled controls, no unnamed icon-only
      // buttons, no images without alt text.
      out.a11y = (() => {
        const unlabeled = [], iconOnly = [], noAlt = [];
        document.querySelectorAll('input, select, textarea').forEach(el => {
          if (['hidden', 'submit', 'button', 'reset'].includes(el.type)) return;
          const named = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') ||
            (el.id && document.querySelector('label[for="' + CSS.escape(el.id) + '"]')) ||
            el.closest('label') || el.getAttribute('placeholder');
          if (!named) unlabeled.push((el.id ? '#' + el.id : el.tagName.toLowerCase()));
        });
        document.querySelectorAll('button').forEach(b => {
          const txt = (b.innerText || '').trim();
          if (!txt && !b.getAttribute('aria-label') && !b.getAttribute('title') && b.offsetParent !== null) {
            iconOnly.push((b.className || '').slice(0, 40));
          }
        });
        document.querySelectorAll('img').forEach(im => { if (!im.hasAttribute('alt')) noAlt.push(im.src.split('/').pop()); });
        return { unlabeled: unlabeled.slice(0, 20), iconOnly: iconOnly.slice(0, 20), noAlt: noAlt.slice(0, 10) };
      })();
      return out;
    })()
  `;

  // Keyboard navigation walk: press real Tab keys and verify focus lands on
  // focusable controls with a visible focus ring (and never gets stuck).
  async function runKeyboardWalk() {
    // :focus-visible only matches in a window that is actually shown and
    // focused — headless-hidden windows fall back to the UA default ring.
    win.show();
    win.focus();
    // Hide onboarding / landing overlays so Tab order starts at the app shell,
    // and drop any leftover focus so the first Tab lands on the skip link.
    await webContents.executeJavaScript(`(() => {
      ['setupModal', 'landingOverlay'].forEach(id => { const el = document.getElementById(id); if (el) el.classList.add('hidden'); });
      // Pin the update banner hidden with an inline style too — the async update
      // check may resolve mid-walk and re-show it via classList otherwise.
      const ub = document.getElementById('updateBanner'); if (ub) ub.style.display = 'none';
      if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur();
      return 'overlays hidden';
    })()`).catch(() => {});
    await new Promise(r => setTimeout(r, 250));
    const steps = [];
    const pressTab = () => new Promise(res => {
      webContents.sendInputEvent({ type: 'keyDown', keyCode: 'Tab' });
      webContents.sendInputEvent({ type: 'keyUp', keyCode: 'Tab' });
      setTimeout(res, 35);
    });
    for (let i = 0; i < 32; i++) {
      await pressTab();
      const s = await webContents.executeJavaScript(`(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return { body: true };
        const cs = getComputedStyle(el);
        return {
          body: false,
          tag: el.tagName.toLowerCase(),
          id: el.id ? '#' + el.id : '',
          cls: typeof el.className === 'string' && el.className ? '.' + el.className.split(' ')[0] : '',
          ring: cs.outlineStyle !== 'none' ? (cs.outlineWidth + ' ' + cs.outlineStyle) : 'none'
        };
      })()`);
      steps.push(s);
    }
    const landed = steps.filter(s => !s.body);
    const failures = [];
    if (landed.length === 0) failures.push('Keyboard walk: Tab never moved focus off <body>');
    if (steps[0] && steps[0].cls !== '.skip-link') failures.push('Keyboard walk: first Tab did not land on the skip-to-content link (got ' + (steps[0] && steps[0].cls) + ')');
    const noRing = landed.filter(s => ['button', 'a', 'input', 'select', 'textarea', '[tabindex]'].indexOf(s.tag) >= 0 && s.ring === 'none');
    if (noRing.length > Math.ceil(landed.length / 3)) {
      failures.push('Keyboard walk: ' + noRing.length + '/' + landed.length + ' focused controls had no visible focus ring (e.g. ' + JSON.stringify(noRing[0]) + ')');
    }
    return { steps: steps.length, landed: landed.length, failures };
  }

  // Modal + reverse-traversal checks: focus must move freely inside a modal
  // (no trap), reach the close button, close on Escape, and Shift+Tab must
  // walk backwards without ever sticking on <body>.
  async function runModalAndReverseTest() {
    const failures = [];
    const press = (opts) => new Promise(res => {
      webContents.sendInputEvent(Object.assign({ type: 'keyDown', keyCode: 'Tab' }, opts));
      webContents.sendInputEvent(Object.assign({ type: 'keyUp', keyCode: 'Tab' }, opts));
      setTimeout(res, 35);
    });
    const focusInfo = () => webContents.executeJavaScript(`(() => {
      const el = document.activeElement;
      return {
        tag: el && el.tagName ? el.tagName.toLowerCase() : '',
        id: (el && el.id) || '',
        cls: (el && el.className && typeof el.className === 'string') ? el.className.split(' ')[0] : '',
        allCls: (el && el.className && typeof el.className === 'string') ? el.className : '',
        txt: el && el.textContent ? el.textContent.trim().replace(/\s+/g, ' ').slice(0, 18) : ''
      };
    })()`);
    // Open the goal-walkthrough modal and move focus into it (as a proper modal would).
    const opened = await webContents.executeJavaScript(`(() => {
      try {
        if (typeof state === 'undefined' || typeof generateGoalWalkthrough !== 'function') return 'no-app';
        state.goals.push({ id: '__kbtest', title: 'Keyboard Test Goal', subject: 'Math', deadline: '2099-01-01', hours: 8 });
        generateGoalWalkthrough('__kbtest');
        const close = document.querySelector('.wt-modal .modal-close');
        if (close) close.focus();
        return !!close ? 'opened' : 'no-close';
      } catch (e) { return 'error: ' + e; }
    })()`);
    if (opened !== 'opened') failures.push('Modal test: could not open walkthrough modal (' + opened + ')');
    else {
      // Tab forward through the modal — focus must visit distinct stops.
      const seen = new Set();
      const seq = [];
      let prev = '', stuck = false;
      for (let i = 0; i < 10; i++) {
        await press();
        const f = await focusInfo();
        const key = f.tag + '|' + f.id + '|' + f.cls + '|' + f.txt;
        seq.push(key);
        if (prev && key === prev) stuck = true;
        seen.add(key);
        prev = key;
      }
      report.modalSeq = seq;
      if (seen.size < 3) failures.push('Modal test: focus did not move through the modal (only ' + seen.size + ' distinct stops)');
      if (stuck) failures.push('Modal test: focus got stuck on a single element inside the modal');
      // Shift+Tab backwards must return to the close button.
      let backToClose = false;
      for (let i = 0; i < 12 && !backToClose; i++) {
        await press({ modifiers: ['shift'] });
        const f = await focusInfo();
        if (String(f.allCls || f.cls).indexOf('modal-close') >= 0) backToClose = true;
      }
      if (!backToClose) failures.push('Modal test: Shift+Tab did not return focus to the modal close button');
      // Escape closes the modal.
      webContents.sendInputEvent({ type: 'keyDown', keyCode: 'Escape' });
      webContents.sendInputEvent({ type: 'keyUp', keyCode: 'Escape' });
      await new Promise(r => setTimeout(r, 150));
      const closed = await webContents.executeJavaScript(`!document.querySelector('.wt-modal')`);
      if (!closed) failures.push('Modal test: Escape did not close the modal');
    }
    // Clean up the test goal.
    await webContents.executeJavaScript(`(() => {
      if (typeof state !== 'undefined') { state.goals = state.goals.filter(g => g.id !== '__kbtest'); saveState(); }
      if (typeof renderGoalWalkthroughs === 'function') renderGoalWalkthroughs();
      return 'cleaned';
    })()`).catch(() => {});
    // Reverse traversal across the app: Shift+Tab must keep moving focus.
    let reverseLanded = 0;
    for (let i = 0; i < 6; i++) {
      await press({ modifiers: ['shift'] });
      const f = await focusInfo();
      if (f.tag && f.tag !== 'body') reverseLanded++;
    }
    if (reverseLanded === 0) failures.push('Keyboard walk: Shift+Tab never moved focus off <body>');
    return failures;
  }

  // Multi-window menu test: the app menu is application-global, so a menu
  // click must land on the *focused* window, other windows must stay
  // untouched, and renderer-side layout changes must sync the menu back.
  async function runMultiWindowMenuTest() {
    const failures = [];
    let win2 = null;
    try {
      win2 = new BrowserWindow({
        show: false,
        width: 1200,
        height: 800,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          preload: path.join(ROOT, 'electron-preload.js'),
        },
      });
      const wc2 = win2.webContents;
      if (typeof wc2.on === 'function') {
        wc2.on('console-message', (event, level, message) => {
          let lvl = level, msg = message;
          if (event && typeof event === 'object' && 'message' in event) { lvl = event.level; msg = event.message; }
          if (!isExpectedConsole(String(msg))) report.console.push({ level: lvl, message: '[win2] ' + String(msg).slice(0, 200) });
        });
      }
      await win2.loadFile(APP_HTML);
      await new Promise(r => setTimeout(r, 3000));

      const menu = Menu.getApplicationMenu();
      const roomy = menu.getMenuItemById('density-roomy');
      const comfortable = menu.getMenuItemById('density-comfortable');
      const compact = menu.getMenuItemById('density-compact');
      const power = menu.getMenuItemById('power-mode');
      if (!roomy || !comfortable || !compact || !power) {
        failures.push('Multi-window test: menu items missing');
        return failures;
      }

      // Ensure a known baseline: win1 compact / power off, menu matches.
      await webContents.executeJavaScript(`state.settings.density='compact'; state.settings.powerMode=false; saveState(); applyAppearance(); 'reset'`);
      await new Promise(r => setTimeout(r, 120));

      // Focus win2 and click a menu radio — it must apply to win2 only.
      win2.show();
      win2.focus();
      await new Promise(r => setTimeout(r, 250));
      roomy.click();
      await new Promise(r => setTimeout(r, 250));
      const w2Followed = await wc2.executeJavaScript(`state.settings.density === 'roomy' && document.documentElement.getAttribute('data-density') === 'roomy'`);
      const w1Untouched = await webContents.executeJavaScript(`state.settings.density === 'compact' && document.documentElement.getAttribute('data-density') === 'compact'`);
      if (!w2Followed) failures.push('Multi-window test: menu click did not apply to the focused window');
      if (!w1Untouched) failures.push('Multi-window test: menu click leaked into the background window');
      // Titles must follow each window's own layout so users can tell them apart.
      if (win2.getTitle() !== 'Study Hub — Roomy') failures.push('Multi-window test: win2 title did not follow its layout (got "' + win2.getTitle() + '")');
      if (win.getTitle() !== 'Study Hub — Compact') failures.push('Multi-window test: win1 title changed with win2\'s layout (got "' + win.getTitle() + '")');

      // Renderer-side change in win2 must sync the native menu checkmarks.
      await wc2.executeJavaScript(`state.settings.density='comfortable'; state.settings.powerMode=true; saveState(); applyAppearance(); 'changed'`);
      await new Promise(r => setTimeout(r, 200));
      // In-app update prompt: version compare + banner + one-click updater flow.
      // The test env has the preload, so Update triggers the updater path; the
      // stubbed download-update handler fails fast and the banner must degrade
      // gracefully to a Retry state (no navigation, no crash).
      const verCheck = await webContents.executeJavaScript(`(() => {
        const cmp = [compareVersions('1.1.3','1.1.0'), compareVersions('1.1.0','1.1.0'), compareVersions('1.0.9','1.1.0')];
        localStorage.removeItem('updateDismissed');
        const ubEl = document.getElementById('updateBanner'); if (ubEl) ubEl.style.display = '';
        showUpdateBanner('v1.1.3', '1.1.0');
        const visible = !document.getElementById('updateBanner').classList.contains('hidden');
        const btnLabel = document.getElementById('updateGoBtn').textContent;
        document.getElementById('updateGoBtn').click();
        return JSON.stringify({ cmp, visible, btnLabel });
      })()`);
      const v = JSON.parse(verCheck);
      await new Promise(r => setTimeout(r, 350)); // let the stubbed invoke resolve
      if (JSON.stringify(v.cmp) !== '[1,0,-1]') failures.push('Update prompt: compareVersions wrong (' + verCheck + ')');
      if (!v.visible || v.btnLabel !== 'Update & Install') failures.push('Update prompt: banner did not offer the one-click updater (' + verCheck + ')');
      if (dlCalls.length === 0) failures.push('Update prompt: Update click did not invoke download-update');
      if (dlCalls.length && (!dlCalls[0].release || dlCalls[0].version !== '1.1.3')) failures.push('Update prompt: download-update got a bad payload');
      const dlResult = await webContents.executeJavaScript(`(() => {
        const t = document.getElementById('updateBannerText').textContent;
        const go = document.getElementById('updateGoBtn');
        return JSON.stringify({ text: t.slice(0, 60), retry: go.textContent, disabled: go.disabled });
      })()`);
      const dr = JSON.parse(dlResult);
      if (dr.text.indexOf('Update failed') < 0 || dr.retry !== 'Retry Update' || dr.disabled !== false) {
        failures.push('Update prompt: failed download did not degrade to retry (' + dlResult + ')');
      }
      // Later dismiss still works after a failure.
      const dismissCheck = await webContents.executeJavaScript(`(() => {
        showUpdateBanner('v1.1.3', '1.1.0');
        document.getElementById('updateDismissBtn').click();
        const dismissed = localStorage.getItem('updateDismissed') === 'v1.1.3';
        const reHidden = document.getElementById('updateBanner').classList.contains('hidden');
        return JSON.stringify({ dismissed, reHidden });
      })()`);
      const dchk = JSON.parse(dismissCheck);
      if (!dchk.dismissed || !dchk.reHidden) failures.push('Update prompt: dismiss flow broken (' + dismissCheck + ')');
      await webContents.executeJavaScript(`showTab('dashboard'); 'reset-tab'`);
      const menuSynced = comfortable.checked === true && power.checked === true && roomy.checked === false;
      if (!menuSynced) failures.push('Multi-window test: renderer layout change did not sync the menu (comfortable=' + comfortable.checked + ' power=' + power.checked + ' roomy=' + roomy.checked + ')');
      const w2Synced = await wc2.executeJavaScript(`document.documentElement.getAttribute('data-power') === 'true' && document.documentElement.getAttribute('data-density') === 'comfortable'`);
      if (!w2Synced) failures.push('Multi-window test: renderer-side change did not apply in win2');
      if (win2.getTitle() !== 'Study Hub — Comfortable ⚡') failures.push('Multi-window test: win2 title did not reflect power mode (got "' + win2.getTitle() + '")');
      // Per-window tab memory: switching tabs in one window must not affect
      // the other, and get-window-tab must round-trip what was reported.
      const w1TabBefore = testTabs.get(webContents.id);
      await wc2.executeJavaScript(`showTab('planner'); 'tabbed'`);
      await new Promise(r => setTimeout(r, 150));
      const w2Tab = testTabs.get(wc2.id);
      if (w2Tab !== 'planner') failures.push('Multi-window test: tab-changed did not record win2 tab (got ' + w2Tab + ')');
      if (testTabs.get(webContents.id) !== w1TabBefore) failures.push('Multi-window test: win1 tab changed with win2\'s (was ' + w1TabBefore + ', now ' + testTabs.get(webContents.id) + ')');
      const roundTrip = await wc2.executeJavaScript(`window.electronAPI && window.electronAPI.getWindowTab ? window.electronAPI.getWindowTab().then(t => t) : 'no-api'`);
      if (roundTrip !== 'planner') failures.push('Multi-window test: get-window-tab did not round-trip (got ' + roundTrip + ')');
      // Session-memory opt-in: toggling the setting must report to main and
      // update the native menu checkbox.
      await wc2.executeJavaScript(`state.settings.sessionMemory=false; saveState(); notifySessionMemory(false); 'mem-off'`);
      await new Promise(r => setTimeout(r, 150));
      const memItem = Menu.getApplicationMenu().getMenuItemById('session-memory');
      if (testMemory.get(wc2.id) !== false) failures.push('Multi-window test: session-memory off was not reported to main');
      if (!memItem || memItem.checked !== false) failures.push('Multi-window test: session-memory menu item did not uncheck');
      await wc2.executeJavaScript(`state.settings.sessionMemory=true; saveState(); notifySessionMemory(true); 'mem-on'`);
      await new Promise(r => setTimeout(r, 150));
      if (testMemory.get(wc2.id) !== true || !memItem || memItem.checked !== true) failures.push('Multi-window test: session-memory re-enable did not sync');

      // Clean up: reset win2, close it, hand focus back to win1, re-sync menu.
      await wc2.executeJavaScript(`state.settings.density='compact'; state.settings.powerMode=false; saveState(); applyAppearance(); 'cleaned'`);
      await new Promise(r => setTimeout(r, 150));
      win2.close();
      win2 = null;
      win.show();
      win.focus();
      await new Promise(r => setTimeout(r, 200));
      await webContents.executeJavaScript(`state.settings.density='compact'; state.settings.powerMode=false; saveState(); applyAppearance(); 'reset2'`);
      await new Promise(r => setTimeout(r, 150));
      const finalMenu = menu.getMenuItemById('density-compact').checked === true && menu.getMenuItemById('power-mode').checked === false;
      if (!finalMenu) failures.push('Multi-window test: menu left out of sync after cleanup');
    } catch (e) {
      failures.push('Multi-window test threw: ' + e);
    } finally {
      if (win2 && !win2.isDestroyed()) { try { win2.close(); } catch (e) {} }
    }
    return failures;
  }

  // Menu-driven layout test: drive the real Electron Layout menu (density
  // radios + power-mode checkbox) and verify the renderer state follows.
  async function runMenuLayoutTest() {
    const failures = [];
    try {
      const menu = Menu.getApplicationMenu();
      const power = menu && menu.getMenuItemById('power-mode');
      const roomy = menu && menu.getMenuItemById('density-roomy');
      const compact = menu && menu.getMenuItemById('density-compact');
      if (!power || !roomy || !compact) {
        failures.push('Menu test: Layout menu items missing from the application menu');
        return failures;
      }
      // Power mode on via the menu checkbox.
      if (!power.checked) power.click();
      await new Promise(r => setTimeout(r, 150));
      const powerOn = await webContents.executeJavaScript(`state.settings.powerMode === true && document.documentElement.getAttribute('data-power') === 'true'`);
      if (!powerOn) failures.push('Menu test: power-mode click did not apply in the renderer');
      // Density roomy via the menu radio.
      roomy.click();
      await new Promise(r => setTimeout(r, 150));
      const densityOk = await webContents.executeJavaScript(`state.settings.density === 'roomy' && document.documentElement.getAttribute('data-density') === 'roomy'`);
      if (!densityOk) failures.push('Menu test: density radio did not apply in the renderer');
      // Swap back to compact, then power off — leave a clean state.
      compact.click();
      await new Promise(r => setTimeout(r, 120));
      if (power.checked) power.click();
      await new Promise(r => setTimeout(r, 120));
      const clean = await webContents.executeJavaScript(`state.settings.density === 'compact' && state.settings.powerMode === false`);
      if (!clean) failures.push('Menu test: cleanup click did not restore compact/non-power state');
    } catch (e) {
      failures.push('Menu test threw: ' + e);
    }
    return failures;
  }

  win.loadFile(APP_HTML).then(() => {
    setTimeout(() => {
      webContents.executeJavaScript(sweepScript)
        .then(async (result) => {
          report.tabs = result.tabs || [];
          report.cssRules = result.cssRules;
          report.font = result.font;
          report.a11y = result.a11y || {};
          for (const tab of report.tabs) {
            if (!tab.ok) report.failures.push('Tab broken: ' + JSON.stringify(tab));
          }
          if (report.tabs.length === 0) report.failures.push('No tabs found — did the app boot?');
          if (!result.healthFns) report.failures.push('runHealthCheck not defined — app JS may not have loaded');
          if ((report.cssRules || 0) < 100) report.failures.push('Suspiciously few CSS rules: ' + report.cssRules);
          // A11y guard: unlabeled controls, unnamed icon-only buttons, images without alt.
          if ((result.a11y.unlabeled || []).length > 0) {
            report.failures.push('A11y: ' + result.a11y.unlabeled.length + ' unlabeled controls: ' + result.a11y.unlabeled.slice(0, 5).join(', '));
          }
          if ((result.a11y.iconOnly || []).length > 0) {
            report.failures.push('A11y: ' + result.a11y.iconOnly.length + ' icon-only buttons without a name: ' + result.a11y.iconOnly.slice(0, 5).join(', '));
          }
          if ((result.a11y.noAlt || []).length > 0) {
            report.failures.push('A11y: images without alt: ' + result.a11y.noAlt.slice(0, 5).join(', '));
          }
          // Keyboard navigation walk.
          const kb = await runKeyboardWalk();
          report.keyboard = { steps: kb.steps, landed: kb.landed };
          kb.failures.forEach(f => report.failures.push(f));
          // Modal + reverse-traversal checks.
          const modalFailures = await runModalAndReverseTest();
          report.modalTest = { failures: modalFailures };
          modalFailures.forEach(f => report.failures.push(f));
          // Menu-driven layout check.
          const menuFailures = await runMenuLayoutTest();
          report.menuTest = { failures: menuFailures };
          menuFailures.forEach(f => report.failures.push(f));
          // Multi-window menu + sync check.
          const multiFailures = await runMultiWindowMenuTest();
          report.multiWindowTest = { failures: multiFailures };
          multiFailures.forEach(f => report.failures.push(f));
          for (const c of report.console) {
            if (c.level === 'error' || c.level === 3) {
              if (!isExpectedConsole(c.message)) {
                report.failures.push('Console error: ' + c.message);
              }
            }
          }
          finish(report.failures.length === 0 ? 0 : 1);
        })
        .catch((e) => {
          report.failures.push('Sweep script failed: ' + e);
          finish(1);
        });
    }, INIT_SETTLE_MS);
  }).catch((e) => {
    report.failures.push('loadFile failed: ' + e);
    finish(1);
  });
});
