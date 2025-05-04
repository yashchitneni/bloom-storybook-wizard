const Footer = () => {
  return <footer className="bg-mint/20 py-8">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <div className="text-2xl font-fredoka text-darkText">DearKidBooks</div>
          </div>
          
          <div className="flex space-x-6 mb-6">
            <a href="#" className="text-sm text-darkText/70 hover:text-persimmon transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-darkText/70 hover:text-persimmon transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-darkText/70 hover:text-persimmon transition-colors">
              Contact
            </a>
          </div>
          
          <div className="text-sm text-darkText/60">© 2025 DearKidBooks – Made with ✨ & GPT-4</div>
        </div>
      </div>
    </footer>;
};
export default Footer;