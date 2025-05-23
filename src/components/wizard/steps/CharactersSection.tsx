import React from 'react';
import { motion } from "framer-motion";
import CharactersCard from '@/components/wizard/CharactersCard';
import { Character } from '@/types/wizard';

interface CharactersSectionProps {
  characters: Character[];
  onAddCharacter: () => void;
  onUpdateCharacter: (id: string, field: string, value: any) => void;
  onRemoveCharacter: (id: string) => void;
  onCharacterPhotoUpload: (characterId: string, file: File | null) => void;
  isUploadingCharacterPhoto: Record<string, boolean>;
  isActive: boolean;
  maxCharacters: number;
}

const CharactersSection: React.FC<CharactersSectionProps> = ({
  characters,
  onAddCharacter,
  onUpdateCharacter,
  onRemoveCharacter,
  onCharacterPhotoUpload,
  isUploadingCharacterPhoto,
  isActive,
  maxCharacters
}) => {
  return (
    <motion.section 
      id="step-8"
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-xl font-bold">Additional Characters</h3>
      <CharactersCard
        characters={characters}
        onAddCharacter={onAddCharacter}
        onUpdateCharacter={onUpdateCharacter}
        onRemoveCharacter={onRemoveCharacter}
        onCharacterPhotoUpload={onCharacterPhotoUpload}
        isUploadingCharacterPhoto={isUploadingCharacterPhoto}
        isActive={true}
        maxCharacters={maxCharacters}
      />
    </motion.section>
  );
};

export default CharactersSection;
