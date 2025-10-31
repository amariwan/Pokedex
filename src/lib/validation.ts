/**
 * Input validation utilities for robust error handling.
 * Prevents invalid data from propagating through the application.
 */

/**
 * Validates Pokemon name input.
 * @param name - Pokemon name to validate
 * @returns Normalized name if valid
 * @throws Error if name is empty or invalid
 */
export const validatePokemonName = (name: string): string => {
	const trimmed = name.trim();
	if (!trimmed) {
		throw new Error('Pokemon name cannot be empty');
	}
	if (!/^[a-zA-Z0-9-]+$/.test(trimmed)) {
		throw new Error(`Invalid Pokemon name format: ${trimmed}`);
	}
	return trimmed.toLowerCase();
};

/**
 * Validates pagination parameters.
 * @param limit - Maximum number of items to fetch
 * @param offset - Number of items to skip
 * @returns Validated and clamped values
 */
export const validatePagination = (
	limit: number,
	offset: number,
): { limit: number; offset: number } => {
	const MAX_LIMIT = 1000;
	const validLimit = Math.max(1, Math.min(limit, MAX_LIMIT));
	const validOffset = Math.max(0, offset);
	return { limit: validLimit, offset: validOffset };
};

/**
 * Type guard to check if a value is non-null and non-undefined.
 */
export const isDefined = <T>(value: T | null | undefined): value is T => {
	return value !== null && value !== undefined;
};
