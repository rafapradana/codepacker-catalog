-- Create storage buckets for CodePacker Catalog
-- Run this script if automatic setup fails

-- Create profile-photos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-photos',
  'profile-photos',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create skill-icons bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'skill-icons',
  'skill-icons',
  true,
  1048576, -- 1MB
  ARRAY['image/svg+xml', 'image/png', 'image/jpeg']
) ON CONFLICT (id) DO NOTHING;

-- Create techstack-icons bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'techstack-icons',
  'techstack-icons',
  true,
  1048576, -- 1MB
  ARRAY['image/svg+xml', 'image/png', 'image/jpeg']
) ON CONFLICT (id) DO NOTHING;

-- Create project-thumbnails bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-thumbnails',
  'project-thumbnails',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create project-media bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-media',
  'project-media',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policies for profile-photos
CREATE POLICY "profile_photos_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-photos');

CREATE POLICY "profile_photos_authenticated_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-photos' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "profile_photos_owner_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'profile-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "profile_photos_owner_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'profile-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create storage policies for skill-icons
CREATE POLICY "skill_icons_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'skill-icons');

CREATE POLICY "skill_icons_authenticated_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'skill-icons' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "skill_icons_owner_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'skill-icons' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "skill_icons_owner_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'skill-icons' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create storage policies for techstack-icons
CREATE POLICY "techstack_icons_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'techstack-icons');

CREATE POLICY "techstack_icons_authenticated_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'techstack-icons' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "techstack_icons_owner_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'techstack-icons' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "techstack_icons_owner_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'techstack-icons' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create storage policies for project-thumbnails
CREATE POLICY "project_thumbnails_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-thumbnails');

CREATE POLICY "project_thumbnails_authenticated_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-thumbnails' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "project_thumbnails_owner_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'project-thumbnails' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "project_thumbnails_owner_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'project-thumbnails' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create storage policies for project-media
CREATE POLICY "project_media_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-media');

CREATE POLICY "project_media_authenticated_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-media' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "project_media_owner_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'project-media' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "project_media_owner_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'project-media' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );