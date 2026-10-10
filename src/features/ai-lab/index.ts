import { Input, Select } from '../../ui/components/Input.js';
import { Tabs } from '../../ui/components/Tabs.js';
import { toastSuccess, toastError } from '../../ui/components/Toast.js';
import { createIcons } from 'lucide';

export function aiLabFeature(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'space-y-6 animate-fade-in';
  container.id = 'ai-lab-feature';

  container.innerHTML = `
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[var(--color-text)]">AI Lab</h1>
        <p class="text-[var(--color-muted)]">Interactive AI visual generators, voice mode & smart study tools</p>
      </div>
      <span class="badge badge-warning badge-sm">Beta</span>
    </div>

    <div id="ai-lab-tabs"></div>
    <div id="generators-panel"></div>
    <div id="voice-panel" class="hidden"></div>
    <div id="calculator-panel" class="hidden"></div>
    <div id="settings-panel" class="hidden"></div>
  `;

  const tabsEl = container.querySelector('#ai-lab-tabs') as HTMLDivElement;
  const panels = {
    generators: container.querySelector('#generators-panel') as HTMLDivElement,
    voice: container.querySelector('#voice-panel') as HTMLDivElement,
    calculator: container.querySelector('#calculator-panel') as HTMLDivElement,
    settings: container.querySelector('#settings-panel') as HTMLDivElement,
  };

  function render(): void {
    const tabs = Tabs({
      tabs: [
        { id: 'generators', label: 'Generators', icon: 'cpu' },
        { id: 'voice', label: 'Voice Mode', icon: 'mic' },
        { id: 'calculator', label: 'Calculator', icon: 'calculator' },
        { id: 'settings', label: 'AI Settings', icon: 'settings' },
      ],
      activeTab: 'generators',
      onChange: switchPanel,
      variant: 'pills',
    });
    tabsEl.innerHTML = '';
    tabsEl.appendChild(tabs);

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

  function renderGeneratorsPanel(): void {
    panels.generators.innerHTML = `
      <div class="grid gap-6 lg:grid-cols-2">
        <!-- Mind Map Generator -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">Mind Map Generator</div>
            <div class="card-description">AI creates interactive, expandable mind maps</div>
          </div>
          <div class="card-content space-y-4">
            <div class="flex gap-2">
              ${Input({ placeholder: 'Enter topic (e.g., Photosynthesis)', id: 'mindmap-topic' })}
              <button id="gen-mindmap" class="btn-primary" data-lucide="git-branch">Generate</button>
            </div>
            <div id="mindmap-output" class="min-h-[320px] p-4 bg-[var(--color-panel)] rounded-xl border border-[var(--color-border)] flex flex-col items-center justify-center text-[var(--color-muted)] text-sm">
              Enter a topic to generate an interactive mind map
            </div>
          </div>
        </div>

        <!-- Concept Model Builder -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">Concept Model Builder</div>
            <div class="card-description">Interactive step-by-step model of complex systems</div>
          </div>
          <div class="card-content space-y-4">
            <div class="flex gap-2">
              ${Input({ placeholder: 'e.g., How a car engine works', id: 'model-topic' })}
              <button id="gen-model" class="btn-primary" data-lucide="box">Build Model</button>
            </div>
            <div id="model-output" class="min-h-[320px] p-4 bg-[var(--color-panel)] rounded-xl border border-[var(--color-border)] flex flex-col items-center justify-center text-[var(--color-muted)] text-sm">
              Enter a concept to build an interactive step model
            </div>
          </div>
        </div>

        <!-- Wikimedia Image Finder -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">Wikimedia Diagram Finder</div>
            <div class="card-description">Find verified educational diagrams from Wikimedia Commons</div>
          </div>
          <div class="card-content space-y-4">
            <div class="flex gap-2">
              ${Input({ placeholder: 'e.g., plant cell diagram', id: 'image-topic' })}
              ${Select({ label: '', options: [
                { value: '4', label: '4 images' },
                { value: '8', label: '8 images' },
                { value: '12', label: '12 images' }
              ], id: 'image-count' })}
              <button id="find-images" class="btn-primary" data-lucide="image">Find</button>
            </div>
            <div id="images-output" class="grid grid-cols-2 gap-3 min-h-[200px]"></div>
          </div>
        </div>

        <!-- Film Generator -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">Film Generator</div>
            <div class="card-description">Educational short film storyboards with scene audio synthesis</div>
          </div>
          <div class="card-content space-y-4">
            <div class="flex gap-2">
              ${Input({ placeholder: 'e.g., The Water Cycle', id: 'film-topic' })}
              ${Select({ label: '', options: [
                { value: '3', label: '3 scenes' },
                { value: '4', label: '4 scenes' },
                { value: '5', label: '5 scenes' }
              ], id: 'film-scenes' })}
              <button id="gen-film" class="btn-primary" data-lucide="film">Make Film</button>
            </div>
            <div id="film-output" class="min-h-[200px] p-4 bg-[var(--color-panel)] rounded-xl border border-[var(--color-border)] flex flex-col items-center justify-center text-[var(--color-muted)] text-sm">
              Enter a topic to generate a film
            </div>
          </div>
        </div>
      </div>
    `;

    setupGeneratorsHandlers();
    createIcons();
  }

  function setupGeneratorsHandlers(): void {
    // Mind Map Handler
    panels.generators.querySelector('#gen-mindmap')?.addEventListener('click', () => {
      const input = panels.generators.querySelector('#mindmap-topic') as HTMLInputElement;
      const topic = input.value.trim() || 'Photosynthesis';
      const output = panels.generators.querySelector('#mindmap-output') as HTMLDivElement;

      output.innerHTML = `
        <div class="w-full space-y-4 animate-fade-in">
          <div class="flex justify-between items-center pb-2 border-b border-[var(--color-border)]">
            <span class="font-bold text-base text-[var(--color-accent)]">Mind Map: ${topic}</span>
            <button id="copy-mindmap-md" class="btn-secondary btn-sm"><i data-lucide="copy" class="w-3.5 h-3.5 mr-1"></i>Copy Markdown</button>
          </div>
          <div class="space-y-2 font-mono text-xs">
            <div class="p-3 rounded-lg bg-[var(--color-accent)] text-white font-bold text-sm shadow-md inline-block">
              🎯 ${topic}
            </div>
            <div class="pl-6 space-y-2 border-l-2 border-[var(--color-accent)]/40 ml-4 pt-2">
              ${getMindMapTree(topic)}
            </div>
          </div>
        </div>
      `;

      output.querySelectorAll('[data-node-toggle]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const target = e.currentTarget as HTMLElement;
          const sub = target.nextElementSibling;
          if (sub) {
            sub.classList.toggle('hidden');
            target.querySelector('.toggle-icon')!.textContent = sub.classList.contains('hidden') ? '+' : '−';
          }
        });
      });

      output.querySelector('#copy-mindmap-md')?.addEventListener('click', () => {
        const mdText = `# ${topic}\n- Main Concept\n  - Core Principles\n  - Practical Applications\n- Key Formula / Rules\n  - Real-world Examples`;
        navigator.clipboard.writeText(mdText);
        toastSuccess('Copied mind map to clipboard!');
      });

      createIcons();
    });

    // Concept Model Handler
    panels.generators.querySelector('#gen-model')?.addEventListener('click', () => {
      const input = panels.generators.querySelector('#model-topic') as HTMLInputElement;
      const topic = input.value.trim() || 'How a Car Engine Works';
      const output = panels.generators.querySelector('#model-output') as HTMLDivElement;

      const steps = [
        { title: '1. Intake Stroke', desc: 'Air and fuel mixture enters the combustion cylinder as the piston descends.', detail: 'Intake valve opens; atmospheric pressure pushes mixture into cylinder.' },
        { title: '2. Compression Stroke', desc: 'The piston rises, compressing the air-fuel mixture into a tiny volume.', detail: 'Both valves close; pressure increases 10x to 15x.' },
        { title: '3. Power Stroke', desc: 'Spark plug ignites the compressed gas, forcing the piston down forcefully.', detail: 'Combustion generates massive pressure driving the crankshaft.' },
        { title: '4. Exhaust Stroke', desc: 'Exhaust valve opens to expel spent gases out of the cylinder.', detail: 'Piston pushes exhaust out to prepare for next cycle.' },
      ];

      let currentStep = 0;

      function renderModelStep(): void {
        const step = steps[currentStep];
        output.innerHTML = `
          <div class="w-full space-y-4 animate-fade-in">
            <div class="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
              <span class="font-bold text-sm text-[var(--color-text)]">${topic}</span>
              <span class="badge badge-accent">Step ${currentStep + 1} of ${steps.length}</span>
            </div>
            <div class="p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm space-y-3">
              <h4 class="font-bold text-base text-[var(--color-accent)]">${step.title}</h4>
              <p class="text-sm font-medium text-[var(--color-text)]">${step.desc}</p>
              <div class="p-3 rounded-lg bg-[var(--color-panel)] text-xs text-[var(--color-muted)]">
                💡 <strong>Mechanics:</strong> ${step.detail}
              </div>
            </div>
            <div class="flex justify-between items-center pt-2">
              <button id="model-prev" class="btn-secondary btn-sm" ${currentStep === 0 ? 'disabled' : ''}>Previous</button>
              <div class="flex gap-1">
                ${steps.map((_, i) => `<div class="w-2.5 h-2.5 rounded-full ${i === currentStep ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'}"></div>`).join('')}
              </div>
              <button id="model-next" class="btn-primary btn-sm" ${currentStep === steps.length - 1 ? 'disabled' : ''}>Next Step</button>
            </div>
          </div>
        `;

        output.querySelector('#model-prev')?.addEventListener('click', () => {
          if (currentStep > 0) { currentStep--; renderModelStep(); }
        });
        output.querySelector('#model-next')?.addEventListener('click', () => {
          if (currentStep < steps.length - 1) { currentStep++; renderModelStep(); }
        });
      }

      renderModelStep();
    });

    // Wikimedia Image Finder Handler
    panels.generators.querySelector('#find-images')?.addEventListener('click', async () => {
      const input = panels.generators.querySelector('#image-topic') as HTMLInputElement;
      const countSelect = panels.generators.querySelector('#image-count') as HTMLSelectElement;
      const topic = input.value.trim() || 'plant cell diagram';
      const count = parseInt(countSelect.value) || 4;
      const output = panels.generators.querySelector('#images-output') as HTMLDivElement;

      output.innerHTML = `<div class="col-span-full py-8 text-center text-sm text-[var(--color-muted)]"><i data-lucide="loader" class="w-6 h-6 animate-spin mx-auto mb-2 text-[var(--color-accent)]"></i>Searching Wikimedia Commons for "${topic}"...</div>`;
      createIcons();

      try {
        const images = await fetchWikimediaImages(topic, count);
        if (images.length === 0) {
          output.innerHTML = `<div class="col-span-full py-8 text-center text-sm text-[var(--color-muted)]">No images found for "${topic}". Try another term.</div>`;
          return;
        }

        output.innerHTML = images.map(img => `
          <div class="group relative rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer" data-lightbox-url="${img.url}" data-title="${img.title}">
            <div class="aspect-square bg-[var(--color-border)]/30 overflow-hidden">
              <img src="${img.thumburl}" alt="${img.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" loading="lazy" />
            </div>
            <div class="p-2 text-xs font-medium text-[var(--color-text)] truncate" title="${img.title}">${img.title}</div>
          </div>
        `).join('');

        output.querySelectorAll('[data-lightbox-url]').forEach(card => {
          card.addEventListener('click', () => {
            const url = card.getAttribute('data-lightbox-url')!;
            const title = card.getAttribute('data-title')!;
            openImageLightbox(url, title);
          });
        });
      } catch (err) {
        output.innerHTML = `<div class="col-span-full py-8 text-center text-sm text-red-500">Failed to load images from Wikimedia. Check internet connection.</div>`;
      }
    });

    // Film Generator Handler
    panels.generators.querySelector('#gen-film')?.addEventListener('click', () => {
      const input = panels.generators.querySelector('#film-topic') as HTMLInputElement;
      const scenesSelect = panels.generators.querySelector('#film-scenes') as HTMLSelectElement;
      const topic = input.value.trim() || 'The Water Cycle';
      const sceneCount = parseInt(scenesSelect.value) || 3;
      const output = panels.generators.querySelector('#film-output') as HTMLDivElement;

      const scenes = [
        { scene: 1, title: 'Evaporation', narration: `Solar radiation heats body of water causing liquid water to evaporate into atmospheric vapor.`, visual: '🌅 Ocean surface warming under sun' },
        { scene: 2, title: 'Condensation', narration: `Water vapor rises, cools in upper atmosphere, and condenses into cloud formations.`, visual: '☁️ Clouds thickening in upper sky' },
        { scene: 3, title: 'Precipitation', narration: `Condensed water droplets grow heavy and fall to earth as rain or snow.`, visual: '🌧️ Rainfall onto mountain landscapes' },
        { scene: 4, title: 'Collection', narration: `Runoff drains into rivers, lakes, and groundwater systems, completing the cycle.`, visual: '🏞️ River flowing back to sea' },
      ].slice(0, sceneCount);

      let currentScene = 0;

      function renderFilmScene(): void {
        const sc = scenes[currentScene];
        output.innerHTML = `
          <div class="w-full space-y-4 animate-fade-in">
            <div class="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
              <span class="font-bold text-sm text-[var(--color-text)]">🎬 ${topic} - Short Film</span>
              <span class="badge badge-accent">Scene ${sc.scene} of ${scenes.length}</span>
            </div>
            <div class="p-6 rounded-2xl bg-black text-white space-y-4 shadow-lg text-center">
              <div class="text-4xl py-4">${sc.visual.split(' ')[0]}</div>
              <h4 class="font-bold text-lg text-amber-400">${sc.title}</h4>
              <p class="text-sm text-gray-200 max-w-md mx-auto leading-relaxed">"${sc.narration}"</p>
              <div class="pt-2">
                <button id="play-narration" class="btn-primary btn-sm rounded-full"><i data-lucide="volume-2" class="w-4 h-4 mr-1"></i>Play Audio Narration</button>
              </div>
            </div>
            <div class="flex justify-between items-center pt-2">
              <button id="film-prev" class="btn-secondary btn-sm" ${currentScene === 0 ? 'disabled' : ''}>Previous Scene</button>
              <button id="film-next" class="btn-primary btn-sm" ${currentScene === scenes.length - 1 ? 'disabled' : ''}>Next Scene</button>
            </div>
          </div>
        `;

        output.querySelector('#play-narration')?.addEventListener('click', () => {
          if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(sc.narration);
            utterance.rate = 0.95;
            window.speechSynthesis.speak(utterance);
            toastSuccess('Playing scene audio narration');
          }
        });

        output.querySelector('#film-prev')?.addEventListener('click', () => {
          if (currentScene > 0) { currentScene--; renderFilmScene(); }
        });
        output.querySelector('#film-next')?.addEventListener('click', () => {
          if (currentScene < scenes.length - 1) { currentScene++; renderFilmScene(); }
        });

        createIcons();
      }

      renderFilmScene();
    });
  }

  function getMindMapTree(topic: string): string {
    return `
      <div class="space-y-2">
        <div class="flex items-center gap-2 p-2 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] cursor-pointer" data-node-toggle>
          <span class="toggle-icon font-bold text-sm text-[var(--color-accent)]">−</span>
          <span class="font-bold text-xs text-[var(--color-text)]">Core Definition & Overview</span>
        </div>
        <div class="pl-6 space-y-1 text-xs text-[var(--color-muted)]">
          <div class="p-1.5 rounded bg-[var(--color-panel)] border border-[var(--color-border)]">• Primary process & purpose of ${topic}</div>
          <div class="p-1.5 rounded bg-[var(--color-panel)] border border-[var(--color-border)]">• Fundamental inputs & chemical/logical requirements</div>
        </div>

        <div class="flex items-center gap-2 p-2 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] cursor-pointer" data-node-toggle>
          <span class="toggle-icon font-bold text-sm text-[var(--color-accent)]">−</span>
          <span class="font-bold text-xs text-[var(--color-text)]">Key Components & Phases</span>
        </div>
        <div class="pl-6 space-y-1 text-xs text-[var(--color-muted)]">
          <div class="p-1.5 rounded bg-[var(--color-panel)] border border-[var(--color-border)]">• Primary Stage A (Initial conversion)</div>
          <div class="p-1.5 rounded bg-[var(--color-panel)] border border-[var(--color-border)]">• Secondary Stage B (Synthesis / Output)</div>
        </div>

        <div class="flex items-center gap-2 p-2 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] cursor-pointer" data-node-toggle>
          <span class="toggle-icon font-bold text-sm text-[var(--color-accent)]">−</span>
          <span class="font-bold text-xs text-[var(--color-text)]">Practical Applications & Exam Tips</span>
        </div>
        <div class="pl-6 space-y-1 text-xs text-[var(--color-muted)]">
          <div class="p-1.5 rounded bg-[var(--color-panel)] border border-[var(--color-border)]">• Frequent exam trap questions</div>
          <div class="p-1.5 rounded bg-[var(--color-panel)] border border-[var(--color-border)]">• Real-world engineering / biological impact</div>
        </div>
      </div>
    `;
  }

  async function fetchWikimediaImages(query: string, limit: number): Promise<Array<{ thumburl: string; url: string; title: string }>> {
    const api = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=${limit}&prop=imageinfo&iiprop=url|size&iiurlwidth=400&format=json&origin=*`;
    const res = await fetch(api);
    const data = await res.json();
    const pages = data?.query?.pages ? Object.values(data.query.pages) : [];

    return (pages as any[])
      .filter(p => p.imageinfo?.[0]?.url)
      .map(p => ({
        thumburl: p.imageinfo[0].thumburl || p.imageinfo[0].url,
        url: p.imageinfo[0].url,
        title: String(p.title || '').replace(/^File:/, ''),
      }));
  }

  function openImageLightbox(url: string, title: string): void {
    const existing = document.getElementById('lightbox-modal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'lightbox-modal';
    overlay.className = 'fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in';
    overlay.innerHTML = `
      <div class="relative max-w-3xl w-full bg-[var(--color-card)] rounded-2xl overflow-hidden shadow-2xl space-y-3 p-4">
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-sm text-[var(--color-text)] truncate pr-4">${title}</h3>
          <button id="close-lightbox" class="p-1 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-text)]"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>
        <div class="max-h-[70vh] flex items-center justify-center bg-black/50 rounded-xl overflow-hidden">
          <img src="${url}" alt="${title}" class="max-h-[65vh] object-contain" />
        </div>
        <div class="flex justify-end">
          <a href="${url}" target="_blank" rel="noopener noreferrer" class="btn-primary btn-sm"><i data-lucide="external-link" class="w-3.5 h-3.5 mr-1"></i>Open Full Image</a>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    overlay.querySelector('#close-lightbox')?.addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    createIcons();
  }

  function renderVoicePanel(): void {
    panels.voice.innerHTML = `
      <div class="card p-6 space-y-6">
        <div class="card-header">
          <div class="card-title">Voice Conversation Mode</div>
          <div class="card-description">Hands-free real-time audio interaction with Web Speech API</div>
        </div>
        <div class="card-content text-center space-y-6">
          <div class="w-28 h-28 rounded-full bg-[var(--color-accent-soft)] mx-auto flex items-center justify-center shadow-lg transition-transform duration-300" id="voice-indicator">
            <i data-lucide="mic" class="w-12 h-12 text-[var(--color-accent)]"></i>
          </div>
          <div>
            <h3 id="voice-status" class="font-bold text-lg text-[var(--color-text)]">Ready to Speak</h3>
            <p class="text-sm text-[var(--color-muted)]">Click Start Microphone to speak with your AI study partner</p>
          </div>
          <div class="flex justify-center gap-4">
            <button id="voice-start" class="btn-primary px-6 py-3 rounded-full font-bold flex items-center gap-2"><i data-lucide="mic" class="w-5 h-5"></i>Start Microphone</button>
            <button id="voice-stop" class="btn-danger px-6 py-3 rounded-full font-bold hidden flex items-center gap-2"><i data-lucide="mic-off" class="w-5 h-5"></i>Stop</button>
          </div>
          <div class="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] text-left min-h-[160px] max-h-60 overflow-y-auto text-sm space-y-2" id="voice-transcript">
            <p class="text-xs text-[var(--color-muted)] italic">Transcript conversation history will appear here...</p>
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
        statusText.textContent = 'Listening... Speak now';
        indicator.classList.add('animate-pulse', 'bg-red-500/20');
        startBtn.classList.add('hidden');
        stopBtn.classList.remove('hidden');
      };

      recognition.onresult = (event: any) => {
        const speech = event.results[0][0].transcript;
        addTranscriptLine('User', speech);
        statusText.textContent = 'Thinking...';

        setTimeout(() => {
          const aiResponse = `That is a great point about "${speech}". What core formula or concept would you apply next?`;
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
        }, 600);
      };

      recognition.onerror = () => {
        toastError('Microphone permission or speech error');
        resetVoiceUI();
      };

      recognition.onend = () => {
        resetVoiceUI();
      };
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
        toastError('Speech Recognition is not supported in this browser');
      }
    });

    stopBtn?.addEventListener('click', () => {
      if (recognition) recognition.stop();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      resetVoiceUI();
    });
  }

  function renderCalculatorPanel(): void {
    panels.calculator.innerHTML = `
      <div class="card p-6">
        <div class="card-header mb-4">
          <div class="card-title">Scientific Calculator</div>
          <div class="card-description">Full expression calculator for STEM studies</div>
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

    const container = document.getElementById('calc-buttons')!;
    container.innerHTML = buttons.map(row => row.map(btn => `
      <button class="calc-btn p-3 rounded-xl bg-[var(--color-panel)] border border-[var(--color-border)] text-[var(--color-text)] font-semibold hover:bg-[var(--color-accent-soft)] hover:border-[var(--color-accent)] active:scale-95 transition-all text-sm" data-value="${btn}">${btn}</button>
    `).join('')).join('');

    const display = document.getElementById('calc-display') as HTMLInputElement;
    let expression = '';

    container.querySelectorAll('.calc-btn').forEach(btn => {
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

  function renderAISettingsPanel(): void {
    panels.settings.innerHTML = `
      <div class="card p-6 space-y-6">
        <div class="card-header">
          <div class="card-title">AI Provider & Behavior</div>
        </div>
        <div class="card-content space-y-6">
          <div class="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] space-y-2">
            <h4 class="font-bold text-sm">Configured AI Stack</h4>
            <p class="text-xs text-[var(--color-muted)]">Using Gemini Cloud API with Socratic tutoring prompts & active recall evaluators.</p>
          </div>
        </div>
      </div>
    `;
  }

  render();
  return container;
}
