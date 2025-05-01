
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Card from "./Card";
import { ArrowRight } from "lucide-react";

const TransformVisual: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Animation trigger on component mount
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-[500px] w-full">
      {/* Photo Card (Before) */}
      <div
        className={cn(
          "absolute left-10 top-20 md:left-0 transform -rotate-5 transition-all duration-500",
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
        )}
      >
        <Card className="w-[280px] h-[350px] p-3 border-8 border-white">
          <div className="w-full h-full bg-gray-100 overflow-hidden rounded">
            <img 
              src="public/lovable-uploads/499fd9c6-b707-4bc4-a99a-1b60715c2453.png" 
              alt="Child's photo" 
              className="w-full h-full object-cover"
            />
          </div>
        </Card>
      </div>

      {/* Storybook Card (After) */}
      <div
        className={cn(
          "absolute right-10 md:right-0 top-10 transform rotate-5 transition-all duration-500",
          isVisible ? "opacity-100 translate-x-0 delay-200" : "opacity-0 translate-x-16 delay-200"
        )}
      >
        <Card className="w-[320px] h-[460px] overflow-hidden">
          <img 
            src="public/lovable-uploads/14e7ca41-a4ca-4ade-8f9c-6b539eeedd03.png" 
            alt="The Camouflage Kid book cover" 
            className="w-full h-full object-contain"
          />
        </Card>
      </div>

      {/* Transformation Arrow */}
      <div
        className={cn(
          "absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
          isVisible ? "opacity-100 delay-300" : "opacity-0 delay-300"
        )}
      >
        <div className="hidden md:block">
          <ArrowRight size={48} className="text-persimmon" />
        </div>
        <div className="block md:hidden">
          <ArrowRight size={32} className="text-persimmon transform rotate-90" />
        </div>
      </div>
    </div>
  );
};

export default TransformVisual;
