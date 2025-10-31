import { AnimatedValue } from '@/components/animated-value';
import { StatsBar } from '@/components/stats-bar';
import { formatMetricValue } from '@/lib/formatters';
import { TYPE_ACCENT_BARS, typeBadgeClass, typeGradient } from '@/lib/pokemon-theme';
import { capitalize, cn } from '@/lib/utils';
import { type PokemonData } from '@/types';

import PokemonImageWithShiny from './PokemonImageWithShiny';

type Props = {
	pokemonData: PokemonData;
	pokemonImageURL: string;
	accentType?: string | null;
};

const STAT_LABELS: Record<string, string> = {
	hp: 'HP',
	attack: 'Attack',
	defense: 'Defense',
	'special-attack': 'Sp. Atk',
	'special-defense': 'Sp. Def',
	speed: 'Speed',
};

export default function PokedataCard({ pokemonData, pokemonImageURL, accentType }: Props) {
	const primaryType = accentType ?? pokemonData.types?.[0]?.type.name ?? 'default';
	const gradient = typeGradient(primaryType);
	const barAccent = TYPE_ACCENT_BARS[primaryType] ?? TYPE_ACCENT_BARS.default;

	const height = formatMetricValue(pokemonData.height, 10, ' m');
	const weight = formatMetricValue(pokemonData.weight, 10, ' kg');
	const baseExperience = pokemonData.base_experience ?? null;
	const baseExperienceValue =
		typeof baseExperience === 'number'
			? { raw: baseExperience, suffix: undefined, round: 0 }
			: { raw: null };
	const totalStats = pokemonData.stats.reduce((sum, stat) => sum + stat.base_stat, 0);

	const quickFacts = [
		{ label: 'Height', value: height },
		{ label: 'Weight', value: weight },
		{ label: 'Base EXP', value: baseExperienceValue },
		{ label: 'Base Stat Total', value: { raw: totalStats, round: 0 } },
	];

	return (
		<article className='relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl'>
			<div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-80`} />
			<div className='pointer-events-none absolute top-20 -right-16 h-64 w-64 rounded-full bg-white/10 blur-3xl' />
			<div className='pointer-events-none absolute -top-10 -left-10 h-48 w-48 rounded-full bg-white/10 blur-3xl' />

			<div className='relative flex flex-col gap-10 p-8 md:p-10'>
				<div className='flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between'>
					<div className='flex flex-col gap-4'>
						<span className='text-xs tracking-[0.55em] text-white/80 uppercase'>
							#{pokemonData.id?.toString().padStart(4, '0') ?? '—'}
						</span>
						<div>
							<h2 className='text-4xl font-semibold tracking-tight text-white sm:text-5xl'>
								{capitalize(pokemonData.name)}
							</h2>
							<p className='mt-2 text-sm tracking-[0.35em] text-white/70 uppercase'>
								{pokemonData.types.map((type) => capitalize(type.type.name)).join(' • ')}
							</p>
						</div>
						<div className='flex flex-wrap gap-3 pt-2'>
							{pokemonData.types.map((type) => (
								<span
									key={type.type.name}
									className={cn(
										'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase shadow-sm',
										typeBadgeClass(type.type.name),
									)}
								>
									{capitalize(type.type.name)}
								</span>
							))}
						</div>
					</div>

					<div className='relative flex flex-col items-center'>
						<div className='pointer-events-none absolute inset-0 translate-x-5 -translate-y-6 scale-150 rounded-full bg-white/10 blur-3xl transition duration-700' />
						<PokemonImageWithShiny
							name={pokemonData.name}
							imageUrl={pokemonImageURL}
							className='relative z-10 h-48 w-48 sm:h-56 sm:w-56'
						/>
						<p className='mt-3 text-xs tracking-[0.4em] text-white/60 uppercase'>
							Toggle shiny or open gallery
						</p>
					</div>
				</div>

				<div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
					{quickFacts.map(({ label, value }) => (
						<div
							key={label}
							className='rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm'
						>
							<p className='text-xs tracking-[0.35em] text-white/60 uppercase'>{label}</p>
							<div className='mt-2 text-2xl font-semibold text-white'>
								{value.raw === null ? (
									<span>—</span>
								) : (
									<>
										<AnimatedValue value={value.raw} round={value.round} /> {value.suffix ?? ''}
									</>
								)}
							</div>
						</div>
					))}
				</div>

				<div className='grid gap-8 lg:grid-cols-5'>
					<div className='lg:col-span-2'>
						<h3 className='text-sm tracking-[0.35em] text-white/60 uppercase'>Abilities</h3>
						<div className='mt-3 flex flex-wrap gap-2'>
							{pokemonData.abilities.map((ability) => (
								<span
									key={ability.ability.name}
									className='inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-white/80'
								>
									{capitalize(ability.ability.name)}
									{ability.is_hidden && (
										<span className='rounded-full bg-black/30 px-2 py-0.5 text-xs tracking-wider text-white/70 uppercase'>
											Hidden
										</span>
									)}
								</span>
							))}
						</div>
					</div>

					<div className='lg:col-span-3'>
						<h3 className='text-sm tracking-[0.35em] text-white/60 uppercase'>Base Stats</h3>
						<div className='mt-4 space-y-4'>
							{pokemonData.stats.map((stat) => (
								<div
									key={stat.stat.name}
									className='flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4'
								>
									<div className='w-32 text-xs font-medium tracking-wider text-white/70 uppercase'>
										{STAT_LABELS[stat.stat.name] ?? capitalize(stat.stat.name)}
									</div>
									<div className='flex-1'>
										<StatsBar value={stat.base_stat} accentClassName={`${barAccent}`} />
									</div>
									<div className='w-12 text-right text-sm font-semibold text-white/80'>
										{stat.base_stat}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</article>
	);
}
