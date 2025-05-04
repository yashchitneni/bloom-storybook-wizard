
import React from 'react';
import Button from "../Button";
import { SubjectSelectionStepProps } from "@/types/wizard";
import { ChevronLeft } from "lucide-react";

const SubjectSelectionStep: React.FC<SubjectSelectionStepProps> = ({ 
  onNext, 
  onPrevious, 
  onSelectSubject, 
  selectedTheme,
  selectedSubject,
  subjects
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Choose a subject for your {selectedTheme} story</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {subjects.map((subject) => (
          <div 
            key={subject}
            onClick={() => onSelectSubject(subject)}
            className={`p-4 border-2 rounded-xl cursor-pointer text-center transition-all duration-200
              ${selectedSubject === subject 
                ? "border-persimmon bg-persimmon/5" 
                : "border-gray-200 hover:border-persimmon/50"}`}
          >
            <span className="font-medium">{subject}</span>
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
          disabled={!selectedSubject} 
          withArrow
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default SubjectSelectionStep;
