import { afterAll, beforeEach, describe, expect, test, vi } from 'vitest';

import { fetchFromPokeApi } from '@/lib/pokeApiClient';

const originalFetch = global.fetch;
const mockFetch = vi.fn();

beforeEach(() => {
	mockFetch.mockReset();
	global.fetch = mockFetch as unknown as typeof fetch;
});

afterAll(() => {
	global.fetch = originalFetch;
});

const jsonResponse = (data: unknown, ok = true, status = 200, statusText = 'OK') => ({
	ok,
	status,
	statusText,
	json: async () => data,
});

describe('fetchFromPokeApi', () => {
	test('normalizes relative endpoints and applies defaults', async () => {
		mockFetch.mockResolvedValue(jsonResponse({ result: 'ok' }));

		const data = await fetchFromPokeApi('pokemon/1');

		expect(data).toEqual({ result: 'ok' });
		expect(mockFetch).toHaveBeenCalledWith(
			'https://pokeapi.co/api/v2/pokemon/1',
			expect.objectContaining({
				method: 'GET',
				cache: 'force-cache',
				headers: { 'Content-Type': 'application/json' },
				next: { revalidate: 1800 },
			}),
		);
	});

	test('supports overriding method, headers, cache and signal', async () => {
		const controller = new AbortController();
		mockFetch.mockResolvedValue(jsonResponse({ created: true }));

		const data = await fetchFromPokeApi('/custom', {
			method: 'POST',
			signal: controller.signal,
			init: {
				headers: { Authorization: 'Bearer token' },
				cache: 'no-store',
				next: { revalidate: false },
			},
		});

		expect(data).toEqual({ created: true });
		expect(mockFetch).toHaveBeenCalledWith(
			'https://pokeapi.co/api/v2/custom',
			expect.objectContaining({
				method: 'POST',
				signal: controller.signal,
				cache: 'no-store',
				next: { revalidate: false },
				headers: expect.objectContaining({
					Authorization: 'Bearer token',
				}),
			}),
		);

		const [, options] = mockFetch.mock.calls[0];
		expect(options?.headers).not.toHaveProperty('Content-Type');
	});

	test('accepts absolute URLs without prefixing the base', async () => {
		mockFetch.mockResolvedValue(jsonResponse({ ok: true }));

		await fetchFromPokeApi('https://example.com/data');

		expect(mockFetch).toHaveBeenCalledWith('https://example.com/data', expect.any(Object));
	});

	test('throws descriptive error when response is not ok', async () => {
		mockFetch.mockResolvedValue(jsonResponse({}, false, 404, 'Not Found'));

		await expect(fetchFromPokeApi('/missing')).rejects.toThrow(
			'Failed to fetch /missing: 404 Not Found',
		);
	});
});
