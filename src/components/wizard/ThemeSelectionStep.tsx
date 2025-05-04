
import React from 'react';
import Button from "../Button";
import { ThemeSelectionStepProps } from "@/types/wizard";
import { ChevronLeft } from "lucide-react";

const ThemeSelectionStep: React.FC<ThemeSelectionStepProps> = ({ 
  onNext, 
  onPrevious, 
  onSelectTheme, 
  selectedTheme,
  themes
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Choose a story theme</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <div 
            key={theme}
            onClick={() => onSelectTheme(theme)}
            className={`p-4 border-2 rounded-xl cursor-pointer text-center transition-all duration-200 aspect-[3/2] flex items-center justify-center
              ${selectedTheme === theme 
                ? "border-persimmon bg-persimmon/5" 
                : "border-gray-200 hover:border-persimmon/50"}`}
          >
            <span className="font-medium font-fredoka">{theme}</span>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!selectedTheme} 
          withArrow
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ThemeSelectionStep;
