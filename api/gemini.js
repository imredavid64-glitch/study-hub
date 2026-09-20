const { checkRequest } = require('../lib/guard');

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_MODEL = 'gemini-1.5-flash';
const MAX_TOKENS = 8192;
const MAX_MESSAGES = 30;
const MAX_MESSAGE_CHARS = 12000;

const ALLOWED_MODELS = new Set([
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-1.0-pro',
]);

function messagesToGeminiFormat(messages) {
  return messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : m.role === 'system' ? 'user' : m.role,
    parts: [{ text: m.content }]
  }));
}

module.exports = async function geminiProxy(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Content-Type', 'application/json');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const denied = await checkRequest(req, { maxPerMinute: 30, dailyMax: 400, dailyKey: 'gemini' });
  if (denied) {
    res.status(403).json({ error: denied });
    return;
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    res.status(500).json({ error: 'GEMINI_API_KEY not configured on server' });
    return;
  }
  if (req.method === 'GET') {
    res.status(200).json({ ok: true, provider: 'gemini', configured: true });
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const rawBuf = Buffer.concat(chunks);
  const rawBody = rawBuf.toString('binary');
  const body = JSON.parse(rawBody);

  try {
    const model = ALLOWED_MODELS.has(body.model) ? body.model : DEFAULT_MODEL;
    const messages = Array.isArray(body.messages)
      ? body.messages.slice(0, MAX_MESSAGES).map(m => ({
          role: (m && m.role === 'assistant' || m && m.role === 'system' || m && m.role === 'user') ? m.role : 'user',
          content: String(m && m.content || '').slice(0, MAX_MESSAGE_CHARS)
        }))
      : [];
    const maxTokens = Math.min(MAX_TOKENS, Math.max(64, +body.max_tokens || 2048));
    const temperature = (typeof body.temperature === 'number' && body.temperature >= 0 && body.temperature <= 2) ? body.temperature : 0.7;

    const geminiMessages = messagesToGeminiFormat(messages);

    const upstream = await fetch(`${GEMINI_ENDPOINT}/${model}:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: geminiMessages,
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: temperature,
        }
      })
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      const errorMsg = data.error?.message || `Gemini API error ${upstream.status}`;
      res.status(upstream.status).json({ error: errorMsg });
      return;
    }

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    res.status(200).json({
      choices: [{ message: { content } }],
      usage: data.usageMetadata
    });
  } catch (e) {
    res.status(500).json({ error: 'Proxy error: ' + (e && e.message ? e.message : e) });
  }
};