
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Card } from "@/components/Card";
import Button from "@/components/Button";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "Successfully logged in.",
        });
        
        navigate('/');
      } else {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;

        if (authData?.user) {
          // Insert into our users table as well
          const { error: profileError } = await supabase
            .from('users')
            .insert([{ id: authData.user.id, email }]);

          if (profileError) {
            console.error("Error creating user profile:", profileError);
          }
        }
        
        toast({
          title: "Account created!",
          description: "Welcome to StoryBloom.",
        });
        
        navigate('/');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: error.message || "An error occurred during authentication",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card className="p-8">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">{mode === 'login' ? 'Sign In' : 'Create an Account'}</h1>
            <p className="text-muted-foreground mt-2">
              {mode === 'login' 
                ? 'Welcome back! Sign in to continue.' 
                : 'Sign up to create personalized storybooks'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="••••••••"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading 
                ? "Processing..." 
                : mode === 'login' ? "Sign In" : "Create Account"}
            </Button>

            <div className="text-center mt-4">
              {mode === 'login' ? (
                <p>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="text-persimmon hover:underline"
                    onClick={() => setMode('signup')}
                  >
                    Sign Up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-persimmon hover:underline"
                    onClick={() => setMode('login')}
                  >
                    Sign In
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
