
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";

const BUCKET_NAME = "images";

interface UploadOptions {
  folder?: "ui" | "uploads" | "storybooks";
  userId?: string;
}

/**
 * Uploads a file to Supabase storage
 * @param file The file to upload
 * @param options Upload options including folder path and user ID
 * @returns The path to the uploaded file or null if upload failed
 */
export const uploadFile = async (file: File, options: UploadOptions = {}): Promise<string | null> => {
  try {
    if (!file) return null;

    const { folder = "uploads", userId } = options;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${userId ? userId.slice(0, 8) : "anonymous"}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);
      
    if (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
    
    return filePath;
  } catch (error: any) {
    console.error("File upload failed:", error);
    toast({
      title: "Upload failed",
      description: "Something went wrong while uploading the file.",
      variant: "destructive",
    });
    return null;
  }
};

/**
 * Gets the public URL for a file in storage
 * @param path The path to the file
 * @returns The public URL for the file
 */
export const getFileUrl = (path: string | null): string | null => {
  if (!path) return null;
  
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);
    
  return data.publicUrl;
};

/**
 * Deletes a file from storage
 * @param path The path to the file
 * @returns Whether the deletion was successful
 */
export const deleteFile = async (path: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path]);
      
    if (error) {
      console.error("Error deleting file:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("File deletion failed:", error);
    return false;
  }
};
