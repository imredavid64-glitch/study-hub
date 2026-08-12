const { app, BrowserWindow, Menu, shell, dialog, ipcMain, nativeTheme, screen, net } = require('electron');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { LAYOUT_SUBMENU, setWindowAccessor, syncMenuState, layoutTitleSuffix } = require('./electron-menu');
const { defaultBounds, sanitizeBounds, loadSessionState, loadWindowState, saveWindowState, recordWindow } = require('./electron-window-state');
const { sha256Hex, verifySha256, pickInstallerAsset, formatProgress } = require('./electron-updater-core');
const { extractInstaller, installTarget } = require('./scripts/apply-update');

const LIVE_BUILD_URL = 'https://study-hub-plum-omega.vercel.app'; // source of truth for verify-install

let mainWindow;
const windows = new Set();

// ---- Window-position memory ----
let savedWindowQueue = null;         // lazy: loaded on first window creation
let sessionMemoryEnabled = true;     // opt-in flag from window-state.json
let cascadeStep = 0;                 // offsets for windows opened when no saved slot remains
let windowCounter = 0;               // unique id per window, so titles/menu apply per window

// Load the saved session (memory flag + window queue) once, lazily.
function ensureSessionLoaded() {
  if (savedWindowQueue === null) {
    const state = loadSessionState(windowStateFile());
    savedWindowQueue = state.windows;
    sessionMemoryEnabled = state.memory !== false;
  }
}

function windowStateFile() {
  return path.join(app.getPath('userData'), 'window-state.json');
}

// Pick the display that contains the saved position (fallback: primary) and
// hand its work area to sanitizeBounds so off-screen restores get re-centered.
function resolveBounds(b) {
  const hasPos = b && Number.isFinite(parseInt(b.x, 10)) && Number.isFinite(parseInt(b.y, 10));
  let disp = screen.getPrimaryDisplay();
  if (hasPos) {
    const x = parseInt(b.x, 10);
    const y = parseInt(b.y, 10);
    const hit = screen.getAllDisplays().find(d =>
      d.workArea.x <= x && x < d.workArea.x + d.workArea.width &&
      d.workArea.y <= y && y < d.workArea.y + d.workArea.height);
    if (hit) disp = hit;
  }
  return sanitizeBounds(b, disp.workArea);
}

function restoreBoundsForWindow() {
  ensureSessionLoaded();
  const saved = savedWindowQueue.shift();
  if (saved) return resolveBounds(saved);
  // No saved slot: cascade a default-size window from the primary display's center.
  const d = resolveBounds(defaultBounds());
  const offset = cascadeStep * 28;
  cascadeStep++;
  return Object.assign({}, d, {
    x: Number.isFinite(d.x) ? d.x + offset : undefined,
    y: Number.isFinite(d.y) ? d.y + offset : undefined,
    maximized: false,
  });
}

// Reopen the windows from the last session's saved arrangement (up to 6), one
// per remaining saved slot. New windows created here each consume a slot, so
// the arrangement is reproduced and then re-saved as it closes.
function restoreArrangement() {
  ensureSessionLoaded();
  if (!sessionMemoryEnabled) return; // session memory is opted out
  let created = 0;
  while (windows.size < 6 && savedWindowQueue.length > 0 && created < 8) {
    createWindow();
    created++;
  }
}

// Apply a layout state to a window's title so multiple windows are
// distinguishable at a glance ("Study Hub — Roomy ⚡").
function applyLayoutTitle(win, s) {
  if (!win || win.isDestroyed()) return;
  win.setTitle('Study Hub' + layoutTitleSuffix(s));
}

function createWindow() {
  ensureSessionLoaded();
  // With session memory opted out, always open fresh default windows.
  const bounds = sessionMemoryEnabled ? restoreBoundsForWindow() : resolveBounds(defaultBounds());
  const win = new BrowserWindow({
    width: bounds.width,
    height: bounds.height,
    x: bounds.x,
    y: bounds.y,
    minWidth: 900,
    minHeight: 600,
    title: 'Study Hub',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    backgroundColor: '#1a1a2e',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    trafficLightPosition: { x: 16, y: 16 },
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'electron-preload.js')
    }
  });
  win.__studyHubId = ++windowCounter;
  // Restore the tab this window had open when it was last closed.
  win.__studyHubTab = sessionMemoryEnabled && typeof bounds.tab === 'string' ? bounds.tab : 'dashboard';
  win.__sessionMemory = sessionMemoryEnabled;
  windows.add(win);
  if (!mainWindow || mainWindow.isDestroyed()) mainWindow = win;
  if (bounds.maximized) win.maximize();

  win.loadFile('index.html').then(() => reportUpdateResult(win)).catch(() => {});
  // Remember this window's position/size for the next launch.
  win.on('close', () => {
    if (win.__sessionMemory === false) return; // session memory opted out — leave state untouched
    try {
      const b = Object.assign(win.getBounds(), {
        maximized: win.isMaximized(),
        tab: win.__studyHubTab || 'dashboard',
      });
      ensureSessionLoaded();
      savedWindowQueue = recordWindow(savedWindowQueue || [], b);
      saveWindowState(windowStateFile(), savedWindowQueue, sessionMemoryEnabled);
    } catch (e) { /* bounds may be unavailable during teardown */ }
  });
  win.on('closed', () => {
    windows.delete(win);
    if (mainWindow === win) mainWindow = null;
  });

  const isMac = process.platform === 'darwin';
  const template = [
    {
      label: 'Study Hub',
      submenu: [
        { label: 'About Study Hub', click: () => showAbout() },
        { type: 'separator' },
        ...(isMac ? [{ role: 'hide' }, { role: 'hideOthers' }, { role: 'unhide' }, { type: 'separator' }] : []),
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' }, { role: 'redo' }, { type: 'separator' },
        { role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' }, { role: 'forceReload' }, { role: 'toggleDevTools' },
        { type: 'separator' }, { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' },
        { type: 'separator' }, { role: 'togglefullscreen' }
      ]
    },
    LAYOUT_SUBMENU,
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' }, { role: 'zoom' },
        { label: 'New Window', accelerator: 'CmdOrCtrl+Shift+N', click: () => createWindow() },
        { label: 'Restore Window Arrangement', accelerator: 'CmdOrCtrl+Shift+R', click: () => restoreArrangement() },
        { type: 'separator' },
        ...(isMac ? [{ type: 'separator' }, { role: 'front' }] : [{ role: 'close' }])
      ]
    },
    {
      label: 'Help',
      submenu: [
        { label: 'GitHub Repo', click: () => shell.openExternal('https://github.com/imredavid64-glitch/study-hub') },
        { label: 'Report Issue', click: () => shell.openExternal('https://github.com/imredavid64-glitch/study-hub/issues') }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// sha256 of a file inside the app bundle (Electron's fs reads through asar
// transparently, so the packaged app.js/index.html are readable here).
function appFileSha256(rel) {
  try {
    return sha256Hex(fs.readFileSync(path.join(__dirname, rel)));
  } catch (e) {
    return 'unavailable';
  }
}

function showAbout() {
  const appJs = appFileSha256('app.js');
  const indexHtml = appFileSha256('index.html');
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'About Study Hub',
    message: 'Study Hub v' + app.getVersion(),
    detail: 'Plan smarter. Practice deeper. Improve daily.\n\nBuilt with Electron + Web Technologies.\nGitHub: https://github.com/imredavid64-glitch/study-hub\n\nBuild fingerprints (sha256):\napp.js:    ' + appJs + '\nindex.html: ' + indexHtml + '\n\nCompare these against the Web app (PWA) integrity panel on the Downloads tab to verify this build.',
    buttons: ['OK']
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });

// Navigation hardening: external links open in the system browser instead of
// navigating the app window, and the window can never leave the local app.
app.on('web-contents-created', (_event, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  contents.on('will-navigate', (event, url) => {
    if (!url.startsWith('file:')) event.preventDefault();
  });
});

ipcMain.handle('get-app-version', () => app.getVersion());
ipcMain.handle('get-app-path', () => app.getAppPath());
// Self-checksum for the About dialog / Downloads integrity panel.
ipcMain.handle('get-app-fingerprint', () => ({ appJs: appFileSha256('app.js'), indexHtml: appFileSha256('index.html') }));

// ---- One-click updater ----
let activeDownload = null;

// Download a URL to disk with progress (Chromium's net module follows the
// GitHub release redirects automatically).
function downloadTo(url, target, onProgress) {
  return new Promise((resolve, reject) => {
    const req = net.request(url);
    req.on('response', (res) => {
      if (res.statusCode >= 400) {
        reject(new Error('HTTP ' + res.statusCode));
        return;
      }
      const total = parseInt(res.headers['content-length'] || '0', 10) || 0;
      const ws = fs.createWriteStream(target);
      let received = 0;
      res.on('data', (chunk) => {
        received += chunk.length;
        ws.write(chunk);
        if (onProgress) onProgress(received, total);
      });
      res.on('end', () => ws.end(() => resolve({ target, received, total })));
      res.on('error', (e) => { ws.destroy(); try { fs.unlinkSync(target); } catch (e2) {} reject(e); });
    });
    req.on('error', (e) => { try { fs.unlinkSync(target); } catch (e2) {} reject(e); });
    req.end();
  });
}

// Verify + open the downloaded installer for the current platform. The file is
// only ever opened after its sha256 matches the release digest, and nothing is
// executed directly (macOS mounts the dmg, Windows reveals the zip, Linux
// chmods + opens the AppImage for the user to run).
function openInstallerForPlatform(target) {
  if (process.platform === 'darwin') return shell.openPath(target);
  if (process.platform === 'win32') return shell.showItemInFolder(target);
  try { fs.chmodSync(target, 0o755); } catch (e) {}
  return shell.openPath(target);
}

// sha256 of a remote URL (used to compare the running install with the live
// build). Chromium's net module follows redirects and ignores CORS.
function fetchSha256(url) {
  return new Promise((resolve, reject) => {
    const req = net.request(url);
    const chunks = [];
    const timer = setTimeout(() => { try { req.abort(); } catch (e) {} reject(new Error('timeout')); }, 15000);
    req.on('response', (res) => {
      if (res.statusCode >= 400) { clearTimeout(timer); reject(new Error('HTTP ' + res.statusCode)); return; }
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => { clearTimeout(timer); resolve(sha256Hex(Buffer.concat(chunks))); });
      res.on('error', (e) => { clearTimeout(timer); reject(e); });
    });
    req.on('error', (e) => { clearTimeout(timer); reject(e); });
    req.end();
  });
}

// Verify-install: compare the packaged build's core files against the live
// deployment so users can confirm their install is the exact current build.
ipcMain.handle('verify-install', async () => {
  const local = { appJs: appFileSha256('app.js'), indexHtml: appFileSha256('index.html') };
  try {
    const remote = { appJs: await fetchSha256(LIVE_BUILD_URL + '/app.js'), indexHtml: await fetchSha256(LIVE_BUILD_URL + '/index.html') };
    return { ok: true, local, remote, matches: local.appJs === remote.appJs && local.indexHtml === remote.indexHtml };
  } catch (e) {
    return { ok: false, local, remote: null, error: 'Could not reach the live build to compare — check your connection' };
  }
});

// Fully automatic update: after download+verify, extract the installer to a
// staging dir and — if the install location is writable — hand off to the
// detached applier, which swaps the build and relaunches after this app quits.
// Otherwise it falls back to opening the installer for a manual install.
ipcMain.handle('apply-update', async (event, opts) => {
  if (!opts || !opts.newApp || !opts.target) return { ok: false, error: 'Missing update payload' };
  const win = BrowserWindow.fromWebContents(event.sender);
  const userData = app.getPath('userData');
  const pendingFile = path.join(userData, 'pending-update.json');
  try {
    // Is the install location writable? (/Applications usually is not)
    fs.accessSync(path.dirname(opts.target), fs.constants.W_OK);
  } catch (e) {
    const opened = await openInstallerForPlatform(opts.installerFile || opts.newApp);
    return { ok: false, fallback: true, opened: !opened, path: opts.installerFile };
  }
  try {
    fs.writeFileSync(pendingFile, JSON.stringify({
      newApp: opts.newApp,
      target: opts.target,
      oldPid: process.pid,
      version: opts.version || '',
      platform: process.platform,
    }));
  } catch (e) {
    return { ok: false, error: 'Could not stage the update (' + e.message + ')' };
  }
  const helper = path.join(__dirname, 'scripts', 'apply-update.js');
  const child = spawn(process.execPath, [helper, pendingFile], { detached: true, stdio: 'ignore' });
  child.unref();
  if (win && !win.isDestroyed()) win.webContents.send('update-download-progress', { received: 1, total: 1, text: 'Applying update…' });
  // Give the renderer a moment to paint the restart notice, then quit.
  setTimeout(() => { try { app.quit(); } catch (e) {} }, 800);
  return { ok: true, restarting: true, version: opts.version };
});

// Report the previous run's update result to the renderer once, then clear it.
function reportUpdateResult(win) {
  try {
    const resultFile = path.join(app.getPath('userData'), 'update-result.json');
    if (!fs.existsSync(resultFile)) return;
    const result = JSON.parse(fs.readFileSync(resultFile, 'utf8'));
    fs.unlinkSync(resultFile);
    if (win && !win.isDestroyed()) {
      setTimeout(() => win.webContents.send('update-result', result), 3000);
    }
  } catch (e) { /* nothing to report */ }
}

ipcMain.handle('download-update', async (event, opts) => {
  if (!opts || !opts.release) return { ok: false, error: 'No release payload' };
  if (activeDownload) return { ok: false, error: 'A download is already in progress' };
  // Pick the installer for THIS platform and refuse to proceed without one.
  const asset = pickInstallerAsset(opts.release, process.platform);
  if (!asset) return { ok: false, error: 'No installer published for this platform yet' };
  const win = BrowserWindow.fromWebContents(event.sender);
  const progress = (received, total) => {
    if (win && !win.isDestroyed()) {
      win.webContents.send('update-download-progress', { received, total, text: formatProgress(received, total) });
    }
  };
  activeDownload = true;
  const ext = process.platform === 'darwin' ? 'dmg' : process.platform === 'win32' ? 'zip' : 'AppImage';
  const target = path.join(app.getPath('downloads'), 'Study-Hub-' + (opts.version || 'update') + '.' + ext);
  try {
    await downloadTo(asset.browser_download_url, target, progress);
    const buf = fs.readFileSync(target);
    if (!verifySha256(buf, asset.digest)) {
      try { fs.unlinkSync(target); } catch (e) {}
      return { ok: false, error: 'Checksum mismatch — download discarded for safety' };
    }
    // Extract the verified installer into a staging dir for the auto-applier.
    if (win && !win.isDestroyed()) win.webContents.send('update-download-progress', { received: 1, total: 1, text: 'Preparing update…' });
    const staging = path.join(app.getPath('userData'), 'update-staging');
    try {
      const newApp = await extractInstaller(target, staging, process.platform);
      return { ok: true, path: target, newApp, target: installTarget(process.platform), version: (opts.version || '').replace(/^v/, '') };
    } catch (e) {
      return { ok: false, error: 'Could not prepare the update (' + (e.message || e) + ')' };
    }
  } catch (e) {
    try { fs.unlinkSync(target); } catch (e2) {}
    return { ok: false, error: String(e && e.message ? e.message : e) };
  } finally {
    activeDownload = null;
  }
});

// Renderer → menu state sync: Settings/quickbar changes update the native menu
// checkmarks so the Layout menu always reflects the active window's layout,
// and the window title shows the layout so multi-window users can tell them
// apart.
ipcMain.on('layout-changed', (event, s) => {
  syncMenuState(s);
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) applyLayoutTitle(win, s);
});

// Per-window tab memory: the renderer reports every tab switch and asks for its
// saved tab on boot, so relaunching restores each window to where you left off.
ipcMain.on('tab-changed', (event, tab) => {
  if (typeof tab !== 'string') return;
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win && !win.isDestroyed()) win.__studyHubTab = tab.slice(0, 40);
});
ipcMain.handle('get-window-tab', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  return (win && win.__studyHubTab) || 'dashboard';
});

// Session-memory opt-in: persisted in window-state.json so the NEXT launch
// knows before the first window is created, and applied live to this session.
ipcMain.on('session-memory-changed', (_event, enabled) => {
  ensureSessionLoaded();
  sessionMemoryEnabled = enabled !== false;
  saveWindowState(windowStateFile(), savedWindowQueue || [], sessionMemoryEnabled);
  windows.forEach(win => { if (!win.isDestroyed()) win.__sessionMemory = sessionMemoryEnabled; });
});

// Route the shared Layout menu handlers to the focused window (or the primary
// one) so menu actions apply to whichever window the user is working in.
setWindowAccessor(() => BrowserWindow.getFocusedWindow() || mainWindow);
