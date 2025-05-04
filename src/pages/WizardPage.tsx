
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Wizard from "@/components/Wizard";

const WizardPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 md:py-16 max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Create a Personalized Children's Book</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose a story theme, add a name and personal details, and create a unique eBook. 
              You can then order the story as a hardcover book for a lasting keepsake.
            </p>
          </div>
          
          <div id="wizard-container" className="mb-16">
            <Wizard />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WizardPage;
