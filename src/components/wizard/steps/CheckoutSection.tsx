import React, { useEffect } from 'react';
import { motion } from "framer-motion";
import CheckoutCard from '@/components/wizard/CheckoutCard';
import { toast } from 'sonner';
import { useWizardContext } from '@/contexts/WizardContext';
import { supabase } from '@/integrations/supabase/client';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '@/contexts/AuthContext';
import { Character } from '@/types/wizard';
import { useWizardCharacters } from '@/hooks/wizard/use-wizard-characters';
import { useWizardPhotoUpload } from '@/hooks/wizard/use-wizard-photo-upload';

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
  const { state: wizardData, dispatch, isSubmitting, setIsSubmitting } = useWizardContext();
  const { user } = useAuth();
  const { isUploadingCharacterPhoto } = useWizardCharacters({ dispatch });
  const { isUploading: isChildPhotoUploading } = useWizardPhotoUpload();
  
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

  const validateCharacters = (characters: Character[]): string | null => {
    for (const character of characters) {
      if (!character.name) return `Character "${character.id}" needs a name.`;
      if (!character.relation) return `Character "${character.name || character.id}" needs a relation.`;
      if (!character.gender) return `Character "${character.name || character.id}" needs a gender.`;
      if (!character.photoUrl) {
        if (isUploadingCharacterPhoto[character.id]) {
          return `Photo for character "${character.name || character.id}" is still uploading. Please wait.`;
        }
        return `Character "${character.name || character.id}" needs a photo. Please upload one.`;
      }
    }
    return null;
  };
  
  // Handle Stripe checkout
  const handleStripeCheckout = async () => {
    if (!wizardData.email) {
      toast.error("Email is required for checkout");
      return;
    }

    // Validate main child photo
    if (!wizardData.childPhotoUrl) {
      if (isChildPhotoUploading) {
        toast.error("Main child\'s photo is still uploading. Please wait.");
      } else {
        toast.error("Main child\'s photo is missing. Please upload one.");
      }
      return;
    }

    const characterValidationError = validateCharacters(wizardData.characters);
    if (characterValidationError) {
      toast.error(characterValidationError);
      return;
    }
    
    setIsSubmitting(true);

    let stripeSessionId: string | null = null;
    let storybookRecordId: string | null = null;

    try {
      // 1. Create Stripe Checkout Session FIRST to get the session ID
      console.log("[CheckoutSection] Step 1: Creating Stripe Checkout Session (with minimal metadata)");
      const minimalCustomData = {
        childName: wizardData.childName, // Keep some basic info for quick reference if needed
        userId: user ? user.id : null,
        // Add any other absolutely essential, short, non-character related metadata if necessary
      };
      const { data: stripeSessionData, error: stripeSessionError } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          email: wizardData.email,
          customData: minimalCustomData // Send minimal data
        }
      });

      if (stripeSessionError) {
        toast.error("Error creating Stripe session: " + stripeSessionError.message);
        console.error("[CheckoutSection] Stripe session creation error:", stripeSessionError);
        setIsSubmitting(false);
        return;
      }

      if (!stripeSessionData?.sessionId || !stripeSessionData?.url) {
        toast.error("Failed to get Stripe session details.");
        console.error("[CheckoutSection] Missing sessionId or URL from stripe-checkout function");
        setIsSubmitting(false);
        return;
      }
      stripeSessionId = stripeSessionData.sessionId;
      const stripeUrl = stripeSessionData.url;
      console.log(`[CheckoutSection] Stripe session created: ${stripeSessionId}`);

      // 2. Save Storybook to DB, now WITH the stripe_session_id
      console.log("[CheckoutSection] Step 2: Saving storybook to DB with Stripe Session ID");
      const storybookPayload = {
        author_id: user?.id || null,
        age_category: wizardData.age,
        theme: wizardData.theme,
        subject: wizardData.subject,
        message: wizardData.message,
        custom_note: wizardData.customNote || null,
        style: wizardData.style,
        child_name: wizardData.childName,
        child_gender: wizardData.childGender,
        child_photo_url: wizardData.childPhotoUrl, // Already uploaded and URL in wizardData
        // photo_url: wizardData.photoUrl, // If you have a main story photo distinct from child photo
        email: wizardData.email,
        moral: wizardData.moral || null,
        status: "pending_payment", // Or a similar status indicating checkout has started
        stripe_session_id: stripeSessionId, // Save the Stripe session ID
      };
      console.log("[CheckoutSection] Storybook payload about to be inserted:", JSON.stringify(storybookPayload, null, 2));
      const { data: sbData, error: sbError } = await supabase
        .from("storybooks")
        .insert(storybookPayload)
        .select()
        .single();

      if (sbError) {
        toast.error("Error saving story details: " + sbError.message);
        console.error("[CheckoutSection] Storybook insert error:", sbError);
        setIsSubmitting(false);
        return;
      }
      storybookRecordId = sbData.id;
      console.log(`[CheckoutSection] Storybook saved with ID: ${storybookRecordId}`);

      // 3. Save Characters to DB, linked to the storybookRecordId
      console.log("[CheckoutSection] Step 3: Saving characters to DB");
      if (wizardData.characters && wizardData.characters.length > 0) {
        const characterPayloads = wizardData.characters.map(char => ({
          storybook_id: storybookRecordId,
          name: char.name,
          relation: char.relation,
          gender: char.gender,
          photo_url: char.photoUrl, // Assumes photoUrl is populated by useWizardCharacters
          is_main: false, // Default
        }));
        const { error: charError } = await supabase.from("characters").insert(characterPayloads);
        if (charError) {
          toast.error("Error saving character details: " + charError.message);
          console.error("[CheckoutSection] Character insert error:", charError);
          setIsSubmitting(false);
          return;
        }
        console.log(`[CheckoutSection] ${wizardData.characters.length} characters saved.`);
      }
      
      // 4. Redirect to Stripe for payment
      console.log("[CheckoutSection] Step 4: Redirecting to Stripe URL:", stripeUrl);
      // Before redirecting, clear wizard state as it's now persisted for this pending order.
      dispatch({ type: 'RESET_WIZARD' });
      localStorage.removeItem('wizardData'); // Ensure it's fully cleared

      window.top.location.href = stripeUrl;

    } catch (error) {
      console.error("[CheckoutSection] General error in handleStripeCheckout:", error);
      toast.error("An unexpected error occurred during checkout. Please try again.");
      setIsSubmitting(false);
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
          disabled={isSubmitting || !wizardData.email || !wizardData.childPhotoUrl || isChildPhotoUploading || !!validateCharacters(wizardData.characters) || wizardData.characters.some(c => isUploadingCharacterPhoto[c.id])}
        >
          Create My Story — $7.99
        </button>
      </div>
    </motion.section>
  );
};

export default CheckoutSection;
