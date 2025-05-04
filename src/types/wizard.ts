
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
