'use client';

import { PlaceholdersAndVanishInput } from '@/src/components/ui/placeholders-and-vanish-input';
import { Label } from './ui/label';
import { Input } from './ui/input';

interface SearchBarProps {
	searchText: string;
	onSearchChange: (text: string) => void;
}

export const SearchBar = ({ searchText, onSearchChange }: SearchBarProps) => (
	<div className='relative mb-8'>
		<Label htmlFor='pokemonName' className='sr-only'>
			Search Pokémon
		</Label>
		<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
			<svg className='w-6 h-6 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
				<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M11 4a7 7 0 00-7 7h3a4 4 0 014-4v3a7 7 0 007 7v-3a4 4 0 01-4-4V4z' />
			</svg>
		</div>
		<Input type='text' value={searchText} id='pokemonName' placeholder='Search Pokémon...' onChange={(e) => onSearchChange(e.target.value)} className='pl-12 py-3 pr-4 border-2' />
	</div>
);
