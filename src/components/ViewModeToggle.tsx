import { FC } from 'react';

import { Button } from '@/components/ui/button';

interface ViewModeToggleProps {
	viewMode: 'collection' | 'favorites';
	onToggle: () => void;
}

export const ViewModeToggle: FC<ViewModeToggleProps> = ({ viewMode, onToggle }) => {
	return (
		<div className='flex flex-col gap-4 text-center md:flex-row md:items-center md:justify-between md:text-left'>
			<div>
				<h3 className='text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl'>
					{viewMode === 'collection' ? 'Find your next favorite Pokémon' : 'Your curated Pokémon lineup'}
				</h3>
				<p className='mt-1 text-sm text-slate-600 dark:text-slate-300'>
					{viewMode === 'collection'
						? 'Browse the entire Pokédex, filter by name, and uncover detailed stats instantly.'
						: 'Everything you have starred lives here — perfect for quick reference and bragging rights.'}
				</p>
			</div>
			<Button onClick={onToggle} variant='secondary' className='mx-auto w-full rounded-full px-6 py-2 md:mx-0 md:w-auto'>
				{viewMode === 'collection' ? 'Show favorites' : 'Back to collection'}
			</Button>
		</div>
	);
};
