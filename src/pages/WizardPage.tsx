
import React, { useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWizardState } from '@/hooks/use-wizard-state';
import { useWizardSubmission } from '@/hooks/use-wizard-submission';
import Button from "@/components/Button";
import { motion } from "framer-motion";
import AgeCard from '@/components/wizard/AgeCard';
import ThemeCard from '@/components/wizard/ThemeCard';
import SubjectCard from '@/components/wizard/SubjectCard';
import MessageCard from '@/components/wizard/MessageCard';
import CustomNoteCard from '@/components/wizard/CustomNoteCard';
import PhotoStyleCard from '@/components/wizard/PhotoStyleCard';
import PreviewCard from '@/components/wizard/PreviewCard';
import CheckoutCard from '@/components/wizard/CheckoutCard';
import WizardRoadmap from "@/components/WizardRoadmap";

const WizardPage = () => {
  const {
    currentStep,
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
    user,
    handleGoToStep,
    totalSteps,
    isLoading
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

  const handleSelectMoral = (moral: string) => {
    setWizardData({ ...wizardData, moral });
  };

  const handleSpecialDetailsChange = (specialDetails: string) => {
    setWizardData({ ...wizardData, specialDetails });
  };

  // Get available subjects for selected theme
  const availableSubjects = wizardData.theme ? subjects[wizardData.theme] || [] : [];

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
      <div className="min-h-screen flex flex-col bg-cream">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Loading wizard data...</h2>
            <div className="animate-spin h-8 w-8 border-4 border-persimmon border-t-transparent rounded-full mx-auto"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 md:py-16 max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Create a Personalized Children's Book</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose a story theme, add a name and personal details, and create a unique eBook. 
              You can then order the story as a hardcover book for a lasting keepsake.
            </p>
          </div>
          
          <div id="wizard-container" className="bg-cream rounded-xl p-6 md:p-10 shadow-sm">
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

              {/* Photo & Style - Show ONLY if custom note is filled in */}
              {wizardData.customNote && (
                <motion.section 
                  id="step-6"
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className="text-xl font-bold">Upload Photo & Choose Style</h3>
                  <PhotoStyleCard
                    onSelectStyle={handleSelectStyle}
                    selectedStyle={wizardData.style}
                    onPhotoUpload={handlePhotoUpload}
                    photoPreview={wizardData.photoPreview}
                    styles={styles}
                    isActive={true}
                  />
                </motion.section>
              )}

              {/* Preview - Show if photo and style are completed */}
              {wizardData.photoPreview && wizardData.style && (
                <motion.section 
                  id="step-7"
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
              {wizardData.photoPreview && wizardData.style && (
                <motion.section 
                  id="step-8"
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
              {(!wizardData.age || !wizardData.theme) && (
                <div className="flex justify-center pt-8">
                  <Button 
                    onClick={() => {
                      const nextEmptyStep = !wizardData.age ? 1 : 
                                          !wizardData.theme ? 2 : 
                                          !wizardData.subject ? 3 : 
                                          !wizardData.message ? 4 : 
                                          !wizardData.customNote ? 5 : 6;
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WizardPage;
