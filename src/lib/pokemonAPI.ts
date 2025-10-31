import {
  PokemonData,
  PokemonListResponse,
  NamedAPIResource,
  PokedexResponse,
  SpeciesInfo,
  EvolutionChain,
} from "@/types";
import { fetchFromPokeApi } from "./pokeApiClient";

const MAX_POKEMON = 100_000;

export const getPokemonList = async (
  limit = MAX_POKEMON,
  offset = 0
): Promise<NamedAPIResource[]> => {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });

  const data = await fetchFromPokeApi<PokemonListResponse>(`/pokemon?${params}`);
  return data.results;
};

export const getAllPokemonNames = async (): Promise<string[]> => {
  const results = await getPokemonList();
  return results.map((pokemon) => pokemon.name);
};

export const getPokemon = async (name: string): Promise<PokemonData> => {
  return fetchFromPokeApi<PokemonData>(`/pokemon/${name.toLowerCase()}`);
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
