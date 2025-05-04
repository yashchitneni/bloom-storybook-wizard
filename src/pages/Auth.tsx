
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import Card from "@/components/Card";
import Button from "@/components/Button";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/wizard');
    }
  }, [user, navigate]);

  // Return null during the redirect to avoid flickering
  if (user) return null;
  
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        // Sign up the user with auto-confirmation
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              email_confirmed: true
            }
          }
        });

        if (signUpError) throw signUpError;
        
        // Auto-confirm and sign in
        if (data?.user) {
          // Create user entry in our profiles table
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([{
              id: data.user.id,
              email: data.user.email
            }]);
            
          if (profileError) {
            console.error("Error creating profile:", profileError);
          }
            
          // Immediately sign in after signup
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
          });
            
          if (signInError) throw signInError;
            
          toast({
            title: "Account created!",
            description: "Welcome to DearKidBooks!"
          });
            
          navigate('/wizard');
        }
      } else {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "You're now signed in."
        });
        
        navigate('/wizard');
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast({
        title: "Authentication error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-select flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-persimmon font-fredoka">DearKidBooks</h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </p>
        </div>
        
        <Card className="p-6">
          <form className="space-y-6" onSubmit={handleAuth}>
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
                onChange={e => setEmail(e.target.value)} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-persimmon focus:border-persimmon" 
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
                autoComplete={isSignUp ? "new-password" : "current-password"} 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-persimmon focus:border-persimmon" 
              />
            </div>
            
            <div>
              <Button type="submit" className="w-full justify-center" disabled={isLoading}>
                {isLoading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
              </Button>
            </div>
          </form>
          
          <div className="mt-6">
            <button 
              type="button" 
              onClick={() => setIsSignUp(!isSignUp)} 
              className="text-sm text-persimmon hover:text-persimmon-dark"
            >
              {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
