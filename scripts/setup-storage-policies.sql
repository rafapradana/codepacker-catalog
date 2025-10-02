-- Storage Policies for Supabase Storage Buckets
-- Run this SQL in your Supabase SQL Editor or via psql

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Profile Photos Policies
CREATE POLICY "profile-photos_public_read" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-photos');

CREATE POLICY "profile-photos_authenticated_upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'profile-photos' AND auth.role() = 'authenticated');

CREATE POLICY "profile-photos_owner_update" ON storage.objects
FOR UPDATE USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "profile-photos_owner_delete" ON storage.objects
FOR DELETE USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Skill Icons Policies
CREATE POLICY "skill-icons_public_read" ON storage.objects
FOR SELECT USING (bucket_id = 'skill-icons');

CREATE POLICY "skill-icons_authenticated_upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'skill-icons' AND auth.role() = 'authenticated');

CREATE POLICY "skill-icons_owner_update" ON storage.objects
FOR UPDATE USING (bucket_id = 'skill-icons' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "skill-icons_owner_delete" ON storage.objects
FOR DELETE USING (bucket_id = 'skill-icons' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Tech Stack Icons Policies
CREATE POLICY "techstack-icons_public_read" ON storage.objects
FOR SELECT USING (bucket_id = 'techstack-icons');

CREATE POLICY "techstack-icons_authenticated_upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'techstack-icons' AND auth.role() = 'authenticated');

CREATE POLICY "techstack-icons_owner_update" ON storage.objects
FOR UPDATE USING (bucket_id = 'techstack-icons' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "techstack-icons_owner_delete" ON storage.objects
FOR DELETE USING (bucket_id = 'techstack-icons' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Project Thumbnails Policies
CREATE POLICY "project-thumbnails_public_read" ON storage.objects
FOR SELECT USING (bucket_id = 'project-thumbnails');

CREATE POLICY "project-thumbnails_authenticated_upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'project-thumbnails' AND auth.role() = 'authenticated');

CREATE POLICY "project-thumbnails_owner_update" ON storage.objects
FOR UPDATE USING (bucket_id = 'project-thumbnails' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "project-thumbnails_owner_delete" ON storage.objects
FOR DELETE USING (bucket_id = 'project-thumbnails' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Project Media Policies
CREATE POLICY "project-media_public_read" ON storage.objects
FOR SELECT USING (bucket_id = 'project-media');

CREATE POLICY "project-media_authenticated_upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'project-media' AND auth.role() = 'authenticated');

CREATE POLICY "project-media_owner_update" ON storage.objects
FOR UPDATE USING (bucket_id = 'project-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "project-media_owner_delete" ON storage.objects
FOR DELETE USING (bucket_id = 'project-media' AND auth.uid()::text = (storage.foldername(name))[1]);