
import React from 'react';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

interface StyleSelectionContentProps {
  selectedStyle: string;
  onSelectStyle: (style: string) => void;
  styles: string[];
}

const StyleSelectionContent: React.FC<StyleSelectionContentProps> = ({
  selectedStyle,
  onSelectStyle,
  styles
}) => {
  // Mock image URLs - in a real implementation, these would come from your database
  const styleImages: Record<string, string> = {
    'Watercolor': 'https://images.unsplash.com/photo-1616073512636-f03e505a47d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
    'Digital': 'https://images.unsplash.com/photo-1633003085037-45dca4e3e5cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
    'Cartoon': 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
    'Sketchy': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
  };
  
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-6">Select an Art Style</h1>
      
      <div className="grid grid-cols-2 gap-4 flex-grow">
        {styles.map((style) => (
          <motion.div
            key={style}
            onClick={() => onSelectStyle(style)}
            className={`
              relative rounded-xl overflow-hidden cursor-pointer
              ${selectedStyle === style ? 'ring-4 ring-persimmon ring-offset-2' : ''}
              transition-all duration-200
            `}
            whileHover={{ y: -2, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
          >
            {/* Placeholder image for styles */}
            <div 
              className="h-[180px] bg-cover bg-center"
              style={{ backgroundImage: `url(${styleImages[style] || ''})` }}
            />
            
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
              <div className="bg-white/90 px-3 py-2 rounded-full flex items-center">
                <Eye size={16} className="mr-1" />
                <span className="text-sm font-medium">View Sample</span>
              </div>
            </div>
            
            <div className="bg-white p-3 text-center">
              <span className="font-medium">{style}</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="text-center text-gray-500 mt-8 italic text-sm">
        Choose how your story's illustrations will look
      </div>
    </div>
  );
};

export default StyleSelectionContent;
