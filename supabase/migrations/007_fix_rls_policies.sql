-- ===========================================
-- FIX RLS POLICIES FOR ALL TABLES
-- This migration ensures inserts work properly
-- ===========================================

-- =====================
-- MODS TABLE
-- =====================
-- Drop existing insert policy if it exists
DROP POLICY IF EXISTS "Anyone can insert mods" ON mods;

-- Create permissive insert policy
CREATE POLICY "Anyone can insert mods" ON mods
  FOR INSERT WITH CHECK (true);

-- Also need UPDATE policy for owners to edit their mods
DROP POLICY IF EXISTS "Anyone can update mods" ON mods;
CREATE POLICY "Anyone can update mods" ON mods
  FOR UPDATE USING (true);

-- =====================
-- MOD_VERSIONS TABLE  
-- =====================
DROP POLICY IF EXISTS "Anyone can insert mod_versions" ON mod_versions;
CREATE POLICY "Anyone can insert mod_versions" ON mod_versions
  FOR INSERT WITH CHECK (true);

-- =====================
-- SERVERS TABLE
-- =====================
DROP POLICY IF EXISTS "Anyone can insert servers" ON servers;
CREATE POLICY "Anyone can insert servers" ON servers
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update servers" ON servers;
CREATE POLICY "Anyone can update servers" ON servers
  FOR UPDATE USING (true);

-- =====================
-- PROFILES TABLE
-- =====================
DROP POLICY IF EXISTS "Anyone can insert profiles" ON profiles;
CREATE POLICY "Anyone can insert profiles" ON profiles
  FOR INSERT WITH CHECK (true);

-- =====================
-- PLUGINS TABLE (if exists)
-- =====================
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'plugins') THEN
    DROP POLICY IF EXISTS "Anyone can insert plugins" ON plugins;
    EXECUTE 'CREATE POLICY "Anyone can insert plugins" ON plugins FOR INSERT WITH CHECK (true)';
    
    DROP POLICY IF EXISTS "Anyone can update plugins" ON plugins;
    EXECUTE 'CREATE POLICY "Anyone can update plugins" ON plugins FOR UPDATE USING (true)';
  END IF;
END $$;

-- =====================
-- PLUGIN_VERSIONS TABLE (if exists)
-- =====================
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'plugin_versions') THEN
    DROP POLICY IF EXISTS "Anyone can insert plugin_versions" ON plugin_versions;
    EXECUTE 'CREATE POLICY "Anyone can insert plugin_versions" ON plugin_versions FOR INSERT WITH CHECK (true)';
  END IF;
END $$;

-- =====================
-- MAPS TABLE (if exists)
-- =====================
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'maps') THEN
    DROP POLICY IF EXISTS "Anyone can insert maps" ON maps;
    EXECUTE 'CREATE POLICY "Anyone can insert maps" ON maps FOR INSERT WITH CHECK (true)';
    
    DROP POLICY IF EXISTS "Anyone can update maps" ON maps;
    EXECUTE 'CREATE POLICY "Anyone can update maps" ON maps FOR UPDATE USING (true)';
  END IF;
END $$;

-- =====================
-- MAP_VERSIONS TABLE (if exists)
-- =====================
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'map_versions') THEN
    DROP POLICY IF EXISTS "Anyone can insert map_versions" ON map_versions;
    EXECUTE 'CREATE POLICY "Anyone can insert map_versions" ON map_versions FOR INSERT WITH CHECK (true)';
  END IF;
END $$;

-- =====================
-- TEXTURES TABLE (if exists)
-- =====================
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'textures') THEN
    DROP POLICY IF EXISTS "Anyone can insert textures" ON textures;
    EXECUTE 'CREATE POLICY "Anyone can insert textures" ON textures FOR INSERT WITH CHECK (true)';
    
    DROP POLICY IF EXISTS "Anyone can update textures" ON textures;
    EXECUTE 'CREATE POLICY "Anyone can update textures" ON textures FOR UPDATE USING (true)';
  END IF;
END $$;

-- =====================
-- TEXTURE_VERSIONS TABLE (if exists)
-- =====================
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'texture_versions') THEN
    DROP POLICY IF EXISTS "Anyone can insert texture_versions" ON texture_versions;
    EXECUTE 'CREATE POLICY "Anyone can insert texture_versions" ON texture_versions FOR INSERT WITH CHECK (true)';
  END IF;
END $$;


