
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WizardHeader from '@/components/wizard/WizardHeader';
import WizardPageContent from '@/components/wizard/WizardPageContent';
import { useWizardContext } from '@/contexts/WizardContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWizardLookupData } from '@/hooks/wizard/use-wizard-lookup-data';
import { useWizardNavigation } from '@/hooks/wizard/use-wizard-navigation';

const WizardPage = () => {
  const { state: wizardData, isSubmitting, setIsSubmitting } = useWizardContext();
  const { user } = useAuth();
  const { isLoading } = useWizardLookupData();
  const { currentStep, totalSteps, handleNext, handlePrevious, handleGoToStep } = useWizardNavigation();
  
  const handleSubmit = () => {
    console.log('Submitting wizard data:', wizardData);
    setIsSubmitting(true);
    // Future submission logic will go here
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  };

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
