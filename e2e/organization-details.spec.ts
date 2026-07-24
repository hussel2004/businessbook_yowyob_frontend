import { test, expect } from '@playwright/test';

test.describe('Organization Details Page', () => {
    const mockOrg = {
        id: 'org-123',
        slug: 'test-org',
        name: 'Test Organization', // Use name here as per API response likely having it, or longName if needed. 
        longName: 'Test Organization Long Name',
        shortName: 'TestOrg',
        description: 'A test organization description.',
        categoryName: 'Technology',
        city: 'Douala',
        averageRating: 4.5,
        reviewCount: 12,
        isVerified: true,
        logoUrl: null,
        coverImageUrl: null,
    };

    test.beforeEach(async ({ page }) => {
        // Mock Organization by Slug
        await page.route('**/api/organizations/slug/test-org', async route => {
            await route.fulfill({ json: mockOrg });
        });

        // Mock Related resources (return empty arrays/defaults)
        await page.route('**/api/organizations/org-123/services', async route => {
            await route.fulfill({ json: [{ id: 's1', name: 'Web Dev', price: 50000 }] });
        });
        await page.route('**/api/organizations/org-123/agencies', async route => {
            await route.fulfill({ json: [] });
        });
        await page.route('**/api/organizations/org-123/gallery', async route => {
            await route.fulfill({ json: [] });
        });
        await page.route('**/api/organizations/org-123/posts', async route => {
            // Mock PageResponse structure
            await route.fulfill({ json: { content: [], totalElements: 0 } });
        });
        await page.route('**/api/organizations/org-123/promotions', async route => {
            await route.fulfill({ json: { content: [], totalElements: 0 } });
        });
        await page.route('**/api/organizations/org-123/reviews*', async route => {
            await route.fulfill({ json: { content: [], totalElements: 0 } });
        });
        await page.route('**/api/organizations/org-123/rating-summary', async route => {
            await route.fulfill({ json: { averageRating: 4.5, totalReviews: 12, distribution: {} } });
        });
        await page.route('**/api/organizations/org-123/contacts', async route => {
            await route.fulfill({ json: [] });
        });
        await page.route('**/api/organizations/org-123/awards', async route => {
            await route.fulfill({ json: [] });
        });
        await page.route('**/api/organizations/org-123/similar*', async route => {
            await route.fulfill({ json: [] });
        });
    });

    test('loads organization details successfully', async ({ page }) => {
        await page.goto('/business/test-org');

        // Check Title (OrgHeader)
        await expect(page.getByText(/Test Organization/)).toBeVisible();

        // Check Description
        await expect(page.getByText('A test organization description.')).toBeVisible();

        // Check Tabs presence
        await expect(page.getByRole('tab', { name: 'Services' })).toBeVisible();
        await expect(page.getByRole('tab', { name: 'Avis' })).toBeVisible();
    });

    test('can switch tabs to Services', async ({ page }) => {
        await page.goto('/business/test-org');

        const servicesTab = page.getByRole('tab', { name: 'Services' });
        await servicesTab.click();

        // Expect service to be visible
        await expect(page.getByText('Web Dev')).toBeVisible();
        await expect(page.getByText(/50.*000/)).toBeVisible();
    });
});
