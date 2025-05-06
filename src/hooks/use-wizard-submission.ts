
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { WizardData } from "@/types/wizard";
import { useNavigate } from "react-router-dom";

export const useWizardSubmission = (
  getWizardData: () => WizardData, // Changed to a function that returns the latest state
  setWizardData: React.Dispatch<React.SetStateAction<WizardData>>,
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
  user: any
) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    // Get the latest state when the submit button is clicked
    const wizardData = getWizardData();
    
    // Add logging to check wizardData on submit
    console.log("wizardData on submit:", wizardData);
    
    // Improved validation with specific field names
    const requiredFields = [
      { key: "age", label: "Age" },
      { key: "theme", label: "Theme" },
      { key: "subject", label: "Subject" },
      { key: "message", label: "Message" },
      { key: "style", label: "Style" },
      { key: "email", label: "Email" },
      { key: "childName", label: "Child's Name" },
      { key: "childGender", label: "Child's Gender" },
    ];

    const missingFields = requiredFields
      .filter(field => !wizardData[field.key as keyof WizardData])
      .map(field => field.label);

    if (missingFields.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please fill out the following fields: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Upload files if needed
      let childPhotoUrl = null;
      if (wizardData.childPhotoFile) {
        const childPhotoPath = `uploads/children/${wizardData.childName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
        const { data: childPhotoData, error: childUploadError } = await supabase.storage
          .from("images")
          .upload(childPhotoPath, wizardData.childPhotoFile);

        if (childUploadError) {
          throw new Error(`Child photo upload failed: ${childUploadError.message}`);
        }

        childPhotoUrl = childPhotoPath;
      }

      // Insert storybook record with all required fields
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
          photo_url: childPhotoUrl, // Using the same photo for now, adjust if needed
          email: wizardData.email,
          moral: wizardData.moral || null,
          status: "draft", // Default status is draft
        })
        .select('*')  // Select all columns to avoid missing fields
        .single();

      if (storybookError) {
        throw new Error(`Storybook creation failed: ${storybookError.message}`);
      }

      if (!storybookData) {
        throw new Error('No data returned after storybook creation');
      }

      // Safely access the ID
      const storybookId = storybookData.id;
      if (!storybookId) {
        throw new Error('No storybook ID was returned');
      }

      // Upload and associate character photos
      for (const character of wizardData.characters) {
        if (!character.name || !character.relation || !character.gender) {
          console.warn("Skipping character with incomplete data:", character);
          continue;
        }

        let characterPhotoUrl = null;
        
        if (character.photoFile) {
          const characterPhotoPath = `uploads/characters/${character.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
          const { data: characterUploadData, error: characterUploadError } = await supabase.storage
            .from("images")
            .upload(characterPhotoPath, character.photoFile);

          if (characterUploadError) {
            console.error(`Character photo upload failed: ${characterUploadError.message}`);
            continue;
          }

          characterPhotoUrl = characterPhotoPath;
        }

        // Insert character record
        const { error: characterInsertError } = await supabase
          .from('characters')
          .insert({
            storybook_id: storybookId,
            name: character.name,
            relation: character.relation,
            gender: character.gender,
            photo_url: characterPhotoUrl
          });

        if (characterInsertError) {
          console.error(`Character insert failed: ${characterInsertError.message}`);
        }
      }

      // Success toast
      toast({
        title: "Story created successfully!",
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

      // Redirect based on login status
      if (user) {
        // If logged in, go to account page
        navigate("/account");
      } else {
        // If not logged in, go to signup page with storybook ID and email
        navigate(`/signup?storybook_id=${storybookId}&email=${encodeURIComponent(wizardData.email)}`);
      }
    } catch (err: any) {
      console.error("Order submission error:", err);
      setError(err.message);
      toast({
        title: "Story creation failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, error };
};
