import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import PokemonDetails from '@/components/pokemon/pokemon-details';
import { Button } from '@/components/ui/button';
import { typeGradient } from '@/lib/pokemon-theme';
import { getPokemon } from '@/lib/pokemonAPI';
import { capitalize } from '@/lib/utils';
import type { PokemonData } from '@/types';

type Awaitable<T> = T | Promise<T>;

type PokemonPageParams = { slug: string };

type PokemonPageProps = {
	params: Awaitable<PokemonPageParams>;
};

// Note: route-level revalidate is intentionally removed because
// `next.config.mjs` enables `cacheComponents` globally.

const fetchPokemonFromParams = async (
	params: Awaitable<PokemonPageParams>,
): Promise<{ slug: string; pokemon: PokemonData | null }> => {
	const { slug } = await params;
	const pokemon = await getPokemon(slug).catch(() => null);

	return { slug, pokemon };
};

export async function generateMetadata({ params }: PokemonPageProps): Promise<Metadata> {
	const { pokemon } = await fetchPokemonFromParams(params);

	if (!pokemon) {
		return {
			title: 'Pokémon not found',
			description: 'This Pokémon could not be located in the Pokédex.',
		};
	}

	const name = capitalize(pokemon.name);
	const artwork = pokemon.sprites.other['official-artwork'].front_default;
	const description = `Discover ${name}'s typing, stats, abilities and species information in the modern Pokédex.`;

	return {
		title: `${name} · Pokédex`,
		description,
		openGraph: {
			title: `${name} · Pokédex`,
			description,
			images: artwork ? [{ url: artwork, width: 600, height: 600, alt: name }] : undefined,
		},
		twitter: {
			card: 'summary_large_image',
			title: `${name} · Pokédex`,
			description,
			images: artwork ? [artwork] : undefined,
		},
	};
}

export default async function PokemonPage({ params }: PokemonPageProps) {
	const { slug, pokemon } = await fetchPokemonFromParams(params);

	if (!pokemon) {
		notFound();
	}

	const primaryType = pokemon.types?.[0]?.type.name ?? 'default';

	return (
		<main className='relative min-h-screen overflow-hidden bg-slate-950 text-slate-100'>
			<div
				className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${typeGradient(primaryType)} opacity-80`}
			/>
			<div className='pointer-events-none absolute -top-32 left-10 h-96 w-96 rounded-full bg-white/10 blur-3xl' />
			<div className='pointer-events-none absolute right-10 -bottom-20 h-[28rem] w-[28rem] rounded-full bg-white/5 blur-3xl' />

			<section className='relative z-10 mx-auto flex w-full flex-col gap-8 px-4 py-16 lg:py-24'>
				<header className='flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
					<div>
						<p className='text-sm tracking-[0.5em] text-slate-200/70 uppercase'>Pokédex Entry</p>
						<h1 className='mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl'>
							{capitalize(pokemon.name)}
						</h1>
					</div>
					<Link href='/' prefetch className='inline-flex justify-end'>
						<Button
							size='lg'
							variant='secondary'
							className='rounded-full border border-white/10 bg-white/15 px-6 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-white/25'
						>
							Back to collection
						</Button>
					</Link>
				</header>

				<PokemonDetails pokemonName={slug} initialData={pokemon} accentType={primaryType} />
			</section>
		</main>
	);
}
