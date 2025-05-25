import React from 'react';
import { motion } from "framer-motion";
import CustomNoteCard from '@/components/wizard/CustomNoteCard';
import { toast } from '@/components/ui/use-toast';

interface CustomNoteSectionProps {
  onCustomNoteChange: (customNote: string) => void;
  customNote: string;
  isActive: boolean;
}

const CustomNoteSection: React.FC<CustomNoteSectionProps> = ({
  onCustomNoteChange,
  customNote,
  isActive
}) => {
  return (
    <motion.section 
      id="step-5"
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-xl font-bold">Add a personal note</h3>
      <CustomNoteCard
        onCustomNoteChange={onCustomNoteChange}
        customNote={customNote}
        isActive={true}
      />
    </motion.section>
  );
};

export default CustomNoteSection;
