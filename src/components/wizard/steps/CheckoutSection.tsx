import React, { useEffect } from 'react';
import { motion } from "framer-motion";
import CheckoutCard from '@/components/wizard/CheckoutCard';
import { toast } from 'sonner';
import { useWizardContext } from '@/contexts/WizardContext';
import { supabase } from '@/integrations/supabase/client';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();
  
  // Auto-fill email if user is logged in and email is not already in wizardData
  useEffect(() => {
    if (user && user.email && !wizardData.email) {
      console.log("[CheckoutSection] User logged in, auto-filling email:", user.email);
      dispatch({ type: 'UPDATE_FIELD', field: 'email', value: user.email });
    }
  }, [user, wizardData.email, dispatch]);
  
  // Handle email changes
  const handleEmailChange = (email: string) => {
    // Prevent email change if user is logged in, or handle accordingly
    if (user && user.email) {
      console.warn("[CheckoutSection] Attempted to change email while logged in. This is usually not allowed or should log the user out.");
      // Optionally, you could allow it but it might complicate account linking.
      // For now, we assume the auto-filled email for a logged-in user is the one to use.
      // toast.info("Your account email is automatically used for checkout.");
      return; 
    }
    console.log("Email changed manually:", email);
    dispatch({ type: 'UPDATE_FIELD', field: 'email', value: email });
  };
  
  // Handle Stripe checkout
  const handleStripeCheckout = async () => {
    if (!wizardData.email) {
      toast.error("Email is required for checkout");
      return;
    }
    
    try {
      console.log("Preparing customData for Stripe. Full wizardData:", wizardData);
      
      const customData = {
        childName: wizardData.childName,
        childGender: wizardData.childGender,
        age: wizardData.age,
        theme: wizardData.theme,
        subject: wizardData.subject,
        message: wizardData.message,
        style: wizardData.style,
        customNote: wizardData.customNote || "",
        childPhotoUrl: wizardData.childPhotoUrl || null,
        // If user is logged in, pass their ID to be potentially stored directly
        // This can simplify backend association if the webhook has access to user_id directly from metadata
        userId: user ? user.id : null 
      };
      
      console.log("Sending this customData to stripe-checkout function:", customData);

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
        console.log("Redirecting to Stripe checkout URL:", data.url);
        
        // Redirect to Stripe Checkout in top level window to avoid iframe issues
        window.top.location.href = data.url;
      } else {
        console.error("No checkout URL received from Stripe");
        toast.error("Error creating checkout session");
      }
    } catch (error) {
      console.error("Stripe checkout error:", error);
      
      // Check if error might be due to ad blocker or network issues
      if (error instanceof Error && error.message.includes("net::ERR_BLOCKED_BY_CLIENT")) {
        toast.error("It seems your ad blocker is preventing Stripe from loading. Please disable it and try again.");
      } else {
        toast.error("Error processing checkout. Please try again.");
      }
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
        isUserLoggedIn={!!user}
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
