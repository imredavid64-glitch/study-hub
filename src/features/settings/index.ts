import { state } from '../../core/state.js';
import { router } from '../../core/router.js';
import { Input, Select, Textarea } from '../../ui/components/Input.js';
import { Tabs } from '../../ui/components/Tabs.js';
import { Avatar } from '../../ui/components/Avatar.js';
import { THEMES, DENSITIES } from '../../core/config.js';
import { toastSuccess, toastError } from '../../ui/components/Toast.js';

export function settingsFeature(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'space-y-6 animate-fade-in max-w-3xl';
  container.id = 'settings-feature';

  container.innerHTML = `
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[var(--color-text)]">Settings</h1>
        <p class="text-[var(--color-muted)]">Customize your Study Hub experience</p>
      </div>
    </div>

    <div id="settings-tabs"></div>
    <div id="profile-panel"></div>
    <div id="appearance-panel" class="hidden"></div>
    <div id="study-panel" class="hidden"></div>
    <div id="ai-panel" class="hidden"></div>
    <div id="data-panel" class="hidden"></div>
    <div id="about-panel" class="hidden"></div>
  `;

  const tabsEl = container.querySelector('#settings-tabs') as HTMLDivElement;
  const panels = {
    profile: container.querySelector('#profile-panel') as HTMLDivElement,
    appearance: container.querySelector('#appearance-panel') as HTMLDivElement,
    study: container.querySelector('#study-panel') as HTMLDivElement,
    ai: container.querySelector('#ai-panel') as HTMLDivElement,
    data: container.querySelector('#data-panel') as HTMLDivElement,
    about: container.querySelector('#about-panel') as HTMLDivElement,
  };

  function render(): void {
    const tabs = Tabs({
      tabs: [
        { id: 'profile', label: 'Profile', icon: 'user' },
        { id: 'appearance', label: 'Appearance', icon: 'palette' },
        { id: 'study', label: 'Study', icon: 'timer' },
        { id: 'ai', label: 'AI', icon: 'cpu' },
        { id: 'data', label: 'Data & Sync', icon: 'database' },
        { id: 'about', label: 'About', icon: 'info' },
      ],
      activeTab: 'profile',
      onChange: switchPanel,
      variant: 'underline',
    });
    tabsEl.innerHTML = '';
    tabsEl.appendChild(tabs);

    renderProfilePanel();
    renderAppearancePanel();
    renderStudyPanel();
    renderAIPanel();
    renderDataPanel();
    renderAboutPanel();
  }

  function switchPanel(tab: string): void {
    Object.entries(panels).forEach(([key, panel]) => {
      panel.classList.toggle('hidden', key !== tab);
    });
  }

  function renderProfilePanel(): void {
    const { user } = state.getState();
    panels.profile.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title">Profile</div>
          <div class="card-description">Your academic identity</div>
        </div>
        <div class="card-content">
          <div class="flex items-center gap-4 mb-6">
            ${Avatar({ name: user?.name || 'Scholar', size: 'xl', src: user ? undefined : undefined })}
            <button id="change-avatar" class="btn-secondary btn-sm">Change Photo</button>
          </div>
          <form id="profile-form" class="space-y-4">
            <div class="grid gap-4 sm:grid-cols-2">
              ${Input({ label: 'Name', value: user?.name || '', required: true, id: 'profile-name' })}
              ${Input({ label: 'Major / Program', value: user?.major || '', placeholder: 'Computer Science', id: 'profile-major' })}
            </div>
            <div class="grid gap-4 sm:grid-cols-3">
              ${Input({ label: 'Weekly Target (hrs)', type: 'number', min: '1', max: '100', value: String(user?.weeklyTargetHours || 20), id: 'profile-weekly' })}
              ${Input({ label: 'Target GPA', type: 'number', min: '0', max: '4', step: '0.1', value: String(user?.targetGpa || 3.8), id: 'profile-gpa' })}
              ${Select({ label: 'Learning Style', options: [
                { value: 'mixed', label: 'Mixed' },
                { value: 'visual', label: 'Visual' },
                { value: 'auditory', label: 'Auditory' },
                { value: 'kinesthetic', label: 'Kinesthetic' },
                { value: 'reading', label: 'Reading/Writing' }
              ], value: user?.learningStyle || 'mixed', id: 'profile-learning' })}
            </div>
            ${Textarea({ label: 'Interests', placeholder: 'What subjects excite you?', value: user?.interests || '', rows: 3, id: 'profile-interests' })}
            ${Textarea({ label: 'Challenges', placeholder: 'What do you struggle with?', value: user?.difficulties || '', rows: 3, id: 'profile-difficulties' })}
            ${Textarea({ label: 'Goals', placeholder: 'What do you want to achieve?', value: user?.goals || '', rows: 3, id: 'profile-goals' })}
            <div class="flex justify-end">
              <button type="submit" class="btn-primary" data-lucide="save">Save Profile</button>
            </div>
          </form>
        </div>
      </div>
    `;

    const form = panels.profile.querySelector('#profile-form') as HTMLFormElement;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const updates = {
        name: (form.querySelector('#profile-name') as HTMLInputElement).value,
        major: (form.querySelector('#profile-major') as HTMLInputElement).value,
        weeklyTargetHours: parseInt((form.querySelector('#profile-weekly') as HTMLInputElement).value),
        targetGpa: parseFloat((form.querySelector('#profile-gpa') as HTMLInputElement).value),
        learningStyle: (form.querySelector('#profile-learning') as HTMLSelectElement).value as any,
        interests: (form.querySelector('#profile-interests') as HTMLTextAreaElement).value,
        difficulties: (form.querySelector('#profile-difficulties') as HTMLTextAreaElement).value,
        goals: (form.querySelector('#profile-goals') as HTMLTextAreaElement).value,
      };
      if (state.getState().user) {
        state.setUser({ ...state.getState().user!, ...updates, updatedAt: Date.now() });
      }
      toastSuccess('Profile saved!');
    });
  }

  function renderAppearancePanel(): void {
    const { settings } = state.getState();
    panels.appearance.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title">Theme</div>
          <div class="card-description">Choose your color scheme</div>
        </div>
        <div class="card-content">
          <div class="grid gap-3 sm:grid-cols-3" id="theme-options">
            ${THEMES.map(t => `
              <button class="theme-option p-4 rounded-xl border-2 transition-all ${settings.theme === t.id ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)]' : 'border-[var(--color-border)] hover:border-[var(--color-accent)]'}" data-theme="${t.id}">
                <div class="w-full h-8 rounded-lg mb-3" style="background: ${t.accent}"></div>
                <p class="font-medium">${t.name}</p>
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Density</div>
          <div class="card-description">Adjust spacing and compactness</div>
        </div>
        <div class="card-content">
          <div class="flex gap-3" id="density-options">
            ${DENSITIES.map(d => `
              <button class="density-option flex-1 p-4 rounded-xl border-2 transition-all ${settings.density === d.id ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)]' : 'border-[var(--color-border)] hover:border-[var(--color-accent)]'}" data-density="${d.id}">
                <p class="font-medium">${d.name}</p>
                <p class="text-sm text-[var(--color-muted)]">${d.space === 1 ? 'Comfortable spacing' : 'Compact for more content'}</p>
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Display</div>
        </div>
        <div class="card-content space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Dark Mode</p>
              <p class="text-sm text-[var(--color-muted)]">Switch between light and dark theme</p>
            </div>
            <button id="dark-mode-toggle" class="toggle-switch ${settings.darkMode ? 'active' : ''}" role="switch" aria-checked="${settings.darkMode}"></button>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Reduced Motion</p>
              <p class="text-sm text-[var(--color-muted)]">Minimize animations and transitions</p>
            </div>
            <button id="reduced-motion-toggle" class="toggle-switch ${settings.reducedMotion ? 'active' : ''}" role="switch" aria-checked="${settings.reducedMotion}"></button>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            ${Select({ label: 'Font Size', options: [
              { value: 'sm', label: 'Small' },
              { value: 'md', label: 'Medium' },
              { value: 'lg', label: 'Large' }
            ], value: settings.fontSize, id: 'font-size' })}
          </div>
        </div>
      </div>
    `;

    panels.appearance.querySelectorAll('.theme-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-theme')!;
        state.updateSettings({ theme: theme as any });
        document.querySelectorAll('.theme-option').forEach(b => b.classList.remove('border-[var(--color-accent)]', 'bg-[var(--color-accent-soft)]'));
        btn.classList.add('border-[var(--color-accent)]', 'bg-[var(--color-accent-soft)]');
      });
    });

    panels.appearance.querySelectorAll('.density-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const density = btn.getAttribute('data-density')!;
        state.updateSettings({ density: density as any });
        document.querySelectorAll('.density-option').forEach(b => b.classList.remove('border-[var(--color-accent)]', 'bg-[var(--color-accent-soft)]'));
        btn.classList.add('border-[var(--color-accent)]', 'bg-[var(--color-accent-soft)]');
      });
    });

    const darkToggle = panels.appearance.querySelector('#dark-mode-toggle') as HTMLButtonElement;
    darkToggle.addEventListener('click', () => {
      const newValue = !state.getState().settings.darkMode;
      state.updateSettings({ darkMode: newValue });
      darkToggle.classList.toggle('active', newValue);
      darkToggle.setAttribute('aria-checked', String(newValue));
    });

    const reducedToggle = panels.appearance.querySelector('#reduced-motion-toggle') as HTMLButtonElement;
    reducedToggle.addEventListener('click', () => {
      const newValue = !state.getState().settings.reducedMotion;
      state.updateSettings({ reducedMotion: newValue });
      reducedToggle.classList.toggle('active', newValue);
      reducedToggle.setAttribute('aria-checked', String(newValue));
    });

    const fontSizeSelect = panels.appearance.querySelector('#font-size') as HTMLSelectElement;
    fontSizeSelect.addEventListener('change', () => {
      state.updateSettings({ fontSize: fontSizeSelect.value as any });
    });
  }

  function renderStudyPanel(): void {
    const { settings } = state.getState();
    panels.study.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title">Session Defaults</div>
        </div>
        <div class="card-content space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            ${Input({ label: 'Focus Duration (min)', type: 'number', min: '5', max: '120', value: String(settings.sessionMinutes), id: 'session-minutes' })}
            ${Input({ label: 'Break Duration (min)', type: 'number', min: '1', max: '30', value: String(settings.breakMinutes), id: 'break-minutes' })}
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Auto Break</p>
              <p class="text-sm text-[var(--color-muted)]">Automatically start break after focus session</p>
            </div>
            <button id="auto-break-toggle" class="toggle-switch ${settings.autoBreak ? 'active' : ''}" role="switch" aria-checked="${settings.autoBreak}"></button>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Sound Notifications</p>
              <p class="text-sm text-[var(--color-muted)]">Play sound when timer completes</p>
            </div>
            <button id="sound-toggle" class="toggle-switch ${settings.soundEnabled ? 'active' : ''}" role="switch" aria-checked="${settings.soundEnabled}"></button>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Haptic Feedback</p>
              <p class="text-sm text-[var(--color-muted)]">Vibration on mobile devices</p>
            </div>
            <button id="haptics-toggle" class="toggle-switch ${settings.hapticsEnabled ? 'active' : ''}" role="switch" aria-checked="${settings.hapticsEnabled}"></button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Reminders</div>
        </div>
        <div class="card-content space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Daily Reminder</p>
              <p class="text-sm text-[var(--color-muted)]">Get notified to study each day</p>
            </div>
            <button id="daily-reminder-toggle" class="toggle-switch ${settings.notificationsEnabled ? 'active' : ''}" role="switch" aria-checked="${settings.notificationsEnabled}"></button>
          </div>
          ${Input({ label: 'Reminder Time', type: 'time', value: settings.dailyReminderTime || '19:00', id: 'reminder-time' })}
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Weekly Report</p>
              <p class="text-sm text-[var(--color-muted)]">Receive a summary of your progress</p>
            </div>
            <button id="weekly-report-toggle" class="toggle-switch ${settings.weeklyReport ? 'active' : ''}" role="switch" aria-checked="${settings.weeklyReport}"></button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Language</div>
        </div>
        <div class="card-content">
          ${Select({ label: 'App Language', options: [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Español' },
            { value: 'fr', label: 'Français' },
            { value: 'de', label: 'Deutsch' }
          ], value: settings.language, id: 'language' })}
        </div>
      </div>
    `;

    const toggles = [
      { id: 'auto-break-toggle', key: 'autoBreak' },
      { id: 'sound-toggle', key: 'soundEnabled' },
      { id: 'haptics-toggle', key: 'hapticsEnabled' },
      { id: 'daily-reminder-toggle', key: 'notificationsEnabled' },
      { id: 'weekly-report-toggle', key: 'weeklyReport' },
    ];

    toggles.forEach(({ id, key }) => {
      const btn = panels.study.querySelector(`#${id}`) as HTMLButtonElement;
      btn.addEventListener('click', () => {
        const newValue = !state.getState().settings[key as keyof typeof settings];
        state.updateSettings({ [key]: newValue });
        btn.classList.toggle('active', newValue);
        btn.setAttribute('aria-checked', String(newValue));
      });
    });

    panels.study.querySelector('#session-minutes')?.addEventListener('change', (e) => {
      state.updateSettings({ sessionMinutes: parseInt((e.target as HTMLInputElement).value) });
    });
    panels.study.querySelector('#break-minutes')?.addEventListener('change', (e) => {
      state.updateSettings({ breakMinutes: parseInt((e.target as HTMLInputElement).value) });
    });
    panels.study.querySelector('#reminder-time')?.addEventListener('change', (e) => {
      state.updateSettings({ dailyReminderTime: (e.target as HTMLInputElement).value });
    });
    panels.study.querySelector('#language')?.addEventListener('change', (e) => {
      state.updateSettings({ language: (e.target as HTMLSelectElement).value as any });
    });
  }

  function renderAIPanel(): void {
    panels.ai.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title">AI Provider</div>
        </div>
        <div class="card-content">
          <p class="text-sm text-[var(--color-muted)] mb-4">Configure AI provider settings in the AI Lab tab</p>
          <button id="open-ai-lab" class="btn-primary" data-lucide="external-link">Open AI Lab</button>
        </div>
      </div>
    `;
    panels.ai.querySelector('#open-ai-lab')?.addEventListener('click', () => {
      router.navigate('ai-lab');
    });
  }

  function renderDataPanel(): void {
    const { settings, syncStatus } = state.getState();
    panels.data.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title">Data Sync</div>
          <div class="card-description">Choose where your data lives</div>
        </div>
        <div class="card-content space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Sync Mode</p>
              <p class="text-sm text-[var(--color-muted)]">${settings.dataSync === 'cloud' ? 'Cloud (Convex)' : 'Local only'}</p>
            </div>
            <span class="badge ${syncStatus === 'synced' ? 'badge-success' : syncStatus === 'syncing' ? 'badge-info' : 'badge-warning'}">${syncStatus}</span>
          </div>
          <div class="grid gap-3 sm:grid-cols-2">
            <button id="sync-now" class="btn-secondary" data-lucide="refresh-cw">Sync Now</button>
            <button id="export-data" class="btn-secondary" data-lucide="download">Export JSON</button>
          </div>
          <button id="import-data" class="btn-ghost" data-lucide="upload">Import JSON</button>
          <input type="file" id="import-file" accept=".json" class="hidden" />
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Danger Zone</div>
        </div>
        <div class="card-content space-y-4">
          <div class="p-4 rounded-lg border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/5">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-[var(--color-danger)]">Reset All Data</p>
                <p class="text-sm text-[var(--color-muted)]">Permanently delete all your study data</p>
              </div>
              <button id="reset-data" class="btn-danger btn-sm">Reset</button>
            </div>
          </div>
        </div>
      </div>
    `;

    panels.data.querySelector('#sync-now')?.addEventListener('click', () => {
      state.setSyncStatus('syncing');
      setTimeout(() => {
        state.setSyncStatus('synced');
        toastSuccess('Data synced!');
      }, 1000);
    });

    panels.data.querySelector('#export-data')?.addEventListener('click', () => {
      const currentState = state.getState();
      const data = {
        user: currentState.user,
        settings: currentState.settings,
        goals: currentState.goals,
        tasks: currentState.tasks,
        sessions: currentState.sessions,
        notes: currentState.notes,
        decks: currentState.decks,
        flashcards: currentState.flashcards,
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `studyhub-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toastSuccess('Complete study data exported!');
    });

    panels.data.querySelector('#import-data')?.addEventListener('click', () => {
      (panels.data.querySelector('#import-file') as HTMLInputElement).click();
    });

    panels.data.querySelector('#import-file')?.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const data = JSON.parse(ev.target?.result as string);
            if (data.user) state.setUser(data.user);
            if (data.settings) state.updateSettings(data.settings);
            if (data.goals) {
              data.goals.forEach((g: any) => state.addGoal(g));
            }
            if (data.tasks) {
              data.tasks.forEach((t: any) => state.addTask(t));
            }
            if (data.notes) {
              data.notes.forEach((n: any) => state.addNote(n));
            }
            toastSuccess('All study data imported successfully!');
          } catch {
            toastError('Invalid backup file');
          }
        };
        reader.readAsText(file);
      }
    });

    panels.data.querySelector('#reset-data')?.addEventListener('click', () => {
      if (confirm('Are you sure? This will delete ALL your data permanently.')) {
        state.reset();
        toastSuccess('All data reset');
        setTimeout(() => location.reload(), 1000);
      }
    });
  }

  function renderAboutPanel(): void {
    panels.about.innerHTML = `
      <div class="card">
        <div class="card-content text-center py-8">
          <div class="w-20 h-20 rounded-2xl bg-[var(--color-accent)] flex items-center justify-center mx-auto mb-4">
            <i data-lucide="book-open" class="w-10 h-10 text-white"></i>
          </div>
          <h2 class="text-xl font-bold">Study Hub</h2>
          <p class="text-[var(--color-muted)] mt-1">Version 2.0.0</p>
          <p class="text-sm text-[var(--color-muted)] mt-4 max-w-md mx-auto">AI-powered study app with adaptive learning, spaced repetition, and intelligent tutoring.</p>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Links</div>
        </div>
        <div class="card-content space-y-2">
          <a href="#" class="btn-ghost w-full justify-start" data-lucide="github">GitHub Repository</a>
          <a href="#" class="btn-ghost w-full justify-start" data-lucide="book">Documentation</a>
          <a href="#" class="btn-ghost w-full justify-start" data-lucide="message-circle">Report Issue</a>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Acknowledgments</div>
        </div>
        <div class="card-content text-sm text-[var(--color-muted)] space-y-1">
          <p>Built with Vite, TypeScript, Chart.js, Lucide Icons</p>
          <p>Fonts: Space Grotesk, Crimson Pro (Google Fonts)</p>
        </div>
      </div>
    `;
  }

  render();
  return container;
}