-- Supabase Migration: Auth-scoped RLS hardening
-- Replaces the permissive "anon_access_*" policies with ownership-scoped
-- policies keyed to Supabase Auth (auth.uid()). Requires anonymous sign-ins
-- enabled in Supabase -> Authentication -> Providers (the client falls back
-- to local-only mode when auth is unavailable).
--
-- Run AFTER 20260711000000_create_study_hub_tables.sql and
-- 20260809000000_add_leaderboard.sql.

-- 1) Drop every permissive anon policy
DROP POLICY IF EXISTS anon_access_users ON users;
DROP POLICY IF EXISTS anon_access_snapshots ON user_state_snapshots;
DROP POLICY IF EXISTS anon_access_events ON analytics_events;
DROP POLICY IF EXISTS anon_read_leaderboard ON leaderboard_entries;
DROP POLICY IF EXISTS anon_write_leaderboard ON leaderboard_entries;
DROP POLICY IF EXISTS anon_update_leaderboard ON leaderboard_entries;

-- 2) FORCE RLS so the anon role can never bypass policies via table ownership
ALTER TABLE users FORCE ROW LEVEL SECURITY;
ALTER TABLE user_state_snapshots FORCE ROW LEVEL SECURITY;
ALTER TABLE analytics_events FORCE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries FORCE ROW LEVEL SECURITY;

-- 3) Ownership-scoped policies for authenticated users.
--    user rows store auth.uid()::text as their id (client signs in
--    anonymously and uses the auth user id as its primary key).
CREATE POLICY "own_users" ON users
  FOR ALL TO authenticated
  USING (auth.uid()::text = id)
  WITH CHECK (auth.uid()::text = id);

CREATE POLICY "own_snapshots" ON user_state_snapshots
  FOR ALL TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "own_events" ON analytics_events
  FOR ALL TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- 4) Leaderboard: anyone signed in can READ rankings; each user can only
--    insert / update / delete their own row.
CREATE POLICY "read_leaderboard" ON leaderboard_entries
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "insert_own_leaderboard" ON leaderboard_entries
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "update_own_leaderboard" ON leaderboard_entries
  FOR UPDATE TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "delete_own_leaderboard" ON leaderboard_entries
  FOR DELETE TO authenticated
  USING (auth.uid()::text = user_id);

-- 5) Opt-in study-mate profiles. This is the ONLY cross-user readable table,
--    and only after a user explicitly creates their own profile (opting in).
CREATE TABLE IF NOT EXISTS mate_profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Scholar',
  major TEXT DEFAULT '',
  subjects TEXT[] NOT NULL DEFAULT '{}',
  weekly_target_hours INTEGER DEFAULT 0,
  findable BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE mate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mate_profiles FORCE ROW LEVEL SECURITY;

-- Each user manages only their own profile.
CREATE POLICY "own_mate_profile" ON mate_profiles
  FOR ALL TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Signed-in users may read OTHER profiles only for matching, and only those
-- that opted in with findable = true. The app's /api/mates endpoint reads
-- through the service key and returns matches with no ids or emails.
CREATE POLICY "read_mate_profiles" ON mate_profiles
  FOR SELECT TO authenticated USING (findable = true);

-- 6) Cleanup: legacy rows from the pre-auth era used client-generated
--    "user_*" ids that no auth.uid() can ever match. They are unreachable
--    under the new policies; remove them so they cannot linger.
DELETE FROM user_state_snapshots WHERE user_id NOT IN (SELECT id FROM users);
DELETE FROM analytics_events WHERE user_id IS NOT NULL AND user_id NOT IN (SELECT id FROM users);
DELETE FROM leaderboard_entries WHERE user_id NOT IN (SELECT id FROM users);
DELETE FROM users WHERE id NOT LIKE '%-%';
