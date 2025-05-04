
import React from 'react';
import Button from "../Button";
import { CustomNoteStepProps } from "@/types/wizard";
import { ChevronLeft } from "lucide-react";
import { Textarea } from "../ui/textarea";

const CustomNoteStep: React.FC<CustomNoteStepProps> = ({ 
  onNext, 
  onPrevious, 
  onCustomNoteChange, 
  customNote
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Add a personal note</h3>
      
      <div className="space-y-4">
        <p className="text-gray-600">
          Add a dedication, special message, or details you'd like included in the story.
        </p>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-[#F8A982]/30">
          <Textarea
            className="w-full p-3 border border-[#F8A982] rounded-lg focus:outline-none focus:ring-2 focus:ring-persimmon min-h-[120px] bg-white"
            placeholder="Write a personal note or dedication... (optional)"
            maxLength={300}
            value={customNote}
            onChange={(e) => onCustomNoteChange(e.target.value)}
          />
          <div className="text-xs text-right text-gray-500 mt-2">
            {customNote.length}/300 characters
          </div>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={onNext} withArrow>Next</Button>
      </div>
    </div>
  );
};

export default CustomNoteStep;
