
import React from 'react';
import { motion } from "framer-motion";
import CheckoutCard from '@/components/wizard/CheckoutCard';
import { WizardData } from '@/types/wizard';

interface CheckoutSectionProps {
  wizardData: WizardData;
  onEmailChange: (email: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isActive: boolean;
}

const CheckoutSection: React.FC<CheckoutSectionProps> = ({
  wizardData,
  onEmailChange,
  onSubmit,
  isSubmitting,
  isActive
}) => {
  // Create wrapped handlers to add logging
  const handleEmailChange = (email: string) => {
    console.log("Email changed:", email);
    onEmailChange(email);
  };
  
  const handleSubmit = () => {
    console.log("Submitting wizard with data:", wizardData);
    // Call onSubmit which will get the latest wizardData through the getter function
    onSubmit();
  };
  
  return (
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
      
      {/* LemonSqueezy Buy Button */}
      <div className="wizard-footer text-center mt-8">
        <a href="https://dearkidbooks.lemonsqueezy.com/buy/d751df59-d810-4f21-8fd3-f1e6be65a994?embed=1" 
           className="lemonsqueezy-button inline-block w-full md:w-auto">
          Buy My Story — $7.99
        </a>
        <script src="https://assets.lemonsqueezy.com/lemon.js" defer></script>
      </div>
    </motion.section>
  );
};

export default CheckoutSection;
