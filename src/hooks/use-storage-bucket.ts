
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useStorageBucket = (bucketName: string) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkBucket = async () => {
      try {
        // Check if bucket exists
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        
        if (listError) {
          throw listError;
        }
        
        const bucketExists = buckets.some(bucket => bucket.name === bucketName);
        
        if (bucketExists) {
          setIsReady(true);
        } else {
          setError(`Bucket "${bucketName}" does not exist.`);
          console.error(`Bucket "${bucketName}" does not exist.`);
          setIsReady(false);
        }
      } catch (err: any) {
        console.error("Storage bucket error:", err);
        setError(err.message);
        setIsReady(false);
      }
    };

    checkBucket();
  }, [bucketName]);

  return { isReady, error };
};
