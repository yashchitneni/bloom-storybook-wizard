
import { WizardData, Character } from "@/types/wizard";
import { v4 as uuidv4 } from 'uuid';

export interface UseWizardCharactersProps {
  wizardData: WizardData;
  setWizardData: React.Dispatch<React.SetStateAction<WizardData>>;
}

export const useWizardCharacters = ({ wizardData, setWizardData }: UseWizardCharactersProps) => {
  const handleAddCharacter = () => {
    const newCharacter: Character = {
      id: uuidv4(),
      name: "",
      relation: "",
      gender: "",
      photoFile: null,
      photoPreview: null
    };
    
    setWizardData({
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
            setWizardData(prev => ({
              ...prev,
              characters: prev.characters.map(c => 
                c.id === id ? {...c, photoPreview: e.target?.result as string} : c
              )
            }));
          };
          reader.readAsDataURL(value);
          
          return { ...character, [field]: value };
        }
        return { ...character, [field]: value };
      }
      return character;
    });
    
    setWizardData({
      ...wizardData,
      characters: updatedCharacters
    });
  };
  
  const handleRemoveCharacter = (id: string) => {
    setWizardData({
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
