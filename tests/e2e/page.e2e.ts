import { expect, test } from '@playwright/test';

test.describe('Pokedex home', () => {
	test('allows searching the Pokémon collection', async ({ page }) => {
		await page.goto('/');

		await expect(
			page.getByRole('heading', { name: /Discover & curate your dream/ }),
		).toBeVisible();

		const searchInput = page.getByPlaceholder('Search Pokémon...');
		await expect(searchInput).toBeVisible();

		await searchInput.fill('zzzz');
		await expect(
			page.getByText('No Pokémon match your search. Try refining your query.'),
		).toBeVisible();

		await searchInput.fill('pikachu');
		await expect(
			page.getByRole('heading', { name: 'Pikachu', level: 2 }),
		).toBeVisible({ timeout: 20_000 });
	});
});
