
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Book } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useWizardState } from '@/hooks/use-wizard-state';
import { useWizardSubmission } from '@/hooks/use-wizard-submission';
import Button from "@/components/Button";
import WizardPage from './WizardPage';
import PageFlip from './PageFlip';
import AgeSelectionContent from './AgeSelectionContent';
import ThemeSelectionContent from './ThemeSelectionContent';
import SubjectSelectionContent from './SubjectSelectionContent';
import MessageSelectionContent from './MessageSelectionContent';
import StyleSelectionContent from './StyleSelectionContent';
import ChildInfoContent from './ChildInfoContent';
import CustomNoteContent from './CustomNoteContent';
import ReviewContent from './ReviewContent';

export const BookWizard = () => {
  const navigate = useNavigate();
  const [pageFlipping, setPageFlipping] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [currentPage, setCurrentPage] = useState(1);
  
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

  const totalPages = 7; // Updated to include child information page

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

  const handleEmailChange = (email: string) => {
    setWizardData({ ...wizardData, email });
  };

  // Get available subjects for selected theme
  const availableSubjects = wizardData.theme ? subjects[wizardData.theme] || [] : [];

  // Navigation functions
  const goToNextPage = () => {
    if (currentPage < totalPages && !pageFlipping) {
      setPageFlipping(true);
      setDirection('next');
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setPageFlipping(false);
      }, 500); // Match the animation duration
    }
  };
  
  const goToPrevPage = () => {
    if (currentPage > 1 && !pageFlipping) {
      setPageFlipping(true);
      setDirection('prev');
      setTimeout(() => {
        setCurrentPage(prev => prev - 1);
        setPageFlipping(false);
      }, 500); // Match the animation duration
    }
  };

  // Handle animation completion
  const handleAnimationComplete = () => {
    // Additional actions after animation completes if needed
  };

  // Check if next is available based on current selections
  const isNextAvailable = () => {
    switch (currentPage) {
      case 1: return !!wizardData.age;
      case 2: return !!wizardData.theme;
      case 3: return !!wizardData.subject;
      case 4: return !!wizardData.message;
      case 5: return !!wizardData.style;
      case 6: return !!wizardData.childName && !!wizardData.gender; // New check for child info
      case 7: return true; // Custom note is optional
      default: return false;
    }
  };

  const handleFinalSubmit = () => {
    handleSubmit();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && isNextAvailable() && !pageFlipping) {
        goToNextPage();
      } else if (e.key === 'ArrowLeft' && currentPage > 1 && !pageFlipping) {
        goToPrevPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isNextAvailable, pageFlipping]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] bg-[#FEF6EC] py-4">
      <div className="w-full max-w-[700px] rounded-2xl overflow-hidden shadow-lg bg-[#FFF9F2] mx-auto relative">
        {/* Book header with navigation */}
        <div className="book-header">
          <button 
            onClick={goToPrevPage} 
            disabled={currentPage === 1 || pageFlipping}
            className="flex items-center text-gray-700 hover:text-persimmon disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={20} />
            <span className="ml-1 text-sm font-medium">Back</span>
          </button>
          
          <div className="flex items-center">
            <Book size={16} className="text-gray-400 mr-2" />
            <p className="page-number">Page {currentPage} of {totalPages}</p>
          </div>
        </div>

        {/* Book content area */}
        <div className="relative overflow-hidden" style={{ minHeight: '500px' }}>
          <AnimatePresence mode="wait" initial={false}>
            <PageFlip
              key={currentPage}
              isFlipping={pageFlipping}
              direction={direction}
              onAnimationComplete={handleAnimationComplete}
            >
              <WizardPage>
                {currentPage === 1 && (
                  <AgeSelectionContent 
                    selectedAge={wizardData.age}
                    onSelectAge={handleSelectAge}
                    ageCategories={ageCategories}
                  />
                )}
                
                {currentPage === 2 && (
                  <ThemeSelectionContent
                    selectedTheme={wizardData.theme}
                    onSelectTheme={handleSelectTheme}
                    themes={themes}
                  />
                )}
                
                {currentPage === 3 && (
                  <SubjectSelectionContent
                    selectedTheme={wizardData.theme}
                    selectedSubject={wizardData.subject}
                    onSelectSubject={handleSelectSubject}
                    subjects={availableSubjects}
                  />
                )}
                
                {currentPage === 4 && (
                  <MessageSelectionContent
                    selectedMessage={wizardData.message}
                    onSelectMessage={handleSelectMessage}
                    messages={messages}
                  />
                )}
                
                {currentPage === 5 && (
                  <StyleSelectionContent
                    selectedStyle={wizardData.style}
                    onSelectStyle={handleSelectStyle}
                    styles={styles}
                  />
                )}

                {currentPage === 6 && (
                  <ChildInfoContent
                    childName={wizardData.childName || ''}
                    gender={wizardData.gender || ''}
                    photoPreview={wizardData.photoPreview}
                    onChildInfoChange={handleChildInfoChange}
                    onPhotoUpload={handlePhotoUpload}
                  />
                )}
                
                {currentPage === 7 && (
                  <CustomNoteContent
                    customNote={wizardData.customNote || ''}
                    onCustomNoteChange={handleCustomNoteChange}
                    wizardData={wizardData}
                  />
                )}
              </WizardPage>
            </PageFlip>
          </AnimatePresence>
        </div>
        
        {/* Book footer with action buttons */}
        <div className="book-footer">
          {currentPage === totalPages ? (
            <Button 
              onClick={handleFinalSubmit} 
              disabled={isSubmitting} 
              size="lg"
              className="bg-[#FF7A50] hover:bg-[#FF7A50]/90 text-white font-semibold shadow-md min-w-[180px]"
              withArrow
            >
              Review My Book
            </Button>
          ) : (
            <Button 
              onClick={goToNextPage} 
              disabled={!isNextAvailable() || pageFlipping} 
              size="lg"
              className="bg-[#FF7A50] hover:bg-[#FF7A50]/90 text-white font-semibold shadow-md min-w-[120px]"
              withArrow
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookWizard;
