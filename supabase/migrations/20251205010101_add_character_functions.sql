
-- Create a function to insert characters
CREATE OR REPLACE FUNCTION public.insert_character(
  p_storybook_id UUID,
  p_name TEXT,
  p_relation TEXT,
  p_gender TEXT,
  p_photo_url TEXT
) RETURNS void AS $$
BEGIN
  INSERT INTO public.characters (storybook_id, name, relation, gender, photo_url)
  VALUES (p_storybook_id, p_name, p_relation, p_gender, p_photo_url);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
