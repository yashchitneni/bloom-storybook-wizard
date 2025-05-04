
import React from 'react';
import { motion } from "framer-motion";
import AgeCard from '@/components/wizard/AgeCard';

interface AgeSelectionSectionProps {
  onSelectAge: (age: string) => void;
  selectedAge: string;
  ageCategories: string[];
  isActive: boolean;
}

const AgeSelectionSection: React.FC<AgeSelectionSectionProps> = ({
  onSelectAge,
  selectedAge,
  ageCategories,
  isActive
}) => {
  return (
    <motion.section 
      id="step-1" 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold">Choose the Age Category</h3>
      <AgeCard 
        onSelectAge={onSelectAge}
        selectedAge={selectedAge}
        ageCategories={ageCategories}
        isActive={true}
      />
    </motion.section>
  );
};

export default AgeSelectionSection;
