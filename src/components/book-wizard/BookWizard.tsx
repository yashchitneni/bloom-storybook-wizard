
import React, { useEffect } from 'react';
import { useWizardState } from '@/hooks/use-wizard-state';
import { useWizardSubmission } from '@/hooks/use-wizard-submission';
import { useWizardNavigation } from '@/hooks/use-wizard-navigation';
import { WizardHeader, WizardFooter } from './WizardControls';
import WizardContent from './WizardContent';

export const BookWizard = () => {
  // Get wizard state and submission handlers
  const {
    wizardData,
    setWizardData,
    isSubmitting,
    setIsSubmitting,
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

  const totalPages = 7; // Total number of pages in the wizard
  
  // Use the navigation hook
  const {
    currentPage,
    pageFlipping,
    direction,
    goToNextPage,
    goToPrevPage,
    handleAnimationComplete
  } = useWizardNavigation(totalPages);

  // Add a console log to debug what's happening
  useEffect(() => {
    console.log("BookWizard rendered", { currentPage, pageFlipping, direction });
    console.log("Wizard Data:", wizardData);
    console.log("Loaded options:", { themes, subjects, messages, styles, ageCategories });
  }, [currentPage, pageFlipping, direction, wizardData, themes, subjects, messages, styles, ageCategories]);

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

  const handleSelectStyle = (style: string) => {
    setWizardData({ ...wizardData, style });
  };

  const handleChildInfoChange = (info: { name: string; gender: string; photo?: File }) => {
    setWizardData({
      ...wizardData,
      childName: info.name,
      gender: info.gender,
      photoFile: info.photo || wizardData.photoFile
    });
  };

  const handleCustomNoteChange = (customNote: string) => {
    setWizardData({ ...wizardData, customNote });
  };

  // Get available subjects for selected theme
  const availableSubjects = wizardData.theme && subjects[wizardData.theme] ? 
    subjects[wizardData.theme] : 
    [];

  // Check if next is available based on current selections
  const isNextAvailable = () => {
    switch (currentPage) {
      case 1: return !!wizardData.age;
      case 2: return !!wizardData.theme;
      case 3: return !!wizardData.subject;
      case 4: return !!wizardData.message;
      case 5: return !!wizardData.style;
      case 6: return !!wizardData.childName && !!wizardData.gender;
      case 7: return true; // Custom note is optional
      default: return false;
    }
  };

  const handleFinalSubmit = () => {
    handleSubmit();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] bg-[#FEF6EC] py-4">
      <div className="w-full max-w-[700px] rounded-2xl overflow-hidden shadow-lg bg-[#FFF9F2] mx-auto relative">
        {/* Book header with navigation */}
        <WizardHeader 
          currentPage={currentPage}
          totalPages={totalPages}
          isFlipping={pageFlipping}
          onPrev={goToPrevPage}
        />
        
        {/* Book content area */}
        <WizardContent 
          currentPage={currentPage}
          pageFlipping={pageFlipping}
          direction={direction}
          wizardData={wizardData}
          handleSelectAge={handleSelectAge}
          handleSelectTheme={handleSelectTheme}
          handleSelectSubject={handleSelectSubject}
          handleSelectMessage={handleSelectMessage}
          handleSelectStyle={handleSelectStyle}
          handleChildInfoChange={handleChildInfoChange}
          handleCustomNoteChange={handleCustomNoteChange}
          handlePhotoUpload={handlePhotoUpload}
          ageCategories={ageCategories}
          themes={themes}
          availableSubjects={availableSubjects}
          messages={messages}
          styles={styles}
          handleAnimationComplete={handleAnimationComplete}
        />
        
        {/* Book footer with action buttons */}
        <WizardFooter 
          currentPage={currentPage}
          totalPages={totalPages}
          isFlipping={pageFlipping}
          isNextAvailable={isNextAvailable()}
          isSubmitting={isSubmitting}
          onNext={goToNextPage}
          onSubmit={handleFinalSubmit}
        />
      </div>
    </div>
  );
};

export default BookWizard;
