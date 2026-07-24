import { render, screen } from '@testing-library/react';
import { YouTubeResultCard } from '@/components/features/search/youtube-result-card';
import { OrganizationSummary } from '@/lib/api/public';

describe('Featured Booster', () => {
    const mockBoosterOrg: OrganizationSummary = {
        id: '1',
        name: 'Booster Corp',
        slug: 'booster-corp',
        category: { name: 'Tech', slug: 'tech' },
        categoryName: 'Tech',
        isFeatured: true, // Key property
        averageRating: 5,
        reviewCount: 100,
        city: 'Douala',
        isVerified: true
    };

    const mockStandardOrg: OrganizationSummary = {
        ...mockBoosterOrg,
        id: '2',
        name: 'Standard Corp',
        isFeatured: false
    };

    it('displays booster badge for featured organizations', () => {
        render(<YouTubeResultCard org={mockBoosterOrg} />);
        expect(screen.getByText('OFFRE FLASH')).toBeInTheDocument();
        expect(screen.getByText('Promo en cours')).toBeInTheDocument();
    });

    it('does not display booster badge for standard organizations', () => {
        render(<YouTubeResultCard org={mockStandardOrg} />);
        expect(screen.queryByText('OFFRE FLASH')).not.toBeInTheDocument();
        expect(screen.queryByText('Promo en cours')).not.toBeInTheDocument();
    });
});
