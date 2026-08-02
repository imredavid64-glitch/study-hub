/* Study Hub — Mobile Native Features (Capacitor) */
const Mobile = (() => {
  let isNative = false;
  let Capacitor = null;

  async function init() {
    try {
      Capacitor = window.Capacitor;
      isNative = !!(Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform());
    } catch (e) {
      isNative = false;
    }

    if (isNative) {
      console.log('[Mobile] Running as native app on', Capacitor.getPlatform());
      document.body.classList.add('is-native');
      setupStatusBar();
      setupKeyboard();
      setupBackButton();
      setupAppState();
    } else {
      console.log('[Mobile] Running as web app');
    }
    return isNative;
  }

  function getPlatform() {
    if (!isNative) return 'web';
    return Capacitor.getPlatform();
  }

  function setupStatusBar() {
    try {
      const StatusBar = Capacitor.Plugins.StatusBar;
      if (StatusBar) {
        StatusBar.setStyle({ style: 'DARK' });
        StatusBar.setBackgroundColor({ color: '#1a1a2e' });
      }
    } catch (e) {}
  }

  function setupKeyboard() {
    try {
      const Keyboard = Capacitor.Plugins.Keyboard;
      if (Keyboard) {
        Keyboard.addListener('keyboardWillShow', (info) => {
          document.body.classList.add('keyboard-open');
          document.body.style.paddingBottom = info.keyboardHeight + 'px';
        });
        Keyboard.addListener('keyboardWillHide', () => {
          document.body.classList.remove('keyboard-open');
          document.body.style.paddingBottom = '';
        });
      }
    } catch (e) {}
  }

  function setupBackButton() {
    try {
      const App = Capacitor.Plugins.App;
      if (App) {
        App.addListener('backButton', ({ canGoBack }) => {
          if (canGoBack) {
            window.history.back();
          } else {
            App.minimizeApp();
          }
        });
      }
    } catch (e) {}
  }

  function setupAppState() {
    try {
      const App = Capacitor.Plugins.App;
      if (App) {
        App.addListener('appStateChange', ({ isActive }) => {
          if (!isActive && window.AppState && typeof window.AppState.save === 'function') {
            window.AppState.save();
          }
        });
      }
    } catch (e) {}
  }

  async function requestNotificationPermission() {
    if (!isNative) return true;
    try {
      const Permissions = Capacitor.Plugins.Permission;
      if (Permissions) {
        const result = await Permissions.requestPermissions({ permissions: ['notifications'] });
        return result.notifications === 'granted';
      }
    } catch (e) {}
    return true;
  }

  async function scheduleLocalNotification(title, body, delay, id) {
    if (!isNative) {
      setTimeout(() => {
        if (Notification.permission === 'granted') {
          new Notification(title, { body });
        }
      }, delay);
      return;
    }
    try {
      const LocalNotifications = Capacitor.Plugins.LocalNotifications;
      if (LocalNotifications) {
        await LocalNotifications.schedule({
          notifications: [{
            title,
            body,
            id: id || Math.floor(Math.random() * 100000),
            schedule: { at: new Date(Date.now() + delay) }
          }]
        });
      }
    } catch (e) {
      console.warn('[Mobile] Notification failed:', e);
    }
  }

  async function cancelAllNotifications() {
    if (!isNative) return;
    try {
      const LocalNotifications = Capacitor.Plugins.LocalNotifications;
      if (LocalNotifications) {
        const pending = await LocalNotifications.getPending();
        if (pending.notifications.length) {
          await LocalNotifications.cancel({ notifications: pending.notifications });
        }
      }
    } catch (e) {}
  }

  function hapticFeedback(style = 'light') {
    if (!isNative) return;
    try {
      const Haptics = Capacitor.Plugins.Haptics;
      if (Haptics) {
        if (style === 'light') Haptics.impact({ style: 'LIGHT' });
        else if (style === 'medium') Haptics.impact({ style: 'MEDIUM' });
        else if (style === 'heavy') Haptics.impact({ style: 'HEAVY' });
        else if (style === 'success') Haptics.notification({ type: 'SUCCESS' });
        else if (style === 'warning') Haptics.notification({ type: 'WARNING' });
        else if (style === 'error') Haptics.notification({ type: 'ERROR' });
      }
    } catch (e) {}
  }

  function addMobileStyles() {
    if (!document.getElementById('mobile-styles')) {
      const style = document.createElement('style');
      style.id = 'mobile-styles';
      style.textContent = `
        .is-native .sidebar { display: none !important; }
        .is-native .main-content { margin-left: 0 !important; }
        .is-native .topbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding-top: env(safe-area-inset-top, 0);
        }
        .is-native .tab-content {
          padding-top: calc(60px + env(safe-area-inset-top, 0));
          padding-bottom: calc(80px + env(safe-area-inset-bottom, 0));
        }
        .mobile-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--surface);
          border-top: 1px solid var(--border);
          padding: 6px 0 calc(6px + env(safe-area-inset-bottom, 0));
          z-index: 1001;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .mobile-nav::-webkit-scrollbar { display: none; }
        .is-native .mobile-nav { display: flex; }
        .mobile-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 4px 12px;
          border: none;
          background: none;
          color: var(--text-muted);
          font-size: 10px;
          cursor: pointer;
          white-space: nowrap;
          min-width: 56px;
          transition: color .2s;
        }
        .mobile-nav-item.active { color: var(--accent); }
        .mobile-nav-item .nav-icon { font-size: 20px; }
        .mobile-nav-item .nav-label { font-weight: 500; }
        .is-native .topbar .topbar-left .menu-toggle { display: none; }
        .keyboard-open .tab-content { padding-bottom: 320px !important; }
        @supports (padding: env(safe-area-inset-bottom)) {
          .mobile-nav { padding-bottom: calc(8px + env(safe-area-inset-bottom)); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  function createMobileNav() {
    if (document.querySelector('.mobile-nav')) return;
    const nav = document.createElement('nav');
    nav.className = 'mobile-nav';
    const items = [
      { tab: 'dashboard', icon: '🏠', label: 'Home' },
      { tab: 'planner', icon: '📋', label: 'Plan' },
      { tab: 'sessions', icon: '⏱️', label: 'Focus' },
      { tab: 'flashcards', icon: '🃏', label: 'Cards' },
      { tab: 'quizzes', icon: '❓', label: 'Quiz' },
      { tab: 'notes', icon: '📝', label: 'Notes' },
      { tab: 'subjects', icon: '📚', label: 'Learn' },
      { tab: 'coach', icon: '🤖', label: 'AI' },
      { tab: 'analytics', icon: '📊', label: 'Stats' },
      { tab: 'settings', icon: '⚙️', label: 'Settings' }
    ];
    items.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'mobile-nav-item';
      btn.dataset.tab = item.tab;
      btn.innerHTML = `<span class="nav-icon">${item.icon}</span><span class="nav-label">${item.label}</span>`;
      btn.addEventListener('click', () => {
        hapticFeedback('light');
        document.querySelectorAll('.mobile-nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tabBtn = document.querySelector(`.nav-btn[data-tab="${item.tab}"]`);
        if (tabBtn) tabBtn.click();
      });
      nav.appendChild(btn);
    });
    document.body.appendChild(nav);
  }

  function syncMobileNav(tab) {
    document.querySelectorAll('.mobile-nav-item').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tab);
    });
  }

  return {
    init,
    getPlatform,
    isNative: () => isNative,
    requestNotificationPermission,
    scheduleLocalNotification,
    cancelAllNotifications,
    hapticFeedback,
    addMobileStyles,
    createMobileNav,
    syncMobileNav
  };
})();
