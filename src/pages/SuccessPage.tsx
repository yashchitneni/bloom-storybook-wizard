
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Clear the wizard data from localStorage after successful checkout
    localStorage.removeItem('wizardData');
    
    if (sessionId) {
      // You could verify the session here if needed
      toast.success("Payment successful! We're creating your storybook now.");
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
          {isLoading ? (
            <div className="animate-pulse">
              <p className="text-xl">Loading...</p>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Thank You!</h1>
              <p className="text-xl text-gray-600 mb-8">
                Your payment was successful and we're creating your personalized storybook now.
              </p>
              
              <div className="bg-cyan-50 border border-cyan-100 p-4 rounded-lg mb-8">
                <h2 className="text-lg font-medium text-cyan-800 mb-2">What happens next?</h2>
                <ol className="text-left space-y-2 text-cyan-700">
                  <li className="flex">
                    <span className="mr-2">1.</span>
                    <span>We'll send your storybook to your email within 24-48 hours.</span>
                  </li>
                  <li className="flex">
                    <span className="mr-2">2.</span>
                    <span>You'll receive a PDF that you can view on any device or print at home.</span>
                  </li>
                  <li className="flex">
                    <span className="mr-2">3.</span>
                    <span>Create an account to access your storybooks anytime.</span>
                  </li>
                </ol>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/" 
                  className="px-6 py-3 bg-persimmon text-white rounded-lg hover:bg-persimmon/90 transition-colors"
                >
                  Return Home
                </a>
                <a 
                  href="/wizard" 
                  className="px-6 py-3 bg-mint text-black rounded-lg hover:bg-mint/90 transition-colors"
                >
                  Create Another Story
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SuccessPage;
