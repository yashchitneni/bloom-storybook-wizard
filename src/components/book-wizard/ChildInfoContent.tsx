
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, User } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ChildInfoContentProps {
  childName: string;
  gender: string;
  photoPreview: string | null;
  onChildInfoChange: (info: { name: string; gender: string; photo?: File }) => void;
  onPhotoUpload: (file: File) => void;
}

const ChildInfoContent: React.FC<ChildInfoContentProps> = ({
  childName,
  gender,
  photoPreview,
  onChildInfoChange,
  onPhotoUpload
}) => {
  const [name, setName] = useState(childName);
  const [selectedGender, setSelectedGender] = useState(gender);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle name input
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    onChildInfoChange({ name: newName, gender: selectedGender });
  };

  // Handle gender selection
  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender);
    onChildInfoChange({ name, gender });
  };

  // Handle photo upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onPhotoUpload(file);
      onChildInfoChange({ name, gender: selectedGender, photo: file });
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-6">About Your Child</h1>
      
      <div className="space-y-6 flex-grow">
        {/* Child's Name */}
        <div className="space-y-2">
          <label htmlFor="childName" className="block text-sm font-medium text-gray-700">
            Child's Name
          </label>
          <Input
            id="childName"
            type="text"
            placeholder="Enter your child's name"
            value={name}
            onChange={handleNameChange}
            className="w-full"
          />
        </div>
        
        {/* Gender Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Child's Gender
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleGenderSelect('boy')}
              className={`gender-button ${selectedGender === 'boy' ? 'selected' : 'bg-white'}`}
            >
              <div className="text-3xl mb-2">👦</div>
              <span className="font-medium">Boy</span>
            </button>
            <button
              type="button"
              onClick={() => handleGenderSelect('girl')}
              className={`gender-button ${selectedGender === 'girl' ? 'selected' : 'bg-white'}`}
            >
              <div className="text-3xl mb-2">👧</div>
              <span className="font-medium">Girl</span>
            </button>
          </div>
        </div>
        
        {/* Photo Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Child's Photo (Optional)
          </label>
          <div className="mt-2 flex justify-center">
            {photoPreview ? (
              <div className="relative">
                <img 
                  src={photoPreview} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md"
                />
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="absolute bottom-0 right-0 bg-persimmon text-white p-2 rounded-full shadow-md"
                >
                  <Camera size={16} />
                </button>
              </div>
            ) : (
              <motion.button
                type="button"
                onClick={handleUploadClick}
                className="w-32 h-32 rounded-full bg-gray-100 flex flex-col items-center justify-center border-2 border-dashed border-gray-300"
                whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              >
                <User size={24} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Add Photo</span>
              </motion.button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Upload a clear photo of your child's face for personalized illustrations
          </p>
        </div>
      </div>
      
      <div className="text-center text-gray-500 mt-8 italic text-sm">
        This information helps us personalize your child's storybook
      </div>
    </div>
  );
};

export default ChildInfoContent;
