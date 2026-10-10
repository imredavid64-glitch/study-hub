import type { TabId, LearnModeId, NoteStyleId, ThemeId, DensityId, AIProviderId } from './config.js';

export interface UserProfile {
  id: string;
  name: string;
  major: string;
  weeklyTargetHours: number;
  targetGpa: number;
  subjects: string[];
  interests: string;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading' | 'mixed';
  difficulties: string;
  goals: string;
  xp: number;
  currentStreak: number;
  longestStreak: number;
  totalStudyMinutes: number;
  createdAt: number;
  updatedAt: number;
}

export interface UserSettings {
  theme: ThemeId;
  density: DensityId;
  darkMode: boolean;
  fontSize: 'sm' | 'md' | 'lg';
  reducedMotion: boolean;
  aiProvider: AIProviderId;
  customGeminiKey?: string;
  ollamaUrl?: string;
  ollamaModel?: string;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  sessionMinutes: number;
  breakMinutes: number;
  autoBreak: boolean;
  dailyReminderTime?: string;
  weeklyReport: boolean;
  dataSync: 'local' | 'cloud';
  language: 'en' | 'es' | 'fr' | 'de';
}

export interface UserModel {
  learningStyle: UserProfile['learningStyle'];
  difficultyPreference: 'adaptive' | 'easy' | 'medium' | 'hard';
  sessionTargetMinutes: number;
  actualSessionLength: number;
  bestTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | 'unknown';
  struggleTopics: TopicSignal[];
  strongTopics: TopicSignal[];
  engagementScore: number;
  preferredModalities: ModalityScore;
  lastUpdated: number;
}

export interface TopicSignal {
  topic: string;
  subject: string;
  signal: 'struggle' | 'strong';
  confidence: number;
  lastSeen: number;
  evidence: ('low_quiz' | 'confusion_log' | 'slow_recall' | 'high_quiz' | 'fast_recall' | 'completed_mock')[];
}

export interface ModalityScore {
  cards: number;
  quiz: number;
  recall: number;
  mock: number;
  tutor: number;
}

export interface CalibrationEntry {
  id: string;
  source: 'flashcard' | 'quiz';
  confidence: number;
  correct: boolean;
  timestamp: number;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  subject: string;
  description?: string;
  deadline: number;
  targetHours: number;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'completed' | 'archived';
  progress: number;
  milestones: Milestone[];
  aiPlan?: StudyPlan;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
}

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  description?: string;
  targetDate: number;
  status: 'pending' | 'in_progress' | 'completed';
  completedAt?: number;
}

export interface StudyPlan {
  id: string;
  goalId: string;
  subject: string;
  daysUntilDeadline: number;
  dailyMinutes: number;
  intensity: 'light' | 'moderate' | 'intense';
  phases: PlanPhase[];
  generatedAt: number;
}

export interface PlanPhase {
  id: string;
  name: string;
  description: string;
  startDay: number;
  endDay: number;
  topics: string[];
  recommendedActivities: ('cards' | 'quiz' | 'recall' | 'mock' | 'notes' | 'tutor')[];
  estimatedMinutes: number;
}

export interface Task {
  id: string;
  userId: string;
  goalId?: string;
  title: string;
  subject: string;
  description?: string;
  dueDate?: number;
  estimatedMinutes: number;
  actualMinutes?: number;
  status: 'todo' | 'in_progress' | 'done' | 'archived';
  priority: 'high' | 'medium' | 'low';
  tags: string[];
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
}

export interface StudySession {
  id: string;
  userId: string;
  goalId?: string;
  taskId?: string;
  subject: string;
  topic?: string;
  mode: LearnModeId | 'notes' | 'tutor' | 'custom';
  plannedMinutes: number;
  actualMinutes: number;
  quality: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  notes?: string;
  mood?: 1 | 2 | 3 | 4 | 5;
  energy?: 1 | 2 | 3 | 4 | 5;
  startedAt: number;
  endedAt?: number;
  createdAt: number;
}

export interface Flashcard {
  id: string;
  userId: string;
  deckId: string;
  question: string;
  answer: string;
  subject: string;
  tags: string[];
  ease: number;
  interval: number;
  repetitions: number;
  dueDate: number;
  lastReviewed?: number;
  createdAt: number;
  updatedAt: number;
}

export interface Deck {
  id: string;
  userId: string;
  name: string;
  subject: string;
  description?: string;
  cardCount: number;
  dueCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface Quiz {
  id: string;
  userId: string;
  subject: string;
  topic: string;
  level: 'easy' | 'medium' | 'hard';
  type: 'multiple' | 'truefalse' | 'written' | 'fillblank' | 'mixed';
  questionCount: number;
  questions: QuizQuestion[];
  timeLimit?: number;
  createdAt: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple' | 'truefalse' | 'written' | 'fillblank';
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  subject: string;
  topic: string;
  answers: QuizAnswer[];
  score: number;
  maxScore: number;
  percentage: number;
  timeSpent: number;
  completedAt: number;
}

export interface QuizAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  timeSpent: number;
}

export interface RecallSession {
  id: string;
  userId: string;
  subject: string;
  topic: string;
  keywords: string[];
  response: string;
  score: number;
  feedback: string;
  timeSpent: number;
  createdAt: number;
}

export interface MockTest {
  id: string;
  userId: string;
  subject: string;
  level: 'easy' | 'medium' | 'hard';
  questionCount: number;
  duration: number;
  questions: QuizQuestion[];
  answers: MockAnswer[];
  score: number;
  maxScore: number;
  percentage: number;
  markedForReview: string[];
  startedAt: number;
  completedAt?: number;
  status: 'in_progress' | 'completed' | 'abandoned';
}

export interface MockAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect?: boolean;
  markedForReview: boolean;
  timeSpent: number;
}

export interface Note {
  id: string;
  userId: string;
  goalId?: string;
  title: string;
  subject: string;
  style: NoteStyleId;
  content: NoteContent;
  tags: string[];
  images: string[];
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface NoteContent {
  freeform?: string;
  outline?: string;
  cornell?: { cues: string; notes: string; summary: string };
  mapping?: { center: string; branches: MappingBranch[] };
  charting?: { headers: string[]; rows: string[][] };
  boxing?: { boxes: BoxingBox[] };
  sentence?: string[];
}

export interface MappingBranch {
  id: string;
  label: string;
  children: MappingBranch[];
  x?: number;
  y?: number;
}

export interface BoxingBox {
  id: string;
  title: string;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AIChat {
  id: string;
  userId: string;
  context: 'tutor' | 'generator' | 'coach' | 'voice' | 'subject';
  subject?: string;
  topic?: string;
  messages: AIMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  metadata?: {
    tokens?: number;
    model?: string;
    provider?: string;
    cached?: boolean;
  };
}

export interface AIGeneration {
  id: string;
  userId: string;
  type: 'flashcards' | 'quiz' | 'study-guide' | 'study-plan' | 'mind-map' | 'film' | 'image' | 'concept-model';
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  status: 'pending' | 'completed' | 'failed';
  error?: string;
  createdAt: number;
  completedAt?: number;
}

export interface ConfusionLogEntry {
  id: string;
  userId: string;
  subject: string;
  topic: string;
  concept: string;
  source: 'quiz' | 'flashcard' | 'recall' | 'mock' | 'tutor' | 'manual';
  severity: 1 | 2 | 3 | 4 | 5;
  resolved: boolean;
  resolvedAt?: number;
  createdAt: number;
}

export interface ReviewQueueItem {
  id: string;
  userId: string;
  subject: string;
  topic: string;
  concept: string;
  source: string;
  count: number;
  addedAt: number;
  dueDate: number;
  lastReviewed?: number;
  reviewCount: number;
  ease: number;
}

export interface AnalyticsSnapshot {
  userId: string;
  date: string;
  studyMinutes: number;
  sessionsCount: number;
  tasksCompleted: number;
  flashcardsReviewed: number;
  quizzesTaken: number;
  recallsDone: number;
  averageQuality: number;
  currentStreak: number;
  xpGained: number;
}

export interface ExamEstimate {
  subject: string;
  estimatedScore: number;
  confidenceBand: number;
  basedOn: ('quiz' | 'mock' | 'flashcard' | 'session')[];
  lastUpdated: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface AppState {
  user: UserProfile | null;
  settings: UserSettings;
  userModel: UserModel | null;
  goals: Goal[];
  tasks: Task[];
  sessions: StudySession[];
  notes: Note[];
  decks: Deck[];
  flashcards: Flashcard[];
  quizzes: Quiz[];
  recallSessions: RecallSession[];
  mockTests: MockTest[];
  aiChats: AIChat[];
  confusionLogs: ConfusionLogEntry[];
  calibrationLog: CalibrationEntry[];
  currentTab: TabId;
  currentLearnMode: LearnModeId;
  currentNoteStyle: NoteStyleId;
  onboardingStep: number;
  isOnline: boolean;
  syncStatus: 'synced' | 'syncing' | 'offline' | 'error';
  lastSyncAt?: number;
}

export type FeatureEvent =
  | { type: 'SESSION_STARTED'; payload: { session: StudySession } }
  | { type: 'SESSION_COMPLETED'; payload: { session: StudySession } }
  | { type: 'TASK_COMPLETED'; payload: { task: Task } }
  | { type: 'GOAL_CREATED'; payload: { goal: Goal } }
  | { type: 'GOAL_COMPLETED'; payload: { goal: Goal } }
  | { type: 'FLASHCARD_REVIEWED'; payload: { card: Flashcard; rating: number } }
  | { type: 'QUIZ_COMPLETED'; payload: { attempt: QuizAttempt } }
  | { type: 'RECALL_COMPLETED'; payload: { recall: RecallSession } }
  | { type: 'MOCK_COMPLETED'; payload: { mock: MockTest } }
  | { type: 'NOTE_CREATED'; payload: { note: Note } }
  | { type: 'CONFUSION_LOGGED'; payload: { entry: ConfusionLogEntry } }
  | { type: 'AI_CHAT_MESSAGE'; payload: { chat: AIChat; message: AIMessage } }
  | { type: 'SETTINGS_CHANGED'; payload: { settings: Partial<UserSettings> } }
  | { type: 'TAB_CHANGED'; payload: { tab: TabId } }
  | { type: 'ONBOARDING_STEP'; payload: { step: number } }
  | { type: 'USER_MODEL_UPDATED'; payload: { model: UserModel } };