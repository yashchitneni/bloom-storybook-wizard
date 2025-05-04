
import { ArrowRight } from "lucide-react";
import Button from "./Button";
import TransformVisual from "./TransformVisual";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import StarParticles from "./StarParticles";

const HeroSection = () => {
  const navigate = useNavigate();
  
  const handleCreateNow = () => {
    navigate('/wizard');
  };
  
  return (
    <section className="relative py-20 lavender-gradient overflow-hidden">
      {/* Star particles background */}
      <StarParticles />
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-12">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 max-w-4xl font-poppins"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Turn Your Kid's Photo into a Magical Storybook ✨
          </motion.h1>
          
          <motion.h4 
            className="text-lg text-darkText/80 max-w-2xl font-lato mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Upload one picture, pick a theme, receive a printable PDF adventure.
          </motion.h4>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button 
              onClick={handleCreateNow} 
              size="lg" 
              withArrow
              className="bg-goldenYellow text-white hover:bg-goldenYellow/90"
            >
              Create Now
            </Button>
          </motion.div>
        </div>
        
        {/* Transformation Visual */}
        <motion.div 
          className="relative max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <TransformVisual />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
