
import React from 'react';
import { motion } from "framer-motion";
import SubjectCard from '@/components/wizard/SubjectCard';

interface SubjectSelectionSectionProps {
  onSelectSubject: (subject: string) => void;
  selectedTheme: string;
  selectedSubject: string;
  subjects: string[];
  isActive: boolean;
}

const SubjectSelectionSection: React.FC<SubjectSelectionSectionProps> = ({
  onSelectSubject,
  selectedTheme,
  selectedSubject,
  subjects,
  isActive
}) => {
  return (
    <motion.section 
      id="step-3"
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-xl font-bold">Choose a Subject</h3>
      <SubjectCard
        onSelectSubject={onSelectSubject}
        selectedTheme={selectedTheme}
        selectedSubject={selectedSubject}
        subjects={subjects}
        isActive={true}
      />
    </motion.section>
  );
};

export default SubjectSelectionSection;
