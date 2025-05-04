
import React from 'react';
import { motion } from "framer-motion";

interface AgeCardProps {
  onSelectAge: (age: string) => void;
  selectedAge: string;
  ageCategories: string[];
  isActive: boolean;
}

const AgeCard: React.FC<AgeCardProps> = ({ onSelectAge, selectedAge, ageCategories, isActive }) => {
  // Define icons for each age group
  const getAgeIcon = (age: string) => {
    if (age.includes("0-2")) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15.5 10a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
          <path d="M12 13a4 4 0 0 1 4-4"/>
          <path d="m19 13-1.2-1.2a1 1 0 0 0-1.6 1.2l2.4 5.2c.3.6 0 1.4-.7 1.6l-5.7 1.1a4 4 0 0 1-3.2-.8L4 16"/>
          <path d="m7 8-3 2"/>
          <path d="M6 11c0-1.7 1.3-3 3-3h.7"/>
        </svg>
      );
    } else if (age.includes("3-5")) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 7c0-1.1-.9-2-2-2H8a2 2 0 0 0-2 2v6"/>
          <path d="M10 2c0 1.1-.9 2-2 2s-2-.9-2-2"/>
          <path d="M18 2c0 1.1-.9 2-2 2s-2-.9-2-2"/>
          <path d="M10 18v-1a2 2 0 1 1 4 0v1"/>
          <path d="M14 18a2 2 0 0 0 4 0v-3a2 2 0 0 0-2-2h-3a1 1 0 0 1-1-1v-2a2 2 0 0 1 4 0"/>
          <path d="M18 11h1"/>
          <path d="M5.2 3.8v3.3"/>
          <path d="M3.5 5.5h3.3"/>
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/>
          <path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/>
          <path d="M4 15v-3a8 8 0 0 1 16 0v3"/>
        </svg>
      );
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {ageCategories.map((age) => {
        const isSelected = selectedAge === age;
        const bgColor = age.includes("0-2") ? "bg-peach-100" : 
                      age.includes("3-5") ? "bg-mint-100" : "bg-lavender-100";
        const borderColor = age.includes("0-2") ? "border-orange-400" : 
                          age.includes("3-5") ? "border-teal-400" : "border-purple-400";
        const textColor = age.includes("0-2") ? "text-orange-500" : 
                        age.includes("3-5") ? "text-teal-500" : "text-purple-500";
        
        return (
          <motion.div 
            key={age}
            onClick={() => onSelectAge(age)}
            className={`
              p-6 border-2 rounded-xl cursor-pointer flex flex-col items-center justify-center aspect-[6/5]
              transition-all duration-300 hover:shadow-md
              ${isSelected ? `${borderColor} shadow-lg` : "border-transparent shadow"}
              ${bgColor}
            `}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`mb-4 ${isSelected ? textColor : "text-gray-600"}`}>
              {getAgeIcon(age)}
            </div>
            <span className={`text-lg font-medium ${isSelected ? textColor : "text-gray-800"}`}>
              {age} years
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export default AgeCard;
