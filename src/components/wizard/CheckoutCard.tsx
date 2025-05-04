
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

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Complete Your Order</h4>
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
            <h4 className="font-medium mb-2">Order Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Personalized Storybook PDF</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>$0.00</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button
            onClick={onSubmit}
            disabled={isSubmitting || !wizardData.email}
            className="w-full md:w-auto"
            size="lg"
          >
            {isSubmitting ? "Creating Your Story..." : "Create My Story"}
          </Button>
        </div>
        
        <p className="text-xs text-center text-gray-500">
          By proceeding, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default CheckoutCard;
