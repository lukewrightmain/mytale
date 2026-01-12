-- ===========================================
-- STORAGE BUCKET SETUP
-- Run this in Supabase SQL Editor
-- ===========================================

-- Create the uploads bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'uploads',
  'uploads', 
  true,  -- Public bucket so images can be viewed
  5242880,  -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view files (public bucket)
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'uploads');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'uploads');

-- Allow users to update their own files
CREATE POLICY "Users can update own files" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'uploads');

-- Allow users to delete their own files  
CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'uploads');

