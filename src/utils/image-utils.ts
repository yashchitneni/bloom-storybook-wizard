import { supabase } from "@/integrations/supabase/client";

/**
 * Gets the public URL for an image in Supabase storage
 * @param path Path to the image in storage (e.g., 'style-images/Retro.png')
 * @returns The public URL for the image
 */
export const getStorageImageUrl = (imageName: string, folder: string = 'style-images'): string => {
  // Get the public URL from Supabase storage
  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(`${folder}/${imageName}`);
    
  return data.publicUrl;
};

/**
 * Maps a style name to the corresponding image filename in storage
 * @param styleName The style name (e.g., 'Retro', '3D')
 * @returns The formatted image filename
 */
export const getStyleImageFilename = (styleName: string): string => {
  // Format the style name to match your file naming convention
  const styleMap: Record<string, string> = {
    "retro": "Retro.png",
    "3d": "3D.png",
    "picture book": "Picture-Book.png",
    "watercolor": "Water-Color.png"
  };
  
  const styleLower = styleName.toLowerCase();
  return styleMap[styleLower] || `${styleName}.png`;
};

/**
 * Gets the URL for a style preview image
 * @param styleName The style name
 * @returns The URL to the style preview image
 */
export const getStyleImageUrl = (styleName: string): string => {
  const filename = getStyleImageFilename(styleName);
  return getStorageImageUrl(filename, 'style-images');
};

/**
 * Provides a fallback image URL if Supabase storage fails
 * @param styleName The style name
 * @returns A fallback URL to a local image
 */
export const getFallbackStyleImageUrl = (styleName: string): string => {
  const styleLower = styleName.toLowerCase();
  
  switch(styleLower) {
    case "retro":
      return "/public/lovable-uploads/aa1b7bb2-64d7-42b3-883f-b70da108de28.png";
    case "3d":
      return "/public/lovable-uploads/731acf50-a01b-4f37-b02d-f7389f0d09ce.png";
    case "picture book":
      return "/public/lovable-uploads/29a1f49c-fff3-4806-9b29-121e5a2a0af2.png";
    case "watercolor":
      return "/public/lovable-uploads/ca26fbd9-76e4-4327-b14c-6fc6659a80d4.png";
    default:
      return "/placeholder.svg";
  }
};
