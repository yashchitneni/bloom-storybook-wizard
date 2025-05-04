
import React from 'react';
import { motion } from "framer-motion";

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

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {ageCategories.map((age) => (
        <motion.div 
          key={age}
          onClick={() => onSelectAge(age)}
          className={`
            p-4 border-2 rounded-xl cursor-pointer text-center transition-all duration-300
            hover:shadow-md aspect-square flex items-center justify-center
            ${selectedAge === age 
              ? "border-persimmon bg-persimmon/10 shadow-lg" 
              : "border-gray-200 hover:border-persimmon/50"}
          `}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="font-medium text-lg">{age}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default AgeCard;
