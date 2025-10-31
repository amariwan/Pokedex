/**
 * Evolution chain processing utilities.
 * Extracted from species-info.tsx to separate business logic from presentation.
 */

import { type EvolutionChainLink } from '@/types';

import { formatLabel } from './formatters';

/**
 * Builds a 2D array representing evolution stages.
 * Each inner array contains Pokemon at the same evolution stage.
 * @param chain - Root evolution chain link
 * @returns Array of evolution stages
 */
export const buildEvolutionStages = (chain?: EvolutionChainLink | null): EvolutionChainLink[][] => {
	if (!chain) return [];

	const stages: EvolutionChainLink[][] = [];

	const traverse = (node: EvolutionChainLink, depth = 0): void => {
		if (!stages[depth]) {
			stages[depth] = [];
		}

		// Avoid duplicates at same stage
		const alreadyExists = stages[depth].some(
			(existing) => existing.species.name === node.species.name,
		);

		if (!alreadyExists) {
			stages[depth].push(node);
		}

		node.evolves_to?.forEach((child) => traverse(child, depth + 1));
	};

	traverse(chain);
	return stages;
};

/**
 * Formats evolution trigger details into human-readable string.
 * Implements Strategy pattern for different evolution conditions.
 * @param link - Evolution chain link with details
 * @returns Formatted evolution condition or 'Base form'
 */
export const formatEvolutionDetail = (link: EvolutionChainLink): string => {
	if (!link.evolution_details?.length) {
		return 'Base form';
	}

	const detail = link.evolution_details[0];
	const parts: string[] = [];

	// Level-based evolution
	if (detail.min_level !== null && detail.min_level !== undefined) {
		parts.push(`Lvl ${detail.min_level}`);
	}

	// Trigger type (level-up, trade, use-item)
	if (detail.trigger?.name) {
		parts.push(formatLabel(detail.trigger.name));
	}

	// Item-based
	if (detail.item?.name) {
		parts.push(`Use ${formatLabel(detail.item.name)}`);
	}

	// Held item
	if (detail.held_item?.name) {
		parts.push(`Hold ${formatLabel(detail.held_item.name)}`);
	}

	// Time-based
	if (detail.time_of_day) {
		parts.push(formatLabel(detail.time_of_day));
	}

	// Location-based
	if (detail.location?.name) {
		parts.push(`At ${formatLabel(detail.location.name)}`);
	}

	// Move-based
	if (detail.known_move?.name) {
		parts.push(`Move ${formatLabel(detail.known_move.name)}`);
	}

	if (detail.known_move_type?.name) {
		parts.push(`Move Type ${formatLabel(detail.known_move_type.name)}`);
	}

	// Special trade
	if (detail.trade_species?.name) {
		parts.push(`Trade with ${formatLabel(detail.trade_species.name)}`);
	}

	// Weather/position conditions
	if (detail.needs_overworld_rain) {
		parts.push('Overworld rain');
	}

	if (detail.turn_upside_down) {
		parts.push('Upside down device');
	}

	// Stat-based
	if (detail.relative_physical_stats === 1) {
		parts.push('Attack > Defense');
	} else if (detail.relative_physical_stats === -1) {
		parts.push('Attack < Defense');
	} else if (detail.relative_physical_stats === 0) {
		parts.push('Attack = Defense');
	}

	// Affection/happiness
	if (detail.happiness !== null && detail.happiness !== undefined) {
		parts.push(`Happiness ≥ ${detail.happiness}`);
	}

	if (detail.affection !== null && detail.affection !== undefined) {
		parts.push(`Affection ≥ ${detail.affection}`);
	}

	// Beauty stat
	if (detail.beauty !== null && detail.beauty !== undefined) {
		parts.push(`Beauty ≥ ${detail.beauty}`);
	}

	// Gender-specific
	if (detail.gender !== null && detail.gender !== undefined) {
		const genderLabel = detail.gender === 1 ? 'Female' : 'Male';
		parts.push(genderLabel);
	}

	// Party Pokemon
	if (detail.party_species?.name) {
		parts.push(`Party: ${formatLabel(detail.party_species.name)}`);
	}

	if (detail.party_type?.name) {
		parts.push(`Party Type: ${formatLabel(detail.party_type.name)}`);
	}

	return parts.length > 0 ? parts.join(', ') : 'Unknown condition';
};
