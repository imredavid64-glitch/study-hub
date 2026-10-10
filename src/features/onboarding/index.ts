import { state } from '../../core/state.js';
import { router } from '../../core/router.js';
import { Input, Select } from '../../ui/components/Input.js';
import { ONBOARDING_STEPS } from '../../core/config.js';
import { toastError, toastSuccess } from '../../ui/components/Toast.js';
import * as lucide from 'lucide';

type OnboardingStepId = 'profile' | 'subjects' | 'first-goal';

export function onboardingFeature(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'min-h-screen flex items-center justify-center p-4 animate-fade-in';
  container.id = 'onboarding-feature';

  let currentStep = 0;

  function render(): void {
    const step = ONBOARDING_STEPS[currentStep];
    const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

    container.innerHTML = `
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="w-16 h-16 rounded-2xl bg-[var(--color-accent)] flex items-center justify-center mx-auto mb-4">
            <i data-lucide="book-open" class="w-8 h-8 text-white"></i>
          </div>
          <h1 class="text-2xl font-bold">Welcome to Study Hub</h1>
          <p class="text-[var(--color-muted)] mt-1">Let's set up your personalized learning space</p>
        </div>

        <div class="mb-6" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100">
          <div class="flex items-center justify-between text-sm text-[var(--color-muted)] mb-2">
            ${ONBOARDING_STEPS.map((s, i) => `<span class="${i <= currentStep ? 'font-medium text-[var(--color-accent)]' : ''}">${s.title}</span>`).join('')}
          </div>
          <div class="h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
            <div class="h-full bg-[var(--color-accent)] rounded-full transition-all duration-300" style="width: ${progress}%"></div>
          </div>
        </div>

        <div class="card">
          <div class="card-content space-y-6">
            ${renderStepContent(step)}
            <div class="flex justify-between pt-4 border-t border-[var(--color-border)]">
              <button id="prev-btn" class="btn-secondary ${currentStep === 0 ? 'hidden' : ''}" data-lucide="chevron-left">Back</button>
              <button id="next-btn" class="btn-primary ${currentStep === ONBOARDING_STEPS.length - 1 ? 'hidden' : ''}">Next <i data-lucide="chevron-right" class="w-4 h-4 ml-2"></i></button>
              <button id="complete-btn" class="btn-primary ${currentStep !== ONBOARDING_STEPS.length - 1 ? 'hidden' : ''}" data-lucide="check">Get Started</button>
            </div>
          </div>
        </div>
      </div>
    `;

    setupStepHandlers(step.id);
    lucide.createIcons();
  }

  function renderStepContent(step: { id: OnboardingStepId; title: string; description: string }): string {
    switch (step.id) {
      case 'profile':
        return `
          <div class="space-y-4">
            <h2 class="text-lg font-semibold">${step.title}</h2>
            <p class="text-[var(--color-muted)]">${step.description}</p>
            <div class="grid gap-4">
              ${Input({ label: 'Your Name', placeholder: 'Alex', required: true, id: 'onboard-name', value: state.getState().user?.name || '' })}
              ${Input({ label: 'Major / Program', placeholder: 'Computer Science', required: true, id: 'onboard-major', value: state.getState().user?.major || '' })}
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              ${Input({ label: 'Weekly Study Target (hours)', type: 'number', min: '1', max: '100', value: String(state.getState().user?.weeklyTargetHours || 20), required: true, id: 'onboard-weekly' })}
              ${Input({ label: 'Target GPA', type: 'number', min: '0', max: '4', step: '0.1', value: String(state.getState().user?.targetGpa || 3.8), required: true, id: 'onboard-gpa' })}
            </div>
          </div>
        `;
      case 'subjects':
        return `
          <div class="space-y-4">
            <h2 class="text-lg font-semibold">${step.title}</h2>
            <p class="text-[var(--color-muted)]">${step.description}</p>
            <div class="flex flex-wrap gap-2" id="subject-chips">
              ${['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'History', 'Literature', 'English', 'Psychology', 'Economics', 'Art', 'Music', 'Languages'].map(s => `
                <button class="subject-chip px-3 py-1.5 rounded-full text-sm border border-[var(--color-border)] bg-[var(--color-panel)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] transition-colors" data-subject="${s}">${s}</button>
              `).join('')}
            </div>
            ${Input({ label: 'Or add custom', placeholder: 'Type and press Enter', id: 'custom-subject' })}
            <p class="text-xs text-[var(--color-muted)]">Select at least 3 subjects</p>
          </div>
        `;
      case 'first-goal':
        return `
          <div class="space-y-4">
            <h2 class="text-lg font-semibold">${step.title}</h2>
            <p class="text-[var(--color-muted)]">${step.description}</p>
            <div class="space-y-4">
              ${Input({ label: 'Goal Title', placeholder: 'e.g., Ace Calculus Midterm', required: true, id: 'goal-title' })}
              ${Select({ label: 'Subject', options: [
                { value: 'math', label: 'Mathematics' },
                { value: 'physics', label: 'Physics' },
                { value: 'chemistry', label: 'Chemistry' },
                { value: 'biology', label: 'Biology' },
                { value: 'other', label: 'Other' }
              ], required: true, id: 'goal-subject' })}
              ${Input({ label: 'Deadline', type: 'date', required: true, id: 'goal-deadline', value: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0] })}
              ${Input({ label: 'Target Hours', type: 'number', min: '1', max: '200', value: '20', required: true, id: 'goal-hours' })}
              ${Select({ label: 'Priority', options: [
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' }
              ], required: true, id: 'goal-priority' })}
            </div>
          </div>
        `;
    }
    return '';
  }

  function setupStepHandlers(stepId: OnboardingStepId): void {
    const prevBtn = container.querySelector('#prev-btn') as HTMLButtonElement;
    const nextBtn = container.querySelector('#next-btn') as HTMLButtonElement;
    const completeBtn = container.querySelector('#complete-btn') as HTMLButtonElement;

    prevBtn.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        render();
      }
    });

    nextBtn.addEventListener('click', () => {
      if (validateStep(stepId)) {
        saveStepData(stepId);
        currentStep++;
        render();
      }
    });

    completeBtn.addEventListener('click', () => {
      if (validateStep(stepId)) {
        saveStepData(stepId);
        completeOnboarding();
      }
    });

    if (stepId === 'subjects') {
      container.querySelectorAll('.subject-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          chip.classList.toggle('bg-[var(--color-accent)]');
          chip.classList.toggle('text-white');
          chip.classList.toggle('border-[var(--color-accent)]');
        });
      });

      const customInput = container.querySelector('#custom-subject') as HTMLInputElement;
      customInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && customInput.value.trim()) {
          const chipContainer = container.querySelector('#subject-chips')!;
          const chip = document.createElement('button');
          chip.className = 'subject-chip px-3 py-1.5 rounded-full text-sm border border-[var(--color-accent)] bg-[var(--color-accent)] text-white';
          chip.dataset.subject = customInput.value.trim();
          chip.textContent = customInput.value.trim();
          chip.addEventListener('click', () => {
            chip.classList.toggle('bg-[var(--color-accent)]');
            chip.classList.toggle('text-white');
            chip.classList.toggle('border-[var(--color-accent)]');
          });
          chipContainer.appendChild(chip);
          customInput.value = '';
        }
      });
    }
  }

  function validateStep(stepId: OnboardingStepId): boolean {
    switch (stepId) {
      case 'profile':
        const name = (container.querySelector('#onboard-name') as HTMLInputElement)?.value;
        const major = (container.querySelector('#onboard-major') as HTMLInputElement)?.value;
        if (!name || !major) {
          toastError('Please fill in your name and major');
          return false;
        }
        return true;
      case 'subjects':
        const selected = container.querySelectorAll('.subject-chip.bg-[var(--color-accent)]');
        if (selected.length < 3) {
          toastError('Please select at least 3 subjects');
          return false;
        }
        return true;
      case 'first-goal':
        const goalTitle = (container.querySelector('#goal-title') as HTMLInputElement)?.value;
        const goalSubject = (container.querySelector('#goal-subject') as HTMLSelectElement)?.value;
        const goalDeadline = (container.querySelector('#goal-deadline') as HTMLInputElement)?.value;
        if (!goalTitle || !goalSubject || !goalDeadline) {
          toastError('Please fill in all goal fields');
          return false;
        }
        return true;
    }
    return true;
  }

  function saveStepData(stepId: OnboardingStepId): void {
    switch (stepId) {
      case 'profile':
        state.setUser({
          id: 'local-user',
          name: (container.querySelector('#onboard-name') as HTMLInputElement).value,
          major: (container.querySelector('#onboard-major') as HTMLInputElement).value,
          weeklyTargetHours: parseInt((container.querySelector('#onboard-weekly') as HTMLInputElement).value),
          targetGpa: parseFloat((container.querySelector('#onboard-gpa') as HTMLInputElement).value),
          subjects: [],
          interests: '',
          learningStyle: 'mixed',
          difficulties: '',
          goals: '',
          xp: 0,
          currentStreak: 0,
          longestStreak: 0,
          totalStudyMinutes: 0,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        break;
      case 'subjects':
        const subjects = Array.from(container.querySelectorAll('.subject-chip.bg-[var(--color-accent)]')).map(c => c.getAttribute('data-subject')!);
        const user = state.getState().user;
        if (user) {
          state.setUser({ ...user, subjects });
        }
        break;
      case 'first-goal':
        console.log('Goal saved:', {
          title: (container.querySelector('#goal-title') as HTMLInputElement).value,
          subject: (container.querySelector('#goal-subject') as HTMLSelectElement).value,
          deadline: (container.querySelector('#goal-deadline') as HTMLInputElement).value,
          hours: parseInt((container.querySelector('#goal-hours') as HTMLInputElement).value),
          priority: (container.querySelector('#goal-priority') as HTMLSelectElement).value,
        });
        break;
    }
  }

  function completeOnboarding(): void {
    state.setOnboardingStep(3);
    toastSuccess('Welcome to Study Hub! 🎉');
    router.navigate('today');
  }

  render();
  return container;
}