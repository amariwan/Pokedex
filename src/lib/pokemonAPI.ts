import {
    EvolutionChain,
    NamedAPIResource,
    PokedexResponse,
    PokemonData,
    PokemonListResponse,
    SpeciesInfo,
} from "@/types";
import { fetchFromPokeApi } from "./pokeApiClient";
import { validatePagination, validatePokemonName } from "./validation";

/**
 * Maximum limit for fetching all Pokemon (PokeAPI has ~1000+ entries).
 * Using conservative upper bound to prevent excessive requests.
 */
const MAX_POKEMON_LIMIT = 100_000;

export const getPokemonList = async (
  limit = MAX_POKEMON_LIMIT,
  offset = 0
): Promise<NamedAPIResource[]> => {
  const { limit: validLimit, offset: validOffset } = validatePagination(limit, offset);

  const params = new URLSearchParams({
    limit: String(validLimit),
    offset: String(validOffset),
  });

  const data = await fetchFromPokeApi<PokemonListResponse>(`/pokemon?${params}`);
  return data.results;
};

export const getAllPokemonNames = async (): Promise<string[]> => {
  const results = await getPokemonList();
  return results.map((pokemon) => pokemon.name);
};

export const getPokemon = async (name: string): Promise<PokemonData> => {
  const validName = validatePokemonName(name);
  return fetchFromPokeApi<PokemonData>(`/pokemon/${validName}`);
};

export const getPokemonDetailsBatch = async (
  names: string[]
): Promise<PokemonData[]> => {
  return Promise.all(names.map((n) => getPokemon(n)));
};

export const getPokemonFromRegion = async (
  region: string
): Promise<PokedexResponse["pokemon_entries"]> => {
  const data = await fetchFromPokeApi<PokedexResponse>(`/pokedex/${region}`);
  return data.pokemon_entries;
};

export const getSpeciesByUrl = async (url: string): Promise<SpeciesInfo> => {
  return fetchFromPokeApi<SpeciesInfo>(url);
};

export const getEvolutionChainByUrl = async (url: string): Promise<EvolutionChain> => {
  return fetchFromPokeApi<EvolutionChain>(url);
};

interface TypeResponse {
  pokemon: { pokemon: NamedAPIResource }[];
}

export const getPokemonByType = async (type: string): Promise<string[]> => {
  const data = await fetchFromPokeApi<TypeResponse>(`/type/${type}`);
  return data.pokemon.map(({ pokemon }) => pokemon.name);
};
