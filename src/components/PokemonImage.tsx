'use client';

import Image from 'next/image';
import React from 'react';

import { type PokemonImageProps } from '@/types';

const PokemonImage: React.FC<PokemonImageProps> = ({ image, name, className }) => {
	return (
		<Image
			src={image}
			alt={name}
			className={className}
			loading='lazy'
			style={{ objectFit: 'cover', borderRadius: '8px' }}
		/>
	);
};

export default PokemonImage;
