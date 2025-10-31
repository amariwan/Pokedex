import { describe, expect, test } from 'vitest';

import { typeBadgeClass, typeGradient } from '@/lib/pokemon-theme';

describe('pokemon theme helpers', () => {
	test('returns themed classes for known type', () => {
		expect(typeGradient('fire')).toContain('from-orange-500');
		expect(typeBadgeClass('water')).toContain('bg-sky-500/20');
	});

	test('falls back to default when type is unknown', () => {
		expect(typeGradient('unknown')).toContain('from-slate-700');
		expect(typeBadgeClass('unknown')).toContain('bg-white/10');
	});

	test('falls back to default when type is missing', () => {
		expect(typeGradient(null)).toContain('from-slate-700');
		expect(typeBadgeClass(undefined)).toContain('bg-white/10');
	});
});
