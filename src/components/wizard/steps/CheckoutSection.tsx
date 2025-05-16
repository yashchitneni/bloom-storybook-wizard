
import React, { useEffect } from 'react';
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
    onSubmit();
  };
  
  // Initialize LemonSqueezy script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.lemonsqueezy.com/lemon.js';
    script.defer = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  // Create a wrapper for the LemonSqueezy checkout
  const handleLemonSqueezyCheckout = () => {
    if (!wizardData.email) {
      console.error("Email is required for checkout");
      return;
    }
    
    // Ensure LemonSqueezy is loaded
    if (window.LemonSqueezy) {
      console.log("Opening LemonSqueezy checkout with data:", wizardData);
      window.LemonSqueezy.open({
        product: "d751df59-d810-4f21-8fd3-f1e6be65a994",
        embed: true,
        email: wizardData.email,
        custom_data: {
          childName: wizardData.childName,
          childGender: wizardData.childGender,
          age: wizardData.age,
          theme: wizardData.theme,
          subject: wizardData.subject,
          message: wizardData.message,
          style: wizardData.style,
          customNote: wizardData.customNote || ""
        }
      });
    } else {
      console.error("LemonSqueezy not loaded");
    }
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
        <button 
          type="button" 
          className="lemonsqueezy-button inline-block w-full md:w-auto"
          onClick={handleLemonSqueezyCheckout}
          disabled={isSubmitting || !wizardData.email}
        >
          Buy My Story — $7.99
        </button>
      </div>
    </motion.section>
  );
};

export default CheckoutSection;
