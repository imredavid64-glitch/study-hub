const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

module.exports = async function groqProxy(req, res) {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    res.status(500).json({ error: 'GROQ_API_KEY not configured on server' });
    return;
  }
  if (req.method === 'GET') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({ ok: true, provider: 'groq', configured: true });
    return;
  }
  if (req.method !== 'POST') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { model, messages, max_tokens, temperature } = body || {};

    const upstream = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key
      },
      body: JSON.stringify({
        model: model || 'llama-3.1-8b-instant',
        messages: Array.isArray(messages) ? messages : [],
        max_tokens: max_tokens || 2048,
        temperature: temperature ?? 0.7
      })
    });

    const data = await upstream.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(upstream.status).json(data);
  } catch (e) {
    res.status(500).json({ error: 'Proxy error: ' + (e && e.message ? e.message : e) });
  }
};
