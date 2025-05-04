
import React from 'react';
import { motion } from "framer-motion";
import StyleSelectionCard from '@/components/wizard/StyleSelectionCard';

interface StyleSelectionSectionProps {
  onSelectStyle: (style: string) => void;
  selectedStyle: string;
  styles: string[];
  isActive: boolean;
}

const StyleSelectionSection: React.FC<StyleSelectionSectionProps> = ({
  onSelectStyle,
  selectedStyle,
  styles,
  isActive
}) => {
  return (
    <motion.section 
      id="step-6"
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-xl font-bold font-poppins">Choose Illustration Style</h3>
      <StyleSelectionCard
        onSelectStyle={onSelectStyle}
        selectedStyle={selectedStyle}
        styles={styles}
        isActive={isActive}
      />
    </motion.section>
  );
};

export default StyleSelectionSection;
