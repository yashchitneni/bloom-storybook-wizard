
import React from 'react';
import { motion } from "framer-motion";
import { BabyIcon, SchoolIcon, GraduationCapIcon } from "lucide-react";

interface AgeCardProps {
  onSelectAge: (age: string) => void;
  selectedAge: string;
  ageCategories: string[];
  isActive: boolean;
}

const AgeCard: React.FC<AgeCardProps> = ({ 
  onSelectAge, 
  selectedAge,
  ageCategories,
  isActive 
}) => {
  if (!ageCategories || ageCategories.length === 0) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
        <p className="text-gray-500 italic">No age categories found. Please check back later.</p>
      </div>
    );
  }

  // Function to get the appropriate icon for each age category
  const getAgeIcon = (age: string) => {
    if (age.includes("0-2")) return <BabyIcon className="h-8 w-8" />;
    if (age.includes("3-5")) return <SchoolIcon className="h-8 w-8" />;
    return <GraduationCapIcon className="h-8 w-8" />;
  };

  // Function to get a background color for each age category
  const getCardColor = (age: string, isSelected: boolean) => {
    if (isSelected) return "bg-persimmon/10";
    
    if (age.includes("0-2")) return "bg-soft-blue";
    if (age.includes("3-5")) return "bg-soft-yellow";
    return "bg-soft-green";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {ageCategories.map((age) => (
        <motion.div 
          key={age}
          onClick={() => onSelectAge(age)}
          className={`
            p-6 border-2 rounded-xl cursor-pointer text-center transition-all duration-300
            hover:shadow-md aspect-square flex flex-col items-center justify-center
            ${selectedAge === age 
              ? "border-persimmon bg-persimmon/10 shadow-lg" 
              : `border-transparent ${getCardColor(age, selectedAge === age)}`}
          `}
          whileHover={{ scale: 1.03, y: -5 }}
          whileTap={{ scale: 0.97 }}
        >
          <div className={`mb-4 ${selectedAge === age ? "text-persimmon" : "text-gray-700"}`}>
            {getAgeIcon(age)}
          </div>
          <span className={`font-medium text-xl ${selectedAge === age ? "text-persimmon" : "text-gray-800"}`}>
            {age}
          </span>
          <p className="mt-2 text-sm text-gray-500">
            {age.includes("0-2") ? "Infants & Toddlers" : 
             age.includes("3-5") ? "Preschoolers" : 
             "Early Elementary"}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default AgeCard;
