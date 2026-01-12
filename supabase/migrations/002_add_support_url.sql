-- Add support_url field to mods table for creator donation/payment links
ALTER TABLE mods ADD COLUMN IF NOT EXISTS support_url TEXT;

-- Add external_url field for mods that link to external sites (Patreon, Gumroad, etc.)
ALTER TABLE mods ADD COLUMN IF NOT EXISTS external_url TEXT;

-- Add is_premium flag to indicate if mod requires payment
ALTER TABLE mods ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false;

-- Function to increment mod downloads
CREATE OR REPLACE FUNCTION increment_mod_downloads(mod_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE mods SET downloads = downloads + 1 WHERE id = mod_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment version downloads
CREATE OR REPLACE FUNCTION increment_version_downloads(version_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE mod_versions SET downloads = downloads + 1 WHERE id = version_id;
END;
$$ LANGUAGE plpgsql;

