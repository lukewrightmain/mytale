-- ===========================================
-- MAPS TABLE
-- ===========================================
CREATE TABLE maps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  thumbnail_url TEXT,
  category TEXT NOT NULL DEFAULT 'Adventure',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  support_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for maps
CREATE INDEX idx_maps_status ON maps(status);
CREATE INDEX idx_maps_featured ON maps(is_featured);
CREATE INDEX idx_maps_category ON maps(category);
CREATE INDEX idx_maps_downloads ON maps(downloads DESC);

-- ===========================================
-- MAP VERSIONS TABLE
-- ===========================================
CREATE TABLE map_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  map_id UUID REFERENCES maps(id) ON DELETE CASCADE,
  version_number TEXT NOT NULL,
  game_version TEXT NOT NULL,
  changelog TEXT,
  download_url TEXT NOT NULL,
  file_size BIGINT,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(map_id, version_number)
);

CREATE INDEX idx_map_versions_map ON map_versions(map_id);

-- ===========================================
-- TEXTURES TABLE
-- ===========================================
CREATE TABLE textures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  thumbnail_url TEXT,
  resolution TEXT NOT NULL DEFAULT '16x',
  category TEXT NOT NULL DEFAULT 'Realistic',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  support_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for textures
CREATE INDEX idx_textures_status ON textures(status);
CREATE INDEX idx_textures_featured ON textures(is_featured);
CREATE INDEX idx_textures_resolution ON textures(resolution);
CREATE INDEX idx_textures_downloads ON textures(downloads DESC);

-- ===========================================
-- TEXTURE VERSIONS TABLE
-- ===========================================
CREATE TABLE texture_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  texture_id UUID REFERENCES textures(id) ON DELETE CASCADE,
  version_number TEXT NOT NULL,
  game_version TEXT NOT NULL,
  changelog TEXT,
  download_url TEXT NOT NULL,
  file_size BIGINT,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(texture_id, version_number)
);

CREATE INDEX idx_texture_versions_texture ON texture_versions(texture_id);

-- ===========================================
-- RLS POLICIES
-- ===========================================

-- Enable RLS
ALTER TABLE maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE map_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE textures ENABLE ROW LEVEL SECURITY;
ALTER TABLE texture_versions ENABLE ROW LEVEL SECURITY;

-- Maps policies
CREATE POLICY "Approved maps are viewable by everyone" ON maps
  FOR SELECT USING (status = 'approved' OR is_featured = true);

CREATE POLICY "Anyone can insert maps" ON maps
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update maps" ON maps
  FOR UPDATE USING (true);

-- Map versions policies
CREATE POLICY "Map versions are viewable by everyone" ON map_versions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert map versions" ON map_versions
  FOR INSERT WITH CHECK (true);

-- Textures policies
CREATE POLICY "Approved textures are viewable by everyone" ON textures
  FOR SELECT USING (status = 'approved' OR is_featured = true);

CREATE POLICY "Anyone can insert textures" ON textures
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update textures" ON textures
  FOR UPDATE USING (true);

-- Texture versions policies
CREATE POLICY "Texture versions are viewable by everyone" ON texture_versions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert texture versions" ON texture_versions
  FOR INSERT WITH CHECK (true);

-- ===========================================
-- TRIGGERS
-- ===========================================

CREATE TRIGGER update_maps_updated_at BEFORE UPDATE ON maps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_textures_updated_at BEFORE UPDATE ON textures
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- DOWNLOAD INCREMENT FUNCTIONS
-- ===========================================

CREATE OR REPLACE FUNCTION increment_map_downloads(map_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE maps SET downloads = downloads + 1 WHERE id = map_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_map_version_downloads(version_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE map_versions SET downloads = downloads + 1 WHERE id = version_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_texture_downloads(texture_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE textures SET downloads = downloads + 1 WHERE id = texture_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_texture_version_downloads(version_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE texture_versions SET downloads = downloads + 1 WHERE id = version_id;
END;
$$ LANGUAGE plpgsql;


