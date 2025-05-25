import React, { useState } from 'react';
import { motion } from "framer-motion";
import ChildProfileCard from '@/components/wizard/ChildProfileCard';

interface ChildProfileSectionProps {
  onChildNameChange: (name: string) => void;
  onChildGenderChange: (gender: string) => void;
  onChildPhotoUpload: (file: File) => Promise<void>;
  childName: string;
  childGender: string;
  childPhotoPreview: string | null;
  isActive: boolean;
  isUploading: boolean;
  onNext: () => void;
}

const ChildProfileSection: React.FC<ChildProfileSectionProps> = ({
  onChildNameChange,
  onChildGenderChange,
  onChildPhotoUpload,
  childName,
  childGender,
  childPhotoPreview,
  isActive,
  isUploading,
  onNext
}) => {
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const handlePhotoUploadWrapper = async (file: File) => {
    console.log("[ChildProfileSection] Photo selected:", file.name);
    try {
      await onChildPhotoUpload(file);
      console.log("[ChildProfileSection] Photo upload process finished (success or handled failure).");
    } catch (error) {
      console.error("[ChildProfileSection] Error from onChildPhotoUpload:", error);
    }
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
        onChildNameChange={onChildNameChange}
        onChildGenderChange={onChildGenderChange}
        onChildPhotoUpload={handlePhotoUploadWrapper}
        childName={childName}
        childGender={childGender}
        childPhotoPreview={childPhotoPreview}
        isActive={true}
        isUploading={isUploading}
        nameError={missingFields.includes("name")}
        genderError={missingFields.includes("gender")}
        photoError={missingFields.includes("photo")}
      />
    </motion.section>
  );
};

export default ChildProfileSection;
