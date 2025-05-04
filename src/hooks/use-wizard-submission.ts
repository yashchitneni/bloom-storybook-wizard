
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { WizardData } from "@/types/wizard";
import { useNavigate } from "react-router-dom";

export const useWizardSubmission = (
  wizardData: WizardData,
  setWizardData: React.Dispatch<React.SetStateAction<WizardData>>,
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
  user: any
) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    // Validation
    if (!wizardData.email) {
      toast({
        title: "Email required",
        description: "Please enter your email to place your order.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Upload files if needed
      let childPhotoUrl = null;
      if (wizardData.childPhotoFile) {
        const childPhotoPath = `children/${wizardData.childName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
        const { data: childPhotoData, error: childUploadError } = await supabase.storage
          .from("uploads")
          .upload(childPhotoPath, wizardData.childPhotoFile);

        if (childUploadError) {
          throw new Error(`Child photo upload failed: ${childUploadError.message}`);
        }

        childPhotoUrl = childPhotoPath;
      }

      // Insert storybook record
      const { data: storybookData, error: storybookError } = await supabase
        .from("storybooks")
        .insert({
          author_id: user?.id || null,
          age_category: wizardData.age,
          theme: wizardData.theme,
          subject: wizardData.subject,
          message: wizardData.message,
          custom_note: wizardData.customNote || null,
          style: wizardData.style,
          child_name: wizardData.childName,
          child_gender: wizardData.childGender,
          child_photo_url: childPhotoUrl,
        })
        .select()
        .single();

      if (storybookError) {
        throw new Error(`Storybook creation failed: ${storybookError.message}`);
      }

      const storybookId = storybookData.id;

      // Upload and associate character photos
      for (const character of wizardData.characters) {
        if (!character.name || !character.relation || !character.gender) {
          console.warn("Skipping character with incomplete data:", character);
          continue;
        }

        let characterPhotoUrl = null;
        
        if (character.photoFile) {
          const characterPhotoPath = `characters/${character.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
          const { data: characterUploadData, error: characterUploadError } = await supabase.storage
            .from("uploads")
            .upload(characterPhotoPath, character.photoFile);

          if (characterUploadError) {
            console.error(`Character photo upload failed: ${characterUploadError.message}`);
            continue;
          }

          characterPhotoUrl = characterPhotoPath;
        }

        // Fixed: Explicitly type the parameters as a record to match what the RPC function expects
        const { error: characterInsertError } = await supabase.rpc(
          'insert_character',
          {
            p_storybook_id: storybookId,
            p_name: character.name,
            p_relation: character.relation,
            p_gender: character.gender,
            p_photo_url: characterPhotoUrl
          } as Record<string, any>
        );

        if (characterInsertError) {
          console.error(`Character insert failed: ${characterInsertError.message}`);
        }
      }

      // Success toast
      toast({
        title: "Order submitted successfully!",
        description: "We'll start creating your personalized storybook right away.",
      });

      // Reset wizard data
      setWizardData({
        age: "",
        theme: "",
        subject: "",
        message: "",
        customNote: "",
        photoFile: null,
        photoPreview: null,
        style: "",
        email: "",
        moral: "",
        specialDetails: "",
        childName: "",
        childGender: "",
        childPhotoFile: null,
        childPhotoPreview: null,
        characters: []
      });

      // Navigate to success/thank you page or account page
      navigate("/account");
    } catch (err: any) {
      console.error("Order submission error:", err);
      setError(err.message);
      toast({
        title: "Order submission failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, error };
};
