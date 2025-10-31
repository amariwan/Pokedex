'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';
import { type PokemonData } from '@/types';

import { Icons } from './icons';

interface PokemonCompareProps {
	onClose: () => void;
}

export const PokemonCompare: React.FC<PokemonCompareProps> = ({ onClose }) => {
	const [pokemon1, _setPokemon1] = useState<PokemonData | null>(null);
	const [pokemon2, _setPokemon2] = useState<PokemonData | null>(null);

	const getStatValue = (pokemon: PokemonData | null, statName: string): number => {
		if (!pokemon) return 0;
		const stat = pokemon.stats.find((s) => s.stat.name === statName);
		return stat?.base_stat ?? 0;
	};

	const compareStats = (stat1: number, stat2: number): 'higher' | 'lower' | 'equal' => {
		if (stat1 > stat2) return 'higher';
		if (stat1 < stat2) return 'lower';
		return 'equal';
	};

	const stats = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm'>
			<div className='relative max-h-[90vh] w-full max-w-6xl overflow-auto rounded-3xl border border-white/10 bg-slate-900/95 p-8 shadow-2xl'>
				<button
					onClick={onClose}
					className='absolute top-6 right-6 rounded-full border border-white/20 bg-white/10 p-2 text-white transition hover:bg-white/20'
				>
					<Icons.close className='h-6 w-6' />
				</button>

				<h2 className='mb-8 text-3xl font-bold text-white'>Compare Pokémon</h2>

				<div className='grid gap-8 lg:grid-cols-2'>
					{/* Pokemon 1 Selector */}
					<div className='space-y-4'>
						<h3 className='text-lg font-semibold text-white/70'>Select First Pokémon</h3>
						{/* Add pokemon search/select component here */}
						<div className='rounded-2xl border border-white/10 bg-white/5 p-6'>
							<p className='text-white/60'>Search feature coming soon...</p>
						</div>
					</div>

					{/* Pokemon 2 Selector */}
					<div className='space-y-4'>
						<h3 className='text-lg font-semibold text-white/70'>Select Second Pokémon</h3>
						<div className='rounded-2xl border border-white/10 bg-white/5 p-6'>
							<p className='text-white/60'>Search feature coming soon...</p>
						</div>
					</div>
				</div>

				{/* Stats Comparison */}
				{pokemon1 && pokemon2 && (
					<div className='mt-8 space-y-4'>
						<h3 className='text-xl font-bold text-white'>Stats Comparison</h3>
						{stats.map((statName) => {
							const stat1 = getStatValue(pokemon1, statName);
							const stat2 = getStatValue(pokemon2, statName);
							const comparison = compareStats(stat1, stat2);
							const maxStat = Math.max(stat1, stat2, 100);

							return (
								<div key={statName} className='space-y-2'>
									<div className='flex items-center justify-between text-sm text-white/70'>
										<span className='capitalize'>{statName.replace('-', ' ')}</span>
									</div>
									<div className='flex items-center gap-4'>
										<div className='flex flex-1 items-center gap-2'>
											<span
												className={cn(
													'w-12 text-right font-semibold',
													comparison === 'higher'
														? 'text-green-400'
														: comparison === 'lower'
															? 'text-red-400'
															: 'text-white',
												)}
											>
												{stat1}
											</span>
											<div className='relative h-4 flex-1 overflow-hidden rounded-full bg-white/10'>
												<div
													className={cn(
														'h-full rounded-full transition-all duration-500',
														comparison === 'higher'
															? 'bg-green-500'
															: comparison === 'lower'
																? 'bg-red-500/50'
																: 'bg-blue-500',
													)}
													style={{ width: `${(stat1 / maxStat) * 100}%` }}
												/>
											</div>
										</div>
										<div className='flex flex-1 items-center gap-2'>
											<div className='relative h-4 flex-1 overflow-hidden rounded-full bg-white/10'>
												<div
													className={cn(
														'h-full rounded-full transition-all duration-500',
														comparison === 'lower'
															? 'bg-green-500'
															: comparison === 'higher'
																? 'bg-red-500/50'
																: 'bg-blue-500',
													)}
													style={{ width: `${(stat2 / maxStat) * 100}%` }}
												/>
											</div>
											<span
												className={cn(
													'w-12 font-semibold',
													comparison === 'lower'
														? 'text-green-400'
														: comparison === 'higher'
															? 'text-red-400'
															: 'text-white',
												)}
											>
												{stat2}
											</span>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
};
