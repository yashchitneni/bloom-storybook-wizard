
import React, { useEffect } from 'react';
import { motion } from "framer-motion";
import { useWizardState } from '@/hooks/wizard/use-wizard-state';
import AgeCard from '@/components/wizard/AgeCard';
import ThemeCard from '@/components/wizard/ThemeCard';
import SubjectCard from '@/components/wizard/SubjectCard';
import MessageCard from '@/components/wizard/MessageCard';
import CustomNoteCard from '@/components/wizard/CustomNoteCard';
import StyleSelectionCard from '@/components/wizard/StyleSelectionCard';
import ChildProfileCard from '@/components/wizard/ChildProfileCard';
import CharactersCard from '@/components/wizard/CharactersCard';
import PreviewCard from '@/components/wizard/PreviewCard';
import CheckoutCard from '@/components/wizard/CheckoutCard';
import WizardRoadmap from "@/components/WizardRoadmap";
import Button from "@/components/Button";

interface WizardPageContentProps {
  isLoading: boolean;
  handleSubmit: () => void;
}

const WizardPageContent: React.FC<WizardPageContentProps> = ({ isLoading, handleSubmit }) => {
  const {
    currentStep,
    wizardData,
    setWizardData,
    isSubmitting,
    handlePhotoUpload,
    handleChildPhotoUpload,
    handleAddCharacter,
    handleUpdateCharacter,
    handleRemoveCharacter,
    themes,
    subjects,
    messages,
    styles,
    ageCategories,
    handleGoToStep,
    totalSteps
  } = useWizardState();
  
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
  
  const handleChildNameChange = (childName: string) => {
    setWizardData({ ...wizardData, childName });
  };
  
  const handleChildGenderChange = (childGender: string) => {
    setWizardData({ ...wizardData, childGender });
  };

  const handleEmailChange = (email: string) => {
    setWizardData({ ...wizardData, email });
  };

  const handleSelectMoral = (moral: string) => {
    setWizardData({ ...wizardData, moral });
  };

  const handleSpecialDetailsChange = (specialDetails: string) => {
    setWizardData({ ...wizardData, specialDetails });
  };

  // Get available subjects for selected theme
  const availableSubjects = wizardData.theme ? subjects[wizardData.theme] || [] : [];
  
  // Check if child profile is complete
  const isChildProfileComplete = (
    wizardData.childName && 
    wizardData.childGender && 
    wizardData.childPhotoPreview
  );

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
        <motion.section 
          id="step-1" 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-bold">Choose the Age Category</h3>
          <AgeCard 
            onSelectAge={handleSelectAge}
            selectedAge={wizardData.age}
            ageCategories={ageCategories}
            isActive={true}
          />
        </motion.section>

        {/* Theme Selection - Show if age is selected */}
        {wizardData.age && (
          <motion.section 
            id="step-2"
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold">Choose a Theme</h3>
            <ThemeCard
              onSelectTheme={handleSelectTheme}
              selectedTheme={wizardData.theme}
              themes={themes}
              isActive={true}
            />
          </motion.section>
        )}

        {/* Subject Selection - Show if theme is selected */}
        {wizardData.theme && (
          <motion.section 
            id="step-3"
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold">Choose a Subject</h3>
            <SubjectCard
              onSelectSubject={handleSelectSubject}
              selectedTheme={wizardData.theme}
              selectedSubject={wizardData.subject}
              subjects={availableSubjects}
              isActive={true}
            />
          </motion.section>
        )}

        {/* Message Selection - Show if subject is selected */}
        {wizardData.subject && (
          <motion.section 
            id="step-4"
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold">What's the central message of the story?</h3>
            <MessageCard
              onSelectMessage={handleSelectMessage}
              selectedMessage={wizardData.message}
              messages={messages}
              isActive={true}
            />
          </motion.section>
        )}

        {/* Custom Note - Show if message is selected */}
        {wizardData.message && (
          <motion.section 
            id="step-5"
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold">Add a personal note</h3>
            <CustomNoteCard
              onCustomNoteChange={handleCustomNoteChange}
              customNote={wizardData.customNote}
              isActive={true}
            />
          </motion.section>
        )}

        {/* Style Selection - Show after personal note */}
        {wizardData.message && (
          <motion.section 
            id="step-6"
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold">Choose Illustration Style</h3>
            <StyleSelectionCard
              onSelectStyle={handleSelectStyle}
              selectedStyle={wizardData.style}
              styles={styles}
              isActive={true}
            />
          </motion.section>
        )}
        
        {/* Child Profile - Show if style is selected */}
        {wizardData.style && (
          <motion.section 
            id="step-7"
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold">Your Child</h3>
            <ChildProfileCard
              onChildNameChange={handleChildNameChange}
              onChildGenderChange={handleChildGenderChange}
              onChildPhotoUpload={handleChildPhotoUpload}
              childName={wizardData.childName}
              childGender={wizardData.childGender}
              childPhotoPreview={wizardData.childPhotoPreview}
              isActive={true}
            />
          </motion.section>
        )}
        
        {/* Additional Characters - Show if child profile is complete */}
        {wizardData.style && isChildProfileComplete && (
          <motion.section 
            id="step-8"
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold">Additional Characters</h3>
            <CharactersCard
              characters={wizardData.characters}
              onAddCharacter={handleAddCharacter}
              onUpdateCharacter={handleUpdateCharacter}
              onRemoveCharacter={handleRemoveCharacter}
              isActive={true}
              maxCharacters={4}
            />
          </motion.section>
        )}

        {/* Preview - Show if child profile is complete */}
        {wizardData.style && isChildProfileComplete && (
          <motion.section 
            id="step-9"
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold">Preview Your Story</h3>
            <PreviewCard
              wizardData={wizardData}
              isActive={true}
            />
          </motion.section>
        )}

        {/* Checkout - Show if preview is completed */}
        {wizardData.style && isChildProfileComplete && (
          <motion.section 
            id="step-10"
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold">Complete Your Order</h3>
            <CheckoutCard
              wizardData={wizardData}
              onEmailChange={handleEmailChange}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              isActive={true}
            />
          </motion.section>
        )}
        
        {/* Final call to action if not all fields completed */}
        {(!wizardData.age || !wizardData.theme || !isChildProfileComplete) && (
          <div className="flex justify-center pt-8">
            <Button 
              onClick={() => {
                const nextEmptyStep = !wizardData.age ? 1 : 
                                    !wizardData.theme ? 2 : 
                                    !wizardData.subject ? 3 : 
                                    !wizardData.message ? 4 :
                                    !wizardData.style ? 6 :
                                    !isChildProfileComplete ? 7 : 8;
                const element = document.getElementById(`step-${nextEmptyStep}`);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              size="lg"
              withArrow
            >
              Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WizardPageContent;
