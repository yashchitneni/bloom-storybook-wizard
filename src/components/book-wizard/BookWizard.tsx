
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

  // Debug log to verify rendering and state
  useEffect(() => {
    console.log("BookWizard rendered", { currentPage, pageFlipping, direction });
    console.log("Wizard Data:", wizardData);
  }, [currentPage, pageFlipping, direction, wizardData]);

  // Provide fallback data for development/testing
  const fallbackThemes = ['Adventure', 'Fantasy', 'Animals', 'Space', 'Ocean', 'Friendship'];
  const fallbackSubjects = ['Jungle Explorer', 'Mountain Climb', 'Desert Journey'];
  const fallbackMessages = ['Kindness', 'Courage', 'Friendship', 'Honesty', 'Learning'];
  const fallbackStyles = ['Cartoon', 'Watercolor', 'Digital', 'Classic'];
  const fallbackAges = ['0-2', '3-5', '6-9'];

  // Force use fallback data if Supabase data isn't loading
  useEffect(() => {
    const forceTimeout = setTimeout(() => {
      console.log("Force loading fallback data if needed");
    }, 2000);
    return () => clearTimeout(forceTimeout);
  }, []);

  // Handlers for each step
  const handleSelectAge = (age: string) => {
    console.log("Selected age:", age);
    setWizardData({ ...wizardData, age });
  };

  const handleSelectTheme = (theme: string) => {
    console.log("Selected theme:", theme);
    setWizardData({ ...wizardData, theme, subject: "" });
  };

  const handleSelectSubject = (subject: string) => {
    console.log("Selected subject:", subject);
    setWizardData({ ...wizardData, subject });
  };

  const handleSelectMessage = (message: string) => {
    console.log("Selected message:", message);
    setWizardData({ ...wizardData, message });
  };

  const handleSelectStyle = (style: string) => {
    console.log("Selected style:", style);
    setWizardData({ ...wizardData, style });
  };

  const handleChildInfoChange = (info: { name: string; gender: string; photo?: File }) => {
    console.log("Child info updated:", info);
    setWizardData({
      ...wizardData,
      childName: info.name,
      gender: info.gender,
      photoFile: info.photo || wizardData.photoFile
    });
  };

  const handleCustomNoteChange = (customNote: string) => {
    console.log("Custom note updated:", customNote);
    setWizardData({ ...wizardData, customNote });
  };

  // Get available subjects for selected theme
  const availableSubjects = React.useMemo(() => {
    if (wizardData.theme && subjects && subjects[wizardData.theme]) {
      return subjects[wizardData.theme];
    }
    return fallbackSubjects;
  }, [wizardData.theme, subjects]);

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
      <div className="w-full max-w-[700px] rounded-2xl overflow-hidden shadow-lg bg-white mx-auto relative">
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
          ageCategories={ageCategories.length > 0 ? ageCategories : fallbackAges}
          themes={themes.length > 0 ? themes : fallbackThemes}
          availableSubjects={availableSubjects}
          messages={messages.length > 0 ? messages : fallbackMessages}
          styles={styles.length > 0 ? styles : fallbackStyles}
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
