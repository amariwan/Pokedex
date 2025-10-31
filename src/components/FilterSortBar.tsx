'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Icons } from './icons';

export type PokemonType =
	| 'all'
	| 'normal'
	| 'fire'
	| 'water'
	| 'electric'
	| 'grass'
	| 'ice'
	| 'fighting'
	| 'poison'
	| 'ground'
	| 'flying'
	| 'psychic'
	| 'bug'
	| 'rock'
	| 'ghost'
	| 'dragon'
	| 'dark'
	| 'steel'
	| 'fairy';

export type SortOption = 'id' | 'name' | 'height' | 'weight' | 'hp' | 'attack' | 'defense';

interface FilterSortBarProps {
	selectedTypes: PokemonType[];
	onTypeChange: (types: PokemonType[]) => void;
	sortBy: SortOption;
	onSortChange: (sort: SortOption) => void;
	sortOrder: 'asc' | 'desc';
	onSortOrderChange: (order: 'asc' | 'desc') => void;
}

const TYPE_COLORS: Record<PokemonType, string> = {
	all: 'bg-slate-500/20 hover:bg-slate-500/30 border-slate-400/30',
	normal: 'bg-gray-500/20 hover:bg-gray-500/30 border-gray-400/30',
	fire: 'bg-orange-500/20 hover:bg-orange-500/30 border-orange-400/30',
	water: 'bg-blue-500/20 hover:bg-blue-500/30 border-blue-400/30',
	electric: 'bg-yellow-400/20 hover:bg-yellow-400/30 border-yellow-300/40',
	grass: 'bg-green-500/20 hover:bg-green-500/30 border-green-400/30',
	ice: 'bg-cyan-400/20 hover:bg-cyan-400/30 border-cyan-300/30',
	fighting: 'bg-red-600/25 hover:bg-red-600/35 border-red-500/40',
	poison: 'bg-purple-600/20 hover:bg-purple-600/30 border-purple-500/40',
	ground: 'bg-yellow-700/25 hover:bg-yellow-700/35 border-yellow-600/40',
	flying: 'bg-indigo-400/20 hover:bg-indigo-400/30 border-indigo-300/40',
	psychic: 'bg-pink-500/20 hover:bg-pink-500/30 border-pink-400/30',
	bug: 'bg-lime-500/25 hover:bg-lime-500/35 border-lime-400/40',
	rock: 'bg-amber-700/25 hover:bg-amber-700/35 border-amber-600/40',
	ghost: 'bg-purple-500/20 hover:bg-purple-500/30 border-purple-400/30',
	dragon: 'bg-indigo-600/20 hover:bg-indigo-600/30 border-indigo-500/40',
	dark: 'bg-gray-800/60 hover:bg-gray-800/70 border-gray-700/60',
	steel: 'bg-slate-500/25 hover:bg-slate-500/35 border-slate-400/40',
	fairy: 'bg-pink-400/20 hover:bg-pink-400/30 border-pink-300/40',
};

const TYPES: PokemonType[] = [
	'all', 'normal', 'fire', 'water', 'electric', 'grass', 'ice',
	'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
	'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
	{ value: 'id', label: 'Pokédex #' },
	{ value: 'name', label: 'Name' },
	{ value: 'height', label: 'Height' },
	{ value: 'weight', label: 'Weight' },
	{ value: 'hp', label: 'HP' },
	{ value: 'attack', label: 'Attack' },
	{ value: 'defense', label: 'Defense' },
];

export const FilterSortBar: React.FC<FilterSortBarProps> = ({
	selectedTypes,
	onTypeChange,
	sortBy,
	onSortChange,
	sortOrder,
	onSortOrderChange,
}) => {
	const [showAllTypes, setShowAllTypes] = useState(false);

	const handleTypeToggle = (type: PokemonType) => {
		if (type === 'all') {
			onTypeChange(['all']);
			return;
		}

		const newTypes = selectedTypes.includes('all')
			? [type]
			: selectedTypes.includes(type)
			? selectedTypes.filter(t => t !== type)
			: [...selectedTypes.filter(t => t !== 'all'), type];

		onTypeChange(newTypes.length === 0 ? ['all'] : newTypes);
	};

	const displayedTypes = showAllTypes ? TYPES : TYPES.slice(0, 9);

	return (
		<div className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
			{/* Type Filters */}
			<div>
				<h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/70">
					Filter by Type
				</h3>
				<div className="flex flex-wrap gap-2">
					{displayedTypes.map((type) => (
						<button
							key={type}
							onClick={() => handleTypeToggle(type)}
							className={cn(
								'rounded-full border px-4 py-2 text-sm font-medium capitalize transition-all duration-200',
								'backdrop-blur-sm',
								TYPE_COLORS[type],
								selectedTypes.includes(type)
									? 'scale-105 ring-2 ring-white/40'
									: 'hover:scale-105'
							)}
						>
							{type}
						</button>
					))}
					{!showAllTypes && (
						<button
							onClick={() => setShowAllTypes(true)}
							className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 backdrop-blur-sm transition-all hover:bg-white/10"
						>
							+{TYPES.length - 9} more
						</button>
					)}
					{showAllTypes && (
						<button
							onClick={() => setShowAllTypes(false)}
							className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 backdrop-blur-sm transition-all hover:bg-white/10"
						>
							Show less
						</button>
					)}
				</div>
			</div>

			{/* Sort Options */}
			<div className="flex flex-wrap items-center gap-4">
				<h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">
					Sort by
				</h3>
				<div className="flex flex-wrap gap-2">
					{SORT_OPTIONS.map((option) => (
						<button
							key={option.value}
							onClick={() => onSortChange(option.value)}
							className={cn(
								'rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200',
								'backdrop-blur-sm',
								sortBy === option.value
									? 'border-white/40 bg-white/20 text-white ring-2 ring-white/20'
									: 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
							)}
						>
							{option.label}
						</button>
					))}
				</div>
				<button
					onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
					className="rounded-full border border-white/20 bg-white/10 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/20"
					aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
				>
					{sortOrder === 'asc' ? (
						<Icons.arrowUp className="h-5 w-5" />
					) : (
						<Icons.arrowDown className="h-5 w-5" />
					)}
				</button>
			</div>

			{/* Active Filters Summary */}
			{selectedTypes.length > 0 && !selectedTypes.includes('all') && (
				<div className="flex items-center gap-2 text-sm text-white/60">
					<span>Active filters:</span>
					<span className="font-medium text-white">
						{selectedTypes.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')}
					</span>
					<button
						onClick={() => onTypeChange(['all'])}
						className="ml-2 text-white/70 underline hover:text-white"
					>
						Clear all
					</button>
				</div>
			)}
		</div>
	);
};
