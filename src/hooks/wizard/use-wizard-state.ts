
import { useState } from "react";
import { useWizardData } from "./use-wizard-data";
import { useWizardCharacters } from "./use-wizard-characters";
import { useWizardNavigation } from "./use-wizard-navigation";
import { useWizardLookupData } from "./use-wizard-lookup-data";

export const useWizardState = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { wizardData, setWizardData, handlePhotoUpload, handleChildPhotoUpload, user } = useWizardData();
  const { handleAddCharacter, handleUpdateCharacter, handleRemoveCharacter } = useWizardCharacters({ 
    wizardData, 
    updateWizardData: setWizardData 
  });
  const { currentStep, totalSteps, handleNext, handlePrevious, handleGoToStep } = useWizardNavigation();
  const { themes, subjects, messages, styles, ageCategories, isLoading } = useWizardLookupData();

  return {
    currentStep,
    wizardData,
    setWizardData,
    isSubmitting,
    setIsSubmitting,
    totalSteps,
    handleNext,
    handlePrevious,
    handleGoToStep,
    handlePhotoUpload,
    handleChildPhotoUpload,
    handleAddCharacter,
    handleUpdateCharacter,
    handleRemoveCharacter,
    themes,
    subjects,
    messages,
    styles,
    ageCategories,
    user,
    isLoading
  };
};
