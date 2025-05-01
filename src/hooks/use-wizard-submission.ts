
import { useState } from "react";
import { WizardData } from "@/types/wizard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";

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
      
      // Upload photo if available
      if (wizardData.photoFile) {
        const fileExt = wizardData.photoFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('storybooks')
          .upload(filePath, wizardData.photoFile);
          
        if (uploadError) {
          throw new Error(`Error uploading image: ${uploadError.message}`);
        }
        
        photoPath = filePath;
      }
      
      // Create storybook entry using type assertion to bypass TypeScript errors
      // This works because we know our database has the storybooks table even if TypeScript doesn't
      const { error: insertError } = await (supabase
        .from('storybooks') as any)
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
