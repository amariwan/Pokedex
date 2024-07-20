import { FC } from 'react';
import { HoverBorderGradient } from '@/src/components/ui/hover-border-gradient';

interface ViewModeToggleProps {
	viewMode: 'collection' | 'favorites';
	onToggle: () => void;
}

export const ViewModeToggle: FC<ViewModeToggleProps> = ({ viewMode, onToggle }) => {
	return (
		<div className='flex flex-col items-center md:flex-row md:justify-between mb-6'>
			<h3 className='text-3xl md:text-4xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-4 md:mb-0'>{viewMode === 'collection' ? 'Find Your Pokémon' : 'Your Favorite Pokémon'}</h3>
			<HoverBorderGradient onClick={onToggle} containerClassName='rounded-full' as='button' className=' px-2 py-1 dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2'>
				<span>{viewMode === 'collection' ? 'Show Favorites' : 'Show Collection'}</span>
			</HoverBorderGradient>
		</div>
	);
};
