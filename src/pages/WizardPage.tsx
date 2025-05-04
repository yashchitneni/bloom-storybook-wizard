
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWizardState } from '@/hooks/use-wizard-state';
import { useWizardSubmission } from '@/hooks/use-wizard-submission';
import WizardRoadmap from '@/components/WizardRoadmap';
import AgeSelectionStep from '@/components/wizard/AgeSelectionStep';
import ThemeSelectionStep from '@/components/wizard/ThemeSelectionStep';
import SubjectSelectionStep from '@/components/wizard/SubjectSelectionStep';
import MessageSelectionStep from '@/components/wizard/MessageSelectionStep';
import CustomNoteStep from '@/components/wizard/CustomNoteStep';
import PhotoStyleStep from '@/components/wizard/PhotoStyleStep';
import PreviewStep from '@/components/wizard/PreviewStep';
import CheckoutStep from '@/components/wizard/CheckoutStep';

const WizardPage = () => {
  const {
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
    themes,
    subjects,
    messages,
    styles,
    ageCategories,
    user
  } = useWizardState();
  
  const { handleSubmit } = useWizardSubmission(
    wizardData,
    setWizardData,
    setIsSubmitting,
    user
  );

  // Handlers for each step
  const handleSelectAge = (age: string) => {
    setWizardData({ ...wizardData, age });
  };

  const handleSelectTheme = (theme: string) => {
    setWizardData({ ...wizardData, theme, subject: "" }); // Reset subject when theme changes
  };

  const handleSelectSubject = (subject: string) => {
    setWizardData({ ...wizardData, subject });
  };

  const handleSelectMessage = (message: string) => {
    setWizardData({ ...wizardData, message });
  };

  const handleCustomNoteChange = (customNote: string) => {
    setWizardData({ ...wizardData, customNote });
  };

  const handleSelectStyle = (style: string) => {
    setWizardData({ ...wizardData, style });
  };

  const handleEmailChange = (email: string) => {
    setWizardData({ ...wizardData, email });
  };

  // Get available subjects for selected theme
  const availableSubjects = wizardData.theme ? subjects[wizardData.theme] || [] : [];

  return (
    <div className="min-h-screen flex flex-col bg-select">
      <Header />
      <main className="flex-grow">
        <div id="wizard-container" className="container mx-auto px-4 py-8 md:py-16 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Create Your Personalized Storybook</h2>
          
          <WizardRoadmap 
            currentStep={currentStep} 
            totalSteps={totalSteps}
            onStepClick={handleGoToStep}
          />
          
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-md">
            {currentStep === 1 && (
              <AgeSelectionStep 
                onNext={handleNext} 
                onSelectAge={handleSelectAge} 
                selectedAge={wizardData.age}
                ageCategories={ageCategories}
              />
            )}
            
            {currentStep === 2 && (
              <ThemeSelectionStep 
                onNext={handleNext} 
                onPrevious={handlePrevious} 
                onSelectTheme={handleSelectTheme} 
                selectedTheme={wizardData.theme}
                themes={themes}
              />
            )}
            
            {currentStep === 3 && (
              <SubjectSelectionStep 
                onNext={handleNext} 
                onPrevious={handlePrevious} 
                onSelectSubject={handleSelectSubject} 
                selectedTheme={wizardData.theme}
                selectedSubject={wizardData.subject}
                subjects={availableSubjects}
              />
            )}
            
            {currentStep === 4 && (
              <MessageSelectionStep 
                onNext={handleNext} 
                onPrevious={handlePrevious} 
                onSelectMessage={handleSelectMessage} 
                selectedMessage={wizardData.message}
                messages={messages}
              />
            )}
            
            {currentStep === 5 && (
              <CustomNoteStep 
                onNext={handleNext} 
                onPrevious={handlePrevious} 
                onCustomNoteChange={handleCustomNoteChange} 
                customNote={wizardData.customNote}
              />
            )}
            
            {currentStep === 6 && (
              <PhotoStyleStep 
                onNext={handleNext} 
                onPrevious={handlePrevious} 
                onSelectStyle={handleSelectStyle} 
                selectedStyle={wizardData.style}
                onPhotoUpload={handlePhotoUpload}
                photoPreview={wizardData.photoPreview}
                styles={styles}
              />
            )}
            
            {currentStep === 7 && (
              <PreviewStep 
                onNext={handleNext} 
                onPrevious={handlePrevious}
                wizardData={wizardData}
              />
            )}
            
            {currentStep === 8 && (
              <CheckoutStep 
                onPrevious={handlePrevious}
                wizardData={wizardData}
                onEmailChange={handleEmailChange}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WizardPage;
