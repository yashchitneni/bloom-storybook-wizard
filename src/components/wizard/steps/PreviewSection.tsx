
import React from 'react';
import { motion } from "framer-motion";
import PreviewCard from '@/components/wizard/PreviewCard';
import { WizardData } from '@/types/wizard';

interface PreviewSectionProps {
  wizardData: WizardData;
  isActive: boolean;
}

const PreviewSection: React.FC<PreviewSectionProps> = ({ wizardData, isActive }) => {
  return (
    <motion.section 
      id="step-9"
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-xl font-bold">Preview Your Story</h3>
      <PreviewCard
        wizardData={wizardData}
        isActive={true}
      />
    </motion.section>
  );
};

export default PreviewSection;
