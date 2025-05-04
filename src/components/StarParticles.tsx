
import React, { useEffect, useState } from 'react';

interface StarParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  animationDelay: number;
  animationDuration: number;
}

const StarParticles: React.FC = () => {
  const [stars, setStars] = useState<StarParticle[]>([]);
  
  useEffect(() => {
    // Create 50 random star particles
    const generateStars = () => {
      const newStars: StarParticle[] = [];
      for (let i = 0; i < 50; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100, // Position from 0-100% of container width
          y: Math.random() * 100, // Position from 0-100% of container height
          size: Math.random() * (10 - 3) + 3, // Size between 3-10px
          opacity: Math.random() * 0.7 + 0.3, // Opacity between 0.3-1
          animationDelay: Math.random() * 5, // Delay animation start by 0-5s
          animationDuration: Math.random() * 6 + 3 // Animation cycle takes 3-9s
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-goldenYellow/40"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `twinkle ${star.animationDuration}s infinite ease-in-out`,
            animationDelay: `${star.animationDelay}s`
          }}
        />
      ))}
    </div>
  );
};

export default StarParticles;
