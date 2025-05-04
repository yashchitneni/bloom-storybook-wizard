
import { useState } from 'react';

export const useWizardNavigation = (totalPages: number) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageFlipping, setPageFlipping] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  
  // Simplified navigation functions
  const goToNextPage = () => {
    if (currentPage < totalPages && !pageFlipping) {
      setDirection('next');
      setPageFlipping(true);
      
      // Update page after a brief delay to allow animation
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setPageFlipping(false);
      }, 300);
    }
  };
  
  const goToPrevPage = () => {
    if (currentPage > 1 && !pageFlipping) {
      setDirection('prev');
      setPageFlipping(true);
      
      // Update page after a brief delay to allow animation
      setTimeout(() => {
        setCurrentPage(prev => prev - 1);
        setPageFlipping(false);
      }, 300);
    }
  };

  // Simplified handler - no need for complex animation tracking
  const handleAnimationComplete = () => {
    console.log('Animation complete called for page', currentPage);
    // Animation is now handled by the timeout above
  };

  return {
    currentPage,
    pageFlipping,
    direction,
    goToNextPage,
    goToPrevPage,
    setCurrentPage,
    handleAnimationComplete
  };
};
