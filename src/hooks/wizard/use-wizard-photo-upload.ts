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

  const handleChildPhotoUpload = (file: File): Promise<void> => {
    if (file.size === 0) {
      dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoFile', value: null });
      dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoPreview', value: null });
      dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoUrl', value: null });
      return Promise.resolve();
    }

    const validationError = validateFile(file);
    if (validationError) {
      toast({
        title: "Invalid file",
        description: validationError,
        variant: "destructive",
      });
      return Promise.reject(new Error(validationError));
    }

    if (isUploading) {
      const alreadyUploadingMsg = "Upload in progress. Please wait.";
      toast({
        title: "Upload in progress",
        description: alreadyUploadingMsg,
        variant: "default", // Less aggressive than destructive
      });
      return Promise.reject(new Error(alreadyUploadingMsg));
    }

    setIsUploading(true);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoFile', value: file });
          dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoPreview', value: e.target?.result });
          
          const storagePath = await uploadFile(file, { folder: 'user-uploads/children' });
          
          if (storagePath) {
            dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoUrl', value: storagePath });
            toast({
              title: "Photo uploaded successfully",
              description: "Your child's photo has been saved.",
            });
            resolve();
          } else {
            dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoFile', value: null });
            dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoPreview', value: null });
            dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoUrl', value: null });
            const uploadFailedError = new Error("Failed to upload photo to storage.");
            toast({
              title: "Upload failed",
              description: uploadFailedError.message + " Please ensure you are connected and try again.",
              variant: "destructive",
            });
            reject(uploadFailedError);
          }
        } catch (error: any) {
          console.error('Error in upload process:', error);
          dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoFile', value: null });
          dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoPreview', value: null });
          dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoUrl', value: null });
          toast({
            title: "Upload error",
            description: error.message || "An unexpected error occurred during upload.",
            variant: "destructive",
          });
          reject(error);
        } finally {
          setIsUploading(false);
        }
      };

      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoFile', value: null });
        dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoPreview', value: null });
        dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoUrl', value: null });
        toast({
          title: "File reading error",
          description: "Could not read the selected file. Please try again.",
          variant: "destructive",
        });
        setIsUploading(false);
        reject(new Error("FileReader failed"));
      };

      reader.readAsDataURL(file);
    });
  };

  return {
    handlePhotoUpload,
    handleChildPhotoUpload,
    isUploading
  };
};
