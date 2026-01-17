-- ===========================================
-- PLUGINS TABLE
-- ===========================================
CREATE TABLE plugins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  thumbnail_url TEXT,
  category TEXT NOT NULL DEFAULT 'Utility',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  support_url TEXT,
  -- Plugin-specific fields
  server_side BOOLEAN DEFAULT true,
  client_side BOOLEAN DEFAULT false,
  api_version TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_plugins_status ON plugins(status);
CREATE INDEX idx_plugins_featured ON plugins(is_featured);
CREATE INDEX idx_plugins_category ON plugins(category);
CREATE INDEX idx_plugins_downloads ON plugins(downloads DESC);

-- ===========================================
-- PLUGIN VERSIONS TABLE
-- ===========================================
CREATE TABLE plugin_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plugin_id UUID REFERENCES plugins(id) ON DELETE CASCADE,
  version_number TEXT NOT NULL,
  game_version TEXT NOT NULL,
  changelog TEXT,
  download_url TEXT NOT NULL,
  file_size BIGINT,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(plugin_id, version_number)
);

CREATE INDEX idx_plugin_versions_plugin ON plugin_versions(plugin_id);

-- ===========================================
-- RLS POLICIES
-- ===========================================

ALTER TABLE plugins ENABLE ROW LEVEL SECURITY;
ALTER TABLE plugin_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved plugins are viewable by everyone" ON plugins
  FOR SELECT USING (status = 'approved' OR is_featured = true);

CREATE POLICY "Anyone can insert plugins" ON plugins
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update plugins" ON plugins
  FOR UPDATE USING (true);

CREATE POLICY "Plugin versions are viewable by everyone" ON plugin_versions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert plugin versions" ON plugin_versions
  FOR INSERT WITH CHECK (true);

-- ===========================================
-- TRIGGERS
-- ===========================================

CREATE TRIGGER update_plugins_updated_at BEFORE UPDATE ON plugins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- DOWNLOAD INCREMENT FUNCTIONS
-- ===========================================

CREATE OR REPLACE FUNCTION increment_plugin_downloads(plugin_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE plugins SET downloads = downloads + 1 WHERE id = plugin_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_plugin_version_downloads(version_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE plugin_versions SET downloads = downloads + 1 WHERE id = version_id;
END;
$$ LANGUAGE plpgsql;


