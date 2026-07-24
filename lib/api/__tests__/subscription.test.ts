// import { describe, it, expect, vi, beforeEach } from 'vitest'; (Removed for Jest)
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { subscriptionApi } from '../subscription';

// Mock the HTTP client
jest.mock('../client', () => ({
    get: jest.fn(),
    post: jest.fn(),
}));

import { get, post } from '../client';

describe('subscriptionApi', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getBoostedOrganizationIds', () => {
        it('should return array of organization IDs', async () => {
            const mockIds = ['id-1', 'id-2', 'id-3'];
            jest.mocked(get).mockResolvedValue(mockIds);

            const result = await subscriptionApi.getBoostedOrganizationIds();

            expect(result).toEqual(mockIds);
            expect(get).toHaveBeenCalledWith('/subscriptions/boosted-organizations');
        });

        it('should return empty array on error', async () => {
            jest.mocked(get).mockRejectedValue(new Error('Network error'));

            const result = await subscriptionApi.getBoostedOrganizationIds();

            expect(result).toEqual([]);
        });
    });

    describe('getByOrganization', () => {
        it('should return subscription for organization', async () => {
            const mockSubscription = {
                id: 'sub-id',
                organizationId: 'org-id',
                planType: 'BUSINESS_BOOSTER',
                status: 'ACTIVE',
                endDate: '2026-03-01T00:00:00Z',
            };
            jest.mocked(get).mockResolvedValue(mockSubscription);

            const result = await subscriptionApi.getByOrganization('org-id');

            expect(result).toEqual(mockSubscription);
            expect(get).toHaveBeenCalledWith('/subscriptions/organization/org-id');
        });

        it('should return null when subscription not found', async () => {
            jest.mocked(get).mockRejectedValue(new Error('Not found'));

            const result = await subscriptionApi.getByOrganization('org-id');

            expect(result).toBeNull();
        });
    });

    describe('getCurrent', () => {
        it('should return current user subscription', async () => {
            const mockSubscription = {
                id: 'sub-id',
                planType: 'BUSINESS_BOOSTER',
                status: 'ACTIVE',
            };
            jest.mocked(get).mockResolvedValue(mockSubscription);

            const result = await subscriptionApi.getCurrent();

            expect(result).toEqual(mockSubscription);
            expect(get).toHaveBeenCalledWith('/subscriptions/current');
        });
    });


});
