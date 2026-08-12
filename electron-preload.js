const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  // Report layout changes (density / power mode) so the native Layout menu
  // checkmarks stay in sync with the renderer's Settings and quickbar.
  notifyLayout: (s) => ipcRenderer.send('layout-changed', s),
  // Per-window tab memory: report tab switches and fetch the saved tab on boot.
  notifyTab: (tab) => ipcRenderer.send('tab-changed', tab),
  getWindowTab: () => ipcRenderer.invoke('get-window-tab'),
  // Session-memory opt-in (window arrangement + per-window tabs).
  notifySessionMemory: (enabled) => ipcRenderer.send('session-memory-changed', enabled),
  // One-click updater: ask main to download + verify + open the installer for
  // this platform, with live progress events back to the renderer.
  downloadUpdate: (opts) => ipcRenderer.invoke('download-update', opts),
  onUpdateProgress: (cb) => ipcRenderer.on('update-download-progress', (_event, d) => cb(d)),
  getAppFingerprint: () => ipcRenderer.invoke('get-app-fingerprint'),
  platform: process.platform,
  isElectron: true
});
