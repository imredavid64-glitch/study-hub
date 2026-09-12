const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const { checkRequest } = require('../lib/guard');
const zlib = require('zlib');

function decompressBody(rawBody, encoding) {
  if (!encoding) return rawBody;
  if (encoding.includes('gzip') || encoding.includes('deflate')) {
    try {
      return zlib.unzipSync(Buffer.from(rawBody, 'binary')).toString();
    } catch {
      return rawBody;
    }
  }
  return rawBody;
}

function decodeBody(rawBody) {
  const buf = Buffer.from(rawBody, 'binary');
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) {
    return buf.slice(2).toString('utf16le');
  }
  if (buf.length >= 2 && buf[0] === 0xfe && buf[1] === 0xff) {
    // Node has no UTF-16BE encoder; byte-swap to LE then decode.
    const be = Buffer.from(buf.slice(2));
    for (let i = 0; i + 1 < be.length; i += 2) { const t = be[i]; be[i] = be[i + 1]; be[i + 1] = t; }
    return be.toString('utf16le');
  }
  if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    return buf.slice(3).toString('utf8');
  }
  return buf.toString('utf8');
}

function tryParseBody(rawBody) {
  const decoded = decodeBody(rawBody);
  const cleaned = decoded.replace(/^\uFEFF/, '');
  try {
    return JSON.parse(cleaned);
  } catch {
    try {
      return JSON.parse(rawBody);
    } catch {
      return null;
    }
  }
}

const ALLOWED_MODELS = new Set([
  'groq/compound',
  'groq/compound-mini',
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'openai/gpt-oss-safeguard-20b',
  'qwen/qwen3.6-27b',
  'qwen/qwen3.8-27b',
  'allam-2-7b',
  'meta-llama/llama-prompt-guard-2-86m',
  'meta-llama/llama-prompt-guard-2-22m',
]);
const DEFAULT_MODEL = 'groq/compound-mini';
const MAX_TOKENS = 8192;
const MAX_MESSAGES = 30;
const MAX_MESSAGE_CHARS = 12000;

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

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const rawBuf = Buffer.concat(chunks);
  const rawBody = rawBuf.toString('binary');
  const encoding = req.headers['content-encoding'] || req.headers['x-vercel-content-encoding'] || '';
  const decompressed = decompressBody(rawBody, encoding);
  const body = tryParseBody(decompressed);
  if (!body) {
    res.status(400).json({ error: 'Invalid JSON body' });
    return;
  }

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