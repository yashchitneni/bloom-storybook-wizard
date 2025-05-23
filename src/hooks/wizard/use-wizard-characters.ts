import { v4 as uuidv4 } from 'uuid';
import { Character, WizardData } from '@/types/wizard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useState, Dispatch } from 'react';

// Define the shape of the actions our reducer can handle
type WizardAction = 
  | { type: 'UPDATE_FIELD'; field: keyof WizardData; value: any }
  | { type: 'ADD_CHARACTER'; character: Character } // Ensure this matches reducer
  | { type: 'UPDATE_CHARACTER'; id: string; field: string; value: any } // Ensure this matches reducer
  | { type: 'REMOVE_CHARACTER'; id: string } // Ensure this matches reducer
  | { type: 'UPDATE_CHARACTER_PHOTO_URL'; id: string; photoUrl: string | null; photoFile?: File | null; photoPreview?: string | null }
  | { type: 'UPDATE_CHARACTER_PREVIEW'; id: string; photoPreview: string | null; photoFile: File | null };

interface UseWizardCharactersProps {
  // wizardData: WizardData; // Not needed if dispatching actions that reducer handles
  dispatch: Dispatch<WizardAction>;
}

export const useWizardCharacters = ({ dispatch }: UseWizardCharactersProps) => {
  const [isUploadingCharacterPhoto, setIsUploadingCharacterPhoto] = useState<Record<string, boolean>>({});

  const handleAddCharacter = () => {
    const newCharacter: Character = {
      id: uuidv4(),
      name: "",
      relation: "",
      gender: "",
      photoFile: null,
      photoPreview: null,
      photoUrl: null,
    };
    dispatch({ type: 'ADD_CHARACTER', character: newCharacter });
  };
  
  const handleCharacterPhotoUpload = async (characterId: string, file: File | null) => {
    if (!file) { // Handle photo removal
      dispatch({ 
        type: 'UPDATE_CHARACTER_PHOTO_URL', 
        id: characterId, 
        photoUrl: null, 
        photoFile: null, 
        photoPreview: null 
      });
      return;
    }

    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a JPG or PNG image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File is too large. Maximum size is 5MB.');
      return;
    }

    setIsUploadingCharacterPhoto(prev => ({ ...prev, [characterId]: true }));
    toast.info(`Uploading photo for character...`);

    const reader = new FileReader();
    reader.onloadend = () => {
      dispatch({ 
        type: 'UPDATE_CHARACTER_PREVIEW', 
        id: characterId, 
        photoPreview: reader.result as string, 
        photoFile: file 
      });
    };
    reader.readAsDataURL(file);

    try {
      const fileName = `character-${characterId}-${Date.now()}-${file.name}`;
      const filePath = `user-uploads/characters/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        console.error('Error uploading character photo:', uploadError);
        toast.error(`Photo upload failed: ${uploadError.message}`);
        // Rollback: Clear URL and File, keep preview for re-attempt or let user remove
        dispatch({ type: 'UPDATE_CHARACTER_PHOTO_URL', id: characterId, photoUrl: null, photoFile: null });
        return;
      }

      const { data: urlData } = supabase.storage.from('images').getPublicUrl(filePath);
      dispatch({ 
        type: 'UPDATE_CHARACTER_PHOTO_URL', 
        id: characterId, 
        photoUrl: urlData.publicUrl, 
        photoFile: file // Keep file in case it's needed, or can be set to null
      });
      toast.success('Character photo uploaded successfully!');
    } catch (error: any) {
      console.error('An unexpected error occurred during character photo upload:', error);
      toast.error(`An unexpected error occurred: ${error.message || 'Unknown error'}`);
      // Rollback all photo fields on unexpected error
      dispatch({ 
        type: 'UPDATE_CHARACTER_PHOTO_URL', 
        id: characterId, 
        photoUrl: null, 
        photoFile: null, 
        photoPreview: null 
      });
    } finally {
      setIsUploadingCharacterPhoto(prev => ({ ...prev, [characterId]: false }));
    }
  };
  
  const handleUpdateCharacter = (id: string, field: string, value: any) => {
    if (field === "photoFile") {
      handleCharacterPhotoUpload(id, value instanceof File && value.size > 0 ? value : null);
      return; 
    }
    dispatch({ type: 'UPDATE_CHARACTER', id, field, value });
  };
  
  const handleRemoveCharacter = (id: string) => {
    dispatch({ type: 'REMOVE_CHARACTER', id });
  };

  return {
    handleAddCharacter,
    handleUpdateCharacter,
    handleRemoveCharacter,
    handleCharacterPhotoUpload,
    isUploadingCharacterPhoto,
  };
};
