-- ============================================================================
-- Study Hub — Apply the two migrations missing from the live project
-- ============================================================================
-- The live project (nnrdkdisjfudibvrggxb) only has the base migration applied
-- (users, user_state_snapshots, analytics_events). The leaderboard table and
-- the auth/RLS hardening were never applied, so the leaderboard and study-mate
-- cloud features 404 in production.
--
-- HOW TO APPLY:
--   1. Open your Supabase Dashboard -> project -> SQL Editor.
--   2. Paste this whole file and click Run.
--   3. Then enable Anonymous sign-ins:
--        Authentication -> Providers -> Anonymous sign-ins -> Enable.
--   4. Add the Supabase secrets to Vercel (Project -> Settings -> Environment
--      Variables, Production + Preview):
--        SUPABASE_URL      = https://nnrdkdisjfudibvrggxb.supabase.co
--        SUPABASE_SERVICE_KEY = service_role key (Dashboard -> Settings -> API)
--      Redeploy after setting them.
--
-- This is the concatenation of 20260809000000_add_leaderboard.sql followed by
-- 20260810000000_auth_rls_hardening.sql, in the required order.

-- ============================================================================
-- Migration 1 of 2: leaderboard entries (live rankings)
-- ============================================================================
CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT 'Scholar',
  week_start DATE NOT NULL,
  xp INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  study_minutes INTEGER NOT NULL DEFAULT 0,
  quizzes_taken INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_week ON leaderboard_entries(week_start, xp DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user_week ON leaderboard_entries(user_id, week_start);

ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;

-- Realtime so live rankings update across devices
ALTER PUBLICATION supabase_realtime ADD TABLE leaderboard_entries;

-- ============================================================================
-- Migration 2 of 2: auth-scoped RLS hardening (replaces the anon policies)
-- ============================================================================

-- 1) Drop every permissive anon policy (leaderboard policies are created
--    below by migration 1's original script; drop them before replacing).
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

-- 3) Ownership-scoped policies for authenticated users
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

-- 5) Opt-in study-mate profiles (the ONLY cross-user readable table)
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

CREATE POLICY "own_mate_profile" ON mate_profiles
  FOR ALL TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "read_mate_profiles" ON mate_profiles
  FOR SELECT TO authenticated USING (findable = true);

-- 6) Cleanup: legacy rows from the pre-auth era are unreachable under the new
--    policies; remove them so they cannot linger.
DELETE FROM user_state_snapshots WHERE user_id NOT IN (SELECT id FROM users);
DELETE FROM analytics_events WHERE user_id IS NOT NULL AND user_id NOT IN (SELECT id FROM users);
DELETE FROM leaderboard_entries WHERE user_id NOT IN (SELECT id FROM users);
DELETE FROM users WHERE id NOT LIKE '%-%';
