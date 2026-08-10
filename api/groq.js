const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const { checkRequest } = require('../lib/guard');

const ALLOWED_MODELS = new Set([
  'llama-3.1-8b-instant',
  'llama-3.3-70b-versatile',
  'llama-3.1-70b-versatile'
]);
const DEFAULT_MODEL = 'llama-3.1-8b-instant';
const MAX_TOKENS = 8192;        // server-side cap, ignores client requests above this
const MAX_MESSAGES = 30;        // messages array cap
const MAX_MESSAGE_CHARS = 12000; // per-message content cap

module.exports = async function groqProxy(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Content-Type', 'application/json');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const denied = await checkRequest(req, { maxPerMinute: 30, dailyMax: 400, dailyKey: 'groq' });
  if (denied) {
    res.status(403).json({ error: denied });
    return;
  }

  const key = process.env.GROQ_API_KEY;
  if (!key) {
    res.status(500).json({ error: 'GROQ_API_KEY not configured on server' });
    return;
  }
  if (req.method === 'GET') {
    res.status(200).json({ ok: true, provider: 'groq', configured: true });
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const model = ALLOWED_MODELS.has(body.model) ? body.model : DEFAULT_MODEL;
    const messages = Array.isArray(body.messages)
      ? body.messages.slice(0, MAX_MESSAGES).map(m => ({
          role: (m && m.role === 'assistant' || m && m.role === 'system' || m && m.role === 'user') ? m.role : 'user',
          content: String(m && m.content || '').slice(0, MAX_MESSAGE_CHARS)
        }))
      : [];
    const maxTokens = Math.min(MAX_TOKENS, Math.max(64, +body.max_tokens || 2048));
    const temperature = (typeof body.temperature === 'number' && body.temperature >= 0 && body.temperature <= 2) ? body.temperature : 0.7;

    const upstream = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key
      },
      body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature })
    });

    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (e) {
    res.status(500).json({ error: 'Proxy error: ' + (e && e.message ? e.message : e) });
  }
};
