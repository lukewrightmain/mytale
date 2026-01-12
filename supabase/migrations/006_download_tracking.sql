-- ===========================================
-- DOWNLOAD TRACKING FUNCTIONS FOR ALL CONTENT TYPES
-- ===========================================

-- MOD DOWNLOADS (may already exist, using CREATE OR REPLACE)
CREATE OR REPLACE FUNCTION increment_mod_downloads(mod_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE mods SET downloads = downloads + 1 WHERE id = mod_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_mod_version_downloads(version_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE mod_versions SET downloads = downloads + 1 WHERE id = version_id;
END;
$$ LANGUAGE plpgsql;

-- PLUGIN DOWNLOADS
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

-- MAP DOWNLOADS
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

-- TEXTURE DOWNLOADS
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

