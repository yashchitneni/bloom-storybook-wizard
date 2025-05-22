-- Create the storage bucket for images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'images', 'images', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'images');

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to upload files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to uploaded files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own files" ON storage.objects;

-- Add storage policies for images bucket
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'images');

CREATE POLICY "Allow public access to uploaded files"
ON storage.objects FOR SELECT USING (bucket_id = 'images');

-- Allow users to update their own files
CREATE POLICY "Allow users to update their own files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'images' AND auth.uid() = owner);

-- Allow users to delete their own files
CREATE POLICY "Allow users to delete their own files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'images' AND auth.uid() = owner); 