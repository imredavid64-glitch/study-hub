-- Supabase Migration: Study Hub (secure, auth-scoped)
-- Run this in your Supabase dashboard SQL editor.
-- Identity is Supabase Auth (anonymous sign-in); every table is protected by
-- Row Level Security keyed to auth.uid(). Enable anonymous sign-ins under
-- Authentication -> Providers first, or the client runs in local-only mode.
--
-- This file is the full, current schema. It supersedes the old permissive
-- "anon_access_*" policies that let any visitor read/write every user's data.

-- Users table (id stores auth.uid()::text)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Scholar',
  major TEXT DEFAULT 'General Studies',
  weekly_target_hours INTEGER DEFAULT 20,
  target_gpa REAL DEFAULT 3.8,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User state snapshots (for cloud sync)
CREATE TABLE IF NOT EXISTS user_state_snapshots (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  state_data JSONB NOT NULL DEFAULT '{}',
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Analytics events
CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  payload JSONB DEFAULT '{}',
  source TEXT DEFAULT 'frontend',
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Leaderboard entries (live rankings)
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

-- Opt-in study-mate profiles (the ONLY cross-user readable table)
CREATE TABLE IF NOT EXISTS mate_profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Scholar',
  major TEXT DEFAULT '',
  subjects TEXT[] NOT NULL DEFAULT '{}',
  weekly_target_hours INTEGER DEFAULT 0,
  findable BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable + FORCE Row Level Security on every table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;
ALTER TABLE user_state_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_state_snapshots FORCE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events FORCE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries FORCE ROW LEVEL SECURITY;
ALTER TABLE mate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mate_profiles FORCE ROW LEVEL SECURITY;

-- Drop any legacy permissive anon policies
DROP POLICY IF EXISTS anon_access_users ON users;
DROP POLICY IF EXISTS anon_access_snapshots ON user_state_snapshots;
DROP POLICY IF EXISTS anon_access_events ON analytics_events;
DROP POLICY IF EXISTS anon_read_leaderboard ON leaderboard_entries;
DROP POLICY IF EXISTS anon_write_leaderboard ON leaderboard_entries;
DROP POLICY IF EXISTS anon_update_leaderboard ON leaderboard_entries;

-- Ownership-scoped policies (authenticated users manage only their own rows)
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

-- Leaderboard: everyone signed in reads; each user writes only their own row
CREATE POLICY "read_leaderboard" ON leaderboard_entries
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_own_leaderboard" ON leaderboard_entries
  FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "update_own_leaderboard" ON leaderboard_entries
  FOR UPDATE TO authenticated
  USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "delete_own_leaderboard" ON leaderboard_entries
  FOR DELETE TO authenticated USING (auth.uid()::text = user_id);

-- Mate profiles: each user manages only their own; others may read only
-- profiles that opted in (findable = true) — and only via the /api/mates
-- endpoint, which returns no ids or emails.
CREATE POLICY "own_mate_profile" ON mate_profiles
  FOR ALL TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "read_mate_profiles" ON mate_profiles
  FOR SELECT TO authenticated USING (findable = true);

-- Realtime (RLS-filtered: subscribers only receive rows their policies allow)
ALTER PUBLICATION supabase_realtime ADD TABLE analytics_events;
ALTER PUBLICATION supabase_realtime ADD TABLE leaderboard_entries;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_snapshots_user_id ON user_state_snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_last_updated ON user_state_snapshots(last_updated);
CREATE INDEX IF NOT EXISTS idx_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_leaderboard_week ON leaderboard_entries(week_start, xp DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user_week ON leaderboard_entries(user_id, week_start);

-- Cleanup legacy pre-auth rows (client-generated user_* ids are unreachable
-- under auth-scoped RLS and would otherwise linger forever)
DELETE FROM user_state_snapshots WHERE user_id NOT IN (SELECT id FROM users);
DELETE FROM analytics_events WHERE user_id IS NOT NULL AND user_id NOT IN (SELECT id FROM users);
DELETE FROM leaderboard_entries WHERE user_id NOT IN (SELECT id FROM users);
DELETE FROM users WHERE id NOT LIKE '%-%';
