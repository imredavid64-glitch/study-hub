/**
 * Shared Electron Layout menu — used by electron-main.js to install the
 * native menu, and by the QA smoke test to drive the menu end-to-end.
 *
 * The click handlers apply layout through the renderer's own state pipeline
 * (state.settings → saveState → applyAppearance) so Settings, the topbar
 * quickbar, and the DOM all stay in sync.
 */
'use strict';

// Renderer accessor — set by electron-main.js (and by tests) to the main window.
let _getWindow = () => null;
function setWindowAccessor(fn) {
  _getWindow = fn;
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
    { id: 'power-mode', label: 'Compact power mode', type: 'checkbox', click: (item) => applyLayout('power', null, item.checked) }
  ]
};

module.exports = { LAYOUT_SUBMENU, applyLayout, setWindowAccessor };
