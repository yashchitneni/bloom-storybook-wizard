
import { useState, useEffect } from "react";
import { WizardData } from "@/types/wizard";
import { useAuth } from "@/contexts/AuthContext";

export const useWizardState = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({
    age: "",
    theme: "",
    moral: "",
    specialDetails: "",
    photoFile: null,
    photoPreview: null,
    style: "",
    email: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const totalSteps = 4;
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      // Scroll to top of wizard
      document.getElementById('wizard')?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Scroll to top of wizard
      document.getElementById('wizard')?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
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

  // Pre-fill email from user if authenticated
  useEffect(() => {
    if (user?.email && !wizardData.email) {
      setWizardData(prev => ({
        ...prev,
        email: user.email || ""
      }));
    }
  }, [user]);

  return {
    currentStep,
    wizardData,
    isSubmitting,
    totalSteps,
    setWizardData,
    setIsSubmitting,
    handleNext,
    handlePrevious,
    handlePhotoUpload,
    user
  };
};
