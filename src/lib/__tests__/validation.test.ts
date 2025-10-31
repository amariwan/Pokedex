import { describe, expect, test } from 'vitest';

import { isDefined, validatePagination, validatePokemonName } from '@/lib/validation';

describe('validatePokemonName', () => {
	test('normalizes and lowercases valid names', () => {
		expect(validatePokemonName(' Pikachu ')).toBe('pikachu');
		expect(validatePokemonName('Mr-Mime')).toBe('mr-mime');
	});

	test('throws on empty values', () => {
		expect(() => validatePokemonName('   ')).toThrow('Pokemon name cannot be empty');
	});

	test('throws on invalid characters', () => {
		expect(() => validatePokemonName('pi@chu')).toThrow('Invalid Pokemon name format: pi@chu');
	});
});

describe('validatePagination', () => {
	test('clamps limit within accepted range', () => {
		expect(validatePagination(0, 0)).toEqual({ limit: 1, offset: 0 });
		expect(validatePagination(5, -10)).toEqual({ limit: 5, offset: 0 });
		expect(validatePagination(5000, 20)).toEqual({ limit: 1000, offset: 20 });
	});
});

describe('isDefined', () => {
	test('narrows defined values', () => {
		expect(isDefined('value')).toBe(true);
		expect(isDefined(0)).toBe(true);
		expect(isDefined(null)).toBe(false);
		expect(isDefined(undefined)).toBe(false);
	});
});
