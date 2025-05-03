
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Card from "./Card";
import { ArrowRight } from "lucide-react";
import { Compare } from "./ui/compare";

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
  
  // Storybook character appears on the left (firstImage), original photo on the right (secondImage)
  const storybookCharacterUrl = "/lovable-uploads/499fd9c6-b707-4bc4-a99a-1b60715c2453.png";
  const originalPhotoUrl = "/lovable-uploads/14e7ca41-a4ca-4ade-8f9c-6b539eeedd03.png";

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
            <div className="flex justify-center items-center p-4 bg-lightBg">
              <Compare
                firstImage={storybookCharacterUrl}
                secondImage={originalPhotoUrl}
                className="h-[400px] md:h-[500px] w-full rounded-lg"
                firstImageClassName="object-contain"
                secondImageClassname="object-contain"
                slideMode="drag"
                showHandlebar={true}
                autoplay={false}
              />
            </div>
            <div className="p-6 bg-gradient-to-r from-mint/20 to-sunshine/20">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-lg">Storybook Character</h4>
                  <p className="text-gray-600 text-sm">Transformed illustration</p>
                </div>
                <ArrowRight className="text-persimmon mx-4" />
                <div>
                  <h4 className="font-bold text-lg">Original Photo</h4>
                  <p className="text-gray-600 text-sm">Your child's picture</p>
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
