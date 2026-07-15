// ===== STATE MANAGEMENT =====
const STORAGE_KEY = 'studyhub_state';
const DEFAULT_STATE = {
  profile: { name: 'Scholar', major: 'General Studies', weeklyTargetHours: 20, targetGpa: 3.8, setupComplete: false },
  settings: { darkMode: false, theme: 'teal', responseStyle: 'detailed', studyMode: 'balanced', focusMinutes: 25, breakMinutes: 5, timerNotify: true },
  goals: [], tasks: [], sessions: [], flashcards: [], notes: [], assignments: [],
  reflections: [], quizAttempts: [], mockTestHistory: [], recallHistory: [],
  aiChatHistory: [], lessonChatHistory: [], voiceTranscript: [],
  musicTrackIndex: 0, musicVolume: 70, musicPlaying: false,
  calendarEvents: [],
  playlists: [],
};
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
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
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
function showToast(msg, d, type) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
  if (type === 'error') el.style.background = '#7f1d1d';
  else if (type === 'success') el.style.background = '#065f46';
  else el.style.background = '#152b2a';
  clearTimeout(el._hide);
  el._hide = setTimeout(() => { el.classList.add('hidden'); }, d || 2500);
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
const GROQ_API_KEY = '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';
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
async function groqChat(messages, options = {}) {
  const model = options.model || 'llama-3.1-8b-instant';
  const maxTokens = options.maxTokens || 2048;
  const temperature = options.temperature ?? 0.7;
  const res = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_API_KEY}` },
    body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature })
  });
  if (!res.ok) throw new Error(`Groq API error ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
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
function $(id) { return document.getElementById(id); }
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
  updateWelcomeTitle();
}
function updateWelcomeTitle() {
  const at = qs('.tab.active');
  if (!at) return;
  const btn = qs(`.nav-btn[data-tab="${at.id}"]`);
  if (btn) $('welcomeTitle').textContent = `${btn.textContent} — ${state.profile.name}`;
}

// ===== DASHBOARD =====
function renderDashboard() {
  const weekMins = state.sessions.filter(s => new Date(s.date) >= new Date(Date.now() - 7 * 86400000)).reduce((s, x) => s + (x.minutes || 0), 0);
  $('metricHours').textContent = `${Math.round(weekMins / 60 * 10) / 10}h`;
  const total = state.tasks.length;
  const done = state.tasks.filter(t => t.status === 'done').length;
  $('metricCompletion').textContent = `${total > 0 ? Math.round(done / total * 100) : 0}%`;
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
  } else $('missionText').textContent = 'Add your first study goal to begin.';
  const agenda = $('todayAgendaList');
  agenda.innerHTML = '';
  const items = [...state.tasks.filter(t => t.due === todayStr()), ...state.goals.filter(g => g.deadline === todayStr()).map(g => ({ title: 'Goal due: ' + g.title }))];
  if (items.length === 0) agenda.innerHTML = '<li style="opacity:0.6">Nothing scheduled for today.</li>';
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
  const a = [];
  if (streak >= 3) a.push('🔥 3-Day Streak');
  if (streak >= 7) a.push('⚡ Week Warrior');
  if (streak >= 30) a.push('🏆 Monthly Master');
  if (total >= 10) a.push('✅ Task Master');
  if (weekMins >= 300) a.push('⏰ 5-Hour Week');
  if (state.sessions.length >= 5) a.push('📚 Consistent Learner');
  if (state.quizAttempts.length >= 3) a.push('🧠 Quiz Explorer');
  if (state.flashcards.length >= 20) a.push('🗂️ Flashcard Collector');
  if (state.notes.length >= 5) a.push('📝 Note Taker');
  if (state.goals.length >= 3) a.push('🎯 Goal Setter');
  if (a.length === 0) a.push('Keep going — achievements unlock as you study!');
  a.forEach(x => { const c = document.createElement('span'); c.className = 'chip'; c.textContent = x; ach.appendChild(c); });
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
  $('generatePlanBtn').addEventListener('click', generateStudyPlan);
  renderGoals(); renderKanban();
}
function renderGoals() {
  const el = $('goalList');
  el.innerHTML = '';
  if (state.goals.length === 0) { el.innerHTML = '<p class="subtle">No goals yet.</p>'; return; }
  state.goals.slice().reverse().forEach(g => {
    const d = document.createElement('div'); d.className = 'item';
    const dd = daysUntil(g.deadline);
    d.innerHTML = `<strong>${escapeHtml(g.title)}</strong> <span class="subtle">${escapeHtml(g.subject)} — ${dd >= 0 ? dd + 'd left' : 'Overdue'}</span> <span class="badge">${g.priority}</span>
    <p class="small">${g.hours}h planned</p>`;
    el.appendChild(d);
  });
}
function renderKanban() {
  ['todo', 'doing', 'done'].forEach(st => {
    const el = $(`taskBoard${st.charAt(0).toUpperCase() + st.slice(1)}`);
    el.innerHTML = '';
    state.tasks.filter(t => t.status === st).forEach(t => {
      const d = document.createElement('div'); d.className = 'task-card';
      d.innerHTML = `<strong>${escapeHtml(t.title)}</strong><span class="small">${escapeHtml(t.subject)} — due ${formatDate(t.due)}</span>
      <div class="inline wrap"><button class="ghost" data-move-task='${t.id}' data-to='${st === 'todo' ? 'doing' : st === 'doing' ? 'done' : 'doing'}'>${st === 'done' ? 'Reactivate' : 'Move →'}</button>
      <button class="ghost" data-del-task='${t.id}' style="color:var(--danger)">🗑</button></div>`;
      el.appendChild(d);
    });
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
function generateStudyPlan() {
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
  if (state.sessions.length === 0) { el.innerHTML = '<p class="subtle">No sessions logged yet.</p>'; return; }
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
  qsa('.fc-rate-btn').forEach(b => b.addEventListener('click', () => { const r = +b.dataset.rating; if (fcState.cards.length > 0) rateCurrentFlashcard(r); }));
  document.addEventListener('keydown', e => {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); $('fcFlipCard').click(); }
    if (e.key === 'ArrowLeft') $('fcPrevBtn').click();
    if (e.key === 'ArrowRight') $('fcNextBtn').click();
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
  if (state.flashcards.length === 0) { el.innerHTML = '<p class="subtle">No flashcards yet.</p>'; return; }
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
  if (fcState.cards.length > 0) { showCurrentFlashcard(); $('fcCardArea').classList.remove('hidden'); $('fcEmptyState').classList.add('hidden'); }
  else { $('fcCardArea').classList.add('hidden'); $('fcEmptyState').classList.remove('hidden'); }
}
function showCurrentFlashcard() {
  if (fcState.cards.length === 0) return;
  const c = fcState.cards[fcState.index];
  $('fcFrontText').textContent = c.question;
  $('fcBackText').textContent = c.answer;
  $('fcCounter').textContent = `${fcState.index + 1} / ${fcState.cards.length}`;
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
  saveState(); renderFlashcardStudy(); renderAllFlashcards(); showToast('Rated!');
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
  if (state.quizAttempts.length === 0) { el.innerHTML = '<p class="subtle">No quiz attempts yet.</p>'; return; }
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
    d.innerHTML = `<span>🎵 ${escapeHtml(p.name)}</span><span class="small">${p.tracks.length} tracks <button class="ghost delete-playlist" data-pidx="${idx}" style="padding:2px 6px;font-size:0.7rem;color:var(--danger);margin-left:4px;">✕</button></span>`;
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
  } catch (e) {}
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
  if (notes.length === 0) { el.innerHTML = '<p class="subtle">No notes found.</p>'; return; }
  notes.slice().reverse().forEach(n => {
    const d = document.createElement('div'); d.className = 'item';
    d.innerHTML = `<strong>${escapeHtml(n.title)}</strong> <span class="badge">${n.style}</span> <span class="subtle">${escapeHtml(n.subject)}</span><div class="inline wrap"><button class="ghost" data-open-note='${n.id}'>Open</button><button class="ghost" data-del-note='${n.id}' style="color:var(--danger)">🗑</button></div>`;
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
    else if (n.style === 'cornell') { try { const d = JSON.parse(n.content); $('noteCornellCues').value = d.cues || ''; $('noteCornellNotes').value = d.notes || ''; $('noteCornellSummary').value = d.summary || ''; } catch (e) {} }
    else if (n.style === 'mapping') { try { const d = JSON.parse(n.content); $('noteMappingCenter').value = d.center || ''; $('noteMappingBranches').value = d.branches || ''; } catch (e) {} }
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
    if (rows.length) { let html = '<table class="note-charting">'; rows.forEach((r, i) => { html += '<tr>' + r.map((c, j) => i === 0 ? `<th contenteditable="true">${escapeHtml(c)}</th>` : `<td contenteditable="true">${escapeHtml(c)}</td>`).join('') + '</tr>'; }); html += '</table>'; container.innerHTML = html; }
  } catch (e) {}
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
  if (state.assignments.length === 0) { el.innerHTML = '<p class="subtle">No assignments yet.</p>'; return; }
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
    saveState(); renderReflections(); updateCoachInsights(); $('reflectionForm').reset(); showToast('Reflection logged');
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
    const txt = await groqChat([{ role: 'system', content: 'Answer questions about the PDF content provided.' }, { role: 'user', content: `PDF Content: ${window._pdfContent}\n\nQuestion: ${q}` }], { maxTokens: 1024 });
    chat.innerHTML += `<div class="chat-bubble assistant">${escapeHtml(txt)}</div>`;
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
    saveState(); showToast('Preferences saved');
  });
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
    const systemPrompt = `You are an AI tutor for ${state.profile.name} (${state.profile.major}). Response style: ${style}. Study mode: ${mode}. Guide the student's thinking, ask probing questions, use analogies and real-world examples. Never give direct answers. Encourage critical thinking and active learning. Context: recent subjects include ${subjects}.`;
    const txt = await groqChat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: recentContext ? `Previous discussion:\n${recentContext}\n\nStudent's new question: ${q}` : q }
    ], { maxTokens: 1024 });
    convHistory.innerHTML += `<div class="chat-bubble assistant">${escapeHtml(txt)}</div>`;
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
  else { showToast('Lesson complete!'); $('lessonContent').innerHTML = '<h3>🎉 Lesson Complete!</h3><p>Excellent work! You can start another lesson.</p>'; $('lessonNextBtn').classList.add('hidden'); $('lessonAskBtn').classList.add('hidden'); }
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
    const txt = await groqChat([{ role: 'system', content: 'You are a lesson assistant. Answer student questions about the current lesson step.' }, { role: 'user', content: `${context}\n\nStudent question: ${q}` }], { maxTokens: 1024 });
    hist.innerHTML += `<div class="chat-bubble assistant">${escapeHtml(txt)}</div>`;
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
    if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.target.closest('input,textarea,select')) {
      showToast('Shortcuts: Ctrl+1-7 tabs, Space flip card');
    }
  });
}

// ===== AI VOICE MODE =====
let voiceState = { mode: 'language', listening: false, recognition: null, transcriptHistory: [] };
function setupVoiceMode() {
  qsa('.sub-nav-btn').forEach(b => b.addEventListener('click', () => {
    qsa('.sub-nav-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    voiceState.mode = b.dataset.voiceMode;
    $('voiceModeTitle').textContent = b.textContent;
    const descs = {
      language: 'Select a language and have a conversation with the AI. Practice speaking and get corrections on grammar and pronunciation.',
      debate: 'Practice debating with the AI on any topic. Develop argumentation, critical thinking, and persuasion skills.',
      presentation: 'Present your ideas to the AI audience. Get feedback on structure, clarity, delivery, and engagement.'
    };
    $('voiceModeDesc').textContent = descs[voiceState.mode] || '';
    $('voiceLanguage').classList.toggle('hidden', voiceState.mode !== 'language');
    $('voiceDebateTopic').classList.toggle('hidden', voiceState.mode !== 'debate');
    $('voiceTranscript').innerHTML = '<p class="subtle">Press the microphone to start speaking. AI will respond with text and speech.</p>';
    voiceState.transcriptHistory = [];
  }));
  const hasSpeechSupport = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  if (hasSpeechSupport) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    voiceState.recognition = new SR();
    voiceState.recognition.continuous = false;
    voiceState.recognition.interimResults = false;
    voiceState.recognition.lang = 'en-US';
    voiceState.recognition.onresult = e => {
      const t = e.results[0][0].transcript;
      handleVoiceInput(t);
    };
    voiceState.recognition.onend = () => { stopVoiceInput(); };
    voiceState.recognition.onerror = e => {
      console.error('Speech recognition error:', e.error);
      if (e.error !== 'no-speech') showToast('Voice recognition: ' + e.error);
      stopVoiceInput();
    };
  } else {
    $('voiceStartBtn').style.opacity = '0.5';
    $('voiceStartBtn').title = 'Speech recognition not available in this browser';
  }
  $('voiceStartBtn').addEventListener('click', startVoiceInput);
  $('voiceStopBtn').addEventListener('click', stopVoiceInput);
  $('voiceClearBtn').addEventListener('click', () => {
    $('voiceTranscript').innerHTML = '<p class="subtle">Transcript cleared.</p>';
    voiceState.transcriptHistory = [];
    showToast('Transcript cleared');
  });
}
function startVoiceInput() {
  if (!voiceState.recognition) { showToast('Speech recognition not supported in this browser'); return; }
  voiceState.listening = true;
  updateVoiceUI();
  try { voiceState.recognition.start(); } catch (e) { showToast('Speech recognition error'); }
}
function stopVoiceInput() {
  voiceState.listening = false;
  updateVoiceUI();
  try { voiceState.recognition?.stop(); } catch (e) {}
}
function updateVoiceUI() {
  $('voiceStartBtn').style.display = voiceState.listening ? 'none' : '';
  $('voiceStopBtn').style.display = voiceState.listening ? '' : 'none';
  $('voiceAvatar').classList.toggle('speaking', voiceState.listening);
}
async function handleVoiceInput(text) {
  const transcript = $('voiceTranscript');
  transcript.innerHTML += `<div><strong>You:</strong> ${escapeHtml(text)}</div>`;
  state.voiceTranscript.push({ role: 'user', content: text, timestamp: new Date().toISOString() });
  const lang = $('voiceLanguage').value;
  const topic = $('voiceDebateTopic').value || 'general';
  const systemPrompts = {
    language: `You are a ${lang} language practice partner. Respond in ${lang} first, then provide an English translation. Correct grammar mistakes naturally.`,
    debate: `Debate the user on "${topic}". Present arguments, counterarguments, and challenge their position respectfully.`,
    presentation: 'Give constructive feedback on the user\'s presentation. Note pacing, clarity, structure, and content.'
  };
  try {
    const txt = await groqChat([{ role: 'system', content: systemPrompts[voiceState.mode] || systemPrompts.language }, { role: 'user', content: text }], { maxTokens: 1024 });
    transcript.innerHTML += `<div><strong>AI:</strong> ${escapeHtml(txt)}</div>`;
    state.voiceTranscript.push({ role: 'assistant', content: txt, timestamp: new Date().toISOString() });
    if ('speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(txt);
      utter.lang = voiceState.mode === 'language' ? (lang === 'spanish' ? 'es-ES' : lang === 'french' ? 'fr-FR' : lang === 'german' ? 'de-DE' : lang === 'japanese' ? 'ja-JP' : lang === 'mandarin' ? 'zh-CN' : lang === 'arabic' ? 'ar-SA' : lang === 'portuguese' ? 'pt-BR' : lang === 'italian' ? 'it-IT' : 'en-US') : 'en-US';
      window.speechSynthesis.speak(utter);
    }
    transcript.scrollTop = transcript.scrollHeight;
  } catch (e) { transcript.innerHTML += `<div><strong>AI:</strong> Error generating response.</div>`; }
  saveState();
}

// ===== ANALYTICS =====
let charts = { studyChart: null, completionChart: null };
function setupAnalytics() {
  renderCharts();
  renderSubjectMastery();
  renderHeatmap();
  renderGradeAnalysis();
}
function renderCharts() {
  if (charts.studyChart) { charts.studyChart.destroy(); charts.studyChart = null; }
  if (charts.completionChart) { charts.completionChart.destroy(); charts.completionChart = null; }
  if (typeof Chart === 'undefined') return;
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
    saveState(); updateWelcomeTitle(); showToast('Profile saved');
  });
  qsa('.theme-swatch').forEach(s => {
    s.addEventListener('click', () => {
      qsa('.theme-swatch').forEach(x => x.classList.remove('active'));
      s.classList.add('active');
      const theme = s.dataset.theme;
      state.settings.theme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      saveState(); showToast('Theme changed to ' + theme);
    });
  });
  $('themeToggleBtn').addEventListener('click', () => {
    state.settings.darkMode = !state.settings.darkMode;
    saveState(); applyTheme();
    showToast(state.settings.darkMode ? 'Dark mode enabled' : 'Light mode enabled');
  });
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
  $('runHealthCheckBtn').addEventListener('click', runHealthCheck);
  runHealthCheck();
  $('profileName').value = state.profile.name;
  $('profileMajor').value = state.profile.major;
  $('profileWeeklyTarget').value = state.profile.weeklyTargetHours;
  $('profileTargetGpa').value = state.profile.targetGpa;
}
function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.settings.theme || 'teal');
  if (state.settings.darkMode) {
    document.documentElement.style.setProperty('--bg', '#1a2b2b');
    document.documentElement.style.setProperty('--ink', '#e8efe8');
    document.documentElement.style.setProperty('--panel', '#243836');
    document.documentElement.style.setProperty('--muted', '#9aaba8');
    $('themeToggleBtn').textContent = '☀️';
  } else {
    document.documentElement.style.removeProperty('--bg');
    document.documentElement.style.removeProperty('--ink');
    document.documentElement.style.removeProperty('--panel');
    document.documentElement.style.removeProperty('--muted');
    $('themeToggleBtn').textContent = '🌙';
  }
  const active = qs(`.theme-swatch[data-theme="${state.settings.theme}"]`);
  if (active) { qsa('.theme-swatch').forEach(x => x.classList.remove('active')); active.classList.add('active'); }
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
  $('healthCheckResults').innerHTML = `<table class="health-table"><tr><th>Component</th><th>Status</th></tr>${results.map(r => `<tr><td>${r.check}</td><td class="${r.status === 'OK' || r.status === 'Available' || r.status === 'Loaded' || r.status === 'Configured' ? 'status-ok' : r.status.includes('Checking') || r.status === 'Unexpected response' ? 'status-warn' : 'status-err'}">${r.status}</td></tr>`).join('')}</table>`;
  const grokStatusEl = $('geminiApiStatus');
  if (grokStatusEl) grokStatusEl.textContent = results[1].status === 'OK' ? 'Connected' : 'Error';
  const supabaseStatusEl = $('supabaseStatus');
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

  // ---- Math Calculator ----
  qsa(".calc-btn").forEach(b => {
    b.addEventListener("click", () => {
      const v = b.dataset.v;
      if (v === "C") { calcExpr = ""; updateCalcDisplay(); return; }
      if (v === "=") {
        try {
          let expr = calcExpr.replace(/\u00d7/g, "*").replace(/\u00f7/g, "/").replace(/\u2212/g, "-");
          expr = expr.replace(/\^/g, "**");
          expr = expr.replace(/sqrt\(/g, "Math.sqrt(");
          expr = expr.replace(/sin\(/g, "Math.sin(");
          expr = expr.replace(/cos\(/g, "Math.cos(");
          expr = expr.replace(/tan\(/g, "Math.tan(");
          expr = expr.replace(/log\(/g, "Math.log10(");
          expr = expr.replace(/pi/g, "Math.PI");
          const result = Function('"use strict"; return (' + expr + ')')();
          calcExpr = String(result);
        } catch (e) { calcExpr = "Error"; }
        updateCalcDisplay();
        return;
      }
      calcExpr += v;
      updateCalcDisplay();
    });
  });
  function updateCalcDisplay() {
    $("calcDisplay").value = calcExpr || "0";
  }

  // ---- Graph Plotter ----
  function plotGraph() {
    const canvas = $("graphCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width || canvas.offsetWidth || 500;
    const H = canvas.height || 280;
    canvas.width = W * 2; canvas.height = H * 2;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.scale(2, 2);
    ctx.clearRect(0, 0, W, H);
    const padding = 40;
    const plotW = W - padding * 2;
    const plotH = H - padding * 2;
    const xMin = -10, xMax = 10, yMin = -10, yMax = 10;
    const xScale = plotW / (xMax - xMin);
    const yScale = plotH / (yMax - yMin);
    function toCanvas(x, y) {
      return [padding + (x - xMin) * xScale, padding + (yMax - y) * yScale];
    }
    ctx.strokeStyle = "#e8f0ed";
    ctx.lineWidth = 1;
    for (let i = Math.ceil(xMin); i <= Math.floor(xMax); i++) {
      const [cx] = toCanvas(i, 0);
      ctx.beginPath(); ctx.moveTo(cx, padding); ctx.lineTo(cx, padding + plotH); ctx.stroke();
    }
    for (let i = Math.ceil(yMin); i <= Math.floor(yMax); i++) {
      const [, cy] = toCanvas(0, i);
      ctx.beginPath(); ctx.moveTo(padding, cy); ctx.lineTo(padding + plotW, cy); ctx.stroke();
    }
    ctx.strokeStyle = "#1f2b2b";
    ctx.lineWidth = 2;
    const [x0, y0] = toCanvas(0, 0);
    ctx.beginPath(); ctx.moveTo(padding, y0); ctx.lineTo(padding + plotW, y0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x0, padding); ctx.lineTo(x0, padding + plotH); ctx.stroke();
    const fnText = $("graphFunction").value.trim() || "x^2";
    try {
      const compiled = new Function("x", "with(Math){return " + fnText.replace(/\^/g, "**") + "}");
      ctx.strokeStyle = "#0f766e";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      let first = true;
      for (let px = 0; px <= plotW; px++) {
        const x = xMin + (px / plotW) * (xMax - xMin);
        try {
          const y = compiled(x);
          if (typeof y !== "number" || !isFinite(y)) { first = true; continue; }
          const [cx, cy] = toCanvas(x, y);
          if (cy < padding - 10 || cy > padding + plotH + 10) { first = true; continue; }
          if (first) { ctx.moveTo(cx, cy); first = false; }
          else ctx.lineTo(cx, cy);
        } catch (e) { first = true; }
      }
      ctx.stroke();
    } catch (e) {
      ctx.fillStyle = "#b42318";
      ctx.font = "14px Space Grotesk, sans-serif";
      ctx.fillText("Invalid function", 10, 20);
    }
  }
  $("plotGraphBtn").addEventListener("click", plotGraph);
  $("graphFunction").addEventListener("keydown", e => { if (e.key === "Enter") plotGraph(); });
  setTimeout(plotGraph, 100);

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
      $("mathSolverResult").innerHTML = '<div class="chat-bubble assistant">' + escapeHtml(txt) + '</div>';
    } catch (e) { showToast("AI error"); }
  });

  // ---- Physics ----
  $("physicsExplainBtn").addEventListener("click", async () => {
    const topic = $("physicsTopic").value;
    const labels = { motion: "Motion & Kinematics", forces: "Forces & Newton's Laws", energy: "Energy & Work", waves: "Waves & Sound", electricity: "Electricity & Circuits" };
    showToast("Explaining...");
    try {
      const txt = await groqChat([
        { role: "system", content: "You are a physics tutor. Explain the concept clearly with examples. Use analogies. Keep it under 200 words." },
        { role: "user", content: "Explain: " + (labels[topic] || topic) }
      ], { maxTokens: 1024 });
      $("physicsResult").innerHTML = '<div class="chat-bubble assistant">' + escapeHtml(txt) + '</div>';
    } catch (e) { showToast("AI error"); }
  });

  // ---- Chemistry ----
  $("chemistryExplainBtn").addEventListener("click", async () => {
    const topic = $("chemistryTopic").value;
    const labels = { atoms: "Atomic Structure", bonds: "Chemical Bonding", reactions: "Chemical Reactions", periodic: "Periodic Table", organic: "Organic Chemistry" };
    showToast("Explaining...");
    try {
      const txt = await groqChat([
        { role: "system", content: "You are a chemistry tutor. Explain the concept clearly with examples." },
        { role: "user", content: "Explain: " + (labels[topic] || topic) }
      ], { maxTokens: 1024 });
      $("chemistryResult").innerHTML = '<div class="chat-bubble assistant">' + escapeHtml(txt) + '</div>';
    } catch (e) { showToast("AI error"); }
  });

  // ---- Biology ----
  $("biologyExplainBtn").addEventListener("click", async () => {
    const topic = $("biologyTopic").value;
    const labels = { cells: "Cell Biology", genetics: "Genetics & DNA", evolution: "Evolution", ecology: "Ecology", human: "Human Body Systems" };
    showToast("Explaining...");
    try {
      const txt = await groqChat([
        { role: "system", content: "You are a biology tutor. Explain the concept clearly with examples." },
        { role: "user", content: "Explain: " + (labels[topic] || topic) }
      ], { maxTokens: 1024 });
      $("biologyResult").innerHTML = '<div class="chat-bubble assistant">' + escapeHtml(txt) + '</div>';
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
      $("mindmapResult").innerHTML = '<div class="chat-bubble assistant"><pre style="white-space:pre-wrap;font-family:monospace;font-size:0.85rem;">' + escapeHtml(txt) + '</pre></div>';
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
      $("langSpeakingArea").innerHTML = '<div class="chat-bubble assistant">' + escapeHtml(txt) + '</div>';
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
      $("langListeningArea").innerHTML = '<div class="chat-bubble assistant">' + escapeHtml(txt) + '</div>';
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
      $("langReadingArea").innerHTML = '<div class="chat-bubble assistant">' + escapeHtml(txt) + '</div>';
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
      $("langWritingArea").innerHTML = '<div class="chat-bubble assistant">' + escapeHtml(txt) + '</div>';
    } catch (e) { showToast("AI error"); }
  });

  // ---- Social Studies: Geography ----
  $("geoExplainBtn").addEventListener("click", async () => {
    const region = $("geoRegion").value;
    const labels = { world: "World Geography", europe: "Europe", asia: "Asia", africa: "Africa", americas: "Americas" };
    showToast("Learning...");
    try {
      const txt = await groqChat([
        { role: "system", content: "You are a geography tutor. Explain key geographical features, countries, and cultural aspects of the region." },
        { role: "user", content: "Teach me about: " + (labels[region] || region) }
      ], { maxTokens: 1024 });
      $("geoResult").innerHTML = '<div class="chat-bubble assistant">' + escapeHtml(txt) + '</div>';
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
      $("historyResult").innerHTML = '<div class="chat-bubble assistant">' + escapeHtml(txt) + '</div>';
    } catch (e) { showToast("AI error"); }
  });

  // ---- Social Studies: Economy ----
  $("economyExplainBtn").addEventListener("click", async () => {
    const topic = $("economyTopic").value;
    const labels = { basics: "Basic Economic Principles", "supply-demand": "Supply & Demand", markets: "Market Structures", fiscal: "Fiscal Policy", global: "Global Economy" };
    showToast("Explaining...");
    try {
      const txt = await groqChat([
        { role: "system", content: "You are an economics tutor. Explain the concept with real-world examples." },
        { role: "user", content: "Explain: " + (labels[topic] || topic) }
      ], { maxTokens: 1024 });
      $("economyResult").innerHTML = '<div class="chat-bubble assistant">' + escapeHtml(txt) + '</div>';
    } catch (e) { showToast("AI error"); }
  });

  // ---- Social Studies: Civics ----
  $("civicsExplainBtn").addEventListener("click", async () => {
    const topic = $("civicsTopic").value;
    const labels = { gov: "Government Systems", rights: "Rights & Responsibilities", society: "Social Structures", culture: "Culture & Society", institutions: "Social Institutions" };
    showToast("Explaining...");
    try {
      const txt = await groqChat([
        { role: "system", content: "You are a civics and sociology tutor. Explain the concept clearly." },
        { role: "user", content: "Explain: " + (labels[topic] || topic) }
      ], { maxTokens: 1024 });
      $("civicsResult").innerHTML = '<div class="chat-bubble assistant">' + escapeHtml(txt) + '</div>';
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
        $("englishAnalysisResult").innerHTML = '<div class="chat-bubble assistant">' + escapeHtml(txt) + '</div>';
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
      $("englishEssayResult").innerHTML = '<div class="chat-bubble assistant">' + escapeHtml(txt) + '</div>';
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
        $("englishVocabResult").innerHTML = '<div class="chat-bubble assistant">' + escapeHtml(txt) + '</div>';
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
      $("exerciseResult").innerHTML = '<div class="chat-bubble assistant">' + escapeHtml(txt) + '</div>';
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
      $("bodySystemResult").innerHTML = '<div class="chat-bubble assistant">' + escapeHtml(txt) + '</div>';
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
      $("nutritionResult").innerHTML = '<div class="chat-bubble assistant">' + escapeHtml(txt) + '</div>';
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

// ===== SETUP WIZARD =====
let setupState = { step: 0, name: "", major: "", weeklyTarget: 20, targetGpa: 3.8, subjects: [], theme: "teal" };

function showSetupModal() {
  setupState = { step: 0, name: "", major: "", weeklyTarget: 20, targetGpa: 3.8, subjects: [], theme: state.settings.theme || "teal" };
  $("setupModal").classList.remove("hidden");
  renderSetupStep();
}

function renderSetupStep() {
  const content = $("setupStepContent");
  const dots = qsa(".setup-step-dot");
  dots.forEach(function(d, i) {
    d.classList.toggle("active", i === setupState.step);
    d.classList.toggle("done", i < setupState.step);
  });
  $("setupBackBtn").style.display = setupState.step > 0 ? "" : "none";
  $("setupNextBtn").style.display = setupState.step < 2 ? "" : "none";
  $("setupFinishBtn").style.display = setupState.step === 2 ? "" : "none";

  if (setupState.step === 0) {
    content.innerHTML = '<h2>Welcome to Study Hub!</h2><p>Let\'s set up your profile.</p>' +
      '<div class="stack"><input id="setupName" placeholder="Your name" value="' + escapeHtml(setupState.name || state.profile.name) + '" />' +
      '<input id="setupMajor" placeholder="Program / Major" value="' + escapeHtml(setupState.major || state.profile.major) + '" />' +
      '<label>Weekly study target (hours)<input id="setupWeekly" type="number" min="1" value="' + (setupState.weeklyTarget || state.profile.weeklyTargetHours) + '" /></label>' +
      '<label>Target GPA<input id="setupGpa" type="number" min="0" max="4" step="0.1" value="' + (setupState.targetGpa || state.profile.targetGpa) + '" /></label></div>';
  } else if (setupState.step === 1) {
    const allSubjects = ["Math", "Science", "Languages", "Social Studies", "English", "Health Studies"];
    content.innerHTML = '<h2>Choose your subjects</h2><p>Select the subjects you study:</p><div class="setup-subject-grid">' +
      allSubjects.map(function(s) {
        return '<div class="setup-subject-option' + (setupState.subjects.includes(s) ? ' selected' : '') + '" data-subj="' + s + '">' + s + '</div>';
      }).join("") + '</div>';
    qsa(".setup-subject-option").forEach(function(el) {
      el.addEventListener("click", function() {
        var s = this.dataset.subj;
        var idx = setupState.subjects.indexOf(s);
        if (idx >= 0) { setupState.subjects.splice(idx, 1); this.classList.remove("selected"); }
        else { setupState.subjects.push(s); this.classList.add("selected"); }
      });
    });
  } else if (setupState.step === 2) {
    content.innerHTML = '<h2>Almost done!</h2><p>Choose your theme:</p><div class="theme-grid">' +
      ["teal","blue","orange","green","purple","red","pink","yellow"].map(function(t) {
        return '<button class="theme-swatch' + (setupState.theme === t ? ' active' : '') + '" data-theme="' + t + '" style="font-size:0.6rem;">' + t.charAt(0).toUpperCase() + t.slice(1) + '</button>';
      }).join("") + '</div>';
    qsa(".theme-swatch").forEach(function(el) {
      el.addEventListener("click", function() {
        qsa(".theme-swatch").forEach(function(x) { x.classList.remove("active"); });
        this.classList.add("active");
        setupState.theme = this.dataset.theme;
      });
    });
  }
}

$("setupNextBtn").addEventListener("click", function() {
  if (setupState.step === 0) {
    setupState.name = $("setupName").value.trim() || "Scholar";
    setupState.major = $("setupMajor").value.trim() || "General Studies";
    setupState.weeklyTarget = +$("setupWeekly").value || 20;
    setupState.targetGpa = Math.min(4, Math.max(0, +$("setupGpa").value || 3.8));
  }
  setupState.step++;
  renderSetupStep();
});

$("setupBackBtn").addEventListener("click", function() {
  if (setupState.step > 0) { setupState.step--; renderSetupStep(); }
});

$("setupFinishBtn").addEventListener("click", function() {
  state.profile.name = setupState.name || "Scholar";
  state.profile.major = setupState.major || "General Studies";
  state.profile.weeklyTargetHours = setupState.weeklyTarget || 20;
  state.profile.targetGpa = setupState.targetGpa || 3.8;
  state.profile.setupComplete = true;
  state.settings.theme = setupState.theme || "teal";
  document.documentElement.setAttribute("data-theme", state.settings.theme);
  saveState();
  $("setupModal").classList.add("hidden");
  updateWelcomeTitle();
  showToast("Profile setup complete! Welcome to Study Hub.");
});

// ===== INIT =====
function init() {
  loadState();
  $('headerDate').textContent = formatDate(new Date());
  qsa('.nav-btn').forEach(b => b.addEventListener('click', () => showTab(b.dataset.tab)));
  applyTheme();
  if (!state.profile.setupComplete) {
    setTimeout(showSetupModal, 300);
  }
  renderDashboard();
  setupPlanner();
  setupTimer();
  setupFlashcards();
  setupQuizzes();
  setupRecalls();
  setupNotes();
  setupAssignments();
  setupCoach();
  setupSmartAI();
  setupAITutor();
  setupAiLessons();
  setupVoiceMode();
  setupSubjects();
  setupAnalytics();
  setupSettings();
  setupMusicPlayer();
  setupPlaylists();
  enhanceMusicTrackList();
  setupCalendar();
  setupSocial();
  setupLearningTools();
  setupGlobalShortcuts();
  $('quickFocusBtn').addEventListener('click', () => {
    showTab('sessions');
    $('focusMinutes').value = 25;
    $('startPauseTimerBtn').click();
  });
  $('seedDataBtn').addEventListener('click', seedDemoData);
  showTab('dashboard');
  if (typeof initializeCloudSystem === 'function') {
    initializeCloudSystem().catch(() => {});
  }
}

document.addEventListener('DOMContentLoaded', init);
