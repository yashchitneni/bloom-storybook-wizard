
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { Baby } from "lucide-react";

const Wizard = () => {
  const navigate = useNavigate();

  const handleStartWizard = () => {
    navigate('/wizard');
  };

  return (
    <div className="bg-cream rounded-xl p-8 shadow-md">
      <div className="space-y-6 text-center">
        <h2 className="text-2xl font-bold">Create a Personal Children's Book</h2>
        <p className="text-gray-700">
          Start creating your personal children's book: choose a story, upload a photo, and see your unique book come to life.
        </p>
        <div className="flex justify-center pt-4">
          <Button onClick={handleStartWizard} size="lg" withArrow>
            Start Creating
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Wizard;
