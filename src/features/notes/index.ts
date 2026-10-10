import { state } from '../../core/state.js';
import { Input, Textarea, Select } from '../../ui/components/Input.js';
import { Tabs } from '../../ui/components/Tabs.js';
import { NOTE_STYLES } from '../../core/config.js';
import { toastSuccess } from '../../ui/components/Toast.js';
import { createIcons } from 'lucide';
import type { Note } from '../../core/types.js';

export function notesFeature(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'space-y-6 animate-fade-in';
  container.id = 'notes-feature';

  container.innerHTML = `
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[var(--color-text)]">Notes</h1>
        <p class="text-[var(--color-muted)]">Capture knowledge with 6 proven methods</p>
      </div>
      <button id="new-note-btn" class="btn-primary" data-lucide="plus">New Note</button>
    </div>

    <div id="note-style-tabs"></div>
    <div id="note-editor" class="hidden"></div>
    <div id="notes-list" class="space-y-4"></div>
  `;

  const styleTabs = container.querySelector('#note-style-tabs') as HTMLDivElement;
  const noteEditor = container.querySelector('#note-editor') as HTMLDivElement;
  const notesList = container.querySelector('#notes-list') as HTMLDivElement;

  let currentStyle = state.getState().currentNoteStyle;
  let searchQuery = '';
  let graphView = false;

  function render(): void {
    const tabsEl = Tabs({
      tabs: NOTE_STYLES.map(s => ({ id: s.id, label: s.label, icon: s.icon })),
      activeTab: currentStyle,
      onChange: (style) => switchStyle(style as any),
      variant: 'pills',
    });
    styleTabs.innerHTML = '';
    styleTabs.appendChild(tabsEl);

    renderEditor();
    renderNotesList();
  }

  function switchStyle(style: string): void {
    currentStyle = style as any;
    state.setCurrentNoteStyle(style as any);
    renderEditor();
  }

  function renderEditor(): void {
    noteEditor.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title">${NOTE_STYLES.find(s => s.id === currentStyle)?.label} Note</div>
          <div class="card-description">Method: ${NOTE_STYLES.find(s => s.id === currentStyle)?.label}</div>
        </div>
        <div class="card-content">
          <form id="note-form" class="space-y-4">
            ${Input({ label: 'Title', placeholder: 'Note title', required: true, id: 'note-title' })}
            ${Select({ label: 'Subject', options: [
              { value: 'Biology', label: 'Biology' },
              { value: 'Mathematics', label: 'Mathematics' },
              { value: 'Physics', label: 'Physics' },
              { value: 'Chemistry', label: 'Chemistry' },
              { value: 'Computer Science', label: 'Computer Science' },
              { value: 'History', label: 'History' },
              { value: 'Other', label: 'Other' }
            ], id: 'note-subject' })}
            ${Input({ label: 'Tags', placeholder: 'comma-separated e.g. exam, chapter1', id: 'note-tags' })}
            <div id="style-editor"></div>
            <div class="flex justify-end gap-2">
              <button type="button" id="cancel-note" class="btn-secondary">Cancel</button>
              <button type="submit" class="btn-primary" data-lucide="save">Save Note</button>
            </div>
          </form>
        </div>
      </div>
    `;

    renderStyleEditor(currentStyle);
    setupNoteForm();
  }

  function renderStyleEditor(style: string): void {
    const editorContainer = noteEditor.querySelector('#style-editor')!;
    const editors: Record<string, string> = {
      freeform: `
        ${Textarea({ label: 'Content', placeholder: 'Write your notes in Markdown...', rows: 12, required: true, id: 'note-content-freeform' })}
      `,
      outline: `
        ${Textarea({ label: 'Outline', placeholder: '# Main Topic\n## Subtopic\n  - Detail\n  - Detail\n## Another Subtopic\n  - Detail', rows: 12, id: 'note-content-outline' })}
      `,
      cornell: `
        <div class="grid gap-4 sm:grid-cols-2">
          ${Textarea({ label: 'Cues / Keywords', placeholder: 'Keywords\nQuestions\nKey terms', rows: 6, id: 'note-cornell-cues' })}
          ${Textarea({ label: 'Notes', placeholder: 'Write lecture notes here...', rows: 6, id: 'note-cornell-notes' })}
        </div>
        <div class="mt-4">
          ${Textarea({ label: 'Summary', placeholder: 'Summarize the main points in 2-3 sentences...', rows: 3, id: 'note-cornell-summary' })}
        </div>
      `,
      mapping: `
        <div class="space-y-4">
          ${Input({ label: 'Central Topic', placeholder: 'e.g., Photosynthesis', id: 'note-mapping-center' })}
          ${Textarea({ label: 'Branches (one per line)', placeholder: 'Light reactions - occurs in thylakoids\nCalvin cycle - occurs in stroma\nChlorophyll - absorbs light energy', rows: 8, id: 'note-mapping-branches' })}
        </div>
      `,
      charting: `
        <div class="space-y-4">
          ${Textarea({ label: 'Data / Table Content', placeholder: 'Topic | Key Features | Examples\nOrganelle | Powerhouse of cell | Mitochondria', rows: 8, id: 'note-chart-data' })}
        </div>
      `,
      boxing: `
        <div class="space-y-4">
          <div id="boxing-container" class="space-y-3"></div>
          <div class="flex gap-2">
            ${Input({ placeholder: 'New box title', id: 'note-box-title' })}
            <button type="button" id="add-box" class="btn-secondary">Add Box</button>
          </div>
        </div>
      `,
      sentence: `
        ${Textarea({ label: 'Sentences', placeholder: 'Photosynthesis converts light energy into chemical energy.\nThe process occurs primarily in the chloroplasts.\nCarbon dioxide and water are the main reactants.', rows: 10, id: 'note-sentence-content' })}
      `,
    };
    editorContainer.innerHTML = editors[style] || editors.freeform;
    setupStyleSpecificHandlers(style);
  }

  function setupStyleSpecificHandlers(style: string): void {
    if (style === 'boxing') {
      noteEditor.querySelector('#add-box')?.addEventListener('click', addBoxingBox);
    }
  }

  function addBoxingBox(): void {
    const titleInput = noteEditor.querySelector('#note-box-title') as HTMLInputElement;
    const title = titleInput.value;
    if (!title) return;
    const boxContainer = noteEditor.querySelector('#boxing-container')!;
    const box = document.createElement('div');
    box.className = 'p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)]';
    box.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <h4 class="font-medium text-sm text-[var(--color-text)]">${title}</h4>
        <button type="button" class="btn-ghost btn-sm" data-remove>×</button>
      </div>
      <textarea class="w-full h-20 p-2 rounded border border-[var(--color-border)] bg-[var(--color-card)] text-sm text-[var(--color-text)] resize-none" placeholder="Content for ${title}..."></textarea>
    `;
    box.querySelector('[data-remove]')?.addEventListener('click', () => box.remove());
    boxContainer.appendChild(box);
    titleInput.value = '';
  }

  function setupNoteForm(): void {
    const form = noteEditor.querySelector('#note-form') as HTMLFormElement;
    const cancelBtn = noteEditor.querySelector('#cancel-note') as HTMLButtonElement;

    cancelBtn.addEventListener('click', () => {
      noteEditor.classList.add('hidden');
      notesList.classList.remove('hidden');
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = (form.querySelector('#note-title') as HTMLInputElement).value;
      const subject = (form.querySelector('#note-subject') as HTMLSelectElement).value;
      const tags = (form.querySelector('#note-tags') as HTMLInputElement).value.split(',').map(t => t.trim()).filter(Boolean);

      let content: any = {};
      switch (currentStyle) {
        case 'freeform':
          content.freeform = (form.querySelector('#note-content-freeform') as HTMLTextAreaElement)?.value || '';
          break;
        case 'outline':
          content.outline = (form.querySelector('#note-content-outline') as HTMLTextAreaElement)?.value || '';
          break;
        case 'cornell':
          content.cornell = {
            cues: (form.querySelector('#note-cornell-cues') as HTMLTextAreaElement)?.value || '',
            notes: (form.querySelector('#note-cornell-notes') as HTMLTextAreaElement)?.value || '',
            summary: (form.querySelector('#note-cornell-summary') as HTMLTextAreaElement)?.value || '',
          };
          break;
        case 'mapping':
          content.mapping = {
            center: (form.querySelector('#note-mapping-center') as HTMLInputElement)?.value || '',
            branches: (form.querySelector('#note-mapping-branches') as HTMLTextAreaElement)?.value.split('\n').filter(Boolean).map(b => ({ id: 'b-' + Date.now(), label: b, children: [] })) || [],
          };
          break;
        case 'charting':
          content.charting = {
            headers: ['Data'],
            rows: [[(form.querySelector('#note-chart-data') as HTMLTextAreaElement)?.value || '']],
          };
          break;
        case 'boxing':
          const boxes = noteEditor.querySelectorAll('#boxing-container > div');
          content.boxing = {
            boxes: Array.from(boxes).map((b, i) => ({
              id: 'box-' + i,
              title: b.querySelector('h4')!.textContent!,
              content: (b.querySelector('textarea') as HTMLTextAreaElement).value,
              x: 0, y: 0, width: 200, height: 100,
            })),
          };
          break;
        case 'sentence':
          content.sentence = (form.querySelector('#note-sentence-content') as HTMLTextAreaElement)?.value.split('\n').filter(Boolean) || [];
          break;
      }

      state.addNote({
        title,
        subject,
        style: currentStyle,
        content,
        tags,
        images: [],
        isFavorite: false,
      });

      toastSuccess('Note saved! +10 XP');
      noteEditor.classList.add('hidden');
      notesList.classList.remove('hidden');
      renderNotesList();
    });
  }

  function renderNotesList(): void {
    const allNotes = state.getState().notes;
    const filteredNotes = allNotes.filter(n => {
      const matchesSearch = !searchQuery || n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.subject.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

    notesList.innerHTML = `
      <div class="card">
        <div class="card-header flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div class="card-title">Knowledge Base (${filteredNotes.length})</div>
            <div class="card-description">Your saved notes across all study styles</div>
          </div>
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <div class="w-full sm:w-64">
              <input type="text" id="note-search" placeholder="Search notes..." value="${searchQuery}" class="w-full text-sm px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-text)]" />
            </div>
            <button id="toggle-graph-btn" class="${graphView ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'} shrink-0" title="Zettelkasten knowledge graph — notes linked by shared tags and subjects">
              <i data-lucide="share-2" class="w-4 h-4 mr-1"></i>${graphView ? 'Graph' : 'List'}
            </button>
          </div>
        </div>
        <div class="card-content">
          ${graphView ? renderKnowledgeGraph(filteredNotes) : `
          ${filteredNotes.length === 0 ? `
            <div class="text-center py-12 text-[var(--color-muted)]">
              <i data-lucide="file-text" class="w-12 h-12 mx-auto mb-4 opacity-50"></i>
              <p>No notes found. Create your first note!</p>
            </div>
          ` : `
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              ${filteredNotes.map(note => `
                <div class="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow">
                  <div>
                    <div class="flex items-center justify-between gap-2 mb-2">
                      <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--color-accent-soft)] text-[var(--color-accent)]">${note.subject}</span>
                      <span class="text-[10px] px-2 py-0.5 rounded bg-[var(--color-border)] text-[var(--color-muted)] uppercase font-mono">${note.style}</span>
                    </div>
                    <h3 class="font-bold text-base text-[var(--color-text)]">${note.title}</h3>
                    <p class="text-xs text-[var(--color-muted)] line-clamp-3 mt-1">${getNotePreview(note)}</p>
                  </div>
                  <div class="flex items-center justify-between pt-3 border-t border-[var(--color-border)] text-xs text-[var(--color-muted)]">
                    <span>${new Date(note.createdAt).toLocaleDateString()}</span>
                    <button data-delete-note="${note.id}" class="text-[var(--color-muted)] hover:text-red-500 p-1" title="Delete Note"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
          `}
        </div>
      </div>
    `;

    notesList.querySelector('#toggle-graph-btn')?.addEventListener('click', () => {
      graphView = !graphView;
      renderNotesList();
    });

    notesList.querySelector('#note-search')?.addEventListener('input', (e) => {
      searchQuery = (e.target as HTMLInputElement).value;
      renderNotesList();
    });

    notesList.querySelectorAll('[data-delete-note]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).dataset.deleteNote!;
        state.deleteNote(id);
        toastSuccess('Note deleted');
        renderNotesList();
      });
    });

    createIcons();
  }

  function getNotePreview(note: Note): string {
    const c = note.content;
    if (c.freeform) return c.freeform;
    if (c.outline) return c.outline;
    if (c.cornell) return `[Summary] ${c.cornell.summary || c.cornell.notes}`;
    if (c.mapping) return `[Topic] ${c.mapping.center} (${c.mapping.branches.length} branches)`;
    if (c.sentence) return c.sentence.join(' ');
    return 'Saved Note';
  }

  function renderKnowledgeGraph(notes: Note[]): string {
    if (notes.length === 0) {
      return `
        <div class="text-center py-12 text-[var(--color-muted)]">
          <i data-lucide="share-2" class="w-12 h-12 mx-auto mb-4 opacity-50"></i>
          <p>No notes to graph. Create notes and link them by tags to see the Zettelkasten graph.</p>
        </div>`;
    }

    const W = 720;
    const H = 420;
    const cx = W / 2;
    const cy = H / 2;
    const radius = Math.min(W, H) / 2 - 70;

    const positions = notes.map((_, i) => {
      const angle = (i / notes.length) * Math.PI * 2 - Math.PI / 2;
      return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
    });

    const edges: { a: number; b: number; strength: number }[] = [];
    for (let i = 0; i < notes.length; i++) {
      for (let j = i + 1; j < notes.length; j++) {
        const sharedTags = notes[i].tags.filter(t => notes[j].tags.includes(t)).length;
        const sameSubject = notes[i].subject === notes[j].subject ? 1 : 0;
        const strength = sharedTags + sameSubject;
        if (strength > 0) edges.push({ a: i, b: j, strength });
      }
    }

    const subjectColors: Record<string, string> = {
      'Biology': '#10b981', 'Mathematics': '#3b82f6', 'Physics': '#8b5cf6',
      'Chemistry': '#f59e0b', 'Computer Science': '#ef4444', 'History': '#64748b',
      'Other': '#6b7280',
    };

    const nodeR = (note: Note) => 10 + Math.min(12, note.tags.length * 2 + getNotePreview(note).length / 80);

    const svg = `
      <svg viewBox="0 0 ${W} ${H}" class="w-full h-auto max-h-[420px]" xmlns="http://www.w3.org/2000/svg">
        ${edges.map(e => {
          const p1 = positions[e.a];
          const p2 = positions[e.b];
          return `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="var(--color-border)" stroke-width="${Math.min(3, e.strength)}" opacity="${Math.min(0.9, 0.3 + e.strength * 0.2)}" />`;
        }).join('')}
        ${notes.map((note, i) => {
          const p = positions[i];
          const color = subjectColors[note.subject] || subjectColors.Other;
          const r = nodeR(note);
          const shortTitle = note.title.length > 18 ? note.title.slice(0, 16) + '…' : note.title;
          return `
            <g class="cursor-pointer" data-graph-note="${note.id}">
              <circle cx="${p.x}" cy="${p.y}" r="${r}" fill="${color}" opacity="0.9" stroke="var(--color-bg)" stroke-width="2" />
              <text x="${p.x}" y="${p.y + r + 12}" text-anchor="middle" class="fill-[var(--color-text)]" font-size="10" font-weight="600">${shortTitle}</text>
            </g>`;
        }).join('')}
      </svg>
      <div class="mt-2 flex flex-wrap gap-3 justify-center text-[10px] text-[var(--color-muted)]">
        ${Array.from(new Set(notes.map(n => n.subject))).map(s => `
          <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full" style="background:${subjectColors[s] || subjectColors.Other}"></span>${s}</span>
        `).join('')}
        <span>${edges.length} links (shared tags & subjects)</span>
      </div>`;

    return `<div class="py-2">${svg}</div>`;
  }

  container.querySelector('#new-note-btn')?.addEventListener('click', () => {
    notesList.classList.add('hidden');
    noteEditor.classList.remove('hidden');
  });

  render();
  return container;
}
