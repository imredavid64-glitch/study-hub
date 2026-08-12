const { app, BrowserWindow, Menu, shell, dialog, ipcMain, nativeTheme } = require('electron');
const path = require('path');
const { LAYOUT_SUBMENU, setWindowAccessor, syncMenuState } = require('./electron-menu');

let mainWindow;
const windows = new Set();

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
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
  windows.add(win);
  if (!mainWindow || mainWindow.isDestroyed()) mainWindow = win;

  win.loadFile('index.html');
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
// checkmarks so the Layout menu always reflects the active window's layout.
ipcMain.on('layout-changed', (_event, s) => syncMenuState(s));

// Route the shared Layout menu handlers to the focused window (or the primary
// one) so menu actions apply to whichever window the user is working in.
setWindowAccessor(() => BrowserWindow.getFocusedWindow() || mainWindow);
