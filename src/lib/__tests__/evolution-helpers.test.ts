import { describe, expect, test } from 'vitest';

import { buildEvolutionStages, formatEvolutionDetail } from '@/lib/evolution-helpers';
import { type EvolutionChainLink, type NamedAPIResource } from '@/types';

const resource = (name: string): NamedAPIResource => ({
	name,
	url: `/${name}`,
});

describe('buildEvolutionStages', () => {
	test('returns empty stages when chain is missing', () => {
		expect(buildEvolutionStages(undefined)).toEqual([]);
		expect(buildEvolutionStages(null)).toEqual([]);
	});

	test('groups species by depth without duplicates', () => {
		const chain: EvolutionChainLink = {
			species: resource('bulbasaur'),
			evolution_details: [],
			evolves_to: [
				{
					species: resource('ivysaur'),
					evolution_details: [],
					evolves_to: [
						{
							species: resource('venusaur'),
							evolution_details: [],
							evolves_to: [],
						},
						{
							species: resource('venusaur'),
							evolution_details: [],
							evolves_to: [],
						},
					],
				},
				{
					species: resource('ivysaur'),
					evolution_details: [],
					evolves_to: [],
				},
			],
		};

		expect(buildEvolutionStages(chain)).toEqual([
			[chain],
			[chain.evolves_to[0]],
			[chain.evolves_to[0].evolves_to[0]],
		]);
	});
});

describe('formatEvolutionDetail', () => {
	const detailTemplate = (): EvolutionChainLink => ({
		species: resource('pikachu'),
		evolution_details: [
			{
				trigger: resource('level-up'),
				min_level: null,
				item: null,
				held_item: null,
				time_of_day: '',
				known_move: null,
				known_move_type: null,
				location: null,
				needs_overworld_rain: false,
				turn_upside_down: false,
				party_species: null,
				party_type: null,
				trade_species: null,
				relative_physical_stats: null,
				gender: null,
				happiness: null,
				beauty: null,
				affection: null,
			},
		],
		evolves_to: [],
	});

	test('returns Base form when no details exist', () => {
		const noDetail: EvolutionChainLink = {
			species: resource('ditto'),
			evolution_details: [],
			evolves_to: [],
		};

		expect(formatEvolutionDetail(noDetail)).toBe('Base form');
	});

	test('formats all available evolution conditions', () => {
		const link = detailTemplate();
		const detail = link.evolution_details[0];

		detail.min_level = 16;
		detail.item = resource('water-stone');
		detail.held_item = resource('kings-rock');
		detail.time_of_day = 'day';
		detail.location = resource('mt-coronet');
		detail.known_move = resource('ancient-power');
		detail.known_move_type = resource('rock');
		detail.trade_species = resource('kadabra');
		detail.needs_overworld_rain = true;
		detail.turn_upside_down = true;
		detail.relative_physical_stats = 1;
		detail.happiness = 220;
		detail.affection = 160;
		detail.beauty = 100;
		detail.gender = 1;
		detail.party_species = resource('eevee');
		detail.party_type = resource('fairy');

		expect(formatEvolutionDetail(link)).toBe(
			[
				'Lvl 16',
				'Level Up',
				'Use Water Stone',
				'Hold Kings Rock',
				'Day',
				'At Mt Coronet',
				'Move Ancient Power',
				'Move Type Rock',
				'Trade with Kadabra',
				'Overworld rain',
				'Upside down device',
				'Attack > Defense',
				'Happiness ≥ 220',
				'Affection ≥ 160',
				'Beauty ≥ 100',
				'Female',
				'Party: Eevee',
				'Party Type: Fairy',
			].join(', '),
		);
	});

	test('handles relative physical stats variations', () => {
		const positive = detailTemplate();
		positive.evolution_details[0].relative_physical_stats = 1;
		expect(formatEvolutionDetail(positive)).toContain('Attack > Defense');

		const negative = detailTemplate();
		negative.evolution_details[0].relative_physical_stats = -1;
		expect(formatEvolutionDetail(negative)).toContain('Attack < Defense');

		const equal = detailTemplate();
		equal.evolution_details[0].relative_physical_stats = 0;
		expect(formatEvolutionDetail(equal)).toContain('Attack = Defense');
	});

	test('labels gender when provided', () => {
		const female = detailTemplate();
		female.evolution_details[0].gender = 1;
		expect(formatEvolutionDetail(female)).toContain('Female');

		const male = detailTemplate();
		male.evolution_details[0].gender = 0;
		expect(formatEvolutionDetail(male)).toContain('Male');
	});

	test('returns Unknown condition when no details contribute text', () => {
		const link: EvolutionChainLink = {
			species: resource('unown'),
			evolution_details: [
				{
					trigger: undefined as unknown as NamedAPIResource,
					min_level: null,
					item: null,
					held_item: null,
					time_of_day: '',
					known_move: null,
					known_move_type: null,
					location: null,
					needs_overworld_rain: false,
					turn_upside_down: false,
					party_species: null,
					party_type: null,
					trade_species: null,
					relative_physical_stats: null,
					gender: null,
					happiness: null,
					beauty: null,
					affection: null,
				},
			],
			evolves_to: [],
		};

		expect(formatEvolutionDetail(link)).toBe('Unknown condition');
	});
});
