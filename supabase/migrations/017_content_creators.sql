-- ===========================================
-- CONTENT CREATORS TABLE
-- ===========================================

CREATE TABLE content_creators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  bio TEXT,
  -- Images
  thumbnail_url TEXT,
  banner_url TEXT,
  -- Platform links
  twitch_url TEXT,
  youtube_url TEXT,
  twitter_url TEXT,
  tiktok_url TEXT,
  discord_url TEXT,
  website_url TEXT,
  -- Primary platform for filtering
  primary_platform TEXT NOT NULL CHECK (primary_platform IN ('twitch', 'youtube', 'tiktok', 'kick', 'other')),
  -- Language (ISO 639-1 code)
  language TEXT NOT NULL DEFAULT 'en',
  -- Timezone (IANA timezone, e.g., 'America/New_York')
  timezone TEXT NOT NULL DEFAULT 'UTC',
  -- Streaming schedule (JSON array of schedule slots)
  -- Format: [{"day": "monday", "start": "18:00", "end": "22:00"}, ...]
  schedule JSONB DEFAULT '[]'::jsonb,
  -- Stats
  upvotes INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_content_creators_status ON content_creators(status);
CREATE INDEX idx_content_creators_upvotes ON content_creators(upvotes DESC);
CREATE INDEX idx_content_creators_featured ON content_creators(is_featured);
CREATE INDEX idx_content_creators_platform ON content_creators(primary_platform);
CREATE INDEX idx_content_creators_language ON content_creators(language);
CREATE INDEX idx_content_creators_timezone ON content_creators(timezone);
CREATE INDEX idx_content_creators_created ON content_creators(created_at DESC);

-- ===========================================
-- CONTENT CREATOR SERVERS (Many-to-Many)
-- ===========================================

CREATE TABLE content_creator_servers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES content_creators(id) ON DELETE CASCADE,
  server_id UUID REFERENCES servers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(creator_id, server_id)
);

CREATE INDEX idx_creator_servers_creator ON content_creator_servers(creator_id);
CREATE INDEX idx_creator_servers_server ON content_creator_servers(server_id);

-- ===========================================
-- CONTENT CREATOR VOTES TABLE
-- ===========================================

CREATE TABLE content_creator_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES content_creators(id) ON DELETE CASCADE,
  ip_hash TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(creator_id, ip_hash)
);

CREATE INDEX idx_creator_votes_creator ON content_creator_votes(creator_id);
CREATE INDEX idx_creator_votes_ip ON content_creator_votes(ip_hash);

-- ===========================================
-- RLS POLICIES
-- ===========================================

ALTER TABLE content_creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_creator_servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_creator_votes ENABLE ROW LEVEL SECURITY;

-- Content Creators: Anyone can read approved creators
CREATE POLICY "Approved content creators are viewable by everyone" ON content_creators
  FOR SELECT USING (status = 'approved' OR is_featured = true);

CREATE POLICY "Anyone can insert content creators" ON content_creators
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Content creators can update own profile" ON content_creators
  FOR UPDATE USING (true);

-- Creator Servers: Anyone can read
CREATE POLICY "Creator servers are viewable by everyone" ON content_creator_servers
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert creator servers" ON content_creator_servers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can delete creator servers" ON content_creator_servers
  FOR DELETE USING (true);

-- Votes: Anyone can read and insert
CREATE POLICY "Creator votes are viewable by everyone" ON content_creator_votes
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert creator votes" ON content_creator_votes
  FOR INSERT WITH CHECK (true);

-- ===========================================
-- TRIGGERS
-- ===========================================

CREATE TRIGGER update_content_creators_updated_at BEFORE UPDATE ON content_creators
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- FUNCTIONS FOR VOTING
-- ===========================================

CREATE OR REPLACE FUNCTION upvote_content_creator(p_creator_id UUID, p_ip_hash TEXT, p_user_id UUID DEFAULT NULL)
RETURNS JSON AS $$
DECLARE
  v_existing_vote UUID;
  v_new_upvotes INTEGER;
BEGIN
  SELECT id INTO v_existing_vote
  FROM content_creator_votes
  WHERE creator_id = p_creator_id AND ip_hash = p_ip_hash;
  
  IF v_existing_vote IS NOT NULL THEN
    RETURN json_build_object('success', false, 'error', 'already_voted');
  END IF;
  
  INSERT INTO content_creator_votes (creator_id, ip_hash, user_id)
  VALUES (p_creator_id, p_ip_hash, p_user_id);
  
  UPDATE content_creators 
  SET upvotes = upvotes + 1 
  WHERE id = p_creator_id
  RETURNING upvotes INTO v_new_upvotes;
  
  RETURN json_build_object('success', true, 'upvotes', v_new_upvotes);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION has_upvoted_creator(p_creator_id UUID, p_ip_hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM content_creator_votes 
    WHERE creator_id = p_creator_id AND ip_hash = p_ip_hash
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

