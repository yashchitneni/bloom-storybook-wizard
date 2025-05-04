
import { useState, useEffect } from 'react';

export const useWizardNavigation = (totalPages: number) => {
  const [pageFlipping, setPageFlipping] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Navigation functions
  const goToNextPage = () => {
    if (currentPage < totalPages && !pageFlipping) {
      setPageFlipping(true);
      setDirection('next');
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setPageFlipping(false);
      }, 500); // Match the animation duration
    }
  };
  
  const goToPrevPage = () => {
    if (currentPage > 1 && !pageFlipping) {
      setPageFlipping(true);
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
      if (e.key === 'ArrowRight' && !pageFlipping && currentPage < totalPages) {
        goToNextPage();
      } else if (e.key === 'ArrowLeft' && currentPage > 1 && !pageFlipping) {
        goToPrevPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, pageFlipping]);

  return {
    currentPage,
    pageFlipping,
    direction,
    goToNextPage,
    goToPrevPage,
    setCurrentPage
  };
};
