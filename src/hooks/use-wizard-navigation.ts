
import { useState, useEffect } from 'react';

export const useWizardNavigation = (totalPages: number) => {
  const [pageFlipping, setPageFlipping] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [currentPage, setCurrentPage] = useState(1);
  const [animationComplete, setAnimationComplete] = useState(true);
  
  // Navigation functions
  const goToNextPage = () => {
    if (currentPage < totalPages && !pageFlipping && animationComplete) {
      setPageFlipping(true);
      setAnimationComplete(false);
      setDirection('next');
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setPageFlipping(false);
      }, 500); // Match the animation duration
    }
  };
  
  const goToPrevPage = () => {
    if (currentPage > 1 && !pageFlipping && animationComplete) {
      setPageFlipping(true);
      setAnimationComplete(false);
      setDirection('prev');
      setTimeout(() => {
        setCurrentPage(prev => prev - 1);
        setPageFlipping(false);
      }, 500); // Match the animation duration
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && !pageFlipping && currentPage < totalPages && animationComplete) {
        goToNextPage();
      } else if (e.key === 'ArrowLeft' && currentPage > 1 && !pageFlipping && animationComplete) {
        goToPrevPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, pageFlipping, animationComplete]);
  
  const handleAnimationComplete = () => {
    console.log('Animation complete for page', currentPage);
    setAnimationComplete(true);
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
