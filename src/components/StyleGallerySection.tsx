
import { useState } from "react";

const StyleGallerySection = () => {
  const styles = [
    {
      name: "Cartoon",
      description: "Playful and colorful cartoon style illustrations"
    },
    {
      name: "Watercolor",
      description: "Soft and dreamy watercolor paintings"
    },
    {
      name: "3D",
      description: "Modern 3D rendered illustrations"
    },
    {
      name: "Pop-Art",
      description: "Bold and vibrant pop-art illustrations"
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
              <div className="aspect-[4/5] bg-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl">{style.name === "Cartoon" ? "🎨" : style.name === "Watercolor" ? "🖌️" : style.name === "3D" ? "🧩" : "🎭"}</span>
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
