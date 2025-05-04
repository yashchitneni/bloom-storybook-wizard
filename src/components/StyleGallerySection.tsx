
import { useState, useRef } from "react";
import { getStyleImageUrl, getFallbackStyleImageUrl } from "@/utils/image-utils";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";

const StyleGallerySection = () => {
  const styles = [
    {
      name: "Retro",
      description: "Pixel art style with nostalgic retro vibes",
    },
    {
      name: "3D",
      description: "Modern 3D rendered illustrations",
    },
    {
      name: "Picture Book",
      description: "Charming hand-drawn picture book illustrations",
    },
    {
      name: "Watercolor",
      description: "Soft and dreamy watercolor paintings",
    }
  ];

  const [hoveredStyle, setHoveredStyle] = useState<number | null>(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const scrollToWizard = () => {
    document.getElementById('wizard')?.scrollIntoView({ behavior: 'smooth' });
  };

  const getImageUrl = (styleName: string): string => {
    try {
      // Try to get the image from Supabase storage first
      return getStyleImageUrl(styleName);
    } catch (error) {
      console.error(`Error loading image for ${styleName}:`, error);
      // Fall back to local images if storage fails
      return getFallbackStyleImageUrl(styleName);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.7,
        type: "spring",
        stiffness: 100
      }
    })
  };

  return (
    <section className="py-16 md:py-24 bg-mintGreen/20" ref={sectionRef}>
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold font-poppins"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7 }}
          >
            Choose Your Style
          </motion.h2>
          <motion.p 
            className="mt-2 text-gray-600 font-lato"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Pick the perfect illustration style for your story
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {styles.map((style, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="h-full"
            >
              <div 
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:-translate-y-2 flex flex-col h-full"
                onMouseEnter={() => setHoveredStyle(index)}
                onMouseLeave={() => setHoveredStyle(null)}
                onClick={scrollToWizard}
                style={{
                  boxShadow: hoveredStyle === index ? "0 10px 25px -5px rgba(255, 215, 0, 0.4)" : ""
                }}
              >
                <div className="aspect-[4/5] relative">
                  <img 
                    src={getImageUrl(style.name)} 
                    alt={`${style.name} illustration style`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Style Label */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white font-bold font-poppins">{style.name}</p>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className={`
                    absolute inset-0 bg-goldenYellow transition-all duration-300 flex items-center justify-center
                    ${hoveredStyle === index ? 'opacity-80' : 'opacity-0'}
                  `}>
                    <span className="text-white font-bold text-lg font-poppins">Select</span>
                  </div>
                </div>
                
                <div className="p-6 text-center flex-grow flex flex-col justify-between">
                  <h3 className="font-bold mb-1 font-poppins">{style.name}</h3>
                  <p className="text-sm text-gray-600 font-lato">{style.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StyleGallerySection;
