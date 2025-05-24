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
          {/* Child Information */}
          <div className="flex-shrink-0">
            {wizardData.childPhotoPreview && (
              <div className="relative w-40 h-40 rounded-lg overflow-hidden shadow-md mx-auto md:mx-0">
                <img 
                  src={wizardData.childPhotoPreview} 
                  alt="Child" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="text-center md:text-left mt-2">
              <h4 className="text-lg font-bold text-gray-900">{wizardData.childName}</h4>
              <p className="text-sm text-gray-500">{wizardData.childGender}</p>
            </div>
          </div>
          
          {/* Story details */}
          <div className="flex-grow space-y-4">
            <div>
              <h4 className="text-lg font-bold text-gray-900">Your Story Details</h4>
              <div className="mt-2">
                <div className="space-y-2">
                  <div className="flex">
                    <span className="font-medium w-28">Theme:</span>
                    <span>{wizardData.theme}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-28">Style:</span>
                    <span>{wizardData.style}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-28">Subject:</span>
                    <span>{wizardData.subject}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-28">Message:</span>
                    <span>{wizardData.message}</span>
                  </div>
                  {wizardData.customNote && (
                    <div className="flex">
                      <span className="font-medium w-28">Custom Note:</span>
                      <span>{wizardData.customNote}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {wizardData.specialDetails && (
              <div>
                <h4 className="text-md font-bold text-gray-900">Special Details</h4>
                <p className="mt-1 text-gray-700 bg-gray-50 p-3 rounded-md">{wizardData.specialDetails}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Additional characters */}
        {wizardData.characters.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-md font-bold text-gray-900 mb-3">Additional Characters</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {wizardData.characters.map((character) => (
                <div key={character.id} className="flex flex-col items-center p-3 rounded-lg border border-gray-200">
                  {character.photoPreview ? (
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img 
                        src={character.photoPreview} 
                        alt={character.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <p className="mt-2 font-medium text-center">{character.name}</p>
                  <p className="text-sm text-gray-500 text-center">{character.relation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
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
