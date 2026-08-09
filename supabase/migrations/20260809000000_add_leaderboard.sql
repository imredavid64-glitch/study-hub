-- Supabase Migration: Leaderboard entries (live rankings)
-- User stats are pushed here (send-only from the client, never saved to the user's local state).
-- Run this in your Supabase dashboard SQL editor.

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

CREATE POLICY "anon_read_leaderboard" ON leaderboard_entries FOR SELECT USING (true);
CREATE POLICY "anon_write_leaderboard" ON leaderboard_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_update_leaderboard" ON leaderboard_entries FOR UPDATE USING (true) WITH CHECK (true);

-- Realtime so live rankings update across devices
ALTER PUBLICATION supabase_realtime ADD TABLE leaderboard_entries;
