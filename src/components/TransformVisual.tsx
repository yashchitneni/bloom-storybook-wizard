
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Card from "./Card";
import { ArrowRight } from "lucide-react";

interface ImageComparisonProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
}

const ImageComparison = ({
  beforeImage,
  afterImage,
  className,
}: ImageComparisonProps) => {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setPosition(percent);
    }
  };

  useEffect(() => {
    const handleMouseUpGlobal = () => {
      setIsDragging(false);
    };

    window.addEventListener("mouseup", handleMouseUpGlobal);
    return () => {
      window.removeEventListener("mouseup", handleMouseUpGlobal);
    };
  }, []);

  return (
    <div
      className={cn(
        "relative select-none overflow-hidden rounded-lg",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={(e) => {
        const touch = e.touches[0];
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
        const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setPosition(percent);
      }}
    >
      <div className="relative h-full w-full">
        <div className="h-full w-full">
          <img
            src={afterImage}
            className="h-full w-full object-cover"
            alt="After transformation"
          />
        </div>
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <img
            src={beforeImage}
            className="h-full w-full object-cover"
            alt="Before transformation"
          />
        </div>
        <div
          className="absolute bottom-0 left-0 top-0 border-r-2 border-white"
          style={{
            left: `calc(${position}% - 1px)`,
          }}
        >
          <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-full border-2 border-white bg-white/30 backdrop-blur" />
        </div>
      </div>
    </div>
  );
};

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
  
  const beforeImageUrl = "/lovable-uploads/14e7ca41-a4ca-4ade-8f9c-6b539eeedd03.png";
  const afterImageUrl = "/lovable-uploads/499fd9c6-b707-4bc4-a99a-1b60715c2453.png";

  return (
    <section className="py-12 bg-white">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">See the Transformation</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From a simple photo to a magical storybook character. Try the interactive slider!
          </p>
        </div>
        
        <div className={cn(
          "max-w-3xl mx-auto transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <Card className="overflow-hidden shadow-lg p-0">
            <ImageComparison 
              beforeImage={beforeImageUrl} 
              afterImage={afterImageUrl} 
              className="h-[400px] md:h-[500px] w-full"
            />
            <div className="p-6 bg-gradient-to-r from-mint/20 to-sunshine/20">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-lg">Original Photo</h4>
                  <p className="text-gray-600 text-sm">Your child's picture</p>
                </div>
                <ArrowRight className="text-persimmon mx-4" />
                <div>
                  <h4 className="font-bold text-lg">Storybook Character</h4>
                  <p className="text-gray-600 text-sm">Transformed illustration</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TransformVisual;
