import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { SearchResultCard } from '../search-result-card';
import { OrganizationSummary } from '@/lib/api/public';

expect.extend(toHaveNoViolations);

const mockOrg: OrganizationSummary = {
    id: '1',
    longName: 'Tech Solutions',
    shortName: 'TechSol',
    slug: 'tech-solutions',
    name: 'Tech Solutions',
    categories: ['IT Services'],
    categoryId: 'cat1',
    categoryName: 'Tech Services',
    city: 'Douala',
    averageRating: 4.5,
    reviewCount: 10,
    isVerified: true,
    isFeatured: false,
    countryCode: 'CM',
    logoUrl: '/logo.png',
    coverImageUrl: '/cover.png',
};

describe('SearchResultCard Accessibility', () => {
    it('should have no violations in list view', async () => {
        const { container } = render(<SearchResultCard org={mockOrg} viewMode="list" />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('should have no violations in grid view', async () => {
        const { container } = render(<SearchResultCard org={mockOrg} viewMode="grid" />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
