
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWizardState } from '@/hooks/use-wizard-state';
import { useWizardSubmission } from '@/hooks/use-wizard-submission';
import Button from "@/components/Button";
import WizardPage from './WizardPage';
import AgeSelectionContent from './AgeSelectionContent';
import ThemeSelectionContent from './ThemeSelectionContent';
import SubjectSelectionContent from './SubjectSelectionContent';
import MessageSelectionContent from './MessageSelectionContent';
import StyleSelectionContent from './StyleSelectionContent';
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

  const totalPages = 6;

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
    if (currentPage < totalPages) {
      setPageFlipping(true);
      setDirection('next');
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setPageFlipping(false);
      }, 400); // Match the animation duration
    }
  };
  
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setPageFlipping(true);
      setDirection('prev');
      setTimeout(() => {
        setCurrentPage(prev => prev - 1);
        setPageFlipping(false);
      }, 400); // Match the animation duration
    }
  };

  // Check if next is available based on current selections
  const isNextAvailable = () => {
    switch (currentPage) {
      case 1: return !!wizardData.age;
      case 2: return !!wizardData.theme;
      case 3: return !!wizardData.subject;
      case 4: return !!wizardData.message;
      case 5: return !!wizardData.style;
      case 6: return true; // Custom note is optional
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
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <button 
            onClick={goToPrevPage} 
            disabled={currentPage === 1 || pageFlipping}
            className="text-gray-700 hover:text-[#FF7A50] disabled:opacity-30 disabled:cursor-not-allowed text-2xl transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={24} />
          </button>
          
          <p className="font-serif text-sm">Page {currentPage} of {totalPages}</p>
        </div>

        {/* Book content area */}
        <div className="relative overflow-hidden" style={{ minHeight: '500px' }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentPage}
              initial={{ 
                opacity: 0,
                x: direction === 'next' ? 300 : -300,
                rotateY: direction === 'next' ? 45 : -45
              }}
              animate={{ 
                opacity: 1,
                x: 0,
                rotateY: 0,
                transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
              }}
              exit={{ 
                opacity: 0,
                x: direction === 'next' ? -300 : 300,
                rotateY: direction === 'next' ? -45 : 45,
                transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
              }}
              className="absolute w-full h-full"
              style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
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
                  <CustomNoteContent
                    customNote={wizardData.customNote || ''}
                    onCustomNoteChange={handleCustomNoteChange}
                    wizardData={wizardData}
                  />
                )}
              </WizardPage>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Book footer with action buttons */}
        <div className="p-6 border-t border-gray-200 flex justify-center">
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

        {/* Page curl effect overlay */}
        {pageFlipping && (
          <div className="absolute top-0 right-0 bottom-0 z-10 w-12 bg-gradient-to-l from-gray-300/50 to-transparent pointer-events-none"></div>
        )}
      </div>
    </div>
  );
};

export default BookWizard;
