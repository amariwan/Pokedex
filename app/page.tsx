import { PokemonGrid } from "@/components/PokemonGrid";
import { getPokemonList } from "@/lib/pokemonAPI";

const Page = async () => {
  const pokemonList = await getPokemonList();

  return (
    <>
      <PokemonGrid pokemonList={pokemonList} />
    </>
  );
};

export default Page;
