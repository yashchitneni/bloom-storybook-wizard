-- Create the storage bucket for uploads if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'uploads', 'uploads', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'uploads');

-- Add storage policies for uploads bucket
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'uploads');

CREATE POLICY "Allow public access to uploaded files"
ON storage.objects FOR SELECT USING (bucket_id = 'uploads');

-- Ensure storybooks table exists before altering
CREATE TABLE IF NOT EXISTS public.storybooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Update storybooks table to include child fields
ALTER TABLE public.storybooks
ADD COLUMN IF NOT EXISTS child_name TEXT,
ADD COLUMN IF NOT EXISTS child_gender TEXT,
ADD COLUMN IF NOT EXISTS child_photo_url TEXT;

-- Create characters table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storybook_id UUID NOT NULL REFERENCES public.storybooks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relation TEXT NOT NULL,
  gender TEXT NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
