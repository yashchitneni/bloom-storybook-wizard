
import React from 'react';
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
  // Get the correct content for the current page
  const renderContent = () => {
    console.log("Rendering wizard content for page:", currentPage);
    
    switch(currentPage) {
      case 1:
        return (
          <AgeSelectionContent 
            selectedAge={wizardData.age}
            onSelectAge={handleSelectAge}
            ageCategories={ageCategories.length > 0 ? ageCategories : ['0-2', '3-5', '6-9']}
          />
        );
      case 2:
        return (
          <ThemeSelectionContent
            selectedTheme={wizardData.theme}
            onSelectTheme={handleSelectTheme}
            themes={themes.length > 0 ? themes : ['Adventure', 'Fantasy', 'Animals', 'Space', 'Ocean', 'Friendship']}
          />
        );
      case 3:
        return (
          <SubjectSelectionContent
            selectedTheme={wizardData.theme}
            selectedSubject={wizardData.subject}
            onSelectSubject={handleSelectSubject}
            subjects={availableSubjects && availableSubjects.length > 0 ? availableSubjects : ['Subject 1', 'Subject 2', 'Subject 3']}
          />
        );
      case 4:
        return (
          <MessageSelectionContent
            selectedMessage={wizardData.message}
            onSelectMessage={handleSelectMessage}
            messages={messages.length > 0 ? messages : ['Kindness', 'Courage', 'Friendship', 'Honesty', 'Learning', 'Perseverance']}
          />
        );
      case 5:
        return (
          <StyleSelectionContent
            selectedStyle={wizardData.style}
            onSelectStyle={handleSelectStyle}
            styles={styles.length > 0 ? styles : ['Cartoon', 'Watercolor', 'Digital', 'Classic']}
          />
        );
      case 6:
        return (
          <ChildInfoContent
            childName={wizardData.childName || ''}
            gender={wizardData.gender || ''}
            photoPreview={wizardData.photoPreview}
            onChildInfoChange={handleChildInfoChange}
            onPhotoUpload={handlePhotoUpload}
          />
        );
      case 7:
        return (
          <CustomNoteContent
            customNote={wizardData.customNote || ''}
            onCustomNoteChange={handleCustomNoteChange}
            wizardData={wizardData}
          />
        );
      default:
        return <div className="text-center p-6">Unknown page</div>;
    }
  };

  return (
    <div className="relative overflow-hidden bg-white rounded-md" style={{ minHeight: '500px' }}>
      <PageFlip
        isFlipping={pageFlipping}
        direction={direction}
        onAnimationComplete={handleAnimationComplete}
      >
        <WizardPage>
          {renderContent()}
        </WizardPage>
      </PageFlip>
    </div>
  );
};

export default WizardContent;
