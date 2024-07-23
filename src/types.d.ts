// Enum for Pokémon stats and types
export type StatName =
  | "hp"
  | "attack"
  | "defense"
  | "special-attack"
  | "special-defense"
  | "speed";

export type TypeName =
  | "normal"
  | "fire"
  | "water"
  | "grass"
  | "electric"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dark"
  | "dragon"
  | "steel"
  | "fairy";

// Basic interfaces for Pokémon-related data
export interface Stat {
  name: StatName;
  url: string;
}

export interface Type {
  slot: number;
  type: {
    name: TypeName;
    url: string;
  };
}

export interface Ability {
  name: string;
  url: string;
}

export interface PokemonAbility {
  ability: Ability;
  is_hidden: boolean;
  slot: number;
}

export interface PokemonImage {
  front_default?: string; // Optional, might not always be present
}

export interface Species {
  name: string;
  url: string;
}

// Main Pokémon interface with essential details
export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: Type[];
}

// Detailed Pokémon data, including stats and abilities
export interface PokemonData {
  id: number;
  name: string;
  types: Type[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  weight: number;
  height: number;
  species: Species;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: Stat;
}

// Detailed species information, including evolution and habitat
export interface SpeciesInfo {
  id: number;
  name: string;
  order: number;
  gender_rate: number;
  capture_rate: number;
  base_happiness: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  hatch_counter: number;
  has_gender_differences: boolean;
  forms_switchable: boolean;
  growth_rate: {
    name: string;
    url: string;
  };
  pokedex_numbers: {
    entry_number: number;
    pokedex: {
      name: string;
      url: string;
    };
  }[];
  egg_groups: {
    name: string;
    url: string;
  }[];
  color: {
    name: string;
    url: string;
  };
  shape: {
    name: string;
    url: string;
  };
  evolves_from_species: {
    name: string;
    url: string;
  } | null;
  evolution_chain: {
    url: string;
  };
  habitat: {
    name: string;
    url: string;
  } | null;
  generation: {
    name: string;
    url: string;
  };
  names: {
    name: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
    version: {
      name: string;
      url: string;
    };
  }[];
  form_descriptions: {
    description: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  genera: {
    genus: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  varieties: {
    is_default: boolean;
    pokemon: {
      name: string;
      url: string;
    };
  }[];
}

// Props for various components
export type PokemonCardProps = {
  name: string;
};

export type PokemonName = {
  name: string;
};

export type PokemonDataProps = {
  pokemonData: PokemonData;
};

export type RatioBarProps = {
  value: number;
};

export interface PokemonImageProps {
  image: string;
  name: string;
  className?: string; // Optional
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: {
    name: string;
  };
}

export interface EggGroup {
  name: string;
}

export interface Color {
  name: string;
}

// Refined interface for species info, used in components
export interface SpeciesInfoX {
  flavor_text_entries: FlavorTextEntry[];
  color: Color | null;
  egg_groups: EggGroup[];
  gender_rate: number;
  capture_rate: number;
}

export interface SpeciesInfoProps {
  pokemonData: {
    species: {
      url: string;
    };
    abilities: {
      ability: {
        name: string;
      };
    }[];
  };
}

export interface LanguageOption {
  value: string;
  label: string;
}
