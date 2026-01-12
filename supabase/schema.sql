-- ===========================================
-- MYTALE DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ===========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- PROFILES TABLE
-- ===========================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  discord_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for Clerk ID lookups
CREATE INDEX idx_profiles_clerk_id ON profiles(clerk_id);

-- ===========================================
-- SERVERS TABLE
-- ===========================================
CREATE TABLE servers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content TEXT, -- Markdown content for server page
  banner_url TEXT,
  ip_address TEXT NOT NULL,
  port INTEGER DEFAULT 25565,
  discord_url TEXT,
  website_url TEXT,
  region TEXT NOT NULL DEFAULT 'NA',
  game_modes TEXT[] DEFAULT ARRAY[]::TEXT[],
  max_players INTEGER DEFAULT 100,
  players_online INTEGER DEFAULT 0,
  is_online BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_servers_status ON servers(status);
CREATE INDEX idx_servers_featured ON servers(is_featured);
CREATE INDEX idx_servers_players ON servers(players_online DESC);

-- ===========================================
-- MODS TABLE
-- ===========================================
CREATE TABLE mods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT, -- Full markdown description
  thumbnail_url TEXT,
  category TEXT NOT NULL,
  mod_type TEXT NOT NULL CHECK (mod_type IN ('mod', 'plugin', 'resource_pack', 'shader', 'modpack')),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_mods_status ON mods(status);
CREATE INDEX idx_mods_featured ON mods(is_featured);
CREATE INDEX idx_mods_category ON mods(category);
CREATE INDEX idx_mods_downloads ON mods(downloads DESC);
CREATE INDEX idx_mods_rating ON mods(rating DESC);

-- ===========================================
-- MOD VERSIONS TABLE
-- ===========================================
CREATE TABLE mod_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mod_id UUID REFERENCES mods(id) ON DELETE CASCADE,
  version_number TEXT NOT NULL,
  game_version TEXT NOT NULL,
  changelog TEXT,
  download_url TEXT NOT NULL,
  file_size BIGINT,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(mod_id, version_number)
);

CREATE INDEX idx_mod_versions_mod ON mod_versions(mod_id);

-- ===========================================
-- FAVORITES TABLE
-- ===========================================
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mod_id UUID REFERENCES mods(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, mod_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);

-- ===========================================
-- RATINGS TABLE
-- ===========================================
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mod_id UUID REFERENCES mods(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, mod_id)
);

CREATE INDEX idx_ratings_mod ON ratings(mod_id);

-- ===========================================
-- ROW LEVEL SECURITY (RLS)
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE mods ENABLE ROW LEVEL SECURITY;
ALTER TABLE mod_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can read, users can update their own
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (true); -- Will be restricted via Clerk in app

-- Servers: Anyone can read approved, owners can manage their own
CREATE POLICY "Approved servers are viewable by everyone" ON servers
  FOR SELECT USING (status = 'approved' OR is_featured = true);

CREATE POLICY "Anyone can insert servers" ON servers
  FOR INSERT WITH CHECK (true);

-- Mods: Anyone can read approved, authors can manage their own
CREATE POLICY "Approved mods are viewable by everyone" ON mods
  FOR SELECT USING (status = 'approved' OR is_featured = true);

CREATE POLICY "Anyone can insert mods" ON mods
  FOR INSERT WITH CHECK (true);

-- Mod versions: Anyone can read
CREATE POLICY "Mod versions are viewable by everyone" ON mod_versions
  FOR SELECT USING (true);

-- Favorites: Users manage their own
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (true);

CREATE POLICY "Users can insert favorites" ON favorites
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (true);

-- Ratings: Anyone can read, users manage their own
CREATE POLICY "Ratings are viewable by everyone" ON ratings
  FOR SELECT USING (true);

CREATE POLICY "Users can insert ratings" ON ratings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own ratings" ON ratings
  FOR UPDATE USING (true);

-- ===========================================
-- FUNCTIONS & TRIGGERS
-- ===========================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_servers_updated_at BEFORE UPDATE ON servers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mods_updated_at BEFORE UPDATE ON mods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ratings_updated_at BEFORE UPDATE ON ratings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update mod rating when a new rating is added
CREATE OR REPLACE FUNCTION update_mod_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE mods SET 
    rating = (SELECT AVG(rating)::DECIMAL(2,1) FROM ratings WHERE mod_id = NEW.mod_id),
    rating_count = (SELECT COUNT(*) FROM ratings WHERE mod_id = NEW.mod_id)
  WHERE id = NEW.mod_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_mod_rating_on_insert AFTER INSERT ON ratings
  FOR EACH ROW EXECUTE FUNCTION update_mod_rating();

CREATE TRIGGER update_mod_rating_on_update AFTER UPDATE ON ratings
  FOR EACH ROW EXECUTE FUNCTION update_mod_rating();

