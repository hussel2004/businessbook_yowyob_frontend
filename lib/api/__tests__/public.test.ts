// import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import * as publicApi from '../public';

// Mock the HTTP client
jest.mock('../client', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    del: jest.fn(),
    upload: jest.fn(),
}));

import { get } from '../client';

describe('publicApi', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getCategories', () => {
        it('should return categories', async () => {
            const mockCategories = [{ id: 'cat-1', name: 'Category 1' }];
            jest.mocked(get).mockResolvedValue(mockCategories);

            const result = await publicApi.getCategories();

            expect(result).toEqual(mockCategories);
            expect(get).toHaveBeenCalledWith('/categories');
        });
    });

    describe('getCategoryBySlug', () => {
        it('should return category by slug', async () => {
            const mockCategory = { id: 'cat-1', slug: 'cat-1' };
            jest.mocked(get).mockResolvedValue(mockCategory);

            const result = await publicApi.getCategoryBySlug('cat-1');

            expect(result).toEqual(mockCategory);
            expect(get).toHaveBeenCalledWith('/categories/slug/cat-1');
        });
    });

    describe('searchOrganizations', () => {
        it('should return search results', async () => {
            const mockResponse = {
                content: [{ id: 'org-1', longName: 'Org 1' }],
                totalElements: 1
            };
            const params = { q: 'tech', city: 'Douala' };

            jest.mocked(get).mockResolvedValue(mockResponse);

            const result = await publicApi.searchOrganizations(params);

            expect(result.content).toEqual(mockResponse.content);
            expect(get).toHaveBeenCalledWith('/organizations/search', params);
        });
    });

    describe('getOrganizationReviews', () => {
        it('should return reviews', async () => {
            const mockReviews = [{ id: 'rev-1', rating: 5 }];
            jest.mocked(get).mockResolvedValue(mockReviews);

            const result = await publicApi.getOrganizationReviews('org-123');

            expect(result.content).toEqual(mockReviews);
            expect(get).toHaveBeenCalledWith('/organizations/org-123/reviews', { page: 0, size: 10 });
        });
    });

    describe('getFeaturedPromotions', () => {
        it('should return featured promotions', async () => {
            const mockPromos = [{ id: 'promo-1', title: 'Sale' }];
            jest.mocked(get).mockResolvedValue(mockPromos);

            const result = await publicApi.getFeaturedPromotions();

            expect(result).toEqual(mockPromos);
            expect(get).toHaveBeenCalledWith('/promotions/featured', { size: 6 });
        });
    });
});
