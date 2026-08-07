// ===== STATE MANAGEMENT =====
const STORAGE_KEY = 'studyhub_state';

// ===== I18N — UI Language System =====
const LOCALES = {
  en: {
    appName: 'Study Hub', tabDashboard: 'Dashboard', tabPlanner: 'Planner', tabSessions: 'Sessions',
    tabFlashcards: 'Flashcards', tabQuizzes: 'Quizzes', tabNotes: 'Notes', tabAssignments: 'Assignments',
    tabCoach: 'Coach', tabVoice: 'Voice', tabSubjects: 'Subjects', tabAnalytics: 'Analytics',
    tabSettings: 'Settings', tabRecalls: 'Recalls', tabCalendar: 'Calendar', tabSocial: 'Social',
    tabAI: 'AI Tutor', tabSmartAI: 'Smart AI', tabLessons: 'AI Lessons',
    tabWarmup: 'Warm Up', tabStudyGuide: 'Study Guide',
    tabCalculator: 'Calculator', tabTutorial: 'Tutorial', tabAutism: 'Autism Support',
    settingsTitle: 'Settings', profileLabel: 'Profile', themeLabel: 'Theme', langLabel: 'App Language',
    darkMode: 'Dark Mode', lightMode: 'Light Mode', exportBtn: 'Export JSON', importBtn: 'Import JSON',
    resetBtn: 'Reset All Data', healthCheck: 'Run Health Check', saveProfile: 'Save Profile',
    namePlaceholder: 'Name', majorPlaceholder: 'Program / Major',
    weeklyTarget: 'Weekly Target (hours)', targetGpa: 'Target GPA',
    voiceTitle: 'AI Voice Mode', voiceStart: 'Start', voiceStop: 'Stop', voiceClear: 'Clear',
    voiceTranscript: 'Transcript', voiceLanguage: 'Language', voiceTopic: 'Topic',
    voiceCallEnd: 'End Call', voiceAnalysis: 'Conversation Analysis',
    lectureRecord: 'Record Lecture', lectureConsent: 'Teacher Consent', lectureStart: 'Start Recording',
    lectureStop: 'Stop Recording', lectureSaved: 'Saved Lectures', lectureGenerate: 'Generate Exercises',
    googleConnect: 'Connect Google', googleClassroom: 'Google Classroom', googleCalendar: 'Google Calendar',
    googleOAuth: 'OAuth Setup', googleConnected: 'Connected', googleDisconnect: 'Disconnect',
    recording: 'Recording...', paused: 'Paused',
    searchPlaceholder: 'Search...', noData: 'No data yet.', loading: 'Loading...',
    saveSuccess: 'Saved successfully', errorGeneric: 'Something went wrong',
    confirmReset: 'Are you sure you want to erase ALL your data? This cannot be undone.',
    hungarian: 'Hungarian', english: 'English',
    // Dashboard
    welcomeScholar: 'Welcome, Scholar',
    startSprint: 'Start 25m Sprint',
    loadDemo: 'Load Demo Data',
    studyHours7d: 'Study Hours (7d)',
    taskCompletion: 'Task Completion',
    studyStreak: 'Study Streak',
    academicMomentum: 'Academic Momentum',
    dailyMission: 'Daily Mission',
    todayAgenda: 'Today Agenda',
    achievements: 'Achievements',
    nothingScheduled: 'Nothing scheduled for today.',
    keepGoing: 'Keep going — achievements unlock as you study!',
    addFirstGoal: 'Add your first study goal to begin.',
    // Planner
    addGoal: 'Add Goal', addTask: 'Add Task', autoStudyPlan: 'Auto Study Plan',
    highPriority: 'High Priority', mediumPriority: 'Medium Priority', lowPriority: 'Low Priority',
    createGoal: 'Create Goal', goalTitle: 'Goal Title', goalSubject: 'Subject', goalDeadline: 'Deadline',
    goalPriority: 'Priority', goalHours: 'Hours planned',
    taskTitle: 'Task Title', taskSubject: 'Subject', taskDue: 'Due Date', taskEffort: 'Effort (1-5)',
    generate: 'Generate', studyPlan: 'Study Plan',
    toDo: 'To Do', inProgress: 'In Progress', done: 'Done',
    move: 'Move →', reactivate: 'Reactivate',
    noGoals: 'No goals yet.',
    // Sessions
    focusTimer: 'Focus Timer', focus: 'FOCUS', start: 'Start', reset: 'Reset', skip: 'Skip',
    focusMin: 'Focus (min)', breakMin: 'Break (min)', save: 'Save',
    enableNotifications: 'Enable notifications',
    logStudySession: 'Log Study Session', subject: 'Subject', duration: 'Duration (min)',
    sessionType: 'Type', deepWork: 'Deep work session', saveSession: 'Save Session',
    sessionHistory: 'Session History',
    // Flashcards
    createFlashcard: 'Create Flashcard', question: 'Question', answer: 'Answer',
    addFlashcard: 'Add Flashcard', generateAIFlashcards: 'Generate AI Flashcards',
    aiWordFinder: 'AI Word Finder', askAI: 'Ask AI', addAIWords: 'Add AI Words as Flashcards',
    studyMode: 'Study Mode', due: 'Due', new: 'New', total: 'Total',
    noCardsDue: 'No cards due. Add cards or generate with AI.',
    allFlashcards: 'All Flashcards',
    again: 'Again', hard: 'Hard', good: 'Good', easy: 'Easy',
    // Quizzes
    aiQuizGenerator: 'AI Quiz Generator', quizArena: 'Quiz Arena', timedMockTest: 'AI Timed Mock Test',
    createQuiz: 'Create Quiz', next: 'Next', submitQuiz: 'Submit Quiz',
    previous: 'Previous', markForReview: 'Mark For Review', submitMockTest: 'Submit Mock Test',
    quizAttempts: 'Quiz Attempts', mockTestHistory: 'Mock Test History',
    topic: 'Topic', difficulty: 'Difficulty', type: 'Type',
    easy: 'Easy', medium: 'Medium', hard: 'Hard',
    // Subjects
    subjects: 'Subjects',
    // Google voice
    startCall: 'Start Call',
    // Coach
    coach: 'Coach', performanceCoach: 'Performance Coach',
    // General
    search: 'Search', cancel: 'Cancel', confirm: 'Confirm', delete: 'Delete',
    comingSoon: 'Coming soon',
  },
  hu: {
    appName: 'Tanulási Központ', tabDashboard: 'Irányítópult', tabPlanner: 'Tervező',
    tabSessions: 'Ülések', tabFlashcards: 'Tanulókártyák', tabQuizzes: 'Kvízek',
    tabNotes: 'Jegyzetek', tabAssignments: 'Feladatok', tabCoach: 'Edző',
    tabVoice: 'Hang', tabSubjects: 'Tárgyak', tabAnalytics: 'Elemzés',
    tabSettings: 'Beállítások', tabRecalls: 'Felidézés', tabCalendar: 'Naptár',
    tabSocial: 'Közösség', tabAI: 'AI Tanár', tabSmartAI: 'Okos AI', tabLessons: 'AI Leckék',
    settingsTitle: 'Beállítások', profileLabel: 'Profil', themeLabel: 'Téma',
    langLabel: 'Alkalmazás nyelve',
    darkMode: 'Sötét mód', lightMode: 'Világos mód',
    exportBtn: 'Exportálás JSON', importBtn: 'Importálás JSON',
    resetBtn: 'Összes adat törlése', healthCheck: 'Rendszerellenőrzés',
    saveProfile: 'Profil mentése', namePlaceholder: 'Név', majorPlaceholder: 'Szak / Program',
    weeklyTarget: 'Heti cél (órák)', targetGpa: 'Cél GPA',
    voiceTitle: 'AI Hang mód', voiceStart: 'Indítás', voiceStop: 'Leállítás', voiceClear: 'Törlés',
    voiceTranscript: 'Átirat', voiceLanguage: 'Nyelv', voiceTopic: 'Téma',
    voiceCallEnd: 'Hívás vége', voiceAnalysis: 'Beszélgetés elemzése',
    lectureRecord: 'Előadás rögzítése', lectureConsent: 'Tanári hozzájárulás',
    lectureStart: 'Rögzítés indítása', lectureStop: 'Rögzítés leállítása',
    lectureSaved: 'Mentett előadások', lectureGenerate: 'Feladatok generálása',
    googleConnect: 'Google kapcsolat', googleClassroom: 'Google Classroom',
    googleCalendar: 'Google Naptár', googleOAuth: 'OAuth beállítás',
    googleConnected: 'Csatlakoztatva', googleDisconnect: 'Lecsatlakozás',
    recording: 'Rögzítés...', paused: 'Szünet',
    searchPlaceholder: 'Keresés...', noData: 'Még nincs adat.',
    loading: 'Betöltés...', saveSuccess: 'Sikeresen mentve',
    errorGeneric: 'Valami hiba történt',
    confirmReset: 'Biztosan törölni szeretnéd az ÖSSZES adatot? Ez a művelet nem visszavonható.',
    hungarian: 'Magyar', english: 'Angol',
    // Dashboard
    welcomeScholar: 'Üdvözöllek, Tanuló',
    startSprint: '25 perces sprint',
    loadDemo: 'Bemutató adatok',
    studyHours7d: 'Tanulási órák (7 nap)',
    taskCompletion: 'Feladatok teljesítése',
    studyStreak: 'Tanulási sorozat',
    academicMomentum: 'Akadémiai lendület',
    dailyMission: 'Napi küldetés',
    todayAgenda: 'Mai napirend',
    achievements: 'Eredmények',
    nothingScheduled: 'Nincs semmi ütemezve mára.',
    keepGoing: 'Folytasd — az eredmények feloldódnak, ahogy tanulsz!',
    addFirstGoal: 'Add hozzá az első tanulási célodat a kezdéshez.',
    // Planner
    addGoal: 'Cél hozzáadása', addTask: 'Feladat hozzáadása', autoStudyPlan: 'Automatikus tanulási terv',
    highPriority: 'Magas prioritás', mediumPriority: 'Közepes prioritás', lowPriority: 'Alacsony prioritás',
    createGoal: 'Cél létrehozása', goalTitle: 'Cél címe', goalSubject: 'Tárgy', goalDeadline: 'Határidő',
    goalPriority: 'Prioritás', goalHours: 'Tervezett órák',
    taskTitle: 'Feladat címe', taskSubject: 'Tárgy', taskDue: 'Határidő', taskEffort: 'Erőfeszítés (1-5)',
    generate: 'Generálás', studyPlan: 'Tanulási terv',
    toDo: 'Teendők', inProgress: 'Folyamatban', done: 'Kész',
    move: 'Mozgatás →', reactivate: 'Újraaktiválás',
    noGoals: 'Még nincsenek célok.',
    // Sessions
    focusTimer: 'Fókusz időzítő', focus: 'FÓKUSZ', start: 'Indítás', reset: 'Visszaállítás', skip: 'Kihagyás',
    focusMin: 'Fókusz (perc)', breakMin: 'Szünet (perc)', save: 'Mentés',
    enableNotifications: 'Értesítések engedélyezése',
    logStudySession: 'Tanulási alkalom rögzítése', subject: 'Tárgy', duration: 'Időtartam (perc)',
    sessionType: 'Típus', deepWork: 'Mély koncentráció', saveSession: 'Alkalom mentése',
    sessionHistory: 'Alkalmak előzményei',
    // Flashcards
    createFlashcard: 'Tanulókártya létrehozása', question: 'Kérdés', answer: 'Válasz',
    addFlashcard: 'Tanulókártya hozzáadása', generateAIFlashcards: 'AI tanulókártyák generálása',
    aiWordFinder: 'AI szókereső', askAI: 'Kérdezd AI-t', addAIWords: 'AI szavak hozzáadása kártyaként',
    studyMode: 'Tanulási mód', due: 'Esedékes', new: 'Új', total: 'Összesen',
    noCardsDue: 'Nincs esedékes kártya. Adj hozzá vagy generálj AI segítségével.',
    allFlashcards: 'Összes tanulókártya',
    again: 'Újra', hard: 'Nehéz', good: 'Jó', easy: 'Könnyű',
    // Quizzes
    aiQuizGenerator: 'AI kvíz generátor', quizArena: 'Kvíz aréna', timedMockTest: 'AI időzített próbateszt',
    createQuiz: 'Kvíz létrehozása', next: 'Következő', submitQuiz: 'Kvíz beküldése',
    previous: 'Előző', markForReview: 'Megjelölés áttekintésre', submitMockTest: 'Próbateszt beküldése',
    quizAttempts: 'Kvíz kísérletek', mockTestHistory: 'Próbateszt előzmények',
    topic: 'Téma', difficulty: 'Nehézség', type: 'Típus',
    easy: 'Könnyű', medium: 'Közepes', hard: 'Nehéz',
    // Subjects
    subjects: 'Tárgyak',
    // Google voice
    startCall: 'Hívás indítása',
    // Coach
    coach: 'Edző', performanceCoach: 'Teljesítmény edző',
    // General
    search: 'Keresés', cancel: 'Mégse', confirm: 'Megerősítés', delete: 'Törlés',
    comingSoon: 'Hamarosan',
  }
};
const _lang = () => state?.settings?.appLanguage || 'en';
function __(key) { const l = _lang(); return LOCALES[l]?.[key] || LOCALES.en[key] || key; }

const DEFAULT_STATE = {
  profile: { name: 'Scholar', major: 'General Studies', weeklyTargetHours: 20, targetGpa: 3.8, setupComplete: false, subjects: [], interests: '', learningStyle: '', difficulties: '', goals: '', xp: 0, currentStreak: 0 },
    settings: { darkMode: false, theme: 'teal', customColor: '#0f766e', responseStyle: 'detailed', studyMode: 'balanced', focusMinutes: 25, breakMinutes: 5, timerNotify: true, appLanguage: 'en', googleClientId: '', adhdMode: false, hideMusic: false, shortcuts: {}, peerMethod: 'same-age', warmupStats: { bestStreak: 0, totalGames: 0, totalCorrect: 0 }, autismClearLang: true, autismStepByStep: true, autismVisual: true, autismPredictable: true, autismSpeechRate: 'moderate', autismLevel: 2, _ach: { goalsCompleted: 0, earlyTasks: 0, studyPlansGenerated: 0, reflectionsCount: 0 } },
  goals: [], tasks: [], sessions: [], flashcards: [], notes: [], assignments: [],
  reflections: [], quizAttempts: [], mockTestHistory: [], recallHistory: [],
  aiChatHistory: [], lessonChatHistory: [], voiceTranscript: [],
  musicTrackIndex: 0, musicVolume: 70, musicPlaying: false,
  calendarEvents: [],
  playlists: [],
  lectureRecordings: [],
};

// ===== DEMO DATA FOR JUDGE MODE =====
const DEMO_DATA = {
  profile: { name: 'Judge', major: 'All Subjects', weeklyTargetHours: 25, targetGpa: 4.0, setupComplete: true, subjects: ['AP Physics', 'SAT Prep', 'Organic Chemistry'], interests: 'Competitive academics, Test preparation', learningStyle: 'visual', difficulties: 'None', goals: 'Ace all exams, Get into top college', xp: 450, currentStreak: 7 },
  settings: { darkMode: false, theme: 'teal', customColor: '#0f766e', responseStyle: 'detailed', studyMode: 'balanced', focusMinutes: 25, breakMinutes: 5, timerNotify: true, appLanguage: 'en', googleClientId: '', adhdMode: false, hideMusic: false, shortcuts: {}, peerMethod: 'same-age', warmupStats: { bestStreak: 7, totalGames: 0, totalCorrect: 0 }, autismClearLang: true, autismStepByStep: true, autismVisual: true, autismPredictable: true, autismSpeechRate: 'moderate', autismLevel: 2, _ach: { goalsCompleted: 1, earlyTasks: 0, studyPlansGenerated: 0, reflectionsCount: 0 } },
  goals: [
    { id: 'demo_goal_1', title: 'Ace AP Physics Exam', subject: 'AP Physics', deadline: '2026-12-15', priority: 'high', hours: 20, createdAt: '2026-08-01' },
    { id: 'demo_goal_2', title: 'SAT Score 1500+', subject: 'SAT Prep', deadline: '2026-11-01', priority: 'high', hours: 30, createdAt: '2026-08-01' },
    { id: 'demo_goal_3', title: 'Master Organic Chemistry', subject: 'Organic Chemistry', deadline: '2026-10-20', priority: 'medium', hours: 15, createdAt: '2026-08-01' }
  ],
  tasks: [
    { id: 'demo_task_1', title: 'Review AP Physics Kinematics', subject: 'AP Physics', due: '2026-08-15', effort: 3, status: 'done', createdAt: '2026-08-01' },
    { id: 'demo_task_2', title: 'SAT Math Practice Set 1', subject: 'SAT Prep', due: '2026-08-16', effort: 2, status: 'done', createdAt: '2026-08-01' },
    { id: 'demo_task_3', title: 'Organic Chemistry Nomenclature', subject: 'Organic Chemistry', due: '2026-08-17', effort: 2, status: 'todo', createdAt: '2026-08-01' }
  ],
  sessions: [
    { id: 'demo_session_1', date: '2026-08-01T10:00:00Z', subject: 'AP Physics', objective: 'Review kinematics equations', minutes: 60, quality: 9, method: 'Active Recall', deep: true, notes: 'Focused on velocity and acceleration relationships' },
    { id: 'demo_session_2', date: '2026-08-02T09:00:00Z', subject: 'SAT Prep', objective: 'Math practice problems', minutes: 45, quality: 8, method: 'Practice Test', deep: true, notes: 'Worked on algebra and geometry' },
    { id: 'demo_session_3', date: '2026-08-03T11:00:00Z', subject: 'Organic Chemistry', objective: 'Functional groups review', minutes: 50, quality: 8, method: 'Flashcards', deep: false, notes: 'Memorized key functional groups' },
    { id: 'demo_session_4', date: '2026-08-04T14:00:00Z', subject: 'AP Physics', objective: 'Forces and motion', minutes: 75, quality: 9, method: 'Active Recall', deep: true, notes: 'Newton\'s laws practice' },
    { id: 'demo_session_5', date: '2026-08-05T16:00:00Z', subject: 'SAT Prep', objective: 'Reading comprehension', minutes: 60, quality: 7, method: 'Practice Test', deep: true, notes: 'Timed reading section' },
    { id: 'demo_session_6', date: '2026-08-06T12:00:00Z', subject: 'Organic Chemistry', objective: 'Reaction mechanisms', minutes: 90, quality: 9, method: 'Active Recall', deep: true, notes: 'SN1/SN2 mechanisms' },
    { id: 'demo_session_7', date: '2026-08-07T15:00:00Z', subject: 'AP Physics', objective: 'Energy and momentum', minutes: 45, quality: 8, method: 'Practice Test', deep: false, notes: 'Conservation laws review' }
  ],
  flashcards: [
    // AP Physics Deck (15 cards)
    { id: 'fc_ap_1', deck: 'AP Physics', question: 'What is Newton\'s First Law?', answer: 'An object in motion stays in motion, and an object at rest stays at rest, unless acted upon by an external force. Also known as the Law of Inertia.', dueDate: '2026-08-07', interval: 1, ease: 2.5, repetitions: 1, createdAt: '2026-08-01' },
    { id: 'fc_ap_2', deck: 'AP Physics', question: 'Formula for gravitational force', answer: 'F = G * (m1 * m2) / r^2, where G is the gravitational constant (6.674×10^-11 N·m^2/kg^2)', dueDate: '2026-08-07', interval: 1, ease: 2.5, repetitions: 1, createdAt: '2026-08-01' },
    { id: 'fc_ap_3', deck: 'AP Physics', question: 'What is the kinematic equation for velocity without initial velocity?', answer: 'v = u + at, where v is final velocity, u is initial velocity, a is acceleration, t is time', dueDate: '2026-08-07', interval: 1, ease: 2.5, repetitions: 1, createdAt: '2026-08-01' },
    { id: 'fc_ap_4', deck: 'AP Physics', question: 'What is the kinematic equation for displacement?', answer: 's = ut + (1/2)at^2, where s is displacement, u is initial velocity, a is acceleration, t is time', dueDate: '2026-08-07', interval: 1, ease: 2.5, repetitions: 1, createdAt: '2026-08-01' },
    { id: 'fc_ap_5', deck: 'AP Physics', question: 'What is the relationship between force, mass, and acceleration?', answer: 'F = ma (Newton\'s Second Law). Force equals mass times acceleration.', dueDate: '2026-08-07', interval: 1, ease: 2.5, repetitions: 1, createdAt: '2026-08-01' },
    { id: 'fc_ap_6', deck: 'AP Physics', question: 'What is the formula for work?', answer: 'W = F * d * cos(θ), where W is work, F is force, d is displacement, θ is the angle between force and displacement', dueDate: '2026-08-07', interval: 2, ease: 2.5, repetitions: 1, createdAt: '2026-08-01' },
    { id: 'fc_ap_7', deck: 'AP Physics', question: 'What is the formula for kinetic energy?', answer: 'KE = (1/2)mv^2, where m is mass and v is velocity', dueDate: '2026-08-07', interval: 2, ease: 2.5, repetitions: 1, createdAt: '2026-08-01' },
    { id: 'fc_ap_8', deck: 'AP Physics', question: 'What is the formula for potential energy?', answer: 'PE = mgh, where m is mass, g is acceleration due to gravity, h is height', dueDate: '2026-08-07', interval: 2, ease: 2.5, repetitions: 1, createdAt: '2026-08-01' },
    { id: 'fc_ap_9', deck: 'AP Physics', question: 'What is the Law of Conservation of Momentum?', answer: 'In a closed system, the total momentum before a collision equals the total momentum after the collision (p_before = p_after)', dueDate: '2026-08-07', interval: 3, ease: 2.5, repetitions: 1, createdAt: '2026-08-01' },
    { id: 'fc_ap_10', deck: 'AP Physics', question: 'What is the formula for momentum?', answer: 'p = mv, where p is momentum, m is mass, v is velocity', dueDate: '2026-08-07', interval: 3, ease: 2.5, repetitions: 1, createdAt: '2026-08-01' },
    { id: 'fc_ap_11', deck: 'AP Physics', question: 'What is the formula for power?', answer: 'P = W/t = Fv, where P is power, W is work, t is time, F is force, v is velocity', dueDate: '2026-08-08', interval: 0, ease: 2.5, repetitions: 0, createdAt: '2026-08-01' },
    { id: 'fc_ap_12', deck: 'AP Physics', question: 'What is Hooke\'s Law?', answer: 'F = -kx, where F is the restoring force, k is the spring constant, x is the displacement from equilibrium', dueDate: '2026-08-08', interval: 0, ease: 2.5, repetitions: 0, createdAt: '2026-08-01' },
    { id: 'fc_ap_13', deck: 'AP Physics', question: 'What is the formula for gravitational potential energy?', answer: 'U = mgh, same as regular potential energy but specifically for gravity', dueDate: '2026-08-08', interval: 0, ease: 2.5, repetitions: 0, createdAt: '2026-08-01' },
    { id: 'fc_ap_14', deck: 'AP Physics', question: 'What is the difference between speed and velocity?', answer: 'Speed is a scalar quantity (magnitude only), velocity is a vector quantity (magnitude and direction)', dueDate: '2026-08-08', interval: 0, ease: 2.5, repetitions: 0, createdAt: '2026-08-01' },
    { id: 'fc_ap_15', deck: 'AP Physics', question: 'What is the formula for centripetal force?', answer: 'F_c = mv^2/r, where m is mass, v is velocity, r is radius of circular path', dueDate: '2026-08-08', interval: 0, ease: 2.5, repetitions: 0, createdAt: '2026-08-01' },
    // SAT Prep Deck (15 cards)
    { id: 'fc_sat_1', deck: 'SAT Prep', question: 'What is the formula for the area of a circle?', answer: 'A = πr^2, where r is the radius', dueDate: '2026-08-07', interval: 1, ease: 2.5, repetitions: 1, createdAt: '2026-08-01' },
    { id: 'fc_sat_2', deck: 'SAT Prep', question: 'What is the Pythagorean theorem?', answer: 'a^2 + b^2 = c^2, where a and b are the legs of a right triangle, c is the hypotenuse', dueDate: '2026-08-07', interval: 1, ease: 2.5, repetitions: 1, createdAt: '2026-08-01' },
    { id: 'fc_sat_3', deck: 'SAT Prep', question: 'What is the formula for the volume of a cylinder?', answer: 'V = πr^2h, where r is radius, h is height', dueDate: '2026-08-07', interval: 1, ease: 2.5, repetitions: 1, createdAt: '2026-08-01' },
    { id: 'fc_sat_4', deck: 'SAT Prep', question: 'What is the formula for slope?', answer: 'm = (y2 - y1) / (x2 - x1) = rise / run', dueDate: '2026-08-07', interval: 1, ease: 2.5, repetitions: 1, createdAt: '2026-08-01' },
    { id: 'fc_sat_5', deck: 'SAT Prep', question: 'What is the quadratic formula?', answer: 'x = [-b ± √(b^2 - 4ac)] / (2a), for equations in the form ax^2 + bx + c = 0', dueDate: '2026-08-07', interval: 1, ease: 2.5, repetitions: 1, createdAt: '2026-08-01' },
    { id: 'fc_sat_6', deck: 'SAT Prep', question: 'What is the sum of angles in a triangle?', answer: '180 degrees', dueDate: '2026-08-07', interval: 2, ease: 2.5, repetitions: 1, createdAt: '2026-08-01' },
    { id: 'fc_sat_7', deck: 'SAT Prep', question: 'What is the formula for the circumference of a circle?', answer: 'C = 2πr = πd, where r is radius, d is diameter', dueDate: '2026-08-07', interval: 2, ease: 2.5, repetitions: 1, createdAt: '2026-08-01' },
    { id: 'fc_sat_8', deck: 'SAT Prep', question: 'What is the formula for the volume of a sphere?', answer: 'V = (4/3)πr^3, where r is radius', dueDate: '2026-08-07', interval: 2, ease: 2.5, repetitions: 1, createdAt: '2026-08-01' },
    { id: 'fc_sat_9', deck: 'SAT Prep', question: 'What is the formula for the area of a triangle?', answer: 'A = (1/2) * base * height', dueDate: '2026-08-08', interval: 0, ease: 2.5, repetitions: 0, createdAt: '2026-08-01' },
    { id: 'fc_sat_10', deck: 'SAT Prep', question: 'What is the distance formula?', answer: 'd = √[(x2 - x1)^2 + (y2 - y1)^2], distance between two points (x1,y1) and (x2,y2)', dueDate: '2026-08-08', interval: 0, ease: 2.5, repetitions: 0, createdAt: '2026-08-01' },
    { id: 'fc_sat_11', deck: 'SAT Prep', question: 'What is the midpoint formula?', answer: 'M = ((x1 + x2)/2, (y1 + y2)/2), midpoint between (x1,y1) and (x2,y2)', dueDate: '2026-08-08', interval: 0, ease: 2.5, repetitions: 0, createdAt: '2026-08-01' },
    { id: 'fc_sat_12', deck: 'SAT Prep', question: 'What is the formula for simple interest?', answer: 'I = P * r * t, where P is principal, r is rate, t is time', dueDate: '2026-08-08', interval: 0, ease: 2.5, repetitions: 0, createdAt: '2026-08-01' },
    { id: 'fc_sat_13', deck: 'SAT Prep', question: 'What is the formula for compound interest?', answer: 'A = P(1 + r/n)^(nt), where P is principal, r is rate, n is number of times compounded per year, t is time', dueDate: '2026-08-08', interval: 0, ease: 2.5, repetitions: 0, createdAt: '2026-08-01' },
    { id: 'fc_sat_14', deck: 'SAT Prep', question: 'What is the average formula?', answer: 'Average = (sum of all values) / (number of values)', dueDate: '2026-08-08', interval: 0, ease: 2.5, repetitions: 0, createdAt: '2026-08-01' },
    { id: 'fc_sat_15', deck: 'SAT Prep', question: 'What is the formula for percent increase?', answer: 'Percent Increase = [(New Value - Original Value) / Original Value] * 100%', dueDate: '2026-08-08', interval: 0, ease: 2.5, repetitions: 0, createdAt: '2026-08-01' },
    // Organic Chemistry Deck (15 cards)
    { id: 'fc_oc_1', deck: 'Organic Chemistry', question: 'What is the most common functional group in organic chemistry?', answer: 'Hydroxyl group (-OH), found in alcohols', dueDate: '2026-08-07', interval: 1, ease: 2.5, repetitions: 1, createdAt: '2026-08-01' },
    { id: 'fc_oc_2', deck: 'Organic Chemistry', question: 'What is the general formula for alkanes?', answer: 'C_nH_(2n+2), where n is the number of carbon atoms', dueDate: '2026-08-07', interval: 1, ease: 2.5, repetitions: 1, createdAt: '2026-08-01' },
    { id: 'fc_oc_3', deck: 'Organic Chemistry', question: 'What is the general formula for alkenes?', answer: 'C_nH_(2n), contains at least one carbon-carbon double bond', dueDate: '2026-08-07', interval: 1, ease: 2.5, repetitions: 1, createdAt: '2026-08-01' },
    { id: 'fc_oc_4', deck: 'Organic Chemistry', question: 'What is the general formula for alkynes?', answer: 'C_nH_(2n-2), contains at least one carbon-carbon triple bond', dueDate: '2026-08-07', interval: 1, ease: 2.5, repetitions: 1, createdAt: '2026-08-01' },
    { id: 'fc_oc_5', deck: 'Organic Chemistry', question: 'What is isomerism?', answer: 'Compounds with the same molecular formula but different structural arrangements or spatial orientations', dueDate: '2026-08-07', interval: 1, ease: 2.5, repetitions: 1, createdAt: '2026-08-01' },
    { id: 'fc_oc_6', deck: 'Organic Chemistry', question: 'What is a carbonyl group?', answer: 'C=O (carbon double-bonded to oxygen), found in aldehydes and ketones', dueDate: '2026-08-07', interval: 2, ease: 2.5, repetitions: 1, createdAt: '2026-08-01' },
    { id: 'fc_oc_7', deck: 'Organic Chemistry', question: 'What is a carboxyl group?', answer: '-COOH, found in carboxylic acids', dueDate: '2026-08-07', interval: 2, ease: 2.5, repetitions: 1, createdAt: '2026-08-01' },
    { id: 'fc_oc_8', deck: 'Organic Chemistry', question: 'What is an amino group?', answer: '-NH2, found in amines and amino acids', dueDate: '2026-08-07', interval: 2, ease: 2.5, repetitions: 1, createdAt: '2026-08-01' },
    { id: 'fc_oc_9', deck: 'Organic Chemistry', question: 'What is the difference between aldehydes and ketones?', answer: 'Aldehydes have the carbonyl group at the end of the carbon chain (R-CHO), ketones have it in the middle (R-COR\')', dueDate: '2026-08-08', interval: 0, ease: 2.5, repetitions: 0, createdAt: '2026-08-01' },
    { id: 'fc_oc_10', deck: 'Organic Chemistry', question: 'What is a benzene ring?', answer: 'A six-carbon ring with alternating double bonds (C6H6), aromatic compound', dueDate: '2026-08-08', interval: 0, ease: 2.5, repetitions: 0, createdAt: '2026-08-01' },
    { id: 'fc_oc_11', deck: 'Organic Chemistry', question: 'What is a chiral carbon?', answer: 'A carbon atom bonded to four different groups, creates optical isomers (enantiomers)', dueDate: '2026-08-08', interval: 0, ease: 2.5, repetitions: 0, createdAt: '2026-08-01' },
    { id: 'fc_oc_12', deck: 'Organic Chemistry', question: 'What is SN1 reaction?', answer: 'Substitution Nucleophilic Unimolecular: two-step mechanism with carbocation intermediate, rate depends only on substrate', dueDate: '2026-08-08', interval: 0, ease: 2.5, repetitions: 0, createdAt: '2026-08-01' },
    { id: 'fc_oc_13', deck: 'Organic Chemistry', question: 'What is SN2 reaction?', answer: 'Substitution Nucleophilic Bimolecular: one-step mechanism with backside attack, rate depends on both substrate and nucleophile', dueDate: '2026-08-08', interval: 0, ease: 2.5, repetitions: 0, createdAt: '2026-08-01' },
    { id: 'fc_oc_14', deck: 'Organic Chemistry', question: 'What is the difference between SN1 and SN2?', answer: 'SN1: 2 steps, carbocation intermediate, unimolecular, tertiary substrates. SN2: 1 step, backside attack, bimolecular, primary/secondary substrates', dueDate: '2026-08-08', interval: 0, ease: 2.5, repetitions: 0, createdAt: '2026-08-01' },
    { id: 'fc_oc_15', deck: 'Organic Chemistry', question: 'What is Markovnikov\'s rule?', answer: 'In addition reactions to unsymmetrical alkenes, the hydrogen atom attaches to the carbon with the greater number of hydrogen atoms', dueDate: '2026-08-08', interval: 0, ease: 2.5, repetitions: 0, createdAt: '2026-08-01' }
  ],
  quizAttempts: [
    { id: 'demo_quiz_1', topic: 'AP Physics Practice', subject: 'AP Physics', questions: 5, correct: 5, score: 5, total: 5, percentage: 100, date: '2026-08-07T14:00:00Z', xpEarned: 40 }
  ],
  notes: [
    { id: 'demo_note_1', title: 'AP Physics Kinematics', subject: 'AP Physics', content: '# Kinematics Notes\n\n## Key Equations\n- v = u + at\n- s = ut + 0.5at^2\n- v^2 = u^2 + 2as\n\n## Concepts\n- Displacement vs Distance\n- Speed vs Velocity\n- Acceleration', style: 'freeform', tags: 'physics,kinematics', createdAt: '2026-08-01' }
  ]
};

function loadDemoData() {
  // Merge demo data with default state
  const demoState = deepMerge(cloneObj(DEFAULT_STATE), DEMO_DATA);
  
  // Update current state
  state = demoState;
  
  // Save to localStorage
  saveState();
  
  // Show success toast
  showToast('Sample study environment loaded! 3 decks, 45 flashcards, 1 quiz, 7-day streak, 450 XP', 'success');
  
  // Update UI counters
  updateStreakXP();
  
  // Update UI
  if (typeof renderDashboard === 'function') renderDashboard();
  if (typeof renderAllFlashcards === 'function') renderAllFlashcards();
  if (typeof renderFlashcardStudy === 'function') renderFlashcardStudy();
  if (typeof renderGoals === 'function') renderGoals();
  if (typeof renderKanban === 'function') renderKanban();
  if (typeof renderSessionHistory === 'function') renderSessionHistory();
  if (typeof renderQuizAttempts === 'function') renderQuizAttempts();
  
  // Hide judge banner if it exists
  const banner = document.getElementById('judgeBanner');
  if (banner) banner.classList.add('hidden');
  
  // Update peer activity and leaderboard
  renderPeerActivityFeed();
  renderWeeklyLeaderboard();
  renderImpactMetrics();
  
  return true;
}

function initJudgeBanner() {
  const banner = document.getElementById('judgeBanner');
  const dismissBtn = document.getElementById('dismissBannerBtn');
  
  if (!banner) return;
  
  // Check if demo data is already loaded
  if (state.profile.xp >= 450 || state.flashcards.length >= 45) {
    banner.classList.add('hidden');
  }
  
  // Dismiss button handler
  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      banner.classList.add('hidden');
      localStorage.setItem('judgeBannerDismissed', 'true');
    });
  }
  
  // Check if banner was previously dismissed
  if (localStorage.getItem('judgeBannerDismissed') === 'true') {
    banner.classList.add('hidden');
  }
}

function updateStreakXP() {
  const streakEl = document.getElementById('streakValue');
  const xpEl = document.getElementById('xpValue');
  
  if (streakEl) streakEl.textContent = state.profile.currentStreak || 0;
  if (xpEl) xpEl.textContent = state.profile.xp || 0;
}

// ===== PEER ACTIVITY FEED =====
const PEER_ACTIVITIES = [
  { name: 'Alex M.', action: 'scored 90% on AP Physics Quiz', time: '2m ago' },
  { name: 'Sarah T.', action: 'created 12 new SAT Vocabulary Flashcards', time: '15m ago' },
  { name: 'Michael P.', action: 'completed a 2-hour study session', time: '32m ago' },
  { name: 'Emma R.', action: 'mastered Organic Chemistry mechanisms', time: '1h ago' },
  { name: 'James K.', action: 'finished Calculus problem set', time: '2h ago' },
  { name: 'Olivia S.', action: 'started new study streak', time: '3h ago' }
];

function renderPeerActivityFeed() {
  const el = document.getElementById('peerActivityFeed');
  if (!el) return;
  
  el.innerHTML = '';
  PEER_ACTIVITIES.forEach(activity => {
    const item = document.createElement('div');
    item.className = 'peer-activity-item';
    const initial = activity.name.split(' ')[0].charAt(0);
    item.innerHTML = `
      <div class="peer-activity-avatar">${initial}</div>
      <div class="peer-activity-content">
        <span class="peer-activity-name">${activity.name}</span>
        <span class="peer-activity-action"> ${activity.action}</span>
        <div class="peer-activity-time">${activity.time}</div>
      </div>
    `;
    el.appendChild(item);
  });
}

// ===== WEEKLY LEADERBOARD =====
const LEADERBOARD_DATA = [
  { rank: 1, name: 'Alex M.', streak: 7, xp: 1250 },
  { rank: 2, name: 'Sarah T.', streak: 5, xp: 980 },
  { rank: 3, name: 'Michael P.', streak: 6, xp: 850 },
  { rank: 4, name: 'Emma R.', streak: 4, xp: 720 },
  { rank: 5, name: 'James K.', streak: 3, xp: 600 },
  { rank: 6, name: 'Olivia S.', streak: 2, xp: 450 },
  { rank: 7, name: 'You', streak: state.profile.currentStreak || 0, xp: state.profile.xp || 0 }
];

function renderWeeklyLeaderboard() {
  const el = document.getElementById('weeklyLeaderboard');
  if (!el) return;
  
  el.innerHTML = `
    <div class="leaderboard-header">
      <span>Rank</span>
      <span>Name</span>
      <span>Streak</span>
      <span>XP</span>
    </div>
  `;
  
  LEADERBOARD_DATA.forEach(user => {
    const row = document.createElement('div');
    row.className = `leaderboard-row ${user.name === 'You' ? 'me' : ''}`;
    row.innerHTML = `
      <div class="leaderboard-rank">${user.rank}</div>
      <div class="leaderboard-name">${user.name}</div>
      <div class="leaderboard-streak">${user.streak} days</div>
      <div class="leaderboard-xp">${user.xp}</div>
    `;
    el.appendChild(row);
  });
}

// ===== IMPACT METRICS DASHBOARD =====
const IMPACT_METRICS = [
  { value: '12.4 hrs', label: 'Study Time Saved via AI Processing' },
  { value: '84%', label: 'Average Quiz Completion Rate' },
  { value: '14', label: 'Peer Collaborations Active' }
];

function renderImpactMetrics() {
  const el = document.getElementById('impactMetrics');
  if (!el) return;
  
  el.innerHTML = '';
  IMPACT_METRICS.forEach(metric => {
    const item = document.createElement('div');
    item.className = 'impact-metric';
    item.innerHTML = `
      <div class="impact-metric-value">${metric.value}</div>
      <div class="impact-metric-label">${metric.label}</div>
    `;
    el.appendChild(item);
  });
}

// ===== SKELETON LOADING =====
function showLoading(message = 'Processing...') {
  let overlay = document.getElementById('loadingOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div style="text-align: center; color: white;">
        <div class="loading-spinner"></div>
        <p style="margin-top: 16px; font-size: 1.1rem;">${message}</p>
      </div>
    `;
    document.body.appendChild(overlay);
  }
  overlay.style.display = 'flex';
}

function hideLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) overlay.style.display = 'none';
}

// ===== MOBILE MENU =====
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const sidebar = document.querySelector('.sidebar');
  
  if (!menuBtn || !sidebar) return;
  
  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    sidebar.classList.toggle('open');
  });
  
  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      if (!menuBtn.contains(e.target) && !sidebar.contains(e.target)) {
        menuBtn.classList.remove('active');
        sidebar.classList.remove('open');
      }
    }
  });
  
  // Close sidebar when navigating to a tab on mobile
  qsa('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        menuBtn.classList.remove('active');
        sidebar.classList.remove('open');
      }
    });
  });
}

let state;
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      state = deepMerge(cloneObj(DEFAULT_STATE), JSON.parse(raw));
    } else {
      state = cloneObj(DEFAULT_STATE);
    }
  } catch (e) {
    state = cloneObj(DEFAULT_STATE);
  }
}
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { logErrors('saveState')(e); }
}
function deepMerge(t, s) {
  const r = cloneObj(t);
  for (const k in s) {
    if (s[k] && typeof s[k] === 'object' && !Array.isArray(s[k])) r[k] = deepMerge(r[k] || {}, s[k]);
    else r[k] = s[k];
  }
  return r;
}
function cloneObj(o) { return JSON.parse(JSON.stringify(o)); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 6); }
function generateId() { return uid(); }
function showToast(msg, type) {
  if (typeof sonner !== 'undefined') {
    if (type === 'error') sonner.error(msg);
    else if (type === 'success') sonner.success(msg);
    else sonner(msg);
  } else {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('hidden');
    if (type === 'error') el.style.background = '#7f1d1d';
    else if (type === 'success') el.style.background = '#065f46';
    else el.style.background = '#152b2a';
    clearTimeout(el._hide);
    el._hide = setTimeout(() => { el.classList.add('hidden'); }, 2500);
  }
}
function showConfirm(msg) {
  return new Promise(resolve => {
    const result = window.confirm(msg);
    resolve(result);
  });
}
function truncate(str, len) {
  if (!str) return '';
  return str.length > len ? str.substring(0, len) + '...' : str;
}
function getSubjectColor(subject) {
  const colors = {
    'Mathematics': '#0b5cab', 'Biology': '#237a57', 'History': '#b45309',
    'Physics': '#7c3aed', 'Chemistry': '#db2777', 'Literature': '#ca8a04',
    'English': '#0f766e', 'Computer Science': '#2563eb', 'Psychology': '#9333ea',
    'Art': '#d946ef', 'Music': '#0891b2', 'Economics': '#65a30d'
  };
  return colors[subject] || 'var(--accent)';
}

// ===== GROQ AI =====
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
let studentLearningStyle = '';
async function groqChat(messages, options = {}) {
  const model = options.model || 'llama-3.1-8b-instant';
  const maxTokens = options.maxTokens || 2048;
  const temperature = options.temperature ?? 0.7;
  const payload = { model, messages, max_tokens: maxTokens, temperature };
  // Prefer the serverless proxy (keeps the API key out of the browser bundle).
  try {
    const proxied = await fetch('/api/groq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (proxied.ok) {
      const data = await proxied.json();
      return data.choices?.[0]?.message?.content || '';
    }
  } catch (e) { /* fall through to local fallback */ }
  // Local fallback for file:// or dev builds where the proxy is unavailable.
  const localKey = window._GROQ_FALLBACK_KEY;
  if (localKey) {
    const res = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localKey}` },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Groq API error ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  }
  throw new Error('Groq proxy unavailable');
}

// ===== UTILITIES =====
function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function daysUntil(d) {
  return Math.ceil((new Date(d) - new Date()) / (1000 * 60 * 60 * 24));
}
function todayStr() { return new Date().toISOString().split('T')[0]; }
function escapeHtml(t) {
  const d = document.createElement('div');
  d.textContent = t;
  return d.innerHTML;
}

function renderMarkdown(t) {
  var text = escapeHtml(t);
  text = text.replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
  text = text.replace(/^#### (.+)$/gm, '<h5>$1</h5>');
  text = text.replace(/^### (.+)$/gm, '<h4>$1</h4>');
  text = text.replace(/^## (.+)$/gm, '<h3>$1</h3>');
  text = text.replace(/^# (.+)$/gm, '<h2>$1</h2>');
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  text = text.replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>');
  text = text.replace(/^- (.+)$/gm, '<li>$1</li>');
  text = text.replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>');
  text = text.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  var parts = text.split(/\n\n+/);
  var wrapped = [];
  for (var i = 0; i < parts.length; i++) {
    var p = parts[i].trim();
    if (!p) continue;
    if (/^<(h[2345]|pre|blockquote|ul|ol|li)/.test(p)) { wrapped.push(p); }
    else { wrapped.push('<p>' + p.replace(/\n/g, '<br>') + '</p>'); }
  }
  return wrapped.join('\n');
}
function $(id) {
  var el = document.getElementById(id);
  if (!el && typeof console !== 'undefined') console.warn('$("' + id + '") not found');
  return el;
}
function safeCall(fn) {
  try { return fn(); } catch(e) { if (typeof console !== 'undefined') console.warn(fn.name || 'fn', e); }
}
function logErrors(context) {
  return function(err) {
    if (typeof console !== 'undefined') console.error('[' + context + ']', err && err.stack ? err.stack : err);
  };
}
const WORK_PRINCIPLE = ' When the student asks you to do their work (solve homework, write an essay, answer a question), DO NOT just do it for them: guide them step by step, check what they already know, give hints, and make them learn it themselves. Only provide a full answer if they are clearly stuck or explicitly ask to see it.';
const FOLLOWUP_NOTE = ' End your reply with ONE short follow-up question that checks their understanding or invites them to try the next step.';
const SOCRATIC_NOTE = ' Act as a personal teacher, not an answer machine. Guide the student to figure things out themselves with hints and probing questions, then end with ONE follow-up question. Never dump the answer unless they are stuck or explicitly ask.';


function qs(s, c) { return (c || document).querySelector(s); }
function qsa(s, c) { return (c || document).querySelectorAll(s); }

// ===== TAB NAVIGATION =====
function showTab(tabId) {
  qsa('.tab').forEach(t => t.classList.remove('active'));
  qsa('.nav-btn').forEach(b => b.classList.remove('active'));
  const tab = $(tabId);
  if (tab) tab.classList.add('active');
  const btn = qs(`.nav-btn[data-tab="${tabId}"]`);
  if (btn) btn.classList.add('active');
  if (tabId === 'analytics' && typeof renderCharts === 'function') renderCharts();
  updateWelcomeTitle();
  if (typeof Mobile !== 'undefined' && Mobile.syncMobileNav) Mobile.syncMobileNav(tabId);
}
function updateWelcomeTitle() {
  const at = qs('.tab.active');
  if (!at) return;
  const btn = qs(`.nav-btn[data-tab="${at.id}"]`);
  if (btn) $('welcomeTitle').textContent = `${btn.textContent} — ${state.profile.name}`;
}

function setupLearningStyle() {
  var lsSel = $('profileLearningStyle');
  if (!lsSel) return;
  lsSel.value = studentLearningStyle || '';
  lsSel.addEventListener('change', function() {
    studentLearningStyle = this.value;
    updateAppForLearningStyle();
    showToast('Learning style set to: ' + (this.options[this.selectedIndex].text || 'default'));
    saveLearningStyle();
  });
}
function updateAppForLearningStyle() {
  if (studentLearningStyle === 'visual') {
    qsa('.card').forEach(c => {
      c.style.border = '2px solid var(--accent)';
      c.style.position = 'relative';
    });
    qsa('.tab.active').forEach(t => {
      t.style.background = 'var(--panel)';
      t.style.borderBottom = '2px solid var(--accent)';
    });
  } else if (studentLearningStyle === 'auditory') {
    qsa('.card').forEach(c => {
      c.classList.add('auditory-mode');
      c.style.backgroundColor = 'var(--panel)';
    });
    qsa('.tab.active').forEach(t => {
      t.classList.add('auditory-active');
    });
  } else if (studentLearningStyle === 'kinesthetic') {
    qsa('.tab').forEach(t => {
      t.classList.add('kinesthetic-mode');
    });
    qsa('.nav-btn').forEach(b => {
      b.classList.add('kinesthetic-nav');
    });
  }
}
function showAIThoughtProcess(assistantReply, context) {
  var thinkEl = document.createElement('div');
  thinkEl.className = 'ai-thought';
  thinkEl.innerHTML = `
    <details class="details-think">
      <summary><span class="icon icon-sm icon-ai"></span> What the AI is thinking / process</summary>
      <div class="think-content">
        <p><strong>Context used:</strong> ${context || '(user profile and current topic)'}</p>
        <p><strong>Reasoning:</strong> The AI analyzed the student's question and applied the Socratic method — checking what they already know, breaking down the problem, offering hints, and preparing a follow-up question.</p>
        <p><strong>How the answer is structured:</strong> The reply is concise (~80 words), ends with a follow-up question to guide the student, and uses the student's learning style (${studentLearningStyle || 'default'}) to tailor the approach.</p>
        <div class="adjust-logic">
          <button class="ghost">Adjust Logic</button>
          <textarea class="hidden logic-textarea" placeholder="Modify AI reasoning here..."></textarea>
        </div>
      </div>
    </details>
  `;
  return thinkEl;
}
function setupSampleLesson() {
  var sampleBtn = $('sampleLessonBtn');
  var sampleOutput = $('sampleLessonOutput');
  if (!sampleBtn || !sampleOutput) return;
  sampleBtn.addEventListener('click', async function() {
    var topicEl = $('sampleLessonTopic');
    var topic = topicEl ? topicEl.value.trim() || 'Photosynthesis' : 'Photosynthesis';
    sampleBtn.disabled = true;
    sampleBtn.textContent = 'Loading...';
    sampleOutput.innerHTML = '<div class="analysis-content">Loading sample lesson...</div>';
    sampleOutput.classList.remove('hidden');
    try {
      var style = state.settings.responseStyle || 'detailed';
      var profileCtx = [state.profile.interests && ('Interests: ' + state.profile.interests + '.'), state.profile.learningStyle && ('Preferred learning style: ' + state.profile.learningStyle + '.'), state.profile.difficulties && ('Known difficulties to handle patiently: ' + state.profile.difficulties + '.'), state.profile.goals && ('Goals to motivate them with: ' + state.profile.goals + '.')].filter(Boolean).join(' ');
      var resp = await groqChat([
        { role: 'system', content: `You are a skilled Socratic tutor for ${state.profile.name || 'the student'}. Response style: ${style}. Act like a personal teacher, build understanding through guided questions, end with ONE follow-up question that checks understanding. ${profileCtx ? 'Student profile: ' + profileCtx : ''}` },
        { role: 'user', content: `Give a 60-second sample micro-lesson on "${topic}" for ${state.profile.major || 'a high-school student'}. Keep it brief, encouraging, and end with one follow-up question. Use simple language and structure for easy understanding.` }
      ], { maxTokens: 300 });
      sampleOutput.innerHTML = `
        <h4>Sample Lesson: ${escapeHtml(topic)}</h4>
        <div class="analysis-content">
          <div class="sample-text">${renderMarkdown(resp)}</div>
          <div class="sample-actions">
            <button class="ghost" onclick="this.closest('.analysis-content').innerHTML += '<div class=\"note\">Student question: Can you explain chloroplasts in simpler terms</div>';">Ask for clarification</button>
            <button class="ghost" onclick="this.closest('.analysis-content').innerHTML += '<div class=\"note\">Student thinking: ...</div>';">Adjust thinking</button>
          </div>
        </div>
      `;
      showToast('Sample lesson loaded');
    } catch (e) {
      sampleOutput.innerHTML = '<div class="analysis-content">Failed to load sample lesson. Please try again.</div>';
      showToast('Failed to load sample lesson');
    } finally {
      sampleBtn.disabled = false;
      sampleBtn.textContent = 'Try Sample Lesson';
    }
  });
}
function initializeLearningStyle() {
  if (!studentLearningStyle) {
    if (state.profile && state.profile.learningStyle) {
      studentLearningStyle = state.profile.learningStyle;
    } else {
      studentLearningStyle = 'mixed';
    }
  }
  updateAppForLearningStyle();
}

function saveLearningStyle() {
  if (studentLearningStyle && state.profile) {
    state.profile.learningStyle = studentLearningStyle;
    saveState();
  }
}

// ===== DASHBOARD =====
function renderDashboard() {
  try {
  const weekMins = state.sessions.filter(s => new Date(s.date) >= new Date(Date.now() - 7 * 86400000)).reduce((s, x) => s + (x.minutes || 0), 0);
  var el = $('metricHours'); if (el) el.textContent = `${Math.round(weekMins / 60 * 10) / 10}h`;
  const total = state.tasks.length;
  const done = state.tasks.filter(t => t.status === 'done').length;
  el = $('metricCompletion'); if (el) el.textContent = `${total > 0 ? Math.round(done / total * 100) : 0}%`;
  const dates = [...new Set(state.sessions.map(s => s.date.split('T')[0]))].sort().reverse();
  let streak = 0;
  let cd = new Date();
  for (const d of dates) {
    const diff = Math.round((new Date(d) - cd) / 86400000);
    if (diff === 0 || diff === -1) { streak++; cd = new Date(d); } else break;
  }
  $('metricStreak').textContent = `${streak} day${streak !== 1 ? 's' : ''}`;
  const score = Math.min(100, Math.round((done / Math.max(total, 1) * 100 + Math.min(weekMins / 60, 50)) / 1.5));
  $('metricScore').textContent = score;
  const todayTasks = state.tasks.filter(t => t.due === todayStr());
  if (todayTasks.length > 0) $('missionText').textContent = `Complete ${todayTasks.length} task${todayTasks.length > 1 ? 's' : ''} due today`;
  else if (state.goals.length > 0) {
    const g = state.goals.sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0];
    $('missionText').textContent = `Work toward "${g.title}" (due ${formatDate(g.deadline)})`;
  } else $('missionText').textContent = __('addFirstGoal');
  const agenda = $('todayAgendaList');
  agenda.innerHTML = '';
  const items = [...state.tasks.filter(t => t.due === todayStr()), ...state.goals.filter(g => g.deadline === todayStr()).map(g => ({ title: 'Goal due: ' + g.title }))];
  if (items.length === 0) agenda.innerHTML = `<li style="opacity:0.6">${__('nothingScheduled')}</li>`;
  else items.forEach(i => { const li = document.createElement('li'); li.className = 'item'; li.textContent = i.title; agenda.appendChild(li); });
  const prevWeekMins = state.sessions.filter(s => {
    const d = new Date(s.date);
    const twoWeeksAgo = new Date(Date.now() - 14 * 86400000);
    const oneWeekAgo = new Date(Date.now() - 7 * 86400000);
    return d >= twoWeeksAgo && d < oneWeekAgo;
  }).reduce((sum, x) => sum + (x.minutes || 0), 0);
  const trend = prevWeekMins > 0 ? Math.round((weekMins - prevWeekMins) / prevWeekMins * 100) : 0;
  const trendEl = document.createElement('span');
  trendEl.className = 'small';
  trendEl.style.cssText = `font-size:0.75rem;color:${trend > 0 ? 'var(--success)' : trend < 0 ? 'var(--danger)' : 'var(--muted)'}`;
  trendEl.textContent = trend > 0 ? `↑ ${trend}% vs last week` : trend < 0 ? `↓ ${Math.abs(trend)}% vs last week` : '→ Same as last week';
  $('metricHours').parentElement.appendChild(trendEl);
  const ach = $('achievementList');
  ach.innerHTML = '';
  var streakCache = streak;

  function achIcon(id) {
    var icons = { fire:'icon-timer', star:'icon-star', target:'icon-target', brain:'icon-brain', card:'icon-card', note:'icon-note', quiz:'icon-quiz', check:'icon-check', chart:'icon-chart', book:'icon-book', ai:'icon-ai', voice:'icon-voice' };
    return '<span class="icon icon-sm ' + (icons[id] || 'icon-star') + '"></span>';
  }

  var achDefs = [
    { id:'firstTask',    title:'First Task',       desc:'Complete your first task',                         icon:'check', check:function(s){return s.tasks.filter(function(t){return t.status==='done'}).length>=1} },
    { id:'taskTen',      title:'Task Crusher',     desc:'Complete 10 tasks',                                icon:'target', check:function(s){return s.tasks.filter(function(t){return t.status==='done'}).length>=10} },
    { id:'goalOne',      title:'Goal Down',        desc:'Complete your first goal',                         icon:'target', check:function(s){return ((s.settings._ach||{}).goalsCompleted||0)>=1} },
    { id:'goalThree',    title:'Goal Crusher',     desc:'Complete 3 goals',                                 icon:'target', check:function(s){return ((s.settings._ach||{}).goalsCompleted||0)>=3} },
    { id:'perfectQuiz',  title:'Perfect Score',    desc:'Get 100% on a quiz',                               icon:'star',   check:function(s){return s.quizAttempts.some(function(a){return a.score===a.total})} },
    { id:'streakThree',  title:'On Fire',          desc:'Study 3 days in a row',                            icon:'timer',  check:function(s){return streakCache>=3} },
    { id:'streakSeven',  title:'Week Warrior',     desc:'Study 7 days in a row',                            icon:'fire',   check:function(s){return streakCache>=7} },
    { id:'flashcardsTen',title:'Flashcard Fan',    desc:'Create 10 flashcards',                             icon:'card',   check:function(s){return s.flashcards.length>=10} },
    { id:'notesThree',   title:'Note Taker',       desc:'Create 3 notes',                                   icon:'note',   check:function(s){return s.notes.length>=3} },
    { id:'quizThree',    title:'Quiz Explorer',    desc:'Take 3 quizzes',                                   icon:'quiz',   check:function(s){return s.quizAttempts.length>=3} },
    { id:'sessionFirst', title:'First Session',    desc:'Log your first study session',                     icon:'timer',  check:function(s){return s.sessions.length>=1} },
    { id:'centuryMin',   title:'Century Mark',     desc:'Study 100+ total minutes',                         icon:'chart',  check:function(s){return s.sessions.reduce(function(t,x){return t+(x.minutes||0)},0)>=100} },
    { id:'aiChatter',    title:'AI Explorer',      desc:'Chat with AI Tutor 5 times',                       icon:'ai',     check:function(s){return s.aiChatHistory.length>=5} },
    { id:'reflections',  title:'Self Reflector',   desc:'Log 5 daily reflections',                          icon:'note',   check:function(s){return ((s.settings._ach||{}).reflectionsCount||0)>=5} },
    { id:'planned',      title:'Planned Ahead',    desc:'Generate a study plan',                            icon:'book',   check:function(s){return ((s.settings._ach||{}).studyPlansGenerated||0)>=1} },
    { id:'earlyBird',    title:'Early Bird',       desc:'Finish a task before its due date',                icon:'check',  check:function(s){return ((s.settings._ach||{}).earlyTasks||0)>=1} },
    { id:'flashcardRate',title:'Card Shark',       desc:'Rate 10 flashcards after review',                  icon:'card',   check:function(s){return s.flashcards.filter(function(f){return f.interval>1}).length>=10} },
    { id:'wellRounded',  title:'Well Rounded',     desc:'Use 4 different study tools',                      icon:'star',   check:function(s){var c=0;if(s.flashcards.length>=3)c++;if(s.quizAttempts.length>=3)c++;if(s.notes.length>=3)c++;if(s.sessions.length>=5)c++;if(s.flashcards.length>=3)c++;return c>=4} },
    { id:'mockMaster',   title:'Mock Master',      desc:'Complete a mock test',                             icon:'quiz',   check:function(s){return s.mockTestHistory.length>=1} },
    { id:'socialStart',  title:'Social Start',     desc:'Connect with the community tab',                   icon:'voice',  check:function(s){return true} },
  ];

  var earned = achDefs.filter(function(a){return a.check(state)});
  var achTotal = achDefs.length;
  var pct = Math.round(earned.length / achTotal * 100);

  var achHtml = '<div class="ach-header"><span class="ach-count">' + earned.length + '/' + achTotal + '</span><div class="ach-bar"><div class="ach-bar-fill" style="width:' + pct + '%"></div></div><span class="ach-pct">' + pct + '%</span></div><div class="ach-grid">';
  achDefs.forEach(function(a) {
    var earnedFlag = earned.indexOf(a) >= 0;
    achHtml += '<div class="ach-card' + (earnedFlag ? '' : ' ach-locked') + '">' +
      '<div class="ach-card-icon">' + achIcon(a.icon) + '</div>' +
      '<div class="ach-card-body"><strong>' + a.title + '</strong><p>' + a.desc + '</p></div>' +
      '<div class="ach-card-status">' + (earnedFlag ? '<span class="ach-badge ach-earned"></span>' : '<span class="ach-badge ach-unlocked">Locked</span>') + '</div>' +
    '</div>';
  });
  achHtml += '</div>';
  ach.innerHTML = achHtml;
  } catch(e) { if (typeof console !== 'undefined') console.warn('renderDashboard:', e); }
}

// ===== PLANNER =====
function setupPlanner() {
  $('goalForm').addEventListener('submit', e => {
    e.preventDefault();
    state.goals.push({ id: uid(), title: $('goalTitle').value, subject: $('goalSubject').value, deadline: $('goalDeadline').value, priority: $('goalPriority').value, hours: +$('goalHours').value, createdAt: todayStr() });
    saveState(); renderGoals(); renderDashboard(); $('goalForm').reset(); showToast('Goal created');
  });
  $('taskForm').addEventListener('submit', e => {
    e.preventDefault();
    state.tasks.push({ id: uid(), title: $('taskTitle').value, subject: $('taskSubject').value, due: $('taskDue').value, effort: +$('taskEffort').value, status: 'todo', createdAt: todayStr() });
    saveState(); renderKanban(); renderDashboard(); $('taskForm').reset(); showToast('Task added');
  });
  $('generatePlanBtn').addEventListener('click', generateAutoStudyPlan);
  renderGoals(); renderKanban();
}
function renderGoals() {
  const el = $('goalList');
  el.innerHTML = '';
  if (state.goals.length === 0) { 
    el.innerHTML = '<div class="empty-state"><p>No study goals yet. Set your first goal!</p><button class="empty-state-button" onclick="loadDemoData()">⚡ Load Sample Goals</button></div>';
    return; 
  }
  state.goals.slice().reverse().forEach(g => {
    const d = document.createElement('div'); d.className = 'item';
    const dd = daysUntil(g.deadline);
    d.innerHTML = `<strong>${escapeHtml(g.title)}</strong> <span class="subtle">${escapeHtml(g.subject)} — ${dd >= 0 ? dd + 'd left' : 'Overdue'}</span> <span class="badge">${g.priority}</span>
    <p class="small">${g.hours}h planned</p>
    <button class="ghost small" data-complete-goal="${g.id}" style="color:var(--success);font-size:0.75rem">Complete</button>`;
    el.appendChild(d);
  });
  qsa('[data-complete-goal]').forEach(function(b) {
    b.addEventListener('click', function() {
      var gid = this.dataset.completeGoal;
      state.goals = state.goals.filter(function(g) { return g.id !== gid; });
      state.settings._ach = state.settings._ach || { goalsCompleted:0, earlyTasks:0, studyPlansGenerated:0, reflectionsCount:0 };
      state.settings._ach.goalsCompleted = (state.settings._ach.goalsCompleted||0) + 1;
      saveState(); renderGoals(); renderDashboard(); showToast('Goal completed!');
    });
  });
}
function renderKanban() {
  const hasTasks = state.tasks.length > 0;
  
  ['todo', 'doing', 'done'].forEach(st => {
    const el = $(`taskBoard${st.charAt(0).toUpperCase() + st.slice(1)}`);
    el.innerHTML = '';
    const filteredTasks = state.tasks.filter(t => t.status === st);
    
    if (!hasTasks && st === 'todo') {
      el.innerHTML = '<div class="empty-state"><p>No tasks yet. Add your first task!</p><button class="empty-state-button" onclick="loadDemoData()">⚡ Load Sample Tasks</button></div>';
    } else {
      filteredTasks.forEach(t => {
        const d = document.createElement('div'); d.className = 'task-card';
        d.innerHTML = `<strong>${escapeHtml(t.title)}</strong><span class="small">${escapeHtml(t.subject)} — due ${formatDate(t.due)}</span>
        <div class="inline wrap"><button class="ghost" data-move-task='${t.id}' data-to='${st === 'todo' ? 'doing' : st === 'doing' ? 'done' : 'doing'}'>${st === 'done' ? 'Reactivate' : 'Move →'}</button>
        <button class="ghost" data-del-task='${t.id}' style="color:var(--danger)">X</button></div>`;
        el.appendChild(d);
      });
    }
  });
  qsa('[data-move-task]').forEach(b => b.addEventListener('click', () => {
    const task = state.tasks.find(t => t.id === b.dataset.moveTask);
    if (task) { task.status = b.dataset.to; saveState(); renderKanban(); renderDashboard(); }
  }));
  qsa('[data-del-task]').forEach(b => b.addEventListener('click', () => {
    state.tasks = state.tasks.filter(t => t.id !== b.dataset.delTask);
    saveState(); renderKanban(); renderDashboard(); showToast('Task deleted');
  }));
}
function generateAutoStudyPlan() {
  const start = $('planStartDate').value || todayStr();
  const hpd = +$('hoursPerDay').value || 3;
  const goals = state.goals.filter(g => new Date(g.deadline) >= new Date(start));
  if (goals.length === 0) { $('generatedPlan').innerHTML = '<p class="subtle">No upcoming goals. Create a goal first.</p>'; return; }
  const days = [...new Set(goals.flatMap(g => { const d = []; let c = new Date(start); while (c <= new Date(g.deadline)) { d.push(c.toISOString().split('T')[0]); c.setDate(c.getDate() + 1); } return d; }))];
  const plan = days.map(d => {
    const dayGoals = goals.filter(g => d <= g.deadline);
    const hrs = Math.min(hpd, dayGoals.reduce((s, g) => s + g.hours / Math.max(daysUntil(g.deadline), 1), 0));
    return { date: d, hours: Math.round(hrs * 10) / 10, tasks: dayGoals.slice(0, 3).map(g => g.title) };
  });
  const el = $('generatedPlan');
  el.innerHTML = '<h4>Study Plan</h4>';
  plan.slice(0, 14).forEach(p => {
    const d = document.createElement('div'); d.className = 'item';
    d.innerHTML = `<strong>${formatDate(p.date)}</strong> — ${p.hours}h — ${p.tasks.map(escapeHtml).join(', ')}`;
    el.appendChild(d);
  });
}

// ===== SESSIONS (POMODORO TIMER) =====
let timerState = { mode: 'focus', minutes: 25, seconds: 0, running: false, interval: null, paused: false };
function setupTimer() {
  $('startPauseTimerBtn').addEventListener('click', () => {
    if (timerState.running) { clearInterval(timerState.interval); timerState.running = false; timerState.paused = true; $('startPauseTimerBtn').textContent = 'Resume'; }
    else {
      if (timerState.paused) { timerState.paused = false; } else { resetTimerDisplay(); }
      timerState.running = true; $('startPauseTimerBtn').textContent = 'Pause';
      timerState.interval = setInterval(tickTimer, 1000);
    }
  });
  $('resetTimerBtn').addEventListener('click', () => { clearInterval(timerState.interval); timerState.running = false; timerState.paused = false; resetTimerDisplay(); $('startPauseTimerBtn').textContent = 'Start'; });
  $('skipTimerBtn').addEventListener('click', () => {
    clearInterval(timerState.interval);
    timerState.mode = timerState.mode === 'focus' ? 'break' : 'focus';
    resetTimerDisplay(); timerState.running = false; timerState.paused = false; $('startPauseTimerBtn').textContent = 'Start';
  });
  $('saveTimerSettingsBtn').addEventListener('click', () => {
    state.settings.focusMinutes = +$('focusMinutes').value;
    state.settings.breakMinutes = +$('breakMinutes').value;
    state.settings.timerNotify = $('timerNotifyCheck').checked;
    saveState(); resetTimerDisplay(); showToast('Timer settings saved');
  });
  $('sessionForm').addEventListener('submit', e => {
    e.preventDefault();
    state.sessions.push({ id: uid(), date: new Date().toISOString(), subject: $('sessionSubject').value, objective: $('sessionObjective').value, minutes: +$('sessionMinutes').value, quality: +$('sessionQuality').value, method: $('sessionMethod').value, deep: $('sessionDeep').checked, notes: $('sessionNotes').value });
    saveState(); renderSessionHistory(); renderDashboard(); $('sessionForm').reset(); showToast('Session logged');
  });
  resetTimerDisplay();
  renderSessionHistory();
}
function tickTimer() {
  if (timerState.paused) return;
  timerState.seconds--;
  if (timerState.seconds < 0) { timerState.seconds = 59; timerState.minutes--; }
  if (timerState.minutes < 0) {
    clearInterval(timerState.interval); timerState.running = false; timerState.paused = false; $('startPauseTimerBtn').textContent = 'Start';
    if (state.settings.timerNotify) showToast(`${timerState.mode === 'focus' ? 'Focus' : 'Break'} session complete!`);
    if (timerState.mode === 'focus') {
      timerState.mode = 'break'; resetTimerDisplay();
      if (state.settings.timerNotify) showToast('Break time!');
    } else {
      timerState.mode = 'focus'; resetTimerDisplay();
      if (state.settings.timerNotify) showToast('Focus time!');
    }
    return;
  }
  updateTimerDisplay();
}
function resetTimerDisplay() {
  timerState.minutes = timerState.mode === 'focus' ? (state.settings.focusMinutes || 25) : (state.settings.breakMinutes || 5);
  timerState.seconds = 0;
  $('timerMode').textContent = timerState.mode.toUpperCase();
  updateTimerDisplay();
}
function updateTimerDisplay() {
  $('timerDisplay').textContent = `${String(timerState.minutes).padStart(2, '0')}:${String(timerState.seconds).padStart(2, '0')}`;
}
function renderSessionHistory() {
  const el = $('sessionHistory');
  el.innerHTML = '';
  if (state.sessions.length === 0) { 
    el.innerHTML = '<div class="empty-state"><p>No study sessions logged yet.</p><button class="empty-state-button" onclick="loadDemoData()">⚡ Load Sample Data</button></div>';
    return; 
  }
  state.sessions.slice().reverse().slice(0, 20).forEach(s => {
    const d = document.createElement('div'); d.className = 'item';
    d.innerHTML = `<strong>${escapeHtml(s.subject)}</strong> — ${s.minutes}min — ${escapeHtml(s.objective)} <span class="badge">${s.method}</span><p class="small">${formatDate(s.date)} | Quality: ${s.quality}/10</p>`;
    el.appendChild(d);
  });
}

// ===== FLASHCARDS (SM-2) =====
let fcState = { deck: 'all', cards: [], index: 0, flipped: false };
function setupFlashcards() {
  $('flashcardForm').addEventListener('submit', e => {
    e.preventDefault();
    state.flashcards.push({ id: uid(), deck: $('cardDeck').value, question: $('cardQuestion').value, answer: $('cardAnswer').value, dueDate: todayStr(), interval: 0, ease: 2.5, repetitions: 0, createdAt: todayStr() });
    saveState(); renderAllFlashcards(); renderFlashcardStudy(); $('flashcardForm').reset(); showToast('Flashcard added');
  });
  $('fcFlipCard').addEventListener('click', () => { fcState.flipped = !fcState.flipped; $('fcFlipCard').classList.toggle('flipped', fcState.flipped); });
  $('fcPrevBtn').addEventListener('click', () => { if (fcState.index > 0) { fcState.index--; fcState.flipped = false; $('fcFlipCard').classList.remove('flipped'); showCurrentFlashcard(); } });
  $('fcNextBtn').addEventListener('click', () => { if (fcState.index < fcState.cards.length - 1) { fcState.index++; fcState.flipped = false; $('fcFlipCard').classList.remove('flipped'); showCurrentFlashcard(); } });
  const fcShuffle = $('fcShuffleBtn');
  if (fcShuffle) fcShuffle.addEventListener('click', () => {
    for (let i = fcState.cards.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [fcState.cards[i], fcState.cards[j]] = [fcState.cards[j], fcState.cards[i]]; }
    fcState.index = 0; fcState.flipped = false; $('fcFlipCard').classList.remove('flipped'); showCurrentFlashcard(); showToast('Deck shuffled');
  });
  // Swipe gestures (Snapchat-style) on the study card
  (function() {
    const card = $('fcFlipCard');
    if (!card) return;
    let sx = 0, sy = 0, sdx = 0, sdy = 0, swiping = false;
    card.addEventListener('touchstart', function(e) {
      const t = e.touches[0];
      sx = t.clientX; sy = t.clientY; sdx = 0; sdy = 0; swiping = true;
      card.style.transition = 'none';
    }, { passive: true });
    card.addEventListener('touchmove', function(e) {
      if (!swiping) return;
      const t = e.touches[0];
      sdx = t.clientX - sx; sdy = t.clientY - sy;
      if (Math.abs(sdx) > 12) card.style.transform = 'translateX(' + sdx + 'px) rotate(' + (sdx * 0.02) + 'deg)';
      else if (Math.abs(sdy) > 12) card.style.transform = 'translateY(' + sdy + 'px)';
    }, { passive: true });
    card.addEventListener('touchend', function() {
      swiping = false;
      card.style.transition = '';
      card.style.transform = '';
      if (Math.abs(sdx) > 60) {
        if (sdx < 0) { const n = $('fcNextBtn'); if (n) n.click(); }
        else { const p = $('fcPrevBtn'); if (p) p.click(); }
      } else if (Math.abs(sdy) > 60) {
        card.click();
      }
      sdx = 0; sdy = 0;
    }, { passive: true });
  })();
  qsa('.fc-rate-btn').forEach(b => b.addEventListener('click', () => { const r = +b.dataset.rating; if (fcState.cards.length > 0) rateCurrentFlashcard(r); }));
  document.addEventListener('keydown', e => {
    var tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); var fc = $('fcFlipCard'); if (fc) fc.click(); }
    if (e.key === 'ArrowLeft') { var p = $('fcPrevBtn'); if (p) p.click(); }
    if (e.key === 'ArrowRight') { var n = $('fcNextBtn'); if (n) n.click(); }
    if (e.key === '1') rateCurrentFlashcard(1);
    if (e.key === '3') rateCurrentFlashcard(3);
    if (e.key === '4') rateCurrentFlashcard(4);
    if (e.key === '5') rateCurrentFlashcard(5);
  });
  $('loadStarterDeckBtn').addEventListener('click', () => { const t = $('cardDeck').value || 'Custom'; generateAiFlashcards(t); });
  $('flashcardAiSendBtn').addEventListener('click', sendFlashcardAiChat);
  $('flashcardAiInput').addEventListener('keydown', e => { if (e.key === 'Enter') sendFlashcardAiChat(); });
  $('addAiWordsBtn').addEventListener('click', addAiWordsAsFlashcards);
  renderAllFlashcards(); renderFlashcardStudy();
}
function renderAllFlashcards() {
  const el = $('cardList');
  el.innerHTML = '';
  if (state.flashcards.length === 0) { 
    el.innerHTML = '<div class="empty-state"><p>No flashcards yet. Create your first deck!</p><button class="empty-state-button" onclick="loadDemoData()">⚡ Load Sample Decks</button></div>';
    return; 
  }
  state.flashcards.slice().reverse().forEach(c => {
    const d = document.createElement('div'); d.className = 'item';
    d.innerHTML = `<span class="fc-deck-tag">${escapeHtml(c.deck)}</span><strong>Q:</strong> ${escapeHtml(c.question).substring(0, 80)}<br><strong>A:</strong> ${escapeHtml(c.answer).substring(0, 80)}`;
    el.appendChild(d);
  });
}
function renderFlashcardStudy() {
  const decks = [...new Set(state.flashcards.map(c => c.deck))];
  const filter = $('fcDeckFilter');
  filter.innerHTML = '';
  const allChip = document.createElement('button'); allChip.className = `fc-deck-chip ${fcState.deck === 'all' ? 'active' : ''}`; allChip.textContent = 'All'; allChip.addEventListener('click', () => { fcState.deck = 'all'; renderFlashcardStudy(); }); filter.appendChild(allChip);
  decks.forEach(dk => {
    const chip = document.createElement('button'); chip.className = `fc-deck-chip ${fcState.deck === dk ? 'active' : ''}`; chip.textContent = dk;
    chip.addEventListener('click', () => { fcState.deck = dk; renderFlashcardStudy(); }); filter.appendChild(chip);
  });
  fcState.cards = state.flashcards.filter(c => (fcState.deck === 'all' || c.deck === fcState.deck) && c.dueDate <= todayStr());
  const allCards = state.flashcards.filter(c => fcState.deck === 'all' || c.deck === fcState.deck);
  $('dueCount').textContent = fcState.cards.length;
  $('newCount').textContent = allCards.filter(c => c.repetitions === 0).length;
  $('totalCards').textContent = allCards.length;
  fcState.index = 0;
  fcState.flipped = false;
  $('fcFlipCard').classList.remove('flipped');
  if (fcState.cards.length > 0) { showCurrentFlashcard(); updateFcMastery(); $('fcCardArea').classList.remove('hidden'); $('fcEmptyState').classList.add('hidden'); }
  else { $('fcCardArea').classList.add('hidden'); $('fcEmptyState').classList.remove('hidden'); }
}
function showCurrentFlashcard() {
  if (fcState.cards.length === 0) return;
  const c = fcState.cards[fcState.index];
  $('fcFrontText').textContent = c.question;
  $('fcBackText').textContent = c.answer;
  $('fcCounter').textContent = `${fcState.index + 1} / ${fcState.cards.length}`;
  const pct = Math.round(((fcState.index) / fcState.cards.length) * 100);
  const fill = $('fcMasteryFill'), pctEl = $('fcMasteryPct');
  if (fill) fill.style.width = pct + '%';
  if (pctEl) pctEl.textContent = pct + '%';
}
function updateFcMastery() {
  const fill = $('fcMasteryFill'), pctEl = $('fcMasteryPct');
  if (!fill || !pctEl) return;
  const pct = fcState.cards.length ? Math.round(((fcState.index + 1) / fcState.cards.length) * 100) : 0;
  fill.style.width = pct + '%';
  pctEl.textContent = pct + '%';
}
function rateCurrentFlashcard(rating) {
  if (fcState.cards.length === 0) return;
  const c = fcState.cards[fcState.index];
  const card = state.flashcards.find(x => x.id === c.id);
  if (!card) return;
  if (rating === 1) { card.ease = Math.max(1.3, card.ease - 0.2); card.repetitions = 0; card.interval = 0; }
  else if (rating === 3) { card.ease = Math.max(1.3, card.ease - 0.15); card.interval = Math.max(1, card.interval * card.ease); card.repetitions++; }
  else if (rating === 4) { card.ease += 0.0; card.interval = card.interval === 0 ? 1 : Math.round(card.interval * card.ease); card.repetitions++; }
  else if (rating === 5) { card.ease += 0.15; card.interval = card.interval === 0 ? 1 : Math.round(card.interval * card.ease); card.repetitions++; }
  const d = new Date(); d.setDate(d.getDate() + Math.round(card.interval));
  card.dueDate = d.toISOString().split('T')[0];
  saveState();
  // Advance to the next card Quizlet-style instead of resetting the deck
  if (fcState.index < fcState.cards.length - 1) {
    fcState.index++;
    fcState.flipped = false;
    $('fcFlipCard').classList.remove('flipped');
    showCurrentFlashcard();
    renderAllFlashcards();
  } else {
    renderFlashcardStudy(); renderAllFlashcards();
  }
  showToast('Rated!');
}
function generateAiFlashcards(deckName) {
  const topic = $('flashcardAiInput').value || deckName;
  if (!topic) { showToast('Enter a topic first'); return; }
  showToast('Generating AI flashcards...');
  groqChat([{ role: 'system', content: 'Generate 8 flashcards as JSON array with "question" and "answer" fields. Return ONLY valid JSON.' }, { role: 'user', content: `Topic: ${topic}` }], { maxTokens: 2048, temperature: 0.5 }).then(txt => {
    try {
      const json = JSON.parse(txt.replace(/```json|```/g, '').trim());
      json.forEach(c => { state.flashcards.push({ id: uid(), deck: deckName, question: c.question, answer: c.answer, dueDate: todayStr(), interval: 0, ease: 2.5, repetitions: 0, createdAt: todayStr() }); });
      saveState(); renderAllFlashcards(); renderFlashcardStudy(); showToast(`${json.length} flashcards generated`);
    } catch (e) { showToast('Failed to parse AI response'); }
  }).catch(() => showToast('AI generation failed'));
}
function sendFlashcardAiChat() {
  const input = $('flashcardAiInput');
  if (!input.value.trim()) return;
  const chat = $('flashcardAiChat');
  chat.innerHTML += `<div class="chat-bubble user">${escapeHtml(input.value)}</div>`;
  const topic = input.value;
  input.value = '';
  $('addAiWordsBtn').classList.add('hidden');
  groqChat([{ role: 'system', content: 'You are a flashcard vocabulary assistant. Return words as a JSON array with "word" and "definition" fields. Return ONLY valid JSON.' }, { role: 'user', content: topic }], { maxTokens: 1024 }).then(txt => {
    try {
      window._aiWords = JSON.parse(txt.replace(/```json|```/g, '').trim());
      chat.innerHTML += `<div class="chat-bubble assistant">Found ${window._aiWords.length} terms.</div>`;
      if (window._aiWords.length > 0) $('addAiWordsBtn').classList.remove('hidden');
    } catch (e) { chat.innerHTML += `<div class="chat-bubble assistant">Response parsed with issues. Try again.</div>`; }
  }).catch(() => chat.innerHTML += `<div class="chat-bubble assistant">AI error. Try again.</div>`);
}
function addAiWordsAsFlashcards() {
  if (!window._aiWords || window._aiWords.length === 0) { showToast('No words to add'); return; }
  const deck = $('cardDeck').value || 'AI Vocabulary';
  window._aiWords.forEach(w => { state.flashcards.push({ id: uid(), deck, question: w.word || w.term, answer: w.definition || w.meaning, dueDate: todayStr(), interval: 0, ease: 2.5, repetitions: 0, createdAt: todayStr() }); });
  saveState(); renderAllFlashcards(); renderFlashcardStudy(); $('addAiWordsBtn').classList.add('hidden'); showToast('Words added as flashcards');
}

// ===== QUIZZES =====
let quizState = { questions: [], index: 0, answers: [], submitted: false, type: 'multiple' };
function setupQuizzes() {
  $('quizGeneratorForm').addEventListener('submit', e => { e.preventDefault(); generateQuiz(); });
  $('nextQuizQuestionBtn').addEventListener('click', () => {
    quizState.index++;
    if (quizState.index >= quizState.questions.length) { $('nextQuizQuestionBtn').classList.add('hidden'); $('submitQuizBtn').classList.remove('hidden'); }
    renderQuizQuestion();
  });
  $('submitQuizBtn').addEventListener('click', submitQuiz);
  $('mockTestForm').addEventListener('submit', e => { e.preventDefault(); startMockTest(); });
  $('mockPrevBtn').addEventListener('click', () => { if (mockState.index > 0) { mockState.index--; renderMockQuestion(); } });
  $('mockNextBtn').addEventListener('click', () => { if (mockState.index < mockState.questions.length - 1) { mockState.index++; renderMockQuestion(); } });
  $('mockMarkBtn').addEventListener('click', () => { mockState.marked[mockState.index] = !mockState.marked[mockState.index]; $('mockMarkBtn').textContent = mockState.marked[mockState.index] ? 'Unmark' : 'Mark For Review'; });
  $('mockSubmitBtn').addEventListener('click', submitMockTest);
  renderQuizHistory(); renderMockTestHistory();
}
async function generateQuiz() {
  const topic = $('quizTopic').value || 'general';
  const subject = $('quizSubject').value;
  const level = $('quizLevel').value;
  const type = $('quizType').value;
  const count = +$('quizCount').value || 8;
  quizState.type = type;
  showToast('Generating quiz...');
  const instructions = type === 'multiple' ? 'multiple choice with 4 options (a,b,c,d)' : type === 'truefalse' ? 'true/false' : type === 'written' ? 'written answer' : type === 'fillblank' ? 'fill in the blank' : 'mixed types';
  const prompt = `Generate a ${level} difficulty quiz about "${topic}" (${subject}) with ${count} ${instructions} questions. Return JSON array with objects: {question, options (optional array), answer, type}. Return ONLY valid JSON.`;
  try {
    const txt = await groqChat([{ role: 'system', content: 'You are a quiz generator. Return only valid JSON.' }, { role: 'user', content: prompt }], { maxTokens: 4096, temperature: 0.5 });
    const json = JSON.parse(txt.replace(/```json|```/g, '').trim());
    quizState.questions = json;
    quizState.index = 0;
    quizState.answers = new Array(json.length).fill('');
    quizState.submitted = false;
    $('quizMeta').textContent = `${json.length} questions`;
    $('nextQuizQuestionBtn').classList.remove('hidden');
    $('submitQuizBtn').classList.add('hidden');
    $('quizResult').textContent = '';
    renderQuizQuestion();
  } catch (e) { showToast('Failed to generate quiz'); }
}
function renderQuizQuestion() {
  const q = quizState.questions[quizState.index];
  if (!q) return;
  const el = $('quizQuestion');
  const opt = $('quizOptions');
  el.textContent = `Q${quizState.index + 1}: ${q.question}`;
  opt.innerHTML = '';
  if (q.type === 'multiple' || q.type === 'mixed' && Array.isArray(q.options)) {
    q.options.forEach((o, i) => {
      const label = document.createElement('label'); label.className = 'item';
      const radio = document.createElement('input'); radio.type = 'radio'; radio.name = 'quizOpt'; radio.value = o;
      if (quizState.answers[quizState.index] === o) radio.checked = true;
      radio.addEventListener('change', () => { quizState.answers[quizState.index] = o; });
      label.appendChild(radio); label.appendChild(document.createTextNode(' ' + o)); opt.appendChild(label);
    });
  } else if (q.type === 'truefalse') {
    ['True', 'False'].forEach(v => {
      const label = document.createElement('label'); label.className = 'item';
      const radio = document.createElement('input'); radio.type = 'radio'; radio.name = 'quizOpt'; radio.value = v;
      if (quizState.answers[quizState.index] === v) radio.checked = true;
      radio.addEventListener('change', () => { quizState.answers[quizState.index] = v; });
      label.appendChild(radio); label.appendChild(document.createTextNode(' ' + v)); opt.appendChild(label);
    });
  } else {
    const ta = document.createElement('textarea');
    ta.placeholder = 'Your answer...'; ta.className = 'written-answer'; ta.rows = 4;
    ta.value = quizState.answers[quizState.index] || '';
    ta.addEventListener('input', () => { quizState.answers[quizState.index] = ta.value; });
    opt.appendChild(ta);
  }
}
function submitQuiz() {
  quizState.submitted = true;
  let correct = 0;
  quizState.questions.forEach((q, i) => {
    const userAns = (quizState.answers[i] || '').trim().toLowerCase();
    const correctAns = (q.answer || '').trim().toLowerCase();
    if (userAns === correctAns) correct++;
  });
  const pct = Math.round(correct / quizState.questions.length * 100);
  $('quizResult').textContent = `Score: ${correct}/${quizState.questions.length} (${pct}%)`;
  state.quizAttempts.push({ id: uid(), date: todayStr(), topic: $('quizTopic').value || 'General', score: correct, total: quizState.questions.length, pct });
  saveState(); renderQuizHistory(); showToast('Quiz submitted');
}
function renderQuizHistory() {
  const el = $('quizAttemptList');
  el.innerHTML = '';
  if (state.quizAttempts.length === 0) { 
    el.innerHTML = '<div class="empty-state"><p>No quiz attempts yet. Take your first quiz!</p><button class="empty-state-button" onclick="loadDemoData()">⚡ Load Sample Quiz</button></div>';
    return; 
  }
  state.quizAttempts.slice().reverse().slice(0, 15).forEach(q => {
    const d = document.createElement('div'); d.className = 'item';
    d.innerHTML = `<strong>${escapeHtml(q.topic)}</strong> — ${q.score}/${q.total} (${q.pct}%) <span class="badge">${formatDate(q.date)}</span>`;
    el.appendChild(d);
  });
}

// ===== MOCK TESTS =====
let mockState = { questions: [], index: 0, answers: [], marked: [], submitted: false, timer: null, seconds: 0 };
function startMockTest() {
  const subject = $('mockTestSubject').value;
  const level = $('mockTestLevel').value;
  const count = +$('mockTestCount').value || 20;
  const duration = +$('mockTestDuration').value || 30;
  mockState.seconds = duration * 60;
  mockState.submitted = false;
  mockState.marked = new Array(count).fill(false);
  showToast('Generating mock test...');
  groqChat([{ role: 'system', content: 'Generate a mock test as JSON array of objects with {question, options:[4], answer, type:"multiple"}. Return ONLY valid JSON.' }, { role: 'user', content: `Generate ${count} ${level} difficulty ${subject} multiple choice questions` }], { maxTokens: 4096 }).then(txt => {
    try {
      const json = JSON.parse(txt.replace(/```json|```/g, '').trim());
      mockState.questions = json; mockState.answers = new Array(json.length).fill(''); mockState.index = 0;
      $('mockTestMeta').textContent = `${json.length} questions | Marked: 0`;
      $('mockPrevBtn').classList.remove('hidden'); $('mockNextBtn').classList.remove('hidden'); $('mockMarkBtn').classList.remove('hidden'); $('mockSubmitBtn').classList.remove('hidden');
      renderMockQuestion();
      if (mockState.timer) clearInterval(mockState.timer);
      mockState.timer = setInterval(() => {
        mockState.seconds--;
        const m = Math.floor(mockState.seconds / 60); const s = mockState.seconds % 60;
        $('mockTestTimer').textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        if (mockState.seconds <= 0) { clearInterval(mockState.timer); submitMockTest(); }
      }, 1000);
    } catch (e) { showToast('Failed to parse mock test'); }
  }).catch(() => showToast('AI generation failed'));
}
function renderMockQuestion() {
  const q = mockState.questions[mockState.index];
  if (!q) return;
  $('mockTestQuestion').textContent = `Q${mockState.index + 1}: ${q.question}`;
  const opt = $('mockTestOptions');
  opt.innerHTML = '';
  (q.options || ['A', 'B', 'C', 'D']).forEach(o => {
    const label = document.createElement('label'); label.className = 'item';
    const radio = document.createElement('input'); radio.type = 'radio'; radio.name = 'mockOpt'; radio.value = o;
    if (mockState.answers[mockState.index] === o) radio.checked = true;
    radio.addEventListener('change', () => { mockState.answers[mockState.index] = o; });
    label.appendChild(radio); label.appendChild(document.createTextNode(' ' + o)); opt.appendChild(label);
  });
  const markedCount = mockState.marked.filter(Boolean).length;
  $('mockTestMeta').textContent = `${mockState.questions.length} questions | Marked: ${markedCount}`;
  $('mockMarkBtn').textContent = mockState.marked[mockState.index] ? 'Unmark' : 'Mark For Review';
}
function submitMockTest() {
  clearInterval(mockState.timer);
  let correct = 0;
  mockState.questions.forEach((q, i) => {
    if ((mockState.answers[i] || '').trim().toLowerCase() === (q.answer || '').trim().toLowerCase()) correct++;
  });
  const pct = Math.round(correct / mockState.questions.length * 100);
  $('mockTestResult').innerHTML = `<strong>Mock Test Score: ${correct}/${mockState.questions.length} (${pct}%)</strong>`;
  state.mockTestHistory.push({ id: uid(), date: todayStr(), subject: $('mockTestSubject').value, score: correct, total: mockState.questions.length, pct });
  saveState(); renderMockTestHistory(); showToast('Mock test submitted');
}
function renderMockTestHistory() {
  const el = $('mockTestHistory');
  el.innerHTML = '';
  if (state.mockTestHistory.length === 0) { el.innerHTML = '<p class="subtle">No mock tests taken yet.</p>'; return; }
  state.mockTestHistory.slice().reverse().slice(0, 15).forEach(m => {
    const d = document.createElement('div'); d.className = 'item';
    d.innerHTML = `<strong>${escapeHtml(m.subject)}</strong> — ${m.score}/${m.total} (${m.pct}%) <span class="badge">${formatDate(m.date)}</span>`;
    el.appendChild(d);
  });
}

// ===== RECALLS =====
function setupRecalls() {
  $('recallPromptForm').addEventListener('submit', e => { e.preventDefault(); generateRecallPrompts(); });
  $('startBlurtBtn').addEventListener('click', startBlurtTimer);
  $('scoreBlurtBtn').addEventListener('click', scoreBlurt);
  renderRecallHistory();
}
async function generateRecallPrompts() {
  const subject = $('recallSubject').value;
  const source = $('recallSource').value;
  const count = +$('recallPromptCount').value || 8;
  const notes = state.notes.filter(n => subject === 'all' || n.subject === subject).slice(0, 5);
  const cards = state.flashcards.filter(c => subject === 'all' || c.deck.toLowerCase().includes(subject)).slice(0, 5);
  const context = [...notes.map(n => n.title + ': ' + (n.content || '')), ...cards.map(c => c.question + ' -> ' + c.answer)].join('\n');
  showToast('Generating recall prompts...');
  try {
    const txt = await groqChat([{ role: 'system', content: `Generate ${count} recall prompts as JSON array of strings. Make them specific and testable.` }, { role: 'user', content: `Subject: ${subject}. Context: ${context || 'Generate general prompts.'}` }], { maxTokens: 2048 });
    const prompts = JSON.parse(txt.replace(/```json|```/g, '').trim());
    const el = $('recallPromptList');
    el.innerHTML = '<h4>Recall Prompts</h4>';
    prompts.forEach(p => {
      const d = document.createElement('div'); d.className = 'item recall-prompt'; d.textContent = p;
      el.appendChild(d);
    });
    showToast(`${prompts.length} prompts generated`);
  } catch (e) { showToast('Failed to generate prompts'); }
}
let blurtTimerInterval = null;
let blurtSeconds = 0;
function startBlurtTimer() {
  if (blurtTimerInterval) { clearInterval(blurtTimerInterval); blurtTimerInterval = null; $('startBlurtBtn').textContent = 'Start Timer'; return; }
  blurtSeconds = (+$('blurtMinutes').value || 8) * 60;
  $('startBlurtBtn').textContent = 'Pause';
  blurtTimerInterval = setInterval(() => {
    blurtSeconds--;
    const m = Math.floor(blurtSeconds / 60); const s = blurtSeconds % 60;
    $('blurtTimer').textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    if (blurtSeconds <= 0) { clearInterval(blurtTimerInterval); blurtTimerInterval = null; $('startBlurtBtn').textContent = 'Start Timer'; showToast('Time is up!'); }
  }, 1000);
}
async function scoreBlurt() {
  const topic = $('blurtTopic').value;
  const keywords = $('blurtKeywords').value;
  const response = $('blurtResponse').value;
  if (!response) { showToast('Write your response first'); return; }
  showToast('Scoring recall...');
  try {
    const txt = await groqChat([{ role: 'system', content: 'Evaluate this recall attempt. Return JSON with {score:0-100, feedback:string, coverage:string[], missing:string[]}.' }, { role: 'user', content: `Topic: ${topic}. Keywords: ${keywords}. Recall: ${response}` }], { maxTokens: 1024 });
    const result = JSON.parse(txt.replace(/```json|```/g, '').trim());
    const el = $('blurtFeedback');
    el.innerHTML = `<div class="score-chip ${result.score > 70 ? 'good' : result.score > 40 ? 'mid' : 'low'}">Score: ${result.score}%</div>
    <p>${escapeHtml(result.feedback)}</p>
    <p><strong>Covered:</strong> ${(result.coverage || []).join(', ') || 'None'}</p>
    <p><strong>Missing:</strong> ${(result.missing || []).join(', ') || 'Nothing identified'}</p>`;
    state.recallHistory.push({ id: uid(), date: todayStr(), topic, score: result.score, feedback: result.feedback });
    saveState(); renderRecallHistory();
  } catch (e) { showToast('Scoring failed'); }
}
function renderRecallHistory() {
  const el = $('recallHistory');
  el.innerHTML = '';
  if (state.recallHistory.length === 0) { el.innerHTML = '<p class="subtle">No recall attempts yet.</p>'; return; }
  state.recallHistory.slice().reverse().slice(0, 15).forEach(r => {
    const d = document.createElement('div'); d.className = 'item';
    d.innerHTML = `<strong>${escapeHtml(r.topic)}</strong> — Score: ${r.score}% <span class="badge">${formatDate(r.date)}</span>`;
    el.appendChild(d);
  });
}

// ===== CALENDAR =====
let calDate = new Date();
function setupCalendar() {
  $('calPrevBtn').addEventListener('click', () => { calDate.setMonth(calDate.getMonth() - 1); renderCalendar(); });
  $('calNextBtn').addEventListener('click', () => { calDate.setMonth(calDate.getMonth() + 1); renderCalendar(); });
  $('calEventForm').addEventListener('submit', e => {
    e.preventDefault();
    const title = $('calEventTitle').value.trim();
    const date = $('calEventDate').value;
    const time = $('calEventTime').value;
    const desc = $('calEventDesc').value.trim();
    if (!title || !date) return;
    state.calendarEvents.push({ id: uid(), title, date, time, desc, createdAt: new Date().toISOString() });
    saveState();
    e.target.reset();
    renderCalendar();
    renderCalendarEvents();
    showToast('Event added');
  });
  $('calIcalImportBtn').addEventListener('click', importCalIcal);
  setupCalPdfUpload();
  renderCalendar();
  renderCalendarEvents();
}
function renderCalendar() {
  $('calMonthLabel').textContent = calDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const grid = $('calGrid');
  grid.innerHTML = '';
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  days.forEach(d => { const h = document.createElement('div'); h.className = 'cal-header'; h.textContent = d; grid.appendChild(h); });
  const first = new Date(calDate.getFullYear(), calDate.getMonth(), 1);
  const last = new Date(calDate.getFullYear(), calDate.getMonth() + 1, 0);
  const startDay = first.getDay();
  for (let i = 0; i < startDay; i++) { const e = document.createElement('div'); e.className = 'cal-day other-month'; grid.appendChild(e); }
  const today = todayStr();
  for (let d = 1; d <= last.getDate(); d++) {
    const dateStr = `${calDate.getFullYear()}-${String(calDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const el = document.createElement('div');
    el.className = 'cal-day';
    if (dateStr === today) el.classList.add('today');
    if (state.calendarEvents.some(e => e.date === dateStr)) el.classList.add('has-event');
    el.textContent = d;
    el.addEventListener('click', () => { $('calEventDate').value = dateStr; });
    grid.appendChild(el);
  }
}
function renderCalendarEvents() {
  const el = $('calEventList');
  el.innerHTML = '';
  const sorted = [...state.calendarEvents].sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''));
  if (sorted.length === 0) { el.innerHTML = '<p class="subtle">No events yet.</p>'; return; }
  sorted.slice(0, 20).forEach(e => {
    const d = document.createElement('div');
    d.className = 'item cal-event-item';
    d.innerHTML = `<span><strong>${escapeHtml(e.title)}</strong><br><span class="small">${formatDate(e.date)}${e.time ? ' · ' + e.time : ''}${e.desc ? ' · ' + escapeHtml(e.desc) : ''}</span></span>
      <button class="ghost delete-cal-event" data-id="${e.id}">✕</button>`;
    d.querySelector('.delete-cal-event').addEventListener('click', () => {
      state.calendarEvents = state.calendarEvents.filter(x => x.id !== e.id);
      saveState(); renderCalendar(); renderCalendarEvents(); showToast('Event deleted');
    });
    el.appendChild(d);
  });
}
async function importCalIcal() {
  const url = $('calIcalUrl').value.trim();
  if (!url) { showToast('Enter an iCal URL'); return; }
  try {
    const res = await fetch(url);
    const text = await res.text();
    const events = text.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g) || [];
    let count = 0;
    events.forEach(ev => {
      const title = ev.match(/SUMMARY:(.+)/)?.[1] || 'Untitled';
      const dtStart = ev.match(/DTSTART(?:;VALUE=DATE)?:?(\d{8})/)?.[1];
      if (dtStart) {
        const dateStr = `${dtStart.slice(0,4)}-${dtStart.slice(4,6)}-${dtStart.slice(6,8)}`;
        if (!state.calendarEvents.some(e => e.title === title && e.date === dateStr)) {
          state.calendarEvents.push({ id: uid(), title, date: dateStr, time: '', desc: '', createdAt: new Date().toISOString() });
          count++;
        }
      }
    });
    saveState(); renderCalendar(); renderCalendarEvents();
    $('calImportStatus').textContent = `Imported ${count} events.`;
    showToast(`Imported ${count} events`);
  } catch (e) { $('calImportStatus').textContent = 'Import failed.'; showToast('Import failed'); }
}
function setupCalPdfUpload() {
  const zone = $('calPdfZone');
  const input = $('calPdfInput');
  if (!zone || !input) return;
  zone.addEventListener('click', () => input.click());
  input.addEventListener('change', async () => {
    const file = input.files[0];
    if (!file) return;
    $('calImportStatus').textContent = 'Reading PDF...';
    try {
      const buf = await file.arrayBuffer();
      if (typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
        let fullText = '';
        for (let i = 1; i <= Math.min(pdf.numPages, 5); i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          fullText += content.items.map(x => x.str).join(' ') + '\n';
        }
        const dateMatches = fullText.match(/\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}-\d{2}-\d{2}|[A-Z][a-z]+ \d{1,2},? \d{4}/g);
        if (dateMatches) {
          dateMatches.forEach(dt => {
            let parsed = new Date(dt);
            if (isNaN(parsed.getTime())) parsed = new Date(dt.replace(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/, '$3-$1-$2'));
            if (!isNaN(parsed.getTime())) {
              const ds = parsed.toISOString().split('T')[0];
              if (!state.calendarEvents.some(e => e.date === ds && e.title.startsWith('PDF:'))) {
                state.calendarEvents.push({ id: uid(), title: `PDF: Schedule ${ds}`, date: ds, time: '', desc: 'Imported from PDF', createdAt: new Date().toISOString() });
              }
            }
          });
        }
        saveState(); renderCalendar(); renderCalendarEvents();
        $('calImportStatus').textContent = 'Extracted events from PDF.';
        showToast('PDF schedule imported');
      } else { $('calImportStatus').textContent = 'PDF.js not loaded.'; }
    } catch (e) { $('calImportStatus').textContent = 'Failed to read PDF.'; }
  });
}

// ===== SOCIAL MEDIA =====
function setupSocial() {
  $('feedbackForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = $('feedbackName').value.trim() || 'Anonymous';
    const email = $('feedbackEmail').value.trim() || 'Not provided';
    const type = $('feedbackType').value;
    const msg = $('feedbackMessage').value.trim();
    if (!msg) { showToast('Please write a message'); return; }
    window.location.href = `mailto:30dimrekatai@student.aisb.hu?subject=${encodeURIComponent('Study Hub Feedback: ' + type)}&body=${encodeURIComponent('From: ' + name + ' (' + email + ')\nType: ' + type + '\n\n' + msg)}`;
    e.target.reset();
    showToast('Feedback form opened in email');
  });
}

// ===== GRADE ANALYSIS =====
function renderGradeAnalysis() {
  const el = $('gradeAnalysisContainer');
  if (!el) return;
  const graded = state.assignments.filter(a => a.earned !== null);
  if (graded.length === 0) { el.innerHTML = '<p class="subtle">Grade assignments in Assignments tab to see analysis.</p>'; return; }
  const subjects = {};
  graded.forEach(a => {
    if (!subjects[a.subject]) subjects[a.subject] = { totalWeight: 0, weightedScore: 0, count: 0 };
    subjects[a.subject].totalWeight += a.weight;
    subjects[a.subject].weightedScore += (a.earned / a.max) * a.weight;
    subjects[a.subject].count++;
  });
  const totalWeight = graded.reduce((s, a) => s + a.weight, 0);
  const overall = totalWeight > 0 ? (graded.reduce((s, a) => s + (a.earned / a.max) * a.weight, 0) / totalWeight * 100) : 0;
  let html = `<div class="item"><strong>Overall: ${overall.toFixed(1)}%</strong> (${graded.length} graded)</div><div class="top-gap">`;
  Object.entries(subjects).sort((a, b) => {
    const sa = a[1].totalWeight > 0 ? a[1].weightedScore / a[1].totalWeight * 100 : 0;
    const sb = b[1].totalWeight > 0 ? b[1].weightedScore / b[1].totalWeight * 100 : 0;
    return sb - sa;
  }).forEach(([subject, data]) => {
    const pct = data.totalWeight > 0 ? (data.weightedScore / data.totalWeight * 100) : 0;
    const c = pct >= 90 ? '#237a57' : pct >= 70 ? '#ca8a04' : '#b42318';
    html += `<div class="grade-subject-row"><span class="grade-subject-name">${escapeHtml(subject)}</span><span class="grade-subject-score" style="color:${c}">${pct.toFixed(1)}%</span></div>
      <div class="grade-mini-chart"><span style="width:${pct}%;background:${c}"></span></div>`;
  });
  html += '</div>';
  el.innerHTML = html;
}

// ===== PLAYLIST =====
function setupPlaylists() {
  $('createPlaylistBtn').addEventListener('click', createPlaylist);
  $('playlistNameInput').addEventListener('keydown', e => { if (e.key === 'Enter') createPlaylist(); });
  $('musicPlaylistBtn').addEventListener('click', () => { $('playlistPanel').classList.toggle('hidden'); renderPlaylists(); });
  renderPlaylists();
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-playlist')) {
      var idx = parseInt(e.target.dataset.pidx);
      if (confirm('Delete playlist "' + state.playlists[idx].name + '"?')) {
        state.playlists.splice(idx, 1);
        saveState();
        renderPlaylists();
        showToast('Playlist deleted');
      }
    }
  });
}
function createPlaylist() {
  const name = $('playlistNameInput').value.trim();
  if (!name) { showToast('Enter a playlist name'); return; }
  state.playlists.push({ id: uid(), name, tracks: [] });
  saveState();
  $('playlistNameInput').value = '';
  renderPlaylists();
  showToast(`Playlist "${name}" created`);
}
function renderPlaylists() {
  const el = $('playlistList');
  el.innerHTML = '';
  if (state.playlists.length === 0) { el.innerHTML = '<p class="subtle" style="padding:8px;">No playlists yet.</p>'; return; }
  state.playlists.forEach((p, idx) => {
    const d = document.createElement('div');
    d.className = 'playlist-item';
    d.innerHTML = `<span class="icon icon-sm icon-music" style="display:inline-flex;vertical-align:middle;margin-right:4px"></span> ${escapeHtml(p.name)}</span><span class="small">${p.tracks.length} tracks <button class="ghost delete-playlist" data-pidx="${idx}" style="padding:2px 6px;font-size:0.7rem;color:var(--danger);margin-left:4px;">X</button></span>`;
    d.addEventListener('click', (e) => { if (e.target.classList.contains('delete-playlist')) return; renderPlaylistTracks(idx); qsa('.playlist-item').forEach(x => x.classList.remove('active')); d.classList.add('active'); });
    el.appendChild(d);
  });
  if (state.playlists.length > 0) renderPlaylistTracks(0);
}
function renderPlaylistTracks(idx) {
  const playlist = state.playlists[idx];
  if (!playlist) return;
  const container = $('playlistTrackList');
  container.classList.remove('hidden');
  $('playlistTrackListLabel').textContent = `${escapeHtml(playlist.name)} Tracks`;
  const el = $('playlistTracksContainer');
  el.innerHTML = '';
  if (playlist.tracks.length === 0) { el.innerHTML = '<p class="subtle">Empty playlist. Add tracks from the list.</p>'; return; }
  playlist.tracks.forEach((t, i) => {
    const d = document.createElement('div');
    d.className = 'playlist-track-item';
    d.innerHTML = `<span>${escapeHtml(t.title)} — ${escapeHtml(t.artist)}</span><button class="ghost remove-pt" data-idx="${i}">✕</button>`;
    d.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') return;
      const ti = MUSIC_TRACKS.findIndex(mt => mt.file === t.file);
      if (ti >= 0) { state.musicTrackIndex = ti; loadMusicTrack(); if (!state.musicPlaying) toggleMusicPlay(); }
    });
    d.querySelector('.remove-pt').addEventListener('click', () => {
      playlist.tracks.splice(i, 1); saveState(); renderPlaylistTracks(idx); showToast('Track removed');
    });
    el.appendChild(d);
  });
}
function enhanceMusicTrackList() {
  const orig = renderMusicTrackList;
  renderMusicTrackList = function() {
    orig();
    MUSIC_TRACKS.forEach((t, i) => {
      const items = qsa('.music-track-item');
      if (items[i]) {
        const btn = document.createElement('button');
        btn.className = 'ghost'; btn.textContent = '+'; btn.title = 'Add to playlist';
        btn.style.cssText = 'padding:2px 6px;font-size:0.7rem;';
        btn.addEventListener('click', (e) => { e.stopPropagation(); addTrackToPlaylist(i); });
        items[i].querySelector('.track-name')?.after(btn);
      }
    });
  };
}
function addTrackToPlaylist(trackIdx) {
  const track = MUSIC_TRACKS[trackIdx];
  if (!track) return;
  if (state.playlists.length === 0) { showToast('Create a playlist first'); return; }
  const names = state.playlists.map((p, i) => `${i + 1}. ${p.name}`).join('\n');
  const choice = prompt(`Add "${track.title}" to which playlist?\n${names}\nEnter number:`);
  if (!choice) return;
  const idx = parseInt(choice) - 1;
  if (idx < 0 || idx >= state.playlists.length) { showToast('Invalid choice'); return; }
  if (state.playlists[idx].tracks.some(t => t.file === track.file)) { showToast('Track already in playlist'); return; }
  state.playlists[idx].tracks.push({ file: track.file, title: track.title, artist: track.artist });
  saveState(); renderPlaylists();
  showToast(`Added to "${state.playlists[idx].name}"`);
}

// ===== NOTES (6 METHODS) =====
function setupNotes() {
  qsa('.note-style-btn').forEach(b => b.addEventListener('click', () => {
    qsa('.note-style-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active'); switchNoteEditor(b.dataset.noteStyle);
    $('noteStyle').value = b.dataset.noteStyle;
  }));
  $('noteChartBuildBtn').addEventListener('click', buildChartTable);
  $('noteAddBoxBtn').addEventListener('click', () => {
    const title = $('noteBoxTitle').value || 'New Box';
    const container = $('noteBoxingContainer');
    const box = document.createElement('div'); box.className = 'note-box';
    box.innerHTML = `<h4 contenteditable="true">${escapeHtml(title)}</h4><div class="box-content" contenteditable="true"></div>`;
    container.appendChild(box); $('noteBoxTitle').value = '';
    updateBoxingData();
  });
  $('noteForm').addEventListener('submit', saveNote);
  $('noteSearch').addEventListener('input', renderNoteList);
  const camBtn = $('noteCameraBtn');
  if (camBtn) camBtn.addEventListener('click', () => {
    const status = $('noteCameraStatus');
    if (status) status.textContent = 'Opening camera...';
    const done = (dataUrl) => {
      if (!dataUrl) { if (status) status.textContent = 'No photo captured.'; return; }
      window._pendingNotePhoto = dataUrl;
      const prev = $('notePhotoPreview');
      if (prev) prev.innerHTML = '<img src="' + dataUrl + '" style="max-width:180px;border-radius:10px;border:1px solid var(--border);" alt="Captured photo" /> <button type="button" id="notePhotoRemove" class="ghost">Remove</button>';
      if (status) status.textContent = 'Photo attached — save the note to keep it.';
      const rm = $('notePhotoRemove');
      if (rm) rm.addEventListener('click', () => { window._pendingNotePhoto = null; if (prev) prev.innerHTML = ''; if (status) status.textContent = ''; });
    };
    if (typeof Mobile !== 'undefined' && Mobile.capturePhoto) Mobile.capturePhoto(done);
    else {
      const input = document.createElement('input');
      input.type = 'file'; input.accept = 'image/*'; input.capture = 'environment';
      input.addEventListener('change', () => {
        const f = input.files && input.files[0];
        if (!f) { if (status) status.textContent = 'No photo selected.'; return; }
        const r = new FileReader();
        r.onload = () => done(r.result);
        r.readAsDataURL(f);
      });
      input.click();
    }
  });
  renderNoteList();
}
function switchNoteEditor(style) {
  qsa('[id^="noteEditor"]').forEach(el => { if (el.id !== 'noteEditorTitle' && el.id !== 'noteForm' && !el.closest) return; });
  document.querySelectorAll('[id^="noteEditor"]').forEach(el => {
    if (el.id.startsWith('noteEditor') && el.id !== 'noteEditorTitle' && el !== $('noteForm')) el.classList.add('hidden');
  });
  const editor = $(`noteEditor${style.charAt(0).toUpperCase() + style.slice(1)}`);
  if (editor) editor.classList.remove('hidden');
  const titles = { freeform: 'Freeform Notes', outline: 'Outline Notes', cornell: 'Cornell Notes', mapping: 'Mapping Notes', charting: 'Charting Notes', boxing: 'Boxing Notes', sentence: 'Sentence Notes' };
  $('noteEditorTitle').textContent = titles[style] || 'Smart Notes';
}
function buildChartTable() {
  const cols = +$('noteChartCols').value || 3;
  const container = $('noteChartContainer');
  let table = container.querySelector('table');
  if (!table) { table = document.createElement('table'); table.className = 'note-charting'; container.appendChild(table); }
  table.innerHTML = '';
  const header = document.createElement('tr');
  for (let i = 0; i < cols; i++) { const th = document.createElement('th'); th.contentEditable = true; th.textContent = `Column ${i + 1}`; header.appendChild(th); }
  table.appendChild(header);
  for (let r = 0; r < 3; r++) {
    const tr = document.createElement('tr');
    for (let c = 0; c < cols; c++) { const td = document.createElement('td'); td.contentEditable = true; tr.appendChild(td); }
    table.appendChild(tr);
  }
}
function renderBoxes() {
  const container = $('noteBoxingContainer');
  container.innerHTML = '';
  try {
    const data = JSON.parse($('noteBoxingData').value || '[]');
    data.forEach(b => {
      const box = document.createElement('div'); box.className = 'note-box';
      box.innerHTML = `<h4 contenteditable="true">${escapeHtml(b.title || '')}</h4><div class="box-content" contenteditable="true">${escapeHtml(b.content || '')}</div>`;
      container.appendChild(box);
    });
  } catch (e) { logErrors('loadBoxingNotes')(e); }
}
function updateBoxingData() {
  const boxes = $('noteBoxingContainer').querySelectorAll('.note-box');
  const data = [];
  boxes.forEach(box => {
    const title = box.querySelector('h4')?.textContent || '';
    const content = box.querySelector('.box-content')?.textContent || '';
    data.push({ title, content });
  });
  $('noteBoxingData').value = JSON.stringify(data);
}
function saveNote(e) {
  e.preventDefault();
  const style = $('noteStyle').value;
  let content = '';
  if (style === 'freeform') content = $('noteContent').value;
  if (window._pendingNotePhoto) {
    content = (content ? content + '\n\n![](' + window._pendingNotePhoto + ')\n' : '![Photo](' + window._pendingNotePhoto + ')\n');
    window._pendingNotePhoto = null;
    const prev = $('notePhotoPreview'); if (prev) prev.innerHTML = '';
  }
  else if (style === 'outline') content = $('noteOutlineContent').value;
  else if (style === 'cornell') content = JSON.stringify({ cues: $('noteCornellCues').value, notes: $('noteCornellNotes').value, summary: $('noteCornellSummary').value });
  else if (style === 'mapping') content = JSON.stringify({ center: $('noteMappingCenter').value, branches: $('noteMappingBranches').value });
  else if (style === 'charting') { const rows = []; $('noteChartContainer').querySelectorAll('tr').forEach(tr => { const cells = []; tr.querySelectorAll('th, td').forEach(td => cells.push(td.textContent)); rows.push(cells); }); content = JSON.stringify(rows); }
  else if (style === 'boxing') { updateBoxingData(); content = $('noteBoxingData').value; }
  else if (style === 'sentence') content = $('noteSentenceContent').value;
  const id = $('noteId').value || uid();
  if (id && state.notes.find(n => n.id === id)) {
    const n = state.notes.find(x => x.id === id);
    if (n) { n.title = $('noteTitle').value; n.subject = $('noteSubject').value; n.tags = $('noteTags').value; n.content = content; n.style = style; }
  } else {
    state.notes.push({ id, title: $('noteTitle').value, subject: $('noteSubject').value, tags: $('noteTags').value, content, style, createdAt: todayStr() });
  }
  saveState(); renderNoteList(); buildNotePreview(); $('noteForm').reset(); $('noteId').value = ''; showToast('Note saved');
}
function buildNotePreview() {
  const el = $('notePreview');
  const style = $('noteStyle').value;
  const content = $('noteContent').value || $('noteOutlineContent').value || $('noteSentenceContent').value || '';
  el.innerHTML = '';
  if (style === 'freeform') el.innerHTML = `<div class="preview-text">${escapeHtml(content).replace(/\n/g, '<br>')}</div>`;
  else if (style === 'outline') {
    const lines = content.split('\n').filter(Boolean);
    lines.forEach(l => {
      const level = (l.match(/^#+/) || [''])[0].length;
      const text = l.replace(/^#+\s*/, '');
      const p = document.createElement('div'); p.className = `outline-level-${Math.min(level, 3)}`; p.textContent = text; el.appendChild(p);
    });
  } else if (style === 'cornell') {
    try { const d = JSON.parse(content); el.innerHTML = `<div class="note-cornell"><div class="cornell-cues"><strong>Cues</strong><br>${escapeHtml(d.cues || '')}</div><div class="cornell-notes"><strong>Notes</strong><br>${escapeHtml(d.notes || '')}</div><div class="cornell-summary"><strong>Summary</strong><br>${escapeHtml(d.summary || '')}</div></div>`; } catch (e) { el.textContent = 'Cornell content error'; }
  } else if (style === 'mapping') {
    try { const d = JSON.parse(content); el.innerHTML = `<div class="mapping-center">${escapeHtml(d.center || '')}</div><div class="mapping-branches">${(d.branches || '').split('\n').filter(Boolean).map(b => `<div class="mapping-branch">${escapeHtml(b)}</div>`).join('')}</div>`; } catch (e) { el.textContent = 'Mapping content error'; }
  } else if (style === 'charting') {
    try { const rows = JSON.parse(content); if (rows.length) { let html = '<table class="note-charting">'; rows.forEach((r, i) => { html += '<tr>' + r.map(c => i === 0 ? `<th>${escapeHtml(c)}</th>` : `<td>${escapeHtml(c)}</td>`).join('') + '</tr>'; }); html += '</table>'; el.innerHTML = html; } } catch (e) { el.textContent = 'Charting content error'; }
  } else if (style === 'boxing') {
    try { const boxes = JSON.parse(content); boxes.forEach(b => { const box = document.createElement('div'); box.className = 'note-box'; box.innerHTML = `<h4>${escapeHtml(b.title || '')}</h4><div>${escapeHtml(b.content || '')}</div>`; el.appendChild(box); }); } catch (e) { el.textContent = 'Boxing content error'; }
  } else if (style === 'sentence') {
    content.split('\n').filter(Boolean).forEach(s => { const p = document.createElement('div'); p.className = 'sentence-line'; p.textContent = s; el.appendChild(p); });
  }
}
function renderNoteList() {
  const el = $('noteList');
  const q = $('noteSearch').value.toLowerCase();
  el.innerHTML = '';
  const notes = state.notes.filter(n => !q || n.title.toLowerCase().includes(q) || n.subject.toLowerCase().includes(q) || (n.tags || '').toLowerCase().includes(q));
  if (notes.length === 0) { 
    el.innerHTML = '<div class="empty-state"><p>No notes found. Create your first note!</p><button class="empty-state-button" onclick="loadDemoData()">⚡ Load Sample Notes</button></div>';
    return; 
  }
  notes.slice().reverse().forEach(n => {
    const d = document.createElement('div'); d.className = 'item';
    d.innerHTML = `<strong>${escapeHtml(n.title)}</strong> <span class="badge">${n.style}</span> <span class="subtle">${escapeHtml(n.subject)}</span><div class="inline wrap"><button class="ghost" data-open-note='${n.id}'>Open</button><button class="ghost" data-del-note='${n.id}' style="color:var(--danger)">X</button></div>`;
    el.appendChild(d);
  });
  qsa('[data-open-note]').forEach(b => b.addEventListener('click', () => {
    const n = state.notes.find(x => x.id === b.dataset.openNote);
    if (!n) return;
    $('noteId').value = n.id; $('noteTitle').value = n.title; $('noteSubject').value = n.subject; $('noteTags').value = n.tags || '';
    qsa('.note-style-btn').forEach(x => x.classList.remove('active'));
    const btn = qs(`.note-style-btn[data-note-style="${n.style}"]`);
    if (btn) btn.classList.add('active');
    switchNoteEditor(n.style); $('noteStyle').value = n.style;
    if (n.style === 'freeform') $('noteContent').value = n.content;
    else if (n.style === 'outline') $('noteOutlineContent').value = n.content;
    else if (n.style === 'cornell') { try { const d = JSON.parse(n.content); $('noteCornellCues').value = d.cues || ''; $('noteCornellNotes').value = d.notes || ''; $('noteCornellSummary').value = d.summary || ''; } catch (e) { logErrors('loadNoteCornell')(e); } }
    else if (n.style === 'mapping') { try { const d = JSON.parse(n.content); $('noteMappingCenter').value = d.center || ''; $('noteMappingBranches').value = d.branches || ''; } catch (e) { logErrors('loadNoteMapping')(e); } }
    else if (n.style === 'charting') { $('noteChartData').value = n.content; renderChartTableFromData(); }
    else if (n.style === 'boxing') { $('noteBoxingData').value = n.content; renderBoxes(); }
    else if (n.style === 'sentence') $('noteSentenceContent').value = n.content;
    buildNotePreview(); showToast('Note loaded');
  }));
  qsa('[data-del-note]').forEach(b => b.addEventListener('click', () => {
    state.notes = state.notes.filter(x => x.id !== b.dataset.delNote);
    saveState(); renderNoteList(); showToast('Note deleted');
  }));
}
function renderChartTableFromData() {
  try {
    const rows = JSON.parse($('noteChartData').value || '[]');
    const container = $('noteChartContainer');
    if (rows.length) { let html = '<table class="note-charting">'; rows.forEach((r, i) => { html += '<tr>' + r.map((c, j) => i === 0 ? `<th contenteditable="true">${escapeHtml(c)}</th>` : `<td contenteditable="true">${escapeHtml(c)}</td>`).join('') + '</tr>';     }); html += '</table>'; container.innerHTML = html; }
  } catch (e) { logErrors('renderChartData')(e); }
}

// ===== ASSIGNMENTS =====
function setupAssignments() {
  $('assignmentForm').addEventListener('submit', e => {
    e.preventDefault();
    state.assignments.push({ id: uid(), title: $('assignTitle').value, subject: $('assignSubject').value, due: $('assignDue').value, weight: +$('assignWeight').value, earned: $('assignEarned').value ? +$('assignEarned').value : null, max: +$('assignMax').value, createdAt: todayStr() });
    saveState(); renderAssignments(); renderGradeForecast(); $('assignmentForm').reset(); showToast('Assignment tracked');
  });
  $('gcalImportBtn').addEventListener('click', importGcal);
  setupClassroomImport();
  renderAssignments(); renderGradeForecast();
}
function renderAssignments() {
  const el = $('assignmentList');
  el.innerHTML = '';
  if (state.assignments.length === 0) { 
    el.innerHTML = '<div class="empty-state"><p>No assignments yet. Add your first assignment!</p><button class="empty-state-button" onclick="loadDemoData()">⚡ Load Sample Assignments</button></div>';
    return; 
  }
  state.assignments.slice().reverse().forEach(a => {
    const dd = daysUntil(a.due);
    const pct = a.earned !== null ? Math.round(a.earned / a.max * 100) : 'N/A';
    const d = document.createElement('div'); d.className = 'item';
    d.innerHTML = `<strong>${escapeHtml(a.title)}</strong> <span class="subtle">${escapeHtml(a.subject)}</span> <span class="badge">${dd >= 0 ? dd + 'd left' : 'Overdue'}</span><br>Grade: ${pct}% | Weight: ${a.weight}%`;
    el.appendChild(d);
  });
}
function renderGradeForecast() {
  const graded = state.assignments.filter(a => a.earned !== null);
  if (graded.length === 0) { $('gradeForecast').textContent = 'No graded assignments yet.'; return; }
  const total = graded.reduce((s, a) => s + a.earned / a.max * a.weight, 0);
  const totalW = graded.reduce((s, a) => s + a.weight, 0);
  const forecast = totalW > 0 ? Math.round(total / totalW * 100) : 0;
  const gpaMap = { 90: 4.0, 85: 3.7, 80: 3.3, 77: 3.0, 73: 2.7, 70: 2.3, 67: 2.0, 63: 1.7, 60: 1.3, 0: 0.0 };
  let gpa = 0;
  for (const [pct, gp] of Object.entries(gpaMap).sort((a, b) => b[0] - a[0])) { if (forecast >= +pct) { gpa = gp; break; } }
  $('gradeForecast').innerHTML = `<strong>Current Forecast: ${forecast}% (GPA: ${gpa.toFixed(1)})</strong> <span class="badge">${graded.length} graded</span>`;
  const highPriority = state.assignments.filter(a => a.earned === null && daysUntil(a.due) <= 7 && daysUntil(a.due) >= 0);
  const hpEl = $('highPriorityList');
  hpEl.innerHTML = '';
  if (highPriority.length === 0) hpEl.innerHTML = '<p class="subtle">No high priority items.</p>';
  else highPriority.forEach(a => { const d = document.createElement('div'); d.className = 'item'; d.innerHTML = `<strong>${escapeHtml(a.title)}</strong> due ${formatDate(a.due)} — ${escapeHtml(a.subject)}`; hpEl.appendChild(d); });
}
function importGcal() {
  const url = $('gcalUrl').value.trim();
  if (!url) { showToast('Enter a valid iCal URL'); return; }
  showToast('Importing calendar...');
  fetch(url).then(res => res.text()).then(ics => {
    const events = [];
    const lines = ics.split('\n');
    let evt = null;
    lines.forEach(l => {
      if (l.startsWith('BEGIN:VEVENT')) evt = {};
      else if (l.startsWith('END:VEVENT') && evt) { events.push(evt); evt = null; }
      else if (evt) {
        if (l.startsWith('SUMMARY')) evt.title = l.split(':').slice(1).join(':');
        if (l.startsWith('DTSTART;VALUE=DATE')) evt.due = l.split(':')[1];
        if (l.startsWith('DTSTART:')) { const m = l.match(/T(\d{4})/); evt.start = m ? m[1] : ''; }
      }
    });
    if (events.length === 0) { showToast('No events found in calendar'); return; }
    events.forEach(e => {
      if (e.title && e.due) {
        state.assignments.push({ id: uid(), title: e.title, subject: 'Calendar', due: e.due.substring(0, 10), weight: 5, earned: null, max: 100, createdAt: todayStr(), source: 'calendar' });
      }
    });
    saveState(); renderAssignments(); renderGradeForecast(); showToast(`${events.length} events imported from calendar`);
  }).catch(() => showToast('Failed to import calendar. Check URL.'));
}
function setupClassroomImport() {
  $('gclassroomImport').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const data = JSON.parse(evt.target.result);
        const courses = data.courses || [data];
        courses.forEach(c => {
          if (c.courseWork) {
            c.courseWork.forEach(w => {
              state.assignments.push({ id: uid(), title: w.title || c.name, subject: c.name || 'Classroom', due: w.dueDate ? `${w.dueDate.year}-${String(w.dueDate.month).padStart(2, '0')}-${String(w.dueDate.day).padStart(2, '0')}` : todayStr(), weight: 5, earned: null, max: 100, createdAt: todayStr(), source: 'classroom' });
            });
          }
        });
        saveState(); renderAssignments(); renderGradeForecast(); showToast('Google Classroom data imported');
      } catch (err) { showToast('Failed to parse Google Classroom file'); }
    };
    reader.readAsText(file);
  });
}

// ===== COACH =====
function setupCoach() {
  $('reflectionForm').addEventListener('submit', e => {
    e.preventDefault();
    state.reflections.push({ id: uid(), date: todayStr(), mood: +$('refMood').value, energy: +$('refEnergy').value, stress: +$('refStress').value, sleep: +$('refSleep').value, wins: $('refWins').value, blockers: $('refBlockers').value });
    state.settings._ach = state.settings._ach || { goalsCompleted:0, earlyTasks:0, studyPlansGenerated:0, reflectionsCount:0 };
    state.settings._ach.reflectionsCount = (state.settings._ach.reflectionsCount||0) + 1;
    saveState(); renderReflections(); updateCoachInsights(); renderDashboard(); $('reflectionForm').reset(); showToast('Reflection logged');
  });
  $('analyzeEssayBtn').addEventListener('click', analyzeEssay);
  setupPdfUpload();
  renderReflections(); updateCoachInsights();
}
function analyzeEssay() {
  const text = $('essayInput').value;
  if (!text.trim()) { showToast('Paste an essay first'); return; }
  showToast('Analyzing essay...');
  groqChat([{ role: 'system', content: 'Analyze this essay. Return JSON with {structure:number, readability:number, thesis:string, argument:string, suggestions:string[]}.' }, { role: 'user', content: text }], { maxTokens: 1024 }).then(txt => {
    try {
      const r = JSON.parse(txt.replace(/```json|```/g, '').trim());
      $('essayFeedback').innerHTML = `<div class="item"><strong>Structure:</strong> ${r.structure}/10 | <strong>Readability:</strong> ${r.readability}/10</div>
      <div class="item"><strong>Thesis:</strong> ${escapeHtml(r.thesis || 'N/A')}</div>
      <div class="item"><strong>Argument:</strong> ${escapeHtml(r.argument || 'N/A')}</div>
      <div class="item"><strong>Suggestions:</strong><ul>${(r.suggestions || []).map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul></div>`;
    } catch (e) { $('essayFeedback').innerHTML = '<p class="subtle">Analysis result available.</p>'; }
  }).catch(() => showToast('Essay analysis failed'));
}
function setupPdfUpload() {
  const zone = $('pdfUploadZone');
  const input = $('pdfFileInput');
  zone.addEventListener('click', () => input.click());
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', e => { e.preventDefault(); zone.classList.remove('dragover'); if (e.dataTransfer.files.length) { input.files = e.dataTransfer.files; handlePdfFile(e.dataTransfer.files[0]); } });
  input.addEventListener('change', () => { if (input.files[0]) handlePdfFile(input.files[0]); });
  $('pdfAiSendBtn').addEventListener('click', askPdfQuestion);
  $('pdfAiInput').addEventListener('keydown', e => { if (e.key === 'Enter') askPdfQuestion(); });
}
async function handlePdfFile(file) {
  $('pdfStatus').textContent = 'Loading PDF...';
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
      const page = await pdf.getPage(i);
      const tc = await page.getTextContent();
      fullText += tc.items.map(t => t.str).join(' ') + '\n';
    }
    if (fullText.length > 10000) fullText = fullText.substring(0, 10000) + '... [truncated]';
    window._pdfContent = fullText;
    $('pdfStatus').textContent = `Loaded ${pdf.numPages} pages (${fullText.length} chars)`;
    $('pdfPreview').classList.remove('hidden');
    $('pdfPreview').textContent = fullText.substring(0, 2000) + '...';
  } catch (e) { $('pdfStatus').textContent = 'Failed to load PDF'; showToast('PDF load error'); }
}
async function askPdfQuestion() {
  const input = $('pdfAiInput');
  if (!input.value.trim() || !window._pdfContent) { showToast('Upload a PDF and ask a question'); return; }
  const q = input.value; input.value = '';
  const chat = $('pdfAiChat');
  chat.innerHTML += `<div class="chat-bubble user">${escapeHtml(q)}</div>`;
  try {
    const txt = await groqChat([{ role: 'system', content: 'Answer questions about the PDF content provided. If the student asks you to do their homework or solve something for them, guide them through it with hints instead and end with one follow-up question.' }, { role: 'user', content: `PDF Content: ${window._pdfContent}\n\nQuestion: ${q}` }], { maxTokens: 1024 });
    chat.innerHTML += `<div class="chat-bubble assistant">${renderMarkdown(txt)}</div>`;
    chat.scrollTop = chat.scrollHeight;
  } catch (e) { chat.innerHTML += `<div class="chat-bubble assistant">AI error. Try again.</div>`; }
}
function renderReflections() {
  const el = $('reflectionsList');
  el.innerHTML = '';
  if (state.reflections.length === 0) { el.innerHTML = '<p class="subtle">No reflections logged yet. Use the Daily Reflection form above to track your well-being and productivity.</p>'; return; }
  state.reflections.slice().reverse().slice(0, 15).forEach(r => {
    const d = document.createElement('div'); d.className = 'item';
    d.innerHTML = `<div class="row-between"><strong>${formatDate(r.date)}</strong>
    <span class="badge">M:${r.mood} E:${r.energy} S:${r.stress}</span></div>
    <span class="small">Sleep: ${r.sleep}h${r.wins ? ' | Wins: ' + escapeHtml(r.wins.substring(0, 80)) : ''}</span>`;
    el.appendChild(d);
  });
}
function updateCoachInsights() {
  const el = $('coachInsights');
  const reflections = state.reflections;
  if (reflections.length < 2) { el.innerHTML = '<p class="subtle">Log at least 2 reflections to see personalized coaching insights.</p>'; return; }
  const recent = reflections.slice(-7);
  const avgMood = recent.reduce((s, r) => s + r.mood, 0) / recent.length;
  const avgEnergy = recent.reduce((s, r) => s + r.energy, 0) / recent.length;
  const avgStress = recent.reduce((s, r) => s + r.stress, 0) / recent.length;
  const avgSleep = recent.reduce((s, r) => s + r.sleep, 0) / recent.length;
  const totalMins = state.sessions.reduce((s, x) => s + (x.minutes || 0), 0);
  const done = state.tasks.filter(t => t.status === 'done').length;
  const streakDates = [...new Set(state.sessions.map(s => s.date.split('T')[0]))].sort().reverse();
  let streak = 0; let cd = new Date();
  for (const d of streakDates) { const diff = Math.round((new Date(d) - cd) / 86400000); if (diff === 0 || diff === -1) { streak++; cd = new Date(d); } else break; }
  let rec = '';
  if (avgStress > 7) rec = 'Your stress levels are elevated. Prioritize self-care: take breaks, practice mindfulness, and ensure adequate sleep. Consider reducing your daily study target.';
  else if (avgEnergy < 5) rec = 'Energy levels are low. Review your sleep schedule and nutrition. Short walks and hydration can help maintain focus during study sessions.';
  else if (streak >= 7) rec = 'Excellent consistency! You have built a strong study habit. Challenge yourself with increasingly difficult material.';
  else if (state.sessions.length < 3) rec = 'You are getting started. Build momentum by scheduling at least one focused session daily. Consistency beats intensity.';
  else rec = 'Good balance maintained. Keep tracking your reflections to identify patterns and optimize your study routine.';
  el.innerHTML = `<div class="item"><strong>7-Day Well-being (${recent.length} entries)</strong><br>
  Mood: ${avgMood.toFixed(1)}/10 | Energy: ${avgEnergy.toFixed(1)}/10 | Stress: ${avgStress.toFixed(1)}/10 | Sleep: ${avgSleep.toFixed(1)}h</div>
  <div class="item"><strong>Study Stats</strong><br>
  ${state.sessions.length} sessions, ${totalMins} min total | ${done}/${state.tasks.length} tasks done | Streak: ${streak}d</div>
  <div class="item"><strong>Coach Says</strong><br>${rec}</div>`;
}

// ===== SMART AI =====
function setupSmartAI() {
  $('contentGeneratorForm').addEventListener('submit', async e => {
    e.preventDefault();
    const topic = $('topicInput').value;
    const type = $('contentType').value;
    const difficulty = $('difficulty').value;
    const count = +$('questionCount').value || 8;
    $('generationStatus').classList.remove('hidden');
    $('generatedContent').innerHTML = '';
    try {
      if (type === 'quiz' || type === 'both') {
        const txt = await groqChat([{ role: 'system', content: `Generate ${count} ${difficulty} quiz questions about "${topic}" as JSON array with {question, options:[4], answer, type:"multiple"}.` }], { maxTokens: 4096 });
        const json = JSON.parse(txt.replace(/```json|```/g, '').trim());
        const el = $('generatedContent');
        el.innerHTML += '<h4>Quiz Questions</h4>';
        json.forEach((q, i) => { el.innerHTML += `<div class="item"><strong>Q${i+1}:</strong> ${escapeHtml(q.question)}<br><em>Answer:</em> ${escapeHtml(q.answer)}</div>`; });
      }
      if (type === 'flashcards' || type === 'both') {
        const txt = await groqChat([{ role: 'system', content: `Generate ${count} flashcards about "${topic}" as JSON array with {question, answer}.` }], { maxTokens: 4096 });
        const json = JSON.parse(txt.replace(/```json|```/g, '').trim());
        const el = $('generatedContent');
        el.innerHTML += '<h4>Flashcards</h4>';
        json.forEach((c, i) => {
          state.flashcards.push({ id: uid(), deck: topic, question: c.question, answer: c.answer, dueDate: todayStr(), interval: 0, ease: 2.5, repetitions: 0, createdAt: todayStr() });
          el.innerHTML += `<div class="item"><strong>${i+1}.</strong> Q: ${escapeHtml(c.question)}<br>A: ${escapeHtml(c.answer)}</div>`;
        });
        saveState(); renderAllFlashcards(); renderFlashcardStudy();
      }
      $('generationStatus').classList.add('hidden'); showToast('Content generated!');
    } catch (err) { $('generationStatus').classList.add('hidden'); showToast('Generation failed'); }
  });
  $('rubricForm').addEventListener('submit', async e => {
    e.preventDefault();
    const content = $('assignmentContent').value;
    const type = $('assignmentType').value;
    const title = $('assignmentTitle').value || 'Untitled';
    const subject = $('subject').value || 'General';
    const points = $('points').value || 'N/A';
    showToast('Analyzing with rubric...');
    try {
      const txt = await groqChat([{ role: 'system', content: 'Evaluate this assignment using a detailed rubric. Return JSON with {score:0-100, feedback:string, strengths:string[], improvements:string[], rubric:{criterion:string, score:number, comment:string}[]}' }, { role: 'user', content: `Type: ${type}, Title: ${title}, Subject: ${subject}, Points Possible: ${points}\n\n${content}` }], { maxTokens: 2048 });
      const r = JSON.parse(txt.replace(/```json|```/g, '').trim());
      const el = $('rubricFeedback');
      el.classList.remove('hidden');
      el.innerHTML = `<div class="item"><strong>Score: ${r.score}%</strong></div>
      <div class="item">${escapeHtml(r.feedback)}</div>
      <div class="item"><strong>Strengths:</strong><ul>${(r.strengths || []).map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul></div>
      <div class="item"><strong>Improvements:</strong><ul>${(r.improvements || []).map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul></div>`;
    } catch (e) { showToast('Rubric analysis failed'); }
  });
}

// ===== AI TUTOR =====
function setupAITutor() {
  $('aiSendBtn').addEventListener('click', sendAiChat);
  $('aiChatInput').addEventListener('keydown', e => { if (e.key === 'Enter') sendAiChat(); });
  $('savePreferences').addEventListener('click', () => {
    state.settings.responseStyle = $('responseStyle').value;
    state.settings.studyMode = $('studyMode').value;
    if ($('showAiThinking')) state.settings.showAiThinking = $('showAiThinking').checked;
    saveState(); showToast('Preferences saved');
  });
  const thinkChk = $('showAiThinking');
  if (thinkChk) thinkChk.checked = state.settings.showAiThinking || false;
  renderAiSessionHistory();
}
async function sendAiChat() {
  const input = $('aiChatInput');
  const q = input.value.trim();
  if (!q) return;
  input.value = '';
  const convHistory = $('aiChatHistory');
  convHistory.innerHTML += `<div class="chat-bubble user">${escapeHtml(q)}</div>`;
  try {
    const style = state.settings.responseStyle || 'detailed';
    const mode = state.settings.studyMode || 'balanced';
    const recentMessages = state.aiChatHistory.slice(-8);
    const recentContext = recentMessages.map(m => `${m.role}: ${m.content.substring(0, 200)}`).join('\n');
    const subjects = [...new Set(state.sessions.map(s => s.subject))].slice(0, 3).join(', ') || 'General';
    const peerPrompt = getPeerTutoringPrompt();
    const adhdNote = state.settings.adhdMode ? ' Keep responses VERY short and concise — 2-3 sentences max. The student has ADHD and needs brief, focused answers.' : '';
    const profileCtx = [state.profile.interests && ('Interests: ' + state.profile.interests + '.'), state.profile.learningStyle && ('Preferred learning style: ' + state.profile.learningStyle + '.'), state.profile.difficulties && ('Known difficulties to handle patiently: ' + state.profile.difficulties + '.'), state.profile.goals && ('Goals to motivate them with: ' + state.profile.goals + '.')].filter(Boolean).join(' ');
     const systemPrompt = `You are a skilled Socratic tutor for ${state.profile.name} (${state.profile.major}). Response style: ${style}. Study mode: ${mode}. ${peerPrompt}${adhdNote} Pedagogical rules you ALWAYS follow: (1) Act like a personal teacher, not an answer machine — your goal is to build the student's understanding. (2) When the student asks a question, first help them THINK: check what they already know, break the problem into smaller steps, and give hints before solutions. (3) After you explain something, ALWAYS end your reply with exactly ONE clear follow-up question that checks understanding or pushes them a step further. (4) Connect ideas with analogies and real-world examples, and praise correct reasoning. Only give a direct answer when the student explicitly asks to be shown the full solution or is clearly stuck. If the student asks for direct instruction, start with "Let's think through this step by step..." Context: recent subjects include ${subjects}. Student profile: ${profileCtx}`;
     const includeThinking = state.settings.showAiThinking;
     const thinkPrompt = includeThinking ? `\n\nFirst, silently reason through your approach in a <thinking> block (do not show this to the student). Then, when responding, briefly narrate your pedagogical reasoning in a concise "Teaching thought:" line that the student CAN see, so they understand how you're guiding them. Format the teaching thought as: _Teaching thought: <brief reasoning>_` : '';
     const txt = await groqChat([
       { role: 'system', content: systemPrompt + thinkPrompt },
       { role: 'user', content: recentContext ? `Previous discussion:\n${recentContext}\n\nStudent's new question: ${q}` : q }
     ], { maxTokens: 1024 });
     let assistantContent = txt;
     let teachingThought = '';
     const thoughtMatch = txt.match(/_Teaching thought:\s*(.+?)(?:$|<br|<\/)/i);
     if (thoughtMatch) { teachingThought = thoughtMatch[1].trim(); assistantContent = txt.replace(thoughtMatch[0], '').trim(); }
     convHistory.innerHTML += `<div class="chat-bubble assistant">${renderMarkdown(assistantContent)}</div>`;
     if (includeThinking && teachingThought) { convHistory.innerHTML += `<div class="ai-thinking">${escapeHtml(teachingThought)}</div>`; }
    state.aiChatHistory.push({ role: 'user', content: q, timestamp: new Date().toISOString() });
    state.aiChatHistory.push({ role: 'assistant', content: txt, timestamp: new Date().toISOString() });
    if (state.aiChatHistory.length > 200) state.aiChatHistory = state.aiChatHistory.slice(-200);
    saveState(); renderAiSessionHistory();
    convHistory.scrollTop = convHistory.scrollHeight;
  } catch (e) { convHistory.innerHTML += `<div class="chat-bubble assistant">I apologize, but I encountered an error. Please try again.</div>`; }
}
function renderAiSessionHistory() {
  const el = $('aiSessionHistory');
  el.innerHTML = '';
  if (state.aiChatHistory.length === 0) { el.innerHTML = '<p class="subtle">No chat history.</p>'; return; }
  const sessions = [];
  let current = { messages: [], start: '' };
  state.aiChatHistory.forEach(msg => {
    if (msg.role === 'user' && current.messages.length > 0) { sessions.push(current); current = { messages: [], start: msg.content.substring(0, 50) }; }
    current.messages.push(msg);
    if (!current.start) current.start = msg.content.substring(0, 50);
  });
  if (current.messages.length > 0) sessions.push(current);
  sessions.slice(-10).reverse().forEach(s => {
    const d = document.createElement('div'); d.className = 'item';
    d.innerHTML = `<strong>Session:</strong> ${escapeHtml(s.start)}... <span class="badge">${s.messages.length} messages</span>`;
    el.appendChild(d);
  });
}

// ===== AI LESSONS =====
let lessonState = { topic: '', steps: [], currentStep: 0, answers: [], paused: false, difficulty: 'intermediate' };
function setupAiLessons() {
  $('lessonForm').addEventListener('submit', async e => {
    e.preventDefault();
    lessonState.topic = $('lessonTopic').value;
    lessonState.difficulty = $('lessonDifficulty').value;
    lessonState.currentStep = 0;
    lessonState.paused = false;
    lessonState.answers = [];
    showToast('Generating lesson...');
    try {
      const txt = await groqChat([{ role: 'system', content: 'Create a 5-step interactive lesson. Return JSON array with 5 objects: {title, concept:string, quiz:{question:string, options:[4], answer:string}, simulation:string}. Make it engaging and educational.' }, { role: 'user', content: `Topic: ${lessonState.topic}, Level: ${lessonState.difficulty}` }], { maxTokens: 4096, temperature: 0.7 });
      lessonState.steps = JSON.parse(txt.replace(/```json|```/g, '').trim());
      $('lessonArea').style.display = 'block';
      $('lessonForm').querySelector('button').textContent = 'Regenerate Lesson';
      showLessonStep();
    } catch (e) { showToast('Failed to generate lesson'); }
  });
  $('lessonNextBtn').addEventListener('click', nextLessonStep);
  $('lessonAskBtn').addEventListener('click', pauseForQuestion);
  $('lessonChatSendBtn').addEventListener('click', sendLessonChat);
  $('lessonChatInput').addEventListener('keydown', e => { if (e.key === 'Enter') sendLessonChat(); });
  $('lessonChatCloseBtn').addEventListener('click', resumeLesson);
  $('lessonRestartBtn').addEventListener('click', () => { lessonState.currentStep = 0; lessonState.paused = false; lessonState.answers = []; showLessonStep(); });
}
function showLessonStep() {
  const step = lessonState.steps[lessonState.currentStep];
  if (!step) { $('lessonContent').innerHTML = '<h3>Lesson Complete!</h3><p>Great job! You finished this lesson.</p>'; $('lessonNextBtn').classList.add('hidden'); $('lessonAskBtn').classList.add('hidden'); return; }
  const total = lessonState.steps.length;
  const pct = ((lessonState.currentStep) / total * 100);
  $('lessonProgressBar').innerHTML = `<span style="width:${pct}%"></span>`;
  $('lessonProgressBar').querySelector('span').style.width = `${pct}%`;
  $('lessonStepCounter').textContent = `Step ${lessonState.currentStep + 1} of ${total}`;
  const q = step.quiz;
  $('lessonContent').innerHTML = `<div class="lesson-card"><h3>${escapeHtml(step.title)}</h3>
    <p>${escapeHtml(step.concept)}</p>
    ${step.concept.includes(':') || step.concept.includes(';') ? '' : '<div class="concept-box">' + escapeHtml(step.concept) + '</div>'}
    <div class="lesson-quiz-options" id="lessonQuizOptions">
      ${(q && q.options ? q.options.map((o, i) => `<button class="lesson-quiz-option" data-opt-index="${i}">${escapeHtml(o)}</button>`).join('') : '')}
    </div>
    <div id="lessonFeedback" class="lesson-feedback hidden"></div></div>`;
  if (q && q.options) {
    $('lessonQuizOptions').querySelectorAll('.lesson-quiz-option').forEach(b => b.addEventListener('click', () => {
      const idx = +b.dataset.optIndex;
      const correct = q.options[q.options.indexOf(q.answer)];
      const chosen = q.options[idx];
      lessonState.answers[lessonState.currentStep] = chosen;
      const fb = $('lessonFeedback');
      fb.classList.remove('hidden');
      if (chosen === q.answer) { fb.className = 'lesson-feedback correct'; fb.textContent = '✓ Correct! ' + (q.explanation || ''); } else { fb.className = 'lesson-feedback incorrect'; fb.textContent = `✗ Incorrect. The answer was: ${q.answer}`; }
      $('lessonQuizOptions').querySelectorAll('.lesson-quiz-option').forEach(o => o.disabled = true);
    }));
  }
  if (step.simulation) {
    $('lessonSimArea').classList.remove('hidden');
    $('lessonSimArea').innerHTML = `<div class="sim-content">${escapeHtml(step.simulation)}</div>`;
  } else $('lessonSimArea').classList.add('hidden');
  $('lessonChatArea').classList.add('hidden');
  $('lessonNextBtn').classList.remove('hidden');
  $('lessonNextBtn').textContent = lessonState.currentStep < total - 1 ? 'Next Step' : 'Finish Lesson';
  $('lessonAskBtn').classList.remove('hidden');
  $('lessonRestartBtn').classList.remove('hidden');
}
function nextLessonStep() {
  if (lessonState.currentStep < lessonState.steps.length - 1) { lessonState.currentStep++; showLessonStep(); }
  else { showToast('Lesson complete!'); $('lessonContent').innerHTML = '<h3>Lesson Complete!</h3><p>Excellent work! You can start another lesson.</p>'; $('lessonNextBtn').classList.add('hidden'); $('lessonAskBtn').classList.add('hidden'); }
}
function pauseForQuestion() {
  lessonState.paused = true;
  $('lessonChatArea').classList.remove('hidden');
  $('lessonContent').classList.add('hidden');
  $('lessonNextBtn').classList.add('hidden');
  $('lessonAskBtn').classList.add('hidden');
}
function resumeLesson() {
  lessonState.paused = false;
  $('lessonChatArea').classList.add('hidden');
  $('lessonContent').classList.remove('hidden');
  $('lessonNextBtn').classList.remove('hidden');
  $('lessonAskBtn').classList.remove('hidden');
}
async function sendLessonChat() {
  const input = $('lessonChatInput');
  const q = input.value.trim();
  if (!q) return;
  input.value = '';
  const hist = $('lessonChatHistory');
  hist.innerHTML += `<div class="chat-bubble user">${escapeHtml(q)}</div>`;
  try {
    const context = `Lesson topic: ${lessonState.topic}. Current step ${lessonState.currentStep + 1}: ${lessonState.steps[lessonState.currentStep]?.title || ''}. Lesson content: ${lessonState.steps[lessonState.currentStep]?.concept || ''}`;
    const txt = await groqChat([{ role: 'system', content: 'You are a Socratic lesson assistant. Guide the student to understand the current lesson step by asking them questions and leading them to the answer themselves. Give hints and worked reasoning, not just the answer. After each reply, end with ONE follow-up question that checks their understanding or prepares them for the next step.' }, { role: 'user', content: `${context}\n\nStudent question: ${q}` }], { maxTokens: 1024 });
    hist.innerHTML += `<div class="chat-bubble assistant">${renderMarkdown(txt)}</div>`;
    state.lessonChatHistory.push({ role: 'user', content: q, step: lessonState.currentStep });
    state.lessonChatHistory.push({ role: 'assistant', content: txt, step: lessonState.currentStep });
    hist.scrollTop = hist.scrollHeight;
  } catch (e) { hist.innerHTML += `<div class="chat-bubble assistant">AI error.</div>`; }
}

// ===== LEARNING TOOLS =====
function setupLearningTools() {
  const copyButtons = qsa('[data-copy]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => showToast('Copied!')).catch(() => {});
      }
    });
  });
}
function exportSessionData() {
  const data = {
    exportedAt: new Date().toISOString(),
    profile: state.profile,
    stats: {
      totalSessions: state.sessions.length,
      totalMinutes: state.sessions.reduce((s, x) => s + (x.minutes || 0), 0),
      totalFlashcards: state.flashcards.length,
      totalTasks: state.tasks.length,
      completedTasks: state.tasks.filter(t => t.status === 'done').length,
      totalQuizzes: state.quizAttempts.length,
      averageQuizScore: state.quizAttempts.length > 0
        ? Math.round(state.quizAttempts.reduce((s, q) => s + q.pct, 0) / state.quizAttempts.length)
        : 0
    }
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `studyhub-report-${todayStr()}.json`; a.click();
  URL.revokeObjectURL(url);
  showToast('Report exported');
}
function generateWeeklyReport() {
  const weekAgo = new Date(Date.now() - 7 * 86400000);
  const weekSessions = state.sessions.filter(s => new Date(s.date) >= weekAgo);
  const weekMinutes = weekSessions.reduce((s, x) => s + (x.minutes || 0), 0);
  const weekTasks = state.tasks.filter(t => new Date(t.createdAt) >= weekAgo || (t.due && new Date(t.due) >= weekAgo));
  const completed = weekTasks.filter(t => t.status === 'done').length;
  const report = `Week Report (${formatDate(weekAgo)} - ${todayStr()})\n` +
    `Study: ${weekSessions.length} sessions, ${Math.round(weekMinutes / 60 * 10) / 10}h\n` +
    `Tasks: ${completed}/${weekTasks.length} completed\n` +
    `Flashcards: ${state.flashcards.length} total\n` +
    `Quizzes: ${state.quizAttempts.length} attempts`;
  showToast('Report generated. Check console.');
  console.log(report);
  return report;
}
function setupGlobalShortcuts() {
  var navBtns = Array.prototype.slice.call(document.querySelectorAll('.nav-btn'));
  function shortcutFor(tab) {
    return state.settings.shortcuts && state.settings.shortcuts[tab] ? state.settings.shortcuts[tab] : null;
  }
  function saveShortcut(tab, key) {
    state.settings.shortcuts = state.settings.shortcuts || {};
    state.settings.shortcuts[tab] = key;
    saveState();
  }
  var grid = $('shortcutGrid');
  if (grid) {
    var defaults = { dashboard: '1', planner: '2', sessions: '3', flashcards: '4', quizzes: '5', notes: '6', settings: '7' };
    var rows = navBtns.map(function(b) {
      var tab = b.dataset.tab;
      var key = shortcutFor(tab);
      if (!key && defaults[tab]) key = defaults[tab];
      var cell = document.createElement('div');
      cell.className = 'shortcut-item';
      cell.innerHTML = '<span class="shortcut-label">' + escapeHtml(b.textContent.trim()) + '</span>' +
        '<button class="shortcut-key" data-tab="' + tab + '" data-key="' + (key ? escapeHtml(key) : '') + '">' + (key ? '<kbd>' + escapeHtml(key) + '</kbd>' : '<em>none</em>') + '</button>';
      grid.appendChild(cell);
      var btn = cell.querySelector('.shortcut-key');
      btn.addEventListener('click', function() {
        btn.textContent = 'Press a key…';
        btn._capturing = true;
        btn.focus();
      });
      btn.addEventListener('keydown', function(ev) {
        if (!btn._capturing) return;
        ev.preventDefault();
        ev.stopPropagation();
        btn._capturing = false;
        var k = ev.key;
        if (k === 'Escape' || k === 'Backspace' || k === 'Delete') {
          delete state.settings.shortcuts[tab];
          saveState();
          btn.innerHTML = '<em>none</em>';
          btn.dataset.key = '';
          return;
        }
        var val = k.length === 1 ? k.toLowerCase() : (k === ' ' ? 'Space' : null);
        if (!val) { btn.textContent = 'Use a single letter or Space'; return; }
        state.settings.shortcuts[tab] = val;
        saveState();
        btn.innerHTML = '<kbd>' + escapeHtml(val) + '</kbd>';
        btn.dataset.key = val;
      });
      return cell;
    });
  }
  document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === '1') { e.preventDefault(); showTab('dashboard'); }
      if (e.key === '2') { e.preventDefault(); showTab('planner'); }
      if (e.key === '3') { e.preventDefault(); showTab('sessions'); }
      if (e.key === '4') { e.preventDefault(); showTab('flashcards'); }
      if (e.key === '5') { e.preventDefault(); showTab('quizzes'); }
      if (e.key === '6') { e.preventDefault(); showTab('notes'); }
      if (e.key === '7') { e.preventDefault(); showTab('settings'); }
    }
    var tag = e.target && e.target.tagName;
    var inField = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (e.target && e.target.closest && e.target.closest('input,textarea,select'));
    if (!inField && !e.ctrlKey && !e.metaKey && !e.altKey) {
      var k = e.key.length === 1 ? e.key.toLowerCase() : (e.key === ' ' ? 'Space' : e.key);
      for (var i = 0; i < navBtns.length; i++) {
        if (shortcutFor(navBtns[i].dataset.tab) === k) {
          showTab(navBtns[i].dataset.tab);
          return;
        }
      }
    }
    if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.target.closest('input,textarea,select')) {
      var used = navBtns.map(function(b) { var s = shortcutFor(b.dataset.tab); return s ? b.textContent.trim() + '=' + s : null; }).filter(Boolean).join(', ');
      showToast('Tab shortcuts: ' + (used || 'none set (configure in Settings)') + '. Space flips cards.');
    }
  });
}

// ===== AI VOICE MODE =====

// ===== ANALYTICS =====
let charts = { studyChart: null, completionChart: null };
function setupAnalytics() {
  renderCharts();
  renderSubjectMastery();
  renderHeatmap();
  renderGradeAnalysis();
}
function renderCharts() {
  if (typeof Chart === 'undefined') return;
  const canvas = $('studyChart');
  if (canvas && !canvas.offsetParent) { return; }
  const c1 = $('studyChart'), c2 = $('completionChart');
  if (c1) { const ex = Chart.getChart(c1); if (ex) { ex.destroy(); } }
  if (c2) { const ex = Chart.getChart(c2); if (ex) { ex.destroy(); } }
  charts.studyChart = null; charts.completionChart = null;
  const days = [];
  const data = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const ds = d.toISOString().split('T')[0];
    days.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    data.push(state.sessions.filter(s => s.date.split('T')[0] === ds).reduce((s, x) => s + (x.minutes || 0), 0));
  }
  const ctx1 = $('studyChart')?.getContext('2d');
  if (ctx1) {
    charts.studyChart = new Chart(ctx1, {
      type: 'bar',
      data: { labels: days, datasets: [{ label: 'Study Minutes', data, backgroundColor: 'rgba(15, 118, 110, 0.7)', borderColor: 'rgb(15, 118, 110)', borderWidth: 1 }] },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, title: { display: true, text: 'Minutes' } } } }
    });
  }
  const todo = state.tasks.filter(t => t.status === 'todo').length;
  const doing = state.tasks.filter(t => t.status === 'doing').length;
  const done = state.tasks.filter(t => t.status === 'done').length;
  const ctx2 = $('completionChart')?.getContext('2d');
  if (ctx2) {
    charts.completionChart = new Chart(ctx2, {
      type: 'doughnut',
      data: { labels: ['To Do', 'In Progress', 'Done'], datasets: [{ data: [todo, doing, done], backgroundColor: ['rgba(230, 167, 0, 0.7)', 'rgba(11, 92, 171, 0.7)', 'rgba(35, 122, 87, 0.7)'], borderColor: ['#e6a700', '#0b5cab', '#237a57'], borderWidth: 2 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });
  }
}
function renderSubjectMastery() {
  const el = $('subjectMastery');
  el.innerHTML = '';
  const subjects = [...new Set([...state.sessions.map(s => s.subject), ...state.goals.map(g => g.subject), ...state.flashcards.map(c => c.deck)])].filter(Boolean);
  if (subjects.length === 0) { el.innerHTML = '<p class="subtle">Add study data to see subject mastery levels.</p>'; return; }
  subjects.forEach(sub => {
    const sessions = state.sessions.filter(s => s.subject === sub);
    const cards = state.flashcards.filter(c => c.deck === sub);
    const mins = sessions.reduce((sum, x) => sum + (x.minutes || 0), 0);
    const avgQuality = sessions.length > 0 ? (sessions.reduce((sum, x) => sum + x.quality, 0) / sessions.length) : 0;
    const hoursFactor = Math.min(mins / 60, 50) * 1.5;
    const cardFactor = cards.length > 0 ? (cards.filter(c => c.repetitions > 0).length / cards.length) * 30 : 0;
    const qualityFactor = avgQuality * 2;
    const pct = Math.min(100, Math.round(hoursFactor + cardFactor + qualityFactor));
    const d = document.createElement('div');
    d.innerHTML = `<div class="row-between"><span><strong>${escapeHtml(sub)}</strong></span><span style="font-weight:700;color:${pct > 70 ? 'var(--success)' : pct > 40 ? 'var(--warning)' : 'var(--danger)'}">${pct}%</span></div>
    <div class="progress"><span style="width:${pct}%;background:${pct > 70 ? 'var(--success)' : pct > 40 ? 'var(--warning)' : 'var(--danger)'}"></span></div>
    <span class="small">${Math.round(mins / 60 * 10) / 10}h studied | ${cards.length} flashcards | ${sessions.length} sessions | Avg quality: ${avgQuality.toFixed(1)}/10</span>`;
    el.appendChild(d);
  });
}
function renderHeatmap() {
  const el = $('activityHeatmap');
  el.innerHTML = '';
  const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const header = document.createElement('div');
  header.style.cssText = 'grid-column:1/-1;display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:4px;font-size:0.65rem;opacity:0.5;text-align:center';
  weekLabels.forEach(d => { const s = document.createElement('span'); s.textContent = d; header.appendChild(s); });
  el.appendChild(header);
  let totalActive = 0;
  let totalMinutes = 0;
  for (let i = 27; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const ds = d.toISOString().split('T')[0];
    const mins = state.sessions.filter(s => s.date.split('T')[0] === ds).reduce((sum, x) => sum + (x.minutes || 0), 0);
    const level = mins === 0 ? 0 : mins <= 30 ? 1 : mins <= 60 ? 2 : mins <= 120 ? 3 : 4;
    if (mins > 0) { totalActive++; totalMinutes += mins; }
    const cell = document.createElement('div');
    cell.className = `heat-cell${level > 0 ? ` level-${level}` : ''}`;
    cell.title = `${formatDate(ds)}: ${mins} minutes${mins > 0 ? ' of study' : ''}`;
    el.appendChild(cell);
  }
  const summary = document.createElement('div');
  summary.style.cssText = 'grid-column:1/-1;margin-top:6px;font-size:0.75rem;opacity:0.6';
  summary.textContent = `${totalActive} active days | ${Math.round(totalMinutes / 60 * 10) / 10}h total | ${totalMinutes > 0 ? Math.round(totalMinutes / Math.max(totalActive, 1)) + ' min/day avg' : 'No study data'}`;
  el.appendChild(summary);
}

// ===== SETTINGS =====
function setupSettings() {
  $('profileForm').addEventListener('submit', e => {
    e.preventDefault();
    state.profile.name = $('profileName').value || 'Scholar';
    state.profile.major = $('profileMajor').value || 'General Studies';
    state.profile.weeklyTargetHours = Math.max(1, +$('profileWeeklyTarget').value || 20);
    state.profile.targetGpa = Math.min(4.0, Math.max(0, +$('profileTargetGpa').value || 3.8));
    state.profile.interests = $('profileInterests').value.trim();
    state.profile.learningStyle = $('profileLearningStyle').value;
    state.profile.difficulties = $('profileDifficulties').value.trim();
    state.profile.goals = $('profileGoals').value.trim();
    saveState(); updateWelcomeTitle(); showToast('Profile saved');
  });
  qsa('.theme-swatch').forEach(s => {
    s.addEventListener('click', () => {
      qsa('.theme-swatch').forEach(x => x.classList.remove('active'));
      s.classList.add('active');
      const theme = s.dataset.theme;
      state.settings.theme = theme;
      if (theme === 'custom') {
        const hex = (s._hex || state.settings.customColor || '#0f766e').replace(/[^0-9a-fA-F#]/g, '');
        state.settings.customColor = hex;
        syncCustomColorUI(hex);
      }
      applyTheme();
      saveState(); showToast(theme === 'custom' ? 'Theme changed to your color' : 'Theme changed to ' + theme);
    });
  });
  var customColorInput = $('customColorInput'), customColorHex = $('customColorHex');
  function syncCustomColorUI(hex) {
    hex = hex || '#0f766e';
    if (customColorInput) customColorInput.value = hex;
    if (customColorHex) customColorHex.value = hex;
  }
  if (customColorInput) {
    customColorInput.addEventListener('input', function() {
      const hex = this.value;
      syncCustomColorUI(hex);
      qsa('.theme-swatch').forEach(x => x.classList.remove('active'));
      const cus = qs('.theme-swatch.custom');
      if (cus) cus.classList.add('active');
      state.settings.theme = 'custom';
      state.settings.customColor = hex;
      applyTheme();
      saveState();
    });
  }
  if (customColorHex) {
    customColorHex.addEventListener('change', function() {
      const hex = this.value.trim();
      if (!/^#[0-9a-fA-F]{3}$|^#[0-9a-fA-F]{6}$/.test(hex)) { showToast('Enter a hex color like #ff5733'); return; }
      syncCustomColorUI(hex);
      qsa('.theme-swatch').forEach(x => x.classList.remove('active'));
      const cus = qs('.theme-swatch.custom');
      if (cus) cus.classList.add('active');
      state.settings.theme = 'custom';
      state.settings.customColor = hex;
      applyTheme();
      saveState();
    });
  }
  $('themeToggleBtn').addEventListener('click', () => {
    state.settings.darkMode = !state.settings.darkMode;
    saveState(); applyTheme();
    showToast(state.settings.darkMode ? 'Dark mode enabled' : 'Light mode enabled');
  });
  var adhdToggle = $('adhdModeToggle');
  if (adhdToggle) {
    adhdToggle.checked = !!state.settings.adhdMode;
    adhdToggle.addEventListener('change', function() {
      state.settings.adhdMode = this.checked;
      saveState();
      showToast(this.checked ? 'ADHD mode enabled — shorter AI responses' : 'ADHD mode disabled');
    });
  }
  var hideMusicToggle = $('hideMusicToggle');
  if (hideMusicToggle) {
    hideMusicToggle.checked = !!state.settings.hideMusic;
    hideMusicToggle.addEventListener('change', function() {
      state.settings.hideMusic = this.checked;
      saveState();
      applyMusicVisibility();
      showToast(this.checked ? 'Music player hidden' : 'Music player shown');
    });
  }
  function applyMusicVisibility() {
    const mp = $('musicPlayer');
    if (mp) mp.style.display = state.settings.hideMusic ? 'none' : '';
    const pp = $('playlistPanel');
    if (pp && state.settings.hideMusic) pp.classList.add('hidden');
  }
  safeCall(function() { applyMusicVisibility(); });
  $('exportDataBtn').addEventListener('click', () => {
    const exportState = cloneObj(state);
    exportState._exportedAt = new Date().toISOString();
    exportState._version = '1.0';
    const blob = new Blob([JSON.stringify(exportState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `studyhub-backup-${todayStr()}.json`; a.click();
    URL.revokeObjectURL(url); showToast('Data exported to JSON');
  });
  $('importDataInput').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const imported = JSON.parse(evt.target.result);
        if (!imported.profile || !imported.settings) {
          throw new Error('Invalid state file format');
        }
        state = deepMerge(cloneObj(DEFAULT_STATE), imported);
        saveState(); showToast('Data imported successfully');
        setTimeout(() => init(), 50);
      } catch (err) { showToast('Import failed: ' + err.message); }
    };
    reader.readAsText(file);
    e.target.value = '';
  });
  $('resetDataBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to erase ALL your data? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('studyhub_user_id');
      localStorage.removeItem('studyhub_sync_queue');
      state = cloneObj(DEFAULT_STATE);
      saveState();
      init();
      showToast('All data has been reset to defaults');
    }
  });
  var rerunBtn = $('rerunOnboardingBtn');
  if (rerunBtn) rerunBtn.addEventListener('click', function() {
    state.profile.setupComplete = false;
    saveState();
    showSetupModal();
    showToast('Onboarding restarted');
  });
  const hcBtn = document.getElementById('runHealthCheckBtn');
  if (hcBtn) { hcBtn.addEventListener('click', runHealthCheck); runHealthCheck(); }
$('profileName').value = state.profile.name;
  $('profileMajor').value = state.profile.major;
  $('profileWeeklyTarget').value = state.profile.weeklyTargetHours;
  $('profileTargetGpa').value = state.profile.targetGpa;
  $('profileInterests').value = state.profile.interests || '';
  $('profileLearningStyle').value = state.profile.learningStyle || '';
  $('profileDifficulties').value = state.profile.difficulties || '';
  $('profileGoals').value = state.profile.goals || '';

  // App language selector
  const langSelect = $('appLanguageSelect');
  if (langSelect) {
    langSelect.value = state.settings.appLanguage || 'en';
    langSelect.addEventListener('change', () => {
      state.settings.appLanguage = langSelect.value;
      saveState();
      applyLanguage();
      renderDashboard();
      showToast('Language changed to ' + (langSelect.value === 'hu' ? 'Magyar' : 'English'));
    });
  }

  // Google OAuth client ID (element removed from settings UI)
  const gClientId = document.getElementById('googleClientId');
  if (gClientId) {
    gClientId.value = state.settings.googleClientId || '';
    gClientId.addEventListener('change', () => {
      state.settings.googleClientId = gClientId.value;
      saveState();
    });
  }
  if (typeof updateGoogleUI === 'function') updateGoogleUI();
}
function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.settings.theme || 'teal');
  if (state.settings.theme === 'custom') {
    const hex = (state.settings.customColor || '#0f766e').replace(/[^0-9a-fA-F#]/g, '');
    const soft = hexToSoft(hex);
    const dark = state.settings.darkMode;
    document.documentElement.style.setProperty('--accent', hex);
    document.documentElement.style.setProperty('--accent-soft', soft);
    document.documentElement.style.setProperty('--sidebar-bg', 'linear-gradient(165deg, ' + darken(hex, dark ? 0.55 : 0.45) + ' 0%, ' + darken(hex, dark ? 0.25 : 0.1) + ' 100%)');
    document.documentElement.style.setProperty('--sidebar-active-text', darken(hex, 0.4));
    const cus = qs('.theme-swatch.custom');
    if (cus) { cus._hex = hex; cus.style.background = hex; }
    const active = qs('.theme-swatch.custom');
    if (active) { qsa('.theme-swatch').forEach(function(x) { x.classList.remove('active'); }); active.classList.add('active'); }
    const ci = $('customColorInput'), ch = $('customColorHex');
    if (ci) ci.value = hex;
    if (ch) ch.value = hex;
  } else {
    document.documentElement.style.removeProperty('--accent');
    document.documentElement.style.removeProperty('--accent-soft');
    document.documentElement.style.removeProperty('--sidebar-bg');
    document.documentElement.style.removeProperty('--sidebar-active-text');
    const active = qs(`.theme-swatch[data-theme="${state.settings.theme}"]`);
    if (active) { qsa('.theme-swatch').forEach(function(x) { x.classList.remove('active'); }); active.classList.add('active'); }
  }
  if (state.settings.darkMode) {
    document.documentElement.setAttribute('data-dark', 'true');
    var btn = $('themeToggleBtn');
    if (btn) btn.innerHTML = '<span class="icon icon-sm icon-timer"></span>';
  } else {
    document.documentElement.removeAttribute('data-dark');
    var btn = $('themeToggleBtn');
    if (btn) btn.innerHTML = '<span class="icon icon-sm icon-star"></span>';
  }
}
function hexToSoft(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(function(c) { return c + c; }).join('');
  const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
  const mix = state && state.settings && state.settings.darkMode ? 0.72 : 0.85;
  return 'rgb(' + Math.round(r * mix + 255 * (1 - mix)) + ',' + Math.round(g * mix + 255 * (1 - mix)) + ',' + Math.round(b * mix + 255 * (1 - mix)) + ')';
}
function darken(hex, amt) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(function(c) { return c + c; }).join('');
  const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
  return 'rgb(' + Math.round(r * (1 - amt)) + ',' + Math.round(g * (1 - amt)) + ',' + Math.round(b * (1 - amt)) + ')';
}
async function runHealthCheck() {
  const results = [];
  results.push({ check: 'Local Storage', status: (() => { try { localStorage.setItem('_test', '1'); localStorage.removeItem('_test'); return 'OK'; } catch (e) { return 'FAIL'; } })() });
  results.push({ check: 'Groq AI API', status: 'Checking...' });
  try {
    const r = await groqChat([{ role: 'user', content: 'Say "ok" if you can read this.' }], { maxTokens: 10 });
    results[1].status = r.includes('ok') || r.includes('OK') ? 'OK' : 'Unexpected response';
  } catch (e) { results[1].status = 'FAIL'; }
  results.push({ check: 'Supabase Cloud', status: typeof supabase !== 'undefined' ? 'Configured' : 'Not loaded' });
  results.push({ check: 'Chart.js', status: typeof Chart !== 'undefined' ? 'Loaded' : 'Not loaded' });
  results.push({ check: 'pdf.js', status: typeof pdfjsLib !== 'undefined' ? 'Loaded' : 'Not loaded' });
  results.push({ check: 'Speech Recognition', status: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window ? 'Available' : 'Not available' });
  const hcEl = $('healthCheckResults');
  if (hcEl) hcEl.innerHTML = `<table class="health-table"><tr><th>Component</th><th>Status</th></tr>${results.map(r => `<tr><td>${r.check}</td><td class="${r.status === 'OK' || r.status === 'Available' || r.status === 'Loaded' || r.status === 'Configured' ? 'status-ok' : r.status.includes('Checking') || r.status === 'Unexpected response' ? 'status-warn' : 'status-err'}">${r.status}</td></tr>`).join('')}</table>`;
  const grokStatusEl = document.getElementById('geminiApiStatus');
  if (grokStatusEl) grokStatusEl.textContent = results[1].status === 'OK' ? 'Connected' : 'Error';
  const supabaseStatusEl = document.getElementById('supabaseStatus');
  if (supabaseStatusEl) supabaseStatusEl.textContent = results[2].status;
}

// ===== MUSIC PLAYER =====
const MUSIC_TRACKS = [
  { file: 'music/Avanti - Mindwave (freetouse.com).mp3', title: 'Mindwave', artist: 'Avanti' },
  { file: 'music/Avanti - Time (freetouse.com).mp3', title: 'Time', artist: 'Avanti' },
  { file: 'music/Aventure - Monday Routine (freetouse.com).mp3', title: 'Monday Routine', artist: 'Aventure' },
  { file: 'music/Aventure - Quiet Bounce (freetouse.com).mp3', title: 'Quiet Bounce', artist: 'Aventure' },
  { file: 'music/Filo Starquez - Park Vibes (freetouse.com).mp3', title: 'Park Vibes', artist: 'Filo Starquez' },
  { file: 'music/Hazelwood - At Ease (freetouse.com).mp3', title: 'At Ease', artist: 'Hazelwood' },
  { file: 'music/Hazelwood - Coming Of Age (freetouse.com).mp3', title: 'Coming Of Age', artist: 'Hazelwood' },
  { file: 'music/Hoffy Beats - Florida Keys (freetouse.com).mp3', title: 'Florida Keys', artist: 'Hoffy Beats' },
  { file: 'music/Lukrembo - Jay (freetouse.com).mp3', title: 'Jay', artist: 'Lukrembo' },
  { file: 'music/Lukrembo - Rose (freetouse.com).mp3', title: 'Rose', artist: 'Lukrembo' },
  { file: 'music/Moavii - Warm Cup of Coffe (freetouse.com).mp3', title: 'Warm Cup of Coffee', artist: 'Moavii' },
  { file: 'music/Nebulite - Kyoto (freetouse.com).mp3', title: 'Kyoto', artist: 'Nebulite' },
  { file: 'music/Nebulite - Love in Japan (freetouse.com).mp3', title: 'Love in Japan', artist: 'Nebulite' },
  { file: 'music/Pufino - Meticulous (freetouse.com) (1).mp3', title: 'Meticulous', artist: 'Pufino' },
  { file: 'music/Pufino - Meticulous (freetouse.com).mp3', title: 'Meticulous (alt)', artist: 'Pufino' },
  { file: 'music/massobeats - daydream (freetouse.com).mp3', title: 'Daydream', artist: 'massobeats' },
  { file: 'music/massobeats - gingersweet (freetouse.com).mp3', title: 'Gingersweet', artist: 'massobeats' },
  { file: 'music/massobeats - honey jam (freetouse.com).mp3', title: 'Honey Jam', artist: 'massobeats' },
];
function setupMusicPlayer() {
  const audio = $('musicAudio');
  $('musicPlayBtn').addEventListener('click', toggleMusicPlay);
  $('musicPrevBtn').addEventListener('click', () => { state.musicTrackIndex = (state.musicTrackIndex - 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length; loadMusicTrack(); });
  $('musicNextBtn').addEventListener('click', () => { state.musicTrackIndex = (state.musicTrackIndex + 1) % MUSIC_TRACKS.length; loadMusicTrack(); });
  $('musicToggleList').addEventListener('click', () => $('musicTrackList').classList.toggle('hidden'));
  $('musicSeek').addEventListener('input', () => { if (audio.src) audio.currentTime = audio.duration * ($('musicSeek').value / 100); });
  $('musicVolume').addEventListener('input', () => { audio.volume = $('musicVolume').value / 100; state.musicVolume = +$('musicVolume').value; saveState(); });
  audio.addEventListener('timeupdate', updateMusicProgress);
  audio.addEventListener('ended', () => { state.musicTrackIndex = (state.musicTrackIndex + 1) % MUSIC_TRACKS.length; loadMusicTrack(); });
  audio.addEventListener('loadedmetadata', () => { $('musicDuration').textContent = formatTime(audio.duration); });
  audio.volume = (state.musicVolume || 70) / 100;
  $('musicVolume').value = state.musicVolume || 70;
  renderMusicTrackList();
  if (MUSIC_TRACKS.length > 0) loadMusicTrack();
}
function loadMusicTrack() {
  const track = MUSIC_TRACKS[state.musicTrackIndex];
  if (!track) return;
  $('musicTitle').textContent = track.title;
  $('musicArtist').textContent = track.artist;
  $('musicAudio').src = track.file;
  $('musicAudio').load();
  if (state.musicPlaying) $('musicAudio').play();
  saveState(); renderMusicTrackList();
}
function toggleMusicPlay() {
  const audio = $('musicAudio');
  if (audio.paused) { audio.play(); state.musicPlaying = true; $('musicPlayBtn').innerHTML = '&#10074;&#10074;'; }
  else { audio.pause(); state.musicPlaying = false; $('musicPlayBtn').innerHTML = '&#9654;'; }
  saveState();
}
function updateMusicProgress() {
  const audio = $('musicAudio');
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration * 100);
  $('musicSeek').value = pct;
  $('musicTime').textContent = formatTime(audio.currentTime);
}
function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}
function renderMusicTrackList() {
  const el = $('musicTrackList');
  el.innerHTML = '';
  MUSIC_TRACKS.forEach((t, i) => {
    const d = document.createElement('div');
    d.className = `music-track-item ${i === state.musicTrackIndex ? 'active' : ''}`;
    d.innerHTML = `<span class="track-num">${i + 1}</span><span class="track-name">${escapeHtml(t.title)}</span><span class="track-artist">${escapeHtml(t.artist)}</span>`;
    d.addEventListener('click', () => { state.musicTrackIndex = i; loadMusicTrack(); if (!state.musicPlaying) toggleMusicPlay(); $('musicTrackList').classList.add('hidden'); });
    el.appendChild(d);
  });
}

// ===== SEED DATA =====
function seedDemoData() {
  if (state.sessions.length > 0 && !confirm('This will add demo data to your existing data. Continue?')) return;
  const subjects = ['Mathematics', 'Biology', 'History', 'Physics', 'Literature'];
  const methods = ['Active Recall', 'Practice Test', 'Flashcards', 'Concept Mapping', 'Pomodoro', 'Feynman Technique'];
  for (let i = 0; i < 14; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    if (i % 2 === 0) {
      state.sessions.push({ id: uid(), date: d.toISOString(), subject: subjects[i % subjects.length], objective: `Review ${subjects[i % subjects.length]} concepts`, minutes: 25 + Math.floor(Math.random() * 50), quality: 6 + Math.floor(Math.random() * 5), method: methods[Math.floor(Math.random() * methods.length)], deep: Math.random() > 0.5, notes: 'Focused demo session.' });
    }
  }
  const goalTemplates = [
    { title: 'Ace Calculus Final', subject: 'Mathematics', deadline: 30, priority: 'high', hours: 20 },
    { title: 'Biology Lab Report', subject: 'Biology', deadline: 14, priority: 'medium', hours: 12 },
    { title: 'History Essay Draft', subject: 'History', deadline: 21, priority: 'medium', hours: 10 },
    { title: 'Physics Problem Set', subject: 'Physics', deadline: 10, priority: 'high', hours: 8 },
    { title: 'Literature Review', subject: 'Literature', deadline: 45, priority: 'low', hours: 15 },
  ];
  goalTemplates.forEach(g => {
    const d = new Date(); d.setDate(d.getDate() + g.deadline);
    state.goals.push({ id: uid(), title: g.title, subject: g.subject, deadline: d.toISOString().split('T')[0], priority: g.priority, hours: g.hours, createdAt: todayStr(), progress: 0 });
  });
  const taskActions = ['Read chapter', 'Solve problems', 'Review notes', 'Complete worksheet', 'Write summary', 'Create mindmap'];
  for (let i = 0; i < 12; i++) {
    const d = new Date(); d.setDate(d.getDate() + i - 3);
    const allSubs = ['Chemistry', 'English', 'Computer Science', ...subjects];
    state.tasks.push({ id: uid(), title: `${taskActions[i % taskActions.length]} for ${allSubs[i % allSubs.length]}`, subject: allSubs[i % allSubs.length], due: d.toISOString().split('T')[0], effort: 1 + Math.floor(Math.random() * 4), status: i < 4 ? 'done' : i < 8 ? 'doing' : 'todo', createdAt: todayStr() });
  }
  const decks = ['Biology Terms', 'Math Formulas', 'History Dates', 'Chemistry Concepts'];
  decks.forEach(deck => {
    for (let i = 0; i < 4; i++) {
      const dd = new Date(); dd.setDate(dd.getDate() - Math.floor(Math.random() * 5));
      state.flashcards.push({ id: uid(), deck, question: `What is ${deck} concept ${i + 1}?`, answer: `This explains ${deck} concept ${i + 1} with key details and examples to aid understanding.`, dueDate: dd.toISOString().split('T')[0], interval: Math.floor(Math.random() * 5), ease: 2.5, repetitions: Math.floor(Math.random() * 3), createdAt: todayStr() });
    }
  });
  for (let i = 0; i < 6; i++) {
    const d = new Date(); d.setDate(d.getDate() + 7 + i * 5);
    state.assignments.push({ id: uid(), title: `${['Homework Set', 'Lab Report', 'Essay Draft', 'Group Project', 'Quiz Prep', 'Final Paper'][i]}`, subject: subjects[i % subjects.length], due: d.toISOString().split('T')[0], weight: 10 + Math.floor(Math.random() * 15), earned: i < 3 ? 80 + Math.floor(Math.random() * 20) : null, max: 100, createdAt: todayStr() });
  }
  for (let i = 0; i < 3; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    state.reflections.push({ id: uid(), date: d.toISOString().split('T')[0], mood: 6 + Math.floor(Math.random() * 5), energy: 5 + Math.floor(Math.random() * 5), stress: 3 + Math.floor(Math.random() * 5), sleep: 6 + Math.floor(Math.random() * 3), wins: 'Completed study tasks for the day', blockers: 'Managing time effectively' });
  }
  for (let i = 0; i < 3; i++) {
    state.quizAttempts.push({ id: uid(), date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0], topic: subjects[i % subjects.length], score: 5 + Math.floor(Math.random() * 5), total: 10, pct: 50 + Math.floor(Math.random() * 50), type: 'multiple' });
  }
  saveState();
  showToast('Demo data loaded! All sections updated.');
  init();
}




// ===== SUBJECTS TAB =====
let calcExpr = "";
function setupSubjects() {
  qsa(".sub-nav-btn").forEach(b => b.addEventListener("click", () => {
    qsa(".sub-nav-btn").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    qsa(".subject-panel").forEach(p => p.classList.add("hidden"));
    const panel = document.getElementById("subject-" + b.dataset.subject);
    if (panel) panel.classList.remove("hidden");
  }));

  // ---- Math Calculator (scoped to subject-math only) ----
  var mathPanel = document.getElementById('subject-math');
  if (mathPanel) {
    qsa(".calc-btn", mathPanel).forEach(b => {
      b.addEventListener("click", () => {
        const v = b.dataset.v;
        if (v === "C") { calcExpr = ""; updateCalcDisplay(); return; }
        if (v === "=") {
          try {
            let expr = calcExpr.replace(/\u00d7/g, "*").replace(/\u00f7/g, "/").replace(/\u2212/g, "-");
            expr = expr.replace(/\^/g, "**"); expr = expr.replace(/sqrt\(/g, "Math.sqrt(");
            expr = expr.replace(/sin\(/g, "Math.sin("); expr = expr.replace(/cos\(/g, "Math.cos(");
            expr = expr.replace(/tan\(/g, "Math.tan("); expr = expr.replace(/log\(/g, "Math.log10(");
            expr = expr.replace(/pi/g, "Math.PI");
            const result = Function('"use strict"; return (' + expr + ')')();
            calcExpr = String(result);
          } catch (e) { calcExpr = "Error"; }
          updateCalcDisplay(); return;
        }
        calcExpr += v; updateCalcDisplay();
      });
    });
    function updateCalcDisplay() {
      var d = mathPanel.querySelector('#calcDisplay');
      if (d) d.value = calcExpr || "0";
    }
    // ---- Graph Plotter (scoped to subject-math) ----
    (function() {
      var oldGraphBtn = mathPanel.querySelector('#plotGraphBtn');
      if (!oldGraphBtn) return;
      function plotGraph() {
        var canvas = mathPanel.querySelector('#graphCanvasAi');
        if (!canvas) return;
        var ctx = canvas.getContext("2d");
        var W = 500, H = 280;
        canvas.width = W * 2; canvas.height = H * 2; canvas.style.width = W + "px"; canvas.style.height = H + "px";
        ctx.scale(2, 2); ctx.clearRect(0, 0, W, H); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, H);
        var padding = 40, plotW = W - padding * 2, plotH = H - padding * 2;
        var xMin = -10, xMax = 10, yMin = -10, yMax = 10;
        var xScale = plotW / (xMax - xMin), yScale = plotH / (yMax - yMin);
        function tc(x, y) { return [padding + (x - xMin) * xScale, padding + (yMax - y) * yScale]; }
        ctx.strokeStyle = "#e8f0ed"; ctx.lineWidth = 1;
        for (var i = Math.ceil(xMin); i <= Math.floor(xMax); i++) { var cx2 = tc(i,0)[0]; ctx.beginPath(); ctx.moveTo(cx2, padding); ctx.lineTo(cx2, padding + plotH); ctx.stroke(); }
        for (var j = Math.ceil(yMin); j <= Math.floor(yMax); j++) { var cy2 = tc(0,j)[1]; ctx.beginPath(); ctx.moveTo(padding, cy2); ctx.lineTo(padding + plotW, cy2); ctx.stroke(); }
        ctx.strokeStyle = "#1f2b2b"; ctx.lineWidth = 2;
        var x0 = tc(0,0)[0], y0 = tc(0,0)[1];
        ctx.beginPath(); ctx.moveTo(padding, y0); ctx.lineTo(padding + plotW, y0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x0, padding); ctx.lineTo(x0, padding + plotH); ctx.stroke();
        var fnText = (mathPanel.querySelector('#graphFunction') || {}).value || "x^2";
        try {
          var compiled = new Function("x", "with(Math){return " + fnText.replace(/\^/g, "**") + "}");
          ctx.strokeStyle = "#0f766e"; ctx.lineWidth = 2.5; ctx.beginPath(); var first = true;
          for (var px = 0; px <= plotW; px++) {
            var x = xMin + (px / plotW) * (xMax - xMin);
            try { var y = compiled(x); if (typeof y !== "number" || !isFinite(y)) { first = true; continue; } var cp = tc(x, y); if (cp[1] < padding - 10 || cp[1] > padding + plotH + 10) { first = true; continue; } if (first) { ctx.moveTo(cp[0], cp[1]); first = false; } else ctx.lineTo(cp[0], cp[1]); } catch(e) { first = true; }
          }
          ctx.stroke();
        } catch(e) { ctx.fillStyle = "#b42318"; ctx.font = "14px sans-serif"; ctx.fillText("Invalid function", 10, 20); }
      }
      oldGraphBtn.addEventListener("click", plotGraph);
      var oldGraphInput = mathPanel.querySelector('#graphFunction');
      if (oldGraphInput) oldGraphInput.addEventListener("keydown", function(e) { if (e.key === "Enter") plotGraph(); });
      setTimeout(plotGraph, 100);
    })();
  }

  // ---- Math Solver (AI) ----
  $("mathSolverBtn").addEventListener("click", async () => {
    const input = $("mathSolverInput").value.trim();
    if (!input) { showToast("Enter a math problem"); return; }
    showToast("Solving...");
    try {
      const txt = await groqChat([
        { role: "system", content: "You are a math tutor. Provide step-by-step guidance for the problem. Guide the student to solve it themselves. Never give the final answer directly." },
        { role: "user", content: input }
      ], { maxTokens: 1024 });
      $("mathSolverResult").innerHTML = '<div class="chat-bubble assistant">' + renderMarkdown(txt) + '</div>';
    } catch (e) { showToast("AI error"); }
  });

  // ---- Physics ----
  $("physicsExplainBtn").addEventListener("click", async () => {
    const topic = $("physicsTopic").value;
    const labels = { motion: "Motion & Kinematics", forces: "Forces & Newton's Laws", energy: "Energy & Work", waves: "Waves & Sound", electricity: "Electricity & Circuits" };
    showToast("Explaining...");
    try {
      const txt = await groqChat([
        { role: "system", content: "You are a physics tutor. Explain the concept clearly with examples. Use analogies. Keep it under 200 words." + FOLLOWUP_NOTE },
        { role: "user", content: "Explain: " + (labels[topic] || topic) }
      ], { maxTokens: 1024 });
      $("physicsResult").innerHTML = '<div class="chat-bubble assistant">' + renderMarkdown(txt) + '</div>';
    } catch (e) { showToast("AI error"); }
  });

  // ---- Chemistry ----
  $("chemistryExplainBtn").addEventListener("click", async () => {
    const topic = $("chemistryTopic").value;
    const labels = { atoms: "Atomic Structure", bonds: "Chemical Bonding", reactions: "Chemical Reactions", periodic: "Periodic Table", organic: "Organic Chemistry" };
    showToast("Explaining...");
    try {
      const txt = await groqChat([
        { role: "system", content: "You are a chemistry tutor. Explain the concept clearly with examples." + FOLLOWUP_NOTE },
        { role: "user", content: "Explain: " + (labels[topic] || topic) }
      ], { maxTokens: 1024 });
      $("chemistryResult").innerHTML = '<div class="chat-bubble assistant">' + renderMarkdown(txt) + '</div>';
    } catch (e) { showToast("AI error"); }
  });

  // ---- Biology ----
  $("biologyExplainBtn").addEventListener("click", async () => {
    const topic = $("biologyTopic").value;
    const labels = { cells: "Cell Biology", genetics: "Genetics & DNA", evolution: "Evolution", ecology: "Ecology", human: "Human Body Systems" };
    showToast("Explaining...");
    try {
      const txt = await groqChat([
        { role: "system", content: "You are a biology tutor. Explain the concept clearly with examples." + FOLLOWUP_NOTE },
        { role: "user", content: "Explain: " + (labels[topic] || topic) }
      ], { maxTokens: 1024 });
      $("biologyResult").innerHTML = '<div class="chat-bubble assistant">' + renderMarkdown(txt) + '</div>';
    } catch (e) { showToast("AI error"); }
  });

  // ---- Mind Maps ----
  $("mindmapBtn").addEventListener("click", async () => {
    const topic = $("mindmapTopic").value;
    const labels = { photosynthesis: "Photosynthesis", "cell-division": "Cell Division", "chemical-bonds": "Chemical Bonds", "newtons-laws": "Newton's Laws", ecosystems: "Ecosystems" };
    showToast("Generating mind map...");
    try {
      const txt = await groqChat([
        { role: "system", content: "Generate a text-based mind map for the topic. Use indentation level (no markdown). Return ONLY the mind map text." },
        { role: "user", content: "Topic: " + (labels[topic] || topic) }
      ], { maxTokens: 1024 });
      $("mindmapResult").innerHTML = '<div class="chat-bubble assistant">' + renderMarkdown(txt) + '</div>';
    } catch (e) { showToast("AI error"); }
  });

  // ---- Languages: Speaking ----
  $("langSpeakingStartBtn").addEventListener("click", async () => {
    const lang = $("langSpeakingLang").value;
    const level = $("langSpeakingLevel").value;
    showToast("Generating speaking exercise...");
    try {
      const txt = await groqChat([
        { role: "system", content: "Generate a speaking exercise for " + lang + " at " + level + " level. Include: topic, key phrases to practice, and a sample dialogue. Format with clear sections." },
        { role: "user", content: "Create a speaking practice exercise." }
      ], { maxTokens: 1024 });
      $("langSpeakingArea").innerHTML = '<div class="chat-bubble assistant">' + renderMarkdown(txt) + '</div>';
      if ("speechSynthesis" in window) {
        const utter = new SpeechSynthesisUtterance(txt.substring(0, 200));
        const langMap = { spanish: "es-ES", french: "fr-FR", german: "de-DE", japanese: "ja-JP", mandarin: "zh-CN", italian: "it-IT", portuguese: "pt-BR", arabic: "ar-SA" };
        utter.lang = langMap[lang] || "en-US";
        window.speechSynthesis.speak(utter);
      }
    } catch (e) { showToast("AI error"); }
  });

  // ---- Languages: Listening ----
  $("langListeningGenBtn").addEventListener("click", async () => {
    const lang = $("langListeningLang").value;
    const langMap = { spanish: "es-ES", french: "fr-FR", german: "de-DE", japanese: "ja-JP" };
    showToast("Generating listening exercise...");
    try {
      const txt = await groqChat([
        { role: "system", content: "Generate a short listening passage in " + lang + " (about 80 words) followed by 3 comprehension questions in English." },
        { role: "user", content: "Create a listening exercise." }
      ], { maxTokens: 1024 });
      $("langListeningArea").innerHTML = '<div class="chat-bubble assistant">' + renderMarkdown(txt) + '</div>';
      if ("speechSynthesis" in window) {
        const firstPart = txt.split("?")[0] || txt.substring(0, 200);
        const utter = new SpeechSynthesisUtterance(firstPart);
        utter.lang = langMap[lang] || "en-US";
        window.speechSynthesis.speak(utter);
      }
    } catch (e) { showToast("AI error"); }
  });

  // ---- Languages: Reading ----
  $("langReadingGenBtn").addEventListener("click", async () => {
    const lang = $("langReadingLang").value;
    const level = $("langReadingLevel").value;
    showToast("Generating reading exercise...");
    try {
      const txt = await groqChat([
        { role: "system", content: "Generate a reading passage in " + lang + " at " + level + " level (about 100 words) followed by 3 comprehension questions in English with answers." },
        { role: "user", content: "Create a reading exercise." }
      ], { maxTokens: 1024 });
      $("langReadingArea").innerHTML = '<div class="chat-bubble assistant">' + renderMarkdown(txt) + '</div>';
    } catch (e) { showToast("AI error"); }
  });

  // ---- Languages: Writing ----
  $("langWritingPromptBtn").addEventListener("click", async () => {
    const lang = $("langWritingLang").value;
    showToast("Generating writing prompt...");
    try {
      const txt = await groqChat([
        { role: "system", content: "Generate a writing prompt in " + lang + " with instructions in English. Include: topic, word count, and key vocabulary to use." },
        { role: "user", content: "Create a writing prompt." }
      ], { maxTokens: 1024 });
      $("langWritingArea").innerHTML = '<div class="chat-bubble assistant">' + renderMarkdown(txt) + '</div>';
    } catch (e) { showToast("AI error"); }
  });

  // ---- Social Studies: Geography ----
  $("geoExplainBtn").addEventListener("click", async () => {
    const region = $("geoRegion").value;
    const labels = { world: "World Geography", europe: "Europe", asia: "Asia", africa: "Africa", americas: "Americas" };
    showToast("Learning...");
    try {
      const txt = await groqChat([
        { role: "system", content: "You are a geography tutor. Explain key geographical features, countries, and cultural aspects of the region." + FOLLOWUP_NOTE },
        { role: "user", content: "Teach me about: " + (labels[region] || region) }
      ], { maxTokens: 1024 });
      $("geoResult").innerHTML = '<div class="chat-bubble assistant">' + renderMarkdown(txt) + '</div>';
    } catch (e) { showToast("AI error"); }
  });

  // ---- Social Studies: History ----
  $("historyTimelineBtn").addEventListener("click", async () => {
    const period = $("historyPeriod").value;
    const labels = { ancient: "Ancient History", medieval: "Medieval Period", modern: "Modern History", "20th": "20th Century", world: "World History Overview" };
    showToast("Generating timeline...");
    try {
      const txt = await groqChat([
        { role: "system", content: "Generate a timeline of key events for the historical period. Format as a list with dates and descriptions." },
        { role: "user", content: "Timeline for: " + (labels[period] || period) }
      ], { maxTokens: 1024 });
      $("historyResult").innerHTML = '<div class="chat-bubble assistant">' + renderMarkdown(txt) + '</div>';
    } catch (e) { showToast("AI error"); }
  });

  // ---- Social Studies: Economy ----
  $("economyExplainBtn").addEventListener("click", async () => {
    const topic = $("economyTopic").value;
    const labels = { basics: "Basic Economic Principles", "supply-demand": "Supply & Demand", markets: "Market Structures", fiscal: "Fiscal Policy", global: "Global Economy" };
    showToast("Explaining...");
    try {
      const txt = await groqChat([
        { role: "system", content: "You are an economics tutor. Explain the concept with real-world examples." + FOLLOWUP_NOTE },
        { role: "user", content: "Explain: " + (labels[topic] || topic) }
      ], { maxTokens: 1024 });
      $("economyResult").innerHTML = '<div class="chat-bubble assistant">' + renderMarkdown(txt) + '</div>';
    } catch (e) { showToast("AI error"); }
  });

  // ---- Social Studies: Civics ----
  $("civicsExplainBtn").addEventListener("click", async () => {
    const topic = $("civicsTopic").value;
    const labels = { gov: "Government Systems", rights: "Rights & Responsibilities", society: "Social Structures", culture: "Culture & Society", institutions: "Social Institutions" };
    showToast("Explaining...");
    try {
      const txt = await groqChat([
        { role: "system", content: "You are a civics and sociology tutor. Explain the concept clearly." + FOLLOWUP_NOTE },
        { role: "user", content: "Explain: " + (labels[topic] || topic) }
      ], { maxTokens: 1024 });
      $("civicsResult").innerHTML = '<div class="chat-bubble assistant">' + renderMarkdown(txt) + '</div>';
    } catch (e) { showToast("AI error"); }
  });

  // ---- English: Text Analyzer ----
  $("englishAnalyzeBtn").addEventListener("click", async () => {
    const text = $("englishAnalyzerInput").value.trim();
    if (!text) { showToast("Paste some text first"); return; }
    showToast("Analyzing...");
    try {
      const txt = await groqChat([
        { role: "system", content: "Analyze this text for readability, structure, and grammar. Return JSON with {readability:0-100, grammar:string, structure:string, suggestions:string[]}. Return ONLY valid JSON." },
        { role: "user", content: text }
      ], { maxTokens: 1024 });
      try {
        const r = JSON.parse(txt.replace(/```json|```/g, "").trim());
        let html = '<div class="item"><strong>Readability:</strong> ' + r.readability + '/100</div>';
        if (r.grammar) html += '<div class="item"><strong>Grammar:</strong> ' + escapeHtml(r.grammar) + '</div>';
        if (r.structure) html += '<div class="item"><strong>Structure:</strong> ' + escapeHtml(r.structure) + '</div>';
        if (r.suggestions) html += '<div class="item"><strong>Suggestions:</strong><ul>' + r.suggestions.map(function(s) { return '<li>' + escapeHtml(s) + '</li>'; }).join("") + '</ul></div>';
        $("englishAnalysisResult").innerHTML = html;
      } catch (e) {
        $("englishAnalysisResult").innerHTML = '<div class="chat-bubble assistant">' + renderMarkdown(txt) + '</div>';
      }
    } catch (e) { showToast("AI error"); }
  });

  // ---- English: Essay Helper ----
  $("englishEssayHelpBtn").addEventListener("click", async () => {
    const essay = $("englishEssayInput").value.trim();
    const prompt = $("englishEssayPrompt").value.trim() || "general feedback";
    if (!essay) { showToast("Paste your essay first"); return; }
    showToast("Getting guidance...");
    try {
      const txt = await groqChat([
        { role: "system", content: "You are an English writing tutor. Guide the student to improve their essay. Never write content for them. Focus on: " + prompt },
        { role: "user", content: "Essay draft:\\n" + essay.substring(0, 3000) }
      ], { maxTokens: 1024 });
      $("englishEssayResult").innerHTML = '<div class="chat-bubble assistant">' + renderMarkdown(txt) + '</div>';
    } catch (e) { showToast("AI error"); }
  });

  // ---- English: Vocabulary Builder ----
  $("englishVocabBtn").addEventListener("click", async () => {
    const topic = $("englishVocabTopic").value.trim() || "general";
    showToast("Generating vocabulary...");
    try {
      const txt = await groqChat([
        { role: "system", content: "Generate 10 vocabulary words for the topic. Return JSON array with {word, definition, example}. Return ONLY valid JSON." },
        { role: "user", content: "Topic: " + topic }
      ], { maxTokens: 1024 });
      try {
        const words = JSON.parse(txt.replace(/```json|```/g, "").trim());
        let html = "";
        words.forEach(function(w) {
          html += '<div class="item"><strong>' + escapeHtml(w.word) + '</strong> - ' + escapeHtml(w.definition) + '<br><em>' + escapeHtml(w.example || "") + '</em></div>';
        });
        $("englishVocabResult").innerHTML = html;
      } catch (e) {
        $("englishVocabResult").innerHTML = '<div class="chat-bubble assistant">' + renderMarkdown(txt) + '</div>';
      }
    } catch (e) { showToast("AI error"); }
  });

  // ---- Health: Exercise ----
  $("exerciseGuideBtn").addEventListener("click", async () => {
    const type = $("exerciseType").value;
    const labels = { cardio: "Cardio", strength: "Strength Training", flexibility: "Flexibility & Stretching", hiit: "HIIT Workouts", yoga: "Yoga & Meditation" };
    showToast("Generating exercise guide...");
    try {
      const txt = await groqChat([
        { role: "system", content: "You are a fitness coach. Provide a safe, effective exercise guide for the activity. Include warm-up, main exercises, and cool-down. Prioritize safety." },
        { role: "user", content: "Exercise guide for: " + (labels[type] || type) }
      ], { maxTokens: 1024 });
      $("exerciseResult").innerHTML = '<div class="chat-bubble assistant">' + renderMarkdown(txt) + '</div>';
    } catch (e) { showToast("AI error"); }
  });

  // ---- Health: Body Systems ----
  $("bodySystemBtn").addEventListener("click", async () => {
    const system = $("bodySystem").value;
    const labels = { skeletal: "Skeletal System", muscular: "Muscular System", circulatory: "Circulatory System", respiratory: "Respiratory System", nervous: "Nervous System", digestive: "Digestive System", immune: "Immune System" };
    showToast("Explaining...");
    try {
      const txt = await groqChat([
        { role: "system", content: "You are a biology tutor. Explain the body system with key functions and interesting facts." },
        { role: "user", content: "Explain: " + (labels[system] || system) }
      ], { maxTokens: 1024 });
      $("bodySystemResult").innerHTML = '<div class="chat-bubble assistant">' + renderMarkdown(txt) + '</div>';
    } catch (e) { showToast("AI error"); }
  });

  // ---- Health: Nutrition ----
  $("nutritionAskBtn").addEventListener("click", async () => {
    const q = $("nutritionQuery").value.trim();
    if (!q) { showToast("Ask a question"); return; }
    showToast("Asking AI...");
    try {
      const txt = await groqChat([
        { role: "system", content: "You are a nutrition and wellness expert. Provide evidence-based advice. Focus on general wellness, not medical diagnosis." },
        { role: "user", content: q }
      ], { maxTokens: 1024 });
      $("nutritionResult").innerHTML = '<div class="chat-bubble assistant">' + renderMarkdown(txt) + '</div>';
    } catch (e) { showToast("AI error"); }
  });

  // ---- Math Formulas ----
  renderMathFormulas();
}

function renderMathFormulas() {
  const el = $("mathFormulas");
  if (!el) return;
  const formulas = [
    { name: "Quadratic Formula", formula: "x = (-b \u00b1 \u221a(b\u00b2 - 4ac)) / 2a", desc: "Solves ax\u00b2 + bx + c = 0" },
    { name: "Pythagorean Theorem", formula: "a\u00b2 + b\u00b2 = c\u00b2", desc: "Right triangle relationship" },
    { name: "Area of Circle", formula: "A = \u03c0r\u00b2", desc: "Area with radius r" },
    { name: "Circumference", formula: "C = 2\u03c0r", desc: "Circle perimeter" },
    { name: "Area of Triangle", formula: "A = \u00bd \u00d7 b \u00d7 h", desc: "Base times height over 2" },
    { name: "Volume of Sphere", formula: "V = \u00be\u03c0r\u00b3", desc: "Sphere volume" },
    { name: "Sine Rule", formula: "sin(A)/a = sin(B)/b = sin(C)/c", desc: "Triangle side-angle relation" },
    { name: "Cosine Rule", formula: "c\u00b2 = a\u00b2 + b\u00b2 - 2ab\u00b7cos(C)", desc: "General triangle formula" },
    { name: "Derivative of x\u207f", formula: "d/dx(x\u207f) = nx\u207f\u207b\u00b9", desc: "Power rule" },
    { name: "Integration", formula: "\u222bx\u207f dx = x\u207f\u207a\u00b9/(n+1) + C", desc: "Power rule for integrals" },
    { name: "Slope", formula: "m = (y\u2082 - y\u2081)/(x\u2082 - x\u2081)", desc: "Line slope between points" },
    { name: "Distance Formula", formula: "d = \u221a((x\u2082-x\u2081)\u00b2 + (y\u2082-y\u2081)\u00b2)", desc: "Distance between two points" }
  ];
  el.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;">' + formulas.map(function(f) {
    return '<div class="item" style="text-align:center;"><strong>' + escapeHtml(f.name) + '</strong><br><code style="font-size:1rem;background:#f0f7f4;padding:4px 8px;border-radius:6px;display:inline-block;margin:4px 0;">' + escapeHtml(f.formula) + '</code><br><span class="small">' + escapeHtml(f.desc) + '</span></div>';
  }).join("") + '</div>';
}

// ===== ONBOARDING WIZARD =====
var FEATURES = [
  { icon: '<span class="icon icon-sm icon-timer"></span>', title: 'Pomodoro Timer', desc: 'Focus with timed study sessions and breaks. Track your total study hours and build streaks.' },
  { icon: '<span class="icon icon-sm icon-card"></span>', title: 'Smart Flashcards', desc: 'Create decks with spaced repetition (SM-2). Flip, rate, and watch your retention grow.' },
  { icon: '<span class="icon icon-sm icon-ai"></span>', title: 'AI Tutor & Coach', desc: 'Chat with AI about any subject. Get instant explanations, practice problems, and study tips.' },
  { icon: '<span class="icon icon-sm icon-quiz"></span>', title: 'Multiple Quiz Types', desc: 'Multiple choice, fill-in, true/false, matching, and mock tests — all generated by AI.' },
  { icon: '<span class="icon icon-sm icon-note"></span>', title: '6 Note Methods', desc: 'Cornell, outline, mind map, charting, sentence, and blurting — pick your style.' },
  { icon: '<span class="icon icon-sm icon-target"></span>', title: 'Goal & Task Planner', desc: 'Set weekly goals, manage tasks with a Kanban board, and track your progress over time.' },
  { icon: '<span class="icon icon-sm icon-cal"></span>', title: 'Smart Calendar', desc: 'Import iCal/PDF schedules, add Google Calendar events, and visualize your study plan.' },
  { icon: '<span class="icon icon-sm icon-voice"></span>', title: 'Voice Conversation', desc: 'Practice speaking with AI in 10 languages. Get pronunciation feedback and grammar corrections.' },
  { icon: '<span class="icon icon-sm icon-chart"></span>', title: 'Analytics Dashboard', desc: 'See your study metrics, completion rates, GPA trends, and heatmaps at a glance.' },
  { icon: '<span class="icon icon-sm icon-music"></span>', title: 'Music Player', desc: 'Built-in lofi player with playlists. Study with ambient focus music.' },
  { icon: '<span class="icon icon-sm icon-voice"></span>', title: 'Lecture Recording', desc: 'Record lectures with consent, get AI-generated summaries and practice exercises.' },
  { icon: '<span class="icon icon-sm icon-star"></span>', title: '8 Custom Themes', desc: 'Choose from teal, blue, purple, green, orange, red, pink, or yellow. Dark mode included.' }
];

var setupState = { step: 0, name: '', major: '', weeklyTarget: 20, targetGpa: 3.8, subjects: [], theme: 'teal', interests: '', learningStyle: '', difficulties: '', goals: '' };

function showSetupModal() {
  setupState = { step: 0, name: '', major: '', weeklyTarget: 20, targetGpa: 3.8, subjects: [], theme: state.settings.theme || 'teal', interests: '', learningStyle: '', difficulties: '', goals: '' };
  var modal = $('setupModal');
  if (modal) modal.classList.remove('hidden');
  renderSetupStep();
  var nextBtn = $('setupNextBtn'), backBtn = $('setupBackBtn'), finishBtn = $('setupFinishBtn');
  if (nextBtn && backBtn && finishBtn) {
    var newNext = nextBtn.cloneNode(true), newBack = backBtn.cloneNode(true), newFinish = finishBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newNext, nextBtn);
    backBtn.parentNode.replaceChild(newBack, backBtn);
    finishBtn.parentNode.replaceChild(newFinish, finishBtn);
    newNext.addEventListener('click', function() {
      if (setupState.step === 1) {
        var name = $('setupName');
        if (name) setupState.name = name.value.trim() || 'Scholar';
        var major = $('setupMajor');
        if (major) setupState.major = major.value.trim() || 'General Studies';
        var weekly = $('setupWeekly');
        if (weekly) setupState.weeklyTarget = +weekly.value || 20;
        var gpa = $('setupGpa');
        if (gpa) setupState.targetGpa = Math.min(4, Math.max(0, +gpa.value || 3.8));
        var interests = $('setupsInterests');
        if (interests) setupState.interests = interests.value.trim();
        var learningStyle = $('setupLearningStyle');
        if (learningStyle) setupState.learningStyle = learningStyle.value;
        var difficulties = $('setupDifficulties');
        if (difficulties) setupState.difficulties = difficulties.value.trim();
        var goals = $('setupGoals');
        if (goals) setupState.goals = goals.value.trim();
      }
      if (setupState.step >= 1 && setupState.step < 5) {
        setupState.step++;
        renderSetupStep();
      }
    });
    newBack.addEventListener('click', function() {
      if (setupState.step > 1) { setupState.step--; renderSetupStep(); }
    });
    newFinish.addEventListener('click', function() {
      state.profile.name = setupState.name || 'Scholar';
      state.profile.major = setupState.major || 'General Studies';
      state.profile.weeklyTargetHours = setupState.weeklyTarget || 20;
      state.profile.targetGpa = setupState.targetGpa || 3.8;
      state.profile.subjects = setupState.subjects;
      state.profile.interests = setupState.interests || '';
      state.profile.learningStyle = setupState.learningStyle || '';
      state.profile.difficulties = setupState.difficulties || '';
      state.profile.goals = setupState.goals || '';
      state.profile.setupComplete = true;
      state.settings.theme = setupState.theme || 'teal';
      document.documentElement.setAttribute('data-theme', state.settings.theme);
      saveState();
      $('setupModal').classList.add('hidden');
      updateWelcomeTitle();
      showToast('Welcome to Study Hub, ' + state.profile.name + '!');
    });
  }
}

function renderSetupStep() {
  var content = $('setupStepContent');
  var footer = $('onbFooter');
  if (!content) return;
  var backBtn = $('setupBackBtn'), nextBtn = $('setupNextBtn'), finishBtn = $('setupFinishBtn');

  if (setupState.step === 0) {
    backBtn.style.display = 'none'; nextBtn.style.display = 'none'; finishBtn.style.display = 'none';
    if (footer) footer.style.display = 'none';
    content.innerHTML =
      '<div class="lp">' +
        '<div class="lp-hero">' +
          '<nav class="lp-nav"><div class="lp-logo"><span class="icon icon-sm icon-book"></span> Study Hub</div><div class="lp-nav-links"><a href="#features">Features</a><a href="#how">How It Works</a><button class="lp-cta-sm" id="onbGetStartedNav">Get Started</button></div></nav>' +
          '<div class="lp-hero-inner">' +
            '<div class="lp-badge"><span class="icon icon-sm icon-star"></span> Free · No sign-up required</div>' +
            '<h1 class="lp-title">Your All-in-One<br><span class="lp-gradient">Academic Command Center</span></h1>' +
             '<p class="lp-subtitle"><strong>78% of students abandon passive study apps within two weeks.</strong> Study Hub combines AI micro-learning with active peer feedback to double retention.</p>' +
            '<div class="lp-hero-btns">' +
              '<button class="lp-cta" id="onbGetStarted1">Get Started Free →</button>' +
              '<button class="lp-cta-secondary" onclick="document.getElementById(\'features\').scrollIntoView({behavior:\'smooth\'})">Explore Features</button>' +
            '</div>' +
            '<div class="lp-stats">' +
              '<div class="lp-stat"><span class="lp-stat-num">12+</span><span class="lp-stat-label">Study Tools</span></div>' +
              '<div class="lp-stat"><span class="lp-stat-num">AI</span><span class="lp-stat-label">Powered Tutor</span></div>' +
              '<div class="lp-stat"><span class="lp-stat-num">100%</span><span class="lp-stat-label">Free & Offline</span></div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="lp-section" id="how">' +
          '<h2 class="lp-section-title">How It Works</h2>' +
          '<p class="lp-section-sub">Three simple steps to supercharge your studying.</p>' +
          '<div class="lp-steps">' +
            '<div class="lp-step"><div class="lp-step-num">1</div><div class="lp-step-icon"><span class="icon icon-sm icon-note"></span></div><h3>Set Up Your Profile</h3><p>Tell us your name, major, and study goals — we\'ll personalize everything.</p></div>' +
            '<div class="lp-step"><div class="lp-step-num">2</div><div class="lp-step-icon"><span class="icon icon-sm icon-book"></span></div><h3>Choose Your Tools</h3><p>Pick from 12+ study tools: Pomodoro timer, flashcards, AI tutor, quizzes, notes, and more.</p></div>' +
            '<div class="lp-step"><div class="lp-step-num">3</div><div class="lp-step-icon"><span class="icon icon-sm icon-target"></span></div><h3>Start Studying</h3><p>Track sessions, review with spaced repetition, and watch your grades improve.</p></div>' +
          '</div>' +
        '</div>' +

        '<div class="lp-section lp-features" id="features">' +
          '<h2 class="lp-section-title">Everything You Need to Study Better</h2>' +
          '<p class="lp-section-sub">12 powerful tools designed to work together seamlessly.</p>' +
          '<div class="lp-feature-grid">' +
            FEATURES.map(function(f) {
              return '<div class="lp-feature-card">' +
                '<div class="lp-feature-icon">' + f.icon + '</div>' +
                '<h3>' + f.title + '</h3>' +
                '<p>' + f.desc + '</p>' +
              '</div>';
            }).join('') +
          '</div>' +
        '</div>' +

        '<div class="lp-section lp-why">' +
          '<h2 class="lp-section-title">Why Students Love Study Hub</h2>' +
          '<div class="lp-testimonials">' +
            '<div class="lp-testimonial"><div class="lp-test-text">"The AI tutor helped me understand calculus in minutes. The Pomodoro timer keeps me focused for hours."</div><div class="lp-test-author">— Alex, Computer Science</div></div>' +
            '<div class="lp-testimonial"><div class="lp-test-text">"I went from a 3.0 to a 3.8 GPA using the spaced repetition flashcards. This app is incredible."</div><div class="lp-test-author">— Sarah, Biology</div></div>' +
            '<div class="lp-testimonial"><div class="lp-test-text">"The fact that everything is free and works offline is amazing. I use it every single day."</div><div class="lp-test-author">— Marcus, Engineering</div></div>' +
          '</div>' +
        '</div>' +

        '<div class="lp-cta-section">' +
          '<h2>Ready to Transform Your Study Habits?</h2>' +
          '<p>Join thousands of students using Study Hub to study smarter, not harder.</p>' +
          '<button class="lp-cta" id="onbGetStarted2">Set Up Your Profile →</button>' +
          '<p class="lp-hint">No account needed. Your data is stored locally on your device.</p>' +
        '</div>' +

        '<footer class="lp-footer">' +
          '<p>Study Hub — Built for students who want to study smarter.</p>' +
        '</footer>' +
      '</div>';
    var gsNav = $('onbGetStartedNav');
    var gs1 = $('onbGetStarted1');
    var gs2 = $('onbGetStarted2');
    function goToSetup() { setupState.step = 1; renderSetupStep(); }
    if (gsNav) gsNav.addEventListener('click', goToSetup);
    if (gs1) gs1.addEventListener('click', goToSetup);
    if (gs2) gs2.addEventListener('click', goToSetup);
  } else {
    if (footer) footer.style.display = 'flex';
    backBtn.style.display = setupState.step > 1 ? '' : 'none';
    nextBtn.style.display = setupState.step < 5 ? '' : 'none';
    finishBtn.style.display = setupState.step === 5 ? '' : 'none';
    content.className = 'onboarding-content setup-mode';

    if (setupState.step === 1) {
      content.innerHTML =
        '<div class="onb-step-inner">' +
          '<div class="onb-step-icon"><span class="icon icon-lg icon-note"></span></div>' +
          '<h2>Create Your Profile</h2>' +
          '<p class="onb-desc">Tell us about yourself so we can personalize your experience.</p>' +
          '<div class="onb-field">' +
            '<label>Your Name</label>' +
            '<input id="setupName" placeholder="e.g. Alex" value="' + escapeHtml(setupState.name || state.profile.name) + '" />' +
          '</div>' +
          '<div class="onb-field">' +
            '<label>Program / Major</label>' +
            '<input id="setupMajor" placeholder="e.g. Computer Science" value="' + escapeHtml(setupState.major || state.profile.major) + '" />' +
          '</div>' +
          '<div class="onb-field-row">' +
            '<div class="onb-field half">' +
              '<label>Weekly Study Target</label>' +
              '<input id="setupWeekly" type="number" min="1" value="' + (setupState.weeklyTarget || state.profile.weeklyTargetHours) + '" />' +
            '</div>' +
            '<div class="onb-field half">' +
              '<label>Target GPA</label>' +
              '<input id="setupGpa" type="number" min="0" max="4" step="0.1" value="' + (setupState.targetGpa || state.profile.targetGpa) + '" />' +
            '</div>' +
          '</div>' +
          '<div class="onb-field">' +
            '<label>Interests</label>' +
            '<input id="setupsInterests" placeholder="e.g. space, coding, music, history" value="' + escapeHtml(setupState.interests || state.profile.interests || '') + '" />' +
          '</div>' +
          '<div class="onb-field">' +
            '<label>How do you learn best?</label>' +
            '<select id="setupLearningStyle">' +
              '<option value="">Select your learning style</option>' +
              '<option value="visual">Visual — diagrams, images, mind maps</option>' +
              '<option value="auditory">Auditory — listening, discussion, text-to-speech</option>' +
              '<option value="reading">Reading / writing — text, notes, lists</option>' +
              '<option value="kinesthetic">Hands-on — practice, examples, projects</option>' +
              '<option value="mixed">Mixed — a bit of everything</option>' +
            '</select>' +
          '</div>' +
          '<div class="onb-field">' +
            '<label>Difficulties (optional, we\'ll adapt)</label>' +
            '<input id="setupDifficulties" placeholder="e.g. keeping focus, math anxiety, time management" value="' + escapeHtml(setupState.difficulties || state.profile.difficulties || '') + '" />' +
          '</div>' +
          '<div class="onb-field">' +
            '<label>Goals (optional)</label>' +
            '<input id="setupGoals" placeholder="e.g. reach a 3.5 GPA, get into med school, learn Spanish" value="' + escapeHtml(setupState.goals || state.profile.goals || '') + '" />' +
          '</div>' +
        '</div>';
    } else if (setupState.step === 2) {
      var allSubjects = ['Math', 'Science', 'Languages', 'Social Studies', 'English', 'Health Studies'];
      content.innerHTML =
        '<div class="onb-step-inner">' +
          '<div class="onb-step-icon"><span class="icon icon-lg icon-book"></span></div>' +
          '<h2>Choose Your Subjects</h2>' +
          '<p class="onb-desc">Pick the subjects you\'re currently studying.</p>' +
          '<div class="setup-subject-grid">' +
            allSubjects.map(function(s) {
              var icon = ({'Math':'<span class="icon icon-sm icon-timer"></span>','Science':'<span class="icon icon-sm icon-target"></span>','Languages':'<span class="icon icon-sm icon-voice"></span>','Social Studies':'<span class="icon icon-sm icon-book"></span>','English':'<span class="icon icon-sm icon-note"></span>','Health Studies':'<span class="icon icon-sm icon-brain"></span>'})[s] || '<span class="icon icon-sm icon-book"></span>';
              return '<div class="setup-subject-option' + (setupState.subjects.includes(s) ? ' selected' : '') + '" data-subj="' + s + '">' +
                '<span class="subj-icon">' + icon + '</span><span class="subj-name">' + s + '</span></div>';
            }).join('') +
          '</div>' +
        '</div>';
      qsa('.setup-subject-option').forEach(function(el) {
        el.addEventListener('click', function() {
          var s = this.dataset.subj;
          var idx = setupState.subjects.indexOf(s);
          if (idx >= 0) { setupState.subjects.splice(idx, 1); this.classList.remove('selected'); }
          else { setupState.subjects.push(s); this.classList.add('selected'); }
        });
      });
    } else if (setupState.step === 3) {
      content.innerHTML =
        '<div class="onb-step-inner">' +
          '<div class="onb-step-icon"><span class="icon icon-lg icon-star"></span></div>' +
          '<h2>Pick Your Theme</h2>' +
          '<p class="onb-desc">Choose a color that matches your style.</p>' +
          '<div class="theme-grid">' +
            ['teal','blue','orange','green','purple','red','pink','yellow'].map(function(t) {
              var names = {'teal':'Teal','blue':'Blue','orange':'Orange','green':'Green','purple':'Purple','red':'Red','pink':'Pink','yellow':'Yellow'};
              return '<button class="theme-swatch' + (setupState.theme === t ? ' active' : '') + '" data-theme="' + t + '" title="' + names[t] + '"></button>';
            }).join('') +
          '</div>' +
        '</div>';
      qsa('.theme-swatch').forEach(function(el) {
        el.addEventListener('click', function() {
          qsa('.theme-swatch').forEach(function(x) { x.classList.remove('active'); });
          this.classList.add('active');
          setupState.theme = this.dataset.theme;
        });
      });
    } else if (setupState.step === 4) {
      var tour = [
        { icon: 'icon-chart', title: 'Dashboard', desc: 'Your home base: weekly hours, streak, tasks, and a daily mission.' },
        { icon: 'icon-timer', title: 'Sessions', desc: 'Pomodoro timer + log your study time to build your streak.' },
        { icon: 'icon-card', title: 'Flashcards', desc: 'Spaced repetition decks and AI-generated flashcards.' },
        { icon: 'icon-ai', title: 'AI Tutor', desc: 'Chat with AI that adapts to how you learn best.' },
        { icon: 'icon-voice', title: 'Voice Mode', desc: 'Practice speaking in 10 languages with live feedback.' },
        { icon: 'icon-brain', title: 'Warm Up', desc: 'Quick focus, memory and word games before studying.' },
        { icon: 'icon-ai', title: 'Generators', desc: 'Turn any concept into a mind map, film, or real images.' },
        { icon: 'icon-chart', title: 'Analytics', desc: 'Mastery charts, heatmaps, and weekly reports.' }
      ];
      content.innerHTML =
        '<div class="onb-step-inner">' +
          '<div class="onb-step-icon"><span class="icon icon-lg icon-book"></span></div>' +
          '<h2>Quick Tour</h2>' +
          '<p class="onb-desc">Here\'s what you can do. Explore any tab from the left menu anytime.</p>' +
          '<div class="onb-tour-grid">' +
            tour.map(function(t) {
              return '<div class="onb-tour-item"><span class="icon icon-sm ' + t.icon + '"></span><b>' + t.title + '</b><small>' + t.desc + '</small></div>';
            }).join('') +
          '</div>' +
          '<p class="onb-desc" style="margin-top:10px">Tip: press <b>?</b> on any screen to see keyboard shortcuts.</p>' +
        '</div>';
    } else if (setupState.step === 5) {
      content.innerHTML =
        '<div class="onb-step-inner onb-ready">' +
          '<div class="onb-ready-icon"><span class="icon icon-xl icon-target"></span></div>' +
          '<h2>You\'re All Set!</h2>' +
          '<p class="onb-desc">Your profile is ready. Let\'s start studying!</p>' +
          '<div class="onb-ready-list">' +
            '<div class="onb-ready-item"><span class="icon icon-sm icon-chart"></span> Track your study sessions</div>' +
            '<div class="onb-ready-item"><span class="icon icon-sm icon-card"></span> Create flashcards</div>' +
            '<div class="onb-ready-item"><span class="icon icon-sm icon-ai"></span> Chat with AI Tutor</div>' +
            '<div class="onb-ready-item"><span class="icon icon-sm icon-cal"></span> Plan your calendar</div>' +
            '<div class="onb-ready-item"><span class="icon icon-sm icon-target"></span> Set goals and track progress</div>' +
          '</div>' +
        '</div>';
    }
  }
}



// ===== APP LANGUAGE SYSTEM =====
function applyLanguage() {
  try {
  const lang = _lang();
  document.documentElement.lang = lang;
  document.title = __('appName');
  const nav = qs('.nav');
  if (nav) {
    qsa('.nav-btn', nav).forEach(b => {
      const key = 'tab' + b.dataset.tab.charAt(0).toUpperCase() + b.dataset.tab.slice(1);
      const t = __(key);
      if (t !== key) b.textContent = t;
    });
  }
  // Translate Settings / Voice / Lecture labels. Only elements that exist in
  // the DOM are touched; icon spans inside buttons are preserved (only the
  // text nodes are replaced, so <span class="icon">...</span> survive).
  // The HTML is authored in English, so skip when the UI is already English.
  if (lang !== 'en') {
    const labelEls = {
    settingsProfileHeading: 'profileLabel',
    settingsThemeHeading: 'themeLabel',
    settingsLangHeading: 'langLabel',
    exportDataBtn: 'exportBtn',
    resetDataBtn: 'resetBtn',
    saveProfileBtn: 'saveProfile',
    lectureGenerateBtn: 'lectureGenerate',
    voiceConvStart: 'startCall',
    voiceConvEnd: 'voiceCallEnd',
  };
  Object.entries(labelEls).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (!el) return;
    const t = __(key);
    if (t === key) return;
    const textNodes = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    if (!textNodes.length) { el.textContent = t; return; }
    let filled = false;
    textNodes.forEach(function(n) {
      if (!filled && n.nodeValue.trim()) {
        n.nodeValue = n.nodeValue.replace(/\S[\s\S]*\S|\S/, ' ' + t);
        filled = true;
      } else {
        n.nodeValue = '';
      }
    });
  });
  }
  // Translate the language selector
  const langSelect = $('appLanguageSelect');
  if (langSelect) {
    qsa('option', langSelect).forEach(o => {
      if (o.value === 'en') o.textContent = __('english');
      if (o.value === 'hu') o.textContent = __('hungarian');
    });
  }
  } catch(e) { console.warn('applyLanguage error:', e); }
}

// ===== LIVE AI VOICE CONVERSATION =====
let voiceConversation = { active: false, history: [], currentAnalysis: null, exercises: [], retestQueue: [] };
const VOICE_LANGUAGES = [
  { code: 'en-US', label: 'English', nativeLabel: 'English', groqLang: 'English' },
  { code: 'hu-HU', label: 'Hungarian', nativeLabel: 'Magyar', groqLang: 'Hungarian (Magyar)' },
  { code: 'es-ES', label: 'Spanish', nativeLabel: 'Español', groqLang: 'Spanish' },
  { code: 'fr-FR', label: 'French', nativeLabel: 'Français', groqLang: 'French' },
  { code: 'de-DE', label: 'German', nativeLabel: 'Deutsch', groqLang: 'German' },
  { code: 'it-IT', label: 'Italian', nativeLabel: 'Italiano', groqLang: 'Italian' },
  { code: 'pt-BR', label: 'Portuguese', nativeLabel: 'Português', groqLang: 'Portuguese' },
  { code: 'ja-JP', label: 'Japanese', nativeLabel: '日本語', groqLang: 'Japanese' },
  { code: 'zh-CN', label: 'Mandarin', nativeLabel: '普通话', groqLang: 'Mandarin Chinese' },
  { code: 'ar-SA', label: 'Arabic', nativeLabel: 'العربية', groqLang: 'Arabic' },
];

function setupVoiceConversation() {
  const startBtn = $('voiceConvStart');
  const endBtn = $('voiceConvEnd');
  const langSelect = $('voiceConvLang');
  const transcript = $('voiceConvTranscript');
  const statusEl = $('voiceConvStatus');
  const analysisEl = $('voiceConvAnalysis');
  const exercisesEl = $('voiceConvExercises');

  if (!startBtn) return;

  // Populate language options
  if (langSelect) {
    langSelect.innerHTML = VOICE_LANGUAGES.map(l =>
      `<option value="${l.code}" data-groqlang="${l.groqLang}">${l.nativeLabel} (${l.label})</option>`
    ).join('');
  }

  // Populate TTS voice selector
  var voiceSelect = $('voiceConvVoice');
  function populateVoices() {
    if (!voiceSelect) return;
    var voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    var currentLang = langSelect ? langSelect.value : 'en-US';
    var selectedVoice = voiceSelect.value;
    voiceSelect.innerHTML = '<option value="">AI Voice (auto)</option>';
    var filtered = voices.filter(function(v) { return v.lang.startsWith(currentLang.split('-')[0]); });
    // Also add a few default voices per language
    filtered.forEach(function(v) {
      var opt = document.createElement('option');
      opt.value = v.name;
      opt.textContent = v.name + ' (' + v.lang + ')' + (v.default ? ' ★' : '');
      voiceSelect.appendChild(opt);
    });
    if (selectedVoice) voiceSelect.value = selectedVoice;
  }
  if (window.speechSynthesis) {
    window.speechSynthesis.addEventListener('voiceschanged', populateVoices);
    setTimeout(populateVoices, 500);
  }
  // Re-populate when language changes
  if (langSelect && voiceSelect) {
    langSelect.addEventListener('change', function() {
      setTimeout(populateVoices, 200);
    });
  }

  // Speech recognition setup
  let recognition = null;
  const hasSpeech = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  if (hasSpeech) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = e => {
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
      }
      if (final && voiceConversation.active) {
        handleVoiceConversationInput(final);
      }
    };
    recognition.onerror = e => {
      if (e.error !== 'no-speech' && voiceConversation.active) {
        showToast('Voice error: ' + e.error);
      }
    };
  } else {
    if (startBtn) startBtn.style.opacity = '0.5';
    if (statusEl) statusEl.textContent = 'Speech recognition not available';
  }

  startBtn.addEventListener('click', async () => {
    if (voiceConversation.active) return;
    const lang = langSelect ? langSelect.value : 'en-US';
    const groqLang = langSelect ? langSelect.options[langSelect.selectedIndex].dataset.groqlang : 'English';
    voiceConversation.active = true;
    voiceConversation.history = [];
    if (analysisEl) analysisEl.innerHTML = '';
    if (exercisesEl) exercisesEl.innerHTML = '';
    if (transcript) transcript.innerHTML = `<div class="call-bubble ai">AI: Hello! I'm your ${groqLang} conversation partner. Start speaking, and I'll respond naturally.</div>`;
    if (statusEl) { statusEl.textContent = 'Live — speaking...'; statusEl.className = 'call-status live'; }
    if (endBtn) endBtn.style.display = '';
    if (startBtn) startBtn.style.display = 'none';
    if (langSelect) langSelect.disabled = true;
    if (recognition) {
      try {
        recognition.lang = lang;
        recognition.start();
      } catch (e) { showToast('Failed to start voice recognition'); }
    }
    voiceConversation.history.push({ role: 'assistant', content: `Hello! I'm your ${groqLang} conversation partner.` });
  });

  endBtn.addEventListener('click', async () => {
    voiceConversation.active = false;
    if (recognition) try { recognition.stop(); } catch (e) {}
    if (statusEl) { statusEl.textContent = 'Analyzing conversation...'; statusEl.className = 'call-status analyzing'; }
    if (startBtn) startBtn.style.display = '';
    if (endBtn) endBtn.style.display = 'none';
    if (langSelect) langSelect.disabled = false;
    const endLang = langSelect ? langSelect.options[langSelect.selectedIndex].dataset.groqlang : 'English';
    await analyzeVoiceConversation(endLang || 'English', transcript, analysisEl, exercisesEl);
  });
}

async function handleVoiceConversationInput(text) {
  const transcript = $('voiceConvTranscript');
  if (!transcript) return;
  const langSelect = $('voiceConvLang');
  const groqLang = langSelect ? langSelect.options[langSelect.selectedIndex].dataset.groqlang : 'English';
  transcript.innerHTML += `<div class="call-bubble user">You: ${escapeHtml(text)}</div>`;
  transcript.scrollTop = transcript.scrollHeight;
  voiceConversation.history.push({ role: 'user', content: text });
  var currentLang = langSelect ? langSelect.value : 'en-US';
  try {
    const systemPrompt = `You are a ${groqLang} language conversation partner. Respond naturally in ${groqLang}. Keep responses conversational (2-4 sentences). After your response, add "---CORRECTIONS---" then list any grammar/vocabulary corrections if needed, or "---NONE---" if everything was correct.`;
    const resp = await groqChat([{ role: 'system', content: systemPrompt }, ...voiceConversation.history.slice(-6)], { maxTokens: 512 });
    const parts = resp.split('---CORRECTIONS---');
    const reply = parts[0].trim();
    const corrections = parts[1] ? parts[1].trim() : '';
    transcript.innerHTML += `<div class="call-bubble ai">AI: ${escapeHtml(reply)}</div>`;
    if (corrections && corrections !== '---NONE---') {
      transcript.innerHTML += `<div class="call-correction">${escapeHtml(corrections)}</div>`;
    }
    transcript.scrollTop = transcript.scrollHeight;
    voiceConversation.history.push({ role: 'assistant', content: reply });
  } catch (e) {
    console.error('Voice conversation error:', e);
    transcript.innerHTML += `<div class="call-bubble ai">AI: ${escapeHtml(e && e.message ? e.message : 'I had trouble responding. Please try again.')}</div>`;
  }
  if ('speechSynthesis' in window && voiceConversation.history.length) {
    var lastReply = voiceConversation.history[voiceConversation.history.length - 1];
    if (lastReply && lastReply.role === 'assistant') {
      try {
        window.speechSynthesis.cancel();
        var utter = new SpeechSynthesisUtterance(lastReply.content);
        utter.lang = currentLang;
        utter.rate = 1.0;
        var vs = $('voiceConvVoice');
        if (vs && vs.value) {
          var allVoices = window.speechSynthesis.getVoices();
          var found = allVoices.filter(function(v) { return v.name === vs.value; });
          if (found.length > 0) utter.voice = found[0];
        }
        window.speechSynthesis.speak(utter);
      } catch (e) { console.warn('TTS error:', e); }
    }
  }
}

// ===== PRESENTATION, SPEECH & AI CROWD PRACTICE =====
function setupPracticeCoach() {
  var modeSel = $('practiceMode'), topicInput = $('practiceTopic');
  var textEl = $('practiceText'), runBtn = $('practiceRunBtn'), resetBtn = $('practiceResetBtn');
  var outEl = $('practiceOutput');
  if (!runBtn || !textEl || !outEl) return;

  function modeLabel(mode) {
    return mode === 'speech' ? 'Speech Practice' : mode === 'presentation' ? 'Presentation Feedback' : 'AI Crowd (Audience Reactions)';
  }

  function buildPrompt(mode, topic, text) {
    var base = topic ? ' The user is presenting on this topic: "' + topic + '".' : '';
    if (mode === 'speech') {
      return 'Act as a speech coach. Review the speech below and give feedback on pacing, clarity, tone, filler words, and delivery confidence. Be specific and encouraging. Use short headers.' + base + '\n\nSPEECH:\n' + text;
    }
    if (mode === 'presentation') {
      return 'Act as a presentation coach. Review structure, opening, flow, clarity, supporting points, and closing. Suggest improvements and give a score out of 10.' + base + '\n\nPRESENTATION:\n' + text;
    }
    return 'Act as a live audience member reacting to this presentation. Write lively, realistic reactions: cheers, applause, murmurs, questions the crowd would ask, and the overall crowd vibe. End with a short reaction summary.' + base + '\n\nPRESENTATION:\n' + text;
  }

  runBtn.addEventListener('click', async function() {
    var text = textEl.value.trim();
    if (!text) { showToast('Type or paste your speech / presentation first.'); textEl.focus(); return; }
    var mode = modeSel ? modeSel.value : 'speech';
    var topic = topicInput ? topicInput.value.trim() : '';
    var lbl = modeLabel(mode);
    outEl.innerHTML = '<p class="subtle">' + lbl + ' — analyzing...</p>';
    runBtn.disabled = true;
    try {
      var resp = await groqChat([
        { role: 'system', content: 'You are a friendly, constructive practice coach. Keep feedback clear and well-structured.' },
        { role: 'user', content: buildPrompt(mode, topic, text) }
      ], { maxTokens: 1024, temperature: 0.7 });
      outEl.innerHTML = '<h4><span class="icon icon-sm icon-chart"></span> ' + lbl + '</h4><div class="analysis-content" style="white-space:pre-wrap">' + escapeHtml(resp) + '</div>';
    } catch (err) {
      outEl.innerHTML = '<p class="subtle">Sorry, I could not generate feedback. Please try again.</p>';
      if (typeof console !== 'undefined') console.error('Practice coach error:', err);
    } finally {
      runBtn.disabled = false;
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      if (textEl) textEl.value = '';
      if (topicInput) topicInput.value = '';
      if (outEl) outEl.innerHTML = '<p class="subtle">Clear and start again.</p>';
    });
  }

  // ---- Performance Coach chat (uses recorded data) ----
  var chatEl = $('coachChat'), chatInput = $('coachChatInput'), chatSend = $('coachChatSend');
  if (chatEl && chatInput && chatSend) {
    var coachHistory = [];
    function coachDataSnapshot() {
      var totalMins = state.sessions.reduce(function(s, x) { return s + (x.minutes || 0); }, 0);
      var done = state.tasks.filter(function(t) { return t.status === 'done'; }).length;
      var streakDates = [...new Set(state.sessions.map(function(s) { return s.date.split('T')[0]; }))].sort().reverse();
      var streak = 0, cd = new Date();
      for (var i = 0; i < streakDates.length; i++) { var diff = Math.round((new Date(streakDates[i]) - cd) / 86400000); if (diff === 0 || diff === -1) { streak++; cd = new Date(streakDates[i]); } else break; }
      var weekAgo = new Date(Date.now() - 7 * 86400000);
      var weekMins = state.sessions.filter(function(s) { return new Date(s.date) >= weekAgo; }).reduce(function(s, x) { return s + (x.minutes || 0); }, 0);
      var subjects = [...new Set(state.sessions.map(function(s) { return s.subject; }))].filter(Boolean).slice(0, 5);
      var recent = state.sessions.slice(-3).map(function(s) { return (s.subject || 'General') + ' ' + (s.minutes || 0) + 'min'; });
      return 'STUDY DATA (real, from the user\'s account): ' +
        state.sessions.length + ' total sessions, ' + totalMins + ' total minutes, ' + weekMins + ' minutes in the last 7 days, ' +
        'streak ' + streak + ' day(s), ' + done + '/' + state.tasks.length + ' tasks completed, ' +
        'top subjects: ' + (subjects.join(', ') || 'none yet') +
        (recent.length ? ', recent sessions: ' + recent.join('; ') : '') +
        ', current focus area / goals: ' + state.goals.map(function(g) { return g.title; }).join(', ').slice(0, 200) + '.';
    }
    function coachMsg(text, user) {
      var m = document.createElement('div');
      m.className = user ? 'coach-bubble user' : 'coach-bubble coach';
      m.textContent = text;
      chatEl.appendChild(m);
      chatEl.scrollTop = chatEl.scrollHeight;
    }
    async function coachReply() {
      var q = chatInput.value.trim();
      if (!q) { chatInput.focus(); return; }
      coachMsg(q, true);
      chatInput.value = '';
      chatSend.disabled = true;
      coachHistory.push({ role: 'user', content: q });
      try {
        var resp = await groqChat([
          { role: 'system', content: 'You are the user\'s personal performance & study coach. You know their real recorded study data below. Be warm, specific, practical, and honest. Reference their actual stats where relevant (e.g. streaks, minutes, subjects). Answer directly in a conversational tone, keep it under 120 words, and end with one small next-step suggestion.' },
          { role: 'system', content: coachDataSnapshot() },
          ...coachHistory.slice(-8)
        ], { maxTokens: 512, temperature: 0.8 });
        coachHistory.push({ role: 'assistant', content: resp });
        coachMsg(resp, false);
      } catch (err) {
        coachMsg('Sorry, I could not reach my coaching brain. Please try again.', false);
        if (typeof console !== 'undefined') console.error('Coach chat error:', err);
      } finally {
        chatSend.disabled = false;
      }
    }
    chatSend.addEventListener('click', coachReply);
    chatInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') { e.preventDefault(); coachReply(); } });
  }
}

// ===== ACCESSIBILITY: TEXT-TO-SPEECH + VOICE TUTOR (blind-friendly) =====
function setupTextToSpeech() {
  var speakBtn = $('ttsSpeakBtn'), stopBtn = $('ttsStopBtn'), readText = $('ttsReadText');
  var voiceSel = $('ttsVoiceSelect'), speedSlow = $('ttsSpeedSlow');
  if (!speakBtn || !readText) return;

  var ttsState = { active: false, recognition: null, listening: false };
  var tutStart = $('ttsTutorStart'), tutStop = $('ttsTutorStop');
  var tutStatus = $('ttsTutorStatus'), tutTranscript = $('ttsTutorTranscript');
  var tutorHistory = [];

  function pickVoice(utter) {
    var slow = speedSlow && speedSlow.checked;
    utter.rate = slow ? 0.82 : 1.0;
    utter.pitch = 1.0;
    var desired = voiceSel ? voiceSel.value : '';
    if (!desired || !window.speechSynthesis) return;
    var voices = window.speechSynthesis.getVoices();
    if (desired === '__en') { var en = voices.find(v => /^en/i.test(v.lang)) || voices[0]; if (en) utter.voice = en; }
    else { var v = voices.find(x => x.name === desired); if (v) utter.voice = v; }
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) { showToast('Text-to-speech is not supported in this browser'); return; }
    window.speechSynthesis.cancel();
    var utter = new SpeechSynthesisUtterance(text);
    pickVoice(utter);
    window.speechSynthesis.speak(utter);
  }

  if (voiceSel) {
    if (window.speechSynthesis) {
      var fillVoices = function() {
        var voices = window.speechSynthesis.getVoices();
        voiceSel.innerHTML = '<option value="">Auto</option><option value="__en">English (any)</option>' + voices.map(function(v) { return '<option value="' + escapeHtml(v.name) + '">' + escapeHtml(v.name) + ' (' + escapeHtml(v.lang) + ')</option>'; }).join('');
      };
      fillVoices();
      window.speechSynthesis.addEventListener('voiceschanged', fillVoices);
    }
  }

  speakBtn.addEventListener('click', function() {
    var text = (readText.value || '').trim();
    if (!text) { showToast('Type or paste some text first.'); readText.focus(); return; }
    speak(text);
  });
  if (stopBtn) stopBtn.addEventListener('click', function() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    showToast('Speech stopped');
  });
  if (readText) readText.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); speakBtn.click(); }
  });

  // ---- Voice Tutor: AI asks questions aloud, student answers by voice ----
  var hasSpeech = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  if (!tutStart || !tutStop || !tutStatus || !tutTranscript) return;

  function setTutorStatus(txt) {
    tutStatus.textContent = txt;
    tutStatus.className = 'call-status ' + (ttsState.active ? 'active' : 'idle');
  }
  function tutorLog(html) {
    tutTranscript.innerHTML += html;
    tutTranscript.scrollTop = tutTranscript.scrollHeight;
  }
  function startListening() {
    if (!hasSpeech) { tutorLog('<div class="call-bubble ai"><strong>Tutor:</strong> Speech recognition is not available in this browser, so please type your answer in the box below instead.</div>'); return; }
    ttsState.listening = true;
    setTutorStatus('Listening... speak your answer');
    ttsState.recognition.start();
  }
  function stopListening() {
    ttsState.listening = false;
    if (ttsState.recognition) { try { ttsState.recognition.stop(); } catch (e) {} }
  }

  tutStart.addEventListener('click', function() {
    ttsState.active = true;
    tutStart.style.display = 'none';
    tutStop.style.display = '';
    tutorHistory = [];
    tutTranscript.innerHTML = '<p class="subtle">Press and speak your first answer, or press the button. The tutor guides you by voice.</p>';
    if (hasSpeech) {
      var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      ttsState.recognition = new SR();
      ttsState.recognition.lang = (voiceSel && voiceSel.value && voiceSel.value !== '__en') ? 'en-US' : 'en-US';
      ttsState.recognition.continuous = false;
      ttsState.recognition.interimResults = false;
      ttsState.recognition.onresult = function(e) {
        var t = e.results[0][0].transcript;
        tutorLog('<div class="call-bubble user"><strong>You:</strong> ' + escapeHtml(t) + '</div>');
        handleTutorReply(t);
      };
      ttsState.recognition.onend = function() { ttsState.listening = false; setTutorStatus('Waiting...'); };
      ttsState.recognition.onerror = function(e) {
        setTutorStatus('Speech error: ' + e.error + '. Press the button to try again.');
        if (e.error !== 'no-speech' && ttsState.active) stopListening();
      };
    }
    startListening();
  });

  tutStop.addEventListener('click', function() {
    ttsState.active = false;
    stopListening();
    tutStart.style.display = '';
    tutStop.style.display = 'none';
    setTutorStatus('Session ended.');
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    showToast('Voice tutor session ended');
  });

  async function handleTutorReply(text) {
    setTutorStatus('Thinking...');
    var messages = [{ role: 'system', content: 'You are a voice Socratic tutor for a student who may be blind. The student answers questions by voice. ALWAYS do these things: (1) Speak clearly and use short, simple sentences. (2) Guide and teach — ask what they already know, give hints, never just do their work. (3) END your reply with exactly ONE new spoken question they can answer. (4) Keep every reply under 80 words. You are a friendly, patient teacher.' }, { role: 'user', content: 'The student said: "' + text + '". Ask them the next question or guide them forward.' }];
    if (tutorHistory.length) messages = [{ role: 'system', content: messages[0].content }, ...tutorHistory.slice(-4), { role: 'user', content: 'The student said: "' + text + '". Guide them and ask the next question.' }];
    tutorHistory.push({ role: 'user', content: text });
    try {
      var resp = await groqChat(messages, { maxTokens: 300, temperature: 0.7 });
      tutorHistory.push({ role: 'assistant', content: resp });
      tutorLog('<div class="call-bubble ai"><strong>Tutor:</strong> ' + escapeHtml(resp) + '</div>');
      speak(resp);
      setTutorStatus('Speaking... then listening');
      setTimeout(function() {
        if (!ttsState.active) return;
        setTutorStatus('Listening...');
        startListening();
      }, 2200);
    } catch (err) {
      setTutorStatus('Sorry, I could not reach the AI. Please try again.');
      tutorLog('<div class="call-bubble ai"><strong>Tutor:</strong> Sorry, I could not reach the AI. Please try again.</div>');
      logErrors('voiceTutor')(err);
      setTimeout(function() { if (ttsState.active) startListening(); }, 1500);
    }
  }
}

async function analyzeVoiceConversation(targetLang, transcriptEl, analysisEl, exercisesEl) {
  if (!voiceConversation.history.length) {
    if (analysisEl) analysisEl.innerHTML = '<p class="subtle">No conversation to analyze.</p>';
    return;
  }
  try {
    const userMessages = voiceConversation.history.filter(m => m.role === 'user').map(m => m.content).join('\n');
    const prompt = `Analyze this ${targetLang} language practice conversation. Provide:
1. GRAMMAR: List grammar mistakes with corrections
2. VOCABULARY: Suggest better word choices
3. STRENGTHS: What the learner did well
4. STUDY_FOCUS: 3 specific topics the learner should practice
5. EXERCISES: Create 5 practice exercises targeting the weaknesses found

User's messages:
${userMessages}

Format: Use clear sections with headers. Be encouraging but specific.`;
    const analysis = await groqChat([{ role: 'system', content: 'You are a language tutor providing detailed post-conversation analysis.' }, { role: 'user', content: prompt }], { maxTokens: 2048 });
    if (analysisEl) {
      analysisEl.innerHTML = `<h4><span class="icon icon-sm icon-chart"></span> Conversation Analysis</h4><div class="analysis-content">${escapeHtml(analysis).replace(/\n/g, '<br>')}</div>`;
    }
    voiceConversation.currentAnalysis = analysis;
    // Generate exercises from analysis
    const exercisePrompt = `Based on this analysis of a ${targetLang} language learner, create 5 practice exercises:
${analysis}

For each exercise: give the question, expected answer, and which skill it targets.
Format each as: EXERCISE: [question] | ANSWER: [answer] | SKILL: [skill]`;
    const exercises = await groqChat([{ role: 'system', content: 'You create targeted language exercises.' }, { role: 'user', content: exercisePrompt }], { maxTokens: 1536 });
    if (exercisesEl) {
      const items = exercises.split('\n').filter(l => l.startsWith('EXERCISE:')).map(e => {
        const parts = e.split('|');
        return `<div class="exercise-item"><p><strong>${escapeHtml(parts[0].replace('EXERCISE:','').trim())}</strong></p>${parts[1] ? `<p class="subtle">${escapeHtml(parts[1].replace('ANSWER:','').trim())}</p>` : ''}${parts[2] ? `<span class="badge">${escapeHtml(parts[2].replace('SKILL:','').trim())}</span>` : ''}</div>`;
      }).join('');
      exercisesEl.innerHTML = `<h4><span class="icon icon-sm icon-note"></span> Practice Exercises</h4>${items || '<p class="subtle">Could not generate exercises.</p>'}`;
    }
    voiceConversation.exercises = exercises;
    saveState();
  } catch (e) {
    if (analysisEl) analysisEl.innerHTML = '<p class="subtle">Analysis generation failed. Try again.</p>';
  }
  const statusEl = $('voiceConvStatus');
    if (statusEl) { statusEl.textContent = 'Call ended — analysis complete'; statusEl.className = 'call-status ended'; }
}

// ===== LECTURE RECORDING =====
let lectureRecorder = { mediaRecorder: null, chunks: [], recordings: [], stream: null, consented: false };

function setupLectureRecording() {
  const consentCheck = $('lectureConsentCheck');
  const consentBtn = $('lectureConsentBtn');
  const recordBtn = $('lectureRecordBtn');
  const stopBtn = $('lectureStopBtn');
  const saveList = $('lectureSavedList');
  const generateBtn = $('lectureGenerateBtn');

  if (!recordBtn) return;

  // Load saved recordings from state
  lectureRecorder.recordings = state.lectureRecordings || [];
  renderSavedLectures();

  // Consent flow
  if (consentBtn) {
    consentBtn.addEventListener('click', () => {
      if (consentCheck && !consentCheck.checked) {
        showToast('Please check the consent box first');
        return;
      }
      lectureRecorder.consented = true;
      consentBtn.disabled = true;
      if (consentBtn) consentBtn.textContent = '✅ Consent Given';
      recordBtn.disabled = false;
      showToast('Teacher consent recorded — you may now record');
    });
  }

  recordBtn.addEventListener('click', async () => {
    if (!lectureRecorder.consented) { showToast('Teacher consent required first'); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      lectureRecorder.stream = stream;
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4'
        : 'audio/mpeg';
      const mr = new MediaRecorder(stream, { mimeType });
      lectureRecorder.mediaRecorder = mr;
      lectureRecorder.chunks = [];
      mr.ondataavailable = e => { if (e.data.size > 0) lectureRecorder.chunks.push(e.data); };
      mr.onstop = async () => {
        const blob = new Blob(lectureRecorder.chunks, { type: mimeType });
        const id = uid();
        // Convert blob to base64 data URL for persistence
        const dataUrl = await new Promise(resolve => {
          const r = new FileReader();
          r.onload = () => resolve(r.result);
          r.readAsDataURL(blob);
        });
        const recording = { id, title: `Lecture ${lectureRecorder.recordings.length + 1}`, date: todayStr(), dataUrl, blobSize: blob.size, mimeType, transcriptGenerated: false, exercisesGenerated: false };
        lectureRecorder.recordings.push(recording);
        state.lectureRecordings = lectureRecorder.recordings;
        saveState();
        renderSavedLectures();
        showToast('Lecture recorded and saved');
        if (lectureRecorder.stream) { lectureRecorder.stream.getTracks().forEach(t => t.stop()); }
      };
      mr.start();
      recordBtn.style.display = 'none';
      stopBtn.style.display = '';
      showToast('Recording lecture...');
    } catch (e) {
      showToast('Microphone access denied');
    }
  });

  stopBtn.addEventListener('click', () => {
    if (lectureRecorder.mediaRecorder && lectureRecorder.mediaRecorder.state !== 'inactive') {
      lectureRecorder.mediaRecorder.stop();
    }
    recordBtn.style.display = '';
    stopBtn.style.display = 'none';
  });

  if (generateBtn) {
    generateBtn.addEventListener('click', async () => {
      const lastRec = lectureRecorder.recordings[lectureRecorder.recordings.length - 1];
      if (!lastRec) { showToast('No recordings to generate from'); return; }
      if (lastRec.exercisesGenerated) { showToast('Exercises already generated for this lecture'); return; }
      showToast('Generating exercises from lecture recording...');
      // Use Groq to generate exercises based on the lecture title/date (audio transcription would need Whisper API)
      const prompt = `Create 10 practice exercises based on a lecture titled "${lastRec.title}" recorded on ${lastRec.date}. Include: 5 recall questions, 3 application questions, 2 analysis questions. Provide answers for each.`;
      try {
        const result = await groqChat([{ role: 'system', content: 'You create educational exercises from lecture content.' }, { role: 'user', content: prompt }], { maxTokens: 2048 });
        lastRec.exercisesGenerated = true;
        lastRec.exercises = result;
        state.lectureRecordings = lectureRecorder.recordings;
        saveState();
        renderSavedLectures();
        showToast('Exercises generated! Check the lecture details.');
      } catch (e) { showToast('Failed to generate exercises'); }
    });
  }
}

function renderSavedLectures() {
  const el = $('lectureSavedList');
  if (!el) return;
  el.innerHTML = '';
  if (!lectureRecorder.recordings.length) { el.innerHTML = '<p class="subtle">No recorded lectures yet.</p>'; return; }
  lectureRecorder.recordings.slice().reverse().forEach(r => {
    const d = document.createElement('div');
    d.className = 'lecture-item';
    const srcUrl = r.dataUrl || r.blobUrl || '';
    const exercisesHtml = r.exercises
      ? escapeHtml(r.exercises).replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')
      : '';
    d.innerHTML = `
      <div class="lecture-header"><strong>${escapeHtml(r.title)}</strong> <span class="badge">${r.date}</span></div>
      <div class="lecture-actions">
        ${srcUrl ? `<audio controls src="${srcUrl}" style="width:100%;height:36px"></audio>` : '<p class="subtle">Audio unavailable</p>'}
        <div class="inline wrap top-gap">
          ${r.exercises ? `<button class="ghost small" onclick="alert('Exercises:\\n\\n' + \`${exercisesHtml.replace(/`/g, '\\`')}\`)"><span class="icon icon-sm icon-note"></span> View Exercises</button>` : '<span class="subtle">No exercises yet</span>'}
          <button class="ghost small danger" onclick="deleteLecture('${r.id}')">Delete</button>
        </div>
      </div>
    `;
    el.appendChild(d);
  });
}
function deleteLecture(id) {
  lectureRecorder.recordings = lectureRecorder.recordings.filter(r => r.id !== id);
  state.lectureRecordings = lectureRecorder.recordings;
  saveState();
  renderSavedLectures();
}

// ===== GOOGLE APPS CONNECTION =====
let googleAuth = { connected: false, accessToken: null, scope: '' };

function setupGoogleConnection() {
  const connectBtn = document.getElementById('googleConnectBtn');
  const disconnectBtn = document.getElementById('googleDisconnectBtn');
  const statusEl = document.getElementById('googleStatus');
  const scopeChecks = qsa('input[name="google-scope"]');

  if (!connectBtn) return;

  // Pull the OAuth client ID from the serverless config (keeps it out of settings code)
  let googleClientId = '';
  (async function() {
    try {
      const r = await fetch('/api/config', { method: 'GET' });
      if (r.ok) {
        const cfg = await r.json();
        googleClientId = cfg.google && cfg.google.clientId ? cfg.google.clientId : '';
      }
    } catch (e) { logErrors('googleConfig')(e); }
  })();

  connectBtn.addEventListener('click', () => {
    // Build scope from checked checkboxes
    const scopes = [];
    scopeChecks.forEach(c => { if (c.checked) scopes.push(c.value); });
    if (!scopes.length) { showToast('Select at least one service'); return; }
    googleAuth.scope = scopes.join(' ');
    const clientId = state.settings.googleClientId || googleClientId || '';
    if (!clientId) {
      showToast('Google OAuth is not configured yet. Set GOOGLE_CLIENT_ID in Vercel env (see Settings → API & Integrations).');
      return;
    }
    const redirectUri = window.location.origin + '/oauth2callback.html';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(googleAuth.scope)}&prompt=consent`;
    window.open(authUrl, 'google-oauth', 'width=600,height=700');
    showToast('OAuth window opened');
  });

  disconnectBtn.addEventListener('click', () => {
    googleAuth.connected = false;
    googleAuth.accessToken = null;
    googleAuth.scope = '';
    updateGoogleUI();
    showToast('Google disconnected');
  });

  // Listen for OAuth response via postMessage from the callback page
  window.addEventListener('message', e => {
    if (e.origin !== window.location.origin) return;
    if (e.data && e.data.type === 'google-oauth' && e.data.accessToken) {
      googleAuth.accessToken = e.data.accessToken;
      googleAuth.connected = true;
      updateGoogleUI();
      showToast('Google connected successfully!');
    }
  });
}

function updateGoogleUI() {
  const connectBtn = document.getElementById('googleConnectBtn');
  const disconnectBtn = document.getElementById('googleDisconnectBtn');
  const statusEl = document.getElementById('googleStatus');
  if (connectBtn) connectBtn.style.display = googleAuth.connected ? 'none' : '';
  if (disconnectBtn) disconnectBtn.style.display = googleAuth.connected ? '' : 'none';
  if (statusEl) {
    if (googleAuth.connected) {
      statusEl.innerHTML = `<span class="badge" style="background:#065f46">✅ Connected</span> Scopes: ${googleAuth.scope}`;
    } else {
      statusEl.innerHTML = `<span class="badge">Not connected</span>`;
    }
  }
}

async function fetchGoogleClassroom() {
  if (!googleAuth.connected || !googleAuth.accessToken) { showToast('Connect Google first'); return; }
  try {
    const res = await fetch('https://classroom.googleapis.com/v1/courses', {
      headers: { 'Authorization': `Bearer ${googleAuth.accessToken}` }
    });
    const data = await res.json();
    if (data.courses) {
      data.courses.forEach(c => {
        state.assignments.push({ id: uid(), title: c.name, subject: 'Classroom', due: todayStr(), weight: 5, earned: null, max: 100, createdAt: todayStr(), source: 'google-classroom' });
      });
      saveState();
      renderAssignments();
      showToast(`Imported ${data.courses.length} courses from Google Classroom`);
    }
  } catch (e) { showToast('Failed to fetch Google Classroom data'); }
}

async function fetchGoogleCalendar() {
  if (!googleAuth.connected || !googleAuth.accessToken) { showToast('Connect Google first'); return; }
  try {
    const now = new Date();
    const min = now.toISOString();
    const max = new Date(now.getTime() + 90 * 86400000).toISOString();
    const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${min}&timeMax=${max}&orderBy=startTime&singleEvents=true`, {
      headers: { 'Authorization': `Bearer ${googleAuth.accessToken}` }
    });
    const data = await res.json();
    if (data.items) {
      data.items.forEach(e => {
        if (e.summary && e.start?.date) {
          state.calendarEvents.push({ id: uid(), title: e.summary, date: e.start.date, source: 'google-calendar', description: e.description || '' });
        }
      });
      saveState();
      if (typeof renderCalendar === 'function') renderCalendar();
      showToast(`Imported ${data.items.length} events from Google Calendar`);
    }
  } catch (e) { showToast('Failed to fetch Google Calendar data'); }
}

// ===== INIT =====
function init() {
  try {
  loadState();
  initJudgeBanner();
  initializeLearningStyle();
  applyLanguage();
  updateStreakXP();
  if (typeof Mobile !== 'undefined') {
    Mobile.init().then(() => {
      try { Mobile.addMobileStyles(); } catch(_) {}
      try { Mobile.createMobileNav(); } catch(_) {}
      try { Mobile.setupSwipeNavigation(); } catch(_) {}
    });
  }
  var hd = $('headerDate');
  if (hd) hd.textContent = formatDate(new Date());
  qsa('.nav-btn').forEach(b => b.addEventListener('click', () => showTab(b.dataset.tab)));
  applyTheme();
  if (!state.profile.setupComplete) {
    setTimeout(showSetupModal, 300);
  }
  safeCall(renderDashboard);
  safeCall(setupPlanner);
  safeCall(setupTimer);
  safeCall(setupFlashcards);
  safeCall(setupQuizzes);
  safeCall(setupRecalls);
  safeCall(setupNotes);
  safeCall(setupAssignments);
  safeCall(setupCoach);
  safeCall(setupSmartAI);
  safeCall(setupAITutor);
  safeCall(renderPeerActivityFeed);
  safeCall(renderWeeklyLeaderboard);
  safeCall(renderImpactMetrics);
  safeCall(initMobileMenu);
  safeCall(setupAiLessons);
  safeCall(setupSubjects);
  safeCall(setupAnalytics);
  safeCall(setupSettings);
  safeCall(setupMusicPlayer);
  safeCall(setupPlaylists);
  safeCall(enhanceMusicTrackList);
  safeCall(setupCalendar);
  safeCall(setupSocial);
  safeCall(setupLearningTools);
  safeCall(setupVoiceConversation);
  safeCall(setupPracticeCoach);
  safeCall(setupTextToSpeech);
  safeCall(setupLectureRecording);
  safeCall(setupGoogleConnection);
  safeCall(setupGlobalShortcuts);
  safeCall(setupWarmup);
  safeCall(setupStudyGuide);
  safeCall(setupExpandChat);
  safeCall(setupCalculator);
  safeCall(setupTutorial);
  safeCall(setupAutismSupport);
  safeCall(setupPeerTutoring);
  safeCall(setupGenerators);
  safeCall(setupLearningStyle);
  safeCall(setupSampleLesson);
  var qf = $('quickFocusBtn');
  if (qf) qf.addEventListener('click', () => {
    showTab('sessions');
    var fm = $('focusMinutes');
    if (fm) fm.value = 25;
    var sp = $('startPauseTimerBtn');
    if (sp) sp.click();
  });
  var sd = $('seedDataBtn');
  if (sd) sd.addEventListener('click', loadDemoData);
  // Debug overlay only opens when explicitly requested via ?debug=1.
  // The 'd'/'D' keyboard shortcuts and the mobile auto-open were removed so
  // the letter 'd' can be typed normally in inputs and diagnostics no longer
  // hijack user input.
  if (window.__DEBUG) setTimeout(openDebugOverlay, 1200);
  // Landing overlay + PWA install
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferredPrompt = e;
    const ib = $('installPwaBtn');
    if (ib) ib.style.display = '';
  });
  const homeBtn = $('homeBtn');
  if (homeBtn) homeBtn.addEventListener('click', () => {
    const ov = $('landingOverlay');
    if (ov) ov.classList.remove('hidden');
  });
  const lc = $('landingClose');
  if (lc) lc.addEventListener('click', () => { const ov = $('landingOverlay'); if (ov) ov.classList.add('hidden'); });
  const loa = $('landingOpenApp');
  if (loa) loa.addEventListener('click', () => { const ov = $('landingOverlay'); if (ov) ov.classList.add('hidden'); });
  const ipb = $('installPwaBtn');
  if (ipb) {
    ipb.style.display = (deferredPrompt ? '' : 'none');
    ipb.addEventListener('click', async () => {
      if (deferredPrompt) { deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; ipb.style.display = 'none'; }
      else if (navigator && navigator.share) {
        try { await navigator.share({ title: 'Study Hub', text: 'Install Study Hub on your device', url: window.location.origin }); } catch (e) { showToast('Use your browser menu → Add to Home Screen'); }
      } else { showToast('Use your browser menu → Add to Home Screen'); }
    });
  }
  showTab('dashboard');
  if (typeof initializeCloudSystem === 'function') {
    initializeCloudSystem().catch(logErrors('initializeCloudSystem'));
  }
  } catch(e) {
    if (typeof console !== 'undefined') console.error('init() error:', e);
  }
}

// ===== EXPANDABLE CHAT =====
function setupExpandChat() {
  qsa('.expand-chat-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var chat = this.closest('.card') || this.parentElement.nextElementSibling;
      if (chat) {
        if (chat.classList.contains('chat-history')) {
          chat.classList.toggle('expanded');
          this.textContent = chat.classList.contains('expanded') ? '-' : '+';
        } else {
          var history = chat.querySelector('.chat-history');
          if (history) { history.classList.toggle('expanded'); this.textContent = history.classList.contains('expanded') ? '-' : '+'; }
        }
      }
    });
  });
}

// ===== WARM UP — BRAIN TRAINING =====
var warmupState = { game: 'math', score: 0, streak: 0, totalTime: 0, problems: [], current: 0, startTime: 0 };

function setupWarmup() {
  var tab = $('warmup');
  if (!tab) return;

  warmupState.score = 0; warmupState.streak = 0; warmupState.totalTime = 0; warmupState.current = 0; warmupState.problems = []; warmupState.startTime = 0;

  qsa('.warmup-tab-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      qsa('.warmup-tab-btn').forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');
      warmupState.game = this.dataset.game;
      warmupState.score = 0; warmupState.streak = 0; warmupState.totalTime = 0;
      warmupState.current = 0; warmupState.problems = [];
      updateWarmupStats();
      startWarmupGame();
    });
  });
  startWarmupGame();
}

function startWarmupGame() {
  var area = $('warmupContent');
  var result = $('warmupResult');
  if (!area) return;
  if (result) { result.classList.add('hidden'); result.className = 'warmup-result hidden'; }
  warmupState.current = 0;
  warmupState.problems = [];
  warmupState.startTime = Date.now();

  var game = warmupState.game;
  if (game === 'math') generateMathProblems();
  else if (game === 'memory') generateMemorySequence();
  else if (game === 'speed') generateSpeedRead();
  showWarmupCurrent();
}

function generateMathProblems() {
  warmupState.problems = [];
  for (var i = 0; i < 10; i++) {
    var a = Math.floor(Math.random() * 50) + 10;
    var b = Math.floor(Math.random() * 40) + 5;
    var op = ['+', '-'][Math.floor(Math.random() * 2)];
    if (op === '-' && a < b) { var t = a; a = b; b = t; }
    var ans = op === '+' ? a + b : a - b;
    warmupState.problems.push({ a: a, b: b, op: op, answer: ans });
  }
}

function generateMemorySequence() {
  warmupState.problems = [];
  var len = Math.min(4 + Math.floor(warmupState.streak / 3), 8);
  for (var i = 0; i < 5; i++) {
    var seq = [];
    for (var j = 0; j < len; j++) seq.push(Math.floor(Math.random() * 10));
    warmupState.problems.push({ sequence: seq, answer: seq.join('') });
  }
}

function generateSpeedRead() {
  warmupState.problems = [
    { text: 'The human brain processes visual information 60,000 times faster than text. Reading aloud uses different neural pathways than silent reading, engaging both the Broca\'s area and Wernicke\'s area simultaneously.', question: 'How much faster does the brain process visual information compared to text?', answer: '60000' },
    { text: 'The Pomodoro Technique was developed by Francesco Cirillo in the late 1980s. The technique uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks of 5 minutes.', question: 'Who developed the Pomodoro Technique?', answer: 'Francesco Cirillo' },
    { text: 'Spaced repetition is a learning technique that incorporates increasing intervals of time between subsequent reviews of previously learned material. It exploits the psychological spacing effect to improve long-term memory retention.', question: 'What psychological effect does spaced repetition exploit?', answer: 'spacing effect' },
    { text: 'The hippocampus is critical for memory formation. During sleep, the hippocampus replays the day\'s experiences, transferring them to the neocortex for long-term storage. This is why sleep is essential for learning.', question: 'Where does the hippocampus transfer memories during sleep?', answer: 'neocortex' }
  ];
}

function showWarmupCurrent() {
  var area = $('warmupContent');
  if (!area) return;
  var p = warmupState.problems[warmupState.current];
  if (!p) { finishWarmup(); return; }
  var game = warmupState.game;

  if (game === 'math') {
    area.innerHTML =
      '<h3>Math Sprint</h3>' +
      '<p class="subtle">Problem ' + (warmupState.current + 1) + ' of ' + warmupState.problems.length + '</p>' +
      '<div class="warmup-problem">' + p.a + ' ' + p.op + ' ' + p.b + ' = ?</div>' +
      '<input type="number" id="warmupAnswer" placeholder="?" autofocus />';
    var inp = $('warmupAnswer');
    if (inp) {
      inp.focus();
      inp.addEventListener('keydown', function handler(e) {
        if (e.key === 'Enter') {
          checkWarmupAnswer(+this.value, p.answer);
          this.removeEventListener('keydown', handler);
        }
      });
    }
  } else if (game === 'memory') {
    var seq = p.sequence.join(' ');
    area.innerHTML =
      '<h3>Memory Sprint</h3>' +
      '<p class="subtle">Remember this sequence:</p>' +
      '<div class="warmup-seq-display" id="seqDisplay">' + seq + '</div>' +
      '<p class="subtle" id="seqTimer"></p>';
      setTimeout(function() {
        var d2 = $('seqDisplay');
        if (d2) d2.innerHTML = '<span class="icon icon-sm icon-gear"></span>';
        area.innerHTML +=
          '<p class="subtle" style="margin-top:8px">Now enter the sequence:</p>' +
          '<input class="warmup-seq-input" id="warmupSeqAnswer" placeholder="e.g. 1234" autofocus />';
        var inp2 = $('warmupSeqAnswer');
        if (inp2) {
          inp2.focus();
          inp2.addEventListener('keydown', function handler2(e) {
            if (e.key === 'Enter') { checkWarmupAnswer(this.value, p.answer); this.removeEventListener('keydown', handler2); }
          });
        }
      }, 2000);
  } else if (game === 'speed') {
    area.innerHTML =
      '<h3>Speed Reader</h3>' +
      '<p class="subtle">Read this passage carefully, then answer a question.</p>' +
      '<div class="warmup-text">' + p.text + '</div>' +
      '<button class="warmup-done-btn" id="warmupDoneRead">I\'m done reading →</button>';
    var doneBtn = $('warmupDoneRead');
    if (doneBtn) {
      doneBtn.addEventListener('click', function() {
        area.innerHTML =
          '<h3>Quick Check</h3>' +
          '<p class="subtle">' + p.question + '</p>' +
          '<input id="warmupSpeedAnswer" placeholder="Your answer..." autofocus />';
        var inp3 = $('warmupSpeedAnswer');
        if (inp3) {
          inp3.focus();
          inp3.addEventListener('keydown', function handler3(e) {
            if (e.key === 'Enter') { checkWarmupAnswer(this.value.toLowerCase().trim(), p.answer.toLowerCase()); this.removeEventListener('keydown', handler3); }
          });
        }
      });
    }
  }
}

function checkWarmupAnswer(userAns, correctAns) {
  var result = $('warmupResult');
  if (!result) return;
  result.classList.remove('hidden');
  var isCorrect = String(userAns).trim() === String(correctAns).trim();
  var elapsed = (Date.now() - warmupState.startTime) / 1000;

  if (isCorrect) {
    result.className = 'warmup-result correct';
    result.textContent = '✓ Correct! (' + elapsed.toFixed(1) + 's)';
    warmupState.score++;
    warmupState.streak++;
  } else {
    result.className = 'warmup-result wrong';
    result.textContent = '✗ Oops! The answer was ' + correctAns;
    warmupState.streak = 0;
  }
  warmupState.totalTime += elapsed;
  updateWarmupStats();

  warmupState.current++;
  if (warmupState.current >= warmupState.problems.length) {
    setTimeout(finishWarmup, 800);
  } else {
    warmupState.startTime = Date.now();
    setTimeout(showWarmupCurrent, 800);
  }
}

function finishWarmup() {
  var area = $('warmupContent');
  var result = $('warmupResult');
  if (!area) return;
  var total = warmupState.problems.length;
  var pct = total > 0 ? Math.round(warmupState.score / total * 100) : 0;
  var avgTime = warmupState.score > 0 ? (warmupState.totalTime / warmupState.score) : 0;
  var grade = pct >= 80 ? 'Outstanding!' : pct >= 60 ? 'Good effort!' : pct >= 40 ? 'Keep practicing!' : 'Try again!';

  area.innerHTML =
    '<h3>Session Complete!</h3>' +
    '<div class="warmup-result done">' + grade + '</div>' +
    '<div style="margin-top:16px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px;text-align:center">' +
      '<div><div style="font-size:2rem;font-weight:800">' + warmupState.score + '/' + total + '</div><span class="subtle">Correct</span></div>' +
      '<div><div style="font-size:2rem;font-weight:800">' + pct + '%</div><span class="subtle">Accuracy</span></div>' +
      '<div><div style="font-size:2rem;font-weight:800">' + avgTime.toFixed(1) + 's</div><span class="subtle">Avg Time</span></div>' +
    '</div>' +
    '<button class="top-gap" id="warmupPlayAgain">Play Again</button>';
  var playBtn = $('warmupPlayAgain');
  if (playBtn) playBtn.addEventListener('click', function() {
    warmupState.score = 0; warmupState.streak = 0; warmupState.totalTime = 0;
    warmupState.current = 0; warmupState.problems = [];
    updateWarmupStats();
    startWarmupGame();
  });
  if (result) result.classList.add('hidden');

  // Update stats persistence
  var ws = state.settings.warmupStats || { bestStreak: 0, totalGames: 0, totalCorrect: 0 };
  ws.totalGames = (ws.totalGames || 0) + 1;
  ws.totalCorrect = (ws.totalCorrect || 0) + warmupState.score;
  if (warmupState.streak > (ws.bestStreak || 0)) ws.bestStreak = warmupState.streak;
  state.settings.warmupStats = ws;
  saveState();
}

function updateWarmupStats() {
  var sEl = $('warmupScore'); if (sEl) sEl.textContent = warmupState.score;
  var stEl = $('warmupStreak'); if (stEl) stEl.textContent = warmupState.streak;
  var avgEl = $('warmupAvg');
  if (avgEl) avgEl.textContent = warmupState.score > 0 ? (warmupState.totalTime / warmupState.score).toFixed(0) + 's' : '0s';
}

// ===== STUDY GUIDE & PLANNER GENERATOR =====
function setupStudyGuide() {
  var sgForm = $('studyGuideForm');
  var spForm = $('studyPlannerForm');
  if (sgForm) sgForm.addEventListener('submit', function(e) {
    e.preventDefault();
    generateStudyGuide();
  });
  if (spForm) spForm.addEventListener('submit', function(e) {
    e.preventDefault();
    generateStudyPlan();
  });
}

function generateStudyGuide() {
  var topic = $('sgTopic'); var depth = $('sgDepth'); var subject = $('sgSubject');
  var loading = $('sgLoading'); var output = $('sgOutput');
  if (!topic || !loading || !output) return;
  var t = topic.value.trim(); var d = depth ? depth.value : 'standard';
  var sub = subject ? subject.value : '';
  if (!t) { showToast('Please enter a topic'); return; }

  loading.classList.remove('hidden');
  output.classList.add('hidden');
  output.innerHTML = '';

  var depthDesc = d === 'quick' ? 'a quick overview' : d === 'deep' ? 'a comprehensive deep dive' : 'a standard study guide';
  var subHint = sub ? ' in ' + sub : '';
  var prompt = 'Create ' + depthDesc + ' for the topic "' + t + '"' + subHint + '. Format it nicely with:\n' +
    '- A brief overview paragraph\n' +
    '- 4-6 key concepts (each with a keyword styled with **bold** and a short explanation)\n' +
    '- A detailed explanation section with subsections\n' +
    '- Important formulas, dates, or vocabulary (if relevant)\n' +
    '- 3-5 practice questions with answers\n' +
    '- Study tips for this topic\n' +
    'Use markdown formatting. Keep it educational and well-structured.';

  callGroq(prompt).then(function(text) {
    loading.classList.add('hidden');
    output.classList.remove('hidden');
    output.innerHTML = formatStudyGuide(text, topic.value);
  }).catch(function(err) {
    loading.classList.add('hidden');
    output.classList.remove('hidden');
    output.innerHTML = '<p class="subtle">Failed to generate. Check your API key and try again.</p><p style="color:var(--danger)">' + escapeHtml(String(err)) + '</p>';
  });
}

function generateStudyPlan() {
  var subject = $('spSubject'); var topic = $('spTopic'); var days = $('spDays'); var hours = $('spHours'); var intensity = $('spIntensity');
  var loading = $('spLoading'); var output = $('spOutput');
  if (!subject || !loading || !output) return;
  var s = subject.value.trim(); var t = topic ? topic.value.trim() : '';
  var d = days ? parseInt(days.value) || 7 : 7;
  var h = hours ? parseFloat(hours.value) || 1 : 1;
  var i = intensity ? intensity.value : 'moderate';
  if (!s) { showToast('Please enter a subject or exam'); return; }
  state.settings._ach = state.settings._ach || { goalsCompleted:0, earlyTasks:0, studyPlansGenerated:0, reflectionsCount:0 };
  state.settings._ach.studyPlansGenerated = (state.settings._ach.studyPlansGenerated||0) + 1;

  loading.classList.remove('hidden');
  output.classList.add('hidden');
  output.innerHTML = '';

  var intensityDesc = i === 'light' ? 'light (flexible schedule, 60% review / 40% new material)' : i === 'intense' ? 'intense and rigorous' : 'moderate (balanced review and new material)';
  var topicHint = t ? ' covering topics: ' + t : '';
  var prompt = 'Create a ' + d + '-day study plan for "' + s + '"' + topicHint + '. Each day should have approx ' + h + ' hour(s) of study. Intensity: ' + intensityDesc + '.\n\n' +
    'Format as:\n' +
    '**Day 1: [title]**\n' +
    '- Focus area / topics to cover\n' +
    '- Specific activities (reading, practice problems, review, flashcards)\n' +
    '- Estimated time breakdown\n\n' +
    'Continue for all ' + d + ' days. Also include a final summary with tips for success.\n' +
    'Make it specific and actionable. Use markdown.';

  callGroq(prompt).then(function(text) {
    loading.classList.add('hidden');
    output.classList.remove('hidden');
    output.innerHTML = formatStudyPlan(text, s, d);
  }).catch(function(err) {
    loading.classList.add('hidden');
    output.classList.remove('hidden');
    output.innerHTML = '<p class="subtle">Failed to generate. Check your API key and try again.</p><p style="color:var(--danger)">' + escapeHtml(String(err)) + '</p>';
  });
}

function formatStudyGuide(text, topic) {
  var lines = text.split('\n');
  var html = '<h3><span class="icon icon-sm icon-note"></span> Study Guide: ' + escapeHtml(topic) + '</h3>';
  var inSection = false;

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (!line.trim()) { if (inSection) { html += '</div>'; inSection = false; } html += '<br>'; continue; }

    // Headers
    if (line.startsWith('### ')) {
      if (inSection) { html += '</div>'; inSection = false; }
      html += '<h4>' + escapeHtml(line.replace('### ', '')) + '</h4>';
    } else if (line.startsWith('## ')) {
      if (inSection) { html += '</div>'; inSection = false; }
      html += '<h3>' + escapeHtml(line.replace('## ', '')) + '</h3>';
    } else if (line.startsWith('# ')) {
      if (inSection) { html += '</div>'; inSection = false; }
      html += '<h3>' + escapeHtml(line.replace('# ', '')) + '</h3>';
    }
    // Lists
    else if (line.match(/^[-*]\s/)) {
      var item = line.replace(/^[-*]\s/, '');
      html += '<li>' + formatInline(item) + '</li>';
    } else if (line.match(/^\d+[.)]\s/)) {
      var item2 = line.replace(/^\d+[.)]\s/, '');
      html += '<li>' + formatInline(item2) + '</li>';
    }
    // Section wrapper
    else if (line.toLowerCase().includes('key concept') || line.toLowerCase().includes('overview') || line.toLowerCase().includes('introduction') || line.toLowerCase().includes('tips') || line.toLowerCase().includes('question')) {
      if (inSection) { html += '</div>'; inSection = false; }
      html += '<div class="sg-section">';
      inSection = true;
      html += '<p>' + formatInline(line) + '</p>';
    } else {
      html += '<p>' + formatInline(line) + '</p>';
    }
  }
  if (inSection) html += '</div>';
  return html;
}

function formatStudyPlan(text, subject, days) {
  var lines = text.split('\n');
  var html = '<h3><span class="icon icon-sm icon-cal"></span> Study Plan: ' + escapeHtml(subject) + ' (' + days + ' days)</h3>';

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (!line.trim()) { html += '<br>'; continue; }

    if (line.startsWith('### ') || line.startsWith('## ') || line.startsWith('#')) {
      html += '<h3>' + escapeHtml(line.replace(/^#+\s/, '')) + '</h3>';
    } else if (line.match(/^\*?\*?Day\s+\d+/i)) {
      var dayMatch = line.match(/Day\s+(\d+)/i);
      var dayNum = dayMatch ? dayMatch[1] : '';
      var rest = line.replace(/^\*?\*?Day\s+\d+.*?[:\-]\s*/i, '');
      html += '<div class="sg-planner-day"><strong>Day ' + dayNum + '</strong><p>' + formatInline(rest || line) + '</p></div>';
    } else if (line.match(/^[-*]\s/)) {
      html += '<li>' + formatInline(line.replace(/^[-*]\s/, '')) + '</li>';
    } else if (line.match(/^\d+[.)]\s/)) {
      html += '<li>' + formatInline(line.replace(/^\d+[.)]\s/, '')) + '</li>';
    } else {
      html += '<p>' + formatInline(line) + '</p>';
    }
  }
  return html;
}

function formatInline(text) {
  text = escapeHtml(text);
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  text = text.replace(/`(.+?)`/g, '<code style="background:var(--accent-soft);padding:2px 6px;border-radius:4px;font-size:0.85em">$1</code>');
  return text;
}

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ===== PEER TUTORING =====
function setupPeerTutoring() {
  var active = 'same-age';
  qsa('.peer-method').forEach(function(btn) {
    btn.addEventListener('click', function() {
      qsa('.peer-method').forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');
      active = this.dataset.method;
      state.settings.peerMethod = active;
      saveState();
      showToast('Peer method: ' + this.textContent.trim().replace(/\s+small.*/, ''));
    });
  });
  if (state.settings.peerMethod) {
    var saved = qs('.peer-method[data-method="' + state.settings.peerMethod + '"]');
    if (saved) { qsa('.peer-method').forEach(function(b) { b.classList.remove('active'); }); saved.classList.add('active'); }
  }
}

function getPeerTutoringPrompt() {
  var method = state.settings.peerMethod || 'same-age';
  var prompts = {
    'same-age': 'You are a peer tutor at the same academic level as the student. Explain concepts as a knowledgeable classmate would. Use relatable examples and casual but correct language. Ask guiding questions.',
    'cross-age': 'You are an older student mentor. Teach with patience and mentorship. Break down complex ideas into simple steps. Share study strategies and meta-learning tips. Be encouraging and supportive.',
    'reciprocal': 'Use a reciprocal teaching approach. First explain a concept, then ask the student to explain it back in their own words. Take turns being the teacher. Ask "Can you teach this back to me?" frequently.',
    'classwide': 'Use a structured classwide teaching approach. Present material clearly step by step. Use consistent formatting. Give clear instructions. Assume the student is part of a group learning session and use inclusive language.',
    'socratic': 'Use the Socratic method. Do not give direct answers. Instead, ask thoughtful questions that lead the student to discover the answer themselves. Challenge assumptions and guide critical thinking.'
  };
  return prompts[method] || prompts['same-age'];
}

// ===== CALCULATOR =====
function setupCalculator() {
  var display = $('calcBasicDisplay');
  var sciDisplay = $('calcSciDisplay');
  var expr = '', sciExpr = '';

  qsa('#calcBasic .calc-btn').forEach(function(b) {
    b.addEventListener('click', function() {
      var v = this.dataset.v;
      if (v === 'C') { expr = ''; updateDisp(); return; }
      if (v === '=') { expr = evalExpr(expr); updateDisp(); return; }
      expr += v; updateDisp();
    });
  });
  qsa('#calcScientific .calc-btn').forEach(function(b) {
    b.addEventListener('click', function() {
      var v = this.dataset.v;
      if (v === 'C') { sciExpr = ''; updateSciDisp(); return; }
      if (v === '=') { sciExpr = evalExpr(sciExpr); updateSciDisp(); return; }
      sciExpr += v; updateSciDisp();
    });
  });
  function updateDisp() { if (display) display.value = expr || '0'; }
  function updateSciDisp() { if (sciDisplay) sciDisplay.value = sciExpr || '0'; }

  // Mode switching
  qsa('.calc-mode-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      qsa('.calc-mode-btn').forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');
      var mode = this.dataset.mode;
      qsa('.calc-panel').forEach(function(p) { p.classList.add('hidden'); });
      var panel = $('calc' + mode.charAt(0).toUpperCase() + mode.slice(1));
      if (panel) panel.classList.remove('hidden');
      if (mode === 'graphing') setTimeout(setupGraphingCalculator, 50);
      if (mode === 'converter') setupConverter();
    });
  });

  // Graphing
  function setupGraphingCalculator() {
    var canvas = $('graphCanvas');
    if (!canvas) return;
    var cam = { cx: 0, cy: 0, scale: 40 };
    function graphPxX(x) { return canvas.clientWidth / 2 + (x - cam.cx) * cam.scale; }
    function graphPxY(y) { return canvas.clientHeight / 2 - (y - cam.cy) * cam.scale; }
    function plot() {
      var ctx = canvas.getContext('2d');
      var W = canvas.clientWidth, H = canvas.clientHeight;
      if (!W) W = 600;
      if (!H) H = 440;
      canvas.width = W * 2; canvas.height = H * 2;
      ctx.setTransform(2, 0, 0, 2, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
      var gridOn = ($('graphGrid') ? $('graphGrid').value : 'on') === 'on';
      var lineColor = ($('graphColor') ? $('graphColor').value : '#0f766e');
      var lineWidth = parseInt(($('graphLineWidth') ? $('graphLineWidth').value : '2'));
      var step = 20;
      while (cam.scale * step < 16) step *= 5;
      while (cam.scale * step > 80) step /= 5;
      step = Math.max(1, Math.round(step));
      // Grid
      if (gridOn) {
        ctx.strokeStyle = '#e8e8e8'; ctx.lineWidth = 0.5;
        for (var gx = graphPxX(Math.floor((cam.cx - W / 2 / cam.scale) / step) * step); gx <= W; gx += cam.scale * step) {
          if (gx < 0) continue;
          ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
        }
        for (var gy = graphPxY(Math.floor((cam.cy - H / 2 / cam.scale) / step) * step); gy <= H; gy += cam.scale * step) {
          if (gy < 0) continue;
          ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
        }
      }
      // Axes
      var cx = graphPxX(0), cy = graphPxY(0);
      ctx.strokeStyle = '#444'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
      // Tick labels
      ctx.fillStyle = '#555'; ctx.font = '10px sans-serif';
      var t0x = Math.floor((cam.cx - W / 2 / cam.scale) / step) * step;
      for (var tx = t0x; graphPxX(tx) <= W; tx += step) {
        if (tx === 0) continue;
        ctx.fillText(tx, graphPxX(tx) + 3, cy + 12);
      }
      var t0y = Math.floor((cam.cy - H / 2 / cam.scale) / step) * step;
      for (var ty = t0y; graphPxY(ty) <= H; ty += step) {
        if (ty === 0) continue;
        ctx.fillText(ty, cx + 3, graphPxY(ty) - 3);
      }

      // Plot function
      var fnText = ($('graphFnInput') ? $('graphFnInput').value : 'x^2') || 'x^2';
      try {
        var compiled = new Function('x', 'with(Math){return ' + fnText.replace(/\^/g, '**').replace(/\bpi\b/g, 'Math.PI').replace(/\be\b/g, 'Math.E') + '}');
        ctx.strokeStyle = lineColor; ctx.lineWidth = lineWidth;
        ctx.beginPath(); var started = false;
        var xMin = cam.cx - W / 2 / cam.scale, xMax = cam.cx + W / 2 / cam.scale;
        var N = Math.min(1200, Math.max(400, Math.round(W)));
        for (var i = 0; i <= N; i++) {
          var x = xMin + (xMax - xMin) * i / N;
          var y;
          try { y = compiled(x); } catch (e) { started = false; continue; }
          if (typeof y !== 'number' || !isFinite(y)) { started = false; continue; }
          var px2 = graphPxX(x), py2 = graphPxY(y);
          if (py2 < -4000 || py2 > H + 4000) { started = false; continue; }
          if (!started) { ctx.moveTo(px2, py2); started = true; } else { ctx.lineTo(px2, py2); }
        }
        ctx.stroke();
        // Fill readout
        var ro = $('graphReadout');
        if (ro) ro.textContent = 'x: [' + xMin.toFixed(1) + ', ' + xMax.toFixed(1) + ']  y: [' + (cam.cy - H / 2 / cam.scale).toFixed(1) + ', ' + (cam.cy + H / 2 / cam.scale).toFixed(1) + ']';
      } catch (e) {
        ctx.fillStyle = '#dc2626'; ctx.fillText('Invalid function', 10, 20);
      }
    }
    var plotBtn = $('graphPlotBtn');
    if (plotBtn) plotBtn.addEventListener('click', plot);
    var inp = $('graphFnInput');
    if (inp) inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') plot(); });
    ['graphZoomIn', 'graphZoomOut', 'graphReset', 'graphPanUp', 'graphPanDown', 'graphPanLeft', 'graphPanRight'].forEach(function(id) {
      var b = $(id);
      if (!b) return;
      b.addEventListener('click', function() {
        if (id === 'graphZoomIn') cam.scale = Math.min(400, cam.scale * 1.5);
        else if (id === 'graphZoomOut') cam.scale = Math.max(4, cam.scale / 1.5);
        else if (id === 'graphReset') { cam.cx = 0; cam.cy = 0; cam.scale = 40; }
        else if (id === 'graphPanUp') cam.cy += H_step();
        else if (id === 'graphPanDown') cam.cy -= H_step();
        else if (id === 'graphPanLeft') cam.cx -= W_step();
        else if (id === 'graphPanRight') cam.cx += W_step();
        plot();
      });
    });
    function W_step() { return canvas.clientWidth / 4 / cam.scale; }
    function H_step() { return canvas.clientHeight / 4 / cam.scale; }
    setTimeout(plot, 100);
  }

  // Converter
  function setupConverter() {
    var convData = {
      Length: { units: ['mm','cm','m','km','in','ft','yd','mi'], toBase: {mm:0.001,cm:0.01,m:1,km:1000,in:0.0254,ft:0.3048,yd:0.9144,mi:1609.344} },
      Mass: { units: ['mg','g','kg','oz','lb'], toBase: {mg:0.000001,g:0.001,kg:1,oz:0.0283495,lb:0.453592} },
      Temperature: { units: ['°C','°F','K'], special: true },
      Volume: { units: ['mL','L','gal','qt','pt','cup','fl oz'], toBase: {mL:0.001,L:1,gal:3.78541,qt:0.946353,pt:0.473176,cup:0.236588,'fl oz':0.0295735} },
      Area: { units: ['mm²','cm²','m²','km²','in²','ft²','ac','ha'], toBase: {'mm²':0.000001,'cm²':0.0001,'m²':1,'km²':1000000,'in²':0.00064516,'ft²':0.092903,'ac':4046.86,'ha':10000} },
      Speed: { units: ['m/s','km/h','mph','kn','ft/s'], toBase: {'m/s':1,'km/h':0.277778,'mph':0.44704,'kn':0.514444,'ft/s':0.3048} }
    };
    var catSel = $('convCategory'), fromUnit = $('convFromUnit'), toUnit = $('convToUnit');
    var fromInp = $('convFrom'), toInp = $('convTo'), swapBtn = $('convSwap');
    if (!catSel) return;

    function populateUnits() {
      var cat = convData[catSel.value];
      if (!cat) return;
      fromUnit.innerHTML = ''; toUnit.innerHTML = '';
      cat.units.forEach(function(u) {
        fromUnit.innerHTML += '<option>' + u + '</option>';
        toUnit.innerHTML += '<option>' + u + '</option>';
      });
      toUnit.value = cat.units[1] || cat.units[0];
      convert();
    }

    function convert() {
      var cat = convData[catSel.value];
      var val = parseFloat(fromInp.value) || 0;
      var from = fromUnit.value, to = toUnit.value;
      if (cat.special) {
        // Temperature
        if (from === '°C' && to === '°F') toInp.value = (val * 9/5 + 32).toFixed(2);
        else if (from === '°F' && to === '°C') toInp.value = ((val - 32) * 5/9).toFixed(2);
        else if (from === '°C' && to === 'K') toInp.value = (val + 273.15).toFixed(2);
        else if (from === 'K' && to === '°C') toInp.value = (val - 273.15).toFixed(2);
        else if (from === '°F' && to === 'K') toInp.value = ((val - 32) * 5/9 + 273.15).toFixed(2);
        else if (from === 'K' && to === '°F') toInp.value = ((val - 273.15) * 9/5 + 32).toFixed(2);
        else toInp.value = val;
      } else {
        var baseVal = val * (cat.toBase[from] || 1);
        toInp.value = (baseVal / (cat.toBase[to] || 1)).toFixed(6).replace(/\.?0+$/, '');
      }
    }

    catSel.addEventListener('change', populateUnits);
    fromInp.addEventListener('input', convert);
    fromUnit.addEventListener('change', convert);
    toUnit.addEventListener('change', convert);
    if (swapBtn) swapBtn.addEventListener('click', function() {
      var t = fromUnit.value; fromUnit.value = toUnit.value; toUnit.value = t;
      var tv = fromInp.value; fromInp.value = toInp.value; toInp.value = tv;
      convert();
    });
    populateUnits();

    // Custom expr eval
    var evalBtn = $('convEval'), exprInp = $('convCustomExpr'), resEl = $('convResult');
    if (evalBtn && exprInp && resEl) {
      evalBtn.addEventListener('click', function() {
        try { resEl.textContent = '= ' + evalExpr(exprInp.value); }
        catch(e) { resEl.textContent = 'Error'; }
      });
      exprInp.addEventListener('keydown', function(e) { if (e.key === 'Enter') evalBtn.click(); });
    }
  }
}

function evalExpr(expr) {
  try {
    var e = expr.replace(/\u00d7/g, '*').replace(/\u00f7/g, '/').replace(/\u2212/g, '-');
    e = e.replace(/\^/g, '**');
    e = e.replace(/sqrt\(/g, 'Math.sqrt(');
    e = e.replace(/sin\(/g, 'Math.sin(');
    e = e.replace(/cos\(/g, 'Math.cos(');
    e = e.replace(/tan\(/g, 'Math.tan(');
    e = e.replace(/log\(/g, 'Math.log10(');
    e = e.replace(/ln\(/g, 'Math.log(');
    e = e.replace(/pi/g, 'Math.PI');
    e = e.replace(/\be\b(?!\s*\()/g, 'Math.E');
    e = e.replace(/abs\(/g, 'Math.abs(');
    e = e.replace(/!\)/, ')'); // factorial placeholder
    return String(Function('"use strict"; return (' + e + ')')());
  } catch(e) { return 'Error'; }
}

// ===== TUTORIAL =====
function setupTutorial() {
  // Static content — no dynamic JS needed beyond tab switching
}

// ===== AUTISM SUPPORT =====
var scripts = {
  classroom: [
    { role: 'Teacher', text: 'Can someone explain the main idea of this paragraph?', hint: 'Try: "I think the main idea is..." or ask for clarification.' },
    { role: 'Student', text: "I don't understand question 3.", hint: 'Try: "Could you please explain question 3 again?"' },
    { role: 'Teacher', text: 'What did you learn from today\'s lesson?', hint: 'Share one thing you learned. It\'s okay if it\'s small.' }
  ],
  group: [
    { role: 'Student A', text: 'What part of the project should we work on first?', hint: 'Try: "I think we should start with..." or ask what others think.' },
    { role: 'Student B', text: "I disagree with that idea.", hint: 'Try: "I see it differently because..." or suggest an alternative.' },
    { role: 'Student C', text: 'Does everyone agree on this plan?', hint: 'You can say: "I agree" or "Can we change one thing?"' }
  ],
  teacher: [
    { role: 'You', text: "I need help with today's assignment.", hint: 'Try: "Excuse me, could you help me with..."' },
    { role: 'Teacher', text: 'Tell me what you understand so far.', hint: 'Explain what you know. It helps the teacher know where to start.' },
    { role: 'You', text: 'Can I have extra time to finish this?', hint: 'Try: "Could I have until [day] to complete this?"' }
  ],
  social: [
    { role: 'Friend', text: 'Hey, want to sit with us at lunch?', hint: 'Try: "Sure, thanks!" or "Thanks, maybe another time."' },
    { role: 'Friend', text: 'Did you see that movie? What did you think?', hint: 'Share your opinion. "I liked it because..." or "I haven\'t seen it yet."' },
    { role: 'You', text: 'Would you like to study together this weekend?', hint: 'Try: "Would you like to study together on Saturday?"' }
  ],
  advocacy: [
    { role: 'You', text: 'I learn better when instructions are written down.', hint: 'Try: "Could you please write the instructions on the board?"' },
    { role: 'You', text: 'The noise in this room is distracting me.', hint: 'Try: "Could I move to a quieter spot to focus?"' },
    { role: 'Teacher', text: 'Is there anything I can do to help you learn better?', hint: 'Share one thing that helps you. "It helps when..."' }
  ]
};

function setupAutismSupport() {
  var loadBtn = $('loadScriptBtn'), scriptArea = $('scriptArea');
  var scriptContent = $('scriptContent'), scriptResponse = $('scriptResponse');
  var scriptSubmit = $('scriptSubmitBtn'), scriptFeedback = $('scriptFeedback');
  var scriptCategory = $('scriptCategory');
  var currentScript = null, currentStep = 0;

  // ---- Visual support-level spectrum ----
  // Each level maps to a preset of the fine-grained toggles below.
  const SPECTRUM_PRESETS = [
    { clearLang: false, stepByStep: false, visual: false, predictable: false, rate: 'fast',   label: 'Independent' },
    { clearLang: true,  stepByStep: false, visual: false, predictable: false, rate: 'moderate', label: 'Light' },
    { clearLang: true,  stepByStep: true,  visual: true,  predictable: true,  rate: 'moderate', label: 'Moderate' },
    { clearLang: true,  stepByStep: true,  visual: true,  predictable: true,  rate: 'slow',    label: 'Strong' },
    { clearLang: true,  stepByStep: true,  visual: true,  predictable: true,  rate: 'slow',    label: 'Maximum' }
  ];
  var spectrumEl = $('autismSpectrum');
  var segs = spectrumEl ? qsa('.spectrum-seg', spectrumEl) : [];
  function setSpectrumLevel(level) {
    var preset = SPECTRUM_PRESETS[level] || SPECTRUM_PRESETS[2];
    state.settings.autismLevel = level;
    ['autismClearLang', 'autismStepByStep', 'autismVisual', 'autismPredictable'].forEach(function(id, i) {
      var el = $(id);
      if (el) el.checked = [preset.clearLang, preset.stepByStep, preset.visual, preset.predictable][i];
    });
    var rate = $('autismSpeechRate');
    if (rate) rate.value = preset.rate;
    segs.forEach(function(s, i) {
      var active = i <= level;
      s.classList.toggle('active', active);
      s.setAttribute('aria-checked', i === level ? 'true' : 'false');
    });
    if (spectrumEl) spectrumEl.style.setProperty('--level', level);
  }
  segs.forEach(function(s) {
    s.addEventListener('click', function() {
      setSpectrumLevel(+s.dataset.level);
      showToast('Support level: ' + (SPECTRUM_PRESETS[+s.dataset.level] || SPECTRUM_PRESETS[2]).label);
    });
  });
  // Sync spectrum highlight when the user toggles individual checkboxes
  function syncSpectrumFromCheckboxes() {
    var cl = $('autismClearLang'), sb = $('autismStepByStep'), vs = $('autismVisual'), pd = $('autismPredictable');
    if (!cl || !sb || !vs || !pd) return;
    var level = 0;
    if (cl.checked) level = Math.max(level, 1);
    if (cl.checked && sb.checked && vs.checked && pd.checked) level = state.settings.autismSpeechRate === 'slow' ? 3 : 2;
    if (level >= 2 && state.settings.autismSpeechRate === 'slow') level = 3;
    state.settings.autismLevel = level;
    segs.forEach(function(s, i) {
      var active = i <= level;
      s.classList.toggle('active', active);
      s.setAttribute('aria-checked', i === level ? 'true' : 'false');
    });
  }
  ['autismClearLang', 'autismStepByStep', 'autismVisual', 'autismPredictable', 'autismSpeechRate'].forEach(function(id) {
    var el = $(id);
    if (el) el.addEventListener('change', syncSpectrumFromCheckboxes);
  });
  if (spectrumEl) setSpectrumLevel(state.settings.autismLevel != null ? state.settings.autismLevel : 2);

  if (loadBtn && scriptArea) {
    loadBtn.addEventListener('click', function() {
      var cat = scriptCategory ? scriptCategory.value : 'classroom';
      currentScript = scripts[cat] || scripts.classroom;
      currentStep = 0;
      scriptArea.classList.remove('hidden');
      showScriptStep();
    });
  }

  var scriptTopic = $('scriptTopic'), generateBtn = $('scriptGenerateBtn');
  if (generateBtn && scriptTopic && scriptArea) {
    generateBtn.addEventListener('click', function() {
      if (!scriptTopic.value.trim()) {
        showToast('Type a topic to practice first.');
        scriptTopic.focus();
        return;
      }
      var topic = scriptTopic.value.trim();
      generateBtn.disabled = true;
      var originalTxt = generateBtn.textContent;
      generateBtn.textContent = 'Generating...';
      var sys = 'Create a short role-play conversation to practice the topic below. Return EXACTLY 4 lines. Each line on its own line, format: ROLE|spoken line|short hint. Roles alternate between "You" and a real conversation partner for this situation. Use clear, literal language and simple sentences.';
      groqChat([{ role: 'system', content: sys }, { role: 'user', content: 'Topic: ' + topic }], { maxTokens: 1024, temperature: 0.7 }).then(function(txt) {
        var steps = parseGeneratedScript(txt);
        if (!steps || steps.length < 2) throw new Error('bad script');
        currentScript = steps;
        currentStep = 0;
        scriptArea.classList.remove('hidden');
        if (scriptResponse) scriptResponse.value = '';
        showScriptStep();
        showToast('AI script generated for: ' + topic);
      }).catch(function() {
        showToast('Could not generate a script. Please try again.');
      }).finally(function() {
        generateBtn.disabled = false;
        generateBtn.textContent = originalTxt;
      });
    });
    scriptTopic.addEventListener('keydown', function(e) { if (e.key === 'Enter') generateBtn.click(); });
  }

  var scriptCustomBtn = $('scriptCustomBtn'), scriptCustomLines = $('scriptCustomLines');
  if (scriptCustomBtn && scriptCustomLines && scriptArea) {
    scriptCustomBtn.addEventListener('click', function() {
      var raw = scriptCustomLines.value.trim();
      if (!raw) { showToast('Type or paste your lines first.'); scriptCustomLines.focus(); return; }
      var lines = raw.split(/\r?\n/).map(function(l) { return l.trim(); }).filter(Boolean);
      if (lines.length < 2) { showToast('Add at least two lines so the trainer can go back and forth.'); return; }
      var steps = [];
      for (var i = 0; i < lines.length; i++) {
        var isPartner = i % 2 === 1;
        steps.push({ role: isPartner ? 'Partner' : 'You', text: lines[i], hint: 'This is one of your own script lines. Practice reading it out loud, then wait for the next line.' });
      }
      currentScript = steps;
      currentStep = 0;
      scriptArea.classList.remove('hidden');
      if (scriptResponse) scriptResponse.value = '';
      showScriptStep();
      showToast('Practicing your script — ' + steps.length + ' lines');
    });
  }

  function parseGeneratedScript(txt) {
    var output = [];
    txt.split(/\r?\n/).forEach(function(line) {
      line = (line || '').trim();
      if (!line) return;
      var parts = line.split('|').map(function(s) { return s ? s.trim() : ''; });
      if (parts.length < 2) return;
      output.push({ role: parts[0] || 'You', text: parts[1], hint: parts[2] || 'Respond naturally in a polite, clear way.' });
    });
    return output.length >= 2 ? output : null;
  }

  function showScriptStep() {
    if (!currentScript || currentStep >= currentScript.length) {
      if (scriptContent) scriptContent.innerHTML = '<p>✅ Great job! You completed this script. <button id="resetScriptBtn" class="ghost">Practice Again</button></p>';
      if (scriptResponse) scriptResponse.value = '';
      if (scriptFeedback) { scriptFeedback.className = 'script-feedback subtle top-gap'; scriptFeedback.textContent = ''; }
      var resetBtn = $('resetScriptBtn');
      if (resetBtn) resetBtn.addEventListener('click', function() { currentStep = 0; showScriptStep(); });
      if (scriptSubmit) scriptSubmit.disabled = true;
      return;
    }
    var s = currentScript[currentStep];
    if (scriptContent) scriptContent.innerHTML = '<p><strong>' + s.role + ':</strong> "' + s.text + '"</p><p class="subtle" style="margin-top:8px"><span class="icon icon-sm icon-brain" style="display:inline-flex;vertical-align:middle;margin-right:4px"></span> ' + s.hint + '</p>';
    if (scriptResponse) { scriptResponse.value = ''; scriptResponse.placeholder = 'Your response as ' + (s.role === 'You' ? 'you' : 'the student') + '...'; }
    if (scriptFeedback) { scriptFeedback.className = 'script-feedback subtle top-gap'; scriptFeedback.textContent = ''; }
    if (scriptSubmit) scriptSubmit.disabled = false;
  }

  if (scriptSubmit && scriptResponse) {
    scriptSubmit.addEventListener('click', function() {
      var ans = scriptResponse.value.trim();
      if (!ans) { showToast('Please type your response first.'); return; }
      var isGood = ans.length > 10;
      if (scriptFeedback) {
        scriptFeedback.className = 'script-feedback ' + (isGood ? 'good' : 'try-again') + ' top-gap';
        scriptFeedback.textContent = isGood ? 'Good response! You showed great communication.' : 'Good try! Try being more specific in your response.';
      }
      if (isGood) {
        currentStep++;
        setTimeout(showScriptStep, 1200);
      }
    });
    scriptResponse.addEventListener('keydown', function(e) { if (e.key === 'Enter') scriptSubmit.click(); });
  }

  // Save prefs
  var savePrefs = $('saveAutismPrefs');
  if (savePrefs) {
    $('autismClearLang').checked = state.settings.autismClearLang !== false;
    $('autismStepByStep').checked = state.settings.autismStepByStep !== false;
    $('autismVisual').checked = state.settings.autismVisual !== false;
    $('autismPredictable').checked = state.settings.autismPredictable !== false;
    if ($('autismSpeechRate')) $('autismSpeechRate').value = state.settings.autismSpeechRate || 'moderate';
    savePrefs.addEventListener('click', function() {
      state.settings.autismClearLang = $('autismClearLang').checked;
      state.settings.autismStepByStep = $('autismStepByStep').checked;
      state.settings.autismVisual = $('autismVisual').checked;
      state.settings.autismPredictable = $('autismPredictable').checked;
      state.settings.autismSpeechRate = $('autismSpeechRate').value;
      saveState();
      showToast('Autism support preferences saved');
    });
  }

  // Adaptive AI chat
  var aiSend = $('autismAiSend'), aiInput = $('autismAiInput'), aiChat = $('autismAiChat');
  if (aiSend && aiInput && aiChat) {
    aiSend.addEventListener('click', function() {
      var q = aiInput.value.trim();
      if (!q) return;
      aiInput.value = '';
      aiChat.innerHTML += '<div class="chat-bubble user">' + escapeHtml(q) + '</div>';
      callGroq(buildAutismCoachPrompt(q)).then(function(text) {
        aiChat.innerHTML += '<div class="chat-bubble ai">' + formatInline(text) + '</div>';
        aiChat.scrollTop = aiChat.scrollHeight;
      }).catch(function(err) {
        aiChat.innerHTML += '<div class="chat-bubble ai">Sorry, I had trouble responding. Please try again.</div>';
      });
    });
    aiInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') aiSend.click(); });
  }
}

// Builds the instruction prompt for the adaptive autism AI coach.
// It always reflects on HOW the student said something (tone, clarity,
// appropriate wording) and adapts to the selected support spectrum level.
function buildAutismCoachPrompt(studentMessage) {
  var level = state.settings.autismLevel != null ? state.settings.autismLevel : 2;
  var prefs = '';
  prefs += ' You are the student\'s personal communication coach and tutor.';
  prefs += ' FIRST reflect on what the student just wrote: notice their tone, word choice and clarity.';
  prefs += ' If they used a strong, rude or inappropriate word, gently name that specific word and offer ONE better, kinder alternative that says the same thing.';
  prefs += ' If their message was unclear or could be misunderstood, rephrase it for them in ONE clear, polite sentence and explain why that works better.';
  prefs += ' If their message was clear and appropriate, say so briefly and acknowledge what they did well.';
  prefs += ' THEN answer their actual question or need.';

  // Adapt the coaching + answering style to the spectrum level
  if (level <= 1) {
    prefs += ' Keep feedback light and natural, like a supportive friend.';
  }
  if (level === 2) {
    prefs += ' Give feedback and answers in a clear, structured way: 1-2 short paragraphs or short bullet points.';
  }
  if (level === 3) {
    prefs += ' Use a very structured format: start with a heading-like sentence, then numbered or bulleted steps. Use short, simple sentences.';
    prefs += ' Before answering, check understanding in one simple line.';
  }
  if (level >= 4) {
    prefs += ' Use the simplest possible language. Keep sentences very short.';
    prefs += ' Always use numbered steps and bullet points.';
    prefs += ' Give an explicit example sentence the student could use in real life.';
    prefs += ' Explain everything calmly and at a slow, measured pace.';
  }

  if (state.settings.autismClearLang !== false) prefs += ' Use clear, literal language. Avoid idioms and sarcasm.';
  if (state.settings.autismStepByStep !== false) prefs += ' Break down explanations step by step.';
  if (state.settings.autismPredictable !== false) prefs += ' Use consistent structure and predictable formatting.';
  var rate = state.settings.autismSpeechRate || 'moderate';
  if (rate === 'slow') prefs += ' Explain at a calm, measured pace.';
  prefs += ' Be patient, encouraging, and specific.';
  prefs += ' End with ONE simple follow-up question or a suggestion for what to say next.';
  var adhd = state.settings.adhdMode ? ' Keep the response very short and concise.' : '';
  return prefs + adhd + '\n\nThe student wrote: "' + studentMessage + '"';
}

// ===== ADHD MODE HELPER =====
function adhdShorten(text) {
  if (!state.settings.adhdMode) return text;
  // Shorten by keeping only the first paragraph and summarizing
  var parts = text.split('\n\n');
  if (parts.length <= 1) {
    var sentences = text.split(/(?<=[.!?])\s+/);
    if (sentences.length > 3) return sentences.slice(0, 3).join(' ') + ' [...]';
    return text;
  }
  return parts[0] + '\n\n[...]';
}

function callGroq(prompt) {
  return groqChat([{ role: 'user', content: prompt }], { model: 'llama-3.3-70b-versatile', maxTokens: 2048 });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ===== CREATIVE GENERATORS =====
function setupGenerators() {
  // ---- Interactive Mind Map (with explanations and more interactiveness) ----
  var mapBtn = $('genMapBtn'), mapTopic = $('genMapTopic'), mapCanvas = $('genMapCanvas');
  var addNodeBtn = $('genMapAddNode'), resetBtn = $('genMapReset'), mapExplanation = $('genMapExplanation');
  var mm = { nodes: [], edges: [], dragging: null, offsetX: 0, offsetY: 0, selectedNode: null };

  function mapColors(i) {
    var palette = ['#0f766e', '#0b5cab', '#e6a700', '#8b5cf6', '#dc2626', '#059669', '#d97706', '#2563eb'];
    return palette[i % palette.length];
  }
  function addMapNode(id, label, x, y, depth) {
    var n = { id: id, label: label, x: x, y: y, depth: depth === undefined ? 0 : depth };
    mm.nodes.push(n);
    return n;
  }

  function renderMindMap() {
    if (!mapCanvas) return;
    if (!mm.nodes.length) {
      mapCanvas.innerHTML = '<p class="subtle" id="genMapHint">Enter a topic and press Generate.</p>';
      if (mapExplanation) mapExplanation.textContent = '';
      return;
    }
    mapCanvas.style.position = 'relative';
    mapCanvas.style.overflow = 'auto';
    mapCanvas.innerHTML = '';
    var seen = {};
    mm.edges.forEach(function(e) {
      if (seen[e.from + e.to]) return;
      seen[e.from + e.to] = 1;
      var a = mm.nodes.find(n => n.id === e.from), b = mm.nodes.find(n => n.id === e.to);
      if (!a || !b) return;
      var line = document.createElement('div');
      line.className = 'gen-map-edge';
      line.style.cssText = 'position:absolute;height:2px;background:#94a3b8;opacity:.6;transform-origin:left center;z-index:1;pointer-events:none;';
      positionEdge(line, a, b);
      mapCanvas.appendChild(line);
    });
    mm.nodes.forEach(function(n) {
      var nodeEl = document.createElement('div');
      nodeEl.className = 'gen-map-node';
      nodeEl.dataset.id = n.id;
      nodeEl.style.cssText = 'position:absolute;left:' + n.x + 'px;top:' + n.y + 'px;';
      var depth = n.depth || 0;
      var c = depth === 0 ? 'var(--accent)' : mapColors(depth - 1);
      nodeEl.style.background = depth === 0 ? c : 'color-mix(in srgb, ' + c + ' 12%, var(--panel))';
      nodeEl.style.border = '2px solid ' + c;
      nodeEl.style.borderRadius = depth === 0 ? '18px' : (depth === 1 ? '12px' : '10px');
      nodeEl.style.color = depth === 0 ? '#fff' : 'var(--ink)';
      var label = document.createElement('div');
      label.className = 'gen-map-label';
      label.textContent = n.label;
      nodeEl.appendChild(label);
      if (n.explanation) {
        var expl = document.createElement('div');
        expl.className = 'gen-map-explanation';
        expl.textContent = n.explanation;
        expl.style.display = 'none';
        nodeEl.appendChild(expl);
      }
      nodeEl.addEventListener('click', function(e) {
        if (e.target === expl || e.target.closest('.gen-map-explanation')) return;
        mm.selectedNode = n;
        mm.nodes.forEach(node => {
          var nodeEl2 = document.querySelector('.gen-map-node[data-id="' + node.id + '"]');
          if (nodeEl2) nodeEl2.classList.toggle('selected', node.id === n.id);
        });
        if (mapExplanation) {
          mapExplanation.textContent = n.explanation || 'No explanation for this node.';
        }
      });
      nodeEl.addEventListener('mouseenter', function() {
        if (n.explanation) {
          expl.style.display = 'block';
          expl.style.position = 'absolute';
          expl.style.top = '110%';
          expl.style.left = '0';
          expl.style.background = 'var(--panel)';
          expl.style.border = '1px solid var(--border)';
          expl.style.padding = '6px 10px';
          expl.style.borderRadius = '8px';
          expl.style.zIndex = '10';
          expl.style.maxWidth = '240px';
          expl.style.fontSize = '0.75rem';
          expl.style.color = 'var(--ink)';
        }
      });
      nodeEl.addEventListener('mouseleave', function() {
        if (expl) expl.style.display = 'none';
      });
      nodeEl.addEventListener('mousedown', startDrag.bind(null, n, nodeEl));
      nodeEl.addEventListener('touchstart', startDrag.bind(null, n, nodeEl));
      mapCanvas.appendChild(nodeEl);
    });
    mapCanvas.style.height = Math.max(360, (Math.max(...mm.nodes.map(n => n.y)) + 90)) + 'px';
    mapCanvas.style.width = Math.max(600, (Math.max(...mm.nodes.map(n => n.x)) + 220)) + 'px';
  }
  function positionEdge(line, a, b) {
    var ax = a.x + 80, ay = a.y + 16, bx = b.x + 80, by = b.y + 16;
    var dx = bx - ax, dy = by - ay;
    var len = Math.max(10, Math.sqrt(dx * dx + dy * dy));
    line.style.left = ax + 'px'; line.style.top = ay + 'px';
    line.style.width = len + 'px';
    line.style.transform = 'rotate(' + (Math.atan2(dy, dx) * 180 / Math.PI) + 'deg)';
  }
  function startDrag(n, el, e) {
    if (e.preventDefault) e.preventDefault();
    mm.dragging = { n: n, el: el };
    var rect = mapCanvas.getBoundingClientRect();
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    var clientY = e.touches ? e.touches[0].clientY : e.clientY;
    mm.offsetX = clientX - rect.left - n.x;
    mm.offsetY = clientY - rect.top - n.y;
  }
  function onDragMove(e) {
    if (!mm.dragging) return;
    var rect = mapCanvas.getBoundingClientRect();
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    var clientY = e.touches ? e.touches[0].clientY : e.clientY;
    mm.dragging.n.x = Math.max(0, clientX - rect.left - mm.offsetX);
    mm.dragging.n.y = Math.max(0, clientY - rect.top - mm.offsetY);
    mm.dragging.el.style.left = mm.dragging.n.x + 'px';
    mm.dragging.el.style.top = mm.dragging.n.y + 'px';
    renderMindMap();
  }
  function stopDrag() { mm.dragging = null; }
  document.addEventListener('mousemove', onDragMove);
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchmove', onDragMove, { passive: true });
  document.addEventListener('touchend', stopDrag);

  function parseMindMap(txt) {
    mm.nodes = []; mm.edges = [];
    var lines = txt.split('\n').map(l => l.trim()).filter(Boolean);
    var center = lines[0].replace(/^[-•*#\s]+/, '') || 'Concept';
    addMapNode('m0', center.slice(0, 30), 40, 40, 0);
    var stack = [{ depth: 0, parent: 'm0' }];
    var branch = 0;
    var branchGroups = {};
    lines.slice(1).forEach(function(raw) {
      var depth = 0;
      while (depth < raw.length && (raw[depth] === '-' || raw[depth] === '•' || raw[depth] === '*' || raw[depth] === '\t' || raw[depth] === ' ')) depth++;
      var label = raw.replace(/^[-•*#\s]+/, '').slice(0, 34);
      if (!label) return;
      branch++;
      var id = 'm' + branch;
      var parent = 'm0';
      for (var i = stack.length - 1; i >= 0; i--) { if (stack[i].depth < depth) { parent = stack[i].parent; break; } }
      stack.push({ depth: depth, parent: id });
      var px = mm.nodes.find(n => n.id === parent) || mm.nodes[0];
      // Radial layout: level-1 branches spread evenly around the center,
      // deeper levels fan out from their parent.
      if (depth === 1) {
        branchGroups[parent] = (branchGroups[parent] || 0);
        var total = lines.slice(1).filter(l => { var d = 0; while (d < l.length && (l[d] === '-' || l[d] === '•' || l[d] === '*' || l[d] === '\t' || l[d] === ' ')) d++; return d === 1; }).length || 1;
        var b1 = mm.nodes.filter(n => n.depth === 1).length;
        var angle = (b1 / total) * Math.PI * 2 - Math.PI / 2;
        var dist = 190;
        addMapNode(id, label, 40 + 140 + Math.round(Math.cos(angle) * dist), 40 + 100 + Math.round(Math.sin(angle) * dist), 1);
      } else {
        var parentAngle = Math.atan2(px.y - 140, px.x - 180);
        var childrenCount = 1;
        var childIndex = 0;
        var parentColor = mapColors(px.depth || 0);
        var ang = parentAngle + (childIndex - (childrenCount - 1) / 2) * 0.6;
        var d2 = 150 + depth * 40;
        addMapNode(id, label, px.x + Math.round(Math.cos(ang) * d2), px.y + Math.round(Math.sin(ang) * d2), depth);
        mm.edges.push({ from: parent, to: id });
      }
      if (depth === 1) mm.edges.push({ from: parent, to: id });
    });
    // Auto-fit canvas to drawn nodes
    var maxX = Math.max(...mm.nodes.map(n => n.x + 160), 700);
    var maxY = Math.max(...mm.nodes.map(n => n.y + 80), 380);
    mapCanvas.style.width = maxX + 'px';
    mapCanvas.style.height = maxY + 'px';
  }

  if (mapBtn && mapTopic && mapCanvas) {
    mapBtn.addEventListener('click', async function() {
      var topic = mapTopic.value.trim();
      if (!topic) { showToast('Enter a topic for the mind map.'); mapTopic.focus(); return; }
      mapCanvas.innerHTML = '<p class="subtle">Generating mind map...</p>';
      try {
        var txt = await groqChat([{ role: 'system', content: 'Create a text-based mind map for the topic. First line is the central idea, then indented branch lines starting with "-". Use 5-8 branches and 2-3 levels. Return ONLY the mind map.' }, { role: 'user', content: 'Topic: ' + topic }], { maxTokens: 1024, temperature: 0.6 });
        parseMindMap(txt);
        renderMindMap();
        showToast('Mind map generated — drag nodes to explore');
      } catch (err) {
        mapCanvas.innerHTML = '<p class="subtle">Could not generate the mind map. Please try again.</p>';
        logErrors('mindmap')(err);
      }
    });
  }
  if (addNodeBtn) addNodeBtn.addEventListener('click', function() {
    if (!mm.nodes.length) { showToast('Generate a mind map first.'); return; }
    var label = prompt('New branch label:');
    if (!label || !label.trim()) return;
    var parent = mm.nodes[mm.nodes.length - 1];
    addMapNode('m' + Date.now(), label.trim().slice(0, 34), parent.x + 130, parent.y + 50);
    mm.edges.push({ from: parent.id, to: 'm' + Date.now() });
    renderMindMap();
  });
  if (resetBtn) resetBtn.addEventListener('click', function() {
    mm.nodes = []; mm.edges = [];
    renderMindMap();
  });

  // ---- Film Generator (produces a real playable film) ----
  var filmBtn = $('genFilmBtn'), filmTopic = $('genFilmTopic'), filmOut = $('genFilmOut');
  var playerEl = $('filmPlayer'), frameImg = $('filmFrameImg'), narrationEl = $('filmNarration');
  var sceneLabelEl = $('filmSceneLabel'), filmPlay = $('filmPlay'), filmPrev = $('filmPrev'), filmNext = $('filmNext');
  var filmProgress = $('filmProgress');
  var filmScenes = [], filmIndex = 0, filmTimer = null, filmPlaying = false;
  function filmStopTimer() { if (filmTimer) { clearTimeout(filmTimer); filmTimer = null; } filmPlaying = false; if (filmPlay) filmPlay.textContent = '▶'; }
  function showFilmScene(i) {
    if (!filmScenes.length) return;
    i = Math.max(0, Math.min(filmScenes.length - 1, i));
    filmIndex = i;
    var scene = filmScenes[i];
    if (sceneLabelEl) sceneLabelEl.textContent = 'Scene ' + (i + 1) + ' of ' + filmScenes.length;
    if (narrationEl) narrationEl.textContent = scene.narration;
    if (frameImg) {
      frameImg.src = scene.img;
      frameImg.alt = scene.visual;
      frameImg.onerror = function() { this.src = scene.img.replace('width=800', 'width=800&seed=' + Math.floor(Math.random() * 1e5)); };
    }
    if (filmProgress) filmProgress.textContent = '• ' + (i + 1) + ' / ' + filmScenes.length + ' •';
    filmStopTimer();
    if (scene.seconds) {
      filmTimer = setTimeout(function() {
        if (filmIndex < filmScenes.length - 1) showFilmScene(filmIndex + 1);
        else { filmStopTimer(); }
      }, scene.seconds * 1000);
      filmPlaying = true;
      if (filmPlay) filmPlay.textContent = '❚❚';
    }
  }
  if (filmPlay) filmPlay.addEventListener('click', function() {
    if (!filmScenes.length) return;
    if (filmPlaying) { filmStopTimer(); }
    else { showFilmScene(filmIndex); }
  });
  if (filmPrev) filmPrev.addEventListener('click', function() { if (filmScenes.length) showFilmScene(filmIndex - 1); });
  if (filmNext) filmNext.addEventListener('click', function() { if (filmScenes.length) showFilmScene(filmIndex + 1); });
  function parseFilmScenes(txt) {
    // Accept either numbered SCENE blocks or a JSON list from the AI.
    try { var parsed = JSON.parse(txt); if (Array.isArray(parsed)) return parsed; } catch (e) {}
    var scenes = [];
    var blockRe = /(?:^|\n)(?:SCENE\s*\d*|Scene\s*\d*|###\s*Scene\s*\d*)\s*[:\-]?\s*\n?([\s\S]*?)(?=(?:SCENE\s*\d*|Scene\s*\d*|###\s*Scene\s*\d*)\s*[:\-]?\s*\n|$)/gi;
    var m;
    while ((m = blockRe.exec(txt)) !== null) {
      var body = m[1] || '';
      var narr = '', vis = '';
      var nm = body.match(/NARRATION\s*[:\-]\s*(.+)/i);
      var vm = body.match(/VISUAL\s*[:\-]\s*(.+)/i);
      if (nm) narr = nm[1].trim();
      if (vm) vis = vm[1].trim();
      if (!narr && !vis) narr = body.trim().split('\n')[0] || '';
      scenes.push({ narration: narr, visual: vis || narr, seconds: 4 });
    }
    // Fallback: split on numbered lines "1." / "•" paragraphs
    if (!scenes.length) {
      txt.split(/\n(?=\d{1,2}[.)]\s|•\s)/).forEach(function(p) {
        p = p.trim();
        if (!p) return;
        var clean = p.replace(/^NARRATION\s*[:\-]\s*/i, '');
        scenes.push({ narration: clean, visual: clean.slice(0, 90), seconds: 4 });
      });
    }
    return scenes;
  }
  if (filmBtn && filmTopic && filmOut && playerEl) {
    filmBtn.addEventListener('click', async function() {
      var topic = filmTopic.value.trim();
      if (!topic) { showToast('Enter a topic for the film.'); filmTopic.focus(); return; }
      filmOut.innerHTML = '<p class="subtle">Writing your film and creating visuals...</p>';
      playerEl.classList.add('hidden');
      try {
        var txt = await groqChat([{ role: 'system', content: 'You are a short-film director for students. Write a 4-scene educational micro-film that teaches one concept. Output ONLY lines in this exact format, one per scene:\nSCENE 1\nNARRATION: <one clear spoken sentence, vivid and simple>\nVISUAL: <a detailed visual to be drawn, e.g. "a plant cell with sunlight arrows entering chloroplasts" />\nSCENE 2\n... (continue). Keep each NARRATION to 1-2 short sentences. Make the VISUAL concrete and drawable.' }, { role: 'user', content: 'Concept to teach: ' + topic }], { maxTokens: 900, temperature: 0.8 });
        filmScenes = parseFilmScenes(txt);
        if (!filmScenes.length) { filmScenes = [{ narration: txt.trim(), visual: topic, seconds: 5 }]; }
        filmScenes.forEach(function(s) {
          var visualPrompt = 'educational film still of ' + topic + ' - ' + s.visual + ', cinematic, colorful, clean, textbook quality, labeled, 16:9';
          s.img = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(visualPrompt) + '?width=800&height=450&nologo=true';
        });
        var filmTitle = document.createElement('h4');
        filmTitle.innerHTML = '<span class="icon icon-sm icon-film"></span> ' + escapeHtml(topic);
        filmOut.innerHTML = '';
        filmOut.appendChild(filmTitle);
        var summary = document.createElement('p');
        summary.className = 'subtle';
        summary.textContent = filmScenes.length + ' scenes · press ▶ to play';
        filmOut.appendChild(summary);
        playerEl.classList.remove('hidden');
        showFilmScene(0);
      } catch (err) {
        filmOut.innerHTML = '<p class="subtle">Could not make the film. Please try again.</p>';
        logErrors('filmgen')(err);
      }
    });
  }

  // ---- Image Generator (real images from Wikimedia Commons — no AI, high quality) ----
  var imgBtn = $('genImgBtn'), imgTopic = $('genImgTopic'), imgOut = $('genImgOut');
  if (imgBtn && imgTopic && imgOut) {
    imgBtn.addEventListener('click', async function() {
      var topic = imgTopic.value.trim();
      if (!topic) { showToast('Describe the image you want.'); imgTopic.focus(); return; }
      imgOut.innerHTML = '<p class="subtle">Finding high-quality images...</p>';
      try {
        var api = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=' + encodeURIComponent(topic) +
          '&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=800&format=json&origin=*';
        var res = await fetch(api);
        var data = await res.json();
        var pages = data && data.query && data.query.pages ? Object.values(data.query.pages) : [];
        // Sort by resolution, prefer larger/quality images
        pages.sort(function(a, b) {
          var aw = (a.imageinfo && a.imageinfo[0] && a.imageinfo[0].width) || 0;
          var bw = (b.imageinfo && b.imageinfo[0] && b.imageinfo[0].width) || 0;
          return bw - aw;
        });
        var candidates = pages.filter(function(p) {
          var ext = (p.imageinfo && p.imageinfo[0] && p.imageinfo[0].url || '').split('.').pop().toLowerCase();
          return ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'].indexOf(ext) > -1;
        }).slice(0, 4);
        if (!candidates.length) { imgOut.innerHTML = '<p class="subtle">No images found for that topic. Try different words.</p>'; return; }
        var grid = document.createElement('div');
        grid.className = 'img-grid top-gap';
        var downloadLinks = [];
        candidates.forEach(function(p) {
          var info = p.imageinfo && p.imageinfo[0];
          if (!info) return;
          var desc = info.extmetadata && info.extmetadata.ImageDescription && info.extmetadata.ImageDescription.value ? info.extmetadata.ImageDescription.value.replace(/<[^>]+>/g, '') : p.title;
          var cell = document.createElement('figure');
          cell.className = 'img-cell';
          var a = document.createElement('a');
          a.href = info.descriptionurl || '#';
          a.target = '_blank';
          a.rel = 'noopener';
          var img = document.createElement('img');
          img.loading = 'lazy';
          img.src = info.thumburl || info.url;
          img.alt = p.title;
          img.onerror = function() { this.closest('figure').style.display = 'none'; };
          a.appendChild(img);
          cell.appendChild(a);
          var cap = document.createElement('figcaption');
          cap.textContent = desc.length > 80 ? desc.slice(0, 80) + '…' : desc;
          cell.appendChild(cap);
          grid.appendChild(cell);
          downloadLinks.push({ url: info.url, title: p.title.replace(/[^a-z0-9]+/gi, '-').slice(0, 40) });
        });
        imgOut.innerHTML = '';
        imgOut.appendChild(grid);
        var note = document.createElement('p');
        note.className = 'subtle';
        note.textContent = 'Real images from Wikimedia Commons (CC licensed). Click an image to open the source.';
        imgOut.appendChild(note);
        if (downloadLinks.length) {
          var dl = document.createElement('a');
          dl.href = downloadLinks[0].url;
          dl.download = downloadLinks[0].title;
          dl.className = 'ghost top-gap';
          dl.textContent = 'Download best image';
          dl.style.display = 'inline-block';
          imgOut.appendChild(dl);
        }
      } catch (err) {
        imgOut.innerHTML = '<p class="subtle">Could not load images (network or API limit). Please try again.</p>';
        logErrors('imggen')(err);
      }
    });
  }

  // ---- Concept Model Generator ----
  var modelBtn = $('genModelBtn'), modelTopic = $('genModelTopic'), modelOut = $('genModelOut');
  if (modelBtn && modelTopic && modelOut) {
    modelBtn.addEventListener('click', async function() {
      var topic = modelTopic.value.trim();
      if (!topic) { showToast('Enter a concept to model.'); modelTopic.focus(); return; }
      modelOut.innerHTML = '<p class="subtle">Building the concept model...</p>';
      try {
        var txt = await groqChat([{ role: 'system', content: 'Explain how a concept works as an interactive working model. Return JSON ONLY: {concept:string, parts:[{name:string, howItWorks:string, connectsTo:[string]}], flows:[{from:string, to:string, what:string}]}. Each part must be a short labeled step. Include 4-7 parts.' }, { role: 'user', content: 'Concept: ' + topic }], { maxTokens: 2048, temperature: 0.6 });
        var model;
        try { model = JSON.parse(txt.replace(/```json|```/g, '').trim()); }
        catch (e) { model = null; }
        if (!model || !model.parts) throw new Error('bad json');
        var html = '<h4><span class="icon icon-sm icon-chart"></span> Model: ' + escapeHtml(model.concept || topic) + '</h4>';
        html += '<div class="gen-model-parts">';
        model.parts.forEach(function(p, i) {
          html += '<details class="gen-model-part" open="' + (i === 0) + '"><summary><b>' + (i + 1) + '. ' + escapeHtml(p.name) + '</b></summary><p>' + escapeHtml(p.howItWorks || '') + '</p>' + (p.connectsTo && p.connectsTo.length ? '<p class="subtle">Connects to: ' + p.connectsTo.map(c => escapeHtml(c)).join(', ') + '</p>' : '') + '</details>';
        });
        html += '</div>';
        if (model.flows && model.flows.length) {
          html += '<h5 style="margin-top:10px">Flow</h5><div class="gen-model-flow">';
          model.flows.forEach(function(f) {
            html += '<div class="gen-model-flow-step"><span class="badge">' + escapeHtml(f.from) + '</span> &#8594; <span class="badge">' + escapeHtml(f.to) + '</span><span class="subtle"> — ' + escapeHtml(f.what || '') + '</span></div>';
          });
          html += '</div>';
        }
        modelOut.innerHTML = html;
      } catch (err) {
        modelOut.innerHTML = '<p class="subtle">Could not build the concept model. Please try again.</p>';
        logErrors('modelgen')(err);
      }
    });
  }
}
