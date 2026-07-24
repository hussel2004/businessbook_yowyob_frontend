import { test, expect } from '@playwright/test';

test.describe('Subscription and Boost Feature', () => {
    test.describe('Homepage Featured Section', () => {
        test('should display "Entreprises à la une" section', async ({ page }) => {
            await page.goto('/');

            // Wait for the featured section to load
            await expect(page.getByRole('heading', { name: /entreprises à la une/i })).toBeVisible();
        });

        test('should show organizations with booster badge if any exist', async ({ page }) => {
            await page.goto('/');

            // Wait for page to load
            await page.waitForLoadState('networkidle');

            // Check if the featured section is present
            const featuredSection = page.locator('section').filter({ hasText: /entreprises à la une/i });
            await expect(featuredSection).toBeVisible();

            // Look for organization cards or empty state
            const cards = featuredSection.locator('[href^="/business/"]');
            const cardCount = await cards.count();

            if (cardCount > 0) {
                // If there are booster organizations, they should have the Booster badge
                const boosterBadge = featuredSection.getByText('Booster');
                await expect(boosterBadge.first()).toBeVisible();
            }
        });

        test('should navigate to business page when card is clicked', async ({ page }) => {
            await page.goto('/');
            await page.waitForLoadState('networkidle');

            const firstCard = page.locator('[href^="/business/"]').first();
            const cardExists = await firstCard.isVisible().catch(() => false);

            if (cardExists) {
                await firstCard.click();
                await expect(page).toHaveURL(/\/business\/.+/);
            }
        });
    });

    test.describe('Search Page', () => {
        test('should display search results', async ({ page }) => {
            await page.goto('/search');

            await expect(page.getByRole('heading', { name: /recherche/i })).toBeVisible();
        });

        test('should filter by category', async ({ page }) => {
            await page.goto('/search');
            await page.waitForLoadState('networkidle');

            // Look for category filter chips
            const categoryChip = page.getByRole('button', { name: /restaurant/i }).first();
            const chipExists = await categoryChip.isVisible().catch(() => false);

            if (chipExists) {
                await categoryChip.click();
                await page.waitForTimeout(500);

                // URL should update with category filter
                await expect(page).toHaveURL(/category/i);
            }
        });

        test('should search by query', async ({ page }) => {
            await page.goto('/search');

            const searchInput = page.getByPlaceholder(/rechercher/i);
            await expect(searchInput).toBeVisible();

            await searchInput.fill('test');
            await searchInput.press('Enter');

            await page.waitForTimeout(500);
        });
    });

    test.describe('Categories Page', () => {
        test('should display all categories', async ({ page }) => {
            await page.goto('/categories');

            await expect(page.getByRole('heading', { name: /catégories/i })).toBeVisible();

            // There should be category cards
            const categoryCards = page.locator('[href^="/search?categoryId="]');
            await expect(categoryCards.first()).toBeVisible({ timeout: 10000 });
        });

        test('should navigate to search when category is clicked', async ({ page }) => {
            await page.goto('/categories');
            await page.waitForLoadState('networkidle');

            const firstCategory = page.locator('[href^="/search?categoryId="]').first();
            await firstCategory.click();

            await expect(page).toHaveURL(/\/search\?categoryId=/);
        });
    });

    test.describe('Map Page', () => {
        test('should display map view', async ({ page }) => {
            await page.goto('/map');

            // Check that map container is visible
            await expect(page.locator('.leaflet-container')).toBeVisible({ timeout: 15000 });
        });
    });
});
