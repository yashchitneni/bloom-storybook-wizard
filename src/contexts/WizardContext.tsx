import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { WizardData } from '@/types/wizard';
import { toast } from '@/components/ui/use-toast';

// Initial state for the wizard
const initialWizardState: WizardData = {
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
};

// Action types
type WizardAction = 
  | { type: 'UPDATE_FIELD'; field: keyof WizardData; value: any }
  | { type: 'ADD_CHARACTER'; character: any }
  | { type: 'UPDATE_CHARACTER'; id: string; field: string; value: any }
  | { type: 'REMOVE_CHARACTER'; id: string }
  | { type: 'RESET_WIZARD' };

// Reducer function
const wizardReducer = (state: WizardData, action: WizardAction): WizardData => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.field]: action.value
      };
    case 'ADD_CHARACTER':
      return {
        ...state,
        characters: [...state.characters, action.character]
      };
    case 'UPDATE_CHARACTER':
      return {
        ...state,
        characters: state.characters.map(character => 
          character.id === action.id 
            ? { ...character, [action.field]: action.value } 
            : character
        )
      };
    case 'REMOVE_CHARACTER':
      return {
        ...state,
        characters: state.characters.filter(character => character.id !== action.id)
      };
    case 'RESET_WIZARD':
      return initialWizardState;
    default:
      return state;
  }
};

// Define context
type WizardContextType = {
  state: WizardData;
  dispatch: React.Dispatch<WizardAction>;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

// Provider component
export const WizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state from localStorage
  const loadStateFromStorage = (): WizardData => {
    try {
      const savedState = localStorage.getItem('wizardData');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // Reset file objects and previews that can't/shouldn't be stored in localStorage
        return {
          ...parsedState,
          photoFile: null,
          photoPreview: null, // Ensure preview is not loaded
          childPhotoFile: null,
          childPhotoPreview: null, // Ensure preview is not loaded
          characters: parsedState.characters?.map((character: any) => ({
            ...character,
            photoFile: null,
            photoPreview: null // Ensure preview is not loaded for characters
          })) || []
        };
      }
    } catch (error) {
      console.error('Error loading wizard state from localStorage:', error);
    }
    return initialWizardState;
  };

  // Initialize reducer with persisted state if available
  const [state, dispatch] = useReducer(wizardReducer, loadStateFromStorage());
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      // Create a copy without file objects and previews which can't/shouldn't be serialized
      const stateToSave = {
        ...state,
        photoFile: null,
        photoPreview: null, // Do not save photo preview
        childPhotoFile: null,
        childPhotoPreview: null, // Do not save child photo preview
        characters: state.characters.map(character => ({
          ...character,
          photoFile: null,
          photoPreview: null // Do not save character photo preview
        }))
      };
      localStorage.setItem('wizardData', JSON.stringify(stateToSave));
      console.log('Wizard state successfully saved to localStorage (without previews)');
    } catch (error) {
      // This catch block will now handle errors if stringifying stateToSave (after nulling previews) still fails
      // though it's less likely now.
      console.error('Error saving wizard state to localStorage:', error);
      // Potentially dispatch an action or show a global error to the user if this critical save fails
      toast({
        title: "Save Error",
        description: "Could not save your progress. Local storage might be full or corrupted.",
        variant: "destructive"
      });
    }
  }, [state]);

  return (
    <WizardContext.Provider value={{ state, dispatch, isSubmitting, setIsSubmitting }}>
      {children}
    </WizardContext.Provider>
  );
};

// Custom hook to use the wizard context
export const useWizardContext = () => {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizardContext must be used within a WizardProvider');
  }
  return context;
};
