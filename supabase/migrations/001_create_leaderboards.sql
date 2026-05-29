-- Create leaderboard tables for the boxing app

-- Reflex Leaderboard (fastest reaction times)
CREATE TABLE leaderboard_reflex (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    score FLOAT NOT NULL,
    display_val TEXT NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_leaderboard_reflex_score ON leaderboard_reflex(score ASC);
CREATE INDEX idx_leaderboard_reflex_updated ON leaderboard_reflex(last_updated DESC);

-- Streak Leaderboard (consecutive training days)
CREATE TABLE leaderboard_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    score INTEGER NOT NULL,
    display_val TEXT NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_leaderboard_streaks_score ON leaderboard_streaks(score DESC);
CREATE INDEX idx_leaderboard_streaks_updated ON leaderboard_streaks(last_updated DESC);

-- Combo Leaderboard (combo game scores)
CREATE TABLE leaderboard_combo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    score FLOAT NOT NULL,
    display_val TEXT NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_leaderboard_combo_score ON leaderboard_combo(score DESC);
CREATE INDEX idx_leaderboard_combo_updated ON leaderboard_combo(last_updated DESC);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE leaderboard_reflex ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_combo ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read on leaderboard_reflex"
    ON leaderboard_reflex FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated insert/update on leaderboard_reflex"
    ON leaderboard_reflex FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update on leaderboard_reflex"
    ON leaderboard_reflex FOR UPDATE
    USING (true);

CREATE POLICY "Allow public read on leaderboard_streaks"
    ON leaderboard_streaks FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated insert/update on leaderboard_streaks"
    ON leaderboard_streaks FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update on leaderboard_streaks"
    ON leaderboard_streaks FOR UPDATE
    USING (true);

CREATE POLICY "Allow public read on leaderboard_combo"
    ON leaderboard_combo FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated insert/update on leaderboard_combo"
    ON leaderboard_combo FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update on leaderboard_combo"
    ON leaderboard_combo FOR UPDATE
    USING (true);
