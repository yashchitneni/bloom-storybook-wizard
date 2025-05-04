
import { useState, useEffect } from "react";

export const useWizardNavigation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 9;
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      // Scroll to top of wizard
      document.getElementById('wizard-container')?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Scroll to top of wizard
      document.getElementById('wizard-container')?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handleGoToStep = (step: number) => {
    if (step > 0 && step <= totalSteps && step <= currentStep + 1) {
      setCurrentStep(step);
      document.getElementById('wizard-container')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return {
    currentStep,
    totalSteps,
    handleNext,
    handlePrevious,
    handleGoToStep
  };
};
