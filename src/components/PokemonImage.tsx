'use client';

import React from 'react';
import Image from 'next/image';
import { PokemonImageProps } from '@/types';

const PokemonImage: React.FC<PokemonImageProps> = ({ image, name, className }) => {
	const handleImageLoad = () => {
		console.log(`${name} image loaded`);
	};

	return <Image src={image} alt={name} className={className} onLoad={handleImageLoad} style={{ objectFit: 'cover', borderRadius: '8px' }} />;
};

export default PokemonImage;
