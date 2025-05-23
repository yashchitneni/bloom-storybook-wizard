import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ChildProfileCardProps {
  onChildNameChange: (name: string) => void;
  onChildGenderChange: (gender: string) => void;
  onChildPhotoUpload: (file: File) => void;
  childName: string;
  childGender: string;
  childPhotoPreview: string | null;
  isActive: boolean;
  isUploading?: boolean;
}

const ChildProfileCard: React.FC<ChildProfileCardProps> = ({
  onChildNameChange,
  onChildGenderChange,
  onChildPhotoUpload,
  childName,
  childGender,
  childPhotoPreview,
  isActive,
  isUploading = false
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
      <div className="child-panel bg-white rounded-2xl p-6 shadow-lg grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Photo Upload */}
        <div className="flex-shrink-0">
          {childPhotoPreview ? (
            <div className="flex flex-col items-center">
              <div className="aspect-square w-full max-w-[200px] overflow-hidden rounded-lg relative">
                <img 
                  src={childPhotoPreview} 
                  alt="Child" 
                  className={cn(
                    "w-full h-full object-cover",
                    isUploading && "opacity-50"
                  )}
                />
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  </div>
                )}
              </div>
              <button 
                onClick={handleRemovePhoto}
                disabled={isUploading}
                className={cn(
                  "mt-2 text-sm text-yellow-500 hover:underline",
                  isUploading && "opacity-50 cursor-not-allowed"
                )}
                type="button"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className={cn(
              "upload-dashed relative flex items-center justify-center",
              "border-2 border-dashed border-gray-200 rounded-lg bg-gray-50",
              "h-40 overflow-hidden",
              isActive ? "cursor-pointer" : "cursor-not-allowed",
              isUploading && "opacity-50 cursor-not-allowed"
            )}>
              <label className={cn(
                "flex flex-col items-center",
                isActive && !isUploading ? "cursor-pointer" : "cursor-not-allowed"
              )}>
                {isUploading ? (
                  <Loader2 className="h-12 w-12 text-gray-400 animate-spin" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                <span className="mt-2 text-sm">
                  {isUploading ? "Uploading..." : "Child's Photo (JPEG/PNG)"}
                </span>
                {isActive && !isUploading && (
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    accept="image/jpeg,image/png"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                )}
              </label>
            </div>
          )}
          {isActive && !childPhotoPreview && !isUploading && (
            <p className="text-sm text-red-500 mt-1">
              Photo is required
            </p>
          )}
        </div>

        {/* Child Details */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="childName">Child's Name</Label>
            <Input
              id="childName"
              value={childName}
              onChange={(e) => onChildNameChange(e.target.value)}
              placeholder="Enter child's name"
              disabled={!isActive || isUploading}
            />
          </div>
          <div>
            <Label>Gender</Label>
            <RadioGroup
              value={childGender}
              onValueChange={onChildGenderChange}
              disabled={!isActive || isUploading}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Boy" id="boy" />
                <Label htmlFor="boy">Boy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Girl" id="girl" />
                <Label htmlFor="girl">Girl</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildProfileCard;
