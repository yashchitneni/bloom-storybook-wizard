
import React from 'react';
import { motion } from 'framer-motion';

interface SubjectSelectionContentProps {
  selectedTheme: string;
  selectedSubject: string;
  onSelectSubject: (subject: string) => void;
  subjects: string[];
}

const SubjectSelectionContent: React.FC<SubjectSelectionContentProps> = ({
  selectedTheme,
  selectedSubject,
  onSelectSubject,
  subjects
}) => {
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-6">Select a Subject</h1>
      <h2 className="text-lg text-gray-600 mb-4">For your {selectedTheme} theme</h2>
      
      <div className="grid grid-cols-3 gap-4 flex-grow">
        {subjects.map((subject) => (
          <motion.button
            key={subject}
            onClick={() => onSelectSubject(subject)}
            className={`
              relative flex items-center justify-center p-4 rounded-xl text-center
              ${selectedSubject === subject 
                ? 'bg-persimmon/10 border-2 border-persimmon' 
                : 'bg-white border-2 border-gray-200 hover:border-persimmon/50'}
              transition-all duration-200
            `}
            whileHover={{ y: -2, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
          >
            <span className="font-medium">{subject}</span>
          </motion.button>
        ))}
      </div>
      
      <div className="text-center text-gray-500 mt-8 italic text-sm">
        Select the main character or subject for your story
      </div>
    </div>
  );
};

export default SubjectSelectionContent;
