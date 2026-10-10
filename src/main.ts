import { generateCSSVariables, applyTheme, applyDensity, applyDarkMode, applyFontSize, applyReducedMotion } from './ui/theme.js';
import { AppShell } from './ui/layout/AppShell.js';
import { router } from './core/router.js';
import { state } from './core/state.js';
import { TABS, TabId } from './core/config.js';
import { todayFeature } from './features/today/index.js';
import { planFeature } from './features/plan/index.js';
import { learnFeature } from './features/learn/index.js';
import { notesFeature } from './features/notes/index.js';
import { analyticsFeature } from './features/analytics/index.js';
import { aiLabFeature } from './features/ai-lab/index.js';
import { settingsFeature } from './features/settings/index.js';
import { onboardingFeature } from './features/onboarding/index.js';
import { createIcons } from 'lucide';

document.head.insertAdjacentHTML('beforeend', `<style>${generateCSSVariables()}</style>`);

const app = document.getElementById('app')!;
const shell = AppShell();
app.appendChild(shell);

const mainContent = document.getElementById('main-content')!;

function renderFeature(tabId: TabId): void {
  mainContent.innerHTML = '';
  let feature: HTMLElement;

  switch (tabId) {
    case 'today':
      feature = todayFeature();
      break;
    case 'plan':
      feature = planFeature();
      break;
    case 'learn':
      feature = learnFeature();
      break;
    case 'notes':
      feature = notesFeature();
      break;
    case 'analytics':
      feature = analyticsFeature();
      break;
    case 'ai-lab':
      feature = aiLabFeature();
      break;
    case 'settings':
      feature = settingsFeature();
      break;
    default:
      feature = todayFeature();
  }

  mainContent.appendChild(feature);
  createIcons();
}

TABS.forEach(tab => {
  router.addRoute(tab.id, () => renderFeature(tab.id as TabId), tab.id as TabId);
});

router.addBeforeHook(async (tab) => {
  const { onboardingStep, user } = state.getState();
  if (onboardingStep < 3 && tab !== 'today' && !user) {
    router.navigate('today');
    return false;
  }
  return true;
});

router.addAfterHook((tab) => {
  state.setCurrentTab(tab as TabId);
  createIcons();
});

const savedTheme = state.getState().settings.theme;
applyTheme(savedTheme);
applyDensity(state.getState().settings.density);
applyDarkMode(state.getState().settings.darkMode);
applyFontSize(state.getState().settings.fontSize);
applyReducedMotion(state.getState().settings.reducedMotion);

const { onboardingStep, user } = state.getState();
if (onboardingStep < 3 && !user) {
  const onboarding = onboardingFeature();
  mainContent.appendChild(onboarding);
} else {
  const initialTab = state.getState().currentTab;
  renderFeature(initialTab);
}

document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    console.log('Open command palette');
  }
  if ((e.metaKey || e.ctrlKey) && /^[1-7]$/.test(e.key)) {
    e.preventDefault();
    const index = parseInt(e.key, 10) - 1;
    const tab = TABS[index];
    if (tab) router.navigate(tab.id);
  }
});

console.log('Study Hub v2 initialized');