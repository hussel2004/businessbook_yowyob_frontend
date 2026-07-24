import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/BusinessBook/);
});

test('can perform search', async ({ page }) => {
    await page.goto('/');

    // Find search input
    const searchInput = page.locator('form input').first();
    await expect(searchInput).toBeVisible();

    // Type search
    await searchInput.fill('Restaurant');
    await searchInput.press('Enter');

    // Expect URL change
    await expect(page).toHaveURL(/search/);
});
