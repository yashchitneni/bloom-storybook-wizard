import { useWizardContext } from '@/contexts/WizardContext';
import { uploadFile } from '@/utils/storage-utils';
import { toast } from '@/components/ui/use-toast';
import { useState } from 'react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

export const useWizardPhotoUpload = () => {
  const { dispatch } = useWizardContext();
  const [isUploading, setIsUploading] = useState(false);

  const validateFile = (file: File): string | null => {
    if (!file) return "No file provided";
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return "Only JPEG, JPG, and PNG files are allowed";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 5MB";
    }
    return null;
  };

  const handlePhotoUpload = (file: File) => {
    if (file.size === 0) {
      dispatch({ type: 'UPDATE_FIELD', field: 'photoFile', value: null });
      dispatch({ type: 'UPDATE_FIELD', field: 'photoPreview', value: null });
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      toast({
        title: "Invalid file",
        description: validationError,
        variant: "destructive",
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      dispatch({ type: 'UPDATE_FIELD', field: 'photoFile', value: file });
      dispatch({ type: 'UPDATE_FIELD', field: 'photoPreview', value: e.target?.result });
    };
    reader.readAsDataURL(file);
  };

  const handleChildPhotoUpload = async (file: File): Promise<void> => {
    if (file.size === 0) {
      dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoFile', value: null });
      dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoPreview', value: null });
      dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoUrl', value: null });
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      toast({
        title: "Invalid file",
        description: validationError,
        variant: "destructive",
      });
      dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoFile', value: null });
      dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoPreview', value: null });
      dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoUrl', value: null });
      throw new Error(validationError);
    }

    if (isUploading) {
      const alreadyUploadingMsg = "Upload in progress. Please wait.";
      toast({
        title: "Upload in progress",
        description: alreadyUploadingMsg,
        variant: "default",
      });
      throw new Error(alreadyUploadingMsg);
    }

    setIsUploading(true);
    const previewPromise = new Promise<string | ArrayBuffer | null>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

    try {
      const previewResult = await previewPromise;
      dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoFile', value: file });
      dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoPreview', value: previewResult });

      console.log("[useWizardPhotoUpload] Attempting to upload file:", file.name);
      const storagePath = await uploadFile(file, { folder: 'user-uploads/children' });
      
      if (storagePath) {
        console.log("[useWizardPhotoUpload] Upload successful, storagePath:", storagePath);
        dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoUrl', value: storagePath });
        toast({
          title: "Photo uploaded successfully",
          description: "Your child's photo has been saved.",
        });
      } else {
        console.error("[useWizardPhotoUpload] Upload failed, storagePath is null or empty.");
        dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoUrl', value: null });
        toast({
          title: "Upload failed",
          description: "Could not save photo to storage. Please try again.",
          variant: "destructive",
        });
        throw new Error("Upload to storage failed");
      }
    } catch (error: any) {
      console.error("[useWizardPhotoUpload] Error during child photo upload process:", error);
      dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoFile', value: null });
      dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoPreview', value: null });
      dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoUrl', value: null });
      toast({
        title: "Upload error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUploading(false);
      console.log("[useWizardPhotoUpload] isUploading set to false.");
    }
  };

  return {
    handlePhotoUpload,
    handleChildPhotoUpload,
    isUploading
  };
};
