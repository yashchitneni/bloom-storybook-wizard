
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useStorageBucket = (bucketName: string) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAndCreateBucket = async () => {
      try {
        // Check if bucket exists
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        
        if (listError) {
          throw listError;
        }
        
        const bucketExists = buckets.some(bucket => bucket.name === bucketName);
        
        if (!bucketExists) {
          // Create bucket if it doesn't exist
          const { error: createError } = await supabase.storage.createBucket(bucketName, {
            public: true, // Make bucket publicly accessible
          });
          
          if (createError) {
            throw createError;
          }
        }
        
        setIsReady(true);
      } catch (err: any) {
        console.error("Storage bucket error:", err);
        setError(err.message);
        setIsReady(false);
      }
    };

    checkAndCreateBucket();
  }, [bucketName]);

  return { isReady, error };
};
