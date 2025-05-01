
import { useState } from "react";
import Card from "./Card";
import Button from "./Button";
import ProgressBar from "./ProgressBar";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Step 1: Age Selection Component
const AgeSelectionStep = ({ onNext, onSelectAge, selectedAge }: { onNext: () => void, onSelectAge: (age: string) => void, selectedAge: string }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">How old is your little hero?</h3>
      <div className="flex flex-col sm:flex-row gap-4">
        {["2-3 yrs", "4-6 yrs", "7-8 yrs"].map((age) => (
          <div 
            key={age}
            onClick={() => onSelectAge(age)}
            className={`p-4 border-2 rounded-xl cursor-pointer flex-1 text-center transition-all duration-200 
              ${selectedAge === age 
                ? "border-persimmon bg-persimmon/5" 
                : "border-gray-200 hover:border-persimmon/50"}`}
          >
            <span className="font-medium font-fredoka">{age}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-4">
        <Button onClick={onNext} disabled={!selectedAge} withArrow>Next</Button>
      </div>
    </div>
  );
};

// Step 2: Story Spark Selection Component
const StorySparkStep = ({ 
  onNext, 
  onPrevious, 
  onSelectTheme, 
  onSelectMoral, 
  onSpecialDetailsChange,
  selectedTheme,
  selectedMoral,
  specialDetails
}: { 
  onNext: () => void, 
  onPrevious: () => void,
  onSelectTheme: (theme: string) => void,
  onSelectMoral: (moral: string) => void,
  onSpecialDetailsChange: (details: string) => void,
  selectedTheme: string,
  selectedMoral: string,
  specialDetails: string
}) => {
  const themes = ["Adventure", "Bedtime", "Family", "Superhero"];
  const morals = ["Bravery", "Sharing", "Honesty", "Clean-up"];
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Choose your story elements</h3>
      
      <div className="space-y-4">
        <label className="block text-sm font-medium">Choose a Theme</label>
        <select
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-persimmon"
          value={selectedTheme}
          onChange={(e) => onSelectTheme(e.target.value)}
        >
          <option value="">Select a theme</option>
          {themes.map((theme) => (
            <option key={theme} value={theme}>{theme}</option>
          ))}
        </select>
      </div>
      
      <div className="space-y-4">
        <label className="block text-sm font-medium">Pick a Moral</label>
        <select
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-persimmon"
          value={selectedMoral}
          onChange={(e) => onSelectMoral(e.target.value)}
        >
          <option value="">Select a moral</option>
          {morals.map((moral) => (
            <option key={moral} value={moral}>{moral}</option>
          ))}
        </select>
      </div>
      
      <div className="space-y-4">
        <label className="block text-sm font-medium">Special detail to include? (optional)</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-persimmon"
          placeholder="E.g., favorite toy, pet's name, etc."
          maxLength={200}
          value={specialDetails}
          onChange={(e) => onSpecialDetailsChange(e.target.value)}
        />
        <div className="text-xs text-right text-gray-500">
          {specialDetails.length}/200 characters
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!selectedTheme || !selectedMoral} 
          withArrow
        >
          Next
        </Button>
      </div>
    </div>
  );
};

// Step 3: Photo & Style Selection Component
const PhotoStyleStep = ({ 
  onNext, 
  onPrevious,
  onSelectStyle,
  selectedStyle,
  onPhotoUpload,
  photoPreview
}: { 
  onNext: () => void, 
  onPrevious: () => void,
  onSelectStyle: (style: string) => void,
  selectedStyle: string,
  onPhotoUpload: (file: File) => void,
  photoPreview: string | null
}) => {
  const styles = ["Cartoon", "Watercolor", "3D", "Pop-Art"];
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onPhotoUpload(e.target.files[0]);
    }
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Photo & Style</h3>
      
      <div className="space-y-4">
        <label className="block text-sm font-medium">Upload a photo of your little hero</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          {photoPreview ? (
            <div className="flex flex-col items-center">
              <img 
                src={photoPreview} 
                alt="Preview" 
                className="w-32 h-32 object-cover rounded-lg"
              />
              <button 
                onClick={() => onPhotoUpload(new File([], ""))} 
                className="mt-2 text-sm text-persimmon hover:underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <>
              <label className="cursor-pointer flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="mt-2 text-sm">Click to upload (JPEG/PNG)</span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/jpeg,image/png"
                  onChange={handleFileChange}
                />
              </label>
            </>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <label className="block text-sm font-medium">Select an illustration style</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {styles.map((style) => (
            <div 
              key={style}
              onClick={() => onSelectStyle(style)}
              className={`
                aspect-[6/7] rounded-lg overflow-hidden cursor-pointer relative
                transition-all duration-200 group
                ${selectedStyle === style ? "ring-2 ring-persimmon ring-offset-2" : ""}
              `}
            >
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <span className="font-medium text-lg">{style}</span>
              </div>
              <div className={`
                absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 
                flex items-center justify-center transition-all duration-200
                ${selectedStyle === style ? 'bg-opacity-10' : ''}
              `}>
                <span className={`
                  text-white opacity-0 group-hover:opacity-100 font-bold
                  ${selectedStyle === style ? 'opacity-100' : ''}
                `}>
                  Select
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!photoPreview || !selectedStyle} 
          withArrow
        >
          Next
        </Button>
      </div>
    </div>
  );
};

// Step 4: Checkout Component
const CheckoutStep = ({ 
  onPrevious,
  selectedAge,
  selectedTheme,
  selectedMoral,
  selectedStyle,
  specialDetails,
  onEmailChange,
  email
}: { 
  onPrevious: () => void,
  selectedAge: string,
  selectedTheme: string,
  selectedMoral: string,
  selectedStyle: string,
  specialDetails: string,
  onEmailChange: (email: string) => void,
  email: string
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Almost there!</h3>
      
      <div className="bg-mint/20 p-4 rounded-lg">
        <p className="text-sm">
          We'll create a 10-page {selectedStyle} adventure 
          {selectedAge ? ` for a ${selectedAge} child` : ''} 
          {selectedTheme ? ` with a ${selectedTheme.toLowerCase()} theme` : ''} 
          {selectedMoral ? ` where they learn about ${selectedMoral.toLowerCase()}` : ''}.
          {specialDetails ? ` We'll include your special details: "${specialDetails}"` : ''}
        </p>
      </div>
      
      <div className="space-y-4">
        <label className="block text-sm font-medium">Email (for delivery)</label>
        <input
          type="email"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-persimmon"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
      </div>
      
      <div className="p-4 border border-gray-200 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-medium">Total:</span>
          <span className="text-xl font-bold font-fredoka">$9.99</span>
        </div>
      </div>
      
      <Button 
        className="w-full py-3 text-center"
      >
        <span className="mr-2">🔒</span> Checkout
      </Button>
      
      <p className="text-xs text-center text-gray-500">
        Hardcover print option coming soon – join the waitlist after purchase.
      </p>
      
      <div className="flex justify-start pt-4">
        <Button variant="outline" onClick={onPrevious}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
    </div>
  );
};

// Main Wizard Component
const Wizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState({
    age: "",
    theme: "",
    moral: "",
    specialDetails: "",
    photoFile: null as File | null,
    photoPreview: null as string | null,
    style: "",
    email: ""
  });
  
  const totalSteps = 4;
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      // Scroll to top of wizard
      document.getElementById('wizard')?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Scroll to top of wizard
      document.getElementById('wizard')?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handlePhotoUpload = (file: File) => {
    if (file.size === 0) {
      // User removed the photo
      setWizardData({
        ...wizardData,
        photoFile: null,
        photoPreview: null
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setWizardData({
        ...wizardData,
        photoFile: file,
        photoPreview: e.target?.result as string
      });
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <Card className="max-w-2xl mx-auto" id="wizard">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Create Your Story</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
          </div>
        </div>
        
        <ProgressBar totalSteps={totalSteps} currentStep={currentStep} />
        
        <div className="py-4">
          {currentStep === 1 && (
            <AgeSelectionStep 
              onNext={handleNext} 
              onSelectAge={(age) => setWizardData({...wizardData, age})}
              selectedAge={wizardData.age}
            />
          )}
          {currentStep === 2 && (
            <StorySparkStep 
              onNext={handleNext} 
              onPrevious={handlePrevious}
              onSelectTheme={(theme) => setWizardData({...wizardData, theme})}
              onSelectMoral={(moral) => setWizardData({...wizardData, moral})}
              onSpecialDetailsChange={(details) => setWizardData({...wizardData, specialDetails: details})}
              selectedTheme={wizardData.theme}
              selectedMoral={wizardData.moral}
              specialDetails={wizardData.specialDetails}
            />
          )}
          {currentStep === 3 && (
            <PhotoStyleStep
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSelectStyle={(style) => setWizardData({...wizardData, style})}
              selectedStyle={wizardData.style}
              onPhotoUpload={handlePhotoUpload}
              photoPreview={wizardData.photoPreview}
            />
          )}
          {currentStep === 4 && (
            <CheckoutStep
              onPrevious={handlePrevious}
              selectedAge={wizardData.age}
              selectedTheme={wizardData.theme}
              selectedMoral={wizardData.moral}
              selectedStyle={wizardData.style}
              specialDetails={wizardData.specialDetails}
              onEmailChange={(email) => setWizardData({...wizardData, email})}
              email={wizardData.email}
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default Wizard;
