// Shared guards for the serverless endpoints (api/groq.js, api/mates.js).
// Origin allowlist keeps the endpoints usable only from the Study Hub app
// (production domain + its Vercel previews + local dev + Electron/file://).
// Rate limiting is an in-memory sliding window — best-effort on Vercel's
// stateless function instances, but it stops casual abuse from other origins
// and rapid-fire scripts.

const DEFAULT_ALLOWED = 'https://study-hub-plum-omega.vercel.app';

function originAllowed(origin) {
  if (!origin || origin === 'null') return true; // file:// and Electron desktop builds
  const allow = (process.env.ALLOWED_ORIGINS || DEFAULT_ALLOWED)
    .split(',').map(s => s.trim()).filter(Boolean);
  if (allow.includes('*')) return true;
  for (const a of allow) {
    if (a.endsWith('*')) { if (origin.startsWith(a.slice(0, -1))) return true; continue; }
    if (origin === a) return true;
    if (origin.startsWith(a + '/')) return true;
  }
  // Local dev and this project's Vercel preview deployments
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  if (origin.startsWith('https://study-hub-plum-omega') && origin.endsWith('.vercel.app')) return true;
  return false;
}

const hits = new Map();

function rateLimit(key, max, windowMs) {
  if (!key) return true;
  const now = Date.now();
  const arr = (hits.get(key) || []).filter(t => now - t < windowMs);
  if (arr.length >= max) return false;
  arr.push(now);
  hits.set(key, arr);
  // Opportunistic cleanup so the map cannot grow unbounded
  if (hits.size > 10000) {
    for (const [k, v] of hits) if (v.every(t => now - t > windowMs)) hits.delete(k);
  }
  return true;
}

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd) return fwd.split(',')[0].trim();
  return req.headers['x-real-ip'] || req.socket && req.socket.remoteAddress || 'unknown';
}

// Returns an error message string if the request should be rejected, else null.
function checkRequest(req, { maxPerMinute = 30 } = {}) {
  const origin = req.headers.origin;
  if (!originAllowed(origin)) return 'Origin not allowed';
  if (!rateLimit('ip:' + clientIp(req), maxPerMinute, 60000)) return 'Rate limit exceeded — try again in a minute';
  return null;
}

module.exports = { originAllowed, rateLimit, clientIp, checkRequest };
