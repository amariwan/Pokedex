// app/page.tsx
import Hero from '@/components/Hero';
import PokemonGridClient from '@/components/PokemonGridClient';
import { getPokemonDetailsBatch, getPokemonList } from '@/lib/pokemonAPI';
import { type PokemonData } from '@/types';

const INITIAL_COUNT = 24; // fetch details for first N pokemons to improve initial load

const Page = async () => {
	const pokemonResources = await getPokemonList();
	const formattedPokemonNameList = pokemonResources.map(({ name }) => ({ name }));

	// Prefetch details for the first INITIAL_COUNT pokemons
	const firstNames = formattedPokemonNameList.slice(0, INITIAL_COUNT).map((p) => p.name);
	const initialDetailsArray = await getPokemonDetailsBatch(firstNames);
	const initialDetails = initialDetailsArray.reduce<Record<string, PokemonData>>((acc, pokemon) => {
		acc[pokemon.name] = pokemon;
		return acc;
	}, {});

	return (
		<>
			<Hero />
			{/* PokemonGrid is client-heavy (react-query, hooks). Use a client wrapper that loads it without SSR. */}
			<PokemonGridClient
				pokemonNameList={formattedPokemonNameList}
				pokemonResources={pokemonResources}
				initialDetails={initialDetails}
			/>
		</>
	);
};

export default Page;
