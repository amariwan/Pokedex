import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getPokemonDetailsBatch, getPokemonList } from '@/lib/pokemonAPI';
import { type PokemonData } from '@/types';

import Page from './page';

vi.mock('@/lib/pokemonAPI');
vi.mock('@/components/Hero', () => ({
	default: () => <div data-testid='hero'>Hero Component</div>,
}));
vi.mock('@/components/PokemonGridClient', () => ({
	default: ({ pokemonNameList, pokemonResources: _pokemonResources, initialDetails }: any) => (
		<div data-testid='pokemon-grid'>
			<span data-testid='pokemon-count'>{pokemonNameList.length}</span>
			<span data-testid='initial-details-count'>{Object.keys(initialDetails).length}</span>
		</div>
	),
}));

describe('Page', () => {
	const mockPokemonList = [
		{ name: 'bulbasaur', url: 'url1' },
		{ name: 'charmander', url: 'url2' },
		{ name: 'squirtle', url: 'url3' },
	];

	const mockPokemonDetails: PokemonData[] = [
		{ name: 'bulbasaur', id: 1, sprites: { front_default: 'img1' }, types: [] } as PokemonData,
		{ name: 'charmander', id: 2, sprites: { front_default: 'img2' }, types: [] } as PokemonData,
		{ name: 'squirtle', id: 3, sprites: { front_default: 'img3' }, types: [] } as PokemonData,
	];

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(getPokemonList).mockResolvedValue(mockPokemonList);
		vi.mocked(getPokemonDetailsBatch).mockResolvedValue(mockPokemonDetails);
	});

	it('should render Hero and PokemonGridClient components', async () => {
		const jsx = await Page();
		render(jsx);

		expect(screen.getByTestId('hero')).toBeInTheDocument();
		expect(screen.getByTestId('pokemon-grid')).toBeInTheDocument();
	});

	it('should fetch pokemon list and pass formatted names to PokemonGridClient', async () => {
		const jsx = await Page();
		render(jsx);

		expect(getPokemonList).toHaveBeenCalledTimes(1);
		expect(screen.getByTestId('pokemon-count')).toHaveTextContent('3');
	});

	it('should prefetch details for first 24 pokemons', async () => {
		const jsx = await Page();
		render(jsx);

		expect(getPokemonDetailsBatch).toHaveBeenCalledWith(['bulbasaur', 'charmander', 'squirtle']);
		expect(screen.getByTestId('initial-details-count')).toHaveTextContent('3');
	});

	it('should create initialDetails object with pokemon names as keys', async () => {
		const jsx = await Page();
		render(jsx);

		expect(getPokemonDetailsBatch).toHaveBeenCalled();
		expect(screen.getByTestId('initial-details-count')).toHaveTextContent('3');
	});
});
