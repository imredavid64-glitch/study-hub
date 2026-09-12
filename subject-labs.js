/* ===== SUBJECT LABS & TOPICS =====
 * Interactive tools for the Subjects tab, loaded after app.js.
 * Depends on app.js globals: $, qsa, groqChat, escapeHtml, showToast,
 * formatInline, logErrors, state, saveState. */
function setupSubjectLabs() {
  setupLabTabs();
  setupPhysicsLab();
  setupChemistryLab();
  setupBiologyLab();
  setupCodePlayground();
  setupCsTopics();
  setupMiniTerm();
  setupBookLibrary();
  setupLiteraryAnalysis();
  setupPrimarySource();
  setupHealthTopics();
}

/* ---------- Lab tab switching ---------- */
function setupLabTabs() {
  qsa('.lab-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      qsa('.lab-tab').forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      qsa('.lab-panel').forEach(function(p) { p.classList.add('hidden'); });
      var panel = document.getElementById('lab-' + tab.dataset.lab);
      if (panel) panel.classList.remove('hidden');
    });
  });
}

/* ---------- Physics: projectile motion ---------- */
function setupPhysicsLab() {
  var canvas = document.getElementById('labPhysicsCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var angleEl = $('labAngle'), speedEl = $('labSpeed'), gravEl = $('labGravity');
  var angleVal = $('labAngleVal'), speedVal = $('labSpeedVal'), gravVal = $('labGravityVal');
  var readout = $('labPhysicsReadout');
  var fireBtn = $('labFireBtn'), resetBtn = $('labResetBtn');
  function label() {
    if (angleVal) angleVal.textContent = angleEl.value + '°';
    if (speedVal) speedVal.textContent = speedEl.value;
    if (gravVal) gravVal.textContent = gravEl.value;
  }
  [angleEl, speedEl, gravEl].forEach(function(el) { if (el) el.addEventListener('input', label); });
  label();

  var W = 640, H = 300;
  canvas.width = W * 2; canvas.height = H * 2;
  canvas.style.width = '100%'; canvas.style.height = 'auto';
  ctx.scale(2, 2);

  var groundY = H - 24;
  var shot = null;
  function drawFrame() {
    ctx.clearRect(0, 0, W, H);
    // sky
    var sky = ctx.createLinearGradient(0, 0, 0, groundY);
    sky.addColorStop(0, '#dbeafe'); sky.addColorStop(1, '#f0f9ff');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, groundY);
    // ground
    ctx.fillStyle = '#94a3b8'; ctx.fillRect(0, groundY, W, H - groundY);
    ctx.fillStyle = '#64748b'; ctx.fillRect(0, groundY, W, 2);
    // launcher
    ctx.fillStyle = '#334155';
    ctx.fillRect(20, groundY - 18, 14, 18);
    // projectile
    if (shot) {
      ctx.fillStyle = '#dc2626';
      ctx.beginPath(); ctx.arc(shot.x, shot.y, 6, 0, Math.PI * 2); ctx.fill();
      // trail
      ctx.fillStyle = 'rgba(220,38,38,0.25)';
      shot.trail.forEach(function(t) { ctx.beginPath(); ctx.arc(t.x, t.y, 3, 0, Math.PI * 2); ctx.fill(); });
      if (readout) {
        readout.textContent = 'Height: ' + Math.max(0, Math.round(groundY - shot.maxH)) + 'px · Range: ' + Math.round(shot.range) + 'px · Time: ' + shot.t.toFixed(1) + 's';
      }
    }
  }
  function reset() { shot = null; if (readout) readout.textContent = 'Set the angle, speed and gravity, then launch. Watch the range change!'; drawFrame(); }
  if (resetBtn) resetBtn.addEventListener('click', reset);
  if (fireBtn) fireBtn.addEventListener('click', function() {
    var angle = parseFloat(angleEl.value) * Math.PI / 180;
    var v = parseFloat(speedEl.value);
    var g = parseFloat(gravEl.value);
    var x0 = 34, y0 = groundY - 18;
    shot = { x: x0, y: y0, vx: v * Math.cos(angle) * 5, vy: -(v * Math.sin(angle) * 5), g: g * 0.35, t: 0, trail: [], maxH: y0, range: 0 };
    var anim = setInterval(function() {
      if (!shot) { clearInterval(anim); return; }
      shot.t += 0.1;
      var prevX = shot.x, prevY = shot.y;
      shot.x += shot.vx * 0.1;
      shot.y += shot.vy * 0.1;
      shot.vy += shot.g * 0.1;
      if (shot.y > y0) shot.y = y0;
      if (shot.y < shot.maxH) shot.maxH = shot.y;
      shot.range = Math.max(shot.range, shot.x - x0);
      shot.trail.push({ x: (prevX + shot.x) / 2, y: (prevY + shot.y) / 2 });
      if (shot.trail.length > 40) shot.trail.shift();
      drawFrame();
      if (shot.y >= y0 && shot.vy > 0) { clearInterval(anim); drawFrame(); }
    }, 16);
  });
  drawFrame();
}

/* ---------- Chemistry: periodic table + pH ---------- */
function setupChemistryLab() {
  var grid = $('labPeriodic'), info = $('labElementInfo');
  if (!grid) return;
  var elements = [
    { n: 1, s: 'H', name: 'Hydrogen', m: 1.008, cat: 'Nonmetal', use: 'Fuel, water, acids' },
    { n: 2, s: 'He', name: 'Helium', m: 4.003, cat: 'Noble gas', use: 'Balloons, cooling magnets' },
    { n: 3, s: 'Li', name: 'Lithium', m: 6.94, cat: 'Alkali metal', use: 'Batteries' },
    { n: 4, s: 'Be', name: 'Beryllium', m: 9.012, cat: 'Alkaline earth', use: 'Aerospace alloys' },
    { n: 5, s: 'B', name: 'Boron', m: 10.81, cat: 'Metalloid', use: 'Glass, detergents' },
    { n: 6, s: 'C', name: 'Carbon', m: 12.01, cat: 'Nonmetal', use: 'All life, diamonds, fuels' },
    { n: 7, s: 'N', name: 'Nitrogen', m: 14.01, cat: 'Nonmetal', use: '78% of air, fertilizers' },
    { n: 8, s: 'O', name: 'Oxygen', m: 16.0, cat: 'Nonmetal', use: 'Breathing, burning' },
    { n: 9, s: 'F', name: 'Fluorine', m: 18.998, cat: 'Halogen', use: 'Toothpaste, Teflon' },
    { n: 10, s: 'Ne', name: 'Neon', m: 20.18, cat: 'Noble gas', use: 'Signs and lights' },
    { n: 11, s: 'Na', name: 'Sodium', m: 22.99, cat: 'Alkali metal', use: 'Table salt (NaCl)' },
    { n: 12, s: 'Mg', name: 'Magnesium', m: 24.31, cat: 'Alkaline earth', use: 'Light alloys, flares' },
    { n: 13, s: 'Al', name: 'Aluminium', m: 26.98, cat: 'Post-transition', use: 'Foil, cans, planes' },
    { n: 14, s: 'Si', name: 'Silicon', m: 28.09, cat: 'Metalloid', use: 'Computer chips' },
    { n: 15, s: 'P', name: 'Phosphorus', m: 30.97, cat: 'Nonmetal', use: 'DNA, matches' },
    { n: 16, s: 'S', name: 'Sulfur', m: 32.06, cat: 'Nonmetal', use: 'Acid rain, rubber' },
    { n: 17, s: 'Cl', name: 'Chlorine', m: 35.45, cat: 'Halogen', use: 'Disinfecting water' },
    { n: 18, s: 'Ar', name: 'Argon', m: 39.95, cat: 'Noble gas', use: 'Light bulbs, welding' },
    { n: 19, s: 'K', name: 'Potassium', m: 39.1, cat: 'Alkali metal', use: 'Bananas, fertilizers' },
    { n: 20, s: 'Ca', name: 'Calcium', m: 40.08, cat: 'Alkaline earth', use: 'Bones, teeth, concrete' }
  ];
  var html = '';
  elements.forEach(function(el) {
    html += '<button class="el-tile" data-n="' + el.n + '" title="' + el.name + '"><b>' + el.s + '</b><small>' + el.n + '</small></button>';
  });
  grid.innerHTML = html;
  grid.addEventListener('click', function(e) {
    var tile = e.target.closest('.el-tile');
    if (!tile) return;
    qsa('.el-tile', grid).forEach(function(t) { t.classList.remove('active'); });
    tile.classList.add('active');
    var el = elements.find(function(x) { return x.n === +tile.dataset.n; });
    if (el && info) {
      info.innerHTML = '<h4>' + el.s + ' — ' + el.name + '</h4>' +
        '<div class="el-facts"><span>Atomic number: <b>' + el.n + '</b></span><span>Mass: <b>' + el.m + ' u</b></span><span>Category: <b>' + el.cat + '</b></span></div>' +
        '<p class="subtle">Everyday use: ' + el.use + '</p>';
    }
  });

  // pH scale
  var phEl = $('labPh'), phVal = $('labPhVal'), phBar = $('labPhBar');
  if (phEl && phBar) {
    function renderPh() {
      var v = +phEl.value;
      var label = v === 7 ? 'neutral' : (v < 7 ? 'acidic' : 'basic/alkaline');
      if (phVal) phVal.textContent = v + ' — ' + label;
      var stops = [
        '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981',
        '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'
      ];
      phBar.style.background = 'linear-gradient(to right, ' + stops.join(', ') + ')';
      var pct = (v / 14) * 100;
      phBar.innerHTML = '<span style="left:' + pct + '%"></span>';
      var examples = { 0: 'battery acid', 1: 'stomach acid', 2: 'lemon juice', 3: 'vinegar', 4: 'tomato juice', 5: 'coffee', 6: 'milk', 7: 'pure water', 8: 'seawater', 9: 'baking soda', 10: 'soap', 11: 'ammonia', 12: 'bleach', 13: 'drain cleaner', 14: 'lye' };
      if (phVal) phVal.textContent = v + ' — ' + label + ' (e.g. ' + examples[v] + ')';
    }
    phEl.addEventListener('input', renderPh);
    renderPh();
  }
}

/* ---------- Biology: cell explorer ---------- */
function setupBiologyLab() {
  var cell = $('labCell'), info = $('labCellInfo');
  if (!cell || !info) return;
  var facts = {
    nucleus: { name: 'Nucleus', d: 'The control centre. It stores DNA and tells the cell what to do.', color: '#7c3aed' },
    membrane: { name: 'Cell Membrane', d: 'The outer gate. It controls what enters and leaves the cell.', color: '#0ea5e9' },
    mitochondria: { name: 'Mitochondria', d: 'The power plant. It turns food into energy (ATP) — the cell\'s battery.', color: '#dc2626' },
    ribosome: { name: 'Ribosome', d: 'The factory. It builds proteins from instructions in the DNA.', color: '#059669' },
    er: { name: 'Endoplasmic Reticulum', d: 'The delivery highway. It transports proteins and lipids around the cell.', color: '#d97706' },
    golgi: { name: 'Golgi Apparatus', d: 'The post office. It packages and ships proteins to where they\'re needed.', color: '#2563eb' }
  };
  qsa('.cell-part', cell).forEach(function(b) {
    b.addEventListener('click', function() {
      qsa('.cell-part', cell).forEach(function(x) { x.classList.remove('active'); });
      b.classList.add('active');
      var f = facts[b.dataset.part];
      if (f) info.innerHTML = '<h4 style="color:' + f.color + '">' + f.name + '</h4><p>' + f.d + '</p>';
    });
  });
  if (info) info.innerHTML = 'Click a labelled part…';
}

/* ---------- Tech: code playground ---------- */
function setupCodePlayground() {
  var editor = $('codeEditor'), out = $('codeOutput'), runBtn = $('codeRunBtn');
  var tpl = $('codeTemplate'), resetBtn = $('codeResetBtn'), fixBtn = $('codeFixBtn'), chalBtn = $('codeChallengeBtn');
  if (!editor || !out) return;
  var templates = {
    blank: '<!-- Write your page here. Add <style> and <script> blocks as you like. -->\n<h1>My page</h1>\n<p>Start editing!</p>',
    hello: '<h1>Hello, world! 👋</h1>\n<style>\n  body { font-family: sans-serif; text-align: center; margin-top: 80px; }\n  button { padding: 10px 18px; font-size: 16px; cursor: pointer; border: none; border-radius: 8px; background: #0f766e; color: #fff; }\n</style>\n<button onclick="document.querySelector(\'p\').textContent = \'You clicked! 🎉\'">Click me</button>\n<p>Press the button.</p>',
    canvas: '<canvas id="c" width="400" height="200"></canvas>\n<style> canvas { border: 1px solid #ccc; display: block; margin: 20px auto; } </style>\n<scr'+'ipt>\n  const c = document.getElementById(\'c\');\n  const ctx = c.getContext(\'2d\');\n  let x = 0, dir = 1;\n  setInterval(() => {\n    ctx.clearRect(0, 0, 400, 200);\n    ctx.fillStyle = \'#0f766e\';\n    ctx.beginPath();\n    ctx.arc(x, 100, 20, 0, Math.PI * 2);\n    ctx.fill();\n    x += dir * 3;\n    if (x > 380 || x < 20) dir *= -1;\n  }, 16);\n</scr'+'ipt>',
    quiz: '<h2>Pop quiz!</h2>\n<style> body { font-family: sans-serif; } .q { margin: 10px 0; } </style>\n<div class="q"><b>1. What is 2 + 2?</b><br>\n  <button onclick="check(0, true)">4</button>\n  <button onclick="check(0, false)">5</button></div>\n<p id="score"></p>\n<scr'+'ipt>\n  let score = 0;\n  function check(q, correct) {\n    if (correct) score++;\n    document.getElementById(\'score\').textContent = \'Score: \' + score;\n  }\n</scr'+'ipt>',
    counter: '<h2>Counter</h2>\n<style> body { font-family: sans-serif; text-align: center; } button { font-size: 20px; margin: 4px; padding: 8px 16px; } #n { font-size: 40px; } </style>\n<div id="n">0</div>\n<button onclick="add(1)">+1</button>\n<button onclick="add(-1)">-1</button>\n<scr'+'ipt>\n  let n = 0;\n  function add(d) { n += d; document.getElementById(\'n\').textContent = n; }\n</scr'+'ipt>',
    todolist: '<h2>To-do list</h2>\n<style> body { font-family: sans-serif; } li { cursor: pointer; } .done { text-decoration: line-through; color: #888; } </style>\n<input id="new" placeholder="Add a task…" />\n<button onclick="addTodo()">Add</button>\n<ul id="list"></ul>\n<scr'+'ipt>\n  function addTodo() {\n    const inp = document.getElementById(\'new\');\n    if (!inp.value.trim()) return;\n    const li = document.createElement(\'li\');\n    li.textContent = inp.value;\n    li.onclick = () => li.classList.toggle(\'done\');\n    document.getElementById(\'list\').appendChild(li);\n    inp.value = \'\';\n  }\n</scr'+'ipt>'
  };
  var challenges = [
    { t: 'Build a page that shows your name in a big colored heading', hint: 'Use an <h1> tag with a <style> block to color it.' },
    { t: 'Make a button that changes the page background color when clicked', hint: 'Use onclick with document.body.style.background.' },
    { t: 'Create a counter that goes up and down', hint: 'Track a number in a <script> and update the page.' },
    { t: 'Draw a bouncing ball on a canvas', hint: 'Use requestAnimationFrame or setInterval with a canvas.' },
    { t: 'Build a mini quiz with at least two questions', hint: 'Use buttons with onclick and a score variable.' },
    { t: 'Make a to-do list where you can add and tick off items', hint: 'Create <li> elements with addTodo().' }
  ];
  function run() {
    var code = editor.value;
    var doc = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;font-family:system-ui,sans-serif}</style></head><body>' + code + '</body></html>';
    out.srcdoc = doc;
  }
  if (runBtn) runBtn.addEventListener('click', run);
  if (tpl) tpl.addEventListener('change', function() {
    if (templates[tpl.value] !== undefined) { editor.value = templates[tpl.value]; run(); }
  });
  if (resetBtn) resetBtn.addEventListener('click', function() {
    if (tpl && templates[tpl.value] !== undefined) editor.value = templates[tpl.value];
    run();
  });
  if (chalBtn) chalBtn.addEventListener('click', function() {
    var c = challenges[Math.floor(Math.random() * challenges.length)];
    editor.value = '<!-- Challenge: ' + c.t + ' -->\n<!-- Hint: ' + c.hint + ' -->\n';
    run();
    showToast('Challenge: ' + c.t);
  });
  if (fixBtn) fixBtn.addEventListener('click', function() {
    var code = editor.value;
    if (!code.trim()) { showToast('Write some code first.'); return; }
    fixBtn.disabled = true;
    var orig = fixBtn.textContent;
    fixBtn.textContent = 'Analyzing…';
    groqChat([{ role: 'system', content: 'You are a patient coding tutor. Look at the student\'s HTML/CSS/JS code. If there is a bug, explain it simply and give the fixed version. If it works, say what it does well and suggest ONE small improvement. Keep it short and friendly, under 180 words. Use plain text with short lines.' }, { role: 'user', content: 'Code:\n' + code }], { maxTokens: 700, temperature: 0.4 }).then(function(txt) {
      var box = document.createElement('div');
      box.className = 'ai-fix-box';
      box.innerHTML = '<strong><span class="icon icon-sm icon-ai"></span> AI feedback</strong><div style="white-space:pre-wrap;margin-top:6px">' + escapeHtml(txt) + '</div>';
      editor.parentNode.insertBefore(box, editor.nextSibling);
      setTimeout(function() { box.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 50);
    }).catch(function(err) {
      showToast('AI is unavailable right now — try again in a moment.');
      logErrors('codefix')(err);
    }).finally(function() {
      fixBtn.disabled = false;
      fixBtn.textContent = orig;
    });
  });
  // init
  editor.value = templates.hello;
  run();
  editor.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); }
  });
}

/* ---------- Tech: CS topics ---------- */
function setupCsTopics() {
  var btn = $('csExplainBtn'), sel = $('csTopic'), out = $('csResult');
  if (!btn || !sel || !out) return;
  var local = {
    algorithms: ['Algorithms are step-by-step recipes for solving problems.', 'Big-O measures how fast an algorithm scales — O(n) means "twice the input, twice the work", O(log n) is lightning fast, O(n²) is slow for big inputs.', 'Sorting and searching are the classic starting examples.'].join('\n\n'),
    web: ['When you type a URL, your browser asks a DNS server where the site lives, connects to that server, and requests the page.', 'The server replies with HTML (structure), CSS (style) and JavaScript (behaviour).', 'Every request/response pair is one round trip — which is why loading lots of small files feels slower than one big file.'].join('\n\n'),
    data: ['Data structures are ways of organizing data: arrays (ordered list), objects/maps (key → value), stacks (last in, first out), queues (first in, first out), trees and graphs.', 'Choosing the right structure makes code simpler and faster.'].join('\n\n'),
    ai: ['Machine learning finds patterns in data instead of following hand-written rules.', 'A model is "trained" on examples, then makes predictions on new data.', 'LLMs like the one in this app predict the most likely next word given the conversation so far.'].join('\n\n'),
    cyber: ['Cybersecurity = protecting data from unauthorized access.', 'Core habits: unique passwords + a password manager, two-factor authentication, keeping software updated, and being suspicious of unexpected links and attachments.', 'Phishing is the #1 attack — it targets people, not software.'].join('\n\n'),
    python: ['Python is famous for readable code: indentation is part of the syntax.', 'Start with variables, if/else, loops (for/while), functions (def), and lists/dictionaries.', 'print() is your best friend for debugging.'].join('\n\n'),
    js: ['JavaScript runs in every browser and now on servers (Node.js).', 'Core ideas: variables (let/const), functions, arrays, objects, and the DOM (document.getElementById etc.).', 'The event loop means JS is single-threaded but can handle many things at once with async/await.'].join('\n\n'),
    careers: ['Tech careers: software engineer, data scientist, UX designer, cybersecurity analyst, DevOps, product manager, QA, technical writer.', 'You don\'t need a CS degree — a strong portfolio of projects matters most.', 'Start with one language, build small projects, and contribute to open source.'].join('\n\n')
  };
  btn.addEventListener('click', function() {
    var topic = sel.value;
    out.innerHTML = '<p class="subtle">Explaining ' + topic + '…</p>';
    groqChat([{ role: 'system', content: 'You are a friendly computer science teacher. Explain this topic for a high-school student: clear structure, 2-4 short sections with bold headings, a concrete example, and one "try this" suggestion. Under 220 words.' }, { role: 'user', content: 'Topic: ' + topic }], { maxTokens: 800, temperature: 0.5 }).then(function(txt) {
      out.innerHTML = '<div class="explain-box">' + formatInline(txt) + '</div>';
    }).catch(function() {
      out.innerHTML = '<div class="explain-box">' + formatInline(local[topic] || local.algorithms) + '</div><p class="subtle">(offline summary — AI unavailable)</p>';
    });
  });
}

/* ---------- Tech: mini terminal ---------- */
function setupMiniTerm() {
  var input = $('miniTermInput'), out = $('miniTermOut');
  if (!input || !out) return;
  function print(text, cls) {
    var line = document.createElement('div');
    line.className = 'term-line ' + (cls || '');
    line.textContent = String(text);
    out.appendChild(line);
    out.scrollTop = out.scrollHeight;
  }
  print('Welcome! Type a JavaScript expression and press Enter.', 'term-dim');
  input.addEventListener('keydown', function(e) {
    if (e.key !== 'Enter') return;
    var expr = input.value;
    if (!expr.trim()) return;
    print('js> ' + expr, 'term-cmd');
    input.value = '';
    try {
      var result = Function('"use strict"; return (' + expr + ')')();
      print(typeof result === 'object' && result !== null ? JSON.stringify(result) : result, 'term-out');
    } catch (err) {
      print('Error: ' + err.message, 'term-err');
    }
  });
}

/* ---------- Languages: book library ---------- */
function setupBookLibrary() {
  var list = $('bookList'), langSel = $('bookLang'), search = $('bookSearch');
  if (!list) return;
  var books = {
    en: [
      { t: 'Alice\'s Adventures in Wonderland', a: 'Lewis Carroll', id: 11 },
      { t: 'Pride and Prejudice', a: 'Jane Austen', id: 1342 },
      { t: 'The Adventures of Sherlock Holmes', a: 'Arthur Conan Doyle', id: 1661 },
      { t: 'A Tale of Two Cities', a: 'Charles Dickens', id: 98 },
      { t: 'The Time Machine', a: 'H. G. Wells', id: 35 },
      { t: 'Dracula', a: 'Bram Stoker', id: 345 },
      { t: 'Frankenstein', a: 'Mary Shelley', id: 84 },
      { t: 'The Picture of Dorian Gray', a: 'Oscar Wilde', id: 174 },
      { t: 'Moby Dick', a: 'Herman Melville', id: 2701 },
      { t: 'Little Women', a: 'Louisa May Alcott', id: 514 },
      { t: 'The Jungle Book', a: 'Rudyard Kipling', id: 236 },
      { t: 'Anne of Green Gables', a: 'L. M. Montgomery', id: 45 }
    ],
    es: [
      { t: 'Don Quijote', a: 'Miguel de Cervantes', id: 2000 },
      { t: 'Cuentos de Amor, de Locura y de Muerte', a: 'Horacio Quiroga', id: 1487 },
      { t: 'El Principito (traducción)', a: 'Antoine de Saint-Exupéry', id: 70307 }
    ],
    fr: [
      { t: 'Le Petit Prince', a: 'Antoine de Saint-Exupéry', id: 70306 },
      { t: 'Les Misérables', a: 'Victor Hugo', id: 135 },
      { t: 'Candide', a: 'Voltaire', id: 19942 },
      { t: 'Le Comte de Monte-Cristo', a: 'Alexandre Dumas', id: 17989 }
    ],
    de: [
      { t: 'Die Verwandlung', a: 'Franz Kafka', id: 22367 },
      { t: 'Der Struwwelpeter', a: 'Heinrich Hoffmann', id: 27155 },
      { t: 'Die Leiden des jungen Werthers', a: 'Goethe', id: 2408 }
    ],
    it: [
      { t: 'Le Avventure di Pinocchio', a: 'Carlo Collodi', id: 18149 },
      { t: 'I Promessi Sposi', a: 'Alessandro Manzoni', id: 27175 },
      { t: 'Cuore', a: 'Edmondo De Amicis', id: 26811 }
    ]
  };
  function render() {
    var lang = langSel ? langSel.value : 'en';
    var q = search ? search.value.trim().toLowerCase() : '';
    var items = (books[lang] || []).filter(function(b) { return !q || b.t.toLowerCase().indexOf(q) > -1 || b.a.toLowerCase().indexOf(q) > -1; });
    if (!items.length) { list.innerHTML = '<p class="subtle">No books match your search.</p>'; return; }
    list.innerHTML = items.map(function(b) {
      return '<div class="book-card"><div class="book-cover">' + b.t.charAt(0) + '</div><div><b>' + escapeHtml(b.t) + '</b><p class="subtle">' + escapeHtml(b.a) + '</p><a href="https://www.gutenberg.org/ebooks/' + b.id + '" target="_blank" rel="noreferrer" class="book-link">Read free →</a></div></div>';
    }).join('');
  }
  if (langSel) langSel.addEventListener('change', render);
  if (search) search.addEventListener('input', (typeof debounce === 'function' ? debounce(render) : render));
  render();
  // Notes
  var notes = $('bookNotes'), saveBtn = $('bookNotesSave');
  if (notes) {
    try { notes.value = localStorage.getItem('studyhub_booknotes') || ''; } catch (e) {}
  }
  if (saveBtn && notes) {
    saveBtn.addEventListener('click', function() {
      try { localStorage.setItem('studyhub_booknotes', notes.value); } catch (e) {}
      showToast('Reading notes saved');
    });
  }
}

/* ---------- English: literary analysis ---------- */
function setupLiteraryAnalysis() {
  var btn = $('litAnalyzeBtn'), sel = $('litBook'), passage = $('litPassage'), out = $('litResult');
  if (!btn || !out) return;
  btn.addEventListener('click', function() {
    var book = sel ? sel.value : '';
    var text = passage ? passage.value.trim() : '';
    if (!book && !text) { showToast('Pick a book or paste a passage.'); return; }
    var target = book || text;
    out.innerHTML = '<p class="subtle">Analyzing…</p>';
    groqChat([{ role: 'system', content: 'You are a literary analysis tutor. Analyze the work/passage for a high-school student. Structure: THEMES (2-3 with brief evidence), CHARACTERS/MOTIFS (if relevant), SYMBOLISM, WRITING TECHNIQUES (one or two), and a DISCUSSION QUESTION for the student to think about. Use short bold headings and bullet points. Under 260 words.' }, { role: 'user', content: (book ? 'Work: ' + target : 'Passage: ' + target) + (text && book ? '\n\nPassage excerpt: ' + text : '') }], { maxTokens: 900, temperature: 0.5 }).then(function(txt) {
      out.innerHTML = '<div class="explain-box">' + formatInline(txt) + '</div>';
    }).catch(function() {
      out.innerHTML = '<div class="explain-box"><b>Themes to look for</b><ul><li>What is the central conflict? Who or what opposes the protagonist?</li><li>How does the setting shape the mood and meaning?</li><li>What does the title suggest about the deeper message?</li></ul><b>Try this</b><p>Pick one character and ask: what do they want, and what stands in their way?</p></div><p class="subtle">(offline guide — AI unavailable)</p>';
    });
  });
}

/* ---------- Social Studies: primary source analysis ---------- */
function setupPrimarySource() {
  var btn = $('primarySourceBtn'), text = $('primarySourceText'), ctx = $('primarySourceContext'), out = $('primarySourceResult');
  if (!btn || !out) return;
  btn.addEventListener('click', function() {
    var t = text ? text.value.trim() : '';
    var c = ctx ? ctx.value.trim() : '';
    if (!t) { showToast('Paste a document excerpt first.'); return; }
    out.innerHTML = '<p class="subtle">Analyzing the document…</p>';
    groqChat([{ role: 'system', content: 'You are a history tutor teaching the SOAPStone method: Speaker, Occasion, Audience, Purpose, Subject, Tone. Analyze this primary source. Give short bold headings for each letter, then a one-line summary of what the source tells us about its time. Under 240 words.' }, { role: 'user', content: 'Context: ' + (c || 'unknown') + '\n\nDocument:\n' + t }], { maxTokens: 900, temperature: 0.5 }).then(function(txt) {
      out.innerHTML = '<div class="explain-box">' + formatInline(txt) + '</div>';
    }).catch(function() {
      out.innerHTML = '<div class="explain-box"><b>SOAPStone — guided questions</b><ul><li><b>Speaker:</b> Who wrote it? What is their position or bias?</li><li><b>Occasion:</b> What event or moment prompted this?</li><li><b>Audience:</b> Who was it written for?</li><li><b>Purpose:</b> What did the author want to achieve?</li><li><b>Subject:</b> What is it really about?</li><li><b>Tone:</b> What attitude comes through the word choice?</li></ul></div><p class="subtle">(offline guide — AI unavailable)</p>';
    });
  });
}

/* ---------- Health: topics ---------- */
function setupHealthTopics() {
  var btn = $('healthTopicBtn'), sel = $('healthTopic'), out = $('healthResult');
  var askBtn = $('healthAskBtn'), ask = $('healthAsk');
  var guides = {
    sleep: { title: 'Sleep & Rest', body: '<ul><li><b>Target:</b> 8–10 hours for teens, 7–9 for adults.</li><li><b>Wind down:</b> screens off 30–60 min before bed; dim the lights.</li><li><b>Consistency:</b> same sleep and wake times every day, even weekends.</li><li><b>Environment:</b> cool, dark, quiet room — try 18–20 °C.</li><li><b>Watch out:</b> caffeine after lunch, big meals right before bed, and all-nighters wreck memory.</li></ul><p><b>Try tonight:</b> write a 5-line plan for tomorrow before bed — it clears your mind.</p>' },
    stress: { title: 'Stress Management', body: '<ul><li><b>Breathe:</b> 4-7-8 breathing — inhale 4s, hold 7s, exhale 8s. Repeat 4×.</li><li><b>Move:</b> 10 minutes of walking drops cortisol noticeably.</li><li><b>Break tasks down:</b> "study for history" becomes "read pages 1–5".</li><li><b>Name it:</b> writing down exactly what stresses you reduces its power.</li><li><b>Say no:</b> protect study and sleep time — it is not selfish.</li></ul><p><b>Warning signs:</b> constant tiredness, irritability, trouble concentrating — talk to a trusted adult or school counsellor.</p>' },
    mental: { title: 'Mental Health Basics', body: '<ul><li><b>Mood check:</b> a daily 1-line mood log reveals patterns over time.</li><li><b>Connect:</b> real conversations beat doom-scrolling for mood.</li><li><b>Sleep, food, movement:</b> the big three affect mood more than anything else.</li><li><b>Reduce comparison:</b> social media shows highlights, not reality.</li><li><b>Reach out:</b> if low mood lasts 2+ weeks or affects daily life, talk to a counsellor or doctor — it works.</li></ul><p><b>Emergency:</b> if you or a friend are in crisis, tell a trusted adult now or contact a crisis line.</p>' },
    firstaid: { title: 'First Aid Essentials', body: '<ul><li><b>Check safety first:</b> never put yourself in danger to help.</li><li><b>Bleeding:</b> press firmly with a clean cloth, keep pressure on.</li><li><b>Burns:</b> cool under running water for 10–20 minutes, cover loosely.</li><li><b>Choking:</b> 5 back blows, then 5 abdominal thrusts, alternate.</li><li><b>Unresponsive + not breathing:</b> start CPR (30 compressions : 2 breaths) and call emergency services immediately.</li></ul><p><b>Important:</b> this is a summary, not a certificate. Consider a first-aid course — most schools offer one.</p>' },
    hydration: { title: 'Hydration', body: '<ul><li><b>Goal:</b> ~2–3 litres of water a day (more when active or hot).</li><li><b>Signs of thirst:</b> dry mouth, headache, dark urine, low focus.</li><li><b>Easy habits:</b> a bottle on your desk, one glass per class, drink before meals.</li><li><b>Skip:</b> sugary drinks and energy drinks — they dehydrate and crash you.</li></ul>' },
    posture: { title: 'Posture & Screen Health', body: '<ul><li><b>Screen at eye level</b> so your neck stays straight.</li><li><b>20-20-20 rule:</b> every 20 minutes, look 20 feet away for 20 seconds.</li><li><b>Chair:</b> feet flat, back supported, elbows at ~90°.</li><li><b>Blink:</b> we blink half as often on screens — dry eyes are a sign to blink more and rest.</li><li><b>Micro-breaks:</b> stand and stretch 1 minute each hour.</li></ul>' },
    immunity: { title: 'Boosting Immunity', body: '<ul><li><b>Sleep is #1:</b> immunity drops sharply after poor sleep.</li><li><b>Varied food:</b> fruit/veg at most meals; vitamin C, zinc, and protein help.</li><li><b>Movement:</b> regular exercise lowers illness risk.</li><li><b>Hygiene:</b> hand-washing is still the best defence.</li><li><b>Vaccines:</b> keep them up to date — they train your immune system.</li></ul>' },
    time: { title: 'Healthy Study Habits', body: '<ul><li><b>Pomodoro:</b> 25 min focus + 5 min break — try it in this app\'s Timer!</li><li><b>Active recall:</b> test yourself, don\'t just re-read. Use the Flashcards and Quizzes tabs.</li><li><b>Spaced repetition:</b> review at 1 day, 3 days, 1 week, 1 month.</li><li><b>Environment:</b> same desk, phone in another room.</li><li><b>Start tiny:</b> "open the book and read one page" beats "study for hours".</li></ul>' }
  };
  if (btn && sel && out) {
    btn.addEventListener('click', function() {
      var g = guides[sel.value] || guides.sleep;
      out.innerHTML = '<div class="health-guide"><h4>' + g.title + '</h4>' + g.body + '</div>';
    });
  }
  if (askBtn && ask) {
    askBtn.addEventListener('click', function() {
      var q = ask.value.trim();
      if (!q) { showToast('Type a health question first.'); return; }
      out.innerHTML = '<p class="subtle">Asking AI…</p>';
      groqChat([{ role: 'system', content: 'You are a cautious, friendly health educator for students. Answer simply and practically. If the question could need a doctor, say so clearly at the end. Under 180 words.' }, { role: 'user', content: q }], { maxTokens: 600, temperature: 0.4 }).then(function(txt) {
        out.innerHTML = '<div class="explain-box">' + formatInline(txt) + '</div>';
      }).catch(function() {
        out.innerHTML = '<p class="subtle">AI is unavailable right now — try again in a moment.</p>';
      });
    });
    ask.addEventListener('keydown', function(e) { if (e.key === 'Enter') askBtn.click(); });
  }
}
