import { jest } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FeaturedOrganizationsSection } from '../featured-organizations';
import { subscriptionApi } from '@/lib/api/subscription';
import { getOrganizationById } from '@/lib/api/public';

// Mock the API modules
// Removed jest.mock for subscription to use spyOn instead
jest.mock('@/lib/api/public', () => ({
    getOrganizationById: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
    default: ({ src, alt }: { src: string; alt: string }) => (
        <img src={src} alt={alt} />
    ),
}));

// Mock next/link
jest.mock('next/link', () => ({
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));

describe('FeaturedOrganizationsSection', () => {
    let queryClient: QueryClient;

    const mockOrganization = {
        id: '123',
        slug: 'test-org',
        longName: 'Test Organization',
        categoryName: 'Restaurant',
        city: 'Douala',
        logoUrl: '/logo.jpg',
        coverImageUrl: '/cover.jpg',
        averageRating: 4.5,
        reviewCount: 10,
        isVerified: true,
    };

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });
        jest.clearAllMocks();
    });

    const renderComponent = () => {
        return render(
            <QueryClientProvider client={queryClient}>
                <FeaturedOrganizationsSection />
            </QueryClientProvider>
        );
    };


    it('should render loading skeleton initially', async () => {
        jest.spyOn(subscriptionApi, 'getBoostedOrganizationIds').mockImplementation(() =>
            new Promise(() => { }) // Never resolves, stays loading
        );

        renderComponent();

        // Check for loading state (skeleton elements)
        expect(screen.getByText('Entreprises à la une')).toBeInTheDocument();
    });

    it('should display organizations with booster badge when data loads', async () => {
        const orgId = '123';
        jest.spyOn(subscriptionApi, 'getBoostedOrganizationIds').mockResolvedValue([orgId]);
        (getOrganizationById as jest.Mock).mockResolvedValue(mockOrganization as any);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('Test Organization')).toBeInTheDocument();
        });

        expect(screen.getByText('Restaurant')).toBeInTheDocument();
        expect(screen.getByText('Douala')).toBeInTheDocument();
        expect(screen.getByText('Booster')).toBeInTheDocument();
    });

    it('should show empty message when no boosters exist', async () => {
        jest.spyOn(subscriptionApi, 'getBoostedOrganizationIds').mockResolvedValue([]);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText(/Aucune entreprise/i)).toBeInTheDocument();
        });
    });

    it('should link to organization page', async () => {
        const orgId = '123';
        jest.spyOn(subscriptionApi, 'getBoostedOrganizationIds').mockResolvedValue([orgId]);
        (getOrganizationById as jest.Mock).mockResolvedValue(mockOrganization as any);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('Test Organization')).toBeInTheDocument();
        });

        const link = screen.getByRole('link', { name: /Test Organization/i });
        expect(link).toHaveAttribute('href', '/business/test-org');
    });

    it('should display star rating', async () => {
        const orgId = '123';
        jest.spyOn(subscriptionApi, 'getBoostedOrganizationIds').mockResolvedValue([orgId]);
        (getOrganizationById as jest.Mock).mockResolvedValue(mockOrganization as any);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('(10)')).toBeInTheDocument();
        });
    });
});
