
import React from 'react';
import Button from "../Button";
import { PreviewStepProps } from "@/types/wizard";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

const PreviewStep: React.FC<PreviewStepProps> = ({ 
  onNext, 
  onPrevious,
  wizardData
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Preview Your Storybook</h3>
      
      <div className="flex flex-col items-center">
        <motion.div 
          className="relative w-64 h-80 bg-mint-500/20 rounded-lg shadow-lg overflow-hidden"
          initial={{ rotateY: -90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Book Cover */}
          <div className="absolute inset-0 flex flex-col items-center p-4">
            <h3 className="text-lg font-bold font-fredoka mt-4 text-center">
              {wizardData.subject || "Your Amazing Story"}
            </h3>
            
            {wizardData.photoPreview && (
              <div className="mt-6 w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                <img 
                  src={wizardData.photoPreview} 
                  alt="Child" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="mt-auto mb-4 text-sm text-center">
              <p>A personalized adventure with</p>
              <p className="font-bold">Special messages inside!</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="mt-8 bg-gray-100 p-4 rounded-md max-w-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h4 className="font-bold mb-2">Story Summary:</h4>
          <p className="text-sm">
            A {wizardData.style.toLowerCase()} {wizardData.age} storybook about {wizardData.subject.toLowerCase()}, 
            with a focus on {wizardData.message.toLowerCase()}.
            {wizardData.customNote && (
              <span className="block mt-2 italic">"{wizardData.customNote}"</span>
            )}
          </p>
        </motion.div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={onNext} withArrow>Proceed to Checkout</Button>
      </div>
    </div>
  );
};

export default PreviewStep;
