// Study-mate matching endpoint.
// Reads only the opt-in mate_profiles table via the service key (kept
// server-side in Vercel env: SUPABASE_SERVICE_KEY). Returns matches with
// name/major/subjects only — never user ids, emails, or snapshots.
const SUPABASE_URL = 'https://nnrdkdisjfudibvrggxb.supabase.co';
const { checkRequest } = require('../lib/guard');

module.exports = async function matesEndpoint(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Content-Type', 'application/json');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const denied = checkRequest(req, { maxPerMinute: 30 });
  if (denied) {
    res.status(403).json({ error: denied });
    return;
  }

  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!key) {
    res.status(503).json({ error: 'SUPABASE_SERVICE_KEY not configured on server' });
    return;
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch (e) {
    res.status(400).json({ error: 'Invalid JSON body' });
    return;
  }

  const subjects = Array.isArray(body.subjects)
    ? body.subjects.filter(s => typeof s === 'string' && s.trim()).slice(0, 10).map(s => s.trim().toLowerCase())
    : [];
  if (subjects.length === 0) { res.status(400).json({ error: 'No subjects provided' }); return; }
  const myId = typeof body.userId === 'string' ? body.userId.slice(0, 100) : '';

  try {
    const r = await fetch(
      SUPABASE_URL + '/rest/v1/mate_profiles?select=user_id,name,major,subjects,weekly_target_hours&findable=eq.true&limit=200',
      { headers: { apikey: key, Authorization: 'Bearer ' + key } }
    );
    if (!r.ok) throw new Error('db ' + r.status);
    const rows = await r.json();

    const mates = [];
    (rows || []).forEach(p => {
      if (!p || p.user_id === myId) return;
      const subs = (p.subjects || []).filter(Boolean).map(s => String(s).toLowerCase().trim());
      const overlap = subs.filter(s => subjects.includes(s));
      if (overlap.length === 0) return;
      mates.push({
        name: p.name || 'Scholar',
        major: p.major || '',
        subjects: (p.subjects || []).filter(Boolean),
        overlap: overlap.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
        target: p.weekly_target_hours || 0
      });
    });

    mates.sort((a, b) => b.overlap.length - a.overlap.length);
    res.status(200).json(mates.slice(0, 12));
  } catch (e) {
    res.status(500).json({ error: 'Matching failed: ' + (e && e.message ? e.message : e) });
  }
};
