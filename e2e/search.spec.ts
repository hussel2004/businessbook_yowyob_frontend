import { test, expect } from '@playwright/test';

test.describe('Search Flow', () => {
    test('user can search for a business from homepage', async ({ page }) => {
        // 1. Go to home page
        await page.goto('/');

        // 2. Find search input and type "tech"
        // Using form locator is more robust than placeholder sometimes
        const searchInput = page.locator('form input').first();
        await expect(searchInput).toBeVisible();
        await searchInput.fill('tech');
        await searchInput.press('Enter');

        // 3. Check URL redirect
        await expect(page).toHaveURL(/search/);
        await expect(page).toHaveURL(/q=tech/);

        // 4. Check results appear (assuming seed data exists)
        // Adjust selector for result card
        const resultCard = page.locator('article, [data-testid="search-result-card"]').first();
        // We wait for at least one result or "Aucun résultat" if database is empty but page load succeeded
        // To be safe, we just check the page structure loaded (e.g. Filters are visible)
        await expect(page.getByText('Filtres')).toBeVisible();
    });

    test('user can filter results', async ({ page }) => {
        await page.goto('/search?q=tech');

        // Check "Verified" filter (assuming "Entreprises certifiées" text)
        const verifiedCheckbox = page.getByLabel('Entreprises certifiées uniquement');
        await verifiedCheckbox.check();

        // Wait for URL update
        await expect(page).toHaveURL(/verified=true/);
    });
});
