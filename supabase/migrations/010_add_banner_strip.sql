-- ===========================================
-- ADD BANNER STRIP URL TO SERVERS
-- Run this in Supabase SQL Editor
-- ===========================================

-- Add banner_strip_url column to servers table
ALTER TABLE servers 
ADD COLUMN IF NOT EXISTS banner_strip_url TEXT;

-- Add comment explaining the field
COMMENT ON COLUMN servers.banner_strip_url IS 'Classic server listing banner strip (468x60 pixels, supports GIFs)';

-- Done!
SELECT 'banner_strip_url column added to servers table' AS status;


