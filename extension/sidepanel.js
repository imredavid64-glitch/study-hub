const chatEl = document.getElementById('spChat');
const inputEl = document.getElementById('spInput');
const sendBtn = document.getElementById('spSendBtn');
const captureBtn = document.getElementById('spCaptureBtn');
const clearBtn = document.getElementById('spClearBtn');
const contextEl = document.getElementById('spContext');
const tabLabel = document.getElementById('spCurrentTab');

let pageContext = { title: '', text: '' };
let history = [];

function addBubble(role, html) {
  const b = document.createElement('div');
  b.className = 'sp-bubble ' + role;
  b.innerHTML = html;
  chatEl.appendChild(b);
  chatEl.scrollTop = chatEl.scrollHeight;
  return b;
}
function esc(s) {
  return String(s).replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
}

async function capturePage() {
  try {
    const ctx = await chrome.runtime.sendMessage({ type: 'GET_PAGE_CONTEXT' });
    if (ctx && ctx.title) {
      pageContext = ctx;
      tabLabel.textContent = ctx.title.slice(0, 60);
      contextEl.textContent = ctx.text ? ctx.text.slice(0, 1200) : '(no readable text on this page)';
      addBubble('ai', '📄 <b>Captured:</b> ' + esc(ctx.title) + '. Ask me anything about it — I\'ll teach you, not just answer.');
    } else {
      addBubble('ai', 'Could not read this page (it may block scripts). You can still ask me general questions.');
    }
  } catch (e) {
    addBubble('err', 'Capture failed: ' + esc(e.message || e));
  }
}

async function ask(question) {
  if (!question.trim()) return;
  addBubble('user', esc(question));
  const thinking = addBubble('ai', '<span class="sp-thinking">Thinking…</span>');
  const sys = 'You are the StudyHub side tutor embedded in the Chrome extension. Teach the user Socratic-style: guide them with hints, check what they know, and ALWAYS end with ONE follow-up question. Never do their homework for them — help them learn it. Keep replies under 150 words.' +
    (pageContext.text ? '\n\nCurrent page context (the site they are working on):\n' + pageContext.text.slice(0, 2000) : '');
  const messages = [{ role: 'system', content: sys }];
  history.slice(-6).forEach((m) => messages.push(m));
  messages.push({ role: 'user', content: question });
  try {
    const res = await chrome.runtime.sendMessage({ type: 'ASK_AI', messages });
    thinking.remove();
    if (res && res.ok) {
      addBubble('ai', esc(res.content).replace(/\n/g, '<br>'));
      history.push({ role: 'user', content: question });
      history.push({ role: 'assistant', content: res.content });
    } else {
      addBubble('err', 'AI error: ' + esc((res && res.error) || 'unknown'));
    }
  } catch (e) {
    thinking.remove();
    addBubble('err', 'Ask failed: ' + esc(e.message || e));
  }
}

captureBtn.addEventListener('click', capturePage);
sendBtn.addEventListener('click', () => { const q = inputEl.value; inputEl.value = ''; ask(q); });
inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendBtn.click(); }
});
clearBtn.addEventListener('click', () => {
  chatEl.innerHTML = '';
  history = [];
  addBubble('ai', 'Fresh session. Capture the page you\'re on, then ask me anything.');
});

addBubble('ai', '👋 I\'m your StudyHub side tutor. I can learn alongside you on any site. Press <b>Capture current page</b> to bring the page you\'re reading into our chat.');
