// app/page.tsx
import { PokemonGrid } from '@/src/components/PokemonGrid';
import { getPokemonList, getAllPokemonNames } from '@/src/lib/pokemonAPI';

const Page = async () => {
	const pokemonList = await getPokemonList();
	const pokemonNameList = await getAllPokemonNames();

	const formattedPokemonNameList = pokemonNameList.map((name: string) => ({ name }));

	return <PokemonGrid pokemonList={pokemonList} pokemonNameList={formattedPokemonNameList} />;
};

export default Page;
