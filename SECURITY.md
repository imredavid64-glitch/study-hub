# Security

## Data model

- **Identity** is Supabase Auth (anonymous sign-in). The auth `uid` is the
  account key; every table is protected by Row Level Security scoped to
  `auth.uid()`. If anonymous sign-ins are disabled or the app is offline, it
  falls back to local-only mode (no cloud access) rather than unsafe access.
- **Row Level Security is forced** on all tables (`FORCE ROW LEVEL SECURITY`),
  so the public `anon` role cannot read or write anything.
- **The only cross-user readable data** is the opt-in `mate_profiles` table
  (`findable = true` rows), and it is read server-side via the service key in
  `/api/mates`, which returns only name/major/subjects/overlap — never ids,
  emails, or snapshots.
- **Study-mate matching** runs in `/api/mates`; the client never queries other
  users' rows. Users opt in with the "Make me findable" toggle.

## Secrets

| Secret | Where | Status |
|---|---|---|
| `GROQ_API_KEY` | Vercel env (`.env.local` locally) | Server-side only via `/api/groq` |
| `SUPABASE_SERVICE_KEY` | Vercel env | Server-side only via `/api/mates` |
| Supabase `anon_key` | `cloud-core.js` (client) | Public by design; RLS is the boundary |
| Groq fallback key | ~~`app.js`~~ | **Removed from code** — see below |

> The client-side Groq fallback key (`window._GROQ_FALLBACK_KEY`) shipped in
> earlier versions and was committed to git history. It has been **removed**
> from the code; offline/desktop builds now use a per-user key entered in
> Settings (stored only on that device). Because the old key is visible in
> repo history, **rotate it in the Groq dashboard** to invalidate the exposed
> copy.

## Serverless endpoints

- `/api/groq` — Groq chat proxy. Guarded by an **origin allowlist**, a
  **durable rate limit** (30 req/min/IP + 400 req/day/IP), a **model
  allowlist**, and server-side caps on `max_tokens` (≤ 8192), message count
  (≤ 30), and per-message length (≤ 12k chars). Set `UPSTASH_REDIS_REST_URL`
  + `UPSTASH_REDIS_REST_TOKEN` in Vercel env to make the limiter shared across
  all serverless instances; without them it falls back to per-instance memory.
  Extend `ALLOWED_ORIGINS` in Vercel env for additional origins.
- `/api/mates` — study-mate matcher. Same origin allowlist + rate limit; reads
  only opt-in profiles via the service key.

## Client-side XSS posture

All user- and AI-generated content is escaped before entering the DOM
(`escapeHtml` / markdown rendering that escapes first). The postMessage OAuth
handshake verifies `event.origin`. The graph plotters use a strict
whitelist expression parser (`safeEvalMath`) instead of `new Function`, the
OAuth callback escapes its error parameter, and the Electron window denies
all navigation away from the local app and opens external links in the system
browser.

## Report

Found something? Open an issue in this repository with the steps to reproduce.
