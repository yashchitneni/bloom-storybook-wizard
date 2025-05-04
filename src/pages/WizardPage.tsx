
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookWizard from "@/components/book-wizard/BookWizard";

const WizardPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FEF6EC]">
      <Header />
      <main className="flex-grow">
        <BookWizard />
      </main>
      <Footer />
    </div>
  );
};

export default WizardPage;
