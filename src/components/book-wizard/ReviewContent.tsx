
import React from 'react';
import { WizardData } from "@/types/wizard";

interface ReviewContentProps {
  wizardData: WizardData;
}

const ReviewContent: React.FC<ReviewContentProps> = ({ wizardData }) => {
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-6">Review Your Book</h1>
      
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 flex-grow">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-500 mb-2">Story Details</h3>
            <ul className="space-y-2">
              <li><span className="font-medium">Age Range:</span> {wizardData.age}</li>
              <li><span className="font-medium">Theme:</span> {wizardData.theme}</li>
              <li><span className="font-medium">Subject:</span> {wizardData.subject}</li>
              <li><span className="font-medium">Message:</span> {wizardData.message}</li>
              <li><span className="font-medium">Art Style:</span> {wizardData.style}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-500 mb-2">Personal Note</h3>
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              {wizardData.customNote || <span className="text-gray-400 italic">No personal note added</span>}
            </div>
          </div>
        </div>
        
        {wizardData.photoPreview && (
          <div className="mt-6">
            <h3 className="font-medium text-gray-500 mb-2">Custom Photo</h3>
            <div className="w-32 h-32 rounded border border-gray-200 overflow-hidden">
              <img 
                src={wizardData.photoPreview} 
                alt="Uploaded photo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewContent;
