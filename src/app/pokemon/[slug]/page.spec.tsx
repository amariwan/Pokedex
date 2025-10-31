import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { notFoundMock, typeGradientMock } = vi.hoisted(() => ({
	notFoundMock: vi.fn(),
	typeGradientMock: vi.fn(() => 'bg-mock'),
}));

vi.mock('next/navigation', () => ({
	notFound: () => notFoundMock(),
}));

vi.mock('next/link', () => ({
	default: ({ children, href, ...props }: any) => {
		const { prefetch: _prefetch, ...rest } = props;
		// Mimic Next.js Link behaviour closely enough for tests
		return (
			<a href={typeof href === 'string' ? href : '#'} {...rest}>
				{children}
			</a>
		);
	},
}));

vi.mock('@/components/ui/button', () => ({
	Button: ({ children, ...props }: any) => (
		<button type='button' {...props}>
			{children}
		</button>
	),
}));

vi.mock('@/components/pokemon/pokemon-details', () => ({
	default: ({ pokemonName, initialData, accentType }: any) => (
		<div data-testid='pokemon-details' data-name={pokemonName} data-accent={accentType}>
			{initialData?.name}
		</div>
	),
}));

vi.mock('@/lib/pokemon-theme', () => ({
	typeGradient: typeGradientMock,
}));

vi.mock('@/lib/pokemonAPI', () => ({
	getPokemon: vi.fn(),
}));

import { typeGradient } from '@/lib/pokemon-theme';
import { getPokemon } from '@/lib/pokemonAPI';
import type { PokemonData } from '@/types';

import PokemonPage, { generateMetadata } from './page';

const samplePokemon = (overrides: Partial<PokemonData> = {}): PokemonData =>
	({
		name: 'pikachu',
		id: 25,
		sprites: {
			front_default: 'front.png',
			other: {
				'official-artwork': {
					front_default: 'artwork.png',
				},
			},
		},
		types: [
			{
				slot: 1,
				type: { name: 'electric', url: '/type/electric' },
			},
		],
		abilities: [],
		stats: [],
		base_experience: 0,
		height: 1,
		weight: 1,
		is_default: true,
		order: 1,
		past_abilities: [],
		past_types: [],
		moves: [],
		species: { name: 'pikachu', url: '/species/pikachu' },
		game_indices: [],
		held_items: [],
		location_area_encounters: '',
		forms: [],
		...overrides,
	}) as PokemonData & Record<string, unknown>;

describe('Pokemon page route', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		notFoundMock.mockImplementation(() => {
			throw new Error('NEXT_NOT_FOUND');
		});
		typeGradientMock.mockReturnValue('bg-electric');
	});

	it('returns full metadata when the pokemon exists', async () => {
		const pokemon = samplePokemon({
			sprites: {
				front_default: 'front.png',
				other: { 'official-artwork': { front_default: 'art-pikachu.png' } },
			},
		});

		vi.mocked(getPokemon).mockResolvedValue(pokemon);

		const metadata = await generateMetadata({ params: { slug: 'pikachu' } });

		expect(getPokemon).toHaveBeenCalledWith('pikachu');
		expect(metadata.title).toBe('Pikachu · Pokédex');
		expect(metadata.openGraph?.images?.[0]?.url).toBe('art-pikachu.png');
		expect(metadata.twitter?.images?.[0]).toBe('art-pikachu.png');
	});

	it('omits social preview images when the artwork is unavailable', async () => {
		const pokemon = samplePokemon({
			name: 'eevee',
			sprites: {
				front_default: 'front.png',
				other: { 'official-artwork': { front_default: null } },
			},
		});

		vi.mocked(getPokemon).mockResolvedValue(pokemon);

		const metadata = await generateMetadata({ params: { slug: 'eevee' } });

		expect(metadata.openGraph?.images).toBeUndefined();
		expect(metadata.twitter?.images).toBeUndefined();
	});

	it('returns not-found metadata when the pokemon fetch fails', async () => {
		vi.mocked(getPokemon).mockRejectedValue(new Error('missing'));

		const metadata = await generateMetadata({ params: { slug: 'missingno' } });

		expect(metadata.title).toBe('Pokémon not found');
		expect(metadata.description).toContain('could not be located');
	});

	it('renders the pokemon details when the pokemon exists', async () => {
		const pokemon = samplePokemon();

		vi.mocked(getPokemon).mockResolvedValue(pokemon);
		typeGradientMock.mockReturnValue('from-electric');

		const jsx = await PokemonPage({ params: { slug: 'pikachu' } });
		render(jsx);

		expect(typeGradient).toHaveBeenCalledWith('electric');
		expect(screen.getByRole('heading', { name: 'Pikachu' })).toBeInTheDocument();
		expect(screen.getByTestId('pokemon-details')).toHaveAttribute('data-name', 'pikachu');
		expect(screen.getByText('Back to collection')).toBeInTheDocument();
	});

	it('falls back to the default accent when the pokemon has no types', async () => {
		const pokemon = samplePokemon({
			types: [],
		});

		vi.mocked(getPokemon).mockResolvedValue(pokemon);

		const jsx = await PokemonPage({ params: { slug: 'ditto' } });
		render(jsx);

		expect(typeGradient).toHaveBeenCalledWith('default');
		expect(screen.getByTestId('pokemon-details')).toHaveAttribute('data-accent', 'default');
	});

	it('invokes notFound when the pokemon does not exist', async () => {
		vi.mocked(getPokemon).mockRejectedValue(new Error('missing'));

		await expect(PokemonPage({ params: { slug: 'ghost' } })).rejects.toThrow('NEXT_NOT_FOUND');
		expect(notFoundMock).toHaveBeenCalledTimes(1);
	});
});
