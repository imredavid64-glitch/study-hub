import { state } from '../../core/state.js';
import { Modal } from '../../ui/components/Modal.js';
import { Input, Select, Textarea } from '../../ui/components/Input.js';
import { Tabs } from '../../ui/components/Tabs.js';
import { toastSuccess, toastError } from '../../ui/components/Toast.js';
import { createIcons } from 'lucide';
import type { Task } from '../../core/types.js';

export function planFeature(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'space-y-6 animate-fade-in';
  container.id = 'plan-feature';

  container.innerHTML = `
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[var(--color-text)]">Plan</h1>
        <p class="text-[var(--color-muted)]">Goals, tasks, and AI study plans</p>
      </div>
      <button id="add-goal-btn" class="btn-primary" data-lucide="plus">New Goal</button>
    </div>

    <div id="plan-tabs"></div>
    <div id="goals-panel"></div>
    <div id="tasks-panel" class="hidden"></div>
    <div id="ai-plan-panel" class="hidden"></div>
    <div id="modal-container"></div>
  `;

  const planTabs = container.querySelector('#plan-tabs') as HTMLDivElement;
  const goalsPanel = container.querySelector('#goals-panel') as HTMLDivElement;
  const tasksPanel = container.querySelector('#tasks-panel') as HTMLDivElement;
  const aiPlanPanel = container.querySelector('#ai-plan-panel') as HTMLDivElement;
  const modalContainer = container.querySelector('#modal-container') as HTMLDivElement;

  function render(): void {
    const tabsEl = Tabs({
      tabs: [
        { id: 'goals', label: 'Goals', icon: 'target' },
        { id: 'tasks', label: 'Tasks', icon: 'check-square' },
        { id: 'ai-plan', label: 'AI Plan', icon: 'cpu' },
      ],
      activeTab: 'goals',
      onChange: (tab) => switchPanel(tab),
      variant: 'pills',
    });
    planTabs.innerHTML = '';
    planTabs.appendChild(tabsEl);

    renderGoalsPanel();
    renderTasksPanel();
    renderAIPlanPanel();
  }

  function switchPanel(tab: string): void {
    goalsPanel.classList.toggle('hidden', tab !== 'goals');
    tasksPanel.classList.toggle('hidden', tab !== 'tasks');
    aiPlanPanel.classList.toggle('hidden', tab !== 'ai-plan');
    if (tab === 'goals') renderGoalsPanel();
    if (tab === 'tasks') renderTasksPanel();
    if (tab === 'ai-plan') renderAIPlanPanel();
  }

  function renderGoalsPanel(): void {
    const goals = state.getState().goals;
    goalsPanel.innerHTML = `
      <div class="card">
        <div class="card-header flex items-center justify-between">
          <div>
            <div class="card-title">Your Goals</div>
            <div class="card-description">Track progress toward your targets</div>
          </div>
          <button id="new-goal-inner-btn" class="btn-primary btn-sm" data-lucide="plus">Add Goal</button>
        </div>
        <div class="card-content">
          <div id="goals-list" class="space-y-4">
            ${goals.length === 0 ? `
              <div class="text-center py-8 text-[var(--color-muted)]">
                <i data-lucide="target" class="w-12 h-12 mx-auto mb-4 opacity-50"></i>
                <p>No goals yet. Create your first goal to get started!</p>
              </div>
            ` : goals.map(goal => `
              <div class="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] space-y-3">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--color-accent-soft)] text-[var(--color-accent)]">${goal.subject}</span>
                      <h3 class="font-semibold text-[var(--color-text)]">${goal.title}</h3>
                    </div>
                    ${goal.description ? `<p class="text-sm text-[var(--color-muted)] mt-1">${goal.description}</p>` : ''}
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <span class="text-xs px-2 py-1 rounded bg-[var(--color-border)] text-[var(--color-muted)]">${goal.priority.toUpperCase()}</span>
                    <button data-delete-goal="${goal.id}" class="text-[var(--color-muted)] hover:text-red-500 p-1" title="Delete Goal"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                  </div>
                </div>
                <div class="space-y-1">
                  <div class="flex justify-between text-xs text-[var(--color-muted)]">
                    <span>Progress (${goal.progress}%)</span>
                    <span>Deadline: ${new Date(goal.deadline).toLocaleDateString()}</span>
                  </div>
                  <div class="w-full h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
                    <div class="h-full bg-[var(--color-accent)] transition-all duration-300" style="width: ${goal.progress}%"></div>
                  </div>
                </div>
                <div class="flex justify-between items-center pt-2 text-xs">
                  <span class="text-[var(--color-muted)]">Target: ${goal.targetHours} hours</span>
                  <div class="flex gap-2">
                    <button data-update-progress="${goal.id}" data-progress="${Math.min(100, goal.progress + 10)}" class="btn-secondary btn-sm">+10%</button>
                    ${goal.progress < 100 ? `<button data-update-progress="${goal.id}" data-progress="100" class="btn-primary btn-sm">Complete</button>` : `<span class="badge badge-success">Completed</span>`}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    goalsPanel.querySelector('#new-goal-inner-btn')?.addEventListener('click', () => openGoalModal());

    goalsPanel.querySelectorAll('[data-delete-goal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).dataset.deleteGoal!;
        state.deleteGoal(id);
        toastSuccess('Goal deleted');
        renderGoalsPanel();
      });
    });

    goalsPanel.querySelectorAll('[data-update-progress]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const id = target.dataset.updateProgress!;
        const progress = parseInt(target.dataset.progress!);
        state.updateGoal(id, { progress, status: progress >= 100 ? 'completed' : 'active' });
        toastSuccess('Goal progress updated!');
        renderGoalsPanel();
      });
    });

    createIcons();
  }

  function renderTasksPanel(): void {
    const tasks = state.getState().tasks;
    const todo = tasks.filter(t => t.status === 'todo');
    const inProgress = tasks.filter(t => t.status === 'in_progress');
    const done = tasks.filter(t => t.status === 'done');

    tasksPanel.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="flex items-center justify-between">
            <div>
              <div class="card-title">Tasks</div>
              <div class="card-description">Organize with Kanban board</div>
            </div>
            <button id="add-task-btn" class="btn-primary btn-sm" data-lucide="plus">Add Task</button>
          </div>
        </div>
        <div class="card-content">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="kanban-board">
            ${renderKanbanColumn('To Do', 'todo', todo)}
            ${renderKanbanColumn('In Progress', 'in_progress', inProgress)}
            ${renderKanbanColumn('Done', 'done', done)}
          </div>
        </div>
      </div>
    `;

    tasksPanel.querySelector('#add-task-btn')?.addEventListener('click', () => openTaskModal());

    tasksPanel.querySelectorAll('[data-move-task]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const taskId = target.dataset.moveTask!;
        const nextStatus = target.dataset.nextStatus as any;
        state.updateTask(taskId, { status: nextStatus });
        toastSuccess(`Task moved to ${nextStatus.replace('_', ' ')}`);
        renderTasksPanel();
      });
    });

    tasksPanel.querySelectorAll('[data-delete-task]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const taskId = (e.currentTarget as HTMLElement).dataset.deleteTask!;
        state.deleteTask(taskId);
        toastSuccess('Task deleted');
        renderTasksPanel();
      });
    });

    createIcons();
  }

  function renderKanbanColumn(title: string, status: Task['status'], items: Task[]): string {
    return `
      <div class="kanban-column" data-status="${status}">
        <h4 class="font-medium text-[var(--color-muted)] mb-3 flex items-center justify-between">
          <span>${title}</span>
          <span class="badge badge-sm">${items.length}</span>
        </h4>
        <div class="space-y-3 min-h-[220px] p-3 rounded-xl bg-[var(--color-border)]/20 border border-[var(--color-border)]/50">
          ${items.length === 0 ? `<p class="text-xs text-center text-[var(--color-muted)] py-8">No tasks</p>` : items.map(t => `
            <div class="p-3.5 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm space-y-2">
              <div class="flex items-start justify-between gap-2">
                <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--color-accent-soft)] text-[var(--color-accent)]">${t.subject}</span>
                <button data-delete-task="${t.id}" class="text-[var(--color-muted)] hover:text-red-500 text-xs"><i data-lucide="x" class="w-3.5 h-3.5"></i></button>
              </div>
              <p class="text-sm font-medium text-[var(--color-text)]">${t.title}</p>
              ${t.description ? `<p class="text-xs text-[var(--color-muted)]">${t.description}</p>` : ''}
              <div class="flex items-center justify-between pt-2 border-t border-[var(--color-border)] text-xs text-[var(--color-muted)]">
                <span>~${t.estimatedMinutes}m</span>
                <div class="flex gap-1">
                  ${status !== 'todo' ? `<button data-move-task="${t.id}" data-next-status="todo" class="px-1.5 py-0.5 rounded bg-[var(--color-border)] hover:bg-[var(--color-accent)] hover:text-white transition-colors" title="Move to To Do">←</button>` : ''}
                  ${status !== 'in_progress' ? `<button data-move-task="${t.id}" data-next-status="in_progress" class="px-1.5 py-0.5 rounded bg-[var(--color-border)] hover:bg-[var(--color-accent)] hover:text-white transition-colors" title="Move to In Progress">▶</button>` : ''}
                  ${status !== 'done' ? `<button data-move-task="${t.id}" data-next-status="done" class="px-1.5 py-0.5 rounded bg-[var(--color-border)] hover:bg-[var(--color-accent)] hover:text-white transition-colors" title="Move to Done">✓</button>` : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderAIPlanPanel(): void {
    aiPlanPanel.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title">AI Study Plan Generator</div>
          <div class="card-description">Generate a personalized study schedule and convert to tasks</div>
        </div>
        <div class="card-content">
          <form id="ai-plan-form" class="space-y-4">
            <div class="grid gap-4 sm:grid-cols-2">
              ${Input({ label: 'Subject / Exam', placeholder: 'e.g., Calculus Midterm', required: true, id: 'plan-subject' })}
              ${Input({ label: 'Specific Topics (optional)', placeholder: 'e.g., derivatives, integrals, limits', id: 'plan-topics' })}
            </div>
            <div class="grid gap-4 sm:grid-cols-3">
              ${Input({ label: 'Days Until Exam', type: 'number', min: '1', max: '90', value: '7', required: true, id: 'plan-days' })}
              ${Input({ label: 'Hours per Day', type: 'number', min: '0.5', max: '8', step: '0.5', value: '2', required: true, id: 'plan-hours' })}
              ${Select({ label: 'Intensity', options: [
                { value: 'light', label: 'Light (30-45 min/day)' },
                { value: 'moderate', label: 'Moderate (1-2 hrs/day)' },
                { value: 'intense', label: 'Intense (3+ hrs/day)' }
              ], id: 'plan-intensity' })}
            </div>
            <div class="flex justify-end">
              <button type="submit" class="btn-primary" data-lucide="cpu">Generate Plan</button>
            </div>
          </form>
          <div id="generated-plan" class="mt-6 hidden"></div>
        </div>
      </div>
    `;

    const form = aiPlanPanel.querySelector('#ai-plan-form') as HTMLFormElement;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const subject = (form.querySelector('#plan-subject') as HTMLInputElement).value;
      const topics = (form.querySelector('#plan-topics') as HTMLInputElement).value;
      const days = parseInt((form.querySelector('#plan-days') as HTMLInputElement).value);
      const hours = parseFloat((form.querySelector('#plan-hours') as HTMLInputElement).value);
      const intensity = (form.querySelector('#plan-intensity') as HTMLSelectElement).value;

      const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i data-lucide="loader" class="w-4 h-4 animate-spin mr-2"></i>Generating...';

      try {
        const plan = await generateAIStudyPlan(subject, topics, days, hours, intensity);
        renderGeneratedPlan(plan);
      } catch (error) {
        toastError('Failed to generate plan. Please try again.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i data-lucide="cpu" class="w-4 h-4 mr-2"></i>Generate Plan';
        createIcons();
      }
    });

    createIcons();
  }

  function renderGeneratedPlan(plan: any): void {
    const containerPlan = aiPlanPanel.querySelector('#generated-plan') as HTMLDivElement;
    containerPlan.classList.remove('hidden');
    containerPlan.innerHTML = `
      <div class="card p-5 border-l-4 border-[var(--color-accent)] bg-[var(--color-accent-soft)]/30 space-y-4">
        <div>
          <h3 class="font-bold text-lg text-[var(--color-text)]">${plan.subject} Study Plan (${plan.days} days)</h3>
          <p class="text-sm text-[var(--color-muted)]">${plan.dailyMinutes} min/day · ${plan.intensity} intensity</p>
        </div>
        <div class="space-y-3 max-h-80 overflow-y-auto">
          ${plan.phases.map((phase: any, i: number) => `
            <div class="p-4 rounded-xl bg-[var(--color-panel)] border border-[var(--color-border)] space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-semibold text-sm">Phase ${i + 1}: ${phase.name}</span>
                <span class="badge badge-sm badge-accent">${phase.estimatedMinutes} min total</span>
              </div>
              <p class="text-sm text-[var(--color-muted)]">${phase.description}</p>
              <div class="flex flex-wrap gap-1 mt-1">
                ${phase.topics.map((t: string) => `<span class="px-2 py-0.5 rounded text-xs bg-[var(--color-border)] text-[var(--color-text)]">${t}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        <div class="flex gap-3 pt-2">
          <button class="btn-primary btn-sm" id="save-plan-btn"><i data-lucide="save" class="w-4 h-4 mr-1"></i>Save to Planner</button>
        </div>
      </div>
    `;

    containerPlan.querySelector('#save-plan-btn')?.addEventListener('click', () => {
      const goal = state.addGoal({
        title: `${plan.subject} Preparation`,
        subject: plan.subject,
        description: `Generated AI Study Plan (${plan.days} days)`,
        deadline: Date.now() + plan.days * 86400000,
        targetHours: Math.round((plan.dailyMinutes * plan.days) / 60),
        priority: 'high',
        status: 'active',
        progress: 0,
        milestones: plan.phases.map((p: any) => ({
          id: 'm-' + Date.now() + Math.random(),
          goalId: '',
          title: p.name,
          description: p.description,
          targetDate: Date.now() + 3 * 86400000,
          status: 'pending',
        })),
      });

      plan.phases.forEach((phase: any) => {
        state.addTask({
          goalId: goal.id,
          title: `${phase.name}: ${phase.topics.join(', ')}`,
          subject: plan.subject,
          description: phase.description,
          estimatedMinutes: Math.round(phase.estimatedMinutes / 3),
          status: 'todo',
          priority: 'high',
          tags: ['ai-plan', plan.subject.toLowerCase()],
        });
      });

      toastSuccess(`Created goal and ${plan.phases.length} tasks!`);
      switchPanel('goals');
    });

    createIcons();
  }

  async function generateAIStudyPlan(subject: string, topicsStr: string, days: number, hours: number, intensity: string): Promise<any> {
    await new Promise(r => setTimeout(r, 1000));
    const topics = topicsStr ? topicsStr.split(',').map(t => t.trim()).filter(Boolean) : [subject];
    const dailyMinutes = Math.round(hours * 60);
    const phases = [
      { name: 'Foundational Concepts', description: 'Review key formulas, terms, and core theory.', topics: topics.slice(0, 2), estimatedMinutes: dailyMinutes * 2 },
      { name: 'Active Practice & Problem Solving', description: 'Solve sample problems and complete active recall.', topics: topics.slice(1, 4), estimatedMinutes: dailyMinutes * 3 },
      { name: 'Timed Mock & Final Review', description: 'Simulate test conditions and address remaining weak spots.', topics: ['Comprehensive Review'], estimatedMinutes: dailyMinutes * 2 },
    ];
    return { subject, days, dailyMinutes, intensity, phases };
  }

  function openGoalModal(): void {
    modalContainer.innerHTML = '';
    const body = document.createElement('div');
    body.innerHTML = `
      <form id="create-goal-form" class="space-y-4">
        ${Input({ label: 'Goal Title', placeholder: 'e.g., Master Data Structures', required: true, id: 'new-goal-title' })}
        ${Input({ label: 'Subject', placeholder: 'e.g., Computer Science', required: true, id: 'new-goal-subject' })}
        ${Textarea({ label: 'Description', placeholder: 'What do you want to accomplish?', id: 'new-goal-desc' })}
        <div class="grid gap-4 sm:grid-cols-2">
          ${Input({ label: 'Deadline', type: 'date', required: true, id: 'new-goal-deadline', value: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0] })}
          ${Input({ label: 'Target Hours', type: 'number', min: '1', max: '200', value: '15', required: true, id: 'new-goal-hours' })}
        </div>
        ${Select({ label: 'Priority', options: [
          { value: 'high', label: 'High' },
          { value: 'medium', label: 'Medium' },
          { value: 'low', label: 'Low' }
        ], id: 'new-goal-priority' })}
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" id="cancel-goal-btn" class="btn-secondary">Cancel</button>
          <button type="submit" class="btn-primary">Create Goal</button>
        </div>
      </form>
    `;

    const modalEl = Modal({
      isOpen: true,
      title: 'Create New Goal',
      description: 'Set a clear academic or study milestone',
      onClose: () => { modalContainer.innerHTML = ''; },
      children: body,
    });
    modalContainer.appendChild(modalEl);

    body.querySelector('#cancel-goal-btn')?.addEventListener('click', () => { modalContainer.innerHTML = ''; });

    body.querySelector('#create-goal-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = (body.querySelector('#new-goal-title') as HTMLInputElement).value;
      const subject = (body.querySelector('#new-goal-subject') as HTMLInputElement).value;
      const description = (body.querySelector('#new-goal-desc') as HTMLTextAreaElement).value;
      const deadlineStr = (body.querySelector('#new-goal-deadline') as HTMLInputElement).value;
      const targetHours = parseInt((body.querySelector('#new-goal-hours') as HTMLInputElement).value);
      const priority = (body.querySelector('#new-goal-priority') as HTMLSelectElement).value as any;

      state.addGoal({
        title,
        subject,
        description,
        deadline: new Date(deadlineStr).getTime(),
        targetHours,
        priority,
        status: 'active',
        progress: 0,
        milestones: [],
      });

      toastSuccess('Goal created!');
      modalContainer.innerHTML = '';
      renderGoalsPanel();
    });
  }

  function openTaskModal(): void {
    modalContainer.innerHTML = '';
    const goals = state.getState().goals;
    const body = document.createElement('div');
    body.innerHTML = `
      <form id="create-task-form" class="space-y-4">
        ${Input({ label: 'Task Title', placeholder: 'e.g., Read pages 40-60', required: true, id: 'new-task-title' })}
        <div class="grid gap-4 sm:grid-cols-2">
          ${Input({ label: 'Subject', placeholder: 'e.g., Physics', required: true, id: 'new-task-subject' })}
          ${Input({ label: 'Estimated Minutes', type: 'number', min: '5', max: '300', value: '30', required: true, id: 'new-task-mins' })}
        </div>
        ${Textarea({ label: 'Description', placeholder: 'Additional details or subtasks', id: 'new-task-desc' })}
        ${Select({ label: 'Associate with Goal (Optional)', options: [
          { value: '', label: 'None' },
          ...goals.map(g => ({ value: g.id, label: `${g.title} (${g.subject})` }))
        ], id: 'new-task-goal' })}
        ${Select({ label: 'Priority', options: [
          { value: 'high', label: 'High' },
          { value: 'medium', label: 'Medium' },
          { value: 'low', label: 'Low' }
        ], id: 'new-task-priority' })}
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" id="cancel-task-btn" class="btn-secondary">Cancel</button>
          <button type="submit" class="btn-primary">Add Task</button>
        </div>
      </form>
    `;

    const modalEl = Modal({
      isOpen: true,
      title: 'Add New Task',
      description: 'Break down your goals into actionable tasks',
      onClose: () => { modalContainer.innerHTML = ''; },
      children: body,
    });
    modalContainer.appendChild(modalEl);

    body.querySelector('#cancel-task-btn')?.addEventListener('click', () => { modalContainer.innerHTML = ''; });

    body.querySelector('#create-task-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = (body.querySelector('#new-task-title') as HTMLInputElement).value;
      const subject = (body.querySelector('#new-task-subject') as HTMLInputElement).value;
      const estimatedMinutes = parseInt((body.querySelector('#new-task-mins') as HTMLInputElement).value);
      const description = (body.querySelector('#new-task-desc') as HTMLTextAreaElement).value;
      const goalId = (body.querySelector('#new-task-goal') as HTMLSelectElement).value || undefined;
      const priority = (body.querySelector('#new-task-priority') as HTMLSelectElement).value as any;

      state.addTask({
        title,
        subject,
        estimatedMinutes,
        description,
        goalId,
        priority,
        status: 'todo',
        tags: [subject.toLowerCase()],
      });

      toastSuccess('Task added!');
      modalContainer.innerHTML = '';
      renderTasksPanel();
    });
  }

  container.querySelector('#add-goal-btn')?.addEventListener('click', () => openGoalModal());

  render();
  return container;
}
