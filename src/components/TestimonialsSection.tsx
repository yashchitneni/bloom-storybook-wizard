
import Card from "./Card";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

const TestimonialsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const testimonials = [
    {
      quote: "My son couldn't stop reading his personalized adventure book! The illustrations captured his likeness perfectly.",
      author: "Sarah T.",
      rating: 5
    },
    {
      quote: "The quality of the story and illustrations exceeded my expectations. My daughter absolutely loves being the main character!",
      author: "Michael K.",
      rating: 5
    },
    {
      quote: "What a wonderful gift for my nephew. The PDF was delivered quickly and looks professional enough to be sold in stores!",
      author: "Jessica R.",
      rating: 5
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
    <section className="py-16 md:py-24 bg-lavender/30" ref={sectionRef}>
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold font-poppins"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7 }}
          >
            What Parents Say
          </motion.h2>
          <motion.p 
            className="mt-2 text-gray-600 font-lato"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Join hundreds of happy families
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <Card className="hover-lift h-full">
                <div className="flex flex-col h-full">
                  <div className="mb-4 flex">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-goldenYellow" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  <blockquote className="flex-grow">
                    <p className="italic text-gray-600 font-lato">"{testimonial.quote}"</p>
                  </blockquote>
                  
                  <footer className="mt-4 pt-4 border-t border-gray-100">
                    <p className="font-medium font-poppins">{testimonial.author}</p>
                  </footer>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
