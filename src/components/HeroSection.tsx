import { ArrowRight } from "lucide-react";
import Button from "./Button";
import TransformVisual from "./TransformVisual";
import { useNavigate } from "react-router-dom";
const HeroSection = () => {
  const navigate = useNavigate();
  const handleCreateNow = () => {
    navigate('/wizard');
  };
  return <section className="py-12 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Turn Your Kid's Photo into a Magical Storybook 🌟
            </h1>
            <h4 className="text-lg text-gray-600">
              Upload one picture, pick a theme, receive a printable PDF adventure.
            </h4>
            <div>
              <Button onClick={handleCreateNow} size="lg" withArrow>
                Create Now
              </Button>
            </div>
            
            {/* Trust Row */}
            <div className="pt-6">
              
              
            </div>
          </div>
          
          {/* Right Content - Transformation Visual */}
          <div className="relative">
            <TransformVisual />
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;