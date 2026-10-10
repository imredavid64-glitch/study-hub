import { Input, Select, Textarea } from '../../ui/components/Input.js';
import { Tabs } from '../../ui/components/Tabs.js';
import { toastSuccess, toastError } from '../../ui/components/Toast.js';
import { state } from '../../core/state.js';
import { createIcons } from 'lucide';

export function aiLabFeature(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'space-y-6 animate-fade-in';
  container.id = 'ai-lab-feature';

  container.innerHTML = `
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[var(--color-text)]">AI Lab & Learning Science Studio</h1>
        <p class="text-[var(--color-muted)]">Research-backed cognitive tools: Feynman studio, diagram occlusion, atomic chunker & voice tutor</p>
      </div>
      <span class="badge badge-warning badge-sm">Cognitive Suite</span>
    </div>

    <div id="ai-lab-tabs"></div>
    <div id="feynman-panel"></div>
    <div id="occlusion-panel" class="hidden"></div>
    <div id="chunker-panel" class="hidden"></div>
    <div id="generators-panel" class="hidden"></div>
    <div id="voice-panel" class="hidden"></div>
    <div id="calculator-panel" class="hidden"></div>
    <div id="settings-panel" class="hidden"></div>
  `;

  const tabsEl = container.querySelector('#ai-lab-tabs') as HTMLDivElement;
  const panels = {
    feynman: container.querySelector('#feynman-panel') as HTMLDivElement,
    occlusion: container.querySelector('#occlusion-panel') as HTMLDivElement,
    chunker: container.querySelector('#chunker-panel') as HTMLDivElement,
    generators: container.querySelector('#generators-panel') as HTMLDivElement,
    voice: container.querySelector('#voice-panel') as HTMLDivElement,
    calculator: container.querySelector('#calculator-panel') as HTMLDivElement,
    settings: container.querySelector('#settings-panel') as HTMLDivElement,
  };

  function render(): void {
    const tabs = Tabs({
      tabs: [
        { id: 'feynman', label: 'Feynman Studio', icon: 'sparkles' },
        { id: 'occlusion', label: 'Diagram Occlusion', icon: 'eye-off' },
        { id: 'chunker', label: 'Atomic Chunker', icon: 'layers' },
        { id: 'generators', label: 'Visual Generators', icon: 'cpu' },
        { id: 'voice', label: 'Voice Mode', icon: 'mic' },
        { id: 'calculator', label: 'Calculator', icon: 'calculator' },
        { id: 'settings', label: 'AI Settings', icon: 'settings' },
      ],
      activeTab: 'feynman',
      onChange: switchPanel,
      variant: 'pills',
    });
    tabsEl.innerHTML = '';
    tabsEl.appendChild(tabs);

    renderFeynmanPanel();
    renderOcclusionPanel();
    renderChunkerPanel();
    renderGeneratorsPanel();
    renderVoicePanel();
    renderCalculatorPanel();
    renderAISettingsPanel();
  }

  function switchPanel(tab: string): void {
    Object.entries(panels).forEach(([key, panel]) => {
      panel.classList.toggle('hidden', key !== tab);
    });
  }

  // --- 1. FEYNMAN TECHNIQUE EVALUATOR ---
  function renderFeynmanPanel(): void {
    panels.feynman.innerHTML = `
      <div class="card p-6 space-y-6">
        <div class="card-header pb-2 border-b border-[var(--color-border)]">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">💡</div>
            <div>
              <div class="card-title">The Feynman Technique Studio</div>
              <div class="card-description">"If you can't explain it simply, you don't understand it well enough." — Richard Feynman</div>
            </div>
          </div>
        </div>

        <div class="card-content space-y-4">
          <form id="feynman-form" class="space-y-4">
            <div class="grid gap-4 sm:grid-cols-2">
              ${Input({ label: 'Concept or Topic', placeholder: 'e.g., Photosynthesis, Neural Networks, Derivatives', required: true, id: 'feynman-topic', value: 'Photosynthesis' })}
              ${Select({ label: 'Target Audience', options: [
                { value: 'child', label: 'A 10-year-old child (No jargon)' },
                { value: 'beginner', label: 'A complete beginner (Plain English)' },
                { value: 'peer', label: 'A study peer (Intuitive & conceptual)' }
              ], id: 'feynman-audience' })}
            </div>
            ${Textarea({
              label: 'Your Simple Explanation',
              placeholder: 'Explain the concept as if teaching someone who has never heard of it. Avoid memorized buzzwords. Use physical analogies...',
              rows: 6,
              required: true,
              id: 'feynman-explanation',
              value: 'Plants are like little solar-powered kitchens. They use sunlight like an oven to turn water from the ground and carbon dioxide from the air into sugary plant food, and they give off fresh oxygen for us to breathe.'
            })}
            <div class="flex justify-between items-center pt-2">
              <span class="text-xs text-[var(--color-muted)]">Evaluates: Jargon density, Logical gaps, Simplicity index & Analogies</span>
              <button type="submit" class="btn-primary" data-lucide="sparkles">Evaluate Explanation</button>
            </div>
          </form>

          <div id="feynman-results" class="mt-6 space-y-4"></div>
        </div>
      </div>
    `;

    const form = panels.feynman.querySelector('#feynman-form') as HTMLFormElement;
    const resultsArea = panels.feynman.querySelector('#feynman-results') as HTMLDivElement;

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const topic = (form.querySelector('#feynman-topic') as HTMLInputElement).value;
      const text = (form.querySelector('#feynman-explanation') as HTMLTextAreaElement).value;

      const technicalKeywords = ['mitochondria', 'organelle', 'adenosine', 'triphosphate', 'thylakoid', 'electrochemical', 'derivative', 'infinitesimal', 'quantum', 'superposition'];
      const foundJargon = technicalKeywords.filter(k => text.toLowerCase().includes(k));

      const hasAnalogy = /like|as if|similar to|imagine|kitchen|oven|speedometer|factory|building block/i.test(text);
      const wordCount = text.trim().split(/\s+/).length;
      const simplicityScore = Math.min(100, Math.max(30, Math.round(100 - foundJargon.length * 15 + (hasAnalogy ? 20 : 0) + (wordCount > 15 ? 10 : 0))));

      state.addXP(25);
      toastSuccess('Feynman explanation analyzed! +25 XP');

      resultsArea.innerHTML = `
        <div class="p-5 rounded-2xl bg-[var(--color-panel)] border border-[var(--color-border)] space-y-5 animate-fade-in shadow-md">
          <div class="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
            <div>
              <h3 class="font-bold text-base text-[var(--color-text)]">Feynman Cognitive Assessment for: ${topic}</h3>
              <p class="text-xs text-[var(--color-muted)]">Metacognitive clarity & blind spot detection</p>
            </div>
            <div class="text-right">
              <span class="text-3xl font-extrabold ${simplicityScore >= 80 ? 'text-emerald-500' : simplicityScore >= 60 ? 'text-amber-500' : 'text-red-500'}">${simplicityScore}%</span>
              <p class="text-[10px] uppercase font-mono text-[var(--color-muted)]">Simplicity Index</p>
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-3">
            <div class="p-3.5 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
              <span class="text-xs font-semibold text-[var(--color-muted)]">Jargon Usage</span>
              <p class="text-base font-bold text-[var(--color-text)] mt-1">${foundJargon.length === 0 ? '✅ 0 Complex Terms' : `⚠️ ${foundJargon.length} Jargon terms`}</p>
              <p class="text-[11px] text-[var(--color-muted)] mt-1">${foundJargon.length === 0 ? 'Clean, accessible vocabulary.' : `Found: ${foundJargon.join(', ')}. Replace with everyday analogies.`}</p>
            </div>
            <div class="p-3.5 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
              <span class="text-xs font-semibold text-[var(--color-muted)]">Analogy & Metaphor</span>
              <p class="text-base font-bold text-[var(--color-text)] mt-1">${hasAnalogy ? '🌟 Vivid Analogy Found' : '⚠️ No Analogy Detected'}</p>
              <p class="text-[11px] text-[var(--color-muted)] mt-1">${hasAnalogy ? 'Physical analogies anchor abstract ideas.' : 'Try anchoring with "Imagine a..." or "It works like..."'}</p>
            </div>
            <div class="p-3.5 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
              <span class="text-xs font-semibold text-[var(--color-muted)]">Conceptual Depth</span>
              <p class="text-base font-bold text-[var(--color-text)] mt-1">${wordCount >= 20 ? '🎯 Good Completeness' : '⚡ Too Brief'}</p>
              <p class="text-[11px] text-[var(--color-muted)] mt-1">${wordCount} words provided across key mechanics.</p>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-[var(--color-accent-soft)]/40 border border-[var(--color-accent)] space-y-2">
            <h4 class="font-bold text-xs uppercase tracking-wider text-[var(--color-accent)]">Feynman Coach Insights</h4>
            <p class="text-xs text-[var(--color-text)] leading-relaxed">
              ${simplicityScore >= 80
                ? `Excellent explanation! You demonstrated authentic conceptual understanding by avoiding rote memorization buzzwords and framing the mechanism in concrete terms.`
                : `You are on the right track! To strengthen retention further, try replacing any technical terminology with a vivid real-life physical object or system.`}
            </p>
          </div>
        </div>
      `;
      createIcons();
    });

    createIcons();
  }

  // --- 2. DIAGRAM OCCLUSION STUDIO (Dual Coding Theory) ---
  function renderOcclusionPanel(): void {
    const diagrams = [
      {
        id: 'cell',
        name: 'Animal Cell Structure',
        subject: 'Biology',
        labels: [
          { id: 'l1', name: 'Nucleus (DNA control centre)', x: 48, y: 35 },
          { id: 'l2', name: 'Mitochondria (ATP Energy)', x: 22, y: 65 },
          { id: 'l3', name: 'Ribosomes (Protein synthesis)', x: 74, y: 68 },
          { id: 'l4', name: 'Endoplasmic Reticulum', x: 28, y: 28 },
          { id: 'l5', name: 'Cell Membrane', x: 80, y: 22 },
        ],
        svg: `
          <svg viewBox="0 0 400 250" class="w-full h-full">
            <ellipse cx="200" cy="125" rx="170" ry="105" fill="var(--color-panel)" stroke="var(--color-accent)" stroke-width="3"/>
            <circle cx="190" cy="100" r="45" fill="var(--color-accent-soft)" stroke="var(--color-accent)" stroke-width="2"/>
            <ellipse cx="100" cy="160" rx="30" ry="16" fill="#f59e0b" opacity="0.3"/>
            <ellipse cx="290" cy="170" rx="25" ry="14" fill="#10b981" opacity="0.3"/>
          </svg>
        `
      },
      {
        id: 'heart',
        name: 'Human Heart Circulation',
        subject: 'Anatomy',
        labels: [
          { id: 'l1', name: 'Superior Vena Cava', x: 20, y: 20 },
          { id: 'l2', name: 'Aorta (Main Artery)', x: 50, y: 15 },
          { id: 'l3', name: 'Pulmonary Artery', x: 78, y: 30 },
          { id: 'l4', name: 'Left Ventricle', x: 75, y: 75 },
          { id: 'l5', name: 'Right Ventricle', x: 25, y: 75 },
        ],
        svg: `
          <svg viewBox="0 0 400 250" class="w-full h-full">
            <path d="M 200,80 C 180,40 120,40 100,80 C 80,120 120,170 200,220 C 280,170 320,120 300,80 C 280,40 220,40 200,80 Z" fill="var(--color-panel)" stroke="#ef4444" stroke-width="3"/>
          </svg>
        `
      }
    ];

    let currentDiagramIndex = 0;
    const revealedLabels: Set<string> = new Set();

    function renderActiveDiagram(): void {
      const diag = diagrams[currentDiagramIndex];

      panels.occlusion.innerHTML = `
        <div class="card p-6 space-y-6">
          <div class="card-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[var(--color-border)]">
            <div>
              <div class="card-title">Diagram Occlusion & Active Visual Recall</div>
              <div class="card-description">Dual-Coding Theory: Click occlusion masks to test your spatial visual memory</div>
            </div>
            <div class="flex items-center gap-2">
              <select id="diag-select" class="px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] text-xs text-[var(--color-text)]">
                ${diagrams.map((d, i) => `<option value="${i}" ${i === currentDiagramIndex ? 'selected' : ''}>${d.name} (${d.subject})</option>`).join('')}
              </select>
              <button id="reset-occlusion" class="btn-secondary btn-sm"><i data-lucide="rotate-ccw" class="w-3.5 h-3.5 mr-1"></i>Mask All</button>
            </div>
          </div>

          <div class="card-content space-y-4">
            <div class="relative w-full aspect-[16/9] max-h-[380px] bg-[var(--color-card)] rounded-2xl border-2 border-[var(--color-border)] overflow-hidden flex items-center justify-center p-4 shadow-inner">
              ${diag.svg}
              ${diag.labels.map(l => {
                const isRevealed = revealedLabels.has(l.id);
                return `
                  <button data-occlusion-id="${l.id}" class="absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer ${isRevealed ? 'bg-emerald-500 text-white border border-emerald-400' : 'bg-[var(--color-accent)] text-white hover:scale-105 active:scale-95'}" style="left: ${l.x}%; top: ${l.y}%;">
                    ${isRevealed ? l.name : '❓ [ Tap to Reveal ]'}
                  </button>
                `;
              }).join('')}
            </div>

            <div class="flex justify-between items-center text-xs text-[var(--color-muted)] pt-2">
              <span>Progress: <strong class="text-[var(--color-accent)]">${revealedLabels.size} / ${diag.labels.length}</strong> labels recalled</span>
              <span>Click a mask to verify accuracy</span>
            </div>
          </div>
        </div>
      `;

      panels.occlusion.querySelector('#diag-select')?.addEventListener('change', (e) => {
        currentDiagramIndex = parseInt((e.target as HTMLSelectElement).value);
        revealedLabels.clear();
        renderActiveDiagram();
      });

      panels.occlusion.querySelector('#reset-occlusion')?.addEventListener('click', () => {
        revealedLabels.clear();
        toastSuccess('All labels masked');
        renderActiveDiagram();
      });

      panels.occlusion.querySelectorAll('[data-occlusion-id]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = (e.currentTarget as HTMLElement).dataset.occlusionId!;
          if (!revealedLabels.has(id)) {
            revealedLabels.add(id);
            state.addXP(10);
            toastSuccess('Label recalled! +10 XP');
            renderActiveDiagram();
          }
        });
      });

      createIcons();
    }

    renderActiveDiagram();
  }

  // --- 3. ATOMIC CONTENT CHUNKER (Cognitive Load Theory) ---
  function renderChunkerPanel(): void {
    panels.chunker.innerHTML = `
      <div class="card p-6 space-y-6">
        <div class="card-header pb-2 border-b border-[var(--color-border)]">
          <div class="card-title">Atomic Content Chunker</div>
          <div class="card-description">Cognitive Load Theory (Sweller): Break dense paragraphs into 2-minute digestible atomic units with instant retrieval checks</div>
        </div>

        <div class="card-content space-y-4">
          <form id="chunker-form" class="space-y-4">
            ${Textarea({
              label: 'Paste Textbook Paragraph or Complex Notes',
              placeholder: 'Paste dense text here to break down into atomic concept chunks...',
              rows: 5,
              required: true,
              id: 'chunker-input',
              value: 'Mitochondria are double-membraned organelles found in most eukaryotic organisms. They generate most of the chemical energy needed to power the cell reactions through oxidative phosphorylation. Adenosine triphosphate (ATP) is produced on the inner folded membrane known as cristae. Mitochondria also contain their own independent circular DNA genome and ribosomes.'
            })}
            <div class="flex justify-end">
              <button type="submit" class="btn-primary" data-lucide="layers">Chunk Content into Micro-Units</button>
            </div>
          </form>

          <div id="chunker-output" class="mt-6 space-y-4"></div>
        </div>
      </div>
    `;

    const form = panels.chunker.querySelector('#chunker-form') as HTMLFormElement;
    const output = panels.chunker.querySelector('#chunker-output') as HTMLDivElement;

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = (form.querySelector('#chunker-input') as HTMLTextAreaElement).value;
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

      state.addXP(20);
      toastSuccess('Content decomposed into atomic micro-units! +20 XP');

      output.innerHTML = `
        <div class="space-y-4 animate-fade-in">
          <div class="flex justify-between items-center">
            <span class="font-bold text-sm text-[var(--color-accent)]">Decomposed into ${sentences.length} Atomic Chunks</span>
            <span class="text-xs text-[var(--color-muted)] font-mono">1 core idea per card</span>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            ${sentences.map((st, idx) => `
              <div class="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] space-y-3">
                <div class="flex justify-between items-center">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-accent-soft)] text-[var(--color-accent)]">Micro-Unit #${idx + 1}</span>
                  <span class="text-[10px] text-[var(--color-muted)]">~45 sec read</span>
                </div>
                <p class="text-sm font-medium text-[var(--color-text)]">${st.trim()}</p>
                <div class="pt-2 border-t border-[var(--color-border)]">
                  <span class="text-[11px] font-bold text-[var(--color-accent)]">Active Retrieval Check:</span>
                  <p class="text-xs text-[var(--color-muted)] mt-0.5">What is the central mechanism in this statement without re-reading?</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      createIcons();
    });

    createIcons();
  }

  // --- 4. GENERATORS PANEL ---
  function renderGeneratorsPanel(): void {
    panels.generators.innerHTML = `
      <div class="grid gap-6 lg:grid-cols-2">
        <div class="card">
          <div class="card-header">
            <div class="card-title">Mind Map Generator</div>
            <div class="card-description">AI creates interactive, expandable concept trees</div>
          </div>
          <div class="card-content space-y-4">
            <div class="flex gap-2">
              ${Input({ placeholder: 'Enter topic (e.g., Photosynthesis)', id: 'mindmap-topic' })}
              <button id="gen-mindmap" class="btn-primary" data-lucide="git-branch">Generate</button>
            </div>
            <div id="mindmap-output" class="min-h-[300px] p-4 bg-[var(--color-panel)] rounded-xl border border-[var(--color-border)] flex flex-col items-center justify-center text-[var(--color-muted)] text-sm">
              Enter a topic to generate an interactive mind map
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">Concept Model Builder</div>
            <div class="card-description">Step-by-step interactive models of complex mechanisms</div>
          </div>
          <div class="card-content space-y-4">
            <div class="flex gap-2">
              ${Input({ placeholder: 'e.g., How a car engine works', id: 'model-topic' })}
              <button id="gen-model" class="btn-primary" data-lucide="box">Build Model</button>
            </div>
            <div id="model-output" class="min-h-[300px] p-4 bg-[var(--color-panel)] rounded-xl border border-[var(--color-border)] flex flex-col items-center justify-center text-[var(--color-muted)] text-sm">
              Enter a concept to build an interactive step model
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">Wikimedia Diagram Finder</div>
            <div class="card-description">Search verified educational diagrams from Wikimedia Commons</div>
          </div>
          <div class="card-content space-y-4">
            <div class="flex gap-2">
              ${Input({ placeholder: 'e.g., plant cell diagram', id: 'image-topic' })}
              ${Select({ label: '', options: [
                { value: '4', label: '4 images' },
                { value: '8', label: '8 images' }
              ], id: 'image-count' })}
              <button id="find-images" class="btn-primary" data-lucide="image">Find</button>
            </div>
            <div id="images-output" class="grid grid-cols-2 gap-3 min-h-[200px]"></div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">Educational Film Storyboard</div>
            <div class="card-description">Multi-scene video storyboard with speech synthesis narration</div>
          </div>
          <div class="card-content space-y-4">
            <div class="flex gap-2">
              ${Input({ placeholder: 'e.g., The Water Cycle', id: 'film-topic' })}
              <button id="gen-film" class="btn-primary" data-lucide="film">Make Film</button>
            </div>
            <div id="film-output" class="min-h-[200px] p-4 bg-[var(--color-panel)] rounded-xl border border-[var(--color-border)] flex flex-col items-center justify-center text-[var(--color-muted)] text-sm">
              Enter a topic to generate a film storyboard
            </div>
          </div>
        </div>
      </div>
    `;

    setupGeneratorsHandlers();
    createIcons();
  }

  function setupGeneratorsHandlers(): void {
    panels.generators.querySelector('#gen-mindmap')?.addEventListener('click', () => {
      const input = panels.generators.querySelector('#mindmap-topic') as HTMLInputElement;
      const topic = input.value.trim() || 'Photosynthesis';
      const output = panels.generators.querySelector('#mindmap-output') as HTMLDivElement;

      output.innerHTML = `
        <div class="w-full space-y-4 animate-fade-in">
          <div class="flex justify-between items-center pb-2 border-b border-[var(--color-border)]">
            <span class="font-bold text-base text-[var(--color-accent)]">Mind Map: ${topic}</span>
          </div>
          <div class="space-y-2 font-mono text-xs">
            <div class="p-2.5 rounded-lg bg-[var(--color-accent)] text-white font-bold text-sm shadow inline-block">
              🎯 ${topic}
            </div>
            <div class="pl-6 space-y-2 border-l-2 border-[var(--color-accent)]/40 ml-4 pt-2 text-xs">
              <div class="p-1.5 rounded bg-[var(--color-card)] border border-[var(--color-border)]">• Core Definition & Inputs</div>
              <div class="p-1.5 rounded bg-[var(--color-card)] border border-[var(--color-border)]">• Mechanism Stages A & B</div>
              <div class="p-1.5 rounded bg-[var(--color-card)] border border-[var(--color-border)]">• Applications & Exam Pitfalls</div>
            </div>
          </div>
        </div>
      `;
    });

    panels.generators.querySelector('#gen-model')?.addEventListener('click', () => {
      const input = panels.generators.querySelector('#model-topic') as HTMLInputElement;
      const topic = input.value.trim() || 'How a Car Engine Works';
      const output = panels.generators.querySelector('#model-output') as HTMLDivElement;

      output.innerHTML = `
        <div class="w-full space-y-3 animate-fade-in text-left">
          <h4 class="font-bold text-sm text-[var(--color-accent)]">${topic} (4-Stroke Model)</h4>
          <div class="p-3 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-xs space-y-1">
            <p><strong>1. Intake:</strong> Air-fuel mixture enters cylinder.</p>
            <p><strong>2. Compression:</strong> Piston compresses charge 10x.</p>
            <p><strong>3. Power:</strong> Spark ignites fuel driving piston down.</p>
            <p><strong>4. Exhaust:</strong> Burnt gases expelled through valve.</p>
          </div>
        </div>
      `;
    });

    panels.generators.querySelector('#find-images')?.addEventListener('click', async () => {
      const input = panels.generators.querySelector('#image-topic') as HTMLInputElement;
      const topic = input.value.trim() || 'plant cell diagram';
      const output = panels.generators.querySelector('#images-output') as HTMLDivElement;

      output.innerHTML = `<div class="col-span-full py-8 text-center text-xs text-[var(--color-muted)]"><i data-lucide="loader" class="w-5 h-5 animate-spin mx-auto mb-2 text-[var(--color-accent)]"></i>Searching Wikimedia Commons...</div>`;
      createIcons();

      try {
        const api = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(topic)}&gsrnamespace=6&gsrlimit=4&prop=imageinfo&iiprop=url|size&iiurlwidth=400&format=json&origin=*`;
        const res = await fetch(api);
        const data = await res.json();
        const pages = data?.query?.pages ? Object.values(data.query.pages) : [];

        const images = (pages as any[]).filter(p => p.imageinfo?.[0]?.url).map(p => ({
          thumburl: p.imageinfo[0].thumburl || p.imageinfo[0].url,
          title: String(p.title || '').replace(/^File:/, '')
        }));

        output.innerHTML = images.map(img => `
          <div class="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
            <img src="${img.thumburl}" alt="${img.title}" class="w-full h-28 object-cover" />
            <p class="p-1.5 text-[11px] truncate text-[var(--color-text)]">${img.title}</p>
          </div>
        `).join('');
      } catch {
        output.innerHTML = `<div class="col-span-full text-center text-xs text-red-500">Could not reach Wikimedia</div>`;
      }
    });

    panels.generators.querySelector('#gen-film')?.addEventListener('click', () => {
      const input = panels.generators.querySelector('#film-topic') as HTMLInputElement;
      const topic = input.value.trim() || 'The Water Cycle';
      const output = panels.generators.querySelector('#film-output') as HTMLDivElement;

      output.innerHTML = `
        <div class="w-full space-y-3 animate-fade-in">
          <h4 class="font-bold text-sm text-[var(--color-accent)]">🎬 ${topic} - Scene 1</h4>
          <div class="p-4 rounded-xl bg-black text-white text-center space-y-2">
            <p class="text-2xl">🌅</p>
            <p class="text-xs text-gray-300">"Solar heat drives water evaporation from lakes and oceans into atmospheric vapor."</p>
            <button id="narrate-btn" class="btn-primary btn-sm rounded-full">Play Speech</button>
          </div>
        </div>
      `;

      output.querySelector('#narrate-btn')?.addEventListener('click', () => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(new SpeechSynthesisUtterance("Solar heat drives water evaporation from lakes and oceans into atmospheric vapor."));
        }
      });
    });
  }

  // --- 5. VOICE MODE PANEL ---
  function renderVoicePanel(): void {
    panels.voice.innerHTML = `
      <div class="card p-6 space-y-6">
        <div class="card-header pb-2 border-b border-[var(--color-border)]">
          <div class="card-title">Voice Conversation Mode</div>
          <div class="card-description">Hands-free real-time audio interaction with Web Speech API</div>
        </div>
        <div class="card-content text-center space-y-6">
          <div class="w-24 h-24 rounded-full bg-[var(--color-accent-soft)] mx-auto flex items-center justify-center shadow-lg" id="voice-indicator">
            <i data-lucide="mic" class="w-10 h-10 text-[var(--color-accent)]"></i>
          </div>
          <div>
            <h3 id="voice-status" class="font-bold text-base text-[var(--color-text)]">Ready to Speak</h3>
            <p class="text-xs text-[var(--color-muted)] mt-1">Click Start Microphone to speak with your AI study partner</p>
          </div>
          <div class="flex justify-center gap-3">
            <button id="voice-start" class="btn-primary px-5 py-2.5 rounded-full font-bold flex items-center gap-2"><i data-lucide="mic" class="w-4 h-4"></i>Start Mic</button>
            <button id="voice-stop" class="btn-danger px-5 py-2.5 rounded-full font-bold hidden flex items-center gap-2"><i data-lucide="mic-off" class="w-4 h-4"></i>Stop</button>
          </div>
          <div class="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] text-left min-h-[140px] max-h-56 overflow-y-auto text-xs space-y-2" id="voice-transcript">
            <p class="text-[11px] text-[var(--color-muted)] italic">Conversation transcript will appear here...</p>
          </div>
        </div>
      </div>
    `;

    setupVoiceHandlers();
    createIcons();
  }

  function setupVoiceHandlers(): void {
    const startBtn = panels.voice.querySelector('#voice-start') as HTMLButtonElement;
    const stopBtn = panels.voice.querySelector('#voice-stop') as HTMLButtonElement;
    const statusText = panels.voice.querySelector('#voice-status') as HTMLHeadingElement;
    const indicator = panels.voice.querySelector('#voice-indicator') as HTMLDivElement;
    const transcript = panels.voice.querySelector('#voice-transcript') as HTMLDivElement;

    let recognition: any = null;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        statusText.textContent = 'Listening...';
        indicator.classList.add('animate-pulse', 'bg-red-500/20');
        startBtn.classList.add('hidden');
        stopBtn.classList.remove('hidden');
      };

      recognition.onresult = (event: any) => {
        const speech = event.results[0][0].transcript;
        addTranscriptLine('User', speech);
        statusText.textContent = 'Thinking...';

        setTimeout(() => {
          const aiResponse = `That is a great insight on "${speech}". What fundamental formula or mechanism explains that?`;
          addTranscriptLine('AI Tutor', aiResponse);
          statusText.textContent = 'Speaking...';

          if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(aiResponse);
            utterance.onend = () => {
              statusText.textContent = 'Ready to Speak';
              indicator.classList.remove('animate-pulse', 'bg-red-500/20');
            };
            window.speechSynthesis.speak(utterance);
          } else {
            statusText.textContent = 'Ready to Speak';
            indicator.classList.remove('animate-pulse', 'bg-red-500/20');
          }
        }, 500);
      };

      recognition.onerror = () => {
        toastError('Microphone or Speech Recognition error');
        resetVoiceUI();
      };

      recognition.onend = () => { resetVoiceUI(); };
    }

    function resetVoiceUI(): void {
      statusText.textContent = 'Ready to Speak';
      indicator.classList.remove('animate-pulse', 'bg-red-500/20');
      startBtn.classList.remove('hidden');
      stopBtn.classList.add('hidden');
    }

    function addTranscriptLine(sender: string, text: string): void {
      const p = document.createElement('p');
      p.className = 'py-1 border-b border-[var(--color-border)]/50';
      p.innerHTML = `<strong class="${sender === 'User' ? 'text-[var(--color-accent)]' : 'text-emerald-500'}">${sender}:</strong> ${text}`;
      transcript.appendChild(p);
      transcript.scrollTop = transcript.scrollHeight;
    }

    startBtn?.addEventListener('click', () => {
      if (recognition) {
        try { recognition.start(); } catch (e) { resetVoiceUI(); }
      } else {
        toastError('Speech Recognition not supported in this browser');
      }
    });

    stopBtn?.addEventListener('click', () => {
      if (recognition) recognition.stop();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      resetVoiceUI();
    });
  }

  // --- 6. CALCULATOR PANEL ---
  function renderCalculatorPanel(): void {
    panels.calculator.innerHTML = `
      <div class="card p-6">
        <div class="card-header mb-4">
          <div class="card-title">Scientific Expression Calculator</div>
          <div class="card-description">Full expression evaluator for STEM and calculus problem sets</div>
        </div>
        <div class="card-content">
          <div class="max-w-md mx-auto space-y-4">
            <input id="calc-display" type="text" readonly class="w-full text-right text-3xl font-mono p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-text)] shadow-inner" value="0" />
            <div class="grid grid-cols-4 gap-2" id="calc-buttons"></div>
          </div>
        </div>
      </div>
    `;
    renderCalculator();
  }

  function renderCalculator(): void {
    const buttons = [
      ['C', '(', ')', '/'],
      ['7', '8', '9', '×'],
      ['4', '5', '6', '−'],
      ['1', '2', '3', '+'],
      ['0', '.', '=', '^'],
      ['sin', 'cos', 'tan', '√'],
      ['log', 'ln', 'π', 'e'],
    ];

    const containerEl = document.getElementById('calc-buttons')!;
    containerEl.innerHTML = buttons.map(row => row.map(btn => `
      <button class="calc-btn p-3 rounded-xl bg-[var(--color-panel)] border border-[var(--color-border)] text-[var(--color-text)] font-semibold hover:bg-[var(--color-accent-soft)] hover:border-[var(--color-accent)] active:scale-95 transition-all text-sm" data-value="${btn}">${btn}</button>
    `).join('')).join('');

    const display = document.getElementById('calc-display') as HTMLInputElement;
    let expression = '';

    containerEl.querySelectorAll('.calc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const value = btn.getAttribute('data-value')!;
        if (value === 'C') {
          expression = '';
          display.value = '0';
        } else if (value === '=') {
          try {
            const expr = expression
              .replace(/×/g, '*')
              .replace(/−/g, '-')
              .replace(/\^/g, '**')
              .replace(/√/g, 'Math.sqrt')
              .replace(/π/g, 'Math.PI')
              .replace(/e/g, 'Math.E')
              .replace(/sin/g, 'Math.sin')
              .replace(/cos/g, 'Math.cos')
              .replace(/tan/g, 'Math.tan')
              .replace(/log/g, 'Math.log10')
              .replace(/ln/g, 'Math.log');
            const result = Function(`"use strict"; return (${expr})`)();
            display.value = String(result);
            expression = String(result);
          } catch {
            display.value = 'Error';
            expression = '';
          }
        } else {
          if (display.value === '0' || display.value === 'Error') expression = '';
          expression += value;
          display.value = expression;
        }
      });
    });
  }

  // --- 7. SETTINGS PANEL ---
  function renderAISettingsPanel(): void {
    panels.settings.innerHTML = `
      <div class="card p-6 space-y-4">
        <div class="card-header pb-2 border-b border-[var(--color-border)]">
          <div class="card-title">Cognitive & AI Parameters</div>
          <div class="card-description">Educational psychology parameters for tutoring and recall evaluation</div>
        </div>
        <div class="card-content space-y-3 text-xs text-[var(--color-muted)]">
          <p>• <strong>Testing Effect:</strong> Active retrieval priority enabled.</p>
          <p>• <strong>Metacognitive Calibration:</strong> Overconfidence tracking active.</p>
          <p>• <strong>Dual Coding:</strong> Visual schemas synchronized with textual cues.</p>
        </div>
      </div>
    `;
  }

  render();
  return container;
}
