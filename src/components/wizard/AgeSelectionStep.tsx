
import React from 'react';
import Button from "../Button";
import { AgeSelectionStepProps } from "@/types/wizard";

const AgeSelectionStep: React.FC<AgeSelectionStepProps> = ({ onNext, onSelectAge, selectedAge, ageCategories }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">How old is your little hero?</h3>
      <div className="flex flex-col sm:flex-row gap-4">
        {ageCategories.map((age) => (
          <div 
            key={age}
            onClick={() => onSelectAge(age)}
            className={`p-4 border-2 rounded-xl cursor-pointer flex-1 text-center transition-all duration-200 
              ${selectedAge === age 
                ? "border-persimmon bg-persimmon/5" 
                : "border-gray-200 hover:border-persimmon/50"}`}
          >
            <span className="font-medium font-fredoka">{age} yrs</span>
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-4">
        <Button onClick={onNext} disabled={!selectedAge} withArrow>Next</Button>
      </div>
    </div>
  );
};

export default AgeSelectionStep;
