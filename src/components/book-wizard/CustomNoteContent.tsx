
import React from 'react';
import { WizardData } from "@/types/wizard";

interface CustomNoteContentProps {
  customNote: string;
  onCustomNoteChange: (note: string) => void;
  wizardData: WizardData;
}

const CustomNoteContent: React.FC<CustomNoteContentProps> = ({
  customNote,
  onCustomNoteChange,
  wizardData
}) => {
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-6">Add a Personal Note</h1>
      
      <div className="mb-6">
        <textarea
          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-persimmon focus:ring focus:ring-persimmon/20 focus:outline-none min-h-[140px]"
          placeholder="Add a dedication or special message to include in your story..."
          value={customNote}
          onChange={(e) => onCustomNoteChange(e.target.value)}
          maxLength={300}
        />
        <div className="text-xs text-right text-gray-500 mt-1">
          {customNote.length}/300 characters
        </div>
      </div>
      
      <div className="flex-grow">
        <h2 className="text-lg font-semibold mb-3">Your Story Summary</h2>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 grid grid-cols-2 gap-x-6 gap-y-2">
          <div>
            <span className="text-gray-500 text-sm">Age Range:</span>
            <p className="font-medium">{wizardData.age}</p>
          </div>
          <div>
            <span className="text-gray-500 text-sm">Theme:</span>
            <p className="font-medium">{wizardData.theme}</p>
          </div>
          <div>
            <span className="text-gray-500 text-sm">Subject:</span>
            <p className="font-medium">{wizardData.subject}</p>
          </div>
          <div>
            <span className="text-gray-500 text-sm">Message:</span>
            <p className="font-medium">{wizardData.message}</p>
          </div>
          <div>
            <span className="text-gray-500 text-sm">Art Style:</span>
            <p className="font-medium">{wizardData.style}</p>
          </div>
        </div>
      </div>
      
      <div className="text-center text-gray-500 mt-8 italic text-sm">
        Review your selections before generating your custom storybook
      </div>
    </div>
  );
};

export default CustomNoteContent;
