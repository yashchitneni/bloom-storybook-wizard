
import React from 'react';
import { motion } from 'framer-motion';

interface ThemeSelectionContentProps {
  selectedTheme: string;
  onSelectTheme: (theme: string) => void;
  themes: string[];
}

const getThemeEmoji = (theme: string): string => {
  switch(theme) {
    case 'Adventure': return '🗺️';
    case 'Fairy Tales': return '🧚';
    case 'Educational': return '🔍';
    case 'Activities': return '🎨';
    case 'Rhyming Stories': return '📝';
    case 'Holidays': return '🎅';
    case 'Family': return '👪';
    default: return '📚';
  }
};

const ThemeSelectionContent: React.FC<ThemeSelectionContentProps> = ({
  selectedTheme,
  onSelectTheme,
  themes
}) => {
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-6">Choose a Theme</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-grow">
        {themes.map((theme) => (
          <motion.button
            key={theme}
            onClick={() => onSelectTheme(theme)}
            className={`
              relative flex flex-col items-center justify-center p-4 rounded-xl
              ${selectedTheme === theme 
                ? 'bg-persimmon/10 border-2 border-persimmon' 
                : 'bg-white border-2 border-gray-200 hover:border-persimmon/50'}
              transition-all duration-200
            `}
            whileHover={{ y: -2, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
          >
            <div className="text-3xl mb-2">{getThemeEmoji(theme)}</div>
            <span className="font-medium font-fredoka">{theme}</span>
          </motion.button>
        ))}
      </div>
      
      <div className="text-center text-gray-500 mt-8 italic text-sm">
        Each theme offers a different storytelling experience
      </div>
    </div>
  );
};

export default ThemeSelectionContent;
