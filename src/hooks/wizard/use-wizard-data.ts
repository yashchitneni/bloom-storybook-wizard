import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { WizardData, Character } from "@/types/wizard";
import { v4 as uuidv4 } from 'uuid';
import { uploadFile } from "@/utils/storage-utils";
import { toast } from "@/components/ui/use-toast";

export const useWizardData = () => {
  const [wizardData, setWizardData] = useState<WizardData>({
    age: "",
    theme: "",
    subject: "",
    message: "",
    customNote: "",
    photoFile: null,
    photoPreview: null,
    style: "",
    email: "",
    moral: "",
    specialDetails: "",
    
    // Child profile fields
    childName: "",
    childGender: "",
    childPhotoFile: null,
    childPhotoPreview: null,
    childPhotoUrl: null,
    
    // Characters
    characters: []
  });
  const { user } = useAuth();
  
  // Add logging whenever wizardData changes
  useEffect(() => {
    console.log("wizardData updated:", wizardData);
  }, [wizardData]);
  
  // Pre-fill email from user if authenticated
  useEffect(() => {
    if (user?.email && !wizardData.email) {
      console.log("Setting email from user:", user?.email);
      setWizardData(prev => ({
        ...prev,
        email: user.email || ""
      }));
    }
  }, [user]);

  const handlePhotoUpload = (file: File) => {
    if (file.size === 0) {
      setWizardData(prev => ({
        ...prev,
        photoFile: null,
        photoPreview: null
      }));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setWizardData(prev => ({
        ...prev,
        photoFile: file,
        photoPreview: e.target?.result as string
      }));
    };
    reader.readAsDataURL(file);
  };
  
  const handleChildPhotoUpload = async (file: File) => {
    console.log("[handleChildPhotoUpload] Starting upload process for file:", file.name);
    
    if (file.size === 0) {
      console.log("[handleChildPhotoUpload] File size is 0, clearing photo data");
      setWizardData(prev => ({
        ...prev,
        childPhotoFile: null,
        childPhotoPreview: null,
        childPhotoUrl: null,
      }));
      return;
    }

    try {
      // Create preview first
      const reader = new FileReader();
      reader.onload = async (e) => {
        const preview = e.target?.result as string;
        console.log("[handleChildPhotoUpload] Preview created successfully");
        
        // Update preview immediately for better UX
        setWizardData(prev => ({
          ...prev,
          childPhotoFile: file,
          childPhotoPreview: preview,
        }));
        console.log("[handleChildPhotoUpload] Preview updated in state");

        // Then upload to storage
        console.log("[handleChildPhotoUpload] Starting file upload to Supabase Storage...");
        const storagePath = await uploadFile(file, { 
          folder: "user-uploads/children",
          userId: user?.id 
        });
        
        if (!storagePath) {
          console.error("[handleChildPhotoUpload] Upload failed - no storage path returned");
          toast({
            title: "Upload failed",
            description: "Could not upload the photo. Please try again.",
            variant: "destructive",
          });
          return;
        }

        console.log("[handleChildPhotoUpload] Upload complete. Storage path:", storagePath);
        
        // Update with storage path
        setWizardData(prev => ({
          ...prev,
          childPhotoUrl: storagePath,
        }));
        
        console.log("[handleChildPhotoUpload] wizardData updated with childPhotoUrl:", storagePath);
      };
      
      reader.onerror = (error) => {
        console.error("[handleChildPhotoUpload] Error reading file:", error);
        toast({
          title: "Error reading file",
          description: "Could not read the photo file. Please try again.",
          variant: "destructive",
        });
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("[handleChildPhotoUpload] Error:", error);
      toast({
        title: "Upload failed",
        description: "Something went wrong while uploading the photo.",
        variant: "destructive",
      });
    }
  };

  return { 
    wizardData, 
    setWizardData, 
    handlePhotoUpload,
    handleChildPhotoUpload,
    user
  };
};
