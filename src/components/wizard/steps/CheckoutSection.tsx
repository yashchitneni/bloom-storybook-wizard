
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
  
  // Handle LemonSqueezy checkout
  const handleLemonSqueezyCheckout = () => {
    if (!wizardData.email) {
      toast.error("Email is required for checkout");
      return;
    }
    
    try {
      console.log("Opening LemonSqueezy checkout with data:", wizardData);
      
      // Check if LemonSqueezy is available
      if (window.LemonSqueezy) {
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
        
        // Use the open method
        window.LemonSqueezy.open({
          variant: "d751df59-d810-4f21-8fd3-f1e6be65a994",
          embed: true,
          email: wizardData.email,
          custom: customData
        });
      } else {
        console.error("LemonSqueezy not available");
        toast.error("Checkout system not initialized. Please refresh and try again.");
        
        // Fallback to old method if LemonSqueezy.open is not available
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
        const checkoutLink = document.createElement('a');
        checkoutLink.href = checkoutUrl;
        checkoutLink.className = 'lemonsqueezy-button';
        checkoutLink.style.display = 'none';
        document.body.appendChild(checkoutLink);
        checkoutLink.click();
        
        setTimeout(() => {
          document.body.removeChild(checkoutLink);
        }, 100);
      }
    } catch (error) {
      console.error("LemonSqueezy checkout error:", error);
      toast.error("Error opening checkout. Please try again.");
    }
  };

  useEffect(() => {
    // Check LemonSqueezy initialization status
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
