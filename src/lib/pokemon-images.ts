/**
 * Pokemon image URL utilities.
 * Extracted from hooks to pure functions (not hooks, no state/effects).
 */

const SPRITE_BASE_URL = 'https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon';
const ARTWORK_BASE_URL =
	'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

/**
 * Gets the sprite image URL for a Pokemon by index.
 * @param index - Pokemon national dex number
 * @returns Full URL to sprite image
 */
export const getPokemonSpriteUrl = (index: number): string => {
	return `${SPRITE_BASE_URL}/${index}.png?raw=true`;
};

/**
 * Gets the official artwork URL for a Pokemon by ID.
 * @param pokemonId - Pokemon national dex number
 * @returns Full URL to official artwork
 */
export const getPokemonArtworkUrl = (pokemonId: number): string => {
	return `${ARTWORK_BASE_URL}/${pokemonId}.png`;
};
