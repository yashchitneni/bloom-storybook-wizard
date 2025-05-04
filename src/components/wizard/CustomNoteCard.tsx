
import React from 'react';

interface CustomNoteCardProps {
  onCustomNoteChange: (customNote: string) => void;
  customNote: string;
  isActive: boolean;
}

const CustomNoteCard: React.FC<CustomNoteCardProps> = ({ 
  onCustomNoteChange, 
  customNote,
  isActive
}) => {
  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        Add a dedication, special message, or details you'd like included in the story.
      </p>
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-persimmon min-h-[140px] bg-white"
          placeholder="Write a personal note or dedication... (optional)"
          maxLength={300}
          value={customNote}
          onChange={(e) => onCustomNoteChange(e.target.value)}
        />
        <div className="text-xs text-right text-gray-500 mt-2">
          {customNote?.length || 0}/300 characters
        </div>
      </div>
    </div>
  );
};

export default CustomNoteCard;
