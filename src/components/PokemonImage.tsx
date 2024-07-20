"use client"; // This directive makes this a Client Component

import React from 'react';

interface PokemonImageProps {
  image: string;
  name: string;
  className?: string; // Allows for custom styling
}

const PokemonImage: React.FC<PokemonImageProps> = ({ image, name, className }) => {
  const handleImageLoad = () => {
    console.log(`${name} image loaded`);
    // Additional logic for after the image loads can go here
  };

  return (
    <img
      src={image}
      alt={name}
      className={className}
      onLoad={handleImageLoad}
      style={{ objectFit: 'cover', borderRadius: '8px' }} // Example styling
    />
  );
};

export default PokemonImage;
