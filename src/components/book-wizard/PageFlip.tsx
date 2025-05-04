
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PageFlipProps {
  children: React.ReactNode;
  isFlipping: boolean;
  direction: 'next' | 'prev';
  onAnimationComplete: () => void;
}

const PageFlip: React.FC<PageFlipProps> = ({
  children,
  isFlipping,
  direction,
  onAnimationComplete
}) => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFlipping && pageRef.current) {
      // Reset any inline styles when not flipping
      pageRef.current.style.transform = '';
      // Ensure animation complete is called when flipping is done
      onAnimationComplete();
    }
  }, [isFlipping, onAnimationComplete]);

  // Animation variants for the page flip effect
  const pageVariants = {
    initial: (direction: 'next' | 'prev') => ({
      rotateY: direction === 'next' ? 0 : -180,
      zIndex: 1,
    }),
    animate: (direction: 'next' | 'prev') => ({
      rotateY: direction === 'next' ? -180 : 0,
      transition: { 
        duration: 0.5, 
        ease: [0.4, 0.0, 0.2, 1] 
      },
      zIndex: 2,
    }),
    exit: (direction: 'next' | 'prev') => ({
      rotateY: direction === 'next' ? -180 : 0,
      zIndex: 0,
      transition: { 
        duration: 0.5, 
        ease: [0.4, 0.0, 0.2, 1] 
      }
    })
  };

  // Shadow variants for the 3D effect
  const shadowVariants = {
    initial: (direction: 'next' | 'prev') => ({
      opacity: 0,
      x: direction === 'next' ? '0%' : '100%',
    }),
    animate: {
      opacity: [0, 0.3, 0],
      x: ['0%', '50%', '100%'],
      transition: { 
        duration: 0.5, 
        ease: [0.4, 0.0, 0.2, 1],
        times: [0, 0.5, 1]
      }
    },
    exit: {
      opacity: 0,
    }
  };

  return (
    <div className="relative w-full h-full perspective">
      <motion.div
        ref={pageRef}
        className="absolute w-full h-full book-page"
        style={{
          transformOrigin: direction === 'next' ? 'left center' : 'right center',
          backfaceVisibility: 'hidden',
          transformStyle: 'preserve-3d'
        }}
        custom={direction}
        variants={pageVariants}
        initial="initial"
        animate={isFlipping ? "animate" : "initial"}
        exit="exit"
        onAnimationComplete={() => {
          console.log("Animation complete event fired");
          if (isFlipping) {
            onAnimationComplete();
          }
        }}
      >
        <div className="absolute inset-0 bg-[#FFF9F2] border border-[#FEF6EC] rounded-xl overflow-hidden shadow-md">
          {children}
        </div>
      </motion.div>
      
      {isFlipping && (
        <motion.div 
          className="absolute inset-0 shadow-gradient pointer-events-none"
          style={{
            background: direction === 'next' 
              ? 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)' 
              : 'linear-gradient(to left, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)'
          }}
          custom={direction}
          variants={shadowVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        />
      )}
    </div>
  );
};

export default PageFlip;
