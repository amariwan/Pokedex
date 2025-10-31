'use client';

import { PokemonImageProps } from '@/types';
import Image from 'next/image';
import React from 'react';

const PokemonImage: React.FC<PokemonImageProps> = ({ image, name, className }) => {
	return (
		<Image
			src={image}
			alt={name}
			className={className}
			loading="lazy"
			style={{ objectFit: 'cover', borderRadius: '8px' }}
		/>
	);
};

export default PokemonImage;
