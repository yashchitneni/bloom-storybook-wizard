
import React, { useEffect } from 'react';
import { motion } from "framer-motion";
import CheckoutCard from '@/components/wizard/CheckoutCard';
import { WizardData } from '@/types/wizard';
import { toast } from 'sonner';

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
  
  // Create a wrapper for the LemonSqueezy checkout
  const handleLemonSqueezyCheckout = () => {
    if (!wizardData.email) {
      toast.error("Email is required for checkout");
      return;
    }

    try {
      console.log("Opening LemonSqueezy checkout with data:", wizardData);
      
      // Create a standard LemonSqueezy checkout URL with query parameters
      const baseUrl = "https://dearkidbooks.lemonsqueezy.com/buy/d751df59-d810-4f21-8fd3-f1e6be65a994";
      const params = new URLSearchParams({
        embed: "1",
        email: wizardData.email,
        checkout: JSON.stringify({
          custom: {
            childName: wizardData.childName,
            childGender: wizardData.childGender,
            age: wizardData.age,
            theme: wizardData.theme,
            subject: wizardData.subject,
            message: wizardData.message,
            style: wizardData.style,
            customNote: wizardData.customNote || ""
          }
        })
      });
      
      // Create and click a hidden anchor element to trigger the LemonSqueezy popup
      const checkoutUrl = `${baseUrl}?${params.toString()}`;
      const checkoutLink = document.createElement('a');
      checkoutLink.href = checkoutUrl;
      checkoutLink.className = 'lemonsqueezy-button';
      checkoutLink.style.display = 'none';
      document.body.appendChild(checkoutLink);
      checkoutLink.click();
      
      // Clean up the temporary element
      setTimeout(() => {
        document.body.removeChild(checkoutLink);
      }, 100);
      
    } catch (error) {
      console.error("LemonSqueezy checkout error:", error);
      toast.error("Error opening checkout. Please try again.");
    }
  };

  useEffect(() => {
    // Wait for the document to be fully loaded
    const checkLemonSqueezy = () => {
      if (window.LemonSqueezy) {
        console.log("LemonSqueezy initialized successfully");
      } else {
        console.warn("LemonSqueezy not available - this could be normal during initial load");
      }
    };

    // Check once immediately and then on each window load event
    checkLemonSqueezy();
    window.addEventListener('load', checkLemonSqueezy);
    
    return () => {
      window.removeEventListener('load', checkLemonSqueezy);
    };
  }, []);

  return (
    <motion.section
      id="step-10"
      className="space-y-6"
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.5,
        delay: 0.2
      }}
    >
      <h3 className="text-xl font-bold">Complete Your Order</h3>
      <CheckoutCard 
        wizardData={wizardData} 
        onEmailChange={handleEmailChange} 
        onSubmit={onSubmit} 
        isSubmitting={isSubmitting} 
        isActive={true} 
      />
      
      {/* LemonSqueezy Buy Button - This is the only button we're keeping */}
      <div className="wizard-footer text-center mt-8">
        <button 
          type="button" 
          className="lemonsqueezy-button inline-block w-full md:w-auto"
          onClick={handleLemonSqueezyCheckout}
          disabled={isSubmitting || !wizardData.email}
        >
          Create My Story — $7.99
        </button>
      </div>
    </motion.section>
  );
};

export default CheckoutSection;
