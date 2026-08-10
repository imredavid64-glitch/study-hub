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
const { app, BrowserWindow } = require('electron');

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
    webPreferences: { nodeIntegration: false, contextIsolation: true },
  });

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
      return out;
    })()
  `;

  win.loadFile(APP_HTML).then(() => {
    setTimeout(() => {
      webContents.executeJavaScript(sweepScript)
        .then((result) => {
          report.tabs = result.tabs || [];
          report.cssRules = result.cssRules;
          report.font = result.font;
          for (const tab of report.tabs) {
            if (!tab.ok) report.failures.push('Tab broken: ' + JSON.stringify(tab));
          }
          if (report.tabs.length === 0) report.failures.push('No tabs found — did the app boot?');
          if (!result.healthFns) report.failures.push('runHealthCheck not defined — app JS may not have loaded');
          if ((report.cssRules || 0) < 100) report.failures.push('Suspiciously few CSS rules: ' + report.cssRules);
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
