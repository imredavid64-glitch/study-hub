import { state, subscribeToState } from '../../core/state.js';
import { router } from '../../core/router.js';
import { TABS } from '../../core/config.js';
import { Avatar } from '../components/Avatar.js';
import { Button, IconButton } from '../components/Button.js';
import { Tabs } from '../components/Tabs.js';
import { Badge } from '../components/Badge.js';

export function AppShell(): HTMLDivElement {
  const shell = document.createElement('div');
  shell.className = 'min-h-screen bg-[var(--color-bg)] flex';
  shell.innerHTML = `
    <aside id="sidebar" class="sidebar fixed inset-y-0 left-0 z-40 w-64 bg-[var(--color-panel)] border-r border-[var(--color-border)] transform transition-transform duration-200 lg:translate-x-0 -translate-x-full">
      <div class="flex h-full flex-col">
        <div class="p-5 border-b border-[var(--color-border)]">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[var(--color-accent)] flex items-center justify-center">
              <i data-lucide="book-open" class="w-6 h-6 text-white"></i>
            </div>
            <div>
              <h1 class="font-semibold text-lg text-[var(--color-text)]">Study Hub</h1>
              <p class="text-xs text-[var(--color-muted)]">AI-Powered Learning</p>
            </div>
          </div>
        </div>
        <nav id="nav-tabs" class="flex-1 p-3 space-y-1 overflow-y-auto" role="navigation" aria-label="Main navigation"></nav>
        <div class="p-3 border-t border-[var(--color-border)]">
          <div id="user-status" class="flex items-center gap-3 p-2 rounded-xl bg-[var(--color-border)]/50"></div>
        </div>
      </div>
    </aside>

    <div class="flex-1 flex flex-col min-w-0 lg:ml-64">
      <header id="topbar" class="sticky top-0 z-30 bg-[var(--color-panel)]/80 backdrop-blur-md border-b border-[var(--color-border)]">
        <div class="flex items-center justify-between h-16 px-4 lg:px-6">
          <div class="flex items-center gap-4">
            <button id="mobile-menu-btn" class="lg:hidden p-2 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors" aria-label="Toggle menu">
              <i data-lucide="menu" class="w-6 h-6"></i>
            </button>
            <div>
              <h2 id="page-title" class="text-lg font-semibold text-[var(--color-text)]">Today</h2>
              <p id="page-subtitle" class="text-xs text-[var(--color-muted)]"></p>
            </div>
          </div>
          <div class="flex items-center gap-2" id="topbar-actions"></div>
        </div>
      </header>
      <main id="main-content" class="flex-1 overflow-y-auto p-4 lg:p-6" role="main"></main>
    </div>

    <div id="sidebar-overlay" class="fixed inset-0 z-30 bg-black/50 lg:hidden opacity-0 pointer-events-none transition-opacity duration-200" aria-hidden="true"></div>
  `;

  const sidebar = shell.querySelector('#sidebar') as HTMLDivElement;
  const navTabs = shell.querySelector('#nav-tabs') as HTMLDivElement;
  const mobileMenuBtn = shell.querySelector('#mobile-menu-btn') as HTMLButtonElement;
  const sidebarOverlay = shell.querySelector('#sidebar-overlay') as HTMLDivElement;
  const pageTitle = shell.querySelector('#page-title') as HTMLHeadingElement;
  const pageSubtitle = shell.querySelector('#page-subtitle') as HTMLParagraphElement;
  const topbarActions = shell.querySelector('#topbar-actions') as HTMLDivElement;
  const userStatus = shell.querySelector('#user-status') as HTMLDivElement;

  function renderNav(): void {
    const currentTab = state.getState().currentTab;
    const visibleTabs = TABS.filter(t => !t.advanced || state.getState().settings.dataSync === 'cloud');

    const tabsConfig = visibleTabs.map(t => ({
      id: t.id,
      label: t.label,
      icon: t.icon,
      badge: t.id === 'learn' ? getLearnBadge() : undefined,
    }));

    navTabs.innerHTML = '';
    const tabsEl = Tabs({
      tabs: tabsConfig,
      activeTab: currentTab,
      onChange: (tabId: string) => router.navigate(tabId as any),
      variant: 'pills',
      fullWidth: true,
    });
    navTabs.appendChild(tabsEl);
  }

  function getLearnBadge(): string | undefined {
    return undefined;
  }

  function renderUserStatus(): void {
    const { user, settings } = state.getState();
    userStatus.innerHTML = '';
    if (user) {
      const avatar = Avatar({ name: user.name, size: 'sm', status: 'online' });
      const info = document.createElement('div');
      info.className = 'flex-1 min-w-0';
      info.innerHTML = `
        <p class="text-sm font-medium text-[var(--color-text)] truncate">${user.name}</p>
        <p class="text-xs text-[var(--color-muted)] truncate">${user.major}</p>
      `;
      const syncBadge = Badge({
        children: settings.dataSync === 'cloud' ? 'Synced' : 'Local',
        variant: settings.dataSync === 'cloud' ? 'success' : 'outline',
        size: 'sm',
        dot: settings.dataSync === 'cloud',
      });
      userStatus.append(avatar, info, syncBadge);
    } else {
      const btn = Button({
        variant: 'primary',
        size: 'sm',
        children: 'Get Started',
        onClick: () => router.navigate('today' as any),
      });
      userStatus.appendChild(btn);
    }
  }

  function renderTopbarActions(): void {
    topbarActions.innerHTML = '';
    const { user, settings } = state.getState();

    if (user) {
      const themeBtn = IconButton({
        icon: 'sun',
        onClick: () => {
          settings.darkMode = !settings.darkMode;
          state.updateSettings({ darkMode: settings.darkMode });
        },
        'aria-label': 'Toggle theme',
        variant: 'ghost',
      });
      themeBtn.querySelector('i')!.setAttribute('data-lucide', settings.darkMode ? 'moon' : 'sun');

      const searchBtn = IconButton({
        icon: 'search',
        onClick: () => openCommandPalette(),
        'aria-label': 'Search (Cmd+K)',
        variant: 'ghost',
      });
      const timerBtn = Button({
        variant: 'primary',
        size: 'sm',
        leftIcon: 'timer',
        children: `${settings.sessionMinutes}m Sprint`,
        onClick: () => router.navigate('learn' as any),
      });

      topbarActions.append(searchBtn, themeBtn, timerBtn);
    }
  }

  function updatePageTitle(): void {
    const tab = TABS.find(t => t.id === state.getState().currentTab);
    if (tab) {
      pageTitle.textContent = tab.label;
      pageSubtitle.textContent = getPageSubtitle(tab.id);
    }
  }

  function getPageSubtitle(tabId: string): string {
    const subtitles: Record<string, string> = {
      today: 'Your daily focus',
      plan: 'Goals & tasks',
      learn: 'Study modes',
      notes: 'Capture knowledge',
      analytics: 'Insights & progress',
      'ai-lab': 'AI experiments',
      settings: 'Preferences',
    };
    return subtitles[tabId] || '';
  }

  function toggleSidebar(open?: boolean): void {
    const isOpen = open ?? sidebar.classList.contains('-translate-x-full');
    if (isOpen) {
      sidebar.classList.remove('-translate-x-full');
      sidebarOverlay.classList.remove('opacity-0', 'pointer-events-none');
      sidebarOverlay.classList.add('opacity-100', 'pointer-events-auto');
      document.body.style.overflow = 'hidden';
    } else {
      sidebar.classList.add('-translate-x-full');
      sidebarOverlay.classList.add('opacity-0', 'pointer-events-none');
      sidebarOverlay.classList.remove('opacity-100', 'pointer-events-auto');
      document.body.style.overflow = '';
    }
  }

  mobileMenuBtn.addEventListener('click', () => toggleSidebar());
  sidebarOverlay.addEventListener('click', () => toggleSidebar(false));

  sidebar.querySelectorAll('[role="tab"]').forEach(btn => {
    btn.addEventListener('click', () => toggleSidebar(false));
  });

  subscribeToState(s => s.currentTab, () => {
    updatePageTitle();
  });

  subscribeToState(s => s.user, () => {
    renderUserStatus();
    renderTopbarActions();
  });

  subscribeToState(s => s.settings, () => {
    renderUserStatus();
    renderTopbarActions();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) toggleSidebar(false);
  });

  function openCommandPalette(): void {
    const existing = document.getElementById('command-palette-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'command-palette-overlay';
    overlay.className = 'fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-sm animate-fade-in';
    overlay.innerHTML = `
      <div class="w-full max-w-xl rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-2xl overflow-hidden">
        <div class="p-4 border-b border-[var(--color-border)] flex items-center gap-3">
          <i data-lucide="search" class="w-5 h-5 text-[var(--color-muted)]"></i>
          <input id="cmd-input" type="text" placeholder="Search tabs, actions, or jump to page..." class="w-full bg-transparent text-base text-[var(--color-text)] focus:outline-none" autofocus />
          <span class="text-xs px-2 py-1 rounded bg-[var(--color-border)] text-[var(--color-muted)] font-mono">ESC</span>
        </div>
        <div id="cmd-results" class="p-2 max-h-80 overflow-y-auto space-y-1"></div>
      </div>
    `;

    document.body.appendChild(overlay);

    const input = overlay.querySelector('#cmd-input') as HTMLInputElement;
    const results = overlay.querySelector('#cmd-results') as HTMLDivElement;

    const commands = [
      { label: 'Go to Today Dashboard', icon: 'sun', action: () => router.navigate('today') },
      { label: 'Go to Planner & Tasks', icon: 'calendar', action: () => router.navigate('plan') },
      { label: 'Go to Learn & Study Modes', icon: 'book-open', action: () => router.navigate('learn') },
      { label: 'Go to Notes Knowledge Base', icon: 'file-text', action: () => router.navigate('notes') },
      { label: 'Go to Analytics & Progress', icon: 'bar-chart', action: () => router.navigate('analytics') },
      { label: 'Go to AI Lab', icon: 'cpu', action: () => router.navigate('ai-lab') },
      { label: 'Go to Settings', icon: 'settings', action: () => router.navigate('settings') },
      { label: 'Toggle Dark Mode', icon: 'moon', action: () => state.updateSettings({ darkMode: !state.getState().settings.darkMode }) },
    ];

    function renderCmds(filter = ''): void {
      const filtered = commands.filter(c => c.label.toLowerCase().includes(filter.toLowerCase()));
      results.innerHTML = filtered.map((c, idx) => `
        <button data-cmd-idx="${idx}" class="w-full text-left p-3 rounded-xl hover:bg-[var(--color-accent-soft)]/50 transition-colors flex items-center gap-3 text-sm font-medium text-[var(--color-text)]">
          <i data-lucide="${c.icon}" class="w-4 h-4 text-[var(--color-accent)]"></i>
          <span>${c.label}</span>
        </button>
      `).join('');

      results.querySelectorAll('[data-cmd-idx]').forEach((btn, idx) => {
        btn.addEventListener('click', () => {
          filtered[idx].action();
          overlay.remove();
        });
      });
    }

    input.addEventListener('input', (e) => renderCmds((e.target as HTMLInputElement).value));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        overlay.remove();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);

    renderCmds();
  }

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openCommandPalette();
    }
  });

  renderNav();
  renderUserStatus();
  renderTopbarActions();
  updatePageTitle();

  return shell;
}