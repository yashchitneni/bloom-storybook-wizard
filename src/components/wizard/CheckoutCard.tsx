
import React from 'react';
import Button from "../Button";
import { WizardData } from "@/types/wizard";
import { useAuth } from "@/contexts/AuthContext";

interface CheckoutCardProps {
  wizardData: WizardData;
  onEmailChange: (email: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isActive: boolean;
}

const CheckoutCard: React.FC<CheckoutCardProps> = ({
  wizardData,
  onEmailChange,
  onSubmit,
  isSubmitting,
  isActive
}) => {
  const { user } = useAuth();

  const requiredFieldsCompleted = () => {
    return (
      wizardData.email && 
      wizardData.childName && 
      wizardData.childGender && 
      wizardData.age && 
      wizardData.theme && 
      wizardData.subject && 
      wizardData.message && 
      wizardData.style
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Complete Your Story</h4>
          <p className="text-gray-600">
            Enter your email to receive your personalized storybook and updates on your order.
          </p>
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-persimmon"
              placeholder="your@email.com"
              value={wizardData.email}
              onChange={(e) => onEmailChange(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="bg-cream rounded-lg p-4">
            <h4 className="font-medium mb-2">Story Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-gray-600">Child:</span>
                <span className="col-span-2">{wizardData.childName || 'Not specified'}</span>
                
                <span className="text-gray-600">Age Group:</span>
                <span className="col-span-2">{wizardData.age || 'Not specified'}</span>
                
                <span className="text-gray-600">Theme:</span>
                <span className="col-span-2">{wizardData.theme || 'Not specified'}</span>
                
                <span className="text-gray-600">Subject:</span>
                <span className="col-span-2">{wizardData.subject || 'Not specified'}</span>
                
                <span className="text-gray-600">Message:</span>
                <span className="col-span-2">{wizardData.message || 'Not specified'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button
            onClick={onSubmit}
            disabled={isSubmitting || !requiredFieldsCompleted()}
            className="w-full md:w-auto"
            size="lg"
          >
            {isSubmitting ? "Creating Your Story..." : "Create My Story"}
          </Button>
        </div>
        
        <div>
          {!requiredFieldsCompleted() && (
            <p className="text-xs text-center text-red-500">
              Please complete all required fields before creating your story.
            </p>
          )}
        </div>
        
        <p className="text-xs text-center text-gray-500">
          By proceeding, you agree to our Terms of Service and Privacy Policy.
          {!user && <span className="block mt-1">You'll be prompted to create an account after submission to access your story.</span>}
        </p>
      </div>
    </div>
  );
};

export default CheckoutCard;
