
import React from 'react';
import { motion } from "framer-motion";
import CheckoutCard from '@/components/wizard/CheckoutCard';
import { toast } from 'sonner';
import { useWizardContext } from '@/contexts/WizardContext';
import { supabase } from '@/integrations/supabase/client';
import { loadStripe } from '@stripe/stripe-js';

interface CheckoutSectionProps {
  onSubmit: () => void;
  isActive: boolean;
}

// Initialize Stripe with the publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_your_fallback_key");

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
  
  // Handle Stripe checkout
  const handleStripeCheckout = async () => {
    if (!wizardData.email) {
      toast.error("Email is required for checkout");
      return;
    }
    
    try {
      console.log("Creating Stripe checkout session with data:", wizardData);
      
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
      
      // Call the Supabase Edge Function to create a checkout session
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          email: wizardData.email,
          customData: customData
        }
      });
      
      if (error) {
        console.error("Stripe checkout error:", error);
        toast.error("Error creating checkout: " + error.message);
        return;
      }
      
      if (data?.url) {
        console.log("Opening Stripe checkout URL:", data.url);
        
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        console.error("No checkout URL received from Stripe");
        toast.error("Error creating checkout session");
      }
    } catch (error) {
      console.error("Stripe checkout error:", error);
      toast.error("Error processing checkout. Please try again.");
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
      
      {/* Stripe Checkout Button */}
      <div className="wizard-footer text-center mt-8">
        <button 
          type="button" 
          className="inline-block w-full md:w-auto bg-persimmon hover:bg-persimmon/90 text-white font-medium py-3 px-6 rounded-lg transition-all"
          onClick={handleStripeCheckout}
          disabled={isSubmitting || !wizardData.email}
        >
          Create My Story — $7.99
        </button>
      </div>
    </motion.section>
  );
};

export default CheckoutSection;
