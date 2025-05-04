
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from '@/lib/utils';

interface ChildProfileCardProps {
  onChildNameChange: (name: string) => void;
  onChildGenderChange: (gender: string) => void;
  onChildPhotoUpload: (file: File) => void;
  childName: string;
  childGender: string;
  childPhotoPreview: string | null;
  isActive: boolean;
}

const ChildProfileCard: React.FC<ChildProfileCardProps> = ({
  onChildNameChange,
  onChildGenderChange,
  onChildPhotoUpload,
  childName,
  childGender,
  childPhotoPreview,
  isActive
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChildPhotoUpload(e.target.files[0]);
    }
  };
  
  const handleRemovePhoto = () => {
    onChildPhotoUpload(new File([], ""));
  };
  
  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        Tell us about the child this story is for
      </p>
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Photo Upload */}
          <div className="flex-shrink-0 w-full md:w-1/3">
            <div className={`
              border-2 border-dashed border-gray-300 rounded-lg 
              ${!childPhotoPreview ? 'p-6' : 'p-2'} 
              text-center h-full flex flex-col justify-center items-center
            `}>
              {childPhotoPreview ? (
                <div className="flex flex-col items-center">
                  <div className="aspect-square w-full max-w-[200px] overflow-hidden rounded-lg">
                    <img 
                      src={childPhotoPreview} 
                      alt="Child" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button 
                    onClick={handleRemovePhoto}
                    className="mt-2 text-sm text-persimmon hover:underline"
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <label className={`${isActive ? 'cursor-pointer' : 'cursor-not-allowed'} flex flex-col items-center`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="mt-2 text-sm">Child's Photo (JPEG/PNG)</span>
                    {isActive && (
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/jpeg,image/png"
                        onChange={handleFileChange}
                      />
                    )}
                  </label>
                </>
              )}
            </div>
            {isActive && !childPhotoPreview && (
              <p className="text-sm text-red-500 mt-1">
                Photo is required
              </p>
            )}
          </div>

          {/* Child Details */}
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Label className="text-base">Child's Name</Label>
              <Input 
                type="text"
                placeholder="Enter child's name"
                value={childName}
                onChange={(e) => onChildNameChange(e.target.value)}
                className={cn(
                  "w-full",
                  isActive && !childName && "border-red-500"
                )}
              />
              {isActive && !childName && (
                <p className="text-sm text-red-500">Name is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-base">Child's Gender</Label>
              <RadioGroup 
                value={childGender} 
                onValueChange={onChildGenderChange}
                className={cn(
                  "flex gap-4",
                  isActive && !childGender && "border border-red-500 p-2 rounded"
                )}
              >
                <div className="flex items-center">
                  <RadioGroupItem id="gender-boy" value="Boy" />
                  <Label htmlFor="gender-boy" className="ml-2">Boy</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem id="gender-girl" value="Girl" />
                  <Label htmlFor="gender-girl" className="ml-2">Girl</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem id="gender-other" value="Other" />
                  <Label htmlFor="gender-other" className="ml-2">Other</Label>
                </div>
              </RadioGroup>
              {isActive && !childGender && (
                <p className="text-sm text-red-500">Gender selection is required</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildProfileCard;
