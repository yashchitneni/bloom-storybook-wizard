
import React from 'react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, PlusCircle, User } from "lucide-react";
import { Character } from '@/types/wizard';
import { cn } from '@/lib/utils';

interface CharactersCardProps {
  characters: Character[];
  onAddCharacter: () => void;
  onUpdateCharacter: (id: string, field: string, value: any) => void;
  onRemoveCharacter: (id: string) => void;
  isActive: boolean;
  maxCharacters?: number;
}

const CharactersCard: React.FC<CharactersCardProps> = ({
  characters,
  onAddCharacter,
  onUpdateCharacter,
  onRemoveCharacter,
  isActive,
  maxCharacters = 4
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (e.target.files && e.target.files[0]) {
      onUpdateCharacter(id, "photoFile", e.target.files[0]);
    }
  };
  
  const handleRemovePhoto = (id: string) => {
    onUpdateCharacter(id, "photoFile", new File([], ""));
    onUpdateCharacter(id, "photoPreview", null);
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
          {characters.map((character) => (
            <div key={character.id} className="border border-gray-200 rounded-lg p-4 relative">
              <button
                onClick={() => isActive && onRemoveCharacter(character.id)}
                className="absolute right-2 top-2 text-gray-400 hover:text-red-500"
                aria-label="Remove character"
                disabled={!isActive}
              >
                <X size={20} />
              </button>
              
              <div className="flex flex-col md:flex-row gap-6">
                {/* Photo Upload */}
                <div className="flex-shrink-0 w-full md:w-1/4">
                  <div className={`
                    border-2 border-dashed border-gray-300 rounded-lg 
                    ${!character.photoPreview ? 'p-4' : 'p-2'} 
                    text-center h-full flex flex-col justify-center items-center
                  `}>
                    {character.photoPreview ? (
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
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <label className={`${isActive ? 'cursor-pointer' : 'cursor-not-allowed'} flex flex-col items-center`}>
                          <User className="h-8 w-8 text-gray-400" />
                          <span className="mt-1 text-xs">Upload Photo</span>
                          {isActive && (
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/jpeg,image/png"
                              onChange={(e) => handleFileChange(e, character.id)}
                            />
                          )}
                        </label>
                      </>
                    )}
                  </div>
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
                      disabled={!isActive}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="text-sm">Relation</Label>
                    <Select 
                      value={character.relation} 
                      onValueChange={(value) => onUpdateCharacter(character.id, "relation", value)}
                      disabled={!isActive}
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
                      disabled={!isActive}
                      className="flex gap-4"
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
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Add Character Button */}
          {characters.length < maxCharacters && (
            <Button
              onClick={() => isActive && onAddCharacter()}
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              disabled={!isActive || characters.length >= maxCharacters}
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
