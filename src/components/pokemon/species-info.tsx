import Link from 'next/link';
import { useMemo, useState } from 'react';

import Loading from '@/components/loading';
import { RatioBar } from '@/components/ratio-bar';
import { useGetEvolutionChain, useGetSpeciesInfo } from '@/hooks/use-pokeapi';
import { typeGradient } from '@/lib/pokemon-theme';
import { capitalize } from '@/lib/utils';
import {
	EvolutionChainLink,
	FlavorTextEntry,
	LanguageOption,
	SpeciesInfoProps,
} from '@/types';

const sanitizeFlavorText = (text: string) => text.replace(/[\f\n\r]+/g, ' ').trim();

const formatLabel = (value?: string | null) => {
	if (!value) return 'Unknown';
	return value
		.split('-')
		.map((segment) => capitalize(segment))
		.join(' ');
};

const buildEvolutionStages = (chain?: EvolutionChainLink | null) => {
	if (!chain) return [];
	const stages: EvolutionChainLink[][] = [];

	const traverse = (node: EvolutionChainLink, depth = 0) => {
		if (!stages[depth]) {
			stages[depth] = [];
		}

		if (!stages[depth].some((existing) => existing.species.name === node.species.name)) {
			stages[depth].push(node);
		}

		node.evolves_to?.forEach((child) => traverse(child, depth + 1));
	};

	traverse(chain);
	return stages;
};

const formatEvolutionDetail = (link: EvolutionChainLink) => {
	if (!link.evolution_details?.length) {
		return 'Base form';
	}

	const detail = link.evolution_details[0];
	const parts: string[] = [];

	if (detail.min_level !== null && detail.min_level !== undefined) {
		parts.push(`Lvl ${detail.min_level}`);
	}

	if (detail.trigger?.name) {
		parts.push(formatLabel(detail.trigger.name));
	}

	if (detail.item?.name) {
		parts.push(`Use ${formatLabel(detail.item.name)}`);
	}

	if (detail.held_item?.name) {
		parts.push(`Hold ${formatLabel(detail.held_item.name)}`);
	}

	if (detail.time_of_day) {
		parts.push(formatLabel(detail.time_of_day));
	}

	if (detail.location?.name) {
		parts.push(`At ${formatLabel(detail.location.name)}`);
	}

	if (detail.known_move?.name) {
		parts.push(`Move ${formatLabel(detail.known_move.name)}`);
	}

	if (detail.known_move_type?.name) {
		parts.push(`Move Type ${formatLabel(detail.known_move_type.name)}`);
	}

	if (detail.trade_species?.name) {
		parts.push(`Trade with ${formatLabel(detail.trade_species.name)}`);
	}

	if (detail.needs_overworld_rain) {
		parts.push('Overworld rain');
	}

	if (detail.turn_upside_down) {
		parts.push('Upside down device');
	}

	if (detail.relative_physical_stats === 1) {
		parts.push('Attack > Defense');
	} else if (detail.relative_physical_stats === -1) {
		parts.push('Defense > Attack');
	}

	if (detail.gender === 1) {
		parts.push('Female only');
	} else if (detail.gender === 2) {
		parts.push('Male only');
	}

	return parts.length ? parts.join(' • ') : 'Special conditions';
};

export default function SpeciesInfo({ pokemonData, accentType }: SpeciesInfoProps) {
	const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
	const { data: speciesInfo, isLoading } = useGetSpeciesInfo(pokemonData.species.url);
	const evolutionChainUrl = speciesInfo?.evolution_chain?.url ?? '';
	const { data: evolutionChain } = useGetEvolutionChain(evolutionChainUrl);

	const flavor_text_entries: FlavorTextEntry[] = speciesInfo?.flavor_text_entries ?? [];

	const languageOptions = useMemo<LanguageOption[]>(() => {
		const uniqueLanguages = Array.from(
			new Set(flavor_text_entries.map((text: FlavorTextEntry) => text.language.name)),
		);
		return uniqueLanguages.map((lang) => ({
			value: lang,
			label: lang.toUpperCase(),
		}));
	}, [flavor_text_entries]);

	const flavorTextMap = useMemo(
		() =>
			new Map(
				flavor_text_entries.map((text: FlavorTextEntry) => [
					text.language.name,
					sanitizeFlavorText(text.flavor_text),
				]),
			),
		[flavor_text_entries],
	);

	const getFlavorText = (language: string) =>
		flavorTextMap.get(language) ||
		flavorTextMap.get('en') ||
		'No description available in the selected language.';

	const genus = useMemo(
		() => speciesInfo?.genera?.find((entry) => entry.language.name === 'en')?.genus ?? '',
		[speciesInfo?.genera],
	);

	const statuses = useMemo(() => {
		if (!speciesInfo) return [];
		const tags: string[] = [];
		if (speciesInfo.is_legendary) tags.push('Legendary');
		if (speciesInfo.is_mythical) tags.push('Mythical');
		if (speciesInfo.is_baby) tags.push('Baby');
		if (speciesInfo.gender_rate === -1) tags.push('Genderless');
		return tags;
	}, [speciesInfo]);

	const catchRate = useMemo(() => {
		if (!speciesInfo?.capture_rate) return null;
		return Math.round((speciesInfo.capture_rate / 255) * 100);
	}, [speciesInfo?.capture_rate]);

	const hatchSteps = useMemo(() => {
		if (speciesInfo?.hatch_counter === undefined) return null;
		return (speciesInfo.hatch_counter + 1) * 255;
	}, [speciesInfo?.hatch_counter]);

	const eggGroups = speciesInfo?.egg_groups ?? [];
	const evolutionStages = useMemo(
		() => buildEvolutionStages(evolutionChain?.chain),
		[evolutionChain?.chain],
	);

	const alternateForms = useMemo(
		() => speciesInfo?.varieties?.filter((variant) => !variant.is_default) ?? [],
		[speciesInfo?.varieties],
	);

	const accentGradient = typeGradient(accentType);

	if (isLoading || !speciesInfo) {
		return (
			<div className='flex h-full min-h-[28rem] items-center justify-center rounded-3xl border border-white/10 bg-slate-950/40 p-8 backdrop-blur'>
				<Loading />
			</div>
		);
	}

	return (
		<section className='flex flex-col gap-6'>
			<article className='relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 p-6 md:p-8 backdrop-blur-xl'>
				<div className={`absolute inset-0 bg-gradient-to-br ${accentGradient} opacity-45`} />
				<div className='pointer-events-none absolute -left-24 top-16 h-60 w-60 rounded-full bg-white/10 blur-3xl' />
				<div className='pointer-events-none absolute -right-10 bottom-4 h-48 w-48 rounded-full bg-white/10 blur-3xl' />

				<div className='relative space-y-6'>
					<header className='flex flex-wrap items-center justify-between gap-4'>
						<div className='flex flex-wrap gap-2'>
							{(statuses.length ? statuses : ['Research Grade']).map((status) => (
								<span
									key={status}
									className='inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 backdrop-blur'
								>
									{status}
								</span>
							))}
						</div>

						{languageOptions.length > 0 ? (
							<select
								value={selectedLanguage}
								onChange={(e) => setSelectedLanguage(e.target.value)}
								className='rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/70 backdrop-blur transition focus:outline-none focus:ring-2 focus:ring-white/50'
							>
								{languageOptions.map((lang) => (
									<option key={lang.value} value={lang.value} className='bg-slate-900 text-white'>
										{lang.label}
									</option>
								))}
							</select>
						) : null}
					</header>

					<div className='space-y-3'>
						<p className='text-sm uppercase tracking-[0.45em] text-white/60'>{genus || 'Pokémon species'}</p>
						<p className='text-base leading-relaxed text-white/80'>{getFlavorText(selectedLanguage)}</p>
					</div>
				</div>
			</article>

			<div className='grid gap-6 md:grid-cols-2'>
				<article className='rounded-3xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur'>
					<h3 className='text-sm uppercase tracking-[0.35em] text-white/60'>Training Data</h3>
					<dl className='mt-5 grid grid-cols-2 gap-4 text-sm text-white/80'>
						<div>
							<dt className='text-xs uppercase tracking-[0.3em] text-white/50'>Capture Rate</dt>
							<dd className='mt-1 text-lg font-semibold text-white'>
								{catchRate !== null ? `${catchRate}%` : '—'}
							</dd>
							{speciesInfo.capture_rate ? (
								<p className='text-[11px] uppercase tracking-[0.35em] text-white/50'>
									{speciesInfo.capture_rate} / 255
								</p>
							) : null}
						</div>
						<div>
							<dt className='text-xs uppercase tracking-[0.3em] text-white/50'>Base Happiness</dt>
							<dd className='mt-1 text-lg font-semibold text-white'>
								{speciesInfo.base_happiness ?? '—'}
							</dd>
							<p className='text-[11px] uppercase tracking-[0.35em] text-white/50'>Higher is friendlier</p>
						</div>
						<div>
							<dt className='text-xs uppercase tracking-[0.3em] text-white/50'>Growth Rate</dt>
							<dd className='mt-1 text-lg font-semibold text-white'>
								{formatLabel(speciesInfo.growth_rate?.name)}
							</dd>
							<p className='text-[11px] uppercase tracking-[0.35em] text-white/50'>EXP scaling profile</p>
						</div>
						<div>
							<dt className='text-xs uppercase tracking-[0.3em] text-white/50'>Hatch Steps</dt>
							<dd className='mt-1 text-lg font-semibold text-white'>{hatchSteps ?? '—'}</dd>
							<p className='text-[11px] uppercase tracking-[0.35em] text-white/50'>
								{speciesInfo.hatch_counter !== undefined
									? `${speciesInfo.hatch_counter + 1} cycles`
									: 'Uncertain'}
							</p>
						</div>
					</dl>
				</article>

				<article className='rounded-3xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur'>
					<h3 className='text-sm uppercase tracking-[0.35em] text-white/60'>Biology & Habitat</h3>

					<div className='mt-5 flex flex-col gap-5'>
						<div>
							<p className='text-xs uppercase tracking-[0.3em] text-white/50'>Gender Distribution</p>
							<div className='mt-2'>
								<RatioBar value={speciesInfo.gender_rate} />
							</div>
						</div>

						<div>
							<p className='text-xs uppercase tracking-[0.3em] text-white/50'>Egg Groups</p>
							<div className='mt-2 flex flex-wrap gap-2'>
								{eggGroups.length ? (
									eggGroups.map((group) => (
										<span
											key={group.name}
											className='inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.35em] text-white/75'
										>
											{formatLabel(group.name)}
										</span>
									))
								) : (
									<span className='text-sm text-white/60'>Unknown</span>
								)}
							</div>
						</div>

						<dl className='grid grid-cols-2 gap-4 text-sm text-white/80'>
							<div>
								<dt className='text-xs uppercase tracking-[0.3em] text-white/50'>Habitat</dt>
								<dd className='mt-1 font-semibold'>{formatLabel(speciesInfo.habitat?.name)}</dd>
							</div>
							<div>
								<dt className='text-xs uppercase tracking-[0.3em] text-white/50'>Color</dt>
								<dd className='mt-1 font-semibold'>{formatLabel(speciesInfo.color?.name)}</dd>
							</div>
							<div>
								<dt className='text-xs uppercase tracking-[0.3em] text-white/50'>Shape</dt>
								<dd className='mt-1 font-semibold'>{formatLabel(speciesInfo.shape?.name)}</dd>
							</div>
							<div>
								<dt className='text-xs uppercase tracking-[0.3em] text-white/50'>Generation</dt>
								<dd className='mt-1 font-semibold'>{formatLabel(speciesInfo.generation?.name)}</dd>
							</div>
						</dl>
					</div>
				</article>
			</div>

			<article className='rounded-3xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur'>
				<h3 className='text-sm uppercase tracking-[0.35em] text-white/60'>Evolution Chain</h3>

				{evolutionStages.length ? (
					<div className='mt-5 flex w-full flex-col gap-6'>
						<div className='flex flex-col gap-6 md:flex-row md:items-stretch md:gap-4'>
							{evolutionStages.map((stage, index) => (
								<div key={index} className='flex flex-1 flex-col gap-4'>
									<div className='rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur'>
										<p className='text-xs uppercase tracking-[0.3em] text-white/50'>Stage {index + 1}</p>
									</div>
									<div className='flex flex-col gap-4'>
										{stage.map((link) => (
											<div
												key={link.species.name}
												className='rounded-2xl border border-white/10 bg-white/10 p-4 text-center backdrop-blur'
											>
												<Link
													href={`/pokemon/${link.species.name}`}
													className='text-lg font-semibold text-white transition hover:text-white/70'
												>
													{capitalize(link.species.name)}
												</Link>
												<p className='mt-2 text-xs uppercase tracking-[0.25em] text-white/60'>
													{formatEvolutionDetail(link)}
												</p>
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				) : (
					<p className='mt-4 text-sm text-white/70'>Evolution data unavailable.</p>
				)}
			</article>

			{alternateForms.length ? (
				<article className='rounded-3xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur'>
					<h3 className='text-sm uppercase tracking-[0.35em] text-white/60'>Alternate Forms</h3>
					<div className='mt-4 flex flex-wrap gap-3'>
						{alternateForms.map((variant) => (
							<Link
								key={variant.pokemon.name}
								href={`/pokemon/${variant.pokemon.name}`}
								className='inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-white/80 transition hover:border-white/40 hover:text-white'
							>
								{capitalize(variant.pokemon.name)}
							</Link>
						))}
					</div>
				</article>
			) : null}
		</section>
	);
}
