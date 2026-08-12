const { app, BrowserWindow, Menu, shell, dialog, ipcMain, nativeTheme, screen } = require('electron');
const path = require('path');
const { LAYOUT_SUBMENU, setWindowAccessor, syncMenuState, layoutTitleSuffix } = require('./electron-menu');
const { defaultBounds, sanitizeBounds, loadSessionState, loadWindowState, saveWindowState, recordWindow } = require('./electron-window-state');

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

  win.loadFile('index.html');
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

function showAbout() {
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'About Study Hub',
    message: 'Study Hub v1.0.0',
    detail: 'Plan smarter. Practice deeper. Improve daily.\n\nBuilt with Electron + Web Technologies.\nGitHub: https://github.com/imredavid64-glitch/study-hub',
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
