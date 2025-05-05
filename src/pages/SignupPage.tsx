
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/Card";
import Button from "@/components/Button";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get storybook ID and email from URL parameters
  const storybookId = searchParams.get("storybook_id");
  const emailParam = searchParams.get("email");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/account');
    }
  }, [user, navigate]);

  // Set email from URL parameter if available
  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  // Associate storybook with new user account
  const associateStorybook = async (userId: string, userEmail: string) => {
    try {
      if (storybookId) {
        // Update the storybook author_id where it matches the ID and email
        const { error } = await supabase
          .from('storybooks')
          .update({ author_id: userId })
          .match({ 
            id: storybookId, 
            email: userEmail,
            author_id: null 
          });

        if (error) {
          console.error("Error associating storybook:", error);
          toast({
            title: "Storybook association failed",
            description: "Your account was created, but we couldn't link your storybook. Please contact support.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error in associateStorybook:", error);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password || !confirmPassword) {
      toast({
        title: "Missing information",
        description: "Please fill out all fields.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both password fields match.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Sign up the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + "/account",
        }
      });

      if (signUpError) throw signUpError;
      
      // Auto-sign in after signup
      if (data?.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: data.user.id,
            email: data.user.email
          }]);
          
        if (profileError) {
          console.error("Error creating profile:", profileError);
        }
        
        // Associate storybook with the new user
        await associateStorybook(data.user.id, email);
        
        toast({
          title: "Account created!",
          description: "Welcome to DearKidBooks!",
        });
        
        navigate('/account');
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-select flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-persimmon font-fredoka">Create Your Account</h2>
            <p className="mt-2 text-sm text-gray-600">
              {storybookId ? "Sign up to access your newly created storybook!" : "Create an account to get started"}
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
                  disabled={!!emailParam} // Disable if email is from URL parameter
                  className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
                    emailParam ? "bg-gray-100" : "focus:outline-none focus:ring-persimmon focus:border-persimmon"
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
                <a href="/auth" className="text-persimmon hover:text-persimmon-dark">
                  Sign in
                </a>
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
