import { test, expect } from '@playwright/test';

test.describe('Organization Management', () => {

    // Helper to login
    test.beforeEach(async ({ page }) => {
        // Mock authentication state or perform login
        // For E2E, usually perform login
        await page.goto('/auth/login');
        await page.getByLabel('Email').fill('owner@example.com');
        await page.getByLabel('Mot de passe').fill('Password123!');
        await page.getByRole('button', { name: 'Se connecter' }).click();
        await page.waitForURL('/dashboard');
    });

    test('should create a new organization', async ({ page }) => {
        await page.goto('/dashboard/organizations/new');

        await page.getByLabel("Nom de l'entreprise").fill('New E2E Enterprise');
        await page.getByLabel('Slug').fill('new-e2e-enterprise');
        await page.getByLabel('Catégorie').click();
        await page.getByText('Technologie').click(); // Select from dropdown

        await page.getByRole('button', { name: 'Créer' }).click();

        // Expect redirect to org dashboard
        await expect(page).toHaveURL(/\/dashboard\/organizations\/new-e2e-enterprise/);
        await expect(page.getByText('New E2E Enterprise')).toBeVisible();
    });

    test('should edit an existing organization', async ({ page }) => {
        // Assume org exists
        await page.goto('/dashboard/organizations/my-org/edit');

        await page.getByLabel("Nom de l'entreprise").fill('Updated Enterprise Name');
        await page.getByRole('button', { name: 'Enregistrer' }).click();

        // Expect success message
        await expect(page.getByText('Modifications enregistrées')).toBeVisible();
    });
});
