-- Add mod_versions for CurseForge mods so the Download buttons work
-- Thumbnail URLs are set to NULL - you can update them manually by:
-- 1. Go to each CurseForge mod page
-- 2. Right-click the mod icon -> "Copy image address"
-- 3. Update the mods table in Supabase

-- Add mod_versions for download buttons
DO $$
DECLARE
    mod_id_ymmersive_melodies UUID;
    mod_id_advanced_item_info UUID;
    mod_id_lucky_mining UUID;
    mod_id_shimmer_shrubs UUID;
    mod_id_vector_runes UUID;
    mod_id_books_papers UUID;
    mod_id_ymmersive_statues UUID;
    mod_id_ymmersive_foliage UUID;
    mod_id_wayback_charm UUID;
    mod_id_ymmersive_masonry UUID;
    mod_id_pixel_paintings UUID;
BEGIN
    -- Get all mod IDs
    SELECT id INTO mod_id_ymmersive_melodies FROM mods WHERE slug = 'ymmersive-melodies';
    SELECT id INTO mod_id_advanced_item_info FROM mods WHERE slug = 'advanced-item-info';
    SELECT id INTO mod_id_lucky_mining FROM mods WHERE slug = 'lucky-mining';
    SELECT id INTO mod_id_shimmer_shrubs FROM mods WHERE slug = 'shimmer-shrubs';
    SELECT id INTO mod_id_vector_runes FROM mods WHERE slug = 'vector-runes';
    SELECT id INTO mod_id_books_papers FROM mods WHERE slug = 'books-and-papers';
    SELECT id INTO mod_id_ymmersive_statues FROM mods WHERE slug = 'ymmersive-statues';
    SELECT id INTO mod_id_ymmersive_foliage FROM mods WHERE slug = 'ymmersive-foliage';
    SELECT id INTO mod_id_wayback_charm FROM mods WHERE slug = 'wayback-charm';
    SELECT id INTO mod_id_ymmersive_masonry FROM mods WHERE slug = 'ymmersive-masonry';
    SELECT id INTO mod_id_pixel_paintings FROM mods WHERE slug = 'pixel-paintings';

    -- Insert mod versions (only if the mod exists)
    -- Note: download URLs point to CurseForge download page which redirects to latest file
    
    IF mod_id_ymmersive_melodies IS NOT NULL THEN
        INSERT INTO mod_versions (mod_id, version_number, game_version, changelog, download_url, file_size, downloads)
        VALUES (mod_id_ymmersive_melodies, '1.0.1', '1.0.0', 'Initial release', 'https://www.curseforge.com/hytale/mods/ymmersive-melodies/download', 13200000, 900)
        ON CONFLICT (mod_id, version_number) DO NOTHING;
    END IF;

    IF mod_id_advanced_item_info IS NOT NULL THEN
        INSERT INTO mod_versions (mod_id, version_number, game_version, changelog, download_url, file_size, downloads)
        VALUES (mod_id_advanced_item_info, '1.0.0', '1.0.0', 'Initial release', 'https://www.curseforge.com/hytale/mods/advanced-item-info/download', 18000, 7600)
        ON CONFLICT (mod_id, version_number) DO NOTHING;
    END IF;

    IF mod_id_lucky_mining IS NOT NULL THEN
        INSERT INTO mod_versions (mod_id, version_number, game_version, changelog, download_url, file_size, downloads)
        VALUES (mod_id_lucky_mining, '1.0.0', '1.0.0', 'Initial release', 'https://www.curseforge.com/hytale/mods/lucky-mining/download', 308000, 4000)
        ON CONFLICT (mod_id, version_number) DO NOTHING;
    END IF;

    IF mod_id_shimmer_shrubs IS NOT NULL THEN
        INSERT INTO mod_versions (mod_id, version_number, game_version, changelog, download_url, file_size, downloads)
        VALUES (mod_id_shimmer_shrubs, '1.0.0', '1.0.0', 'Initial release', 'https://www.curseforge.com/hytale/mods/shimmer-shrubs/download', 185000, 1100)
        ON CONFLICT (mod_id, version_number) DO NOTHING;
    END IF;

    IF mod_id_vector_runes IS NOT NULL THEN
        INSERT INTO mod_versions (mod_id, version_number, game_version, changelog, download_url, file_size, downloads)
        VALUES (mod_id_vector_runes, '1.0.0', '1.0.0', 'Initial release', 'https://www.curseforge.com/hytale/mods/vector-runes/download', 79000, 634)
        ON CONFLICT (mod_id, version_number) DO NOTHING;
    END IF;

    IF mod_id_books_papers IS NOT NULL THEN
        INSERT INTO mod_versions (mod_id, version_number, game_version, changelog, download_url, file_size, downloads)
        VALUES (mod_id_books_papers, '1.0.0', '1.0.0', 'Initial release', 'https://www.curseforge.com/hytale/mods/books-and-papers/download', 11300000, 1400)
        ON CONFLICT (mod_id, version_number) DO NOTHING;
    END IF;

    IF mod_id_ymmersive_statues IS NOT NULL THEN
        INSERT INTO mod_versions (mod_id, version_number, game_version, changelog, download_url, file_size, downloads)
        VALUES (mod_id_ymmersive_statues, '1.0.0', '1.0.0', 'Initial release', 'https://www.curseforge.com/hytale/mods/ymmersive-statues/download', 34170000, 1500)
        ON CONFLICT (mod_id, version_number) DO NOTHING;
    END IF;

    IF mod_id_ymmersive_foliage IS NOT NULL THEN
        INSERT INTO mod_versions (mod_id, version_number, game_version, changelog, download_url, file_size, downloads)
        VALUES (mod_id_ymmersive_foliage, '1.0.0', '1.0.0', 'Initial release', 'https://www.curseforge.com/hytale/mods/ymmersive-foliage/download', 852000, 2000)
        ON CONFLICT (mod_id, version_number) DO NOTHING;
    END IF;

    IF mod_id_wayback_charm IS NOT NULL THEN
        INSERT INTO mod_versions (mod_id, version_number, game_version, changelog, download_url, file_size, downloads)
        VALUES (mod_id_wayback_charm, '1.0.0', '1.0.0', 'Initial release', 'https://www.curseforge.com/hytale/mods/wayback-charm/download', 134000, 1800)
        ON CONFLICT (mod_id, version_number) DO NOTHING;
    END IF;

    IF mod_id_ymmersive_masonry IS NOT NULL THEN
        INSERT INTO mod_versions (mod_id, version_number, game_version, changelog, download_url, file_size, downloads)
        VALUES (mod_id_ymmersive_masonry, '1.0.0', '1.0.0', 'Initial release', 'https://www.curseforge.com/hytale/mods/ymmersive-masonry/download', 5200000, 1700)
        ON CONFLICT (mod_id, version_number) DO NOTHING;
    END IF;

    IF mod_id_pixel_paintings IS NOT NULL THEN
        INSERT INTO mod_versions (mod_id, version_number, game_version, changelog, download_url, file_size, downloads)
        VALUES (mod_id_pixel_paintings, '1.0.0', '1.0.0', 'Initial release', 'https://www.curseforge.com/hytale/mods/pixel-paintings/download', 214000, 1100)
        ON CONFLICT (mod_id, version_number) DO NOTHING;
    END IF;

END $$;
