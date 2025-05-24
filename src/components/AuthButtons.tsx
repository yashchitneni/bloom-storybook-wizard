import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

export const AuthButtons = () => {
  const {
    user,
    signOut,
    isLoading
  } = useAuth();
  const navigate = useNavigate();

  // Debug log for auth state
  console.log('[AuthButtons] user:', user, 'isLoading:', isLoading);
  
  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out."
    });
  };

  if (isLoading) {
    return <div className="flex items-center gap-2">
        <div className="h-9 w-24 bg-gray-200 animate-pulse rounded"></div>
      </div>;
  }

  return <div className="flex items-center gap-2">
      {user ? <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate("/account")}
            className="hidden sm:flex"
          >
            My Account
          </Button>
          <span className="text-sm font-medium hidden sm:inline-block">
            {user.email}
          </span>
          <Button variant="primary" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div> : <Button variant="primary" onClick={() => navigate("/auth")}>Sign In</Button>}
    </div>;
};