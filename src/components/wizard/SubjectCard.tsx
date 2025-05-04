
import React from 'react';
import { motion } from "framer-motion";

interface SubjectCardProps {
  onSelectSubject: (subject: string) => void;
  selectedTheme: string;
  selectedSubject: string;
  subjects: string[];
  isActive: boolean;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ 
  onSelectSubject, 
  selectedTheme, 
  selectedSubject,
  subjects,
  isActive
}) => {
  // Get theme-specific colors
  const getThemeColors = () => {
    switch (selectedTheme) {
      case 'Educational':
        return { bgColor: 'bg-peach-50', textColor: 'text-orange-600', borderColor: 'border-orange-400' };
      case 'Adventure':
        return { bgColor: 'bg-rose-50', textColor: 'text-persimmon', borderColor: 'border-persimmon' };
      case 'Fairy Tales':
        return { bgColor: 'bg-mint-50', textColor: 'text-teal-600', borderColor: 'border-teal-400' };
      case 'Activities':
        return { bgColor: 'bg-lavender-50', textColor: 'text-purple-600', borderColor: 'border-purple-400' };
      case 'Rhyming Stories':
        return { bgColor: 'bg-gray-50', textColor: 'text-gray-600', borderColor: 'border-gray-400' };
      case 'Holidays':
        return { bgColor: 'bg-amber-50', textColor: 'text-amber-600', borderColor: 'border-amber-400' };
      case 'Family':
        return { bgColor: 'bg-blue-50', textColor: 'text-blue-600', borderColor: 'border-blue-400' };
      default:
        return { bgColor: 'bg-gray-50', textColor: 'text-gray-600', borderColor: 'border-gray-300' };
    }
  };

  const { bgColor, textColor, borderColor } = getThemeColors();

  return (
    <div>
      <p className="mb-4 text-gray-600">Choose a subject for your <span className="font-medium">{selectedTheme}</span> story</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {subjects.map((subject) => (
          <motion.div 
            key={subject}
            onClick={() => onSelectSubject(subject)}
            className={`
              p-4 border-2 rounded-xl cursor-pointer flex items-center justify-center
              transition-all duration-300 hover:shadow-md aspect-[6/5]
              ${selectedSubject === subject 
                ? `${borderColor} ${bgColor} shadow-lg` 
                : "border-gray-200 bg-white shadow-sm"}
            `}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className={`text-center font-medium ${selectedSubject === subject ? textColor : "text-gray-800"}`}>
              {subject}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SubjectCard;
