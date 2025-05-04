
import { useState } from "react";
import { Baby, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "./Button";
import { Card } from "./ui/card";

const Wizard = () => {
  const navigate = useNavigate();

  const handleStartWizard = () => {
    navigate('/wizard');
  };

  return (
    <div className="bg-[#FFF9F2] rounded-2xl p-8 shadow-md border border-[#FEF6EC]/50">
      <div className="space-y-6 text-center">
        <h2 className="text-2xl font-bold">Create a Personal Children's Book</h2>
        <p className="text-gray-700">
          Start creating your personal children's book: choose a story, upload a photo, and see your unique book come to life.
        </p>
        <div className="flex justify-center pt-4">
          <Button 
            onClick={handleStartWizard} 
            size="lg" 
            withArrow
            className="bg-[#FF7A50] hover:bg-[#FF7A50]/90 text-white font-semibold"
          >
            Start Creating
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Wizard;
