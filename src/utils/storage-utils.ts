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

    // Check if file is too large (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      console.error("[uploadFile] File too large:", file.size);
      toast({
        title: "Upload failed",
        description: "File size must be less than 50MB",
        variant: "destructive",
      });
      return null;
    }

    const { folder = "user-uploads", userId } = options;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${userId ? userId.slice(0, 8) : "anonymous"}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;
    
    console.log(`[uploadFile] Starting upload process:`, {
      bucket: BUCKET_NAME,
      path: filePath,
      fileSize: file.size,
      fileType: file.type,
      userId: userId || 'anonymous'
    });
    
    // First check if bucket exists using admin client
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    console.log('[uploadFile] Buckets returned by listBuckets:', buckets);
    if (bucketError) {
      console.error("[uploadFile] Error checking buckets:", bucketError);
      throw bucketError;
    }
    
    const bucketExists = buckets.some(b => b.name === BUCKET_NAME);
    console.log(`[uploadFile] Bucket '${BUCKET_NAME}' exists:`, bucketExists);
    
    if (!bucketExists) {
      console.error(`[uploadFile] Bucket '${BUCKET_NAME}' does not exist`);
      throw new Error(`Storage bucket '${BUCKET_NAME}' does not exist`);
    }
    
    // Use regular client for file upload (this respects RLS policies)
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) {
      console.error("[uploadFile] Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
    
    console.log("[uploadFile] File uploaded successfully:", {
      path: filePath,
      data: data
    });

    // Verify the file exists after upload
    const { data: fileData, error: fileError } = await supabase.storage
      .from(BUCKET_NAME)
      .list(folder);
      
    if (fileError) {
      console.error("[uploadFile] Error verifying file:", fileError);
    } else {
      console.log("[uploadFile] Files in folder after upload:", fileData);
    }
    
    return filePath;
  } catch (error: any) {
    console.error("[uploadFile] File upload failed:", error);
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
