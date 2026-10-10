import type {
  AppState, UserProfile, UserSettings, UserModel, Goal, Task,
  StudySession, Note, Deck, Flashcard, CalibrationEntry
} from './types.js';
import { STORAGE_KEYS, DEFAULT_SESSION_MINUTES, DEFAULT_BREAK_MINUTES, TabId } from './config.js';

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'teal',
  density: 'comfortable',
  darkMode: false,
  fontSize: 'md',
  reducedMotion: false,
  aiProvider: 'gemini',
  notificationsEnabled: true,
  soundEnabled: true,
  hapticsEnabled: true,
  sessionMinutes: DEFAULT_SESSION_MINUTES,
  breakMinutes: DEFAULT_BREAK_MINUTES,
  autoBreak: true,
  weeklyReport: true,
  dataSync: 'local',
  language: 'en',
};

const DEFAULT_USER_MODEL: UserModel = {
  learningStyle: 'mixed',
  difficultyPreference: 'adaptive',
  sessionTargetMinutes: DEFAULT_SESSION_MINUTES,
  actualSessionLength: DEFAULT_SESSION_MINUTES,
  bestTimeOfDay: 'unknown',
  struggleTopics: [],
  strongTopics: [],
  engagementScore: 50,
  preferredModalities: { cards: 0.5, quiz: 0.5, recall: 0.3, mock: 0.2, tutor: 0.3 },
  lastUpdated: Date.now(),
};

const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal-1',
    userId: 'local-user',
    title: 'Ace Calculus Midterm',
    subject: 'Mathematics',
    description: 'Master derivatives, limits, and integration applications.',
    deadline: Date.now() + 14 * 86400000,
    targetHours: 20,
    priority: 'high',
    status: 'active',
    progress: 45,
    milestones: [
      { id: 'm-1', goalId: 'goal-1', title: 'Finish Chapter 4 exercises', targetDate: Date.now() + 3 * 86400000, status: 'completed' },
      { id: 'm-2', goalId: 'goal-1', title: 'Complete Practice Exam A', targetDate: Date.now() + 8 * 86400000, status: 'in_progress' },
    ],
    createdAt: Date.now() - 3 * 86400000,
    updatedAt: Date.now(),
  },
  {
    id: 'goal-2',
    userId: 'local-user',
    title: 'Physics Mechanics Lab Report',
    subject: 'Physics',
    description: 'Complete data analysis and write-up for projectile motion.',
    deadline: Date.now() + 5 * 86400000,
    targetHours: 10,
    priority: 'medium',
    status: 'active',
    progress: 70,
    milestones: [],
    createdAt: Date.now() - 2 * 86400000,
    updatedAt: Date.now(),
  },
];

const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    userId: 'local-user',
    goalId: 'goal-1',
    title: 'Solve Chapter 4 Derivatives Problem Set',
    subject: 'Mathematics',
    description: 'Exercises 1 to 25 in Calculus textbook',
    dueDate: Date.now() + 86400000,
    estimatedMinutes: 45,
    status: 'todo',
    priority: 'high',
    tags: ['math', 'practice'],
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now(),
  },
  {
    id: 'task-2',
    userId: 'local-user',
    goalId: 'goal-2',
    title: 'Analyze projectile trajectory data in Excel',
    subject: 'Physics',
    estimatedMinutes: 30,
    status: 'in_progress',
    priority: 'medium',
    tags: ['lab', 'physics'],
    createdAt: Date.now() - 2 * 86400000,
    updatedAt: Date.now(),
  },
  {
    id: 'task-3',
    userId: 'local-user',
    title: 'Review Organic Chemistry functional groups',
    subject: 'Chemistry',
    estimatedMinutes: 25,
    status: 'done',
    priority: 'low',
    tags: ['chemistry'],
    createdAt: Date.now() - 3 * 86400000,
    updatedAt: Date.now(),
  },
];

const INITIAL_SESSIONS: StudySession[] = [
  {
    id: 'session-1',
    userId: 'local-user',
    subject: 'Mathematics',
    topic: 'Derivatives',
    mode: 'cards',
    plannedMinutes: 25,
    actualMinutes: 25,
    quality: 8,
    startedAt: Date.now() - 86400000 * 2,
    endedAt: Date.now() - 86400000 * 2 + 25 * 60000,
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'session-2',
    userId: 'local-user',
    subject: 'Physics',
    topic: 'Projectile Motion',
    mode: 'notes',
    plannedMinutes: 30,
    actualMinutes: 30,
    quality: 9,
    startedAt: Date.now() - 86400000,
    endedAt: Date.now() - 86400000 + 30 * 60000,
    createdAt: Date.now() - 86400000,
  },
];

const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    userId: 'local-user',
    title: 'Photosynthesis & Light Reactions',
    subject: 'Biology',
    style: 'cornell',
    content: {
      cornell: {
        cues: 'Where does it occur?\nWhat are the inputs?\nWhat is ATP Synthase?',
        notes: 'Photosynthesis occurs in chloroplasts.\nLight-dependent reactions occur in the thylakoid membrane.\nInputs: Light energy, H2O, NADP+, ADP.\nOutputs: O2, NADPH, ATP.',
        summary: 'Light reactions harvest solar energy to create ATP and NADPH for the Calvin cycle while generating O2 as a byproduct.',
      },
    },
    tags: ['biology', 'photosynthesis'],
    images: [],
    isFavorite: true,
    createdAt: Date.now() - 2 * 86400000,
    updatedAt: Date.now(),
  },
];

const INITIAL_DECKS: Deck[] = [
  {
    id: 'deck-1',
    userId: 'local-user',
    name: 'Calculus Derivatives & Integrals',
    subject: 'Mathematics',
    description: 'Essential derivative formulas and integration rules',
    cardCount: 3,
    dueCount: 2,
    createdAt: Date.now() - 3 * 86400000,
    updatedAt: Date.now(),
  },
];

const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'card-1',
    userId: 'local-user',
    deckId: 'deck-1',
    question: 'What is the derivative of sin(x)?',
    answer: 'cos(x)',
    subject: 'Mathematics',
    tags: ['calculus'],
    ease: 2.5,
    interval: 1,
    repetitions: 0,
    dueDate: Date.now(),
    createdAt: Date.now() - 3 * 86400000,
    updatedAt: Date.now(),
  },
  {
    id: 'card-2',
    userId: 'local-user',
    deckId: 'deck-1',
    question: 'What is the integral of 1/x dx?',
    answer: 'ln|x| + C',
    subject: 'Mathematics',
    tags: ['calculus'],
    ease: 2.5,
    interval: 1,
    repetitions: 0,
    dueDate: Date.now(),
    createdAt: Date.now() - 3 * 86400000,
    updatedAt: Date.now(),
  },
  {
    id: 'card-3',
    userId: 'local-user',
    deckId: 'deck-1',
    question: 'What is the Power Rule for differentiation?',
    answer: 'd/dx (x^n) = n * x^(n-1)',
    subject: 'Mathematics',
    tags: ['calculus'],
    ease: 2.5,
    interval: 2,
    repetitions: 1,
    dueDate: Date.now() + 86400000,
    createdAt: Date.now() - 3 * 86400000,
    updatedAt: Date.now(),
  },
];

class StateManager {
  private state: AppState = {
    user: null,
    settings: DEFAULT_SETTINGS,
    userModel: DEFAULT_USER_MODEL,
    goals: INITIAL_GOALS,
    tasks: INITIAL_TASKS,
    sessions: INITIAL_SESSIONS,
    notes: INITIAL_NOTES,
    decks: INITIAL_DECKS,
    flashcards: INITIAL_FLASHCARDS,
    quizzes: [],
    recallSessions: [],
    mockTests: [],
    aiChats: [],
    confusionLogs: [],
    calibrationLog: [],
    currentTab: 'today',
    currentLearnMode: 'cards',
    currentNoteStyle: 'freeform',
    onboardingStep: 0,
    isOnline: navigator.onLine,
    syncStatus: 'offline',
  };

  private listeners: Set<(state: AppState) => void> = new Set();
  private persistenceTimer?: number;

  constructor() {
    this.loadFromStorage();
    this.setupOnlineListener();
    this.startPersistence();
  }

  private loadFromStorage(): void {
    try {
      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (storedSettings) {
        this.state.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) };
      }

      const storedUserModel = localStorage.getItem(STORAGE_KEYS.USER_MODEL);
      if (storedUserModel) {
        this.state.userModel = { ...DEFAULT_USER_MODEL, ...JSON.parse(storedUserModel) };
      }

      const storedGoals = localStorage.getItem(STORAGE_KEYS.GOALS);
      if (storedGoals) this.state.goals = JSON.parse(storedGoals);

      const storedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (storedTasks) this.state.tasks = JSON.parse(storedTasks);

      const storedSessions = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (storedSessions) this.state.sessions = JSON.parse(storedSessions);

      const storedNotes = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (storedNotes) this.state.notes = JSON.parse(storedNotes);

      const storedDecks = localStorage.getItem(STORAGE_KEYS.DECKS);
      if (storedDecks) this.state.decks = JSON.parse(storedDecks);

      const storedFlashcards = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
      if (storedFlashcards) this.state.flashcards = JSON.parse(storedFlashcards);

      const storedCalibration = localStorage.getItem(STORAGE_KEYS.CALIBRATION);
      if (storedCalibration) this.state.calibrationLog = JSON.parse(storedCalibration);

      const lastTab = localStorage.getItem(STORAGE_KEYS.LAST_TAB);
      if (lastTab && this.isValidTab(lastTab)) {
        this.state.currentTab = lastTab as TabId;
      }

      const onboardingComplete = localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
      if (onboardingComplete === 'true') {
        this.state.onboardingStep = 3;
        if (!this.state.user) {
          this.state.user = {
            id: 'local-user',
            name: 'Alex Student',
            major: 'Computer Science',
            weeklyTargetHours: 20,
            targetGpa: 3.8,
            subjects: ['Mathematics', 'Physics', 'Biology', 'Computer Science'],
            interests: 'AI, Algorithms',
            learningStyle: 'mixed',
            difficulties: 'Integration techniques',
            goals: 'Maintain high GPA and master algorithms',
            xp: 150,
            currentStreak: 3,
            longestStreak: 7,
            totalStudyMinutes: 120,
            createdAt: Date.now() - 7 * 86400000,
            updatedAt: Date.now(),
          };
        }
      }
    } catch (error) {
      console.error('Failed to load state from storage:', error);
    }
    this.applySettings();
  }

  private isValidTab(tab: string): tab is TabId {
    return ['today', 'plan', 'learn', 'notes', 'analytics', 'ai-lab', 'settings'].includes(tab);
  }

  private setupOnlineListener(): void {
    window.addEventListener('online', () => {
      this.state.isOnline = true;
      this.notify();
    });
    window.addEventListener('offline', () => {
      this.state.isOnline = false;
      this.state.syncStatus = 'offline';
      this.notify();
    });
  }

  private startPersistence(): void {
    this.persistenceTimer = window.setInterval(() => {
      this.persist();
    }, 5000);
  }

  public persist(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.state.settings));
      if (this.state.userModel) {
        localStorage.setItem(STORAGE_KEYS.USER_MODEL, JSON.stringify(this.state.userModel));
      }
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(this.state.goals));
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(this.state.tasks));
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(this.state.sessions));
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(this.state.notes));
      localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(this.state.decks));
      localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(this.state.flashcards));
      localStorage.setItem(STORAGE_KEYS.CALIBRATION, JSON.stringify(this.state.calibrationLog));
      localStorage.setItem(STORAGE_KEYS.LAST_TAB, this.state.currentTab);
      if (this.state.onboardingStep >= 3) {
        localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
      }
    } catch (error) {
      console.error('Failed to persist state:', error);
    }
  }

  private applySettings(): void {
    const root = document.documentElement;
    root.setAttribute('data-theme', this.state.settings.theme);
    root.setAttribute('data-density', this.state.settings.density);
    root.setAttribute('data-font-size', this.state.settings.fontSize);
    document.body.classList.toggle('dark', this.state.settings.darkMode);
    document.body.classList.toggle('reduced-motion', this.state.settings.reducedMotion);
  }

  private notify(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getState());
      } catch (error) {
        console.error('State listener error:', error);
      }
    });
  }

  getState(): AppState {
    return { ...this.state };
  }

  subscribe(listener: (state: AppState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  setUser(user: UserProfile | null): void {
    this.state.user = user;
    this.notify();
  }

  updateSettings(updates: Partial<UserSettings>): void {
    this.state.settings = { ...this.state.settings, ...updates };
    this.applySettings();
    this.notify();
  }

  updateUserModel(updates: Partial<UserModel>): void {
    if (!this.state.userModel) this.state.userModel = DEFAULT_USER_MODEL;
    this.state.userModel = { ...this.state.userModel, ...updates, lastUpdated: Date.now() };
    this.notify();
  }

  setCurrentTab(tab: TabId): void {
    this.state.currentTab = tab;
    localStorage.setItem(STORAGE_KEYS.LAST_TAB, tab);
    this.notify();
  }

  setCurrentLearnMode(mode: AppState['currentLearnMode']): void {
    this.state.currentLearnMode = mode;
    this.notify();
  }

  setCurrentNoteStyle(style: AppState['currentNoteStyle']): void {
    this.state.currentNoteStyle = style;
    this.notify();
  }

  setOnboardingStep(step: number): void {
    this.state.onboardingStep = step;
    if (step >= 3) {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
    }
    this.notify();
  }

  setSyncStatus(status: AppState['syncStatus']): void {
    this.state.syncStatus = status;
    if (status === 'synced') {
      this.state.lastSyncAt = Date.now();
    }
    this.notify();
  }

  // Action methods
  addGoal(goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Goal {
    const newGoal: Goal = {
      ...goal,
      id: 'goal-' + Date.now(),
      userId: this.state.user?.id || 'local-user',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.state.goals = [newGoal, ...this.state.goals];
    this.persist();
    this.notify();
    return newGoal;
  }

  updateGoal(id: string, updates: Partial<Goal>): void {
    this.state.goals = this.state.goals.map(g => g.id === id ? { ...g, ...updates, updatedAt: Date.now() } : g);
    this.persist();
    this.notify();
  }

  deleteGoal(id: string): void {
    this.state.goals = this.state.goals.filter(g => g.id !== id);
    this.persist();
    this.notify();
  }

  addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Task {
    const newTask: Task = {
      ...task,
      id: 'task-' + Date.now(),
      userId: this.state.user?.id || 'local-user',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.state.tasks = [newTask, ...this.state.tasks];
    this.persist();
    this.notify();
    return newTask;
  }

  updateTask(id: string, updates: Partial<Task>): void {
    this.state.tasks = this.state.tasks.map(t => {
      if (t.id === id) {
        const updated = { ...t, ...updates, updatedAt: Date.now() };
        if (updates.status === 'done' && t.status !== 'done') {
          updated.completedAt = Date.now();
          this.addXP(15);
        }
        return updated;
      }
      return t;
    });
    this.persist();
    this.notify();
  }

  deleteTask(id: string): void {
    this.state.tasks = this.state.tasks.filter(t => t.id !== id);
    this.persist();
    this.notify();
  }

  addStudySession(session: Omit<StudySession, 'id' | 'createdAt' | 'userId'>): StudySession {
    const newSession: StudySession = {
      ...session,
      id: 'session-' + Date.now(),
      userId: this.state.user?.id || 'local-user',
      createdAt: Date.now(),
    };
    this.state.sessions = [newSession, ...this.state.sessions];
    if (this.state.user) {
      this.state.user.totalStudyMinutes += session.actualMinutes;
      this.addXP(Math.round(session.actualMinutes * 1.5));
    }
    this.persist();
    this.notify();
    return newSession;
  }

  addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Note {
    const newNote: Note = {
      ...note,
      id: 'note-' + Date.now(),
      userId: this.state.user?.id || 'local-user',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.state.notes = [newNote, ...this.state.notes];
    this.addXP(10);
    this.persist();
    this.notify();
    return newNote;
  }

  deleteNote(id: string): void {
    this.state.notes = this.state.notes.filter(n => n.id !== id);
    this.persist();
    this.notify();
  }

  addDeck(name: string, subject: string, description?: string): Deck {
    const deck: Deck = {
      id: 'deck-' + Date.now(),
      userId: this.state.user?.id || 'local-user',
      name,
      subject,
      description,
      cardCount: 0,
      dueCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.state.decks = [deck, ...this.state.decks];
    this.persist();
    this.notify();
    return deck;
  }

  addFlashcard(card: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'ease' | 'interval' | 'repetitions' | 'dueDate'>): Flashcard {
    const newCard: Flashcard = {
      ...card,
      id: 'card-' + Date.now(),
      userId: this.state.user?.id || 'local-user',
      ease: 2.5,
      interval: 1,
      repetitions: 0,
      dueDate: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.state.flashcards = [newCard, ...this.state.flashcards];
    this.state.decks = this.state.decks.map(d => d.id === card.deckId ? { ...d, cardCount: d.cardCount + 1, dueCount: d.dueCount + 1 } : d);
    this.persist();
    this.notify();
    return newCard;
  }

  reviewFlashcard(cardId: string, rating: number): Flashcard | null {
    const card = this.state.flashcards.find(c => c.id === cardId);
    if (!card) return null;

    let { ease, interval, repetitions } = card;
    if (rating < 3) {
      repetitions = 0;
      interval = 1;
    } else {
      repetitions += 1;
      if (repetitions === 1) interval = 1;
      else if (repetitions === 2) interval = 6;
      else interval = Math.round(interval * ease);
    }

    ease = Math.max(1.3, ease + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02)));
    const dueDate = Date.now() + interval * 86400000;

    const updatedCard: Flashcard = {
      ...card,
      ease,
      interval,
      repetitions,
      dueDate,
      lastReviewed: Date.now(),
      updatedAt: Date.now(),
    };

    this.state.flashcards = this.state.flashcards.map(c => c.id === cardId ? updatedCard : c);
    this.addXP(rating >= 3 ? 15 : 5);
    this.persist();
    this.notify();
    return updatedCard;
  }

  logCalibration(source: 'flashcard' | 'quiz', confidence: number, correct: boolean): void {
    const entry: CalibrationEntry = {
      id: 'cal-' + Date.now(),
      source,
      confidence: Math.min(100, Math.max(0, confidence)),
      correct,
      timestamp: Date.now(),
    };
    this.state.calibrationLog = [...this.state.calibrationLog, entry].slice(-200);
    this.persist();
    this.notify();
  }

  getCalibrationStats(): { sampleSize: number; avgConfidence: number; accuracy: number; gap: number; label: string } {
    const log = this.state.calibrationLog;
    if (log.length === 0) {
      return { sampleSize: 0, avgConfidence: 0, accuracy: 0, gap: 0, label: 'No data yet' };
    }
    const avgConfidence = log.reduce((s, e) => s + e.confidence, 0) / log.length;
    const accuracy = (log.filter(e => e.correct).length / log.length) * 100;
    const gap = avgConfidence - accuracy;
    let label = 'Well calibrated';
    if (gap > 15) label = 'Overconfident';
    else if (gap > 5) label = 'Slightly overconfident';
    else if (gap < -15) label = 'Underconfident';
    else if (gap < -5) label = 'Slightly underconfident';
    return { sampleSize: log.length, avgConfidence, accuracy, gap, label };
  }

  deleteDeck(id: string): void {
    this.state.decks = this.state.decks.filter(d => d.id !== id);
    this.state.flashcards = this.state.flashcards.filter(c => c.deckId !== id);
    this.persist();
    this.notify();
  }

  deleteFlashcard(id: string): void {
    const card = this.state.flashcards.find(c => c.id === id);
    if (card) {
      this.state.flashcards = this.state.flashcards.filter(c => c.id !== id);
      this.state.decks = this.state.decks.map(d => d.id === card.deckId ? { ...d, cardCount: Math.max(0, d.cardCount - 1) } : d);
      this.persist();
      this.notify();
    }
  }

  addXP(amount: number): void {
    if (this.state.user) {
      this.state.user.xp += amount;
      this.notify();
    }
  }

  reset(): void {
    this.state = {
      user: null,
      settings: DEFAULT_SETTINGS,
      userModel: DEFAULT_USER_MODEL,
      goals: INITIAL_GOALS,
      tasks: INITIAL_TASKS,
      sessions: INITIAL_SESSIONS,
      notes: INITIAL_NOTES,
      decks: INITIAL_DECKS,
      flashcards: INITIAL_FLASHCARDS,
      quizzes: [],
      recallSessions: [],
      mockTests: [],
      aiChats: [],
      confusionLogs: [],
      calibrationLog: [],
      currentTab: 'today',
      currentLearnMode: 'cards',
      currentNoteStyle: 'freeform',
      onboardingStep: 0,
      isOnline: navigator.onLine,
      syncStatus: 'offline',
    };
    this.applySettings();
    this.persist();
    this.notify();
  }

  destroy(): void {
    if (this.persistenceTimer) {
      clearInterval(this.persistenceTimer);
    }
    this.listeners.clear();
  }
}

export const state = new StateManager();

export function useState<T>(selector: (state: AppState) => T): T {
  return selector(state.getState());
}

export function subscribeToState<T>(selector: (state: AppState) => T, callback: (value: T) => void): () => void {
  let previousValue = selector(state.getState());
  return state.subscribe(s => {
    const newValue = selector(s);
    if (newValue !== previousValue) {
      previousValue = newValue;
      callback(newValue);
    }
  });
}

export type { TabId };
