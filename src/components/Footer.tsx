
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-lavender py-8">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center">
          <motion.div 
            className="mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-2xl font-poppins font-bold text-darkText">DearKidBooks</div>
          </motion.div>
          
          <motion.div 
            className="flex space-x-6 mb-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <a href="#" className="text-sm text-darkText/70 hover:text-goldenYellow transition-colors font-lato">
              Privacy
            </a>
            <a href="#" className="text-sm text-darkText/70 hover:text-goldenYellow transition-colors font-lato">
              Terms
            </a>
            <a href="#" className="text-sm text-darkText/70 hover:text-goldenYellow transition-colors font-lato">
              Contact
            </a>
          </motion.div>
          
          <motion.div 
            className="text-sm text-darkText/60 font-lato"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            © 2025 DearKidBooks – Made with ✨ & GPT-4
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
