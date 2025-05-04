
import React from "react";
import { cn } from "@/lib/utils";
import { CakeIcon, BookIcon, PencilIcon, MessageSquareIcon, ImageIcon, User, UsersRound, ShoppingCartIcon } from "lucide-react";
import { motion } from "framer-motion";

interface WizardRoadmapProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
}

const WizardRoadmap: React.FC<WizardRoadmapProps> = ({
  currentStep,
  totalSteps,
  onStepClick
}) => {
  // Define step data with all the steps
  const steps = [{
    id: 1,
    icon: CakeIcon,
    label: "Age"
  }, {
    id: 2,
    icon: BookIcon,
    label: "Theme"
  }, {
    id: 3,
    icon: PencilIcon,
    label: "Subject"
  }, {
    id: 4,
    icon: MessageSquareIcon,
    label: "Message"
  }, {
    id: 5,
    icon: PencilIcon,
    label: "Personal Note"
  }, {
    id: 6,
    icon: ImageIcon,
    label: "Style"
  }, {
    id: 7,
    icon: User,
    label: "Child Profile"
  }, {
    id: 8,
    icon: UsersRound,
    label: "Characters"
  }, {
    id: 9,
    icon: ShoppingCartIcon,
    label: "Checkout"
  }];

  // Calculate progress percentage
  const progressPercentage = (currentStep - 1) / (totalSteps - 1) * 100;
  
  return (
    <nav aria-label="Form progress" className="w-full mb-10 overflow-x-auto">
      {/* Mobile View */}
      <div className="sm:hidden flex flex-col relative px-4">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;
          const isClickable = step.id <= currentStep + 1;
          
          return (
            <div key={step.id} className="flex items-center mb-4 last:mb-0">
              {/* Vertical connector */}
              {index > 0 && (
                <div 
                  className="absolute h-full w-0.5 bg-gray-200 left-4 z-0" 
                  style={{ top: 0 }}
                >
                  <motion.div 
                    className="w-full bg-persimmon" 
                    initial={{ height: 0 }}
                    animate={{ height: currentStep > index ? "100%" : "0%" }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
              
              <motion.button 
                disabled={!isClickable}
                aria-label={`Step ${step.id} of ${totalSteps}: ${step.label}`}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center z-10 mr-3",
                  isClickable ? "cursor-pointer" : "cursor-not-allowed",
                  isActive ? "bg-persimmon ring-4 ring-persimmon/20" : 
                  isCompleted ? "bg-persimmon" : "bg-gray-200"
                )}
                onClick={() => isClickable && onStepClick?.(step.id)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.15 }}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  <step.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-gray-600")} />
                )}
              </motion.button>
              
              <span className={cn(
                "text-sm font-medium",
                isActive ? "text-persimmon font-bold" : "text-darkText"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default WizardRoadmap;
