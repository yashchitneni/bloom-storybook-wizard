import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client'; // For potential direct user session check
import { useAuth } from '@/contexts/AuthContext'; // To check if user logs in on this page

const SuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<{ email?: string, storyId?: string } | null>(null);

  const checkoutSessionId = searchParams.get('session_id');

  useEffect(() => {
    // If user becomes authenticated on this page (e.g. after clicking login/signup and returning)
    // and we have an order to claim, redirect to account or a specific page.
    if (user && checkoutSessionId) {
      // Optionally, trigger the association here if not handled by login/signup flow itself
      // For now, assume login/signup flow handles association via query params
      console.log('[SuccessPage] User is now logged in, potentially after claiming order:', checkoutSessionId);
      navigate('/account'); // Redirect to account page
      return;
    }

    if (!checkoutSessionId) {
      console.error('[SuccessPage] No session_id found in URL.');
      setError("No order information found. Please check your email for confirmation.");
      setIsLoading(false);
      return;
    }

    // Optional: Fetch minimal order details to display or get customer email if needed
    // This would require a new Supabase function that can safely return some details based on session_id
    // For now, we'll keep it simple.
    // Example: 
    // const fetchOrderInfo = async () => {
    //   try {
    //     const { data, error } = await supabase.functions.invoke('get-order-info-by-session', {
    //       body: { sessionId: checkoutSessionId }
    //     });
    //     if (error) throw error;
    //     setOrderDetails(data);
    //   } catch (err: any) {
    //     setError("Could not retrieve order details. " + err.message);
    //   }
    //   setIsLoading(false);
    // };
    // fetchOrderInfo();
    setIsLoading(false); // Remove if using fetchOrderInfo

  }, [checkoutSessionId, user, navigate]);

  if (isLoading) {
    return <div className="text-center p-10">Loading your confirmation...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-600">Error: {error}</div>;
  }

  const guestEmail = searchParams.get('guest_email'); // If stripe-checkout could pass this

  return (
    <div className="container mx-auto max-w-2xl text-center py-12 px-6">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Thank You!</h1>
        <p className="text-gray-600 text-lg mb-8">
          Your payment was successful and we're creating your personalized storybook now.
        </p>

        <div className="bg-blue-50 border border-blue-200 text-left p-6 rounded-lg mb-10">
          <h2 className="text-xl font-semibold text-blue-700 mb-3">What happens next?</h2>
          <ol className="list-decimal list-inside text-gray-700 space-y-2">
            <li>We'll send your storybook PDF to your email ({(orderDetails?.email || guestEmail || 'the email provided at checkout')}) within 24-48 hours.</li>
            <li>You'll receive a high-quality PDF that you can view on any device or print at home.</li>
            {!user && (
              <li>To easily access your storybook(s) anytime and manage your orders, create an account or log in.</li>
            )}
          </ol>
        </div>

        {!user && checkoutSessionId && (
          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <p className="text-gray-600 mb-4">Manage your stories and orders:</p>
            <Link 
              to={`/signup?claim_order_id=${checkoutSessionId}${guestEmail ? `&email=${encodeURIComponent(guestEmail)}`: ''}`}
              className="inline-block w-full md:w-auto bg-persimmon hover:bg-persimmon-dark text-white font-medium py-3 px-6 rounded-lg transition-colors duration-150 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-persimmon focus:ring-opacity-50 mb-3 md:mb-0"
            >
              Create an Account
            </Link>
            <Link 
              to={`/login?claim_order_id=${checkoutSessionId}`}
              className="inline-block w-full md:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-150 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
            >
              Log In
            </Link>
          </div>
        )}

        {user && (
            <p className="text-gray-600 text-lg mb-8">
                Your story will be automatically linked to your account: {user.email}
            </p>
        )}

        <div className="mt-12">
          <Link to="/wizard" className="text-persimmon hover:underline font-medium">
            Create Another Story
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
