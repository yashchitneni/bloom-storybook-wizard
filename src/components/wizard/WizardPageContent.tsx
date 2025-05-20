
import React, { useEffect } from 'react';
import AgeSelectionSection from '@/components/wizard/steps/AgeSelectionSection';
import ThemeSelectionSection from '@/components/wizard/steps/ThemeSelectionSection';
import SubjectSelectionSection from '@/components/wizard/steps/SubjectSelectionSection';
import MessageSelectionSection from '@/components/wizard/steps/MessageSelectionSection';
import CustomNoteSection from '@/components/wizard/steps/CustomNoteSection';
import StyleSelectionSection from '@/components/wizard/steps/StyleSelectionSection';
import ChildProfileSection from '@/components/wizard/steps/ChildProfileSection';
import CharactersSection from '@/components/wizard/steps/CharactersSection';
import PreviewSection from '@/components/wizard/steps/PreviewSection';
import CheckoutSection from '@/components/wizard/steps/CheckoutSection';
import ContinueButton from '@/components/wizard/steps/ContinueButton';
import WizardRoadmap from "@/components/WizardRoadmap";
import { useWizardContext } from '@/contexts/WizardContext';
import { useWizardLookupData } from '@/hooks/wizard/use-wizard-lookup-data';
import { useWizardNavigation } from '@/hooks/wizard/use-wizard-navigation';
import { useWizardCharacters } from '@/hooks/wizard/use-wizard-characters';

interface WizardPageContentProps {
  isLoading: boolean;
  handleSubmit: () => void;
}

const WizardPageContent: React.FC<WizardPageContentProps> = ({ isLoading, handleSubmit }) => {
  const { state: wizardData, dispatch, isSubmitting } = useWizardContext();
  const { currentStep, totalSteps, handleGoToStep } = useWizardNavigation();
  const { themes, subjects, messages, styles, ageCategories } = useWizardLookupData();
  
  // Reuse the existing character management hooks with our new context
  const { 
    handleAddCharacter,
    handleUpdateCharacter, 
    handleRemoveCharacter 
  } = useWizardCharacters({ 
    wizardData, 
    updateWizardData: (newData) => {
      if (newData.characters !== wizardData.characters) {
        dispatch({ type: 'UPDATE_FIELD', field: 'characters', value: newData.characters });
      }
    } 
  });
  
  // Handlers for each step
  const handleSelectAge = (age: string) => {
    console.log("Setting age in wizardData:", age);
    dispatch({ type: 'UPDATE_FIELD', field: 'age', value: age });
  };

  const handleSelectTheme = (theme: string) => {
    console.log("Setting theme in wizardData:", theme);
    dispatch({ type: 'UPDATE_FIELD', field: 'theme', value: theme });
    dispatch({ type: 'UPDATE_FIELD', field: 'subject', value: '' }); // Reset subject when theme changes
  };

  const handleSelectSubject = (subject: string) => {
    console.log("Setting subject in wizardData:", subject);
    dispatch({ type: 'UPDATE_FIELD', field: 'subject', value: subject });
  };

  const handleSelectMessage = (message: string) => {
    console.log("Setting message in wizardData:", message);
    dispatch({ type: 'UPDATE_FIELD', field: 'message', value: message });
  };

  const handleCustomNoteChange = (customNote: string) => {
    console.log("Setting customNote in wizardData:", customNote);
    dispatch({ type: 'UPDATE_FIELD', field: 'customNote', value: customNote });
  };

  const handleSelectStyle = (style: string) => {
    console.log("Setting style in wizardData:", style);
    dispatch({ type: 'UPDATE_FIELD', field: 'style', value: style });
  };
  
  const handleChildNameChange = (childName: string) => {
    console.log("Setting childName in wizardData:", childName);
    dispatch({ type: 'UPDATE_FIELD', field: 'childName', value: childName });
  };
  
  const handleChildGenderChange = (childGender: string) => {
    console.log("Setting childGender in wizardData:", childGender);
    dispatch({ type: 'UPDATE_FIELD', field: 'childGender', value: childGender });
  };

  const handleChildPhotoUpload = (file: File) => {
    if (file.size === 0) {
      dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoFile', value: null });
      dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoPreview', value: null });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoFile', value: file });
      dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoPreview', value: e.target?.result });
    };
    reader.readAsDataURL(file);
  };

  // Get available subjects for selected theme
  const availableSubjects = wizardData.theme ? subjects[wizardData.theme] || [] : [];
  
  // Check if child profile is complete
  const isChildProfileComplete = (
    wizardData.childName && 
    wizardData.childGender && 
    wizardData.childPhotoPreview
  );

  // Log when isChildProfileComplete changes
  useEffect(() => {
    console.log("Child profile complete:", isChildProfileComplete, {
      childName: wizardData.childName,
      childGender: wizardData.childGender,
      childPhotoPreview: wizardData.childPhotoPreview ? "present" : "missing"
    });
  }, [wizardData.childName, wizardData.childGender, wizardData.childPhotoPreview]);

  // Handle continue button click
  const handleContinueClick = () => {
    const nextEmptyStep = !wizardData.age ? 1 : 
                        !wizardData.theme ? 2 : 
                        !wizardData.subject ? 3 : 
                        !wizardData.message ? 4 :
                        !wizardData.style ? 6 :
                        !isChildProfileComplete ? 7 : 8;
    console.log("Continue clicked, going to next empty step:", nextEmptyStep);
    const element = document.getElementById(`step-${nextEmptyStep}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Scroll to the newly revealed section when currentStep changes
  useEffect(() => {
    const element = document.getElementById(`step-${currentStep}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentStep]);

  // Show loading message if data is still loading
  if (isLoading) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Loading wizard data...</h2>
        <div className="animate-spin h-8 w-8 border-4 border-persimmon border-t-transparent rounded-full mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="bg-cream rounded-xl p-6 md:p-10 shadow-sm" id="wizard-container">
      <WizardRoadmap 
        currentStep={currentStep} 
        totalSteps={totalSteps}
        onStepClick={handleGoToStep}
      />
      
      <h2 className="text-2xl font-bold text-persimmon mb-8">Put Together Your Unique Children's Book</h2>
      
      <div className="space-y-12">
        {/* Age Selection Section */}
        <AgeSelectionSection
          onSelectAge={handleSelectAge}
          selectedAge={wizardData.age}
          ageCategories={ageCategories}
          isActive={true}
        />

        {/* Theme Selection - Show if age is selected */}
        {wizardData.age && (
          <ThemeSelectionSection
            onSelectTheme={handleSelectTheme}
            selectedTheme={wizardData.theme}
            themes={themes}
            isActive={true}
          />
        )}

        {/* Subject Selection - Show if theme is selected */}
        {wizardData.theme && (
          <SubjectSelectionSection
            onSelectSubject={handleSelectSubject}
            selectedTheme={wizardData.theme}
            selectedSubject={wizardData.subject}
            subjects={availableSubjects}
            isActive={true}
          />
        )}

        {/* Message Selection - Show if subject is selected */}
        {wizardData.subject && (
          <MessageSelectionSection
            onSelectMessage={handleSelectMessage}
            selectedMessage={wizardData.message}
            messages={messages}
            isActive={true}
          />
        )}

        {/* Custom Note - Show if message is selected */}
        {wizardData.message && (
          <CustomNoteSection
            onCustomNoteChange={handleCustomNoteChange}
            customNote={wizardData.customNote || ""}
            isActive={true}
          />
        )}

        {/* Style Selection - Show after personal note */}
        {wizardData.message && (
          <StyleSelectionSection
            onSelectStyle={handleSelectStyle}
            selectedStyle={wizardData.style}
            styles={styles}
            isActive={true}
          />
        )}
        
        {/* Child Profile - Show if style is selected */}
        {wizardData.style && (
          <ChildProfileSection
            onChildNameChange={handleChildNameChange}
            onChildGenderChange={handleChildGenderChange}
            onChildPhotoUpload={handleChildPhotoUpload}
            childName={wizardData.childName}
            childGender={wizardData.childGender}
            childPhotoPreview={wizardData.childPhotoPreview}
            isActive={true}
          />
        )}
        
        {/* Additional Characters - Show if child profile is complete */}
        {wizardData.style && isChildProfileComplete && (
          <CharactersSection
            characters={wizardData.characters}
            onAddCharacter={handleAddCharacter}
            onUpdateCharacter={handleUpdateCharacter}
            onRemoveCharacter={handleRemoveCharacter}
            isActive={true}
            maxCharacters={4}
          />
        )}

        {/* Preview - Show if child profile is complete */}
        {wizardData.style && isChildProfileComplete && (
          <PreviewSection
            wizardData={wizardData}
            isActive={true}
          />
        )}

        {/* Checkout - Show if preview is completed */}
        {wizardData.style && isChildProfileComplete && (
          <CheckoutSection
            onSubmit={handleSubmit}
            isActive={true}
          />
        )}
        
        {/* Final call to action if not all fields completed */}
        {(!wizardData.age || !wizardData.theme || !isChildProfileComplete) && (
          <ContinueButton onClick={handleContinueClick} />
        )}
      </div>
    </div>
  );
};

export default WizardPageContent;
