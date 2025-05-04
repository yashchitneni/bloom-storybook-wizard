
import React from 'react';
import { WizardData } from '@/types/wizard';

interface PreviewCardProps {
  wizardData: WizardData;
  isActive: boolean;
}

const PreviewCard: React.FC<PreviewCardProps> = ({ 
  wizardData,
  isActive
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Photo preview */}
          {wizardData.photoPreview && (
            <div className="flex-shrink-0">
              <div className="relative w-40 h-40 rounded-lg overflow-hidden shadow-md mx-auto md:mx-0">
                <img 
                  src={wizardData.photoPreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center md:text-left mt-2 text-sm text-gray-500">
                Style: {wizardData.style}
              </div>
            </div>
          )}
          
          {/* Story details */}
          <div className="flex-grow space-y-4">
            <div>
              <h4 className="text-lg font-bold text-gray-900">Your Story Details</h4>
              <div className="mt-2">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex">
                    <span className="font-medium w-28">Age Range:</span>
                    <span>{wizardData.age}</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium w-28">Theme:</span>
                    <span>{wizardData.theme}</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium w-28">Subject:</span>
                    <span>{wizardData.subject}</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium w-28">Message:</span>
                    <span>{wizardData.message}</span>
                  </li>
                  {wizardData.moral && (
                    <li className="flex">
                      <span className="font-medium w-28">Moral:</span>
                      <span>{wizardData.moral}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            
            {wizardData.customNote && (
              <div>
                <h4 className="text-md font-bold text-gray-900">Personal Note</h4>
                <p className="mt-1 text-gray-700 bg-gray-50 p-3 rounded-md italic">"{wizardData.customNote}"</p>
              </div>
            )}
            
            {wizardData.specialDetails && (
              <div>
                <h4 className="text-md font-bold text-gray-900">Special Details</h4>
                <p className="mt-1 text-gray-700 bg-gray-50 p-3 rounded-md">{wizardData.specialDetails}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <p className="text-gray-600 text-center">
            Your personalized storybook will be created based on these details. Continue to checkout to complete your order.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PreviewCard;
