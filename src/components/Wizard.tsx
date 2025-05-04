
import React, { useState } from "react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import {
  Baby,
  BookOpen,
  Camera,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Palette
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Wizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  
  // Wizard data state
  const [age, setAge] = useState("");
  const [theme, setTheme] = useState("");
  const [message, setMessage] = useState("");
  const [style, setStyle] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Sample data (in a real app, this would come from your database)
  const ages = ["0-2 years", "3-5 years", "6-8 years"];
  const themes = ["Adventure", "Educational", "Fairy Tales", "Family"];
  const messages = ["Bravery", "Friendship", "Kindness", "Perseverance"];
  const styles = ["Cartoon", "Watercolor", "3D", "Sketch"];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setPhoto(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Submit form
      console.log("Submitting:", { age, theme, message, style, photo });
      navigate("/success");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isNextDisabled = () => {
    switch (step) {
      case 1: return !age;
      case 2: return !theme;
      case 3: return !message;
      case 4: return !style;
      case 5: return !photo;
      default: return false;
    }
  };

  // Progress indicator
  const progress = (step / totalSteps) * 100;

  return (
    <div className="bg-cream rounded-xl p-8 shadow-md">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Create a Personal Children's Book</h2>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div 
            className="bg-persimmon h-full rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Step indicators */}
        <div className="flex justify-between px-2">
          {Array.from({length: totalSteps}).map((_, i) => (
            <div 
              key={i}
              className={`flex flex-col items-center ${i + 1 === step ? 'text-persimmon' : 'text-gray-400'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1
                ${i + 1 === step ? 'bg-persimmon text-white' : 'bg-gray-200 text-gray-500'}`}>
                {i + 1}
              </div>
              <span className="text-xs hidden md:inline">
                {i === 0 ? 'Age' : 
                 i === 1 ? 'Theme' : 
                 i === 2 ? 'Message' : 
                 i === 3 ? 'Style' : 'Photo'}
              </span>
            </div>
          ))}
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-sm min-h-[250px]">
          {/* Step 1: Age */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Baby className="text-persimmon" size={24} />
                <h3 className="text-xl font-medium">Select age group</h3>
              </div>
              <p className="text-gray-600">Choose the age group for your child's book</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {ages.map((ageOption) => (
                  <div
                    key={ageOption}
                    className={`border-2 p-4 rounded-lg cursor-pointer transition-all
                      ${age === ageOption ? 'border-persimmon bg-rose-50' : 'border-gray-200 hover:border-persimmon/50'}`}
                    onClick={() => setAge(ageOption)}
                  >
                    <div className="text-center font-medium">{ageOption}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Theme */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <BookOpen className="text-persimmon" size={24} />
                <h3 className="text-xl font-medium">Select a theme</h3>
              </div>
              <p className="text-gray-600">Choose the theme for your story</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {themes.map((themeOption) => (
                  <div
                    key={themeOption}
                    className={`border-2 p-4 rounded-lg cursor-pointer transition-all
                      ${theme === themeOption ? 'border-persimmon bg-rose-50' : 'border-gray-200 hover:border-persimmon/50'}`}
                    onClick={() => setTheme(themeOption)}
                  >
                    <div className="text-center font-medium">{themeOption}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Message */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MessageSquare className="text-persimmon" size={24} />
                <h3 className="text-xl font-medium">Select a message</h3>
              </div>
              <p className="text-gray-600">Choose the moral of your story</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {messages.map((messageOption) => (
                  <div
                    key={messageOption}
                    className={`border-2 p-4 rounded-lg cursor-pointer transition-all
                      ${message === messageOption ? 'border-persimmon bg-rose-50' : 'border-gray-200 hover:border-persimmon/50'}`}
                    onClick={() => setMessage(messageOption)}
                  >
                    <div className="text-center font-medium">{messageOption}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Style */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Palette className="text-persimmon" size={24} />
                <h3 className="text-xl font-medium">Select illustration style</h3>
              </div>
              <p className="text-gray-600">Choose the art style for your book</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {styles.map((styleOption) => (
                  <div
                    key={styleOption}
                    className={`border-2 p-4 rounded-lg cursor-pointer transition-all
                      ${style === styleOption ? 'border-persimmon bg-rose-50' : 'border-gray-200 hover:border-persimmon/50'}`}
                    onClick={() => setStyle(styleOption)}
                  >
                    <div className="text-center font-medium">{styleOption}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Photo */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Camera className="text-persimmon" size={24} />
                <h3 className="text-xl font-medium">Upload a photo</h3>
              </div>
              <p className="text-gray-600">Upload a photo of your child to include in the book</p>
              
              <div className="mt-4">
                <label className="block w-full">
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                      ${photoPreview ? 'border-persimmon' : 'border-gray-300 hover:border-persimmon/50'}`}
                  >
                    {photoPreview ? (
                      <div className="space-y-4">
                        <img 
                          src={photoPreview} 
                          alt="Preview" 
                          className="h-40 mx-auto object-contain" 
                        />
                        <p className="text-sm text-persimmon">Click to change photo</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Camera className="mx-auto text-gray-400" size={48} />
                        <p>Click to upload a photo</p>
                        <p className="text-xs text-gray-500">Supports JPG, PNG</p>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </label>
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button 
            onClick={handleBack} 
            variant="outline"
            disabled={step === 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={isNextDisabled()}
          >
            {step === totalSteps ? 'Create Book' : 'Next'}
            {step !== totalSteps && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Wizard;
