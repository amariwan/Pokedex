'use client';

import { cn } from '@/lib/utils';

import { Input } from './ui/input';
import { Label } from './ui/label';

interface SearchBarProps {
	searchText: string;
	onSearchChange: (text: string) => void;
	className?: string;
}

export const SearchBar = ({ searchText, onSearchChange, className }: SearchBarProps) => (
	<div className={cn('relative', className)}>
		<Label htmlFor='pokemonName' className='sr-only'>
			Search Pokémon
		</Label>
		<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
			<svg
				className='h-6 w-6 text-gray-600'
				fill='none'
				stroke='currentColor'
				viewBox='0 0 24 24'
				xmlns='http://www.w3.org/2000/svg'
				aria-hidden='true'
			>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='2'
					d='M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z'
				/>
			</svg>
		</div>
		<Input
			type='text'
			value={searchText}
			id='pokemonName'
			name='pokemonName'
			aria-label='Search Pokémon'
			autoComplete='off'
			placeholder='Search Pokémon...'
			onChange={(e) => onSearchChange(e.target.value)}
			className='border-2 py-3 pr-4 pl-12'
		/>
	</div>
);
