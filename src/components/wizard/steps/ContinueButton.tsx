
import React from 'react';
import Button from '@/components/Button';

interface ContinueButtonProps {
  onClick: () => void;
}

const ContinueButton: React.FC<ContinueButtonProps> = ({ onClick }) => {
  return (
    <div className="flex justify-center pt-8">
      <Button 
        onClick={onClick}
        size="lg"
        withArrow
      >
        Continue
      </Button>
    </div>
  );
};

export default ContinueButton;
