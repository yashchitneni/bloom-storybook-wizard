
import React from 'react';
import Button from "../Button";
import { MessageSelectionStepProps } from "@/types/wizard";
import { ChevronLeft } from "lucide-react";

const MessageSelectionStep: React.FC<MessageSelectionStepProps> = ({ 
  onNext, 
  onPrevious, 
  onSelectMessage, 
  selectedMessage,
  messages
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">What's the central message of the story?</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {messages.map((message) => (
          <div 
            key={message}
            onClick={() => onSelectMessage(message)}
            className={`p-4 border-2 rounded-xl cursor-pointer text-center transition-all duration-200
              ${selectedMessage === message 
                ? "border-persimmon bg-persimmon/5" 
                : "border-gray-200 hover:border-persimmon/50"}`}
          >
            <span className="font-medium">{message}</span>
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
          disabled={!selectedMessage} 
          withArrow
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default MessageSelectionStep;
