
import React from "react";
import { cn } from "@/lib/utils";
import { CakeIcon, BookIcon, CameraIcon, CheckIcon, MessageSquareIcon, PencilIcon, ImageIcon, ShoppingCartIcon } from "lucide-react";
import { motion } from "framer-motion";

interface WizardRoadmapProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
}

const WizardRoadmap: React.FC<WizardRoadmapProps> = ({
  currentStep,
  totalSteps,
  onStepClick,
}) => {
  // Define step data with all the new steps
  const steps = [
    { id: 1, icon: CakeIcon, label: "Age" },
    { id: 2, icon: BookIcon, label: "Theme" },
    { id: 3, icon: PencilIcon, label: "Subject" },
    { id: 4, icon: MessageSquareIcon, label: "Message" },
    { id: 5, icon: PencilIcon, label: "Custom Note" },
    { id: 6, icon: ImageIcon, label: "Photo & Style" },
    { id: 7, icon: CameraIcon, label: "Preview" },
    { id: 8, icon: ShoppingCartIcon, label: "Checkout" },
  ];

  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <nav 
      aria-label="Form progress" 
      className="w-full mb-10 overflow-x-auto"
    >
      {/* Desktop View */}
      <div className="hidden sm:flex flex-col relative px-8 min-w-max">
        {/* Connector line */}
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded-full z-0 mx-auto" style={{ width: "calc(100% - 4rem)" }}>
          <motion.div 
            className="h-full bg-persimmon rounded-full" 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        {/* Icons */}
        <div className="flex justify-between relative z-10" style={{ gap: "48px" }}>
          {steps.map((step, index) => {
            const isCompleted = step.id <= currentStep;
            const isActive = step.id === currentStep;
            const isClickable = step.id <= currentStep + 1;
            
            return (
              <motion.div 
                key={step.id} 
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.15 }}
              >
                <motion.button
                  disabled={!isClickable}
                  aria-label={`Step ${step.id} of ${totalSteps}: ${step.label}`}
                  aria-current={isActive ? "step" : undefined}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all", 
                    isClickable ? "cursor-pointer" : "cursor-not-allowed",
                    isCompleted ? "bg-persimmon hover:bg-persimmon/90" : "bg-gray-200 hover:bg-gray-300"
                  )}
                  onClick={() => isClickable && onStepClick?.(step.id)}
                  whileHover={isClickable ? { scale: 1.05 } : {}}
                  animate={isActive ? { scale: [1.1, 1] } : {}}
                  transition={{ duration: 0.2 }}
                >
                  <step.icon className={cn(
                    "h-5 w-5",
                    isCompleted ? "text-white" : "text-gray-600"
                  )} />
                </motion.button>
                <span className="mt-6 text-xs font-bold text-darkText">{step.label}</span>
                {isClickable && (
                  <span className="roadmap-tooltip">Go to step {step.id}</span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Mobile View */}
      <div className="sm:hidden flex flex-col relative px-4">
        {steps.map((step, index) => {
          const isCompleted = step.id <= currentStep;
          const isActive = step.id === currentStep;
          const isClickable = step.id <= currentStep + 1;
          
          return (
            <div key={step.id} className="flex items-center mb-4 last:mb-0">
              {/* Vertical connector */}
              {index > 0 && (
                <div className="absolute h-full w-0.5 bg-gray-200 left-4 z-0" style={{ top: 0 }}>
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
                  isCompleted ? "bg-persimmon" : "bg-gray-200"
                )}
                onClick={() => isClickable && onStepClick?.(step.id)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.15 }}
              >
                <step.icon className={cn(
                  "h-4 w-4",
                  isCompleted ? "text-white" : "text-gray-600"
                )} />
              </motion.button>
              <span className="text-xs font-bold text-darkText">{step.label}</span>
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default WizardRoadmap;
