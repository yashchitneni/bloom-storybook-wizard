
import React from 'react';
import { motion } from "framer-motion";
import ChildProfileCard from '@/components/wizard/ChildProfileCard';

interface ChildProfileSectionProps {
  onChildNameChange: (name: string) => void;
  onChildGenderChange: (gender: string) => void;
  onChildPhotoUpload: (file: File) => void;
  childName: string;
  childGender: string;
  childPhotoPreview: string | null;
  isActive: boolean;
}

const ChildProfileSection: React.FC<ChildProfileSectionProps> = ({
  onChildNameChange,
  onChildGenderChange,
  onChildPhotoUpload,
  childName,
  childGender,
  childPhotoPreview,
  isActive
}) => {
  return (
    <motion.section 
      id="step-7"
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-xl font-bold">Your Child</h3>
      <ChildProfileCard
        onChildNameChange={onChildNameChange}
        onChildGenderChange={onChildGenderChange}
        onChildPhotoUpload={onChildPhotoUpload}
        childName={childName}
        childGender={childGender}
        childPhotoPreview={childPhotoPreview}
        isActive={true}
      />
    </motion.section>
  );
};

export default ChildProfileSection;
