import { describe, expect, test } from 'vitest';

import { capitalize, cn } from '@/lib/utils';

describe('cn', () => {
	test('merges truthy class names and deduplicates conflicts', () => {
		expect(cn('text-base', false && 'hidden', 'text-lg', 'font-bold')).toBe('text-lg font-bold');
	});
});

describe('capitalize', () => {
	test('capitalizes first character and leaves rest intact', () => {
		expect(capitalize('pikachu')).toBe('Pikachu');
	});
});
