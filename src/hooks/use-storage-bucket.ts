
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useStorageBucket = (bucketName: string) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkBucket = async () => {
      try {
        // Check if bucket exists using regular client
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        
        if (listError) {
          console.error("Error listing buckets:", listError);
          setError(`Error checking buckets: ${listError.message}`);
          setIsReady(false);
          return;
        }
        
        const bucketExists = buckets.some(bucket => bucket.name === bucketName);
        
        if (bucketExists) {
          console.log(`Bucket "${bucketName}" exists.`);
          setIsReady(true);
        } else {
          console.error(`Bucket "${bucketName}" does not exist. Creating it now...`);
          
          // Try to create the bucket if it doesn't exist
          try {
            const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
              public: true
            });
            
            if (createError) {
              console.error("Error creating bucket:", createError);
              setError(`Error creating bucket: ${createError.message}`);
              setIsReady(false);
            } else {
              console.log(`Bucket "${bucketName}" created successfully.`);
              setIsReady(true);
            }
          } catch (createErr: any) {
            console.error("Error in bucket creation:", createErr);
            setError(`Failed to create bucket: ${createErr.message}`);
            setIsReady(false);
          }
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
