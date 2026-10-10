export const APP_NAME = 'Study Hub';
export const APP_VERSION = '2.0.0';

export interface TabDefinition {
  id: string;
  label: string;
  icon: string;
  order: number;
  advanced?: boolean;
}

export const TABS: readonly TabDefinition[] = [
  { id: 'today', label: 'Today', icon: 'sun', order: 1 },
  { id: 'plan', label: 'Plan', icon: 'calendar', order: 2 },
  { id: 'learn', label: 'Learn', icon: 'book-open', order: 3 },
  { id: 'notes', label: 'Notes', icon: 'file-text', order: 4 },
  { id: 'analytics', label: 'Analytics', icon: 'bar-chart', order: 5 },
  { id: 'ai-lab', label: 'AI Lab', icon: 'cpu', order: 6, advanced: true },
  { id: 'settings', label: 'Settings', icon: 'settings', order: 7 },
] as const;

export type TabId = (typeof TABS)[number]['id'];

export const LEARN_MODES = [
  { id: 'cards', label: 'Flashcards', icon: 'layers' },
  { id: 'quiz', label: 'Quiz', icon: 'help-circle' },
  { id: 'recall', label: 'Recall', icon: 'brain' },
  { id: 'mock', label: 'Mock Test', icon: 'timer' },
  { id: 'tutor', label: 'AI Tutor', icon: 'message-square' },
] as const;

export type LearnModeId = (typeof LEARN_MODES)[number]['id'];

export const NOTE_STYLES = [
  { id: 'freeform', label: 'Freeform', icon: 'pen-tool' },
  { id: 'outline', label: 'Outline', icon: 'list-ordered' },
  { id: 'cornell', label: 'Cornell', icon: 'layout-template' },
  { id: 'mapping', label: 'Mapping', icon: 'git-branch' },
  { id: 'charting', label: 'Charting', icon: 'table' },
  { id: 'boxing', label: 'Boxing', icon: 'square' },
  { id: 'sentence', label: 'Sentence', icon: 'type' },
] as const;

export type NoteStyleId = (typeof NOTE_STYLES)[number]['id'];

export const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
  'History', 'Literature', 'English', 'Psychology', 'Economics',
  'Art', 'Music', 'Languages', 'Philosophy', 'Statistics'
] as const;

export const THEMES = [
  { id: 'teal', name: 'Teal', accent: '#0f766e' },
  { id: 'slate', name: 'Slate', accent: '#475569' },
  { id: 'warm', name: 'Warm', accent: '#b45309' },
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];

export const DENSITIES = [
  { id: 'comfortable', name: 'Comfortable', space: 1 },
  { id: 'compact', name: 'Compact', space: 0.75 },
] as const;

export type DensityId = (typeof DENSITIES)[number]['id'];

export const AI_PROVIDERS = [
  { id: 'gemini', name: 'Gemini (Cloud)', requiresKey: false },
  { id: 'local', name: 'Local (Ollama)', requiresKey: false, requiresLocal: true },
] as const;

export type AIProviderId = (typeof AI_PROVIDERS)[number]['id'];

export const STORAGE_KEYS = {
  USER_MODEL: 'studyhub_user_model',
  SETTINGS: 'studyhub_settings',
  ONBOARDING_COMPLETE: 'studyhub_onboarding_complete',
  LAST_TAB: 'studyhub_last_tab',
  GOALS: 'studyhub_goals',
  TASKS: 'studyhub_tasks',
  SESSIONS: 'studyhub_sessions',
  NOTES: 'studyhub_notes',
  DECKS: 'studyhub_decks',
  FLASHCARDS: 'studyhub_flashcards',
} as const;

export const AI_CACHE_TTL = 7 * 24 * 60 * 60 * 1000;
export const MAX_AI_CACHE_ENTRIES = 50;

export const SM2_PARAMS = {
  INITIAL_EASE: 2.5,
  MIN_EASE: 1.3,
  EASY_BONUS: 1.3,
  HARD_PENALTY: 0.85,
  AGAIN_PENALTY: 0.0,
} as const;

export const DEFAULT_SESSION_MINUTES = 25;
export const DEFAULT_BREAK_MINUTES = 5;

export const ONBOARDING_STEPS = [
  { id: 'profile', title: 'Your Profile', description: 'Name, major, study goals' },
  { id: 'subjects', title: 'Your Subjects', description: 'Pick 3–5 subjects you study' },
  { id: 'first-goal', title: 'First Goal', description: 'Set your first study target' },
] as const;

export type OnboardingStepId = (typeof ONBOARDING_STEPS)[number]['id'];