
import { useState } from "react";
import { WizardData } from "@/types/wizard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { uploadFile } from "@/utils/storage-utils";

export const useWizardSubmission = (
  wizardData: WizardData,
  setWizardData: (data: WizardData) => void,
  setCurrentStep: (step: number) => void,
  user: User | null
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please sign in to create your storybook",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);

    try {
      let photoPath = null;
      
      // Upload photo if available using our new storage utility
      if (wizardData.photoFile) {
        photoPath = await uploadFile(wizardData.photoFile, {
          folder: "uploads",
          userId: user.id
        });
        
        if (!photoPath) {
          throw new Error("Failed to upload photo");
        }
      }
      
      // Create storybook entry using type assertion to bypass TypeScript errors
      // We need to cast the entire chain of methods to any
      const client = supabase as any;
      const { error: insertError } = await client
        .from('storybooks')
        .insert([{
          user_id: user.id,
          email: wizardData.email || user.email,
          child_name: "Child", // This should be collected from the user
          age_range: wizardData.age,
          theme: wizardData.theme,
          moral: wizardData.moral,
          style: wizardData.style,
          note: wizardData.specialDetails,
          photo_path: photoPath,
        }]);
        
      if (insertError) {
        throw new Error(`Error saving storybook: ${insertError.message}`);
      }
      
      toast({
        title: "Success!",
        description: "Your storybook has been submitted and is now being created.",
      });
      
      // Reset form after successful submission
      setWizardData({
        age: "",
        theme: "",
        moral: "",
        specialDetails: "",
        photoFile: null,
        photoPreview: null,
        style: "",
        email: user.email || ""
      });
      setCurrentStep(1);
    } catch (error: any) {
      console.error("Error creating storybook:", error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    setIsSubmitting,
    handleSubmit
  };
};
