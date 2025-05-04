
import { useState } from "react";

const StyleGallerySection = () => {
  const styles = [
    {
      name: "Retro",
      description: "Pixel art style with nostalgic retro vibes",
      image: "public/lovable-uploads/aa1b7bb2-64d7-42b3-883f-b70da108de28.png"
    },
    {
      name: "3D",
      description: "Modern 3D rendered illustrations",
      image: "public/lovable-uploads/731acf50-a01b-4f37-b02d-f7389f0d09ce.png"
    },
    {
      name: "Picture Book",
      description: "Charming hand-drawn picture book illustrations",
      image: "public/lovable-uploads/29a1f49c-fff3-4806-9b29-121e5a2a0af2.png"
    },
    {
      name: "Watercolor",
      description: "Soft and dreamy watercolor paintings",
      image: "public/lovable-uploads/ca26fbd9-76e4-4327-b14c-6fc6659a80d4.png"
    }
  ];

  const [hoveredStyle, setHoveredStyle] = useState<number | null>(null);

  const scrollToWizard = () => {
    document.getElementById('wizard')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-16 bg-mint/20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Choose Your Style</h2>
          <p className="mt-2 text-gray-600">Pick the perfect illustration style for your story</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {styles.map((style, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl shadow-card overflow-hidden cursor-pointer hover-lift"
              onMouseEnter={() => setHoveredStyle(index)}
              onMouseLeave={() => setHoveredStyle(null)}
              onClick={scrollToWizard}
            >
              <div className="aspect-[4/5] relative">
                <img 
                  src={style.image} 
                  alt={`${style.name} illustration style`}
                  className="w-full h-full object-cover"
                />
                
                {/* Style Label */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-white font-bold">{style.name}</p>
                </div>
                
                {/* Hover Overlay */}
                <div className={`
                  absolute inset-0 bg-persimmon transition-all duration-300 flex items-center justify-center
                  ${hoveredStyle === index ? 'opacity-80' : 'opacity-0'}
                `}>
                  <span className="text-white font-bold text-lg">Select</span>
                </div>
              </div>
              
              <div className="p-4 text-center">
                <h3 className="font-bold mb-1">{style.name}</h3>
                <p className="text-sm text-gray-600">{style.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StyleGallerySection;
