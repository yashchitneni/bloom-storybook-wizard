
import React from 'react';

interface WizardPageProps {
  children: React.ReactNode;
}

const WizardPage: React.FC<WizardPageProps> = ({ children }) => {
  return (
    <div className="p-6 md:p-8 w-full h-full min-h-[500px] flex flex-col">
      {children}
    </div>
  );
};

export default WizardPage;
