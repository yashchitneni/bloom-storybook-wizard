
import { Link } from "react-router-dom";
import { AuthButtons } from "./AuthButtons";

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/d083e895-4f22-4e6a-993e-c0214d3c136f.png" 
            alt="Dear Kid Books Logo" 
            className="h-14" 
          />
        </Link>
        <AuthButtons />
      </div>
    </header>
  );
};

export default Header;
