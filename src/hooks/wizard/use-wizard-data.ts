
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { WizardData, Character } from "@/types/wizard";
import { v4 as uuidv4 } from 'uuid';

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
      // User removed the photo
      setWizardData({
        ...wizardData,
        photoFile: null,
        photoPreview: null
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setWizardData({
        ...wizardData,
        photoFile: file,
        photoPreview: e.target?.result as string
      });
    };
    reader.readAsDataURL(file);
  };
  
  const handleChildPhotoUpload = (file: File) => {
    if (file.size === 0) {
      // User removed the photo
      setWizardData({
        ...wizardData,
        childPhotoFile: null,
        childPhotoPreview: null
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setWizardData({
        ...wizardData,
        childPhotoFile: file,
        childPhotoPreview: e.target?.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  return { 
    wizardData, 
    setWizardData, 
    handlePhotoUpload,
    handleChildPhotoUpload,
    user
  };
};
