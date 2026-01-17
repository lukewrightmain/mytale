-- ===========================================
-- ADD GALLERY SUPPORT TO MAPS
-- ===========================================

-- Add gallery_images column (array of image URLs, max 5)
ALTER TABLE maps ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add video_url column for YouTube embeds
ALTER TABLE maps ADD COLUMN IF NOT EXISTS video_url TEXT;

-- ===========================================
-- ADD GALLERY SUPPORT TO TEXTURES (for consistency)
-- ===========================================

-- Add gallery_images column to textures as well
ALTER TABLE textures ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add video_url column for YouTube embeds
ALTER TABLE textures ADD COLUMN IF NOT EXISTS video_url TEXT;

