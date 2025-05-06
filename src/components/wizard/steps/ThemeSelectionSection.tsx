
import React from 'react';
import { motion } from "framer-motion";
import ThemeCard from '@/components/wizard/ThemeCard';

interface ThemeSelectionSectionProps {
  onSelectTheme: (theme: string) => void;
  selectedTheme: string;
  themes: string[];
  isActive: boolean;
}

const ThemeSelectionSection: React.FC<ThemeSelectionSectionProps> = ({
  onSelectTheme,
  selectedTheme,
  themes,
  isActive
}) => {
  // Create a wrapped handler to add logging
  const handleThemeSelect = (theme: string) => {
    console.log("Theme selected:", theme);
    onSelectTheme(theme);
  };
  
  return (
    <motion.section 
      id="step-2"
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-xl font-bold">Choose a Theme</h3>
      <ThemeCard
        onSelectTheme={handleThemeSelect}
        selectedTheme={selectedTheme}
        themes={themes}
        isActive={true}
      />
    </motion.section>
  );
};

export default ThemeSelectionSection;
