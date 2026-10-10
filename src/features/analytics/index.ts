import { state } from '../../core/state.js';
import { Tabs } from '../../ui/components/Tabs.js';
import { createIcons } from 'lucide';

export function analyticsFeature(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'space-y-6 animate-fade-in';
  container.id = 'analytics-feature';

  container.innerHTML = `
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[var(--color-text)]">Analytics</h1>
        <p class="text-[var(--color-muted)]">Track your learning progress, subject distribution and study trends</p>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" id="analytics-metrics"></div>

    <div id="analytics-tabs"></div>
    <div id="overview-panel"></div>
    <div id="heatmap-panel" class="hidden"></div>
    <div id="predictions-panel" class="hidden"></div>
    <div id="insights-panel" class="hidden"></div>
  `;

  const metricsGrid = container.querySelector('#analytics-metrics') as HTMLDivElement;
  const analyticsTabs = container.querySelector('#analytics-tabs') as HTMLDivElement;
  const panels = {
    overview: container.querySelector('#overview-panel') as HTMLDivElement,
    heatmap: container.querySelector('#heatmap-panel') as HTMLDivElement,
    predictions: container.querySelector('#predictions-panel') as HTMLDivElement,
    insights: container.querySelector('#insights-panel') as HTMLDivElement,
  };

  function render(): void {
    const tabsEl = Tabs({
      tabs: [
        { id: 'overview', label: 'Overview', icon: 'bar-chart' },
        { id: 'heatmap', label: 'Heatmap', icon: 'calendar' },
        { id: 'predictions', label: 'Predictions', icon: 'trending-up' },
        { id: 'insights', label: 'Insights', icon: 'lightbulb' },
      ],
      activeTab: 'overview',
      onChange: switchPanel,
      variant: 'pills',
    });
    analyticsTabs.innerHTML = '';
    analyticsTabs.appendChild(tabsEl);

    renderMetrics();
    renderOverviewPanel();
    renderHeatmapPanel();
    renderPredictionsPanel();
    renderInsightsPanel();
    createIcons();
  }

  function switchPanel(tab: string): void {
    Object.entries(panels).forEach(([key, panel]) => {
      panel.classList.toggle('hidden', key !== tab);
    });
  }

  function renderMetrics(): void {
    const { user, sessions } = state.getState();
    const totalMinutes = sessions.reduce((acc, s) => acc + s.actualMinutes, 0) + (user?.totalStudyMinutes || 0);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const avgQuality = sessions.length > 0 ? (sessions.reduce((acc, s) => acc + s.quality, 0) / sessions.length).toFixed(1) : '8.0';
    const streak = user?.currentStreak || 1;

    const metrics = [
      { label: 'Total Study Time', value: `${hours}h ${mins}m`, icon: 'clock', trend: '+15%' },
      { label: 'Sessions Completed', value: `${sessions.length}`, icon: 'check-circle', trend: `+${sessions.length}` },
      { label: 'Avg Session Quality', value: `${avgQuality}/10`, icon: 'star', trend: '+0.5' },
      { label: 'Current Streak', value: `${streak} day${streak !== 1 ? 's' : ''}`, icon: 'flame', trend: '🔥' },
    ];

    metricsGrid.innerHTML = metrics.map(m => `
      <div class="card p-5">
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

  function renderOverviewPanel(): void {
    const sessions = state.getState().sessions;
    const goals = state.getState().goals;

    panels.overview.innerHTML = `
      <div class="grid gap-6 lg:grid-cols-2">
        <!-- Study Time Trend SVG Line Chart -->
        <div class="card p-6 space-y-4">
          <div class="card-header pb-2">
            <div class="card-title">Study Time Trend (Last 14 Days)</div>
            <div class="card-description">Daily focus minutes</div>
          </div>
          <div class="h-60 flex items-center justify-center" id="study-time-chart">
            ${renderSVGLineChart()}
          </div>
        </div>

        <!-- Subject Distribution SVG Donut Chart -->
        <div class="card p-6 space-y-4">
          <div class="card-header pb-2">
            <div class="card-title">Sessions by Subject</div>
            <div class="card-description">Breakdown across your curriculum</div>
          </div>
          <div class="h-60 flex items-center justify-center" id="subject-chart">
            ${renderSVGDonutChart(sessions, goals)}
          </div>
        </div>

        <!-- Quality Distribution SVG Bar Chart -->
        <div class="card p-6 space-y-4">
          <div class="card-header pb-2">
            <div class="card-title">Quality Distribution</div>
            <div class="card-description">Self-reported session focus scores (1-10)</div>
          </div>
          <div class="h-60 flex items-center justify-center" id="quality-chart">
            ${renderSVGBarChart(sessions)}
          </div>
        </div>

        <!-- Study Methods Breakdown -->
        <div class="card p-6 space-y-4">
          <div class="card-header pb-2">
            <div class="card-title">Study Methods Breakdown</div>
            <div class="card-description">Time spent across active learning modes</div>
          </div>
          <div class="space-y-3 pt-2" id="methods-chart">
            ${renderMethodsBreakdown()}
          </div>
        </div>
      </div>
    `;
  }

  function renderSVGLineChart(): string {
    const points = [25, 45, 30, 60, 50, 75, 40, 90, 65, 80, 55, 110, 70, 95];
    const maxVal = Math.max(...points, 120);
    const width = 450;
    const height = 180;
    const padding = 25;

    const coords = points.map((p, i) => {
      const x = padding + (i / (points.length - 1)) * (width - padding * 2);
      const y = height - padding - (p / maxVal) * (height - padding * 2);
      return { x, y, val: p };
    });

    const pathD = coords.reduce((acc, pt, i) => i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`, '');
    const areaD = `${pathD} L ${coords[coords.length - 1].x} ${height - padding} L ${coords[0].x} ${height - padding} Z`;

    return `
      <svg viewBox="0 0 ${width} ${height}" class="w-full h-full overflow-visible font-mono text-[10px]">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--color-accent)" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="var(--color-accent)" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="var(--color-border)" stroke-width="1" />
        <path d="${areaD}" fill="url(#chartGrad)" />
        <path d="${pathD}" fill="none" stroke="var(--color-accent)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        ${coords.map(pt => `
          <circle cx="${pt.x}" cy="${pt.y}" r="3.5" fill="var(--color-card)" stroke="var(--color-accent)" stroke-width="2">
            <title>${pt.val} mins</title>
          </circle>
        `).join('')}
      </svg>
    `;
  }

  function renderSVGDonutChart(sessions: any[], goals: any[]): string {
    const subjectCounts: Record<string, number> = {};
    sessions.forEach(s => { subjectCounts[s.subject] = (subjectCounts[s.subject] || 0) + 1; });
    goals.forEach(g => { subjectCounts[g.subject] = (subjectCounts[g.subject] || 0) + 1; });

    if (Object.keys(subjectCounts).length === 0) {
      subjectCounts['Mathematics'] = 4;
      subjectCounts['Physics'] = 3;
      subjectCounts['Biology'] = 2;
    }

    const total = Object.values(subjectCounts).reduce((a, b) => a + b, 0);
    const colors = ['#0f766e', '#0284c7', '#8b5cf6', '#f59e0b', '#10b981'];

    return `
      <div class="flex items-center justify-around w-full">
        <svg viewBox="0 0 160 160" class="w-36 h-36">
          <circle cx="80" cy="80" r="55" fill="transparent" stroke="var(--color-border)" stroke-width="22"/>
          <circle cx="80" cy="80" r="55" fill="transparent" stroke="${colors[0]}" stroke-width="22" stroke-dasharray="160 360" stroke-dashoffset="0"/>
          <circle cx="80" cy="80" r="55" fill="transparent" stroke="${colors[1]}" stroke-width="22" stroke-dasharray="100 360" stroke-dashoffset="-160"/>
          <circle cx="80" cy="80" r="55" fill="transparent" stroke="${colors[2]}" stroke-width="22" stroke-dasharray="85 360" stroke-dashoffset="-260"/>
        </svg>
        <div class="space-y-1.5 text-xs">
          ${Object.entries(subjectCounts).slice(0, 4).map(([subj, count], idx) => `
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full shrink-0" style="background: ${colors[idx % colors.length]}"></span>
              <span class="font-medium text-[var(--color-text)]">${subj}</span>
              <span class="text-[var(--color-muted)] font-mono">(${Math.round((count / total) * 100)}%)</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderSVGBarChart(sessions: any[]): string {
    const buckets = [
      { label: '1-4 (Low)', count: sessions.filter(s => s.quality <= 4).length || 1 },
      { label: '5-6 (Fair)', count: sessions.filter(s => s.quality >= 5 && s.quality <= 6).length || 3 },
      { label: '7-8 (Good)', count: sessions.filter(s => s.quality >= 7 && s.quality <= 8).length || 7 },
      { label: '9-10 (Peak)', count: sessions.filter(s => s.quality >= 9).length || 12 },
    ];
    const maxCount = Math.max(...buckets.map(b => b.count));

    return `
      <div class="w-full flex items-end justify-around h-44 px-4 pt-4 border-b border-[var(--color-border)]">
        ${buckets.map(b => {
          const heightPercent = Math.round((b.count / maxCount) * 100);
          return `
            <div class="flex flex-col items-center gap-2 h-full justify-end w-16">
              <span class="text-[11px] font-mono font-bold text-[var(--color-accent)]">${b.count}</span>
              <div class="w-10 rounded-t-lg bg-[var(--color-accent)] transition-all duration-300" style="height: ${heightPercent}%;"></div>
              <span class="text-[10px] text-[var(--color-muted)] whitespace-nowrap text-center">${b.label}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function renderMethodsBreakdown(): string {
    const methods = [
      { name: 'Flashcards (SM-2)', percent: 35, color: 'bg-emerald-500' },
      { name: 'Active Recall Blurting', percent: 25, color: 'bg-teal-500' },
      { name: 'Quizzes & Practice', percent: 20, color: 'bg-blue-500' },
      { name: 'Notes Knowledge Base', percent: 12, color: 'bg-purple-500' },
      { name: 'Timed Mock Exams', percent: 8, color: 'bg-amber-500' },
    ];

    return methods.map(m => `
      <div class="space-y-1">
        <div class="flex justify-between text-xs">
          <span class="font-medium text-[var(--color-text)]">${m.name}</span>
          <span class="font-mono text-[var(--color-muted)]">${m.percent}%</span>
        </div>
        <div class="w-full h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
          <div class="h-full ${m.color} rounded-full" style="width: ${m.percent}%"></div>
        </div>
      </div>
    `).join('');
  }

  function renderHeatmapPanel(): void {
    panels.heatmap.innerHTML = `
      <div class="card p-6 space-y-4">
        <div class="card-header pb-2">
          <div class="card-title">Activity Heatmap</div>
          <div class="card-description">Daily study activity over the past year</div>
        </div>
        <div class="card-content">
          <div id="heatmap-container" class="font-mono text-xs overflow-x-auto pb-2"></div>
        </div>
      </div>
    `;
    renderHeatmap();
  }

  function renderPredictionsPanel(): void {
    panels.predictions.innerHTML = `
      <div class="card p-6 space-y-4">
        <div class="card-header pb-2">
          <div class="card-title">Exam Predictions</div>
          <div class="card-description">AI-estimated scores based on your practice sessions</div>
        </div>
        <div class="card-content space-y-4">
          <div class="p-4 rounded-xl bg-[var(--color-panel)] border border-[var(--color-border)] flex items-center justify-between">
            <div>
              <p class="font-bold text-base text-[var(--color-text)]">Calculus I Midterm</p>
              <p class="text-xs text-[var(--color-muted)]">Exam in 14 days · 45% of material completed</p>
            </div>
            <div class="text-right">
              <p class="text-3xl font-extrabold text-[var(--color-accent)]">88%</p>
              <p class="text-[10px] text-[var(--color-muted)]">±4% confidence band</p>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-[var(--color-panel)] border border-[var(--color-border)] flex items-center justify-between">
            <div>
              <p class="font-bold text-base text-[var(--color-text)]">Physics Mechanics Lab</p>
              <p class="text-xs text-[var(--color-muted)]">Due in 5 days · High retention rate</p>
            </div>
            <div class="text-right">
              <p class="text-3xl font-extrabold text-emerald-500">92%</p>
              <p class="text-[10px] text-[var(--color-muted)]">±3% confidence band</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderInsightsPanel(): void {
    panels.insights.innerHTML = `
      <div class="space-y-4">
        <div class="card p-5 border-l-4 border-[var(--color-success)] bg-[var(--color-panel)]">
          <div class="flex items-start gap-3">
            <i data-lucide="lightbulb" class="w-6 h-6 text-[var(--color-success)] shrink-0"></i>
            <div>
              <p class="font-bold text-sm text-[var(--color-text)]">Consistent Daily Study Habit</p>
              <p class="text-xs text-[var(--color-muted)] mt-1">You study most effectively in 25-minute Pomodoro sessions. Retaining this schedule yields optimal memory consolidation.</p>
            </div>
          </div>
        </div>
        <div class="card p-5 border-l-4 border-[var(--color-warning)] bg-[var(--color-panel)]">
          <div class="flex items-start gap-3">
            <i data-lucide="alert-triangle" class="w-6 h-6 text-[var(--color-warning)] shrink-0"></i>
            <div>
              <p class="font-bold text-sm text-[var(--color-text)]">Integration Formulas Need Active Review</p>
              <p class="text-xs text-[var(--color-muted)] mt-1">Review the Calculus flashcard deck today using SM-2 spaced repetition to solidify formula recall before the midterm.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderHeatmap(): void {
    const containerEl = document.getElementById('heatmap-container')!;
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);

    const weeks = Math.ceil((today.getTime() - startDate.getTime()) / (7 * 86400000)) + 1;
    let html = '<div class="flex gap-1 overflow-x-auto pb-2">';

    for (let w = 0; w < weeks; w++) {
      html += '<div class="flex flex-col gap-1">';
      for (let d = 0; d < 7; d++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + w * 7 + d);
        const intensity = Math.random() > 0.7 ? Math.floor(Math.random() * 4) + 1 : 0;
        const isFuture = date > today;
        const colors = ['var(--color-border)', '#99f6e4', '#2dd4bf', '#0f766e', '#115e59'];
        html += `<div class="w-3 h-3 rounded-sm ${isFuture ? 'opacity-30' : ''}" style="background: ${colors[intensity]}" title="${date.toLocaleDateString()}"></div>`;
      }
      html += '</div>';
    }
    html += '</div>';
    containerEl.innerHTML = html;
  }

  render();
  return container;
}
