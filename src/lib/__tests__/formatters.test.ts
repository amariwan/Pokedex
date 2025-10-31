import { describe, expect, test } from 'vitest';

import {
	formatLabel,
	formatMetric,
	formatMetricValue,
	sanitizeFlavorText,
} from '@/lib/formatters';

describe('formatMetric', () => {
	test('returns placeholder when value is missing', () => {
		expect(formatMetric(null)).toBe('—');
		expect(formatMetric(undefined)).toBe('—');
	});

	test('formats values with divisor, unit and precision', () => {
		expect(formatMetric(25, 10, ' m', 1)).toBe('2.5 m');
		expect(formatMetric(1234, 100, ' kg', 2)).toBe('12.34 kg');
	});
});

describe('formatMetricValue', () => {
	test('returns structured placeholder when value is missing', () => {
		expect(formatMetricValue(null, 10, 'kg', 2)).toEqual({
			raw: null,
			suffix: 'kg',
			round: 2,
		});
	});

	test('formats and rounds numeric values', () => {
		expect(formatMetricValue(123, 10, 'm', 1)).toEqual({
			raw: 12.3,
			suffix: 'm',
			round: 1,
		});
	});
});

describe('sanitizeFlavorText', () => {
	test('removes control characters and trims whitespace', () => {
		expect(sanitizeFlavorText('Line1\fLine2\nLine3\r')).toBe('Line1 Line2 Line3');
	});
});

describe('formatLabel', () => {
	test('formats dashed labels to title case', () => {
		expect(formatLabel('pokemon-name')).toBe('Pokemon Name');
	});

	test('returns Unknown for falsy input', () => {
		expect(formatLabel(null)).toBe('Unknown');
		expect(formatLabel(undefined)).toBe('Unknown');
		expect(formatLabel('')).toBe('Unknown');
	});
});
