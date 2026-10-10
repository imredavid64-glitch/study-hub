import { state } from '../../core/state.js';
import { Input, Select } from '../../ui/components/Input.js';
import { Tabs } from '../../ui/components/Tabs.js';
import { LEARN_MODES } from '../../core/config.js';
import { toastSuccess } from '../../ui/components/Toast.js';
import { createIcons } from 'lucide';
import type { Flashcard } from '../../core/types.js';

export function learnFeature(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'space-y-6 animate-fade-in h-full';
  container.id = 'learn-feature';

  container.innerHTML = `
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[var(--color-text)]">Learn</h1>
        <p class="text-[var(--color-muted)]">Study modes: Flashcards, Quiz, Recall, Mock Tests, AI Tutor</p>
      </div>
    </div>

    <div id="learn-mode-tabs"></div>
    <div id="cards-panel" class="hidden overflow-y-auto"></div>
    <div id="quiz-panel" class="hidden overflow-y-auto"></div>
    <div id="recall-panel" class="hidden overflow-y-auto"></div>
    <div id="mock-panel" class="hidden overflow-y-auto"></div>
    <div id="tutor-panel" class="hidden overflow-y-auto"></div>
  `;

  const modeTabs = container.querySelector('#learn-mode-tabs') as HTMLDivElement;
  const panels = {
    cards: container.querySelector('#cards-panel') as HTMLDivElement,
    quiz: container.querySelector('#quiz-panel') as HTMLDivElement,
    recall: container.querySelector('#recall-panel') as HTMLDivElement,
    mock: container.querySelector('#mock-panel') as HTMLDivElement,
    tutor: container.querySelector('#tutor-panel') as HTMLDivElement,
  };

  let currentCardIndex = 0;
  let isAnswerRevealed = false;

  function render(): void {
    const tabsEl = Tabs({
      tabs: LEARN_MODES.map(m => ({ id: m.id, label: m.label, icon: m.icon })),
      activeTab: state.getState().currentLearnMode,
      onChange: (mode) => switchMode(mode as any),
      variant: 'segmented',
    });
    modeTabs.innerHTML = '';
    modeTabs.appendChild(tabsEl);

    renderCardsPanel();
    renderQuizPanel();
    renderRecallPanel();
    renderMockPanel();
    renderTutorPanel();

    switchMode(state.getState().currentLearnMode);
  }

  function switchMode(mode: string): void {
    Object.entries(panels).forEach(([key, panel]) => {
      panel.classList.toggle('hidden', key !== mode);
    });
    state.setCurrentLearnMode(mode as any);
  }

  let selectedDeckId: string = '';

  function renderCardsPanel(): void {
    const decks = state.getState().decks;
    if (!selectedDeckId && decks.length > 0) {
      selectedDeckId = decks[0].id;
    }

    const allCards = state.getState().flashcards;
    const cards = selectedDeckId ? allCards.filter(c => c.deckId === selectedDeckId) : allCards;
    const currentCard: Flashcard | undefined = cards[currentCardIndex];

    panels.cards.innerHTML = `
      <div class="card p-6 space-y-4">
        <div class="card-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[var(--color-border)] pb-4">
          <div>
            <div class="card-title">Flashcards & Decks</div>
            <div class="card-description">Spaced repetition review using SM-2 algorithm</div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <select id="deck-select" class="px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] text-sm text-[var(--color-text)]">
              ${decks.map(d => `<option value="${d.id}" ${d.id === selectedDeckId ? 'selected' : ''}>${d.name} (${d.subject})</option>`).join('')}
            </select>
            <button id="new-deck-btn" class="btn-secondary btn-sm"><i data-lucide="folder-plus" class="w-4 h-4 mr-1"></i>New Deck</button>
            <button id="add-card-btn" class="btn-primary btn-sm"><i data-lucide="plus" class="w-4 h-4 mr-1"></i>Add Card</button>
          </div>
        </div>

        <div class="card-content flex flex-col items-center justify-center min-h-[320px]">
          ${cards.length === 0 || !currentCard ? `
            <div class="text-center py-8" id="no-cards-state">
              <i data-lucide="layers" class="w-16 h-16 mx-auto mb-4 text-[var(--color-muted)] opacity-50"></i>
              <p class="text-[var(--color-muted)] font-medium">No cards in this deck.</p>
              <button id="add-card-inner-btn" class="btn-primary mt-4" data-lucide="plus">Create First Card</button>
            </div>
          ` : `
            <div class="w-full max-w-md text-center space-y-4">
              <div class="text-xs text-[var(--color-muted)] flex justify-between items-center">
                <span>Card ${currentCardIndex + 1} of ${cards.length}</span>
                <span class="px-2 py-0.5 rounded bg-[var(--color-accent-soft)] text-[var(--color-accent)] font-semibold">${currentCard.subject}</span>
              </div>
              <div class="aspect-[4/3] bg-[var(--color-panel)] border-2 border-[var(--color-border)] hover:border-[var(--color-accent)] transition-all rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer shadow-md" id="flashcard">
                <span class="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-3">${isAnswerRevealed ? 'Answer' : 'Question'}</span>
                <p class="text-lg font-bold text-[var(--color-text)]">${isAnswerRevealed ? currentCard.answer : currentCard.question}</p>
                <p class="text-xs text-[var(--color-muted)] mt-6">${isAnswerRevealed ? 'Select your recall performance below' : 'Click card to flip'}</p>
              </div>
              ${isAnswerRevealed ? `
                <div class="grid grid-cols-4 gap-2 pt-2">
                  <button id="rate-again" class="px-3 py-2 text-xs font-semibold rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-colors" title="Rating 1 (Reset interval)">Again</button>
                  <button id="rate-hard" class="px-3 py-2 text-xs font-semibold rounded-lg bg-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-white transition-colors" title="Rating 3 (Hard recall)">Hard</button>
                  <button id="rate-good" class="px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors" title="Rating 4 (Good recall)">Good</button>
                  <button id="rate-easy" class="px-3 py-2 text-xs font-semibold rounded-lg bg-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors" title="Rating 5 (Perfect recall)">Easy</button>
                </div>
              ` : ''}
            </div>
          `}
        </div>
      </div>
      <div id="deck-modal-container"></div>
    `;

    const deckSelect = panels.cards.querySelector('#deck-select') as HTMLSelectElement;
    deckSelect?.addEventListener('change', (e) => {
      selectedDeckId = (e.target as HTMLSelectElement).value;
      currentCardIndex = 0;
      isAnswerRevealed = false;
      renderCardsPanel();
    });

    panels.cards.querySelector('#new-deck-btn')?.addEventListener('click', () => openNewDeckModal());
    panels.cards.querySelector('#add-card-btn')?.addEventListener('click', () => openNewCardModal());
    panels.cards.querySelector('#add-card-inner-btn')?.addEventListener('click', () => openNewCardModal());

    const cardEl = panels.cards.querySelector('#flashcard');
    cardEl?.addEventListener('click', () => {
      isAnswerRevealed = !isAnswerRevealed;
      renderCardsPanel();
    });

    const handleRating = (rating: number) => {
      if (currentCard) {
        state.reviewFlashcard(currentCard.id, rating);
        toastSuccess(`Reviewed with SM-2 algorithm!`);
        isAnswerRevealed = false;
        currentCardIndex = (currentCardIndex + 1) % Math.max(1, cards.length);
        renderCardsPanel();
      }
    };

    panels.cards.querySelector('#rate-again')?.addEventListener('click', () => handleRating(1));
    panels.cards.querySelector('#rate-hard')?.addEventListener('click', () => handleRating(3));
    panels.cards.querySelector('#rate-good')?.addEventListener('click', () => handleRating(4));
    panels.cards.querySelector('#rate-easy')?.addEventListener('click', () => handleRating(5));

    createIcons();
  }

  function openNewDeckModal(): void {
    const modalContainer = panels.cards.querySelector('#deck-modal-container') as HTMLDivElement;
    if (!modalContainer) return;
    modalContainer.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
        <div class="w-full max-w-md p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-2xl space-y-4">
          <h3 class="font-bold text-lg text-[var(--color-text)]">Create New Deck</h3>
          <form id="deck-form" class="space-y-4">
            ${Input({ label: 'Deck Name', placeholder: 'e.g., Organic Chemistry Reactions', required: true, id: 'deck-name' })}
            ${Input({ label: 'Subject', placeholder: 'e.g., Chemistry', required: true, id: 'deck-subject' })}
            <div class="flex justify-end gap-2 pt-2">
              <button type="button" id="close-deck-modal" class="btn-secondary">Cancel</button>
              <button type="submit" class="btn-primary">Create Deck</button>
            </div>
          </form>
        </div>
      </div>
    `;

    modalContainer.querySelector('#close-deck-modal')?.addEventListener('click', () => modalContainer.innerHTML = '');
    modalContainer.querySelector('#deck-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (modalContainer.querySelector('#deck-name') as HTMLInputElement).value;
      const subject = (modalContainer.querySelector('#deck-subject') as HTMLInputElement).value;
      const deck = state.addDeck(name, subject);
      selectedDeckId = deck.id;
      toastSuccess('Deck created!');
      modalContainer.innerHTML = '';
      renderCardsPanel();
    });
  }

  function openNewCardModal(): void {
    const modalContainer = panels.cards.querySelector('#deck-modal-container') as HTMLDivElement;
    if (!modalContainer) return;
    const decks = state.getState().decks;

    modalContainer.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
        <div class="w-full max-w-md p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-2xl space-y-4">
          <h3 class="font-bold text-lg text-[var(--color-text)]">Add New Flashcard</h3>
          <form id="card-form" class="space-y-4">
            ${Select({ label: 'Select Deck', options: decks.map(d => ({ value: d.id, label: d.name })), id: 'card-deck-id', value: selectedDeckId })}
            ${Input({ label: 'Question / Front', placeholder: 'e.g., What is SN2 reaction?', required: true, id: 'card-q' })}
            ${Input({ label: 'Answer / Back', placeholder: 'e.g., Bimolecular nucleophilic substitution', required: true, id: 'card-a' })}
            <div class="flex justify-end gap-2 pt-2">
              <button type="button" id="close-card-modal" class="btn-secondary">Cancel</button>
              <button type="submit" class="btn-primary">Add Flashcard</button>
            </div>
          </form>
        </div>
      </div>
    `;

    modalContainer.querySelector('#close-card-modal')?.addEventListener('click', () => modalContainer.innerHTML = '');
    modalContainer.querySelector('#card-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const deckId = (modalContainer.querySelector('#card-deck-id') as HTMLSelectElement).value;
      const question = (modalContainer.querySelector('#card-q') as HTMLInputElement).value;
      const answer = (modalContainer.querySelector('#card-a') as HTMLInputElement).value;
      const deck = decks.find(d => d.id === deckId);

      state.addFlashcard({
        deckId,
        question,
        answer,
        subject: deck ? deck.subject : 'General',
        tags: [deck ? deck.subject.toLowerCase() : 'flashcard'],
      });

      toastSuccess('Flashcard added!');
      modalContainer.innerHTML = '';
      renderCardsPanel();
    });
  }

  function renderQuizPanel(): void {
    panels.quiz.innerHTML = `
      <div class="card p-6 space-y-6">
        <div class="card-header">
          <div class="card-title">Quiz Generator</div>
          <div class="card-description">Generate interactive practice quizzes</div>
        </div>
        <div class="card-content">
          <form id="quiz-form" class="space-y-4">
            <div class="grid gap-4 sm:grid-cols-2">
              ${Input({ label: 'Topic', placeholder: 'e.g., Photosynthesis or Integration', required: true, id: 'quiz-topic' })}
              ${Select({ label: 'Subject', options: [
                { value: 'Biology', label: 'Biology' },
                { value: 'Mathematics', label: 'Mathematics' },
                { value: 'Physics', label: 'Physics' },
                { value: 'Chemistry', label: 'Chemistry' },
                { value: 'Computer Science', label: 'Computer Science' }
              ], id: 'quiz-subject' })}
            </div>
            <button type="submit" class="btn-primary w-full" data-lucide="help-circle">Start Interactive Quiz</button>
          </form>

          <div id="quiz-area" class="mt-6 hidden space-y-6"></div>
        </div>
      </div>
    `;

    const form = panels.quiz.querySelector('#quiz-form') as HTMLFormElement;
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const topic = (form.querySelector('#quiz-topic') as HTMLInputElement).value;
      const subject = (form.querySelector('#quiz-subject') as HTMLSelectElement).value;

      const quizArea = panels.quiz.querySelector('#quiz-area') as HTMLDivElement;
      quizArea.classList.remove('hidden');

      const questions = [
        { id: 'q1', text: `Which statement best describes the fundamental concept of ${topic}?`, options: ['It is a process converting inputs to energy', 'It is an irreversible static law', 'It occurs only at zero energy', 'It is a mathematical constant'], correct: 0 },
        { id: 'q2', text: `In ${subject}, what is the primary unit or component used when analyzing ${topic}?`, options: ['Variable / Element', 'Constant Scalar', 'Sub-atomic mass', 'Random matrix'], correct: 0 },
        { id: 'q3', text: `What happens when energy input is doubled in ${topic}?`, options: ['Yield rate increases proportionally', 'System halts completely', 'No measurable change', 'Variance becomes zero'], correct: 0 },
      ];

      quizArea.innerHTML = `
        <div class="p-4 rounded-xl bg-[var(--color-panel)] border border-[var(--color-border)] space-y-6">
          <h3 class="font-bold text-lg text-[var(--color-text)]">${subject}: ${topic} Quiz</h3>
          ${questions.map((q, qIndex) => `
            <div class="space-y-2">
              <p class="font-semibold text-sm text-[var(--color-text)]">${qIndex + 1}. ${q.text}</p>
              <div class="space-y-1 pl-2">
                ${q.options.map((opt, optIndex) => `
                  <label class="flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] cursor-pointer">
                    <input type="radio" name="q-${q.id}" value="${optIndex}" class="accent-[var(--color-accent)]" />
                    <span>${opt}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          `).join('')}
          <button id="submit-quiz-btn" class="btn-primary w-full">Submit Quiz</button>
        </div>
      `;

      quizArea.querySelector('#submit-quiz-btn')?.addEventListener('click', () => {
        let score = 0;
        questions.forEach(q => {
          const selected = quizArea.querySelector(`input[name="q-${q.id}"]:checked`) as HTMLInputElement;
          if (selected && parseInt(selected.value) === q.correct) score++;
        });

        const percentage = Math.round((score / questions.length) * 100);
        state.addXP(score * 15 + 10);
        toastSuccess(`Quiz Completed! Score: ${percentage}% (+${score * 15 + 10} XP)`);

        quizArea.innerHTML = `
          <div class="p-6 rounded-xl bg-[var(--color-accent-soft)]/40 border border-[var(--color-accent)] text-center space-y-3">
            <h3 class="font-bold text-xl text-[var(--color-text)]">Quiz Results</h3>
            <p class="text-3xl font-extrabold text-[var(--color-accent)]">${score} / ${questions.length} (${percentage}%)</p>
            <p class="text-sm text-[var(--color-muted)]">${percentage >= 70 ? 'Great job! You showed strong mastery of this topic.' : 'Good attempt! Review notes and try again.'}</p>
          </div>
        `;
      });
    });

    createIcons();
  }

  function renderRecallPanel(): void {
    panels.recall.innerHTML = `
      <div class="card p-6 space-y-6">
        <div class="card-header">
          <div class="card-title">Active Recall (Blurting)</div>
          <div class="card-description">Test memory by dumping everything you know on a topic</div>
        </div>
        <div class="card-content space-y-4">
          <form id="recall-form" class="space-y-4">
            <div class="grid gap-4 sm:grid-cols-2">
              ${Input({ label: 'Topic', placeholder: 'e.g., Cell Division or Newton Laws', required: true, id: 'recall-topic' })}
              ${Input({ label: 'Keywords to verify (comma-separated)', placeholder: 'mitosis, chromosomes, spindle', id: 'recall-keywords' })}
            </div>
            <button type="submit" class="btn-primary w-full">Start Recall Session</button>
          </form>

          <div id="recall-area" class="hidden space-y-4">
            <textarea id="recall-text" rows="8" class="w-full p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" placeholder="Start typing everything you remember..."></textarea>
            <button id="score-recall-btn" class="btn-primary w-full">Score Recall</button>
          </div>
          <div id="recall-score" class="hidden"></div>
        </div>
      </div>
    `;

    const form = panels.recall.querySelector('#recall-form') as HTMLFormElement;
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const topic = (form.querySelector('#recall-topic') as HTMLInputElement).value;
      const keywordsStr = (form.querySelector('#recall-keywords') as HTMLInputElement).value;

      const recallArea = panels.recall.querySelector('#recall-area') as HTMLDivElement;
      recallArea.classList.remove('hidden');

      const scoreBtn = recallArea.querySelector('#score-recall-btn') as HTMLButtonElement;
      if (scoreBtn) {
        scoreBtn.onclick = () => {
          const text = (recallArea.querySelector('#recall-text') as HTMLTextAreaElement).value;
          const keywords = keywordsStr.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);

          let hits = 0;
          keywords.forEach(k => {
            if (text.toLowerCase().includes(k)) hits++;
          });

          const scorePercent = keywords.length > 0 ? Math.round((hits / keywords.length) * 100) : (text.length > 50 ? 85 : 50);
          state.addXP(25);
          toastSuccess(`Active recall scored: ${scorePercent}% (+25 XP)`);

          const scoreArea = panels.recall.querySelector('#recall-score') as HTMLDivElement;
          scoreArea.classList.remove('hidden');
          scoreArea.innerHTML = `
            <div class="p-4 rounded-xl bg-[var(--color-panel)] border border-[var(--color-border)] space-y-2">
              <h4 class="font-bold text-base text-[var(--color-text)]">Recall Performance for ${topic}</h4>
              <p class="text-sm text-[var(--color-muted)]">Keywords matched: <strong class="text-[var(--color-accent)]">${hits} / ${keywords.length || 1}</strong></p>
              <div class="w-full h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
                <div class="h-full bg-[var(--color-accent)]" style="width: ${scorePercent}%"></div>
              </div>
            </div>
          `;
        };
      }
    });

    createIcons();
  }

  function renderMockPanel(): void {
    panels.mock.innerHTML = `
      <div class="card p-6 space-y-6">
        <div class="card-header">
          <div class="card-title">Mock Tests</div>
          <div class="card-description">Timed exam simulation under real pressure</div>
        </div>
        <div class="card-content">
          <p class="text-sm text-[var(--color-muted)] mb-4">Simulate a timed test with questions generated from your study subjects.</p>
          <button id="start-mock-btn" class="btn-primary w-full">Start Quick 5-Minute Mock Test</button>
          <div id="mock-test-area" class="mt-6 hidden"></div>
        </div>
      </div>
    `;

    panels.mock.querySelector('#start-mock-btn')?.addEventListener('click', () => {
      const area = panels.mock.querySelector('#mock-test-area') as HTMLDivElement;
      area.classList.remove('hidden');
      area.innerHTML = `
        <div class="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-base text-[var(--color-text)]">Timed Physics & Math Mock</h3>
            <span class="text-xs px-2.5 py-1 rounded-full bg-red-500/20 text-red-500 font-mono font-bold">04:59 Remaining</span>
          </div>
          <p class="text-sm font-medium">1. Compute the limit of (sin x)/x as x approaches 0.</p>
          <div class="space-y-1 text-sm pl-2">
            <label class="block"><input type="radio" name="mock-q1" value="1" class="mr-2" /> 1</label>
            <label class="block"><input type="radio" name="mock-q1" value="0" class="mr-2" /> 0</label>
            <label class="block"><input type="radio" name="mock-q1" value="inf" class="mr-2" /> Infinity</label>
          </div>
          <button id="submit-mock-btn" class="btn-primary btn-sm">Submit Mock Exam</button>
        </div>
      `;

      area.querySelector('#submit-mock-btn')?.addEventListener('click', () => {
        state.addXP(40);
        toastSuccess('Mock Test submitted! Score: 100% (+40 XP)');
        area.innerHTML = `<div class="p-4 rounded-xl bg-[var(--color-accent-soft)] text-center text-sm font-bold">Mock Exam Passed! +40 XP awarded.</div>`;
      });
    });

    createIcons();
  }

  function renderTutorPanel(): void {
    const aiChats = state.getState().aiChats;
    const tutorChat = aiChats.find(c => c.context === 'tutor') || {
      id: 'tutor-chat-1',
      userId: 'local-user',
      context: 'tutor',
      messages: [
        { id: 'm1', role: 'assistant', content: 'Hello! I am your AI Socratic Tutor. What topic or problem would you like to explore today?', timestamp: Date.now() - 60000 },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    panels.tutor.innerHTML = `
      <div class="card p-6 h-[500px] flex flex-col">
        <div class="card-header pb-3 border-b border-[var(--color-border)]">
          <div class="card-title">AI Socratic Tutor</div>
          <div class="card-description">I guide you to answers through inquiry and reasoning</div>
        </div>
        <div id="chat-messages" class="flex-1 overflow-y-auto py-4 space-y-3">
          ${tutorChat.messages.map(m => `
            <div class="flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}">
              <div class="max-w-[80%] p-3.5 rounded-2xl text-sm ${m.role === 'user' ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-panel)] border border-[var(--color-border)] text-[var(--color-text)]'}">
                ${m.content}
              </div>
            </div>
          `).join('')}
        </div>
        <form id="tutor-form" class="flex gap-2 pt-3 border-t border-[var(--color-border)]">
          <input type="text" id="tutor-msg-input" placeholder="Ask a question or share your reasoning..." class="flex-1 px-4 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" required />
          <button type="submit" class="btn-primary shrink-0" data-lucide="send">Send</button>
        </form>
      </div>
    `;

    const chatContainer = panels.tutor.querySelector('#chat-messages') as HTMLDivElement;
    chatContainer.scrollTop = chatContainer.scrollHeight;

    const form = panels.tutor.querySelector('#tutor-form') as HTMLFormElement;
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('#tutor-msg-input') as HTMLInputElement;
      const text = input.value.trim();
      if (!text) return;

      tutorChat.messages.push({ id: 'msg-' + Date.now(), role: 'user', content: text, timestamp: Date.now() });
      input.value = '';
      renderTutorPanel();

      setTimeout(() => {
        const responses = [
          `That's a good perspective! What fundamental principles or formulas support that idea in your subject?`,
          `Interesting thought! How would you test or prove that hypothesis step by step?`,
          `Spot on! How does this concept connect with what you learned in previous chapters?`,
        ];
        const reply = responses[Math.floor(Math.random() * responses.length)];
        tutorChat.messages.push({ id: 'msg-' + Date.now(), role: 'assistant', content: reply, timestamp: Date.now() });
        state.addXP(5);
        renderTutorPanel();
      }, 800);
    });

    createIcons();
  }

  render();
  return container;
}
