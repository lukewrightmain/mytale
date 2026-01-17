-- ===========================================
-- SEED DATA FOR MYTALE
-- Run this AFTER schema.sql
-- ===========================================

-- Create a demo profile
INSERT INTO profiles (id, clerk_id, username, display_name, bio) VALUES
  ('00000000-0000-0000-0000-000000000001', 'demo_user', 'mytale_official', 'Mytale Team', 'Official Mytale development team'),
  ('00000000-0000-0000-0000-000000000002', 'demo_creator', 'hytale_modder', 'HytaleModder', 'Creating awesome Hytale content!');

-- Seed Servers (status = 'approved' so they show up)
INSERT INTO servers (owner_id, name, slug, description, ip_address, region, game_modes, max_players, players_online, is_featured, is_verified, status) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Hytale Hub', 'hytale-hub', 'The original Hytale community server. Join thousands of players in epic adventures!', 'hub.hytale.com', 'NA', ARRAY['Survival', 'Creative', 'Minigames'], 500, 342, true, true, 'approved'),
  ('00000000-0000-0000-0000-000000000001', 'Ember Realms', 'ember-realms', 'PvP focused server with custom game modes and tournaments.', 'play.emberrealms.net', 'EU', ARRAY['PvP', 'Factions', 'KitPvP'], 200, 156, true, true, 'approved'),
  ('00000000-0000-0000-0000-000000000002', 'Starlight SMP', 'starlight-smp', 'A peaceful survival multiplayer experience with friendly community.', 'smp.starlight.gg', 'NA', ARRAY['Survival', 'Economy'], 100, 87, false, true, 'approved'),
  ('00000000-0000-0000-0000-000000000002', 'Adventure Awaits', 'adventure-awaits', 'Story-driven server with custom quests and NPCs.', 'adventure.hytale.io', 'AS', ARRAY['Adventure', 'RPG', 'Quests'], 150, 45, true, false, 'approved'),
  ('00000000-0000-0000-0000-000000000001', 'Block Party', 'block-party', 'Casual minigame server for all ages.', 'party.blockplay.net', 'EU', ARRAY['Minigames', 'Parkour'], 300, 210, false, true, 'approved'),
  ('00000000-0000-0000-0000-000000000002', 'Tokyo Craft', 'tokyo-craft', 'Japanese-themed building server with amazing creations.', 'tokyo.hytale.jp', 'AS', ARRAY['Creative', 'Building'], 80, 23, false, false, 'approved');

-- Seed Mods (status = 'approved' so they show up)
INSERT INTO mods (author_id, name, slug, tagline, description, category, mod_type, tags, downloads, rating, rating_count, is_featured, status) VALUES
  ('00000000-0000-0000-0000-000000000002', 'Better Combat', 'better-combat', 'Overhaul the combat system with new mechanics', 'A complete combat overhaul featuring new attack animations, combo systems, and balanced weapon mechanics. Perfect for servers that want more engaging PvP.', 'Gameplay', 'mod', ARRAY['combat', 'pvp', 'animations'], 12543, 4.8, 234, true, 'approved'),
  ('00000000-0000-0000-0000-000000000001', 'Hytale Shaders', 'hytale-shaders', 'Stunning visual enhancements for Hytale', 'Transform your Hytale experience with realistic lighting, shadows, water reflections, and atmospheric effects.', 'Graphics', 'shader', ARRAY['shaders', 'graphics', 'performance'], 45231, 4.9, 892, true, 'approved'),
  ('00000000-0000-0000-0000-000000000002', 'Economy Plus', 'economy-plus', 'Complete economy system for servers', 'Full-featured economy plugin with shops, banks, trading, and auction house support.', 'Server', 'plugin', ARRAY['economy', 'shops', 'trading'], 8721, 4.5, 156, true, 'approved'),
  ('00000000-0000-0000-0000-000000000001', 'Dragon Mounts', 'dragon-mounts', 'Rideable dragons with unique abilities', 'Add magnificent rideable dragons to your game! Each dragon type has unique abilities and can be trained.', 'Creatures', 'mod', ARRAY['dragons', 'mounts', 'creatures'], 23456, 4.7, 445, true, 'approved'),
  ('00000000-0000-0000-0000-000000000002', 'World Edit Pro', 'world-edit-pro', 'Advanced terrain and building tools', 'Professional-grade world editing tools for builders and server admins.', 'Building', 'plugin', ARRAY['worldedit', 'building', 'admin'], 67890, 4.9, 1203, false, 'approved'),
  ('00000000-0000-0000-0000-000000000001', 'Fantasy Textures', 'fantasy-textures', 'High-res medieval fantasy resource pack', 'Beautiful 64x textures with a fantasy medieval theme. Includes custom UI and item textures.', 'Graphics', 'resource_pack', ARRAY['textures', 'medieval', 'fantasy'], 34567, 4.6, 678, false, 'approved'),
  ('00000000-0000-0000-0000-000000000002', 'Mini Map', 'mini-map', 'Lightweight minimap with waypoints', 'A clean, customizable minimap mod with waypoint support and death markers.', 'UI', 'mod', ARRAY['minimap', 'hud', 'navigation'], 89012, 4.4, 1567, false, 'approved'),
  ('00000000-0000-0000-0000-000000000001', 'Furniture Mod', 'furniture-mod', 'Decorative furniture and appliances', 'Over 200 furniture items to decorate your home. Includes functional items like chairs, tables, and more.', 'Building', 'mod', ARRAY['furniture', 'decoration', 'building'], 56789, 4.3, 890, false, 'approved'),
  ('00000000-0000-0000-0000-000000000002', 'Adventure Pack', 'adventure-pack', 'Complete modpack for adventurers', 'A curated collection of mods focused on exploration, dungeons, and epic loot.', 'Adventure', 'modpack', ARRAY['adventure', 'exploration', 'dungeons'], 12345, 4.8, 234, true, 'approved'),
  ('00000000-0000-0000-0000-000000000001', 'Permissions Manager', 'permissions-manager', 'Advanced permission system for servers', 'Comprehensive permission management with groups, inheritance, and per-world settings.', 'Server', 'plugin', ARRAY['permissions', 'admin', 'management'], 45678, 4.7, 567, false, 'approved');

-- Seed some mod versions
INSERT INTO mod_versions (mod_id, version_number, game_version, changelog, download_url, file_size, downloads) 
SELECT 
  m.id,
  '1.0.0',
  '1.0.0',
  'Initial release',
  'https://cdn.mytale.gg/mods/' || m.slug || '/1.0.0.zip',
  1048576,
  m.downloads / 2
FROM mods m;

INSERT INTO mod_versions (mod_id, version_number, game_version, changelog, download_url, file_size, downloads) 
SELECT 
  m.id,
  '1.1.0',
  '1.0.0',
  'Bug fixes and performance improvements',
  'https://cdn.mytale.gg/mods/' || m.slug || '/1.1.0.zip',
  1148576,
  m.downloads / 2
FROM mods m;


