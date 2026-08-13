# Supabase setup runbook

Study Hub's cloud backend (sync, analytics, leaderboard, study-mate matching)
runs on Supabase with auth-scoped Row Level Security. Three one-time steps are
required — two in the Supabase dashboard and one in Vercel.

> **Quick checklist** — each item below has a full click-path walkthrough.
>
> - [ ] **A. Enable anonymous sign-ins** (Supabase → Authentication → Providers)
> - [ ] **B. Run the RLS migration** (Supabase → SQL Editor → run the migration file)
> - [ ] **C. Add `SUPABASE_SERVICE_KEY`** (Supabase → Settings → API → copy `service_role` → Vercel env)
> - [ ] **D. Add `INSTALLERS_PAT`** (GitHub → Settings → Developer settings → PAT → repo secret) — enables the release workflow to publish installers automatically
> - [ ] **E. (Optional) Add `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`** (Vercel env) — durable cross-instance rate limiting
> - [ ] **F. Rotate the old Groq key** (console.groq.com → API Keys → revoke the leaked key)

## 1. Enable anonymous sign-ins (Supabase dashboard)

Cloud sync uses Supabase Auth's anonymous sign-ins so users get a real,
RLS-scoped identity without a sign-up flow.

1. Open your project at https://supabase.com/dashboard
2. Go to **Authentication → Providers**
3. Enable **Anonymous** sign-ins
4. Save

Without this, the app runs in **local-only mode** (no cloud sync) and shows a
clear status in Settings → Cloud Sync & Privacy.

## 2. Apply the RLS migration (Supabase dashboard)

This is the step that actually closes the historical "anyone can read/write
every user's data" hole: it drops the permissive `anon_access_*` policies,
forces RLS on every table, and replaces them with `auth.uid()`-scoped
ownership policies plus the opt-in `mate_profiles` table.

1. Go to **SQL Editor**
2. Open **`supabase/apply-missing-migrations.sql`** from this repo and paste it.
   This is the consolidated, ordered script (leaderboard table + RLS hardening)
   that the live project is missing. Do **not** run the hardening migration
   alone — it references `leaderboard_entries`, which does not exist yet.
3. Paste and **Run**

Expected: no errors. The output lists the new policies
(`own_users`, `own_snapshots`, `own_events`, `read_leaderboard`,
`insert_own_leaderboard`, …, `own_mate_profile`, `read_mate_profiles`).

## 3. Add the Supabase secrets (Vercel)

`/api/mates` (study-mate matching) reads opt-in profiles server-side with the
service key, which must never ship to the client. `api/config.js` also reports
cloud status from `SUPABASE_URL`.

1. In Supabase: **Settings → API** → copy the project **URL** and the
   `service_role` key
2. In Vercel: **Project → Settings → Environment Variables** → add both
   (production + preview):
   - `SUPABASE_URL` = `https://nnrdkdisjfudibvrggxb.supabase.co`
   - `SUPABASE_SERVICE_KEY` = the `service_role` key
3. Redeploy

Verify with:

```bash
curl -X POST https://study-hub-plum-omega.vercel.app/api/mates \
  -H "Content-Type: application/json" \
  -d '{"subjects":["physics"]}'
```

- `[]` → matcher works (no opt-in profiles yet — make yourself findable in the app)
- `{"error":"SUPABASE_SERVICE_KEY not configured on server"}` → env var missing
- `{"error":"Origin not allowed"}` → the origin allowlist rejected the caller
  (add it via `ALLOWED_ORIGINS`, see below)

## 4. Add the installers publish token (GitHub)

The release workflow (`.github/workflows/release.yml`) builds installers for
macOS / Windows / Linux on every tag. Its final **Publish** job uploads them to
the public `study-hub-installers` repo — it needs a repo-scoped secret called
`INSTALLERS_PAT`.

1. Create a PAT: GitHub → **Settings → Developer settings → Personal access
   tokens → Tokens (classic) → Generate new token**
   - Scope: **Contents: write** (or `repo` for simplicity) — target the
     `imredavid64-glitch/study-hub-installers` repo
2. Add it as a secret: **study-hub repo → Settings → Secrets and variables →
   Actions → New repository secret** → name `INSTALLERS_PAT`
3. Next release tag will auto-publish. To publish the current build without a
   new tag: **Actions → release workflow → re-run the Publish job**, or run
   the manual download-and-`gh release create` flow.

Verify with:

```bash
gh secret list   # INSTALLERS_PAT should appear
```

## 5. (Optional) Durable rate limiting

Rate limiting works out of the box per function instance. To make limits
shared across all instances (and to enforce the daily quota reliably), add an
Upstash Redis REST database and set in Vercel env:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

## Optional: origin allowlist

Both `/api/groq` and `/api/mates` accept requests from the app domain, its
Vercel previews, localhost, and `file://` (Electron). To allow other origins,
set `ALLOWED_ORIGINS` (comma-separated, `*` for everything) in Vercel env.

## Rotate the old Groq key

The client-side Groq fallback key that shipped in earlier versions has been
removed from the code, but it is visible in git history. Rotate it in the
Groq dashboard (https://console.groq.com → API Keys) so the exposed copy stops
working.

## Current state (live-verified 2026-08-14)

Automated probes against the live project (`nnrdkdisjfudibvrggxb`) confirmed:

| Check | Result | Evidence |
|---|---|---|
| **Base migration** | ✅ Applied | `users`, `user_state_snapshots`, `analytics_events` all return 200 |
| **B. Leaderboard + RLS migration** | ❌ **NOT applied** | `leaderboard_entries` and `mate_profiles` → `PGRST205: Could not find the table` (404). The leaderboard and study-mate features silently no-op until `supabase/apply-missing-migrations.sql` is run |
| **A. Anonymous sign-ins** | ❌ Disabled | App console: “Anonymous sign-ins are disabled… running in local-only mode” |
| **C. `SUPABASE_URL` / `SUPABASE_SERVICE_KEY`** | ❌ Not set | `vercel env ls` shows only `GROQ_API_KEY`; `/api/mates` returns “SUPABASE_SERVICE_KEY not configured” |
| **D. `INSTALLERS_PAT`** | ✅ Set | `gh secret list` shows it; v1.1.4 installers published to the installers repo |
| **E. Upstash vars** | ❌ Not set | `vercel env ls` |

Apply **B, then A, then C** — in that order — to activate the cloud features.
The base tables are currently still readable by anyone with the (public) anon
key; the hardening in B closes that.

## Rollback

To revert to the old (insecure, not recommended) behavior, drop the new
policies and re-create the `anon_access_*` policies from the original
migrations. Data written under the new auth uid is separate from legacy
`user_*` rows.
