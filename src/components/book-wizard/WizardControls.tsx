
import React from 'react';
import { ChevronLeft, Book } from 'lucide-react';
import Button from "@/components/Button";

interface WizardControlsProps {
  currentPage: number;
  totalPages: number;
  isFlipping: boolean;
  isNextAvailable: boolean;
  isSubmitting: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
}

export const WizardHeader: React.FC<{ 
  currentPage: number;
  totalPages: number;
  isFlipping: boolean;
  onPrev: () => void;
}> = ({ currentPage, totalPages, isFlipping, onPrev }) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
      <button 
        onClick={onPrev} 
        disabled={currentPage === 1 || isFlipping}
        className="flex items-center text-gray-700 hover:text-persimmon disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Go back"
      >
        <ChevronLeft size={20} />
        <span className="ml-1 text-sm font-medium">Back</span>
      </button>
      
      <div className="flex items-center">
        <Book size={16} className="text-gray-400 mr-2" />
        <p className="text-sm font-medium text-gray-600">Page {currentPage} of {totalPages}</p>
      </div>
    </div>
  );
};

export const WizardFooter: React.FC<{
  currentPage: number;
  totalPages: number;
  isFlipping: boolean;
  isNextAvailable: boolean;
  isSubmitting: boolean;
  onNext: () => void;
  onSubmit: () => void;
}> = ({ currentPage, totalPages, isFlipping, isNextAvailable, isSubmitting, onNext, onSubmit }) => {
  return (
    <div className="flex justify-center p-6 border-t border-gray-100">
      {currentPage === totalPages ? (
        <Button 
          onClick={onSubmit} 
          disabled={isSubmitting} 
          size="lg"
          className="bg-[#FF7A50] hover:bg-[#FF7A50]/90 text-white font-semibold shadow-md min-w-[180px]"
          withArrow
        >
          Review My Book
        </Button>
      ) : (
        <Button 
          onClick={onNext} 
          disabled={!isNextAvailable || isFlipping} 
          size="lg"
          className="bg-[#FF7A50] hover:bg-[#FF7A50]/90 text-white font-semibold shadow-md min-w-[120px]"
          withArrow
        >
          Next
        </Button>
      )}
    </div>
  );
};
