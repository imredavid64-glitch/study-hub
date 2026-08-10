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
| Groq fallback key | `app.js` (`window._GROQ_FALLBACK_KEY`) | **Known tradeoff** — see below |

> Known tradeoff: a client-side Groq fallback key still ships in `app.js` so
> static/file:// and Electron builds can call Groq directly when the
> `/api/groq` proxy is unreachable. Anyone who views the deployed JS can
> extract it. The deployed site prefers the proxy, but this key should be
> **rotated and removed** (making static builds prompt for their own key) as
> the next hardening step.

## Serverless endpoints

- `/api/groq` — Groq chat proxy. Guarded by an **origin allowlist**, a
  best-effort **in-memory rate limit** (30 req/min/IP), a **model allowlist**,
  and server-side caps on `max_tokens` (≤ 8192), message count (≤ 30), and
  per-message length (≤ 12k chars). Extend `ALLOWED_ORIGINS` in Vercel env for
  additional origins.
- `/api/mates` — study-mate matcher. Same origin allowlist + rate limit; reads
  only opt-in profiles via the service key.

## Client-side XSS posture

All user- and AI-generated content is escaped before entering the DOM
(`escapeHtml` / markdown rendering that escapes first). The postMessage OAuth
handshake verifies `event.origin`. Two known items remain:

- The graph plotters (`app.js`) compile the user's function string with
  `new Function` — a self-XSS / code-execution sink. Replace with a safe
  expression parser.
- `oauth2callback.html` renders the `error` URL fragment unescaped (crafted-URL
  only), and the Electron window has no `setWindowOpenHandler` navigation guard.

## Report

Found something? Open an issue in this repository with the steps to reproduce.
