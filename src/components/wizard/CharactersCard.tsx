import React from 'react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, PlusCircle, User, Loader2 } from "lucide-react";
import { Character, CharactersCardProps } from '@/types/wizard';
import { cn } from '@/lib/utils';

interface CharactersCardProps {
  characters: Character[];
  onAddCharacter: () => void;
  onUpdateCharacter: (id: string, field: string, value: any) => void;
  onRemoveCharacter: (id: string) => void;
  onCharacterPhotoUpload: (id: string, file: File | null) => void;
  isUploadingCharacterPhoto: Record<string, boolean>;
  isActive: boolean;
  maxCharacters?: number;
  characterFieldErrors?: Record<string, { name: boolean; gender: boolean; photo: boolean }>;
}

const CharactersCard: React.FC<CharactersCardProps> = ({
  characters,
  onAddCharacter,
  onUpdateCharacter,
  onRemoveCharacter,
  onCharacterPhotoUpload,
  isUploadingCharacterPhoto,
  isActive,
  maxCharacters = 4,
  characterFieldErrors = {}
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    console.log("[CharactersCard] handleFileChange triggered for char ID:", id, "File selected:", e.target.files ? e.target.files[0]?.name : 'No file');
    if (typeof onCharacterPhotoUpload === 'function') {
      console.log("[CharactersCard] onCharacterPhotoUpload prop is a function. Calling it.");
      if (e.target.files && e.target.files[0]) {
        onCharacterPhotoUpload(id, e.target.files[0]);
      } else {
        onCharacterPhotoUpload(id, null);
      }
    } else {
      console.error("[CharactersCard] onCharacterPhotoUpload is NOT a function! Prop value:", onCharacterPhotoUpload);
    }
  };
  
  const handleRemovePhoto = (id: string) => {
    onCharacterPhotoUpload(id, null);
  };
  
  const relationOptions = [
    "Father", "Mother", "Brother", "Sister", 
    "Grandfather", "Grandmother", "Friend", "Other"
  ];
  
  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        Add up to {maxCharacters} additional characters that will appear in the story
      </p>
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <div className="space-y-8">
          {/* Character Cards */}
          {characters.map((character) => {
            const errors = characterFieldErrors[character.id] || {};
            return (
              <div key={character.id} className="border border-gray-200 rounded-lg p-4 relative">
                <button
                  onClick={() => isActive && onRemoveCharacter(character.id)}
                  className="absolute right-2 top-2 text-gray-400 hover:text-red-500"
                  aria-label="Remove character"
                  disabled={!isActive || isUploadingCharacterPhoto[character.id]}
                >
                  <X size={20} />
                </button>
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Photo Upload */}
                  <div className={cn(
                    "border-2 border-dashed rounded-lg text-center h-full flex flex-col justify-center items-center",
                    errors.photo ? "border-red-500" : "border-gray-300",
                    !character.photoPreview ? 'p-4' : 'p-2',
                    isUploadingCharacterPhoto[character.id] && 'opacity-50'
                  )}>
                    {isUploadingCharacterPhoto[character.id] ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 text-persimmon animate-spin" />
                        <span className="mt-2 text-xs text-gray-500">Uploading...</span>
                      </div>
                    ) : character.photoPreview ? (
                      <div className="flex flex-col items-center">
                        <div className="aspect-square w-full max-w-[120px] overflow-hidden rounded-lg">
                          <img 
                            src={character.photoPreview} 
                            alt={character.name || "Character"} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button 
                          onClick={() => handleRemovePhoto(character.id)}
                          className="mt-2 text-xs text-persimmon hover:underline"
                          type="button"
                          disabled={!isActive || isUploadingCharacterPhoto[character.id]}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <label className={cn(
                          "flex flex-col items-center",
                          isActive && !isUploadingCharacterPhoto[character.id] ? 'cursor-pointer' : 'cursor-not-allowed'
                        )}>
                          <User className="h-8 w-8 text-gray-400" />
                          <span className="mt-1 text-xs">Upload Photo</span>
                          {isActive && !isUploadingCharacterPhoto[character.id] && (
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/jpeg,image/png"
                              onChange={(e) => handleFileChange(e, character.id)}
                              disabled={isUploadingCharacterPhoto[character.id]}
                            />
                          )}
                        </label>
                      </>
                    )}
                    {errors.photo && (
                      <p className="text-xs text-red-500 mt-1">Character photo is required</p>
                    )}
                  </div>

                  {/* Character Details */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <Label className="text-sm">Name</Label>
                      <Input 
                        type="text"
                        placeholder="Character name"
                        value={character.name}
                        onChange={(e) => onUpdateCharacter(character.id, "name", e.target.value)}
                        disabled={!isActive || isUploadingCharacterPhoto[character.id]}
                        className={cn("w-full", errors.name ? "border-red-500 focus:border-red-500" : "")}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 mt-1">Character name is required</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm">Relation</Label>
                      <Select 
                        value={character.relation} 
                        onValueChange={(value) => onUpdateCharacter(character.id, "relation", value)}
                        disabled={!isActive || isUploadingCharacterPhoto[character.id]}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select relation" />
                        </SelectTrigger>
                        <SelectContent>
                          {relationOptions.map((option) => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm">Gender</Label>
                      <RadioGroup 
                        value={character.gender} 
                        onValueChange={(value) => onUpdateCharacter(character.id, "gender", value)}
                        disabled={!isActive || isUploadingCharacterPhoto[character.id]}
                        className={cn("flex gap-4", errors.gender ? "border border-red-500 rounded-md p-2" : "")}
                      >
                        <div className="flex items-center">
                          <RadioGroupItem id={`gender-boy-${character.id}`} value="Boy" />
                          <Label htmlFor={`gender-boy-${character.id}`} className="ml-2 text-sm">Boy</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem id={`gender-girl-${character.id}`} value="Girl" />
                          <Label htmlFor={`gender-girl-${character.id}`} className="ml-2 text-sm">Girl</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem id={`gender-other-${character.id}`} value="Other" />
                          <Label htmlFor={`gender-other-${character.id}`} className="ml-2 text-sm">Other</Label>
                        </div>
                      </RadioGroup>
                      {errors.gender && (
                        <p className="text-xs text-red-500 mt-1">Character gender is required</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Add Character Button */}
          {characters.length < maxCharacters && (
            <Button
              onClick={() => isActive && onAddCharacter()}
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              disabled={!isActive || characters.some(c => isUploadingCharacterPhoto[c.id])}
            >
              <PlusCircle size={18} />
              <span>Add a Character</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharactersCard;
