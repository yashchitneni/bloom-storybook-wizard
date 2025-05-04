
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { WizardData } from "@/types/wizard";

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
    email: "",
    moral: "",
    specialDetails: "",
    childName: "",
    gender: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [themes, setThemes] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<{[theme: string]: string[]}>({});
  const [messages, setMessages] = useState<string[]>([]);
  const [styles, setStyles] = useState<string[]>([]);
  const [ageCategories, setAgeCategories] = useState<string[]>([]);
  const { user } = useAuth();
  
  const totalSteps = 7; // Updated to include child information step
  
  // Load lookup data from Supabase
  useEffect(() => {
    const fetchLookupData = async () => {
      try {
        console.log("Fetching data from Supabase...");
        // Fetch themes
        const { data: themesData, error: themesError } = await supabase
          .from('themes')
          .select('name');
        
        if (themesError) {
          console.error("Error fetching themes:", themesError);
          setThemes(['Adventure', 'Fantasy', 'Animals', 'Space', 'Ocean', 'Friendship']);
        } else if (themesData) {
          console.log("Themes data:", themesData);
          setThemes(themesData.map(t => t.name));
        }
        
        // Fetch subjects
        const { data: subjectsData, error: subjectsError } = await supabase
          .from('subjects')
          .select('theme, name');
          
        if (subjectsError) {
          console.error("Error fetching subjects:", subjectsError);
          setSubjects({
            'Adventure': ['Jungle Explorer', 'Mountain Climb', 'Desert Journey'],
            'Fantasy': ['Dragon Friends', 'Magic Kingdom', 'Fairy Garden'],
            'Animals': ['Zoo Visit', 'Farm Day', 'Forest Friends'],
            'Space': ['Rocket Ship', 'Moon Landing', 'Planet Travel'],
            'Ocean': ['Mermaid Tale', 'Pirate Adventure', 'Underwater Journey'],
            'Friendship': ['New Friend', 'Sharing Day', 'Helping Others']
          });
        } else if (subjectsData) {
          console.log("Subjects data:", subjectsData);
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
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('name');
          
        if (messagesError) {
          console.error("Error fetching messages:", messagesError);
          setMessages(['Kindness', 'Courage', 'Friendship', 'Honesty', 'Learning', 'Perseverance']);
        } else if (messagesData) {
          console.log("Messages data:", messagesData);
          setMessages(messagesData.map(m => m.name));
        }
        
        // Fetch styles
        const { data: stylesData, error: stylesError } = await supabase
          .from('styles')
          .select('name');
          
        if (stylesError) {
          console.error("Error fetching styles:", stylesError);
          setStyles(['Cartoon', 'Watercolor', 'Digital', 'Classic']);
        } else if (stylesData) {
          console.log("Styles data:", stylesData);
          setStyles(stylesData.map(s => s.name));
        }
        
        // Fetch age categories
        const { data: ageData, error: ageError } = await supabase
          .from('age_categories')
          .select('name');
          
        if (ageError) {
          console.error("Error fetching age categories:", ageError);
          setAgeCategories(['0-2', '3-5', '6-9']);
        } else if (ageData) {
          console.log("Age data:", ageData);
          setAgeCategories(ageData.map(a => a.name));
        }
      } catch (error) {
        console.error("Error fetching lookup data:", error);
        
        // Set fallback data if there's an error
        setThemes(['Adventure', 'Fantasy', 'Animals', 'Space', 'Ocean', 'Friendship']);
        setSubjects({
          'Adventure': ['Jungle Explorer', 'Mountain Climb', 'Desert Journey'],
          'Fantasy': ['Dragon Friends', 'Magic Kingdom', 'Fairy Garden'],
          'Animals': ['Zoo Visit', 'Farm Day', 'Forest Friends'],
          'Space': ['Rocket Ship', 'Moon Landing', 'Planet Travel'],
          'Ocean': ['Mermaid Tale', 'Pirate Adventure', 'Underwater Journey'],
          'Friendship': ['New Friend', 'Sharing Day', 'Helping Others']
        });
        setMessages(['Kindness', 'Courage', 'Friendship', 'Honesty', 'Learning', 'Perseverance']);
        setStyles(['Cartoon', 'Watercolor', 'Digital', 'Classic']);
        setAgeCategories(['0-2', '3-5', '6-9']);
      }
    };
    
    fetchLookupData();
  }, []);
  
  // If no data is loaded after 1.5 seconds, use fallbacks
  useEffect(() => {
    const timer = setTimeout(() => {
      if (themes.length === 0) {
        setThemes(['Adventure', 'Fantasy', 'Animals', 'Space', 'Ocean', 'Friendship']);
      }
      if (Object.keys(subjects).length === 0) {
        setSubjects({
          'Adventure': ['Jungle Explorer', 'Mountain Climb', 'Desert Journey'],
          'Fantasy': ['Dragon Friends', 'Magic Kingdom', 'Fairy Garden'],
          'Animals': ['Zoo Visit', 'Farm Day', 'Forest Friends'],
          'Space': ['Rocket Ship', 'Moon Landing', 'Planet Travel'],
          'Ocean': ['Mermaid Tale', 'Pirate Adventure', 'Underwater Journey'],
          'Friendship': ['New Friend', 'Sharing Day', 'Helping Others']
        });
      }
      if (messages.length === 0) {
        setMessages(['Kindness', 'Courage', 'Friendship', 'Honesty', 'Learning', 'Perseverance']);
      }
      if (styles.length === 0) {
        setStyles(['Cartoon', 'Watercolor', 'Digital', 'Classic']);
      }
      if (ageCategories.length === 0) {
        setAgeCategories(['0-2', '3-5', '6-9']);
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [themes, subjects, messages, styles, ageCategories]);
  
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
