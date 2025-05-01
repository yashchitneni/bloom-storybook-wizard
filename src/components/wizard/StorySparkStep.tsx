
import React from 'react';
import Button from "../Button";
import { StorySparkStepProps } from "@/types/wizard";
import { ChevronLeft } from "lucide-react";

const StorySparkStep: React.FC<StorySparkStepProps> = ({ 
  onNext, 
  onPrevious, 
  onSelectTheme, 
  onSelectMoral, 
  onSpecialDetailsChange,
  selectedTheme,
  selectedMoral,
  specialDetails
}) => {
  const themes = ["Adventure", "Bedtime", "Family", "Superhero"];
  const morals = ["Bravery", "Sharing", "Honesty", "Clean-up"];
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Choose your story elements</h3>
      
      <div className="space-y-4">
        <label className="block text-sm font-medium">Choose a Theme</label>
        <select
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-persimmon"
          value={selectedTheme}
          onChange={(e) => onSelectTheme(e.target.value)}
        >
          <option value="">Select a theme</option>
          {themes.map((theme) => (
            <option key={theme} value={theme}>{theme}</option>
          ))}
        </select>
      </div>
      
      <div className="space-y-4">
        <label className="block text-sm font-medium">Pick a Moral</label>
        <select
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-persimmon"
          value={selectedMoral}
          onChange={(e) => onSelectMoral(e.target.value)}
        >
          <option value="">Select a moral</option>
          {morals.map((moral) => (
            <option key={moral} value={moral}>{moral}</option>
          ))}
        </select>
      </div>
      
      <div className="space-y-4">
        <label className="block text-sm font-medium">Special detail to include? (optional)</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-persimmon"
          placeholder="E.g., favorite toy, pet's name, etc."
          maxLength={200}
          value={specialDetails}
          onChange={(e) => onSpecialDetailsChange(e.target.value)}
        />
        <div className="text-xs text-right text-gray-500">
          {specialDetails.length}/200 characters
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!selectedTheme || !selectedMoral} 
          withArrow
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default StorySparkStep;
