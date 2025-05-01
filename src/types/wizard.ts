
export interface WizardData {
  age: string;
  theme: string;
  moral: string;
  specialDetails: string;
  photoFile: File | null;
  photoPreview: string | null;
  style: string;
  email: string;
}

export interface AgeSelectionStepProps {
  onNext: () => void;
  onSelectAge: (age: string) => void;
  selectedAge: string;
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

export interface PhotoStyleStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onSelectStyle: (style: string) => void;
  selectedStyle: string;
  onPhotoUpload: (file: File) => void;
  photoPreview: string | null;
}

export interface CheckoutStepProps {
  onPrevious: () => void;
  selectedAge: string;
  selectedTheme: string;
  selectedMoral: string;
  selectedStyle: string;
  specialDetails: string;
  onEmailChange: (email: string) => void;
  email: string;
  onSubmit: () => void;
  isSubmitting: boolean;
}
