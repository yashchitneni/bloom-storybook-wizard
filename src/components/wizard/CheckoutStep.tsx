
import React from 'react';
import Button from "../Button";
import { CheckoutStepProps } from "@/types/wizard";
import { ChevronLeft } from "lucide-react";

const CheckoutStep: React.FC<CheckoutStepProps> = ({ 
  onPrevious,
  wizardData,
  onEmailChange,
  onSubmit,
  isSubmitting
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Almost there!</h3>
      
      <div className="bg-mint/20 p-4 rounded-lg">
        <p className="text-sm">
          We'll create a personalized {wizardData.style.toLowerCase()} adventure 
          for a {wizardData.age} child with a {wizardData.theme.toLowerCase()} theme 
          about {wizardData.subject.toLowerCase()} where they learn about {wizardData.message.toLowerCase()}.
          {wizardData.customNote ? ` We'll include your special note: "${wizardData.customNote}"` : ''}
        </p>
      </div>
      
      <div className="space-y-4">
        <label className="block text-sm font-medium">Email (for delivery)</label>
        <input
          type="email"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-persimmon"
          placeholder="your@email.com"
          value={wizardData.email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
      </div>
      
      <div className="p-4 border border-gray-200 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-medium">Total:</span>
          <span className="text-xl font-bold font-fredoka">$9.99</span>
        </div>
      </div>
      
      <Button 
        className="w-full py-3 text-center"
        onClick={onSubmit}
        disabled={isSubmitting || !wizardData.email}
      >
        <span className="mr-2">🔒</span> {isSubmitting ? "Processing..." : "Purchase & Create My Book"}
      </Button>
      
      <p className="text-xs text-center text-gray-500">
        Hardcover print option coming soon – join the waitlist after purchase.
      </p>
      
      <div className="flex justify-start pt-4">
        <Button variant="outline" onClick={onPrevious} disabled={isSubmitting}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
    </div>
  );
};

export default CheckoutStep;
