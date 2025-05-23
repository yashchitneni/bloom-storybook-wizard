import React from 'react';
import { motion } from "framer-motion";
import ChildProfileCard from '@/components/wizard/ChildProfileCard';
import { useWizardPhotoUpload } from '@/hooks/wizard/use-wizard-photo-upload';

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
  const { isUploading } = useWizardPhotoUpload();
  
  // Create wrapped handlers to add logging
  const handleChildNameChange = (name: string) => {
    console.log("Child name changed:", name);
    onChildNameChange(name);
  };
  
  const handleChildGenderChange = (gender: string) => {
    console.log("Child gender changed:", gender);
    onChildGenderChange(gender);
  };
  
  const handleChildPhotoUpload = (file: File) => {
    console.log("Child photo uploaded:", file.name);
    onChildPhotoUpload(file);
  };
  
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
        onChildNameChange={handleChildNameChange}
        onChildGenderChange={handleChildGenderChange}
        onChildPhotoUpload={handleChildPhotoUpload}
        childName={childName}
        childGender={childGender}
        childPhotoPreview={childPhotoPreview}
        isActive={true}
        isUploading={isUploading}
      />
    </motion.section>
  );
};

export default ChildProfileSection;
