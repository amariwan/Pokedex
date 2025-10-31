'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { useFavoritesStore } from '@/stores/useFavoritesStore';

import { PokemonCard } from './PokemonCard';
import { SearchBar } from './SearchBar';
import { Button } from './ui/button';

export const FavoritesPage = () => {
	const [searchText, setSearchText] = useState('');
	const favorites = useFavoritesStore((state) => state.favorites);

	const filteredFavorites = useMemo(() => {
		const normalizedSearch = searchText.trim().toLowerCase();
		if (!normalizedSearch) {
			return favorites;
		}

		return favorites.filter((name) => name.toLowerCase().includes(normalizedSearch));
	}, [favorites, searchText]);

	return (
		<main className='relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-10'>
			<section className='rounded-3xl border border-slate-200/60 bg-white/80 p-10 text-center shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-900/50'>
				<div className='mx-auto flex max-w-2xl flex-col items-center gap-6'>
					<h3 className='text-3xl font-semibold text-slate-900 sm:text-4xl dark:text-white'>
						Your Favorite Pokémon
					</h3>
					<p className='text-sm text-slate-600 dark:text-slate-300'>
						All the creatures you marked as favorites are collected below. Continue exploring to
						grow your roster.
					</p>
					<SearchBar
						searchText={searchText}
						onSearchChange={(text) => setSearchText(text)}
						className='w-full'
					/>
				</div>
			</section>

			<section className='mt-12 flex flex-col gap-6'>
				<div className='flex flex-col items-center gap-2 text-center'>
					<h4 className='text-2xl font-semibold text-slate-900 dark:text-white'>Pinned Pokémon</h4>
					<p className='text-sm text-slate-600 dark:text-slate-300'>
						Use the search above to quickly jump to any of your favorites.
					</p>
				</div>
				<div className='flex flex-wrap justify-center gap-6'>
					{filteredFavorites.length === 0 ? (
						<div className='w-full rounded-3xl border border-dashed border-slate-200/70 bg-white/70 p-12 text-center text-slate-500 backdrop-blur dark:border-white/20 dark:bg-slate-900/40 dark:text-slate-300'>
							<p>
								No favorites yet. Browse the collection and tap the heart icon to save Pokémon here.
							</p>
							<div className='mt-6 flex justify-center'>
								<Link href='/#collection'>
									<Button className='rounded-full px-6'>Browse collection</Button>
								</Link>
							</div>
						</div>
					) : (
						filteredFavorites.map((name) => (
							<div
								key={name}
								className='flex w-full min-w-[18rem] flex-1 basis-full justify-center sm:basis-[48%] lg:basis-[30%] xl:basis-[22%]'
							>
								<PokemonCard name={name} className='w-full' />
							</div>
						))
					)}
				</div>
			</section>
		</main>
	);
};
