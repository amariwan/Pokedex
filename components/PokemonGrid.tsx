"use client";

import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { PokemonCard } from "./PokemonCard";

interface Pokemon {
  id: number;
  name: string;
}

interface PokemonName {
  name: string;
}

interface PokemonGridProps {
  pokemonList: Pokemon[];
  pokemonNameList: PokemonName[];
}

export const PokemonGrid = ({ pokemonList, pokemonNameList }: PokemonGridProps) => {
  const [searchText, setSearchText] = useState("");

  const searchFilter = (pokemonList: PokemonName[], searchText: string) => {
    return pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const filteredPokemonList = searchFilter(pokemonNameList, searchText);

  return (
    <main className="flex flex-col items-center p-4">
      <section className="w-full max-w-2xl">
        <h3 className="text-4xl font-bold mb-6 text-center ">Find Your Pokémon</h3>
        <div className="relative mb-8">
          <Label htmlFor="pokemonName" className="sr-only">Search Pokémon</Label>
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a7 7 0 00-7 7h3a4 4 0 014-4v3a7 7 0 007 7v-3a4 4 0 01-4-4V4z" />
            </svg>
          </div>
          <Input
            type="text"
            value={searchText}
            id="pokemonName"
            placeholder="Search Pokémon..."
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-12 py-3 pr-4 border-2  rounded-full text-gray-700 placeholder-gray-500 shadow-lg transition-transform transform-gpu focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:shadow-xl hover:scale-105"
          />
        </div>
      </section>

      <section className="w-full max-w-5xl">
        <h3 className="text-4xl font-bold mb-4 text-center ">Pokémon Collection</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredPokemonList.slice(0, 150).map((pokemon) => (
            <PokemonCard name={pokemon.name} key={pokemon.name} />
          ))}
        </div>
      </section>
    </main>
  );
};
