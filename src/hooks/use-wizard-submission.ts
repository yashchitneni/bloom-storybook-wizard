
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
  const [submissionState, setSubmissionState] = useState<boolean>(false);

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

    // Validate child profile
    if (!wizardData.childName || !wizardData.childGender || !wizardData.childPhotoFile) {
      toast({
        title: "Missing information",
        description: "Please complete the child profile before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmissionState(true);

    try {
      // Upload child photo
      let childPhotoPath = null;
      if (wizardData.childPhotoFile) {
        childPhotoPath = await uploadFile(wizardData.childPhotoFile, {
          folder: "uploads/children",
          userId: user.id
        });
        
        if (!childPhotoPath) {
          throw new Error("Failed to upload child photo");
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
          moral: wizardData.moral,
          special_details: wizardData.specialDetails,
          style: wizardData.style,
          child_name: wizardData.childName,
          child_gender: wizardData.childGender,
          child_photo_url: childPhotoPath
        })
        .select()
        .single();
        
      if (insertError) {
        throw new Error(`Error saving storybook: ${insertError.message}`);
      }
      
      // Insert additional characters if any
      if (wizardData.characters.length > 0) {
        const charactersToInsert = [];
        
        for (const character of wizardData.characters) {
          // Skip characters without name or relation
          if (!character.name || !character.relation) continue;
          
          let photoUrl = null;
          // Upload character photo if available
          if (character.photoFile) {
            photoUrl = await uploadFile(character.photoFile, {
              folder: `uploads/characters/${storybook.id}`,
              userId: user.id
            });
          }
          
          charactersToInsert.push({
            storybook_id: storybook.id,
            name: character.name,
            relation: character.relation,
            gender: character.gender || 'Other',
            photo_url: photoUrl
          });
        }
        
        if (charactersToInsert.length > 0) {
          const { error: charactersError } = await supabase
            .from('characters')
            .insert(charactersToInsert);
            
          if (charactersError) {
            console.error("Error saving characters:", charactersError);
            // Continue anyway as this is not critical
          }
        }
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
      setSubmissionState(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting: submissionState
  };
};
