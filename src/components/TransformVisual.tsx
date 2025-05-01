
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
              src="https://images.unsplash.com/photo-1501286353178-1ec881214838" 
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
        <Card className="w-[320px] h-[460px] border-8 border-persimmon bg-sunshine flex flex-col items-center justify-center">
          <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-full w-40 h-40 mb-6 overflow-hidden border-4 border-persimmon">
              {/* Stylized character version - cartoon style filter applied */}
              <img 
                src="https://images.unsplash.com/photo-1501286353178-1ec881214838" 
                alt="Stylized character" 
                className="w-full h-full object-cover filter saturate-150"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>
            <h3 className="font-fredoka text-3xl text-darkText mb-2">Mia's Adventure</h3>
            <p className="text-sm text-darkText opacity-75">A magical journey</p>
          </div>
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

      {/* Supporting Badges */}
      <div
        className={cn(
          "absolute bottom-4 left-0 right-0 flex justify-center gap-4 transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0 delay-600" : "opacity-0 translate-y-8 delay-600"
        )}
      >
        {/* 10+ Pages Badge */}
        <Card className="w-[120px] h-[60px] bg-mint/20 flex items-center justify-center">
          <div className="text-lg font-fredoka text-mint">10+ Pages</div>
        </Card>

        {/* 5★ Customer Rating Badge */}
        <Card className="w-[120px] h-[60px] flex items-center justify-center gap-1">
          <div className="text-lg font-fredoka text-persimmon">5★</div>
          <div className="text-xs">Rating</div>
        </Card>
      </div>

      {/* Mobile view - stacked version */}
      <div className="md:hidden flex flex-col items-center space-y-6 pt-8">
        {/* Mobile version is handled with absolute positioning above */}
      </div>
    </div>
  );
};

export default TransformVisual;
