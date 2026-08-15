# Supabase setup runbook

Study Hub's cloud backend (sync, analytics, leaderboard, study-mate matching)
runs on Supabase with auth-scoped Row Level Security. Three one-time steps are
required — two in the Supabase dashboard and one in Vercel.

> **Quick checklist** — each item below has a full click-path walkthrough.
>
> - [x] **A. Enable anonymous sign-ins** (Supabase → Authentication → Providers) — ✅ enabled 2026-08-14
> - [x] **B. Run the RLS migration** (Supabase → SQL Editor → run the migration file) — ✅ applied 2026-08-14
> - [x] **C. Add `SUPABASE_URL` / `SUPABASE_SERVICE_KEY`** (Supabase → Settings → API → copy `service_role` → Vercel env) — ✅ set (Production + Preview) 2026-08-14
> - [x] **D. Add `INSTALLERS_PAT`** (GitHub → Settings → Developer settings → PAT → repo secret) — enables the release workflow to publish installers automatically
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
   This is the consolidated, ordered script (leaderboard table + RLS hardening).
   Do **not** run the hardening migration alone — it references
   `leaderboard_entries`, which must be created first. (Already applied to the
   live project on 2026-08-14; re-running is safe — it is idempotent.)
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

## 5. Durable rate limiting

Rate limiting is DURABLE (shared across all serverless instances) when these
Vercel env vars are set — otherwise it falls back to a per-instance in-memory
window:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Both are set in Production + Preview (`sensitive`). `lib/guard.js` reads them
and uses the Upstash REST `/pipeline` endpoint (INCR + EXPIRE … NX). Verify
with `scripts/upstash-ratelimit-test.js`:

```bash
node scripts/upstash-ratelimit-test.js --reset   # clear the test key
node scripts/upstash-ratelimit-test.js           # run twice → durable count 1 → 2
```

> **Note:** the wired database is a temporary Upstash scratch instance that
> expires 2026-08-18 unless claimed. To make it permanent, open the console
> and click **Claim**:
> https://upstash.com/start-redis/console/2a04a36d-9d0a-45e3-8e08-7884ccd23bbd
> (or create your own Redis DB at https://console.upstash.io and re-set the two
> vars). If it expires unclaimed, rate limiting silently degrades to in-memory.

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

All three cloud-backend steps are now **applied and verified end-to-end**
against the live project (`nnrdkdisjfudibvrggxb`) and the production deploy.

| Check | Result | Evidence |
|---|---|---|
| **Base migration** | ✅ Applied | `users`, `user_state_snapshots`, `analytics_events` return 200 |
| **B. Leaderboard + RLS migration** | ✅ **Applied** | `leaderboard_entries` and `mate_profiles` exist, RLS enabled on all five tables, ownership policies (`own_users`, `own_snapshots`, `own_events`, `read_leaderboard`, `insert/update/delete_own_leaderboard`, `own_mate_profile`, `read_mate_profiles`) present |
| **A. Anonymous sign-ins** | ✅ **Enabled** | `signInAnonymously` returns a UUID user with role `authenticated` |
| **C. `SUPABASE_URL` / `SUPABASE_SERVICE_KEY`** | ✅ **Set** | `vercel env ls` shows both (Production + Preview, `sensitive`); `/api/config` reports `supabase.configured: true`; `/api/mates` returns `[]` instead of “not configured” |
| **D. `INSTALLERS_PAT`** | ✅ Set | v1.1.5 installers published to the installers repo |
| **E. Upstash vars** | ✅ Set (scratch DB — claim by 2026-08-18) | `vercel env ls`; `scripts/upstash-ratelimit-test.js` proves cross-process durability |
| **F. Groq key rotation** | ❌ Not confirmed | see “Rotate the old Groq key” below |

### End-to-end verification (2026-08-14)

- **Leaderboard**: anonymous sign-in → `leaderboard_entries` read returns 200
  with real rows.
- **Study-mates**: exercised the exact app flow — anon sign-in → own `users`
  row (RLS `own_users`, 201) → own `mate_profiles` row (RLS
  `own_mate_profile`, 201) → `POST /api/mates`. Overlapping subjects
  returned the profile with its `overlap` list; a no-overlap query returned
  `[]`. The response exposes only name/major/subjects/target — never
  `user_id` or email. Two demo profiles are left in place ("Demo Scholar —
  Physics", "Demo Scholar — CS") so the in-app Study Mates tab and
  leaderboard show live rows; delete their `mate_profiles` rows to purge.

## Verification checklist

Re-run these commands to confirm the cloud backend is healthy. Each maps to a
checklist item above (A–C).

```bash
# A. Anonymous sign-ins work (should return a JSON with "access_token" and
#    a UUID user whose role is "authenticated")
curl -s -X POST https://nnrdkdisjfudibvrggxb.supabase.co/auth/v1/signup \
  -H "apikey: $ANON_KEY" -H "Content-Type: application/json" -d '{}' \
  | python3 -m json.tool

# B. Tables exist + RLS is enabled (all six rows must show rowsecurity=true)
supabase db query --linked \
  "SELECT tablename, rowsecurity FROM pg_tables \
   WHERE tablename IN ('users','user_state_snapshots','analytics_events',\
                       'leaderboard_entries','mate_profiles') ORDER BY tablename;"

# B. Ownership policies are present
supabase db query --linked \
  "SELECT policyname, tablename FROM pg_policies \
   WHERE tablename IN ('users','leaderboard_entries','mate_profiles') \
   ORDER BY tablename, policyname;"

# C. Vercel reports the cloud as configured (expect \"configured\":true)
curl -s https://study-hub-plum-omega.vercel.app/api/config

# C. Study-mate matching answers ([] means configured + working, just no
#    overlapping profiles yet)
curl -s -X POST https://study-hub-plum-omega.vercel.app/api/mates \
  -H "Content-Type: application/json" \
  -d '{"subjects":["math"]}'

# Leaderboard is readable by the anon role (expect 200, not 404)
curl -s -o /dev/null -w "%{http_code}\n" \
  "https://nnrdkdisjfudibvrggxb.supabase.co/rest/v1/leaderboard_entries?select=*&limit=1" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY"
```

A clean run of every command above (auth JSON returned, six tables with RLS,
policy list non-empty, `configured: true`, mates answering, leaderboard 200)
means the full cloud path is live: **auth → RLS → sync/leaderboard →
opt-in study-mate matching**.

### How the steps were applied (no dashboard needed)

A and B were applied programmatically rather than via the dashboard UI:

- **A** — `PATCH /v1/projects/{ref}/config/auth` on the Supabase Management
  API with `{"external_anonymous_users_enabled": true}` (authenticated via the
  `supabase` CLI access token).
- **B** — `supabase db query --linked -f <migration>.sql`, running
  `20260809000000_add_leaderboard.sql` then
  `20260810000000_auth_rls_hardening.sql` in order.
- **C** — fetched `service_role` from the Management API `api-keys` endpoint
  and set it in Vercel (CLI for Production, REST API for Preview, then
  `PATCH`ed Preview vars to `sensitive` type).

## Rollback

To revert to the old (insecure, not recommended) behavior, drop the new
policies and re-create the `anon_access_*` policies from the original
migrations. Data written under the new auth uid is separate from legacy
`user_*` rows.
