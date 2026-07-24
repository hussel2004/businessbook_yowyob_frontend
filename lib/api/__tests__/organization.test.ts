// import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import * as organizationApi from '../organization';

// Mock the HTTP client
jest.mock('../client', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    del: jest.fn(),
    upload: jest.fn(),
}));

import { get, post } from '../client';

describe('organizationApi', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getOrganization', () => {
        it('should return organization details', async () => {
            const mockOrg = { id: 'org-123', longName: 'Test Org' };
            jest.mocked(get).mockResolvedValue(mockOrg);

            const result = await organizationApi.getOrganization('org-123');

            expect(result).toEqual(mockOrg);
            expect(get).toHaveBeenCalledWith('/organizations/org-123');
        });
    });

    describe('getOrganizationGallery', () => {
        it('should return gallery items', async () => {
            const mockGallery = [{ id: 'media-1', fileUrl: 'url.jpg' }];
            jest.mocked(get).mockResolvedValue(mockGallery);

            const result = await organizationApi.getOrganizationGallery('org-123');

            expect(result).toEqual(mockGallery);
            expect(get).toHaveBeenCalledWith('/organizations/org-123/gallery');
        });
    });
});
