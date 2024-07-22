import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getPokemon } from '@/lib/pokemonAPI';
import Tooltip from '@/components/Tooltip';
import { Icons } from './icons';
import { Pokemon, PokemonCardProps } from '@/types';

const typeColors: Record<string, { bg: string; text: string }> = {
	grass: { bg: 'bg-green-500', text: 'text-white' },
	fire: { bg: 'bg-red-500', text: 'text-white' },
	water: { bg: 'bg-blue-500', text: 'text-white' },
	electric: { bg: 'bg-yellow-500', text: 'text-black' },
	psychic: { bg: 'bg-purple-500', text: 'text-white' },
	ice: { bg: 'bg-teal-500', text: 'text-white' },
	dragon: { bg: 'bg-indigo-500', text: 'text-white' },
	dark: { bg: 'bg-gray-800', text: 'text-white' },
	fairy: { bg: 'bg-pink-500', text: 'text-white' },
	fighting: { bg: 'bg-orange-500', text: 'text-white' },
	flying: { bg: 'bg-blue-300', text: 'text-gray-800' },
	poison: { bg: 'bg-purple-700', text: 'text-white' },
	ground: { bg: 'bg-yellow-700', text: 'text-white' },
	rock: { bg: 'bg-yellow-600', text: 'text-white' },
	bug: { bg: 'bg-green-700', text: 'text-white' },
	ghost: { bg: 'bg-purple-900', text: 'text-white' },
	steel: { bg: 'bg-gray-400', text: 'text-gray-800' },
	unknown: { bg: 'bg-gray-300', text: 'text-gray-800' },
	shadow: { bg: 'bg-black', text: 'text-gray-100' },
};
export const PokemonCard = ({ name }: PokemonCardProps) => {
	const [pokemonObject, setPokemonObject] = useState<Pokemon | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isFavorite, setIsFavorite] = useState<boolean>(false);

	useEffect(() => {
		const fetchPokemon = async () => {
			setIsLoading(true);
			const data = await getPokemon(name);
			setPokemonObject(data);
			setIsLoading(false);

			const favorites = JSON.parse(localStorage.getItem('favorites') ?? '[]');
			setIsFavorite(favorites.includes(name));
		};

		fetchPokemon();
	}, [name]);

	const addFavorite = () => {
		const favorites = JSON.parse(localStorage.getItem('favorites') ?? '[]');
		if (!favorites.includes(name)) {
			favorites.push(name);
			localStorage.setItem('favorites', JSON.stringify(favorites));
			setIsFavorite(true);
		}
	};

	const removeFavorite = () => {
		const favorites = JSON.parse(localStorage.getItem('favorites') ?? '[]');
		const newFavorites = favorites.filter((favorite: string) => favorite !== name);
		localStorage.setItem('favorites', JSON.stringify(newFavorites));
		setIsFavorite(false);
	};

	const handleFavoriteClick = () => {
		if (isFavorite) {
			removeFavorite();
		} else {
			addFavorite();
		}
	};

	if (isLoading) {
		return (
			<div className='relative p-4 m-4 border rounded-xl bg-white shadow-lg dark:bg-gray-800 dark:border-gray-700'>
				<div className='animate-pulse flex flex-col items-center space-y-4'>
					<div className='rounded-md bg-gray-300 dark:bg-gray-700 h-32 w-32'></div>
					<div className='h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4'></div>
					<div className='space-y-2 w-full px-4'>
						<div className='h-4 bg-gray-300 dark:bg-gray-700 rounded'></div>
						<div className='h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6'></div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='relative p-4 m-4 border rounded-xl bg-white shadow-lg dark:bg-gray-800 dark:border-gray-700 hover:scale-105 transform transition-transform duration-300 ease-in-out'>
			<Link href={`/pokemon/${name}`} passHref>
				<div className='group flex flex-col items-center cursor-pointer'>
					<div className='relative w-32 h-32 mb-4'>
						<Image src={pokemonObject?.sprites.other['official-artwork'].front_default || ''} alt={pokemonObject?.name || 'Pokemon'} className='object-cover rounded-lg' width={128} height={128} />
					</div>
					<h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-500'>{name.charAt(0).toUpperCase() + name.slice(1)}</h2>
					<div className='flex flex-wrap justify-center'>
						{pokemonObject?.types.map((type) => {
							const { bg, text } = typeColors[type.type.name] || typeColors.unknown;
							return (
								<span key={type.type.name} className={`inline-block px-3 py-1 text-xs font-medium rounded-full mr-1 ${bg} ${text}`}>
									{type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
								</span>
							);
						})}
					</div>
				</div>
			</Link>
			<div onClick={handleFavoriteClick} className='absolute top-2 right-2 bg-gray-100 dark:bg-gray-700 rounded-full p-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200'>
				<Tooltip text={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>{isFavorite ? <Icons.heartFilled aria-label='favorites' className='h-6 w-6' /> : <Icons.heart aria-label='favorites' className='h-6 w-6' />}</Tooltip>
			</div>
		</div>
	);
};
