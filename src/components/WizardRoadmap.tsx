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
  onStepClick
}) => {
  // Define step data with all the new steps
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
    label: "Custom Note"
  }, {
    id: 6,
    icon: ImageIcon,
    label: "Photo & Style"
  }, {
    id: 7,
    icon: CameraIcon,
    label: "Preview"
  }, {
    id: 8,
    icon: ShoppingCartIcon,
    label: "Checkout"
  }];

  // Calculate progress percentage
  const progressPercentage = (currentStep - 1) / (totalSteps - 1) * 100;
  return <nav aria-label="Form progress" className="w-full mb-10 overflow-x-auto">
      {/* Desktop View */}
      
      
      {/* Mobile View */}
      <div className="sm:hidden flex flex-col relative px-4">
        {steps.map((step, index) => {
        const isCompleted = step.id <= currentStep;
        const isActive = step.id === currentStep;
        const isClickable = step.id <= currentStep + 1;
        return <div key={step.id} className="flex items-center mb-4 last:mb-0">
              {/* Vertical connector */}
              {index > 0 && <div className="absolute h-full w-0.5 bg-gray-200 left-4 z-0" style={{
            top: 0
          }}>
                  <motion.div className="w-full bg-persimmon" initial={{
              height: 0
            }} animate={{
              height: currentStep > index ? "100%" : "0%"
            }} transition={{
              duration: 0.5
            }} />
                </div>}
              
              <motion.button disabled={!isClickable} aria-label={`Step ${step.id} of ${totalSteps}: ${step.label}`} aria-current={isActive ? "step" : undefined} className={cn("w-8 h-8 rounded-full flex items-center justify-center z-10 mr-3", isClickable ? "cursor-pointer" : "cursor-not-allowed", isCompleted ? "bg-persimmon" : "bg-gray-200")} onClick={() => isClickable && onStepClick?.(step.id)} initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            duration: 0.3,
            delay: index * 0.15
          }}>
                <step.icon className={cn("h-4 w-4", isCompleted ? "text-white" : "text-gray-600")} />
              </motion.button>
              <span className="text-xs font-bold text-darkText">{step.label}</span>
            </div>;
      })}
      </div>
    </nav>;
};
export default WizardRoadmap;