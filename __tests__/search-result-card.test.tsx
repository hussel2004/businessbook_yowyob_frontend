import { render, screen } from '@testing-library/react';
import { SearchResultCard } from '@/components/features/search/search-result-card';
import { OrganizationSummary } from '@/lib/api/public';

describe('SearchResultCard', () => {
    const mockOrg: OrganizationSummary = {
        id: '1',
        name: 'Test Org',
        slug: 'test-org',
        categoryName: 'Tech',
        isVerified: true,
        averageRating: 4.5,
        reviewCount: 10,
        city: 'NY',
        categories: ['Tech'],
        shortDescription: 'Short desc',
        logoUrl: '/logo.png',
        coverImageUrl: '/cover.png',
        distance: 2.5
    };

    it('renders list view correctly', () => {
        render(<SearchResultCard org={mockOrg} viewMode="list" />);

        expect(screen.getByText('Test Org')).toBeInTheDocument();
        expect(screen.getByText('Tech')).toBeInTheDocument();
        expect(screen.getByText('NY')).toBeInTheDocument();
        // Check verified badge existence (by checking container interactions/elements usually, but text is harder here)
        // Check rating
        expect(screen.getByText('(10 avis)')).toBeInTheDocument();
    });

    it('renders grid view correctly', () => {
        render(<SearchResultCard org={mockOrg} viewMode="grid" />);

        expect(screen.getByText('Test Org')).toBeInTheDocument();
        expect(screen.getByText('2.5 km')).toBeInTheDocument();
    });

    it('renders fallback for missing images', () => {
        const orgWithoutImages = { ...mockOrg, logoUrl: undefined, coverImageUrl: undefined };
        render(<SearchResultCard org={orgWithoutImages} viewMode="grid" />);

        expect(screen.getByText('T')).toBeInTheDocument(); // First letter fallback
    });
});
