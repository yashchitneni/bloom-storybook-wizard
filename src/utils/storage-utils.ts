import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";

const BUCKET_NAME = "images";

interface UploadOptions {
  folder?: string;
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
    if (!file) {
      console.error("[uploadFile] No file provided for upload");
      return null;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit - consider making this a constant
      console.error("[uploadFile] File too large:", file.size);
      toast({ title: "Upload failed", description: "File size must be less than 50MB", variant: "destructive" });
      return null;
    }

    const { folder = "user-uploads", userId } = options;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${userId ? userId.slice(0, 8) : "anonymous"}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;
    
    console.log(`[uploadFile] Attempting to upload to:`, {
      bucket: BUCKET_NAME,
      path: filePath,
      fileSize: file.size,
      fileType: file.type,
      userId: userId || 'anonymous'
    });
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME) // This will fail if BUCKET_NAME doesn't exist
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false // Consider if upsert: true is desired for some cases
      });
      
    if (error) {
      console.error("[uploadFile] Error uploading file to Supabase storage:", error);
      toast({ title: "Upload to Storage Failed", description: error.message, variant: "destructive" });
      return null;
    }
    
    console.log("[uploadFile] File uploaded successfully to Supabase storage:", { path: filePath, data: data });
    
    // The verify step using .list(folder) might also have permission issues for anon users
    // depending on RLS policies for SELECT on the objects. For now, let's assume public read or specific grants.
    // If childPhotoUrl is still null later, this is another area to check RLS for SELECT.
    const { data: fileData, error: fileError } = await supabase.storage
      .from(BUCKET_NAME)
      .list(folder, { limit: 1, search: fileName }); // More specific listing
      
    if (fileError) {
      console.warn("[uploadFile] Warning: Error verifying file after upload (RLS for SELECT?):", fileError);
    } else if (fileData && fileData.length > 0 && fileData.find(f => f.name === fileName)) {
      console.log("[uploadFile] File successfully verified in folder after upload:", fileData);
    } else {
      console.warn("[uploadFile] Warning: File not found in folder after presumed successful upload. Path:", filePath);
    }
    
    return filePath; // Return the path for the URL construction

  } catch (error: any) {
    console.error("[uploadFile] Unexpected error in uploadFile function:", error);
    toast({ title: "Upload Failed", description: "An unexpected error occurred during file upload.", variant: "destructive" });
    return null;
  }
};

/**
 * Gets the public URL for a file in storage
 * @param path The path to the file in storage
 * @returns The public URL for the file
 */
export const getFileUrl = (path: string): string => {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);
  return data.publicUrl;
};

/**
 * Deletes a file from storage
 * @param path The path to the file in storage
 * @returns True if deletion was successful, false otherwise
 */
export const deleteFile = async (path: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path]);
      
    if (error) {
      console.error("[deleteFile] Error deleting file:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("[deleteFile] Error:", error);
    return false;
  }
};

export const listBuckets = async () => {
  try {
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) throw bucketError;
    return buckets;
  } catch (error) {
    console.error('Error listing buckets:', error);
    throw error;
  }
};
