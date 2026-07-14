-- Supabase Migration: Create Study Hub tables
-- Run this in your Supabase dashboard SQL editor

-- Users table
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

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_state_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow anon access for now (adjust for production)
CREATE POLICY "anon_access_users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_access_snapshots" ON user_state_snapshots FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_access_events" ON analytics_events FOR ALL USING (true) WITH CHECK (true);

-- Enable realtime for analytics
ALTER PUBLICATION supabase_realtime ADD TABLE analytics_events;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_snapshots_user_id ON user_state_snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_last_updated ON user_state_snapshots(last_updated);
CREATE INDEX IF NOT EXISTS idx_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON analytics_events(timestamp);
