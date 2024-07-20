'use client';

import { useState, useEffect } from 'react';
import { PokemonCard } from './PokemonCard';
import { SearchBar } from './SearchBar';
import { ViewModeToggle } from './ViewModeToggle';
import { Pokemon, PokemonName } from '@/src/types';

interface PokemonGridProps {
	pokemonList: Pokemon[];
	pokemonNameList: PokemonName[];
}

export const PokemonGrid = ({ pokemonList, pokemonNameList }: PokemonGridProps) => {
	const [searchText, setSearchText] = useState<string>('');
	const [viewMode, setViewMode] = useState<'collection' | 'favorites'>('collection');
	const [favorites, setFavorites] = useState<PokemonName[]>([]);

	const searchFilter = (pokemonList: PokemonName[], searchText: string) => {
		return pokemonList.filter((pokemon) => pokemon.name.toLowerCase().includes(searchText.toLowerCase()));
	};

	const filteredPokemonList = searchFilter(pokemonNameList, searchText);
	const filteredFavoritesList = searchFilter(favorites, searchText);

	useEffect(() => {
		if (viewMode === 'favorites') {
			try {
				const favoritesList = JSON.parse(localStorage.getItem('favorites') || '[]');
				setFavorites(favoritesList.map((name: string) => ({ name })));
			} catch (err) {
				console.error('Error fetching favorites:', err);
			}
		}
	}, [viewMode]);

	const handleViewModeToggle = () => {
		setViewMode(viewMode === 'collection' ? 'favorites' : 'collection');
		setSearchText('');
	};

	return (
		<>
			<section className='w-full pt-20 px-10'>
				<ViewModeToggle viewMode={viewMode} onToggle={handleViewModeToggle} />
			</section>

			<section className='max-w-6xl mx-auto px-2 py-4'>
				<SearchBar searchText={searchText} onSearchChange={(text) => setSearchText(text)} />
			</section>

			<section className='w-full max-w-screen-xl min-w-full mx-auto p-4'>
				<h3 className='text-4xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100'>{viewMode === 'collection' ? 'Pokémon Collection' : 'Favorites'}</h3>
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'>
					{(viewMode === 'collection' ? filteredPokemonList : filteredFavoritesList).slice(0, 150).map((pokemon) => (
						<PokemonCard name={pokemon.name} key={pokemon.name} />
					))}
				</div>
			</section>
		</>
	);
};
