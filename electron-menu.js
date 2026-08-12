/**
 * Shared Electron Layout menu — used by electron-main.js to install the
 * native menu, and by the QA smoke test to drive the menu end-to-end.
 *
 * The click handlers apply layout through the renderer's own state pipeline
 * (state.settings → saveState → applyAppearance) so Settings, the topbar
 * quickbar, and the DOM all stay in sync.
 */
'use strict';

const { Menu } = require('electron');

// Renderer accessor — set by electron-main.js (and by tests) to the main window.
let _getWindow = () => null;
function setWindowAccessor(fn) {
  _getWindow = fn;
}

// Human title fragment for a layout state, e.g. "— Roomy ⚡" so users can tell
// multiple windows apart at a glance (shared so the main process and the QA
// suite produce identical titles).
function layoutTitleSuffix(s) {
  const density = s && s.density ? s.density.charAt(0).toUpperCase() + s.density.slice(1) : 'Comfortable';
  const power = s && s.powerMode ? ' ⚡' : '';
  return ' — ' + density + power;
}

// Sync the native Layout menu's checked states from renderer state. Called from
// the main process whenever the renderer reports a layout change (Settings
// controls, the topbar quickbar, or the renderer's own state pipeline).
function syncMenuState(s) {
  const menu = Menu.getApplicationMenu && Menu.getApplicationMenu();
  if (!menu || !s || typeof s !== 'object') return;
  const power = menu.getMenuItemById('power-mode');
  if (power && typeof s.powerMode === 'boolean') power.checked = s.powerMode;
  const memory = menu.getMenuItemById('session-memory');
  if (memory && typeof s.sessionMemory === 'boolean') memory.checked = s.sessionMemory;
  const density = s.density || 'comfortable';
  // Electron's radio group rejects checking an item while a sibling is still
  // checked — uncheck the others first, then check the target so the sync
  // actually sticks (verified against the native menu).
  ['compact', 'comfortable', 'roomy'].forEach(d => {
    const item = menu.getMenuItemById('density-' + d);
    if (item && d !== density) item.checked = false;
  });
  const target = menu.getMenuItemById('density-' + density);
  if (target) target.checked = true;
}

function applyLayout(kind, value, checked) {
  const win = _getWindow && _getWindow();
  const wc = win && win.webContents;
  if (!wc) return;
  const expr = kind === 'power'
    ? `state.settings.powerMode = ${!!checked}; saveState(); applyAppearance();
       if (typeof syncPowerQuick === 'function') syncPowerQuick();
       var t = document.getElementById('powerModeToggle'); if (t) t.checked = ${!!checked};
       showToast(${checked} ? '⚡ Compact power mode on' : 'Compact power mode off');`
    : kind === 'memory'
      ? `state.settings.sessionMemory = ${!!checked}; saveState();
         if (typeof notifySessionMemory === 'function') notifySessionMemory(${!!checked});
         var t = document.getElementById('sessionMemoryToggle'); if (t) t.checked = ${!!checked};
         showToast(${checked} ? 'Remembering windows, tabs & layout' : 'Session memory off — fresh windows each launch');`
      : `state.settings.density = '${value}'; saveState(); applyAppearance();
         var q = document.getElementById('densityQuickSelect'); if (q) q.value = '${value}';
         var s = document.getElementById('densitySelect'); if (s) s.value = '${value}';
         showToast('Layout density: ${value}');`;
  wc.executeJavaScript(expr).catch(() => {});
}

const LAYOUT_SUBMENU = {
  label: 'Layout',
  submenu: [
    {
      label: 'Density',
      submenu: [
        { id: 'density-compact', label: 'Compact', type: 'radio', click: (item) => applyLayout('density', 'compact', item.checked) },
        { id: 'density-comfortable', label: 'Comfortable', type: 'radio', click: (item) => applyLayout('density', 'comfortable', item.checked) },
        { id: 'density-roomy', label: 'Roomy', type: 'radio', click: (item) => applyLayout('density', 'roomy', item.checked) }
      ]
    },
    { type: 'separator' },
    { id: 'power-mode', label: 'Compact power mode', type: 'checkbox', click: (item) => applyLayout('power', null, item.checked) },
    { type: 'separator' },
    { id: 'session-memory', label: 'Remember windows, tabs & layout', type: 'checkbox', click: (item) => applyLayout('memory', null, item.checked) }
  ]
};

module.exports = { LAYOUT_SUBMENU, applyLayout, setWindowAccessor, syncMenuState, layoutTitleSuffix };
