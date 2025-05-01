
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Card from "./Card";

const CardCluster: React.FC = () => {
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
      {/* Book Cover Card - Center */}
      <div
        className={cn(
          "absolute left-1/2 transform -translate-x-1/2 transition-all duration-500",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-105"
        )}
      >
        <Card 
          className="w-[320px] h-[460px] flex items-center justify-center bg-sunshine"
        >
          <span className="font-fredoka text-4xl">Book Cover</span>
        </Card>
      </div>

      {/* 5-Star Rating Card - Top Right */}
      <div
        className={cn(
          "absolute right-0 top-8 transform rotate-6 transition-all duration-500 delay-200",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-16"
        )}
      >
        <Card className="w-[160px] h-[160px] flex flex-col items-center justify-center">
          <div className="text-4xl font-fredoka text-persimmon">5★</div>
          <div className="mt-2 text-sm">Customer Rating</div>
        </Card>
      </div>

      {/* Pages Per Book Card - Top Left-ish */}
      <div
        className={cn(
          "absolute left-8 top-16 transform -rotate-6 transition-all duration-500 delay-300",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-16"
        )}
      >
        <Card className="w-[180px] h-[180px] bg-mint/20 flex flex-col items-center justify-center">
          <div className="text-3xl font-fredoka text-mint">10+</div>
          <div className="mt-1 text-sm">Pages per Book</div>
        </Card>
      </div>

      {/* Mobile view - cards will be stacked and centered */}
      <div className="md:hidden flex flex-col items-center space-y-4 pt-8">
        <Card 
          className="w-[240px] h-[340px] flex items-center justify-center bg-sunshine"
        >
          <span className="font-fredoka text-3xl">Book Cover</span>
        </Card>

        <Card className="w-[140px] h-[140px] flex flex-col items-center justify-center">
          <div className="text-3xl font-fredoka text-persimmon">5★</div>
          <div className="mt-2 text-sm">Customer Rating</div>
        </Card>

        <Card className="w-[160px] h-[160px] bg-mint/20 flex flex-col items-center justify-center">
          <div className="text-2xl font-fredoka text-mint">10+</div>
          <div className="mt-1 text-sm">Pages per Book</div>
        </Card>
      </div>
    </div>
  );
};

export default CardCluster;
