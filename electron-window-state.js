/**
 * Window-position memory — pure helpers for persisting and restoring Electron
 * window bounds across app restarts. Deliberately free of any `require('electron')`
 * so the QA suite and `npm test` can unit-test the logic in plain Node.
 *
 * State shape on disk (userData/window-state.json):
 *   { "memory": true|false, "windows": [ { width, height, x, y, maximized, tab }, ... ] }
 * `memory` is the opt-in flag for session memory (window arrangement + per-window
 * tab). The queue is capped at 8; the first entry is used for the primary
 * window, later entries feed windows opened via Window → New Window. `tab` is
 * the last tab that window had open (restored on launch via get-window-tab).
 */
'use strict';

const fs = require('fs');
const path = require('path');

const MAX_WINDOWS = 8;

function defaultBounds() {
  return { width: 1400, height: 900, x: undefined, y: undefined, maximized: false, tab: undefined };
}

/**
 * Clamp and validate one saved bounds object against a display work area.
 * Off-screen or absurd sizes fall back to a centered default inside the area.
 */
function sanitizeBounds(b, displayArea) {
  const d = defaultBounds();
  if (!b || typeof b !== 'object') return d;
  const width = Math.max(640, Math.min(parseInt(b.width, 10) || d.width, 4000));
  const height = Math.max(480, Math.min(parseInt(b.height, 10) || d.height, 3000));
  let x = parseInt(b.x, 10);
  let y = parseInt(b.y, 10);
  const maximized = !!b.maximized;
  if (displayArea) {
    const visible = Number.isFinite(x) && Number.isFinite(y) &&
      x + 100 < displayArea.x + displayArea.width &&
      y + 100 < displayArea.y + displayArea.height &&
      x + width - 100 > displayArea.x &&
      y + height - 100 > displayArea.y;
    if (!visible) {
      x = displayArea.x + Math.max(0, Math.round((displayArea.width - width) / 2));
      y = displayArea.y + Math.max(0, Math.round((displayArea.height - height) / 2));
    }
  }
  return {
    width,
    height,
    x: Number.isFinite(x) ? x : undefined,
    y: Number.isFinite(y) ? y : undefined,
    maximized,
    tab: typeof b.tab === 'string' && b.tab.length <= 40 ? b.tab : undefined,
  };
}

/** Read the whole saved session state (memory flag + window queue). */
function loadSessionState(file) {
  const empty = { memory: true, windows: [] };
  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
    return {
      memory: parsed.memory !== false, // default: session memory ON
      windows: Array.isArray(parsed.windows) ? parsed.windows : [],
    };
  } catch (e) {
    return empty;
  }
}

/** Read the saved window queue; returns [] on missing/corrupt files. */
function loadWindowState(file) {
  return loadSessionState(file).windows;
}

/** Persist the queue + memory flag (most recent first, capped). Returns true on success. */
function saveWindowState(file, windows, memory) {
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify({ memory: memory !== false, windows: windows.slice(0, MAX_WINDOWS) }));
    return true;
  } catch (e) {
    return false;
  }
}

/** Prepend a just-closed window's bounds, keeping the most recent first. */
function recordWindow(windows, bounds) {
  return [bounds].concat(Array.isArray(windows) ? windows : []).slice(0, MAX_WINDOWS);
}

module.exports = { defaultBounds, sanitizeBounds, loadSessionState, loadWindowState, saveWindowState, recordWindow, MAX_WINDOWS };
