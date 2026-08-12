const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  // Report layout changes (density / power mode) so the native Layout menu
  // checkmarks stay in sync with the renderer's Settings and quickbar.
  notifyLayout: (s) => ipcRenderer.send('layout-changed', s),
  platform: process.platform,
  isElectron: true
});
