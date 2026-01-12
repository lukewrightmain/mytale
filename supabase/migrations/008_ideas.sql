-- ===========================================
-- IDEAS TABLE - Community Mod Suggestions
-- ===========================================

CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  votes INTEGER DEFAULT 0,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'closed')),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_ideas_status ON ideas(status);
CREATE INDEX idx_ideas_votes ON ideas(votes DESC);
CREATE INDEX idx_ideas_category ON ideas(category);
CREATE INDEX idx_ideas_created ON ideas(created_at DESC);

-- ===========================================
-- IDEA VOTES TABLE - Track votes by IP hash
-- ===========================================

CREATE TABLE idea_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  ip_hash TEXT NOT NULL,  -- SHA256 hash of IP for privacy
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,  -- Optional: also track user if logged in
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- One vote per IP per idea
  UNIQUE(idea_id, ip_hash)
);

CREATE INDEX idx_idea_votes_idea ON idea_votes(idea_id);
CREATE INDEX idx_idea_votes_ip ON idea_votes(ip_hash);

-- ===========================================
-- RLS POLICIES
-- ===========================================

ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_votes ENABLE ROW LEVEL SECURITY;

-- Ideas: Anyone can read open ideas
CREATE POLICY "Open ideas are viewable by everyone" ON ideas
  FOR SELECT USING (status IN ('open', 'in_progress', 'completed') OR is_featured = true);

CREATE POLICY "Anyone can insert ideas" ON ideas
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update ideas" ON ideas
  FOR UPDATE USING (true);

-- Idea Votes: Anyone can read and insert votes
CREATE POLICY "Votes are viewable by everyone" ON idea_votes
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert votes" ON idea_votes
  FOR INSERT WITH CHECK (true);

-- ===========================================
-- TRIGGERS
-- ===========================================

CREATE TRIGGER update_ideas_updated_at BEFORE UPDATE ON ideas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- FUNCTION TO INCREMENT VOTE COUNT
-- ===========================================

-- Function to vote for an idea (handles duplicate checking)
CREATE OR REPLACE FUNCTION vote_for_idea(p_idea_id UUID, p_ip_hash TEXT, p_user_id UUID DEFAULT NULL)
RETURNS JSON AS $$
DECLARE
  v_existing_vote UUID;
  v_new_votes INTEGER;
BEGIN
  -- Check if already voted
  SELECT id INTO v_existing_vote
  FROM idea_votes
  WHERE idea_id = p_idea_id AND ip_hash = p_ip_hash;
  
  IF v_existing_vote IS NOT NULL THEN
    RETURN json_build_object('success', false, 'error', 'already_voted');
  END IF;
  
  -- Insert vote
  INSERT INTO idea_votes (idea_id, ip_hash, user_id)
  VALUES (p_idea_id, p_ip_hash, p_user_id);
  
  -- Increment vote count on idea
  UPDATE ideas 
  SET votes = votes + 1 
  WHERE id = p_idea_id
  RETURNING votes INTO v_new_votes;
  
  RETURN json_build_object('success', true, 'votes', v_new_votes);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if an IP has voted for an idea
CREATE OR REPLACE FUNCTION has_voted_for_idea(p_idea_id UUID, p_ip_hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM idea_votes 
    WHERE idea_id = p_idea_id AND ip_hash = p_ip_hash
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

