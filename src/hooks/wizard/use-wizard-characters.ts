
import { v4 as uuidv4 } from 'uuid';
import { Character, WizardData } from '@/types/wizard';
import { useWizardContext } from '@/contexts/WizardContext';

interface UseWizardCharactersProps {
  wizardData: WizardData;
  updateWizardData: (data: WizardData) => void;
}

export const useWizardCharacters = ({ wizardData, updateWizardData }: UseWizardCharactersProps) => {
  const handleAddCharacter = () => {
    const newCharacter: Character = {
      id: uuidv4(),
      name: "",
      relation: "",
      gender: "",
      photoFile: null,
      photoPreview: null
    };
    
    updateWizardData({
      ...wizardData,
      characters: [...wizardData.characters, newCharacter]
    });
  };
  
  const handleUpdateCharacter = (id: string, field: string, value: any) => {
    const updatedCharacters = wizardData.characters.map(character => {
      if (character.id === id) {
        if (field === "photoFile" && value instanceof File && value.size > 0) {
          // Handle photo file upload
          const reader = new FileReader();
          reader.onload = (e) => {
            const charactersWithUpdatedPhoto = wizardData.characters.map(c => 
              c.id === id ? {...c, photoPreview: e.target?.result as string} : c
            );
            
            updateWizardData({
              ...wizardData,
              characters: charactersWithUpdatedPhoto
            });
          };
          reader.readAsDataURL(value);
          
          return { ...character, [field]: value };
        }
        return { ...character, [field]: value };
      }
      return character;
    });
    
    updateWizardData({
      ...wizardData,
      characters: updatedCharacters
    });
  };
  
  const handleRemoveCharacter = (id: string) => {
    updateWizardData({
      ...wizardData,
      characters: wizardData.characters.filter(character => character.id !== id)
    });
  };

  return {
    handleAddCharacter,
    handleUpdateCharacter,
    handleRemoveCharacter
  };
};
