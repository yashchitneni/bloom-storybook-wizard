
import React from 'react';

const WizardHeader: React.FC = () => {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Create a Personalized Children's Book</h1>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Choose a story theme, add a name and personal details, and create a unique eBook. 
        You can then order the story as a hardcover book for a lasting keepsake.
      </p>
    </div>
  );
};

export default WizardHeader;
