// Shared guards for the serverless endpoints (api/groq.js, api/mates.js).
// Origin allowlist keeps the endpoints usable only from the Study Hub app
// (production domain + its Vercel previews + local dev + Electron/file://).
//
// Rate limiting is DURABLE when Upstash Redis env vars are set
// (UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN), which works across all
// serverless instances. Without them it falls back to an in-memory sliding
// window — still useful for casual abuse, but per-instance only.

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

let redis = null;
function redisClient() {
  if (redis !== null) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  redis = (url && token) ? { url: url.replace(/\/+$/, ''), token } : false;
  return redis;
}

// INCR a key and set its TTL. Returns the incremented value, or null if the
// durable store is unavailable (caller should fall back to memory).
async function redisIncr(key, ttlSeconds) {
  const c = redisClient();
  if (!c) return null;
  try {
    const res = await fetch(c.url + '/pipeline', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + c.token, 'Content-Type': 'application/json' },
      body: JSON.stringify([['INCR', key], ['EXPIRE', key, ttlSeconds]])
    });
    if (!res.ok) return null;
    const arr = await res.json();
    return Array.isArray(arr) ? arr[0] : null;
  } catch (e) {
    return null;
  }
}

const memHits = new Map();

function memCount(key, max, windowMs) {
  const now = Date.now();
  const arr = (memHits.get(key) || []).filter(t => now - t < windowMs);
  if (arr.length >= max) return false;
  arr.push(now);
  memHits.set(key, arr);
  if (memHits.size > 10000) {
    for (const [k, v] of memHits) if (v.every(t => now - t > windowMs)) memHits.delete(k);
  }
  return true;
}

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd) return fwd.split(',')[0].trim();
  return req.headers['x-real-ip'] || (req.socket && req.socket.remoteAddress) || 'unknown';
}

// Returns an error message string if the request should be rejected, else null.
async function checkRequest(req, { maxPerMinute = 30, dailyMax = 0, dailyKey = '' } = {}) {
  const origin = req.headers.origin;
  if (!originAllowed(origin)) return 'Origin not allowed';
  const ip = clientIp(req);

  // Per-minute window: durable via Redis, in-memory as fallback.
  const key = 'rl:' + (dailyKey ? dailyKey + ':' : '') + 'min:' + ip;
  const durable = await redisIncr(key, 60);
  if (durable !== null) {
    if (durable > maxPerMinute) return 'Rate limit exceeded — try again in a minute';
  } else if (!memCount(key, maxPerMinute, 60000)) {
    return 'Rate limit exceeded — try again in a minute';
  }

  // Optional daily quota (e.g. for the expensive AI proxy).
  if (dailyMax > 0 && dailyKey) {
    const dkey = 'rl:' + dailyKey + ':day:' + ip;
    const durableDay = await redisIncr(dkey, 86400);
    if (durableDay !== null) {
      if (durableDay > dailyMax) return 'Daily usage limit reached — try again tomorrow';
    } else if (!memCount(dkey, dailyMax, 86400000)) {
      return 'Daily usage limit reached — try again tomorrow';
    }
  }

  return null;
}

module.exports = { originAllowed, rateLimit: checkRequest, clientIp, checkRequest };
