"use client";
import {
  NamedAPIResource,
  PokemonData,
  SpeciesInfo,
  PokedexEntry,
  EvolutionChain,
} from "@/types";
import {
  useQuery,
  UseQueryOptions,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  getPokemon,
  getPokemonFromRegion,
  getPokemonList,
  getSpeciesByUrl,
  getEvolutionChainByUrl,
} from "@/lib/pokemonAPI";

const pokemonQueryKeys = {
  all: ["pokemon"] as const,
  detail: (name: string) => [...pokemonQueryKeys.all, "detail", name] as const,
  list: ["pokemon-list"] as const,
  listPage: (limit: number, offset: number) =>
    [...pokemonQueryKeys.list, limit, offset] as const,
  types: (name: string) => [...pokemonQueryKeys.detail(name), "types"] as const,
  region: (region: string) => ["pokedex", region] as const,
  species: (url: string) => ["species", url] as const,
  evolutionChain: (url: string) => ["evolution-chain", url] as const,
};

type PokemonDetailQueryKey = ReturnType<typeof pokemonQueryKeys.detail>;
type PokemonListQueryKey = typeof pokemonQueryKeys.list;
type PokemonListPageQueryKey = ReturnType<typeof pokemonQueryKeys.listPage>;
type PokemonRegionQueryKey = ReturnType<typeof pokemonQueryKeys.region>;
type PokemonSpeciesQueryKey = ReturnType<typeof pokemonQueryKeys.species>;
type PokemonEvolutionQueryKey = ReturnType<typeof pokemonQueryKeys.evolutionChain>;

type BasePokemonQueryOptions<TData> = Omit<
  UseQueryOptions<PokemonData, Error, TData, PokemonDetailQueryKey>,
  "queryKey" | "queryFn"
>;

export const useGetPokemon = (
  pokemonName: string,
  options?: BasePokemonQueryOptions<PokemonData>
) =>
  useQuery<PokemonData, Error, PokemonData, PokemonDetailQueryKey>({
    queryKey: pokemonQueryKeys.detail(pokemonName),
    queryFn: () => getPokemon(pokemonName),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(pokemonName),
    ...options,
  });

export const useGetPokemonTypes = (
  pokemonName: string,
  options?: BasePokemonQueryOptions<PokemonData["types"]>
) =>
  useQuery<
    PokemonData,
    Error,
    PokemonData["types"],
    PokemonDetailQueryKey
  >({
    queryKey: pokemonQueryKeys.detail(pokemonName),
    queryFn: () => getPokemon(pokemonName),
    select: (pokemon) => pokemon.types,
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(pokemonName),
    ...options,
  });

export const useGetPokemonFromRegion = (region: string) =>
  useQuery<PokedexEntry[], Error, PokedexEntry[], PokemonRegionQueryKey>({
    queryKey: pokemonQueryKeys.region(region),
    queryFn: () => getPokemonFromRegion(region),
    enabled: Boolean(region),
    staleTime: 1000 * 60 * 10,
  });

export const useGetAllPokemon = () =>
  useQuery<
    NamedAPIResource[],
    Error,
    NamedAPIResource[],
    PokemonListQueryKey
  >({
    queryKey: pokemonQueryKeys.list,
    queryFn: () => getPokemonList(50),
    staleTime: 1000 * 60 * 10,
  });

export const useGetAllPokemonPage = (limit: number, offset: number) =>
  useQuery<
    NamedAPIResource[],
    Error,
    NamedAPIResource[],
    PokemonListPageQueryKey
  >({
    queryKey: pokemonQueryKeys.listPage(limit, offset),
    queryFn: () => getPokemonList(limit, offset),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

export const useFindPokemonImage = (index: number) =>
  `https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon/${index}.png?raw=true`;

export const findPokemonDBImage = (pokemonId: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

export const useGetSpeciesInfo = (url: string) =>
  useQuery<SpeciesInfo, Error, SpeciesInfo, PokemonSpeciesQueryKey>({
    queryKey: pokemonQueryKeys.species(url),
    queryFn: () => getSpeciesByUrl(url),
    enabled: Boolean(url),
    staleTime: 1000 * 60 * 10,
  });

export const useGetEvolutionChain = (url: string) =>
  useQuery<EvolutionChain, Error, EvolutionChain, PokemonEvolutionQueryKey>({
    queryKey: pokemonQueryKeys.evolutionChain(url),
    queryFn: () => getEvolutionChainByUrl(url),
    enabled: Boolean(url),
    staleTime: 1000 * 60 * 60,
  });
