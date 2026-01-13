-- Update thumbnail URLs for CurseForge mods
-- HOW TO GET THUMBNAIL URLs:
-- 1. Go to each mod's CurseForge page (e.g. https://www.curseforge.com/hytale/mods/ymmersive-melodies)
-- 2. Right-click on the mod's icon/thumbnail image
-- 3. Select "Copy image address"
-- 4. Paste the URL below in the appropriate UPDATE statement

-- Example URL format: https://media.forgecdn.net/avatars/1405/916/638911112148199148.png

-- Ymmersive Melodies - I found this one from network requests!
UPDATE mods SET thumbnail_url = 'https://media.forgecdn.net/avatars/1405/916/638911112148199148.png' 
WHERE slug = 'ymmersive-melodies';

-- TODO: Add the rest by copying image URLs from CurseForge
-- UPDATE mods SET thumbnail_url = 'PASTE_URL_HERE' WHERE slug = 'advanced-item-info';
-- UPDATE mods SET thumbnail_url = 'PASTE_URL_HERE' WHERE slug = 'lucky-mining';
-- UPDATE mods SET thumbnail_url = 'PASTE_URL_HERE' WHERE slug = 'shimmer-shrubs';
-- UPDATE mods SET thumbnail_url = 'PASTE_URL_HERE' WHERE slug = 'vector-runes';
-- UPDATE mods SET thumbnail_url = 'PASTE_URL_HERE' WHERE slug = 'books-and-papers';
-- UPDATE mods SET thumbnail_url = 'PASTE_URL_HERE' WHERE slug = 'ymmersive-statues';
-- UPDATE mods SET thumbnail_url = 'PASTE_URL_HERE' WHERE slug = 'ymmersive-foliage';
-- UPDATE mods SET thumbnail_url = 'PASTE_URL_HERE' WHERE slug = 'wayback-charm';
-- UPDATE mods SET thumbnail_url = 'PASTE_URL_HERE' WHERE slug = 'ymmersive-masonry';
-- UPDATE mods SET thumbnail_url = 'PASTE_URL_HERE' WHERE slug = 'pixel-paintings';

