-- =============================================
-- IDEA COMMENTS TABLE
-- =============================================

-- Create idea_comments table
CREATE TABLE idea_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_idea_comments_idea_id ON idea_comments(idea_id);
CREATE INDEX idx_idea_comments_author_id ON idea_comments(author_id);
CREATE INDEX idx_idea_comments_created ON idea_comments(created_at DESC);

-- Enable RLS
ALTER TABLE idea_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can read comments
CREATE POLICY "Anyone can read idea comments"
  ON idea_comments FOR SELECT
  USING (true);

-- Authenticated users can insert their own comments
CREATE POLICY "Authenticated users can insert their own comments"
  ON idea_comments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own comments
CREATE POLICY "Users can update their own comments"
  ON idea_comments FOR UPDATE
  USING (author_id = auth.uid());

-- Users can delete their own comments
CREATE POLICY "Users can delete their own comments"
  ON idea_comments FOR DELETE
  USING (author_id = auth.uid());

