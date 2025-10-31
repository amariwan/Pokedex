"use client";
import {
    getEvolutionChainByUrl,
    getPokemon,
    getPokemonFromRegion,
    getPokemonList,
    getSpeciesByUrl,
} from "@/lib/pokemonAPI";
import {
    EvolutionChain,
    NamedAPIResource,
    PokedexEntry,
    PokemonData,
    SpeciesInfo,
} from "@/types";
import {
    keepPreviousData,
    useQuery,
    UseQueryOptions,
    UseQueryResult,
} from "@tanstack/react-query";

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
): UseQueryResult<PokemonData, Error> =>
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
): UseQueryResult<PokemonData["types"], Error> =>
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

export const useGetPokemonFromRegion = (region: string): UseQueryResult<PokedexEntry[], Error> =>
  useQuery<PokedexEntry[], Error, PokedexEntry[], PokemonRegionQueryKey>({
    queryKey: pokemonQueryKeys.region(region),
    queryFn: () => getPokemonFromRegion(region),
    enabled: Boolean(region),
    staleTime: 1000 * 60 * 10,
  });

export const useGetAllPokemon = (): UseQueryResult<NamedAPIResource[], Error> =>
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

export const useGetAllPokemonPage = (
  limit: number,
  offset: number
): UseQueryResult<NamedAPIResource[], Error> =>
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

export const useGetSpeciesInfo = (url: string): UseQueryResult<SpeciesInfo, Error> =>
  useQuery<SpeciesInfo, Error, SpeciesInfo, PokemonSpeciesQueryKey>({
    queryKey: pokemonQueryKeys.species(url),
    queryFn: () => getSpeciesByUrl(url),
    enabled: Boolean(url),
    staleTime: 1000 * 60 * 10,
  });

export const useGetEvolutionChain = (url: string): UseQueryResult<EvolutionChain, Error> =>
  useQuery<EvolutionChain, Error, EvolutionChain, PokemonEvolutionQueryKey>({
    queryKey: pokemonQueryKeys.evolutionChain(url),
    queryFn: () => getEvolutionChainByUrl(url),
    enabled: Boolean(url),
    staleTime: 1000 * 60 * 60,
  });
