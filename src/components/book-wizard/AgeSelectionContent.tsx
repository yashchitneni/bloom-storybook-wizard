
import React from 'react';
import { motion } from 'framer-motion';

interface AgeSelectionContentProps {
  selectedAge: string;
  onSelectAge: (age: string) => void;
  ageCategories: string[];
}

const AgeSelectionContent: React.FC<AgeSelectionContentProps> = ({ 
  selectedAge, 
  onSelectAge,
  ageCategories 
}) => {
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-6">Pick an Age Range</h1>
      
      <div className="grid grid-cols-3 gap-4 flex-grow">
        {ageCategories.map((age) => (
          <motion.button
            key={age}
            onClick={() => onSelectAge(age)}
            className={`
              relative flex flex-col items-center justify-center p-4 rounded-xl 
              ${selectedAge === age 
                ? 'bg-persimmon/10 border-2 border-persimmon' 
                : 'bg-white border-2 border-gray-200 hover:border-persimmon/50'}
              transition-all duration-200
            `}
            whileHover={{ y: -2, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
          >
            <div className="text-2xl mb-2">
              {age === '0-2' ? '👶' : age === '3-5' ? '🧒' : '👦'}
            </div>
            <span className="font-medium font-fredoka">{age} yrs</span>
          </motion.button>
        ))}
      </div>
      
      <div className="text-center text-gray-500 mt-8 italic text-sm">
        We'll tailor the story complexity to your child's age group
      </div>
    </div>
  );
};

export default AgeSelectionContent;
