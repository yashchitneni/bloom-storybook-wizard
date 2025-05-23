import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/Card";
import Button from "@/components/Button";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signUp } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const claimOrderId = searchParams.get('claim_order_id');
  const prefilledEmail = searchParams.get('email');

  useEffect(() => {
    if (prefilledEmail) {
      setEmail(prefilledEmail);
    }
  }, [prefilledEmail]);

  useEffect(() => {
    if (user && claimOrderId) {
      const associateOrder = async () => {
        console.log(`[SignupPage] User signed up. Attempting to associate order: ${claimOrderId}`);
        try {
          const { error: assocError } = await supabase.functions.invoke('associate-order-to-user', {
            body: { order_id_to_claim: claimOrderId }
          });
          if (assocError) {
            toast.error("Account created, but failed to link previous purchase: " + assocError.message);
            console.error("[SignupPage] Error associating order:", assocError);
          } else {
            toast.success("Account created and previous purchase linked!");
          }
        } catch (e: any) {
          toast.error("Account created, but an error occurred linking previous purchase: " + e.message);
          console.error("[SignupPage] Exception associating order:", e);
        }
        navigate('/account');
      };
      associateOrder();
    } else if (user) {
      navigate('/account');
    }
  }, [user, claimOrderId, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await signUp(email, password);
    } catch (err: any) {
      console.error("[SignupPage] Signup error:", err);
      setError(err.message || "Failed to create account. Please try again.");
      toast.error(err.message || "Failed to create account.");
    }
    setIsLoading(false);
  };

  if (user && !claimOrderId) {
    return (
      <div className="text-center p-10">
        <p>You are already logged in.</p>
        <Link to="/account" className="text-persimmon hover:underline">Go to your Account</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-select flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-persimmon font-fredoka">Create Your Account</h2>
            <p className="mt-2 text-sm text-gray-600">
              {claimOrderId ? "Sign up to access your newly created storybook!" : "Create an account to get started"}
            </p>
          </div>
          
          <Card className="p-6">
            <form className="space-y-6" onSubmit={handleSignup}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  autoComplete="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  disabled={!!prefilledEmail}
                  className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
                    prefilledEmail ? "bg-gray-100" : "focus:outline-none focus:ring-persimmon focus:border-persimmon"
                  }`} 
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  autoComplete="new-password" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-persimmon focus:border-persimmon" 
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type="password" 
                  autoComplete="new-password" 
                  required 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-persimmon focus:border-persimmon" 
                />
              </div>
              
              <div>
                <Button type="submit" className="w-full justify-center" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </form>
            
            <div className="mt-6">
              <p className="text-sm text-center">
                Already have an account?{" "}
                <Link to={claimOrderId ? `/login?claim_order_id=${claimOrderId}` : "/login"} className="text-persimmon hover:text-persimmon-dark">
                  Sign in
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignupPage;
