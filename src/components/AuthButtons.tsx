
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

export const AuthButtons = () => {
  const { user, signOut, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-9 w-24 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {user ? (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium hidden sm:inline-block">
            {user.email}
          </span>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      ) : (
        <Button onClick={() => navigate("/auth")}>Sign In</Button>
      )}
    </div>
  );
};
