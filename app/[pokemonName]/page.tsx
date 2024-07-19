import { getPokemon, getAllPokemonNames } from '@/lib/pokemonAPI';
import PokemonImage from '@/components/PokemonImage';
import { Progress } from '@/components/ui/progress';

interface PokemonPageProps {
  params: {
    pokemonName: string;
  };
}

interface PokemonStat {
  stat: {
    name: string;
  };
  base_stat: number;
}

interface Pokemon {
  name: string;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  weight: number;
  stats: PokemonStat[];
}




const PokemonPage = async ({ params }: PokemonPageProps) => {
  const { pokemonName } = params;

  try {
    const pokemon: Pokemon = await getPokemon(pokemonName);

    return (
      <>
        <h1 className="text-4xl font-bold pt-4">
          {pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}
        </h1>
        <div
          className="m-4"
          style={{ position: 'relative', width: '300px', height: '300px' }}
        >
          <PokemonImage
            image={pokemon.sprites.other['official-artwork'].front_default}
            name={pokemonName}
          />
        </div>
        <h3>Weight: {pokemon.weight}</h3>
        <div className="flex-col">
          {pokemon.stats.map((statObject) => {
            const { name: statName } = statObject.stat;
            const { base_stat: statValue } = statObject;

            return (
              <div
                className="flex items-stretch mb-2"
                style={{ width: '500px' }}
                key={statName}
              >
                <h3 className="p-3 w-2/4">
                  {statName.charAt(0).toUpperCase() + statName.slice(1)}: {statValue}
                </h3>
                <Progress className="w-2/4 m-auto" value={statValue} />
              </div>
            );
          })}
        </div>
      </>
    );
  } catch (error) {
    return <div className="text-red-500">Failed to load Pokémon data.</div>;
  }
};

export default PokemonPage;
