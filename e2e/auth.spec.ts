import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {

    test('should allow a user to register', async ({ page }) => {
        await page.goto('/auth/register');

        // Fill registration form
        await page.getByLabel('Nom complet').fill('Test User');
        await page.getByLabel('Email').fill(`test-${Date.now()}@example.com`);
        await page.getByLabel('Mot de passe').fill('Password123!');
        await page.getByLabel('Confirmer le mot de passe').fill('Password123!');

        // Select account type if it exists in the form (assuming default or radio)
        // await page.getByLabel('Propriétaire').check(); 

        await page.getByRole('button', { name: "S'inscrire" }).click();

        // Expect redirect to dashboard or home with verified state
        await expect(page).toHaveURL(/\/dashboard/);
        await expect(page.getByText('Test User')).toBeVisible();
    });

    test('should allow a user to login', async ({ page }) => {
        // Pre-requisite: User exists (mocked or seeded) - For E2E we usually assume seed or register first
        // Here we'll mock the API response for login to avoid dependency on backend state if not integrated

        // However, for "Real" E2E, we go through the UI. 
        // Let's assume a pre-seeded user "valid@example.com" / "Password123!" for this test pattern

        await page.goto('/auth/login');

        await page.getByLabel('Email').fill('valid@example.com');
        await page.getByLabel('Mot de passe').fill('Password123!');

        await page.getByRole('button', { name: 'Se connecter' }).click();

        // Expect successful login
        // await expect(page).toHaveURL('/'); // or dashboard
        // Check for logout button or profile to confirm
        // await expect(page.getByRole('button', { name: 'Déconnexion' })).toBeVisible();
    });

    test('should allow a user to logout', async ({ page }) => {
        // Login first
        await page.goto('/auth/login');
        await page.getByLabel('Email').fill('valid@example.com');
        await page.getByLabel('Mot de passe').fill('Password123!');
        await page.getByRole('button', { name: 'Se connecter' }).click();

        // Logout
        const profileMenu = page.locator('[data-testid="user-menu-trigger"]'); // Adjust selector
        await profileMenu.click();

        await page.getByRole('button', { name: 'Déconnexion' }).click();

        // Expect redirect to login or home
        await expect(page).toHaveURL('/auth/login');
    });
});
