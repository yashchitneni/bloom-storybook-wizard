import { supabase } from "@/integrations/supabase/client";
import { uploadFile, getPublicUrl, deleteFile } from "./storage-utils";

describe("Storage Utils", () => {
  const testBucketName = "test-bucket";
  const testFileName = "test.txt";
  const testFileContent = "Hello, World!";
  let uploadedFilePath: string | null = null;

  beforeAll(async () => {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === testBucketName);

    if (!bucketExists) {
      await supabase.storage.createBucket(testBucketName, {
        public: true
      });
    }
  });

  it("should upload a file successfully", async () => {
    // Create a test file
    const file = new File([testFileContent], testFileName, { type: "text/plain" });
    
    // Upload the file
    uploadedFilePath = await uploadFile(file, {
      folder: "test-uploads",
      userId: "test-user"
    });

    expect(uploadedFilePath).not.toBeNull();
    expect(uploadedFilePath!.endsWith('.txt')).toBe(true);
  });

  it("should get public URL for uploaded file", () => {
    if (!uploadedFilePath) {
      throw new Error("No file was uploaded in previous test");
    }

    const url = getPublicUrl(uploadedFilePath);
    expect(url).toContain(testBucketName);
    expect(url).toContain(uploadedFilePath);
  });

  it("should delete uploaded file", async () => {
    if (!uploadedFilePath) {
      throw new Error("No file was uploaded in previous test");
    }

    const success = await deleteFile(uploadedFilePath);
    expect(success).toBe(true);
  });

  afterAll(async () => {
    // Clean up test files
    if (uploadedFilePath) {
      await deleteFile(uploadedFilePath);
    }
  });
}); 