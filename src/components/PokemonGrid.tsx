'use client';

import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { NamedAPIResource, PokemonData, PokemonName } from '@/types';
import { useCallback, useMemo, useState } from 'react';
import { PokemonCard } from './PokemonCard';
import { SearchBar } from './SearchBar';
import { Button } from './ui/button';
import { ViewModeToggle } from './ViewModeToggle';

type ViewMode = 'collection' | 'favorites';

export interface PokemonGridProps {
	pokemonNameList: PokemonName[];
	initialDetails?: Record<string, PokemonData>;
	pokemonResources?: NamedAPIResource[];
}

const PAGE_SIZE = 30;

const normalizeSearchText = (value: string) => value.trim().toLowerCase();

const filterByName = (list: PokemonName[], normalizedSearch: string) => {
	if (!normalizedSearch) {
		return list;
	}

	return list.filter((pokemon) => pokemon.name.toLowerCase().includes(normalizedSearch));
};

type CollectionStateArgs = {
	pokemonNameList: PokemonName[];
	favorites: string[];
	searchText: string;
	page: number;
	viewMode: ViewMode;
};

type CollectionState = {
	visibleList: PokemonName[];
	hasMore: boolean;
	isEmpty: boolean;
};

const useCollectionState = ({ pokemonNameList, favorites, searchText, page, viewMode }: CollectionStateArgs): CollectionState => {
	const normalizedSearch = useMemo(() => normalizeSearchText(searchText), [searchText]);

	const favoriteEntries = useMemo(
		() => favorites.map((name) => ({ name })),
		[favorites],
	);

	const filteredPokemonList = useMemo(
		() => filterByName(pokemonNameList, normalizedSearch),
		[pokemonNameList, normalizedSearch],
	);

	const filteredFavoritesList = useMemo(
		() => filterByName(favoriteEntries, normalizedSearch),
		[favoriteEntries, normalizedSearch],
	);

	const pagedCollection = useMemo(
		() => filteredPokemonList.slice(0, page * PAGE_SIZE),
		[filteredPokemonList, page],
	);

	const visibleList = viewMode === 'collection' ? pagedCollection : filteredFavoritesList;
	const hasMore = viewMode === 'collection' && pagedCollection.length < filteredPokemonList.length;
	const isEmpty = visibleList.length === 0;

	return { visibleList, hasMore, isEmpty };
};

export const PokemonGrid = ({ pokemonNameList, initialDetails }: PokemonGridProps) => {
	const [searchText, setSearchText] = useState<string>('');
	const [viewMode, setViewMode] = useState<ViewMode>('collection');
	const [page, setPage] = useState(1);

	const favorites = useFavoritesStore((state) => state.favorites);

	const { visibleList, hasMore, isEmpty } = useCollectionState({
		pokemonNameList,
		favorites,
		searchText,
		page,
		viewMode,
	});

	const handleViewModeToggle = useCallback(() => {
		setViewMode((mode) => (mode === 'collection' ? 'favorites' : 'collection'));
		setSearchText('');
		setPage(1);
	}, []);

	const handleSearchChange = useCallback((text: string) => {
		setSearchText(text);
	}, []);

	const handleLoadMore = useCallback(() => {
		setPage((prev) => prev + 1);
	}, []);

	return (
		<>
			<PokemonGridHeader
				viewMode={viewMode}
				searchText={searchText}
				onSearchChange={handleSearchChange}
				onToggleViewMode={handleViewModeToggle}
			/>

			<PokemonGridSection
				viewMode={viewMode}
				visibleList={visibleList}
				isEmpty={isEmpty}
				hasMore={hasMore}
				onLoadMore={handleLoadMore}
				initialDetails={initialDetails}
				page={page}
			/>
		</>
	);
};

type PokemonGridHeaderProps = {
	viewMode: ViewMode;
	searchText: string;
	onSearchChange: (text: string) => void;
	onToggleViewMode: () => void;
};

const PokemonGridHeader = ({ viewMode, searchText, onSearchChange, onToggleViewMode }: PokemonGridHeaderProps) => (
	<section className='relative w-full px-4 pt-16 sm:px-6 lg:px-10'>
		<div className='mx-auto flex w-full max-w-6xl flex-col gap-6 rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-900/50'>
			<ViewModeToggle viewMode={viewMode} onToggle={onToggleViewMode} />
			<SearchBar searchText={searchText} onSearchChange={onSearchChange} className='mb-0' />
		</div>
	</section>
);

type PokemonGridSectionProps = {
	viewMode: ViewMode;
	visibleList: PokemonName[];
	isEmpty: boolean;
	hasMore: boolean;
	onLoadMore: () => void;
	initialDetails?: Record<string, PokemonData>;
	page: number;
};

const PokemonGridSection = ({ viewMode, visibleList, isEmpty, hasMore, onLoadMore, initialDetails, page }: PokemonGridSectionProps) => (
	<section className='relative w-full px-4 pb-20 pt-10 sm:px-6 lg:px-10'>
		<div className='pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-900/10 via-transparent to-transparent ' />
		<div className='relative mx-auto flex w-full max-w-6xl flex-col gap-10'>
			<div className='flex flex-col items-center gap-2 text-center'>
				<h3 className='text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl'>
					{viewMode === 'collection' ? 'Explore the Pokédex' : 'Your Favorites'}
				</h3>
				<p className='text-sm text-slate-600 dark:text-slate-300'>
					{viewMode === 'collection'
						? 'Filter, explore, and uncover official artwork with quick stats.'
						: 'All the Pokémon you have marked as favorites in one place.'}
				</p>
			</div>

			<div id='collection' className='flex flex-wrap justify-center gap-6'>
				{isEmpty ? (
					<PokemonGridEmptyState viewMode={viewMode} />
				) : (
					visibleList.map((pokemon, idx) => {
						const initial = initialDetails?.[pokemon.name];
						const isFirst = viewMode === 'collection' && page === 1 && idx === 0;

						return (
							<div key={pokemon.name} className='w-full px-2 max-w-[18rem]'>
								<PokemonCard name={pokemon.name} initialData={initial} priority={isFirst} className='h-full w-full' />
							</div>
						);
					})
				)}
			</div>

			{hasMore ? (
				<div className='flex justify-center'>
					<Button onClick={onLoadMore} size='lg' className='rounded-full px-6'>
						Load more Pokémon
					</Button>
				</div>
			) : null}
		</div>
	</section>
);

const PokemonGridEmptyState = ({ viewMode }: { viewMode: ViewMode }) => (
	<div className='w-full rounded-3xl border border-dashed border-slate-200/80 bg-white/80 p-12 text-center text-slate-500 backdrop-blur dark:border-white/20 dark:bg-slate-900/50 dark:text-slate-300'>
		{viewMode === 'favorites'
			? 'No favorites yet. Add Pokémon to your list to see them here.'
			: 'No Pokémon match your search. Try refining your query.'}
	</div>
);

export default PokemonGrid;
