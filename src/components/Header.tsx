
import { useState } from "react";
import Button from "./Button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const scrollToWizard = () => {
    document.getElementById('wizard')?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <header className="py-4 bg-white border-b border-gray-100">
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-fredoka text-darkText">StoryBloom</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-darkText hover:text-persimmon transition-colors">How It Works</a>
            <a href="#" className="text-darkText hover:text-persimmon transition-colors">Styles</a>
            <a href="#" className="text-darkText hover:text-persimmon transition-colors">FAQ</a>
            <Button onClick={scrollToWizard}>
              Create Now
            </Button>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden py-4 bg-white border-t border-gray-100">
          <div className="container px-4">
            <nav className="flex flex-col space-y-4">
              <a href="#" className="text-darkText hover:text-persimmon transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                How It Works
              </a>
              <a href="#" className="text-darkText hover:text-persimmon transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                Styles
              </a>
              <a href="#" className="text-darkText hover:text-persimmon transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                FAQ
              </a>
              <Button onClick={scrollToWizard} className="w-full text-center">
                Create Now
              </Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
