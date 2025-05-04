
import React from 'react';
import Button from "../Button";
import { PhotoStyleStepProps } from "@/types/wizard";
import { ChevronLeft } from "lucide-react";
import { getStyleImageUrl, getFallbackStyleImageUrl } from '@/utils/image-utils';

const PhotoStyleStep: React.FC<PhotoStyleStepProps> = ({ 
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
  
  const getImageUrl = (style: string): string => {
    try {
      // Try to get the image from Supabase storage first
      return getStyleImageUrl(style);
    } catch (error) {
      console.error(`Error loading image for ${style}:`, error);
      // Fall back to local images if storage fails
      return getFallbackStyleImageUrl(style);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Only show photo upload step */}
      <h3 className="text-xl font-bold">Upload Photo</h3>
      
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
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={onNext} withArrow>
          Next
        </Button>
      </div>
    </div>
  );
};

export default PhotoStyleStep;
