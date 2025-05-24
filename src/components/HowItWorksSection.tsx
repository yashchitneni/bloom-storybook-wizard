import Card from "./Card";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const HowItWorksSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const steps = [
    {
      icon: "📸",
      title: "Snap & Upload",
      description: "Choose a favorite photo of your child to be the star of their story."
    },
    {
      icon: "🪄",
      title: "Pick Adventure",
      description: "Select a theme and art style for a personalized experience."
    },
    {
      icon: "📚",
      title: "Get PDF",
      description: "Receive your printable storybook PDF within 2 hours via email."
    }
  ];

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
    <section className="py-16 md:py-24 bg-lavender/50" ref={sectionRef}>
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold font-poppins"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7 }}
          >
            How It Works
          </motion.h2>
          <motion.p 
            className="mt-2 text-gray-600 font-lato"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Creating personalized stories in three simple steps
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <Card className="text-center p-8 rounded-2xl" hoverEffect>
                <div className="text-5xl mb-5 animate-float">{step.icon}</div>
                <h3 className="text-xl font-bold mb-3 font-poppins">{step.title}</h3>
                <p className="text-gray-600 font-lato">{step.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
