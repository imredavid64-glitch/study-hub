# Supabase setup runbook

Study Hub's cloud backend (sync, analytics, leaderboard, study-mate matching)
runs on Supabase with auth-scoped Row Level Security. Three one-time steps are
required — two in the Supabase dashboard and one in Vercel.

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
2. Open `supabase/migrations/20260810000000_auth_rls_hardening.sql` from this
   repo — or use the combined `supabase-migration.sql` (full schema, safe to
   run from scratch)
3. Paste and **Run**

Expected: no errors. The output lists the new policies
(`own_users`, `own_snapshots`, `own_events`, `read_leaderboard`,
`insert_own_leaderboard`, …, `own_mate_profile`, `read_mate_profiles`).

## 3. Add the service key (Vercel)

`/api/mates` (study-mate matching) reads opt-in profiles server-side with the
service key, which must never ship to the client.

1. In Supabase: **Settings → API** → copy the `service_role` key
2. In Vercel: **Project → Settings → Environment Variables** → add
   `SUPABASE_SERVICE_KEY` (production + preview)
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

## Optional: origin allowlist

Both `/api/groq` and `/api/mates` accept requests from the app domain, its
Vercel previews, localhost, and `file://` (Electron). To allow other origins,
set `ALLOWED_ORIGINS` (comma-separated, `*` for everything) in Vercel env.

## Rollback

To revert to the old (insecure, not recommended) behavior, drop the new
policies and re-create the `anon_access_*` policies from the original
migrations. Data written under the new auth uid is separate from legacy
`user_*` rows.
