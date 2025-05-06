
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWizardState } from '@/hooks/wizard/use-wizard-state';
import { useWizardSubmission } from '@/hooks/use-wizard-submission';
import WizardHeader from '@/components/wizard/WizardHeader';
import WizardPageContent from '@/components/wizard/WizardPageContent';

const WizardPage = () => {
  const {
    wizardData,
    setWizardData,
    isSubmitting,
    setIsSubmitting,
    user,
    isLoading
  } = useWizardState();
  
  // Pass a function to get the latest wizardData state
  const { handleSubmit } = useWizardSubmission(
    () => wizardData,
    setWizardData,
    setIsSubmitting,
    user
  );

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 md:py-16 max-w-4xl">
          <WizardHeader />
          <WizardPageContent 
            isLoading={isLoading}
            handleSubmit={handleSubmit}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WizardPage;
