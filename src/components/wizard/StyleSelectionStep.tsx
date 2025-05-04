
import React from 'react';
import Button from "../Button";
import { StyleSelectionStepProps } from "@/types/wizard";
import { ChevronLeft } from "lucide-react";
import { getStyleImageUrl, getFallbackStyleImageUrl } from '@/utils/image-utils';

const StyleSelectionStep: React.FC<StyleSelectionStepProps> = ({ 
  onNext, 
  onPrevious,
  onSelectStyle,
  selectedStyle,
  styles
}) => {
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
      <h3 className="text-xl font-bold">Choose Illustration Style</h3>
      
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
              <img 
                src={getImageUrl(style)}
                alt={`${style} style`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="text-white font-medium text-center">{style}</p>
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
          disabled={!selectedStyle} 
          withArrow
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default StyleSelectionStep;
