
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useWizardLookupData = () => {
  const [themes, setThemes] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<{[theme: string]: string[]}>({});
  const [messages, setMessages] = useState<string[]>([]);
  const [styles, setStyles] = useState<string[]>(["Retro", "3D", "Picture Book", "Watercolor"]);
  const [ageCategories, setAgeCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return {
    themes,
    subjects,
    messages,
    styles,
    ageCategories,
    isLoading
  };
};
