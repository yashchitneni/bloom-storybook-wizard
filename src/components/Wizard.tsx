
import { useState } from "react";
import Card from "./Card";
import AgeSelectionStep from "./wizard/AgeSelectionStep";
import StorySparkStep from "./wizard/StorySparkStep";
import PhotoStyleStep from "./wizard/PhotoStyleStep";
import CheckoutStep from "./wizard/CheckoutStep";
import WizardRoadmap from "./WizardRoadmap";
import { useWizardState } from "@/hooks/use-wizard-state";
import { useWizardSubmission } from "@/hooks/use-wizard-submission";
import { AnimatePresence, motion } from "framer-motion";

const Wizard = () => {
  const {
    currentStep,
    wizardData,
    setWizardData,
    isSubmitting: wizardStateIsSubmitting,
    setIsSubmitting,
    totalSteps,
    handleNext,
    handlePrevious,
    handlePhotoUpload,
    ageCategories,
    styles,
    user
  } = useWizardState();
  
  const {
    handleSubmit,
    isSubmitting: submissionIsSubmitting
  } = useWizardSubmission(
    wizardData,
    setWizardData,
    setIsSubmitting,
    user
  );

  const handleStepClick = (step: number) => {
    // Only allow clicking on completed steps or the next step
    if (step <= currentStep || step === currentStep + 1) {
      useState(step)[1](step);
      
      // Scroll to top of wizard
      document.getElementById('wizard')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Animation variants for the form content
  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0
      };
    },
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        x: direction < 0 ? '100%' : '-100%',
        opacity: 0
      };
    }
  };

  // Track slide direction
  const [direction, setDirection] = useState(0);

  // Custom navigation handlers
  const navigateNext = () => {
    if (currentStep < totalSteps) {
      setDirection(1);
      handleNext();
    }
  };

  const navigatePrevious = () => {
    if (currentStep > 1) {
      setDirection(-1);
      handlePrevious();
    }
  };

  return (
    <Card className="max-w-2xl mx-auto" id="wizard">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Create Your Story</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
          </div>
        </div>
        
        <WizardRoadmap 
          currentStep={currentStep} 
          totalSteps={totalSteps} 
          onStepClick={handleStepClick}
        />
        
        <div className="relative overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, type: "tween" }}
              className="py-4"
            >
              {currentStep === 1 && (
                <AgeSelectionStep 
                  onNext={navigateNext} 
                  onSelectAge={(age) => setWizardData({...wizardData, age})}
                  selectedAge={wizardData.age}
                  ageCategories={ageCategories}
                />
              )}
              {currentStep === 2 && (
                <StorySparkStep 
                  onNext={navigateNext} 
                  onPrevious={navigatePrevious}
                  onSelectTheme={(theme) => setWizardData({...wizardData, theme})}
                  onSelectMoral={(moral) => setWizardData({...wizardData, moral})}
                  onSpecialDetailsChange={(details) => setWizardData({...wizardData, specialDetails: details})}
                  selectedTheme={wizardData.theme}
                  selectedMoral={wizardData.moral || ""}
                  specialDetails={wizardData.specialDetails || ""}
                />
              )}
              {currentStep === 3 && (
                <PhotoStyleStep
                  onNext={navigateNext}
                  onPrevious={navigatePrevious}
                  onSelectStyle={(style) => setWizardData({...wizardData, style})}
                  selectedStyle={wizardData.style}
                  onPhotoUpload={handlePhotoUpload}
                  photoPreview={wizardData.photoPreview}
                  styles={styles}
                />
              )}
              {currentStep === 4 && (
                <CheckoutStep
                  onPrevious={navigatePrevious}
                  wizardData={wizardData}
                  onEmailChange={(email) => setWizardData({...wizardData, email})}
                  onSubmit={handleSubmit}
                  isSubmitting={submissionIsSubmitting || wizardStateIsSubmitting}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
};

export default Wizard;
