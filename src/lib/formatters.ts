/**
 * Centralized formatting utilities for consistent data presentation.
 * Following DRY principle to eliminate duplication across components.
 */

/**
 * Formats a metric value with configurable precision and unit.
 * @param value - The raw value to format (e.g., Pokemon height/weight in decimeters/hectograms)
 * @param divisor - The divisor to apply (default: 10 for converting dm→m, hg→kg)
 * @param unit - Optional unit suffix (e.g., ' m', ' kg')
 * @param precision - Number of decimal places (default: 1)
 * @returns Formatted string or '—' if value is undefined/null
 */
export const formatMetric = (
	value: number | undefined | null,
	divisor = 10,
	unit = '',
	precision = 1,
): string => {
	if (value === undefined || value === null) {
		return '—';
	}
	const formatted = (value / divisor).toFixed(precision);
	return `${formatted}${unit}`;
};

/**
 * Type-safe version of formatMetric that returns a structured value
 * suitable for animated components.
 */
export interface FormattedMetricValue {
	raw: number | null;
	suffix?: string;
	round?: number;
}

export const formatMetricValue = (
	value: number | undefined | null,
	divisor = 10,
	unit?: string,
	precision = 1,
): FormattedMetricValue => {
	if (value === undefined || value === null) {
		return { raw: null, suffix: unit, round: precision };
	}
	const metric = value / divisor;
	return {
		raw: Number(metric.toFixed(precision)),
		suffix: unit,
		round: precision,
	};
};

/**
 * Sanitizes flavor text from API responses by removing control characters.
 * @param text - Raw flavor text string
 * @returns Cleaned text with normalized whitespace
 */
export const sanitizeFlavorText = (text: string): string => {
	return text.replace(/[\f\n\r]+/g, ' ').trim();
};

/**
 * Formats API labels (e.g., 'pokemon-name' → 'Pokemon Name')
 * @param value - Raw label string
 * @returns Formatted label or 'Unknown' if value is falsy
 */
export const formatLabel = (value?: string | null): string => {
	if (!value) return 'Unknown';
	return value
		.split('-')
		.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join(' ');
};
