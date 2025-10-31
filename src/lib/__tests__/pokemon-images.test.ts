import { describe, expect, test } from 'vitest';

import { getPokemonArtworkUrl, getPokemonSpriteUrl } from '@/lib/pokemon-images';

describe('pokemon image helpers', () => {
	test('builds sprite url', () => {
		expect(getPokemonSpriteUrl(25)).toBe(
			'https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon/25.png?raw=true',
		);
	});

	test('builds artwork url', () => {
		expect(getPokemonArtworkUrl(6)).toBe(
			'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
		);
	});
});
