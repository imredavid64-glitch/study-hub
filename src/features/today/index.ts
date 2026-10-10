import { state, subscribeToState } from '../../core/state.js';
import { router } from '../../core/router.js';
import { eventBus } from '../../core/events.js';
import type { StudySession, Task, Goal } from '../../core/types.js';
import { toastSuccess } from '../../ui/components/Toast.js';
import { createIcons } from 'lucide';

class AmbientAudioPlayer {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;

  private init(): void {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  play(mode: 'rain' | 'white' | 'waves', volume: number = 0.4): void {
    this.stop();
    this.init();
    if (!this.ctx) return;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    if (mode === 'white') {
      whiteNoise.connect(this.gainNode);
    } else if (mode === 'rain') {
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      whiteNoise.connect(filter);
      filter.connect(this.gainNode);
    } else if (mode === 'waves') {
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(250, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      whiteNoise.connect(filter);
      filter.connect(this.gainNode);
    }

    whiteNoise.start();
    this.noiseNode = whiteNoise;
  }

  stop(): void {
    if (this.noiseNode) {
      try { (this.noiseNode as any).stop(); } catch (e) {}
      this.noiseNode.disconnect();
      this.noiseNode = null;
    }
  }
}

const ambientAudio = new AmbientAudioPlayer();

export function todayFeature(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'space-y-6 animate-fade-in';
  container.id = 'today-feature';

  container.innerHTML = `
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" id="metrics-grid"></div>
    <div class="grid gap-4 lg:grid-cols-3" id="main-grid">
      <section class="lg:col-span-2 space-y-4" id="primary-section"></section>
      <section class="space-y-4" id="secondary-section"></section>
    </div>
  `;

  const metricsGrid = container.querySelector('#metrics-grid') as HTMLDivElement;
  const primarySection = container.querySelector('#primary-section') as HTMLElement;
  const secondarySection = container.querySelector('#secondary-section') as HTMLElement;

  function render(): void {
    const { user, settings } = state.getState();
    const sessions = getRecentSessions();
    const tasks = getTodaysTasks();
    const goals = getActiveGoals();

    renderMetrics(metricsGrid, sessions, tasks, user);
    renderPrimarySection(primarySection, sessions, tasks, goals, settings);
    renderSecondarySection(secondarySection, tasks, goals);
    createIcons();
  }

  function renderMetrics(grid: HTMLDivElement, sessions: StudySession[], tasks: Task[], user: any): void {
    const weekMins = sessions.filter(s => Date.now() - s.startedAt < 7 * 86400000).reduce((sum, s) => sum + s.actualMinutes, 0);
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const streak = calculateStreak(sessions);

    const metrics = [
      { label: 'Study Time (7d)', value: `${Math.round(weekMins / 60 * 10) / 10}h`, icon: 'clock', trend: '+12%' },
      { label: 'Tasks Done', value: `${completedTasks}/${tasks.length}`, icon: 'check-circle', trend: completedTasks > 0 ? '+3' : '' },
      { label: 'Streak', value: `${streak} day${streak !== 1 ? 's' : ''}`, icon: 'flame', trend: streak > 3 ? '🔥' : '' },
      { label: 'XP Level', value: user ? `${user.xp} XP` : '0 XP', icon: 'star', trend: '+50' },
    ];

    grid.innerHTML = metrics.map(m => `
      <div class="card p-5 hover:shadow-[var(--shadow-md)] transition-shadow">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-[var(--color-muted)]">${m.label}</p>
            <p class="text-2xl font-bold text-[var(--color-text)] mt-1">${m.value}</p>
            ${m.trend ? `<p class="text-xs text-[var(--color-success)] mt-1">${m.trend}</p>` : ''}
          </div>
          <div class="w-10 h-10 rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)] flex items-center justify-center">
            <i data-lucide="${m.icon}" class="w-5 h-5"></i>
          </div>
        </div>
      </div>
    `).join('');
  }

  function calculateStreak(sessions: StudySession[]): number {
    if (sessions.length === 0) return 0;
    const dates = [...new Set(sessions.map(s => new Date(s.startedAt).toDateString()))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const dateStr of dates) {
      const sessionDate = new Date(dateStr);
      const diff = Math.round((currentDate.getTime() - sessionDate.getTime()) / 86400000);
      if (diff === streak) {
        streak++;
      } else if (diff === streak + 1 && streak === 0) {
        streak = 1;
      } else {
        break;
      }
    }
    return streak;
  }

  function renderPrimarySection(section: HTMLElement, _sessions: StudySession[], tasks: Task[], goals: Goal[], settings: any): void {
    const nextAction = getNextAction(tasks, goals);

    section.innerHTML = `
      ${nextAction ? `
        <div class="card p-5 border-l-4 border-[var(--color-accent)] bg-[var(--color-accent-soft)]/50">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-[var(--color-accent)] text-white">${nextAction.type}</span>
                <h3 class="font-semibold text-[var(--color-text)]">Suggested: ${nextAction.title}</h3>
              </div>
              <p class="text-sm text-[var(--color-muted)]">${nextAction.reason}</p>
            </div>
            <button data-action="${nextAction.action}" class="btn-primary shrink-0">${nextAction.buttonText}</button>
          </div>
        </div>
      ` : ''}

      <div class="card p-6 space-y-4">
        <div class="card-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[var(--color-border)] pb-3">
          <div>
            <div class="card-title">Focus Timer</div>
            <div class="card-description">Pomodoro sprint with synthesized ambient sound</div>
          </div>
          <button id="open-fullscreen-focus" class="btn-secondary btn-sm" title="Distraction-free Fullscreen Focus"><i data-lucide="maximize" class="w-4 h-4 mr-1"></i>Fullscreen Mode</button>
        </div>

        <div class="card-content space-y-6">
          <div id="timer-display" class="text-center py-4">
            <div class="text-6xl font-mono font-bold text-[var(--color-text)]" id="timer-time">${settings.sessionMinutes}:00</div>
            <div class="text-sm text-[var(--color-muted)] mt-2" id="timer-status">Ready to focus</div>
          </div>

          <div class="flex items-center justify-center gap-3" id="timer-controls">
            <button id="timer-start" class="btn-primary w-32" data-lucide="play">Start</button>
            <button id="timer-pause" class="btn-secondary w-32 hidden" data-lucide="pause">Pause</button>
            <button id="timer-reset" class="btn-ghost" data-lucide="rotate-ccw">Reset</button>
          </div>

          <!-- Ambient Audio Selector -->
          <div class="pt-4 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3 text-sm">
            <div class="flex items-center gap-2">
              <i data-lucide="headphones" class="w-4 h-4 text-[var(--color-accent)]"></i>
              <span class="text-xs font-semibold text-[var(--color-muted)]">Ambient Sound:</span>
              <select id="ambient-sound-select" class="px-2.5 py-1 text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-text)]">
                <option value="off">Off (Silent)</option>
                <option value="rain">Soft Rain</option>
                <option value="waves">Ocean Waves</option>
                <option value="white">White Noise</option>
              </select>
            </div>
            <span class="text-xs text-[var(--color-muted)] font-mono">Synthesized via Web Audio</span>
          </div>
        </div>
      </div>

      ${tasks.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <div class="card-title">Today's Tasks</div>
            <div class="card-description">${tasks.filter(t => t.status !== 'done').length} remaining</div>
          </div>
          <div class="card-content">
            <ul class="space-y-2" id="tasks-list"></ul>
          </div>
        </div>
      ` : ''}
    `;

    const tasksList = section.querySelector('#tasks-list');
    if (tasksList && tasks.length > 0) {
      tasksList.innerHTML = tasks.slice(0, 5).map(task => `
        <li class="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--color-border)]/50 transition-colors">
          <input type="checkbox" ${task.status === 'done' ? 'checked' : ''} data-task-id="${task.id}" class="w-5 h-5 accent-[var(--color-accent)]">
          <div class="flex-1 min-w-0">
            <p class="font-medium text-[var(--color-text)] ${task.status === 'done' ? 'line-through text-[var(--color-muted)]' : ''}">${task.title}</p>
            <p class="text-xs text-[var(--color-muted)]">${task.subject} · ~${task.estimatedMinutes}min</p>
          </div>
          <span class="badge-${task.priority}">${task.priority}</span>
        </li>
      `).join('');

      tasksList.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', (e) => {
          const target = e.target as HTMLInputElement;
          const taskId = target.dataset.taskId;
          if (taskId) {
            state.updateTask(taskId, { status: target.checked ? 'done' : 'todo' });
            eventBus.emit({ type: 'TASK_COMPLETED', payload: { task: { id: taskId, status: target.checked ? 'done' : 'todo' } as any } });
            toastSuccess(target.checked ? 'Task completed! +15 XP' : 'Task reopened');
            render();
          }
        });
      });
    }

    const timerStart = section.querySelector('#timer-start') as HTMLButtonElement;
    const timerPause = section.querySelector('#timer-pause') as HTMLButtonElement;
    const timerReset = section.querySelector('#timer-reset') as HTMLButtonElement;
    const timerTime = section.querySelector('#timer-time') as HTMLDivElement;
    const timerStatus = section.querySelector('#timer-status') as HTMLDivElement;
    const ambientSelect = section.querySelector('#ambient-sound-select') as HTMLSelectElement;

    let timerInterval: number;
    let timeLeft = settings.sessionMinutes * 60;

    ambientSelect?.addEventListener('change', (e) => {
      const mode = (e.target as HTMLSelectElement).value as any;
      if (mode === 'off') {
        ambientAudio.stop();
      } else {
        ambientAudio.play(mode);
        toastSuccess(`Playing ${mode} ambient background sound`);
      }
    });

    function updateTimerDisplay(): void {
      const mins = Math.floor(timeLeft / 60);
      const secs = timeLeft % 60;
      timerTime.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    timerStart.addEventListener('click', () => {
      timerStart.classList.add('hidden');
      timerPause.classList.remove('hidden');
      timerStatus.textContent = 'Focusing...';

      if (ambientSelect && ambientSelect.value !== 'off') {
        ambientAudio.play(ambientSelect.value as any);
      }

      timerInterval = window.setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          ambientAudio.stop();
          timerComplete();
        }
      }, 1000);
    });

    timerPause.addEventListener('click', () => {
      clearInterval(timerInterval);
      ambientAudio.stop();
      timerStart.classList.remove('hidden');
      timerPause.classList.add('hidden');
      timerStart.textContent = 'Resume';
      timerStatus.textContent = 'Paused';
    });

    timerReset.addEventListener('click', () => {
      clearInterval(timerInterval);
      ambientAudio.stop();
      timeLeft = settings.sessionMinutes * 60;
      updateTimerDisplay();
      timerStart.classList.remove('hidden');
      timerPause.classList.add('hidden');
      timerStart.textContent = 'Start';
      timerStatus.textContent = 'Ready to focus';
    });

    function timerComplete(): void {
      timerStart.classList.remove('hidden');
      timerPause.classList.add('hidden');
      timerStart.textContent = 'Start';
      timerStatus.textContent = 'Session complete! Great work!';
      state.addStudySession({
        subject: tasks.length > 0 ? tasks[0].subject : 'General Study',
        mode: 'custom',
        plannedMinutes: settings.sessionMinutes,
        actualMinutes: settings.sessionMinutes,
        quality: 8,
        startedAt: Date.now() - settings.sessionMinutes * 60000,
        endedAt: Date.now(),
      });
      toastSuccess(`${settings.sessionMinutes}min focus session completed! +${Math.round(settings.sessionMinutes * 1.5)} XP`);
      navigator.vibrate?.([200, 100, 200]);
      render();
    }

    section.querySelector('#open-fullscreen-focus')?.addEventListener('click', () => {
      openFullscreenFocus(timeLeft, settings.sessionMinutes, tasks);
    });

    section.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLButtonElement;
        const action = target.dataset.action;
        if (action === 'start-timer') {
          timerStart.click();
        } else if (action === 'open-plan') {
          router.navigate('plan');
        } else if (action === 'open-learn') {
          router.navigate('learn');
        }
      });
    });
  }

  function openFullscreenFocus(initialTimeLeft: number, sessionMinutes: number, tasks: Task[]): void {
    const existing = document.getElementById('fullscreen-focus-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'fullscreen-focus-overlay';
    overlay.className = 'fixed inset-0 z-[120] bg-black text-white flex flex-col justify-between p-8 animate-fade-in';

    let fsTimeLeft = initialTimeLeft;
    let fsInterval: number;

    overlay.innerHTML = `
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-[var(--color-accent)] animate-ping"></span>
          <span class="font-bold text-sm tracking-wide uppercase text-gray-300">Fullscreen Focus Mode</span>
        </div>
        <button id="close-fs" class="px-3 py-1.5 rounded-lg border border-gray-700 hover:bg-gray-800 text-xs font-mono text-gray-400 hover:text-white">Exit (ESC)</button>
      </div>

      <div class="text-center space-y-6">
        <div class="text-8xl sm:text-9xl font-mono font-extrabold tracking-tight text-white" id="fs-clock">
          ${Math.floor(fsTimeLeft / 60)}:${(fsTimeLeft % 60).toString().padStart(2, '0')}
        </div>
        <p class="text-lg text-gray-400 font-medium" id="fs-task">
          Focus: ${tasks.length > 0 ? tasks[0].title : 'Deep Study Session'}
        </p>
        <div class="flex justify-center gap-4 pt-4">
          <button id="fs-start" class="btn-primary px-8 py-3 rounded-full text-base font-bold">Start Sprint</button>
          <button id="fs-pause" class="btn-secondary px-8 py-3 rounded-full text-base font-bold hidden">Pause</button>
        </div>
      </div>

      <div class="flex justify-between items-center text-xs text-gray-500">
        <span>Session length: ${sessionMinutes} minutes</span>
        <span>Study Hub Focus Protocol</span>
      </div>
    `;

    document.body.appendChild(overlay);

    const clock = overlay.querySelector('#fs-clock') as HTMLDivElement;
    const startBtn = overlay.querySelector('#fs-start') as HTMLButtonElement;
    const pauseBtn = overlay.querySelector('#fs-pause') as HTMLButtonElement;
    const closeBtn = overlay.querySelector('#close-fs') as HTMLButtonElement;

    const updateFsDisplay = () => {
      const mins = Math.floor(fsTimeLeft / 60);
      const secs = fsTimeLeft % 60;
      clock.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    startBtn.addEventListener('click', () => {
      startBtn.classList.add('hidden');
      pauseBtn.classList.remove('hidden');
      fsInterval = window.setInterval(() => {
        fsTimeLeft--;
        updateFsDisplay();
        if (fsTimeLeft <= 0) {
          clearInterval(fsInterval);
          ambientAudio.stop();
          toastSuccess('Fullscreen focus sprint completed! +50 XP');
          overlay.remove();
        }
      }, 1000);
    });

    pauseBtn.addEventListener('click', () => {
      clearInterval(fsInterval);
      startBtn.classList.remove('hidden');
      pauseBtn.classList.add('hidden');
      startBtn.textContent = 'Resume';
    });

    const exitFs = () => {
      if (fsInterval) clearInterval(fsInterval);
      overlay.remove();
      render();
    };

    closeBtn.addEventListener('click', exitFs);
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        exitFs();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);
  }

  function getNextAction(tasks: Task[], goals: Goal[]): { type: string; title: string; reason: string; action: string; buttonText: string } | null {
    if (tasks.length === 0 && goals.length === 0) {
      return { type: 'Setup', title: 'Add your first goal', reason: 'Goals help you stay focused and track progress', action: 'open-plan', buttonText: 'Create Goal' };
    }
    const pendingTasks = tasks.filter(t => t.status !== 'done');
    if (pendingTasks.length > 0) {
      const task = pendingTasks[0];
      return { type: 'Task', title: task.title, reason: `Due ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'soon'}`, action: 'start-timer', buttonText: 'Start Session' };
    }
    if (goals.length > 0) {
      const goal = goals[0];
      return { type: 'Goal', title: goal.title, reason: `${Math.ceil((goal.deadline - Date.now()) / 86400000)} days left`, action: 'open-plan', buttonText: 'View Plan' };
    }
    return null;
  }

  function renderSecondarySection(section: HTMLElement, _tasks: Task[], goals: Goal[]): void {
    section.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title">Streak Calendar</div>
          <div class="card-description">Last 4 weeks</div>
        </div>
        <div class="card-content">
          <div class="grid grid-cols-7 gap-1 text-center" id="streak-calendar"></div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Quick Actions</div>
        </div>
        <div class="card-content">
          <div class="grid grid-cols-2 gap-2">
            <button data-nav="learn" class="btn-secondary p-4 text-left hover:bg-[var(--color-border)]">
              <i data-lucide="book-open" class="w-5 h-5 mb-2 text-[var(--color-accent)]"></i>
              <p class="font-medium">Study</p>
              <p class="text-xs text-[var(--color-muted)]">Flashcards, Quiz, Recall</p>
            </button>
            <button data-nav="plan" class="btn-secondary p-4 text-left hover:bg-[var(--color-border)]">
              <i data-lucide="target" class="w-5 h-5 mb-2 text-[var(--color-accent)]"></i>
              <p class="font-medium">Plan</p>
              <p class="text-xs text-[var(--color-muted)]">Goals & Tasks</p>
            </button>
            <button data-nav="notes" class="btn-secondary p-4 text-left hover:bg-[var(--color-border)]">
              <i data-lucide="pen-tool" class="w-5 h-5 mb-2 text-[var(--color-accent)]"></i>
              <p class="font-medium">Notes</p>
              <p class="text-xs text-[var(--color-muted)]">Capture ideas</p>
            </button>
            <button data-nav="analytics" class="btn-secondary p-4 text-left hover:bg-[var(--color-border)]">
              <i data-lucide="bar-chart" class="w-5 h-5 mb-2 text-[var(--color-accent)]"></i>
              <p class="font-medium">Analytics</p>
              <p class="text-xs text-[var(--color-muted)]">Track progress</p>
            </button>
          </div>
        </div>
      </div>

      ${goals.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <div class="card-title">Active Goals</div>
          </div>
          <div class="card-content">
            <ul class="space-y-2" id="goals-list"></ul>
          </div>
        </div>
      ` : ''}
    `;

    const streakCalendar = section.querySelector('#streak-calendar') as HTMLDivElement;
    if (streakCalendar) {
      const today = new Date();
      streakCalendar.innerHTML = Array.from({ length: 28 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (27 - i));
        const dateStr = date.toDateString();
        const hasSession = getRecentSessions().some(s => new Date(s.startedAt).toDateString() === dateStr);
        const isToday = i === 27;
        return `
          <div class="relative aspect-square rounded-lg ${hasSession ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'} ${isToday ? 'ring-2 ring-[var(--color-accent)]' : ''}"
               title="${date.toLocaleDateString()}${hasSession ? ' · Studied' : ''}">
            <span class="text-xs ${hasSession ? 'text-white' : 'text-[var(--color-muted)]'}">${date.getDate()}</span>
          </div>
        `;
      }).join('');
    }

    const goalsList = section.querySelector('#goals-list');
    if (goalsList && goals.length > 0) {
      goalsList.innerHTML = goals.slice(0, 3).map(goal => `
        <li class="p-3 rounded-lg bg-[var(--color-border)]/30">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-[var(--color-text)]">${goal.title}</p>
              <p class="text-xs text-[var(--color-muted)]">${goal.subject} · ${Math.ceil((goal.deadline - Date.now()) / 86400000)}d left</p>
            </div>
            <div class="w-20">
              <progress value="${goal.progress}" max="100" class="w-full h-2"></progress>
            </div>
          </div>
        </li>
      `).join('');
    }

    section.querySelectorAll('[data-nav]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLButtonElement;
        router.navigate(target.dataset.nav as any);
      });
    });
  }

  function getRecentSessions(): StudySession[] {
    return state.getState().sessions;
  }

  function getTodaysTasks(): Task[] {
    return state.getState().tasks;
  }

  function getActiveGoals(): Goal[] {
    return state.getState().goals.filter(g => g.status === 'active');
  }

  render();

  subscribeToState(s => s.currentTab, (tab) => {
    if (tab === 'today') render();
  });

  return container;
}
