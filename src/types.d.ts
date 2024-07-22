type StatName = 'hp' | 'attack' | 'defense' | 'special-attack' | 'special-defense' | 'speed';
type TypeName = 'normal' | 'fire' | 'water' | 'grass' | 'electric' | 'ice' | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug' | 'rock' | 'ghost' | 'dark' | 'dragon' | 'steel' | 'fairy';

interface Stat {
	name: StatName;
	url: string;
}

interface Type {
	slot: number;
	type: {
		name: TypeName;
		url: string;
	};
}

interface Ability {
	name: string;
	url: string;
}

interface PokemonAbility {
	ability: Ability;
	is_hidden: boolean;
	slot: number;
}

interface PokemonImage {
	front_default: string;
}

interface Species {
	name: string;
	url: string;
}

interface Pokemon {
	id: number;
	name: string;
	sprites: {
		other: {
			'official-artwork': {
				front_default: string;
			};
		};
	};
	types: Array<{ type: { name: string } }>;
}

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

interface PokemonStat {
	base_stat: number;
	effort: number;
	stat: Stat;
}

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

type PokemonCardProps = {
	name: string;
};

type PokemonName = {
	name: string;
};

type PokemonDataProps = {
	pokemonData: PokemonData;
};

type RatioBarProps = {
	value: number;
};

interface PokemonImageProps {
	image: string;
	name: string;
	className?: string;
}

type FlavorTextEntry = {
	flavor_text: string;
	language: {
		name: string;
		url: string;
	};
};

type LanguageOption = {
	value: string;
	label: string;
};
