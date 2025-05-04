
import React from 'react';
import { motion } from "framer-motion";

interface PhotoStyleCardProps {
  onSelectStyle: (style: string) => void;
  selectedStyle: string;
  onPhotoUpload: (file: File) => void;
  photoPreview: string | null;
  styles: string[];
  isActive: boolean;
}

const PhotoStyleCard: React.FC<PhotoStyleCardProps> = ({ 
  onSelectStyle, 
  selectedStyle,
  onPhotoUpload,
  photoPreview,
  styles,
  isActive
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onPhotoUpload(e.target.files[0]);
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Photo Upload Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <label className="block text-sm font-medium mb-4">Upload a photo of your little hero</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
          {photoPreview ? (
            <div className="flex flex-col items-center">
              <img 
                src={photoPreview} 
                alt="Preview" 
                className="w-40 h-40 object-cover rounded-lg shadow-md"
              />
              <button 
                onClick={() => onPhotoUpload(new File([], ""))} 
                className="mt-4 text-sm text-persimmon hover:underline px-4 py-2 border border-persimmon rounded-lg hover:bg-persimmon/5"
              >
                Change Photo
              </button>
            </div>
          ) : (
            <>
              <label className="cursor-pointer flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="mt-4 text-base">Click to upload (JPEG/PNG)</span>
                <span className="mt-2 text-xs text-gray-500">Choose a clear photo of your child's face for best results</span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/jpeg,image/png"
                  onChange={handleFileChange}
                />
              </label>
            </>
          )}
        </div>
      </div>
      
      {/* Style Selection */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <label className="block text-sm font-medium mb-4">Select an illustration style</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {styles.map((style) => (
            <motion.div 
              key={style}
              onClick={() => onSelectStyle(style)}
              className={`
                aspect-[6/7] rounded-lg overflow-hidden cursor-pointer relative
                transition-all duration-200 group
                ${selectedStyle === style ? "ring-2 ring-persimmon ring-offset-2" : ""}
              `}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <span className="font-medium text-lg">{style}</span>
              </div>
              <div className={`
                absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 
                flex items-center justify-center transition-all duration-200
                ${selectedStyle === style ? 'bg-opacity-10' : ''}
              `}>
                <span className={`
                  text-white opacity-0 group-hover:opacity-100 font-bold
                  ${selectedStyle === style ? 'opacity-100' : ''}
                `}>
                  {selectedStyle === style ? 'Selected' : 'Select'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotoStyleCard;
