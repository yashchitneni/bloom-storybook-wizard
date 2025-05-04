
import React from 'react';

interface StyleSelectionCardProps {
  onSelectStyle: (style: string) => void;
  selectedStyle: string;
  styles: string[];
  isActive: boolean;
}

const StyleSelectionCard: React.FC<StyleSelectionCardProps> = ({ 
  onSelectStyle, 
  selectedStyle,
  styles,
  isActive
}) => {
  const getStyleImage = (styleName: string) => {
    switch(styleName.toLowerCase()) {
      case "retro":
        return "public/lovable-uploads/aa1b7bb2-64d7-42b3-883f-b70da108de28.png";
      case "3d":
        return "public/lovable-uploads/731acf50-a01b-4f37-b02d-f7389f0d09ce.png";
      case "picture book":
        return "public/lovable-uploads/29a1f49c-fff3-4806-9b29-121e5a2a0af2.png";
      case "watercolor":
        return "public/lovable-uploads/ca26fbd9-76e4-4327-b14c-6fc6659a80d4.png";
      default:
        return "";
    }
  };
  
  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        Select the style you'd like for the book illustrations
      </p>
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {styles.map((style) => (
            <div 
              key={style}
              onClick={() => isActive && onSelectStyle(style)}
              className={`
                aspect-[6/7] rounded-lg overflow-hidden cursor-pointer relative
                transition-all duration-200 group
                ${selectedStyle === style ? "ring-2 ring-persimmon ring-offset-2" : ""}
              `}
            >
              <img 
                src={getStyleImage(style)}
                alt={`${style} style`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="text-white font-medium text-center">{style}</p>
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
                  {selectedStyle === style ? 'Selected' : 'Select'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StyleSelectionCard;
