'use client';
import { Suspense } from 'react';

import Loading from '@/components/loading';
import { useGetPokemon } from '@/hooks/use-pokeapi';
import { getPokemonArtworkUrl } from '@/lib/pokemon-images';
import { PokemonData } from '@/types';
import PokedataCard from './pokedata-card';
import SpeciesInfo from './species-info';

type Props = {
	pokemonName: string;
	initialData?: PokemonData;
	accentType?: string | null;
};

export default function PokemonDetails({ pokemonName, initialData, accentType }: Props) {
	const { data, isLoading, isError } = useGetPokemon(pokemonName, {
		initialData,
	});

	if (isLoading) {
		return <Loading />;
	}

	if (isError) {
		return <div>No Data Found</div>;
	}

	return (
		<section className='grid gap-10 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]'>
			{data ? (
				<>
					<PokedataCard pokemonData={data} pokemonImageURL={getPokemonArtworkUrl(data.id)} accentType={accentType} />

					<Suspense fallback={<Loading />}>
						<SpeciesInfo pokemonData={data} accentType={accentType} />
					</Suspense>
				</>
			) : null}
		</section>
	);
}
