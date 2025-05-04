
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  const [styleUrls, setStyleUrls] = useState<Record<string, string>>({});
  
  // Fetch images from Supabase storage
  useEffect(() => {
    const fetchImages = async () => {
      const urls: Record<string, string> = {};
      
      for (const style of styles) {
        const styleLower = style.toLowerCase().replace(/\s+/g, '-');
        const fileName = `${styleLower}.png`;
        
        try {
          // Try to get the file from Supabase storage
          const { data, error } = await supabase.storage
            .from('images')
            .createSignedUrl(`style-images/${fileName}`, 60 * 60); // 1 hour expiry
          
          if (data?.signedUrl) {
            urls[style] = data.signedUrl;
          } else {
            // Fall back to local images
            switch(styleLower) {
              case "retro":
                urls[style] = "/public/lovable-uploads/aa1b7bb2-64d7-42b3-883f-b70da108de28.png";
                break;
              case "3d":
                urls[style] = "/public/lovable-uploads/731acf50-a01b-4f37-b02d-f7389f0d09ce.png";
                break;
              case "picture-book":
                urls[style] = "/public/lovable-uploads/29a1f49c-fff3-4806-9b29-121e5a2a0af2.png";
                break;
              case "watercolor":
                urls[style] = "/public/lovable-uploads/ca26fbd9-76e4-4327-b14c-6fc6659a80d4.png";
                break;
              default:
                // Use the uploaded images if available
                if (style === "Retro") {
                  urls[style] = "/public/lovable-uploads/96900da0-d66c-46f5-aa49-36f111f0146d.png";
                } else if (style === "3D") {
                  urls[style] = "/public/lovable-uploads/8741f97c-e0bf-47d3-9d5b-b745946a1586.png";
                } else if (style === "Picture Book") {
                  urls[style] = "/public/lovable-uploads/5053f55a-359f-4748-a1db-c00eac13d432.png";
                } else if (style === "Watercolor") {
                  urls[style] = "/public/lovable-uploads/0c986f40-8a97-4196-aac7-c7984bcfaffd.png";
                }
                break;
            }
          }
        } catch (error) {
          console.error(`Error fetching image for ${style}:`, error);
        }
      }
      
      setStyleUrls(urls);
    };
    
    fetchImages();
  }, [styles]);
  
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
                src={styleUrls[style] || '/placeholder.svg'}
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
