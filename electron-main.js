const { app, BrowserWindow, Menu, shell, dialog, ipcMain, nativeTheme } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
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

  mainWindow.loadFile('index.html');

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
    {
      label: 'Layout',
      submenu: [
        {
          label: 'Density',
          submenu: [
            { label: 'Compact', type: 'radio', click: (item) => applyLayout('density', 'compact', item.checked) },
            { label: 'Comfortable', type: 'radio', click: (item) => applyLayout('density', 'comfortable', item.checked) },
            { label: 'Roomy', type: 'radio', click: (item) => applyLayout('density', 'roomy', item.checked) }
          ]
        },
        { type: 'separator' },
        { label: 'Compact power mode', type: 'checkbox', click: (item) => applyLayout('power', null, item.checked) }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' }, { role: 'zoom' },
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

  mainWindow.on('closed', () => { mainWindow = null; });
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

// Layout menu → renderer: apply density / power mode through the app's own
// state pipeline so Settings, the topbar quickbar, and the DOM stay in sync.
function applyLayout(kind, value, checked) {
  const wc = mainWindow && mainWindow.webContents;
  if (!wc) return;
  const expr = kind === 'power'
    ? `state.settings.powerMode = ${!!checked}; saveState(); applyAppearance();
       if (typeof syncPowerQuick === 'function') syncPowerQuick();
       var t = document.getElementById('powerModeToggle'); if (t) t.checked = ${!!checked};
       showToast(${checked} ? '⚡ Compact power mode on' : 'Compact power mode off');`
    : `state.settings.density = '${value}'; saveState(); applyAppearance();
       var q = document.getElementById('densityQuickSelect'); if (q) q.value = '${value}';
       var s = document.getElementById('densitySelect'); if (s) s.value = '${value}';
       showToast('Layout density: ${value}');`;
  wc.executeJavaScript(expr).catch(() => {});
}
