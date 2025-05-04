
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Card from "./Card";
import { ArrowRight } from "lucide-react";
import { Compare } from "./ui/compare";
import { motion } from "framer-motion";

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
    <section className="py-12">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <motion.h2 
            className="text-3xl font-bold mb-4 font-poppins"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            See the Transformation
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto font-lato"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            From a simple photo to a magical storybook character. Try the interactive slider!
          </motion.p>
        </div>
        
        <div className={cn(
          "max-w-3xl mx-auto transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <Card className="overflow-hidden shadow-lg p-0">
            <div className="flex justify-center items-center p-4 bg-lavender/20">
              <Compare
                firstImage={storybookCharacterUrl}
                secondImage={originalPhotoUrl}
                className="h-[400px] md:h-[500px] w-full rounded-lg border-4 border-transparent hover:border-goldenYellow/30 transition-colors duration-300"
                firstImageClassName="object-contain"
                secondImageClassname="object-contain"
                slideMode="drag"
                showHandlebar={true}
                autoplay={false}
              />
            </div>
            <div className="p-6 bg-gradient-to-r from-lavender/20 to-mintGreen/20">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-lg font-poppins">Storybook Character</h4>
                  <p className="text-gray-600 text-sm font-lato">Transformed illustration</p>
                </div>
                <ArrowRight className="text-goldenYellow mx-4" />
                <div>
                  <h4 className="font-bold text-lg font-poppins">Original Photo</h4>
                  <p className="text-gray-600 text-sm font-lato">Your child's picture</p>
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
