export interface WizardData {
  age: string;
  theme: string;
  subject: string;
  message: string;
  customNote: string;
  photoFile: File | null;
  photoPreview: string | null;
  style: string;
  email: string;
  moral?: string;
  specialDetails?: string;
  
  // Child profile fields
  childName: string;
  childGender: string;
  childPhotoFile: File | null;
  childPhotoPreview: string | null;
  
  // Additional characters
  characters: Character[];
}

export interface Character {
  id: string;
  name: string;
  relation: string;
  gender: string;
  photoFile: File | null;
  photoPreview: string | null;
}

export interface Storybook {
  id: string;
  author_id: string | null;
  theme: string;
  subject: string;
  message: string;
  custom_note: string | null;
  age_category: string;
  style: string;
  child_name: string;
  child_gender: string;
  child_photo_url: string | null;
  status: string;
  pdf_url: string | null;
  photo_url: string | null;
  created_at: string;
  moral?: string;
}

export interface AgeSelectionStepProps {
  onNext: () => void;
  onSelectAge: (age: string) => void;
  selectedAge: string;
  ageCategories: string[];
}

export interface ThemeSelectionStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onSelectTheme: (theme: string) => void;
  selectedTheme: string;
  themes: string[];
}

export interface StorySparkStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onSelectTheme: (theme: string) => void;
  onSelectMoral: (moral: string) => void;
  onSpecialDetailsChange: (details: string) => void;
  selectedTheme: string;
  selectedMoral: string;
  specialDetails: string;
}

export interface SubjectSelectionStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onSelectSubject: (subject: string) => void;
  selectedTheme: string;
  selectedSubject: string;
  subjects: string[];
}

export interface MessageSelectionStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onSelectMessage: (message: string) => void;
  selectedMessage: string;
  messages: string[];
}

export interface CustomNoteStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onCustomNoteChange: (note: string) => void;
  customNote: string;
}

export interface PhotoStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onPhotoUpload: (file: File) => void;
  photoPreview: string | null;
}

export interface StyleSelectionStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onSelectStyle: (style: string) => void;
  selectedStyle: string;
  styles: string[];
}

export interface PhotoStyleStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onSelectStyle: (style: string) => void;
  selectedStyle: string;
  onPhotoUpload: (file: File) => void;
  photoPreview: string | null;
  styles: string[];
}

export interface PreviewStepProps {
  onNext: () => void;
  onPrevious: () => void;
  wizardData: WizardData;
}

export interface CheckoutStepProps {
  onPrevious: () => void;
  wizardData: WizardData;
  onEmailChange: (email: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export interface ChildProfileCardProps {
  onChildNameChange: (name: string) => void;
  onChildGenderChange: (gender: string) => void;
  onChildPhotoUpload: (file: File) => void;
  childName: string;
  childGender: string;
  childPhotoPreview: string | null;
  isActive: boolean;
}

export interface CharactersCardProps {
  characters: Character[];
  onAddCharacter: () => void;
  onUpdateCharacter: (id: string, field: string, value: any) => void;
  onRemoveCharacter: (id: string) => void;
  isActive: boolean;
  maxCharacters?: number;
}
