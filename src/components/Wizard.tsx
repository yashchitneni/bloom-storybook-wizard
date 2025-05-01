
import { useState } from "react";
import Card from "./Card";
import ProgressBar from "./ProgressBar";
import AgeSelectionStep from "./wizard/AgeSelectionStep";
import StorySparkStep from "./wizard/StorySparkStep";
import PhotoStyleStep from "./wizard/PhotoStyleStep";
import CheckoutStep from "./wizard/CheckoutStep";
import { useWizardState } from "@/hooks/use-wizard-state";
import { useWizardSubmission } from "@/hooks/use-wizard-submission";

const Wizard = () => {
  const {
    currentStep,
    wizardData,
    totalSteps,
    setWizardData,
    handleNext,
    handlePrevious,
    handlePhotoUpload,
    user
  } = useWizardState();
  
  const {
    isSubmitting,
    handleSubmit
  } = useWizardSubmission(wizardData, setWizardData, (step: number) => {
    // Set current step to the desired value
    useState(step)[1](step);
  }, user);

  return (
    <Card className="max-w-2xl mx-auto" id="wizard">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Create Your Story</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
          </div>
        </div>
        
        <ProgressBar totalSteps={totalSteps} currentStep={currentStep} />
        
        <div className="py-4">
          {currentStep === 1 && (
            <AgeSelectionStep 
              onNext={handleNext} 
              onSelectAge={(age) => setWizardData({...wizardData, age})}
              selectedAge={wizardData.age}
            />
          )}
          {currentStep === 2 && (
            <StorySparkStep 
              onNext={handleNext} 
              onPrevious={handlePrevious}
              onSelectTheme={(theme) => setWizardData({...wizardData, theme})}
              onSelectMoral={(moral) => setWizardData({...wizardData, moral})}
              onSpecialDetailsChange={(details) => setWizardData({...wizardData, specialDetails: details})}
              selectedTheme={wizardData.theme}
              selectedMoral={wizardData.moral}
              specialDetails={wizardData.specialDetails}
            />
          )}
          {currentStep === 3 && (
            <PhotoStyleStep
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSelectStyle={(style) => setWizardData({...wizardData, style})}
              selectedStyle={wizardData.style}
              onPhotoUpload={handlePhotoUpload}
              photoPreview={wizardData.photoPreview}
            />
          )}
          {currentStep === 4 && (
            <CheckoutStep
              onPrevious={handlePrevious}
              selectedAge={wizardData.age}
              selectedTheme={wizardData.theme}
              selectedMoral={wizardData.moral}
              selectedStyle={wizardData.style}
              specialDetails={wizardData.specialDetails}
              onEmailChange={(email) => setWizardData({...wizardData, email})}
              email={wizardData.email}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default Wizard;
