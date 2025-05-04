
import React, { useEffect } from 'react';
import { AnimatePresence } from "framer-motion";
import { WizardData } from "@/types/wizard";
import PageFlip from './PageFlip';
import WizardPage from './WizardPage';
import AgeSelectionContent from './AgeSelectionContent';
import ThemeSelectionContent from './ThemeSelectionContent';
import SubjectSelectionContent from './SubjectSelectionContent';
import MessageSelectionContent from './MessageSelectionContent';
import StyleSelectionContent from './StyleSelectionContent';
import ChildInfoContent from './ChildInfoContent';
import CustomNoteContent from './CustomNoteContent';

interface WizardContentProps {
  currentPage: number;
  pageFlipping: boolean;
  direction: 'next' | 'prev';
  wizardData: WizardData;
  handleSelectAge: (age: string) => void;
  handleSelectTheme: (theme: string) => void;
  handleSelectSubject: (subject: string) => void;
  handleSelectMessage: (message: string) => void;
  handleSelectStyle: (style: string) => void;
  handleChildInfoChange: (info: { name: string; gender: string; photo?: File }) => void;
  handleCustomNoteChange: (note: string) => void;
  handlePhotoUpload: (file: File) => void;
  ageCategories: string[];
  themes: string[];
  availableSubjects: string[];
  messages: string[];
  styles: string[];
  handleAnimationComplete: () => void;
}

const WizardContent: React.FC<WizardContentProps> = ({
  currentPage,
  pageFlipping,
  direction,
  wizardData,
  handleSelectAge,
  handleSelectTheme,
  handleSelectSubject,
  handleSelectMessage,
  handleSelectStyle,
  handleChildInfoChange,
  handleCustomNoteChange,
  handlePhotoUpload,
  ageCategories,
  themes,
  availableSubjects,
  messages,
  styles,
  handleAnimationComplete
}) => {
  // Debug logging
  useEffect(() => {
    console.log("WizardContent rendered", {
      currentPage,
      ageCategories,
      themes,
      availableSubjects,
      messages,
      styles
    });
  }, [currentPage, ageCategories, themes, availableSubjects, messages, styles]);

  return (
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
                ageCategories={ageCategories.length > 0 ? ageCategories : ['0-2', '3-5', '6-9']}
              />
            )}
            
            {currentPage === 2 && (
              <ThemeSelectionContent
                selectedTheme={wizardData.theme}
                onSelectTheme={handleSelectTheme}
                themes={themes.length > 0 ? themes : ['Adventure', 'Fantasy', 'Animals', 'Space', 'Ocean', 'Friendship']}
              />
            )}
            
            {currentPage === 3 && (
              <SubjectSelectionContent
                selectedTheme={wizardData.theme}
                selectedSubject={wizardData.subject}
                onSelectSubject={handleSelectSubject}
                subjects={availableSubjects.length > 0 ? availableSubjects : ['Subject 1', 'Subject 2', 'Subject 3']}
              />
            )}
            
            {currentPage === 4 && (
              <MessageSelectionContent
                selectedMessage={wizardData.message}
                onSelectMessage={handleSelectMessage}
                messages={messages.length > 0 ? messages : ['Kindness', 'Courage', 'Friendship', 'Honesty', 'Learning', 'Perseverance']}
              />
            )}
            
            {currentPage === 5 && (
              <StyleSelectionContent
                selectedStyle={wizardData.style}
                onSelectStyle={handleSelectStyle}
                styles={styles.length > 0 ? styles : ['Cartoon', 'Watercolor', 'Digital', 'Classic']}
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
  );
};

export default WizardContent;
