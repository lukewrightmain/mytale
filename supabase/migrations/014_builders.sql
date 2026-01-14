-- ===========================================
-- BUILDERS TABLE - Builder Profiles/Portfolios
-- ===========================================

CREATE TABLE builders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  builder_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  thumbnail_url TEXT,
  banner_url TEXT,
  -- Social links
  discord_url TEXT,
  twitter_url TEXT,
  youtube_url TEXT,
  website_url TEXT,
  -- Stats
  upvotes INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_builders_status ON builders(status);
CREATE INDEX idx_builders_upvotes ON builders(upvotes DESC);
CREATE INDEX idx_builders_featured ON builders(is_featured);
CREATE INDEX idx_builders_created ON builders(created_at DESC);

-- ===========================================
-- BUILDER PORTFOLIO ITEMS TABLE - Images/Videos
-- ===========================================

CREATE TABLE builder_portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  builder_id UUID REFERENCES builders(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,  -- Image URL or YouTube video URL
  thumbnail_url TEXT,  -- For videos, optional thumbnail
  title TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,  -- For ordering items
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_portfolio_items_builder ON builder_portfolio_items(builder_id);
CREATE INDEX idx_portfolio_items_order ON builder_portfolio_items(builder_id, display_order);

-- ===========================================
-- BUILDER VOTES TABLE - Track upvotes by IP hash
-- ===========================================

CREATE TABLE builder_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  builder_id UUID REFERENCES builders(id) ON DELETE CASCADE,
  ip_hash TEXT NOT NULL,  -- SHA256 hash of IP for privacy
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,  -- Optional: also track user if logged in
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- One vote per IP per builder
  UNIQUE(builder_id, ip_hash)
);

CREATE INDEX idx_builder_votes_builder ON builder_votes(builder_id);
CREATE INDEX idx_builder_votes_ip ON builder_votes(ip_hash);

-- ===========================================
-- RLS POLICIES
-- ===========================================

ALTER TABLE builders ENABLE ROW LEVEL SECURITY;
ALTER TABLE builder_portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE builder_votes ENABLE ROW LEVEL SECURITY;

-- Builders: Anyone can read approved builders
CREATE POLICY "Approved builders are viewable by everyone" ON builders
  FOR SELECT USING (status = 'approved' OR is_featured = true);

CREATE POLICY "Anyone can insert builders" ON builders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Builders can update own profile" ON builders
  FOR UPDATE USING (true);  -- Will be restricted via Clerk in app

-- Portfolio Items: Anyone can read items for approved builders
CREATE POLICY "Portfolio items are viewable for approved builders" ON builder_portfolio_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM builders 
      WHERE builders.id = builder_portfolio_items.builder_id 
      AND (builders.status = 'approved' OR builders.is_featured = true)
    )
  );

CREATE POLICY "Builders can insert portfolio items" ON builder_portfolio_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Builders can update own portfolio items" ON builder_portfolio_items
  FOR UPDATE USING (true);

CREATE POLICY "Builders can delete own portfolio items" ON builder_portfolio_items
  FOR DELETE USING (true);

-- Builder Votes: Anyone can read and insert votes
CREATE POLICY "Builder votes are viewable by everyone" ON builder_votes
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert builder votes" ON builder_votes
  FOR INSERT WITH CHECK (true);

-- ===========================================
-- TRIGGERS
-- ===========================================

CREATE TRIGGER update_builders_updated_at BEFORE UPDATE ON builders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolio_items_updated_at BEFORE UPDATE ON builder_portfolio_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- FUNCTIONS FOR VOTING
-- ===========================================

-- Function to upvote a builder (handles duplicate checking)
CREATE OR REPLACE FUNCTION upvote_builder(p_builder_id UUID, p_ip_hash TEXT, p_user_id UUID DEFAULT NULL)
RETURNS JSON AS $$
DECLARE
  v_existing_vote UUID;
  v_new_upvotes INTEGER;
BEGIN
  -- Check if already voted
  SELECT id INTO v_existing_vote
  FROM builder_votes
  WHERE builder_id = p_builder_id AND ip_hash = p_ip_hash;
  
  IF v_existing_vote IS NOT NULL THEN
    RETURN json_build_object('success', false, 'error', 'already_voted');
  END IF;
  
  -- Insert vote
  INSERT INTO builder_votes (builder_id, ip_hash, user_id)
  VALUES (p_builder_id, p_ip_hash, p_user_id);
  
  -- Increment upvote count on builder
  UPDATE builders 
  SET upvotes = upvotes + 1 
  WHERE id = p_builder_id
  RETURNING upvotes INTO v_new_upvotes;
  
  RETURN json_build_object('success', true, 'upvotes', v_new_upvotes);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if an IP has upvoted a builder
CREATE OR REPLACE FUNCTION has_upvoted_builder(p_builder_id UUID, p_ip_hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM builder_votes 
    WHERE builder_id = p_builder_id AND ip_hash = p_ip_hash
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
