
import React from 'react';
import Button from "../Button";
import { PhotoStyleSelectionStepProps } from "@/types/wizard";
import { ChevronLeft } from "lucide-react";

const PhotoStyleStep: React.FC<PhotoStyleSelectionStepProps> = ({ 
  onNext, 
  onPrevious,
  onSelectStyle,
  selectedStyle,
  onPhotoUpload,
  photoPreview,
  styles
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onPhotoUpload(e.target.files[0]);
    }
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Upload Photo & Choose Style</h3>
      
      <div className="space-y-4">
        <label className="block text-sm font-medium">Upload a photo of your little hero</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          {photoPreview ? (
            <div className="flex flex-col items-center">
              <img 
                src={photoPreview} 
                alt="Preview" 
                className="w-32 h-32 object-cover rounded-lg"
              />
              <button 
                onClick={() => onPhotoUpload(new File([], ""))} 
                className="mt-2 text-sm text-persimmon hover:underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <>
              <label className="cursor-pointer flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="mt-2 text-sm">Click to upload (JPEG/PNG)</span>
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
      
      <div className="space-y-4">
        <label className="block text-sm font-medium">Select an illustration style</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {styles.map((style) => (
            <div 
              key={style}
              onClick={() => onSelectStyle(style)}
              className={`
                aspect-[6/7] rounded-lg overflow-hidden cursor-pointer relative
                transition-all duration-200 group
                ${selectedStyle === style ? "ring-2 ring-persimmon ring-offset-2" : ""}
              `}
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
                  Select
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!photoPreview || !selectedStyle} 
          withArrow
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default PhotoStyleStep;
