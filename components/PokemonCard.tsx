import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getPokemon } from '@/lib/pokemonAPI';

interface PokemonCardProps {
  name: string;
}

export const PokemonCard = ({ name }: PokemonCardProps) => {
  const [pokemonObject, setPokemonObject] = useState<any>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      const data = await getPokemon(name);
      setPokemonObject(data);
    };

    fetchPokemon();
  }, [name]);

  if (!pokemonObject) return <div className="p-4">Loading...</div>;

  return (
    <div className="relative p-4 m-4 border rounded-xl bg-white shadow-lg dark:bg-gray-800 dark:border-gray-700 hover:scale-105 transform transition-transform duration-300 ease-in-out">
      <Link href={`/${name}`} className="group flex flex-col items-center">
        <div className="relative w-32 h-32 mb-4">
          <img
            src={pokemonObject.sprites.other['official-artwork'].front_default}
            alt={pokemonObject.name}
            className="object-contain w-full h-full rounded-lg shadow-md transition-transform duration-300 ease-in-out group-hover:scale-110"
          />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-500">
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {pokemonObject.types.map((type: { type: { name: string } }) => (
            <span key={type.type.name} className={`inline-block px-2 py-1 text-xs font-medium rounded-full mr-1 ${type.type.name === 'grass' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-800'}`}>
              {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
            </span>
          ))}
        </p>
      </Link>
    </div>
  );
};
