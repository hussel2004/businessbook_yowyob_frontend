import { render, screen, waitFor } from '@testing-library/react';
import BoostPage from '@/app/(dashboard)/organizations/[slug]/boost/page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getOrganizationBySlug } from '@/lib/api/public';
import { subscriptionApi } from '@/lib/api/subscription';

// Mock dependencies
jest.mock('next/navigation', () => ({
    useParams: () => ({ slug: 'my-org' }),
}));

jest.mock('@/lib/api/public');
jest.mock('@/lib/api/subscription', () => ({
    subscriptionApi: {
        getByOrganization: jest.fn(),
    },
}));

describe('Boost Page', () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const mockOrg = {
        id: 'org-1',
        name: 'My Org',
        slug: 'my-org',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (getOrganizationBySlug as jest.Mock).mockResolvedValue(mockOrg);
    });

    it('renders inactive state correctly', async () => {
        // Mock no subscription or inactive
        (subscriptionApi.getByOrganization as jest.Mock).mockResolvedValue(null);

        render(<BoostPage />, { wrapper: Wrapper });

        await waitFor(() => {
            expect(screen.getByText("Vous n'avez pas encore le Business Booster")).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /S'abonner à Business Booster/i })).toHaveAttribute('href', '/pricing');
        });

        // Check pricing info is visible
        expect(screen.getByText(/100 000 XAF \/ mois/i)).toBeInTheDocument();
    });

    it('renders active booster state correctly', async () => {
        // Mock active subscription
        (subscriptionApi.getByOrganization as jest.Mock).mockResolvedValue({
            id: 'sub-1',
            status: 'ACTIVE',
            planType: 'BUSINESS_BOOSTER',
            endDate: '2025-12-31T23:59:59Z'
        });

        render(<BoostPage />, { wrapper: Wrapper });

        await waitFor(() => {
            expect(screen.getByText('Business Booster Actif')).toBeInTheDocument();
            expect(screen.getByText(/Gérer mes publicités/i)).toBeInTheDocument();
        });

        // Check features are highlighted (optional, hard to test classes, but text should be there)
        expect(screen.getByText('Publicités Vidéo')).toBeInTheDocument();
    });
});
