
import React from 'react';
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
  // Animation variants for the page flip effect
  const pageVariants = {
    initial: {
      rotateY: 0,
      zIndex: 1,
    },
    flip: {
      rotateY: direction === 'next' ? -180 : 180,
      transition: { 
        duration: 0.3, 
        ease: [0.4, 0.0, 0.2, 1] 
      },
      zIndex: 2,
    }
  };

  return (
    <div className="relative w-full h-full" style={{ perspective: '1200px' }}>
      <motion.div
        className="absolute w-full h-full"
        style={{
          transformOrigin: direction === 'next' ? 'left center' : 'right center',
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden'
        }}
        variants={pageVariants}
        animate={isFlipping ? "flip" : "initial"}
        onAnimationComplete={onAnimationComplete}
      >
        <div className="absolute inset-0 bg-[#FFF9F2] border border-[#FEF6EC] rounded-xl overflow-hidden shadow-md p-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default PageFlip;
