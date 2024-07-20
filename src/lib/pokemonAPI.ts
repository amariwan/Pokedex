export const getPokemonList = async () => {
  const response = await fetch(
    //"https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0"
    "https://pokeapi.co/api/v2/pokemon?limit=1&offset=0"
  );
  const data = await response.json();
  return data.results;
};

export const getAllPokemonNames = async (): Promise<string[]> => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0");
  const data = await response.json();
  return data.results.map((pokemon: { name: string }) => pokemon.name);
};


export const getPokemon = async (name: string) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

  const data = await response.json();
  return data;
};
