import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { fetchFromPokeApi } from '@/lib/pokeApiClient';
import {
	getAllPokemonNames,
	getEvolutionChainByUrl,
	getPokemon,
	getPokemonByType,
	getPokemonDetailsBatch,
	getPokemonFromRegion,
	getPokemonList,
	getSpeciesByUrl,
} from '@/lib/pokemonAPI';
import { validatePagination, validatePokemonName } from '@/lib/validation';
import { EvolutionChain, PokedexResponse, PokemonData, SpeciesInfo } from '@/types';

vi.mock('@/lib/pokeApiClient', () => ({
	fetchFromPokeApi: vi.fn(),
}));

vi.mock('@/lib/validation', () => ({
	validatePagination: vi.fn((limit: number, offset: number) => ({ limit, offset })),
	validatePokemonName: vi.fn((name: string) => name.toLowerCase()),
}));

const fetchFromPokeApiMock = vi.mocked(fetchFromPokeApi);
const validatePaginationMock = vi.mocked(validatePagination);
const validatePokemonNameMock = vi.mocked(validatePokemonName);

const createPokemonData = (name: string): PokemonData => ({
	id: name.length,
	name,
	base_experience: 1,
	height: 1,
	weight: 1,
	stats: [],
	abilities: [],
	species: { name, url: `/pokemon/${name}` },
	sprites: {
		other: {
			'official-artwork': {
				front_default: '',
			},
		},
	},
	types: [],
});

beforeEach(() => {
	fetchFromPokeApiMock.mockReset();
	validatePaginationMock.mockReset();
	validatePokemonNameMock.mockReset();

	validatePaginationMock.mockImplementation((limit: number, offset: number) => ({
		limit,
		offset,
	}));
	validatePokemonNameMock.mockImplementation((name: string) => name.toLowerCase());
});

afterEach(() => {
	vi.clearAllMocks();
});

describe('getPokemonList', () => {
	test('validates pagination and returns list results', async () => {
		const listResponse = {
			results: [
				{ name: 'bulbasaur', url: '/pokemon/1' },
				{ name: 'ivysaur', url: '/pokemon/2' },
			],
		};

		validatePaginationMock.mockReturnValueOnce({ limit: 25, offset: 50 });
		fetchFromPokeApiMock.mockResolvedValueOnce(listResponse);

		const result = await getPokemonList(40, 50);

		expect(validatePaginationMock).toHaveBeenCalledWith(40, 50);
		expect(fetchFromPokeApiMock).toHaveBeenCalledWith('/pokemon?limit=25&offset=50');
		expect(result).toEqual(listResponse.results);
	});

	test('uses default limit and offset when omitted', async () => {
		const listResponse = { results: [] };
		validatePaginationMock.mockReturnValueOnce({ limit: 1000, offset: 0 });
		fetchFromPokeApiMock.mockResolvedValueOnce(listResponse);

		await getPokemonList();

		expect(validatePaginationMock).toHaveBeenCalledWith(100000, 0);
	});
});

describe('pokemon list helpers', () => {
	test('getAllPokemonNames maps results to name array', async () => {
		const results = [
			{ name: 'pikachu', url: '/1' },
			{ name: 'charmander', url: '/2' },
		];
		validatePaginationMock.mockReturnValueOnce({ limit: 100000, offset: 0 });
		fetchFromPokeApiMock.mockResolvedValueOnce({ results });

		const names = await getAllPokemonNames();
		expect(names).toEqual(['pikachu', 'charmander']);
	});
});

describe('getPokemon', () => {
	test('validates name and fetches pokemon data', async () => {
		validatePokemonNameMock.mockReturnValueOnce('pikachu');
		const pokemon = createPokemonData('pikachu');
		fetchFromPokeApiMock.mockResolvedValueOnce(pokemon);

		const result = await getPokemon('  Pikachu  ');

		expect(validatePokemonNameMock).toHaveBeenCalledWith('  Pikachu  ');
		expect(fetchFromPokeApiMock).toHaveBeenCalledWith('/pokemon/pikachu');
		expect(result).toEqual(pokemon);
	});
});

describe('getPokemonDetailsBatch', () => {
	test('fetches multiple pokemon in parallel', async () => {
		const names = ['bulbasaur', 'ivysaur'];

		validatePokemonNameMock.mockImplementation((name: string) => name);
		fetchFromPokeApiMock
			.mockResolvedValueOnce(createPokemonData('bulbasaur'))
			.mockResolvedValueOnce(createPokemonData('ivysaur'));

		const result = await getPokemonDetailsBatch(names);

		expect(fetchFromPokeApiMock).toHaveBeenNthCalledWith(1, '/pokemon/bulbasaur');
		expect(fetchFromPokeApiMock).toHaveBeenNthCalledWith(2, '/pokemon/ivysaur');
		expect(result.map((pokemon) => pokemon.name)).toEqual(names);
	});
});

describe('regional and species helpers', () => {
	test('getPokemonFromRegion returns pokedex entries', async () => {
		const response: PokedexResponse = {
			pokemon_entries: [
				{ entry_number: 1, pokemon_species: { name: 'bulbasaur', url: '/1' } },
			],
		};
		fetchFromPokeApiMock.mockResolvedValueOnce(response);

		const result = await getPokemonFromRegion('kanto');

		expect(fetchFromPokeApiMock).toHaveBeenCalledWith('/pokedex/kanto');
		expect(result).toEqual(response.pokemon_entries);
	});

	test('getSpeciesByUrl delegates to fetch client', async () => {
		const species = { id: 1 } as SpeciesInfo;
		fetchFromPokeApiMock.mockResolvedValueOnce(species);

		const result = await getSpeciesByUrl('https://species/1');

		expect(fetchFromPokeApiMock).toHaveBeenCalledWith('https://species/1');
		expect(result).toBe(species);
	});

	test('getEvolutionChainByUrl delegates to fetch client', async () => {
		const chain = { id: 1 } as EvolutionChain;
		fetchFromPokeApiMock.mockResolvedValueOnce(chain);

		const result = await getEvolutionChainByUrl('https://evolution/1');

		expect(fetchFromPokeApiMock).toHaveBeenCalledWith('https://evolution/1');
		expect(result).toBe(chain);
	});
});

describe('getPokemonByType', () => {
	test('maps type response to name list', async () => {
		const response = {
			pokemon: [
				{ pokemon: { name: 'pikachu', url: '/1' } },
				{ pokemon: { name: 'raichu', url: '/2' } },
			],
		};
		fetchFromPokeApiMock.mockResolvedValueOnce(response);

		const result = await getPokemonByType('electric');

		expect(fetchFromPokeApiMock).toHaveBeenCalledWith('/type/electric');
		expect(result).toEqual(['pikachu', 'raichu']);
	});
});
