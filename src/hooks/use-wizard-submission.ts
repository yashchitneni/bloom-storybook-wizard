
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
  setIsSubmitting: (isSubmitting: boolean) => void,
  user: User | null
) => {
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
      
      // Upload photo if available
      if (wizardData.photoFile) {
        photoPath = await uploadFile(wizardData.photoFile, {
          folder: "uploads",
          userId: user.id
        });
        
        if (!photoPath) {
          throw new Error("Failed to upload photo");
        }
      }
      
      // Check if we have a profile for this user
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();
      
      // If no profile exists, create one
      if (profileError && profileError.code === 'PGRST116') {
        const { error: insertProfileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: wizardData.email || user.email
          });
          
        if (insertProfileError) {
          throw new Error(`Error creating profile: ${insertProfileError.message}`);
        }
      }
      
      // Create storybook entry
      const { data: storybook, error: insertError } = await supabase
        .from('storybooks')
        .insert({
          author_id: user.id,
          age_category: wizardData.age,
          theme: wizardData.theme,
          subject: wizardData.subject,
          message: wizardData.message,
          custom_note: wizardData.customNote,
          style: wizardData.style,
          photo_url: photoPath,
        })
        .select()
        .single();
        
      if (insertError) {
        throw new Error(`Error saving storybook: ${insertError.message}`);
      }
      
      toast({
        title: "Success!",
        description: "Your storybook has been submitted and is now being generated.",
      });
      
      // Navigate to the storybook page
      navigate(`/story/${storybook.id}`);
      
    } catch (error: any) {
      console.error("Error creating storybook:", error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit
  };
};
