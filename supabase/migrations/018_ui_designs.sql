-- ═══════════════════════════════════════════════════════════════════════════
-- Hytale UI Builder - Database Schema for Saved Designs
-- Migration: 018_ui_designs.sql
-- ═══════════════════════════════════════════════════════════════════════════

-- Create ui_designs table
CREATE TABLE IF NOT EXISTS ui_designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL, -- Clerk user ID
  name TEXT NOT NULL DEFAULT 'Untitled Design',
  description TEXT,
  design_data JSONB NOT NULL, -- The full UIDesign object
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user lookups
CREATE INDEX IF NOT EXISTS idx_ui_designs_user_id ON ui_designs(user_id);

-- Index for public designs
CREATE INDEX IF NOT EXISTS idx_ui_designs_public ON ui_designs(is_public) WHERE is_public = true;

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_ui_designs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ui_designs_updated_at
  BEFORE UPDATE ON ui_designs
  FOR EACH ROW
  EXECUTE FUNCTION update_ui_designs_updated_at();

-- RLS Policies
ALTER TABLE ui_designs ENABLE ROW LEVEL SECURITY;

-- Users can view their own designs
CREATE POLICY "Users can view own designs"
  ON ui_designs FOR SELECT
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Users can insert their own designs
CREATE POLICY "Users can insert own designs"
  ON ui_designs FOR INSERT
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Users can update their own designs
CREATE POLICY "Users can update own designs"
  ON ui_designs FOR UPDATE
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Users can delete their own designs
CREATE POLICY "Users can delete own designs"
  ON ui_designs FOR DELETE
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Anyone can view public designs
CREATE POLICY "Anyone can view public designs"
  ON ui_designs FOR SELECT
  USING (is_public = true);

