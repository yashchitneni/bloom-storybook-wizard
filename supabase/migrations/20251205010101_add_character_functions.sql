
-- Create a function to insert characters from the frontend
CREATE OR REPLACE FUNCTION public.insert_character(
  p_storybook_id UUID,
  p_name TEXT,
  p_relation TEXT,
  p_gender TEXT,
  p_photo_url TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.characters (
    storybook_id,
    name,
    relation,
    gender,
    photo_url
  ) VALUES (
    p_storybook_id,
    p_name,
    p_relation,
    p_gender,
    p_photo_url
  )
  RETURNING id INTO v_id;
  
  RETURN v_id;
END;
$$;

-- Grant access to the function for authenticated users
GRANT EXECUTE ON FUNCTION public.insert_character TO authenticated;
