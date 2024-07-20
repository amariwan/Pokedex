'use client';

import { FC } from 'react';

export const Footer: FC = () => {
	return (
		<footer>
			<div className='container mx-auto text-center'>
				<p className='text-sm md:text-base'>&copy; {new Date().getFullYear()} Pokédex App. All rights reserved. Created by Aland Mariwan.</p>
			</div>
		</footer>
	);
};
