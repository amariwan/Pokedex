"use client";

import { FC } from 'react';

// Footer uses the current year on the client to avoid Next.js server-time access rules
export const Footer: FC = () => {
	const year = new Date().getFullYear();
	return (
		<footer className='border-t border-white/6 bg-transparent py-6'>
			<div className='container mx-auto text-center'>
				<p className='text-sm md:text-base text-white/70'>
					&copy; {year} Pokédex App. All rights reserved. Created by Aland Baban.
				</p>
			</div>
		</footer>
	);
};
