import { render, screen, waitFor } from '@testing-library/react';
import { FeaturedOrganizationsSection } from '@/components/features/home/featured-organizations';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getOrganizationById } from '@/lib/api/public';
import { subscriptionApi } from '@/lib/api/subscription';

// Mock dependencies
jest.mock('@/lib/api/public', () => ({
    getOrganizationById: jest.fn(),
}));
jest.mock('@/lib/api/subscription');

// Mock Lucide icons to avoid potential issues in some environments (though usually fine)
// jest.mock('lucide-react', () => ({
//     MapPin: () => <div data-testid="map-pin" />,
//     BadgeCheck: () => <div data-testid="badge-check" />,
//     ArrowRight: () => <div data-testid="arrow-right" />,
//     Rocket: () => <div data-testid="rocket" />,
// }));

describe('FeaturedOrganizationsSection', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        jest.clearAllMocks();
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });
    });

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    it('renders empty state when no boosted organizations', async () => {
        (subscriptionApi.getBoostedOrganizationIds as jest.Mock).mockResolvedValue([]);

        render(<FeaturedOrganizationsSection />, { wrapper: Wrapper });

        await waitFor(() => {
            expect(screen.getByText('Aucune entreprise à la une pour le moment')).toBeInTheDocument();
        });
    });

    it('renders featured organizations when data loads', async () => {
        const mockOrg = {
            id: 'org-1',
            longName: 'Test Org',
            slug: 'test-org',
            coverImageUrl: '/cover.jpg',
            logoUrl: '/logo.jpg',
            categoryName: 'Tech',
            averageRating: 4.5,
            reviewCount: 10,
            city: 'Douala'
        };

        (subscriptionApi.getBoostedOrganizationIds as jest.Mock).mockResolvedValue(['org-1']);
        (getOrganizationById as jest.Mock).mockResolvedValue(mockOrg);

        render(<FeaturedOrganizationsSection />, { wrapper: Wrapper });

        await waitFor(() => {
            expect(screen.getByText('Test Org')).toBeInTheDocument();
            expect(screen.getByText('Tech')).toBeInTheDocument();
            expect(screen.getByText('Douala')).toBeInTheDocument();
        });
    });

    it('handles error state gracefully', async () => {
        (subscriptionApi.getBoostedOrganizationIds as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

        render(<FeaturedOrganizationsSection />, { wrapper: Wrapper });

        await waitFor(() => {
            expect(screen.getByText('Impossible de charger les entreprises')).toBeInTheDocument();
        });
    });
});
