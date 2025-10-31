'use client';
import { useMemo } from 'react';

import { useGetAllPokemonPage } from '@/hooks/use-pokeapi';

import Loading from '../loading';
import usePaginationStore from '../store/store';
import { Button } from '../ui/button';
import PokemonCard from './pokemon-card';

export default function PokemonList() {
	const { currentPage, itemsPerPage, updatePagePosition } = usePaginationStore();

	const { isLoading, data: pokemonPage, error } = useGetAllPokemonPage(itemsPerPage, currentPage);

	const pokemonList = useMemo(() => pokemonPage ?? [], [pokemonPage]);

	if (isLoading) {
		return <Loading />;
	}

	if (error) {
		return <div>Error</div>;
	}

	return (
		<div className='flex flex-wrap justify-center gap-6'>
			{pokemonList.map((pokemon) => (
				<div
					key={pokemon.name}
					className='flex w-full min-w-[18rem] flex-1 basis-full justify-center sm:basis-[48%] lg:basis-[30%] xl:basis-[22%]'
				>
					<PokemonCard
						pokemonName={pokemon.name}
						pokemonImgUrl={`https://img.pokemondb.net/artwork/large/${pokemon.name}.jpg`}
					/>
				</div>
			))}

			<div className='fixed right-4 bottom-0 mr-4 mb-4 flex flex-row gap-2 md:bottom-[-10]'>
				<Button size={'lg'} onClick={() => updatePagePosition(-itemsPerPage)}>
					-
				</Button>
				<Button size={'lg'} onClick={() => updatePagePosition(itemsPerPage)}>
					+
				</Button>
			</div>
		</div>
	);
}
