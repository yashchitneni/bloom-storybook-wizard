
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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

export const useWizardState = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({
    age: "",
    theme: "",
    subject: "",
    message: "",
    customNote: "",
    photoFile: null,
    photoPreview: null,
    style: "",
    email: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [themes, setThemes] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<{[theme: string]: string[]}>({});
  const [messages, setMessages] = useState<string[]>([]);
  const [styles, setStyles] = useState<string[]>([]);
  const [ageCategories, setAgeCategories] = useState<string[]>([]);
  const { user } = useAuth();
  
  const totalSteps = 8;
  
  // Load lookup data from Supabase
  useEffect(() => {
    const fetchLookupData = async () => {
      try {
        // Fetch themes
        const { data: themesData } = await supabase
          .from('themes')
          .select('name');
        
        if (themesData) {
          setThemes(themesData.map(t => t.name));
        }
        
        // Fetch subjects
        const { data: subjectsData } = await supabase
          .from('subjects')
          .select('theme, name');
          
        if (subjectsData) {
          const subjectsByTheme: {[theme: string]: string[]} = {};
          subjectsData.forEach(subject => {
            if (!subjectsByTheme[subject.theme]) {
              subjectsByTheme[subject.theme] = [];
            }
            subjectsByTheme[subject.theme].push(subject.name);
          });
          setSubjects(subjectsByTheme);
        }
        
        // Fetch messages
        const { data: messagesData } = await supabase
          .from('messages')
          .select('name');
          
        if (messagesData) {
          setMessages(messagesData.map(m => m.name));
        }
        
        // Fetch styles
        const { data: stylesData } = await supabase
          .from('styles')
          .select('name');
          
        if (stylesData) {
          setStyles(stylesData.map(s => s.name));
        }
        
        // Fetch age categories
        const { data: ageData } = await supabase
          .from('age_categories')
          .select('name');
          
        if (ageData) {
          setAgeCategories(ageData.map(a => a.name));
        }
      } catch (error) {
        console.error("Error fetching lookup data:", error);
      }
    };
    
    fetchLookupData();
  }, []);
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      // Scroll to top of wizard
      document.getElementById('wizard-container')?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Scroll to top of wizard
      document.getElementById('wizard-container')?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handleGoToStep = (step: number) => {
    if (step > 0 && step <= totalSteps && step <= currentStep + 1) {
      setCurrentStep(step);
      document.getElementById('wizard-container')?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handlePhotoUpload = (file: File) => {
    if (file.size === 0) {
      // User removed the photo
      setWizardData({
        ...wizardData,
        photoFile: null,
        photoPreview: null
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setWizardData({
        ...wizardData,
        photoFile: file,
        photoPreview: e.target?.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  // Pre-fill email from user if authenticated
  useEffect(() => {
    if (user?.email && !wizardData.email) {
      setWizardData(prev => ({
        ...prev,
        email: user.email || ""
      }));
    }
  }, [user]);

  return {
    currentStep,
    wizardData,
    setWizardData,
    isSubmitting,
    setIsSubmitting,
    totalSteps,
    handleNext,
    handlePrevious,
    handleGoToStep,
    handlePhotoUpload,
    themes,
    subjects,
    messages,
    styles,
    ageCategories,
    user
  };
};
