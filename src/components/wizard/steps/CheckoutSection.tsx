
import React, { useEffect } from 'react';
import { motion } from "framer-motion";
import CheckoutCard from '@/components/wizard/CheckoutCard';
import { toast } from 'sonner';
import { useWizardContext } from '@/contexts/WizardContext';

interface CheckoutSectionProps {
  onSubmit: () => void;
  isActive: boolean;
}

const CheckoutSection: React.FC<CheckoutSectionProps> = ({
  onSubmit,
  isActive
}) => {
  const { state: wizardData, dispatch, isSubmitting } = useWizardContext();
  
  // Handle email changes
  const handleEmailChange = (email: string) => {
    console.log("Email changed:", email);
    dispatch({ type: 'UPDATE_FIELD', field: 'email', value: email });
  };
  
  // Initialize LemonSqueezy when component mounts
  useEffect(() => {
    const initializeLemonSqueezy = () => {
      if (window.LemonSqueezy && typeof window.LemonSqueezy.initialize === 'function') {
        try {
          window.LemonSqueezy.initialize();
          console.log("LemonSqueezy initialized successfully");
        } catch (error) {
          console.error("Error initializing LemonSqueezy:", error);
        }
      } else {
        console.log("LemonSqueezy not fully loaded yet, will try again later");
      }
    };

    // Try to initialize immediately if already loaded
    initializeLemonSqueezy();

    // Also set up a callback for when script loads
    if (typeof window.createLemonSqueezy === 'undefined') {
      window.createLemonSqueezy = () => {
        console.log("LemonSqueezy script has loaded");
        initializeLemonSqueezy();
      };
    }

    // Set up a fallback to check periodically
    const checkInterval = setInterval(() => {
      if (window.LemonSqueezy && typeof window.LemonSqueezy.initialize === 'function') {
        initializeLemonSqueezy();
        clearInterval(checkInterval);
      }
    }, 1000);

    // Clean up interval on unmount
    return () => clearInterval(checkInterval);
  }, []);
  
  // Handle LemonSqueezy checkout
  const handleLemonSqueezyCheckout = () => {
    if (!wizardData.email) {
      toast.error("Email is required for checkout");
      return;
    }
    
    try {
      console.log("Opening LemonSqueezy checkout with data:", wizardData);
      
      // Check if LemonSqueezy is available and properly initialized
      if (window.LemonSqueezy && typeof window.LemonSqueezy.open === 'function') {
        // Extract only the data we want to send (no file objects)
        const customData = {
          childName: wizardData.childName,
          childGender: wizardData.childGender,
          age: wizardData.age,
          theme: wizardData.theme,
          subject: wizardData.subject,
          message: wizardData.message,
          style: wizardData.style,
          customNote: wizardData.customNote || ""
        };
        
        // Open the checkout
        window.LemonSqueezy.open({
          variant: "d751df59-d810-4f21-8fd3-f1e6be65a994",
          embed: true,
          email: wizardData.email,
          custom: customData
        });
      } else {
        console.error("LemonSqueezy not properly initialized");
        toast.error("Checkout system not ready. Please try again in a moment.");
        
        // Try to initialize LemonSqueezy again
        if (window.LemonSqueezy && typeof window.LemonSqueezy.initialize === 'function') {
          window.LemonSqueezy.initialize();
        }
        
        // Fall back to traditional checkout method
        handleTraditionalCheckout();
      }
    } catch (error) {
      console.error("LemonSqueezy checkout error:", error);
      toast.error("Error opening checkout. Please try again.");
      
      // Fall back to traditional checkout as a last resort
      handleTraditionalCheckout();
    }
  };
  
  // Fallback traditional checkout method
  const handleTraditionalCheckout = () => {
    try {
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
      
      const checkoutUrl = `${baseUrl}?${params.toString()}`;
      
      // Create a temporary link and simulate click
      const checkoutLink = document.createElement('a');
      checkoutLink.href = checkoutUrl;
      checkoutLink.className = 'lemonsqueezy-button';
      checkoutLink.target = '_blank';
      checkoutLink.rel = 'noopener noreferrer';
      checkoutLink.style.display = 'none';
      document.body.appendChild(checkoutLink);
      checkoutLink.click();
      
      setTimeout(() => {
        document.body.removeChild(checkoutLink);
      }, 100);
      
      console.log("Opened traditional checkout URL:", checkoutUrl);
    } catch (fallbackError) {
      console.error("Even traditional checkout failed:", fallbackError);
      toast.error("We're experiencing technical difficulties. Please try again later.");
    }
  };

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
      
      {/* LemonSqueezy Buy Button */}
      <div className="wizard-footer text-center mt-8">
        <button 
          type="button" 
          className="inline-block w-full md:w-auto bg-persimmon hover:bg-persimmon/90 text-white font-medium py-3 px-6 rounded-lg transition-all"
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
