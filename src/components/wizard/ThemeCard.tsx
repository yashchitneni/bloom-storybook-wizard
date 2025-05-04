
import React from 'react';
import { motion } from "framer-motion";

interface ThemeCardProps {
  onSelectTheme: (theme: string) => void;
  selectedTheme: string;
  themes: string[];
  isActive: boolean;
}

const ThemeCard: React.FC<ThemeCardProps> = ({ onSelectTheme, selectedTheme, themes, isActive }) => {
  // Define icons for each theme
  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case 'Educational':
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="24" height="24" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M14 14H18V18H14V14Z" stroke="currentColor" strokeWidth="2" />
            <path d="M22 14H26V18H22V14Z" stroke="currentColor" strokeWidth="2" />
            <path d="M14 22H18V26H14V22Z" stroke="currentColor" strokeWidth="2" />
            <path d="M22 22H26V26H22V22Z" stroke="currentColor" strokeWidth="2" />
            <path d="M15 15L17 17" stroke="currentColor" strokeWidth="1.5" />
            <path d="M23 15L25 17" stroke="currentColor" strokeWidth="1.5" />
            <path d="M15 23L17 25" stroke="currentColor" strokeWidth="1.5" />
            <path d="M23 23L25 25" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        );
      case 'Adventure':
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 8L24 16H16L20 8Z" stroke="currentColor" strokeWidth="2" />
            <path d="M12 18H28L32 32H8L12 18Z" stroke="currentColor" strokeWidth="2" />
            <path d="M16 24H24" stroke="currentColor" strokeWidth="2" />
            <path d="M14 28H26" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      case 'Fairy Tales':
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 8L22 14H18L20 8Z" stroke="currentColor" strokeWidth="2" />
            <path d="M30 14L28 20L24 18L30 14Z" stroke="currentColor" strokeWidth="2" />
            <path d="M10 14L12 20L16 18L10 14Z" stroke="currentColor" strokeWidth="2" />
            <path d="M12 32H28L24 20H16L12 32Z" stroke="currentColor" strokeWidth="2" />
            <path d="M14 24L20 26L26 24" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      case 'Activities':
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 14L12 30" stroke="currentColor" strokeWidth="2" />
            <path d="M28 14L28 30" stroke="currentColor" strokeWidth="2" />
            <path d="M12 14L28 14" stroke="currentColor" strokeWidth="2" />
            <path d="M10 30L30 30" stroke="currentColor" strokeWidth="2" />
            <path d="M16 18L24 18" stroke="currentColor" strokeWidth="2" />
            <path d="M16 22L24 22" stroke="currentColor" strokeWidth="2" />
            <path d="M16 26L24 26" stroke="currentColor" strokeWidth="2" />
            <path d="M20 10L20 14" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      case 'Rhyming Stories':
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 10H28V32H12V10Z" stroke="currentColor" strokeWidth="2" />
            <path d="M16 16H24" stroke="currentColor" strokeWidth="2" />
            <path d="M16 20H24" stroke="currentColor" strokeWidth="2" />
            <path d="M16 24H20" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      case 'Holidays':
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 8L22 16H18L20 8Z" stroke="currentColor" strokeWidth="2" />
            <path d="M14 16L20 32L26 16H14Z" stroke="currentColor" strokeWidth="2" />
            <path d="M10 16H30" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      case 'Family':
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="20" r="3" stroke="currentColor" strokeWidth="2" />
            <circle cx="28" cy="20" r="3" stroke="currentColor" strokeWidth="2" />
            <path d="M20 16V24" stroke="currentColor" strokeWidth="2" />
            <path d="M12 23V30" stroke="currentColor" strokeWidth="2" />
            <path d="M28 23V30" stroke="currentColor" strokeWidth="2" />
            <path d="M16 30H24" stroke="currentColor" strokeWidth="2" />
            <path d="M20 24H24" stroke="currentColor" strokeWidth="2" />
            <path d="M16 24H20" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {themes.map((theme) => {
        const isSelected = selectedTheme === theme;
        let bgColor = "bg-gray-100";
        let borderColor = "border-gray-300";
        let textColor = "text-gray-700";
        
        if (isSelected) {
          switch (theme) {
            case 'Educational':
              bgColor = "bg-peach-100";
              borderColor = "border-orange-400";
              textColor = "text-orange-600";
              break;
            case 'Fairy Tales':
              bgColor = "bg-mint-100";
              borderColor = "border-teal-400";
              textColor = "text-teal-600";
              break;
            case 'Adventure':
              bgColor = "bg-rose-100";
              borderColor = "border-persimmon";
              textColor = "text-persimmon";
              break;
            case 'Activities':
              bgColor = "bg-lavender-100";
              borderColor = "border-purple-400";
              textColor = "text-purple-600";
              break;
            case 'Rhyming Stories':
              bgColor = "bg-gray-100";
              borderColor = "border-gray-500";
              textColor = "text-gray-600";
              break;
            case 'Holidays':
              bgColor = "bg-amber-100";
              borderColor = "border-amber-400";
              textColor = "text-amber-600";
              break;
            case 'Family':
              bgColor = "bg-blue-100";
              borderColor = "border-blue-400";
              textColor = "text-blue-600";
              break;
          }
        }
        
        return (
          <motion.div 
            key={theme}
            onClick={() => onSelectTheme(theme)}
            className={`
              p-4 border-2 rounded-xl cursor-pointer flex flex-col items-center justify-center
              transition-all duration-300 hover:shadow-md aspect-[6/5]
              ${isSelected ? `${borderColor} shadow-lg ${bgColor}` : "border-gray-200 shadow bg-white"}
            `}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`mb-3 ${isSelected ? textColor : "text-gray-600"}`}>
              {getThemeIcon(theme)}
            </div>
            <span className={`text-base font-medium ${isSelected ? textColor : "text-gray-800"}`}>
              {theme}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ThemeCard;
