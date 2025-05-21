import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { WizardData, Character } from "@/types/wizard";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

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
    
    // New child profile fields
    childName: "",
    childGender: "",
    childPhotoFile: null,
    childPhotoPreview: null,
    
    // Characters
    characters: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [themes, setThemes] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<{[theme: string]: string[]}>({});
  const [messages, setMessages] = useState<string[]>([]);
  const [styles, setStyles] = useState<string[]>([]);
  const [ageCategories, setAgeCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  // Updated totalSteps to include the new split steps
  const totalSteps = 9;
  
  // Load lookup data from Supabase
  useEffect(() => {
    const fetchLookupData = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching data from Supabase...");
        
        // Fetch themes
        const { data: themesData, error: themesError } = await supabase
          .from('themes')
          .select('name');
        
        if (themesError) {
          console.error("Error fetching themes:", themesError);
          toast({
            title: "Error loading themes",
            description: "Could not load theme options. Please try again.",
            variant: "destructive",
          });
        }
        
        if (themesData) {
          setThemes(themesData.map(t => t.name));
        }
        
        // Fetch subjects
        const { data: subjectsData, error: subjectsError } = await supabase
          .from('subjects')
          .select('theme, name');
          
        if (subjectsError) {
          console.error("Error fetching subjects:", subjectsError);
          toast({
            title: "Error loading subjects",
            description: "Could not load subject options. Please try again.",
            variant: "destructive",
          });
        }
        
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
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('name');
          
        if (messagesError) {
          console.error("Error fetching messages:", messagesError);
          toast({
            title: "Error loading messages",
            description: "Could not load message options. Please try again.",
            variant: "destructive",
          });
        }
        
        if (messagesData) {
          setMessages(messagesData.map(m => m.name));
        }
        
        // Fetch styles
        const { data: stylesData, error: stylesError } = await supabase
          .from('styles')
          .select('name');
        if (stylesError) {
          console.error("Error fetching styles:", stylesError);
          toast({
            title: "Error loading styles",
            description: "Could not load style options. Please try again.",
            variant: "destructive",
          });
        }
        if (stylesData) {
          setStyles(stylesData.map(s => s.name));
        }
        
        // Fetch age categories
        const { data: ageData, error: ageError } = await supabase
          .from('age_categories')
          .select('name');
          
        if (ageError) {
          console.error("Error fetching age categories:", ageError);
          toast({
            title: "Error loading age categories",
            description: "Could not load age category options. Please try again.",
            variant: "destructive",
          });
        }
        
        if (ageData) {
          setAgeCategories(ageData.map(a => a.name));
        }

        // Log data for debugging
        console.log("Fetched data:", {
          themes: themesData?.map(t => t.name) || [],
          subjects: subjectsData?.length || 0,
          messages: messagesData?.map(m => m.name) || [],
          styles: styles,
          ageCategories: ageData?.map(a => a.name) || []
        });

      } catch (error) {
        console.error("Error fetching lookup data:", error);
        toast({
          title: "Error loading wizard data",
          description: "There was a problem loading the wizard data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
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
  
  const handleChildPhotoUpload = (file: File) => {
    if (file.size === 0) {
      // User removed the photo
      setWizardData({
        ...wizardData,
        childPhotoFile: null,
        childPhotoPreview: null
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setWizardData({
        ...wizardData,
        childPhotoFile: file,
        childPhotoPreview: e.target?.result as string
      });
    };
    reader.readAsDataURL(file);
  };
  
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
    handleChildPhotoUpload,
    handleAddCharacter,
    handleUpdateCharacter,
    handleRemoveCharacter,
    themes,
    subjects,
    messages,
    styles,
    ageCategories,
    user,
    isLoading
  };
};
