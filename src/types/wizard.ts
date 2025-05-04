
export interface WizardData {
  age: string;
  theme: string;
  subject: string;
  message: string;
  customNote?: string;
  photoFile?: File | null;
  photoPreview?: string | null;
  style: string;
  email?: string;
  moral?: string;
  specialDetails?: string;
  childName?: string;
  gender?: string;
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

export interface PhotoStyleSelectionStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onSelectStyle: (style: string) => void;
  onPhotoUpload: (file: File) => void;
  selectedStyle: string;
  photoPreview: string | null;
  styles: string[];
}

export interface CustomNoteStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onCustomNoteChange: (note: string) => void;
  customNote: string;
}

export interface ChildInfoStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onChildInfoChange: (info: { name: string; gender: string; photo?: File }) => void;
  onPhotoUpload: (file: File) => void;
  childName: string;
  gender: string;
  photoPreview: string | null;
}

export interface CheckoutStepProps {
  onSubmit: () => void;
  onPrevious: () => void;
  onEmailChange: (email: string) => void;
  wizardData: WizardData;
  isSubmitting: boolean;
}

export interface PreviewStepProps {
  onNext: () => void;
  onPrevious: () => void;
  wizardData: WizardData;
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
