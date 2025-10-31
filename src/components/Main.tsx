'use client';
import { type ReactNode } from 'react';

interface MainProps {
	children: ReactNode;
}

export const Main: React.FC<MainProps> = ({ children }) => {
	return (
		<main className='flex min-h-screen flex-col pt-20'>
			<div className='container mx-auto'>{children}</div>
		</main>
	);
};
