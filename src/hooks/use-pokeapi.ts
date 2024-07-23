"use client";
import { PokemonData, SpeciesInfo } from "@/types";
import { useQuery, QueryClient } from "@tanstack/react-query";
import axios from "axios";

export const queryClient = new QueryClient();

export const useGetPokemon = (pokemonName: string) => {
  return useQuery<PokemonData>({
    queryKey: ["pokemon", pokemonName],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
      );
      return data as PokemonData;
    },
    select: (data) => ({
      id: data.id,
      name: data.name,
      types: data.types,
      stats: data.stats,
      height: data.height,
      weight: data.weight,
      abilities: data.abilities,
      species: data.species,
    }),
  });
};

export const useGetPokemonType = (pokemonName: string) => {
  return useQuery<SpeciesInfo[]>({
    queryKey: ["pokemonType"],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
      );
      return data.types;
    },
  });
};

export const useGetPokemonFromRegion = (region: string) => {
  return useQuery<PokemonData[]>({
    queryKey: ["allPokemonFromRegion"],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://pokeapi.co/api/v2/pokedex/${region}/?limit=8`
      );
      return data.pokemon_entries;
    },
  });
};

export const useGetAllPokemon = () => {
  return useQuery<PokemonData[]>({
    queryKey: ["allPokemon"],
    queryFn: async () => {
      const { data } = await axios.get(
        "https://pokeapi.co/api/v2/pokemon/?limit=8"
      );
      return data.results;
    },
  });
};

export const useGetAllPokemonPage = (limit: number, offset: number) => {
  return useQuery<PokemonData[]>({
    queryKey: ["allPokemon", limit, offset],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`
      );
      return data.results;
    },
  });
};

export const useFindPokemonImage = (index: number) => {
  return `https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon/${index}.png?raw=true`;
};

export const findPokemonDBImage = (pokemonId: number) => {
  https: return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
};

export const useGetSpeciesInfo = (url: string) => {
  return useQuery<SpeciesInfo>({
    queryKey: ["species", url],
    queryFn: async () => {
      const { data } = await axios.get(url);
      return data as SpeciesInfo;
    },
    select: (data) => ({
      ...data,
    }),
  });
};
