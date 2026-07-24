import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchPage from '@/app/(public)/search/page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as publicApi from '@/lib/api/public';

// Mock dependencies
jest.mock('@/lib/api/public');
jest.mock('next/navigation', () => ({
    useSearchParams: () => new URLSearchParams('q=test'), // Removed '?' to be safe
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// Mock MapView to avoid heavy logic
jest.mock('@/components/features/map/map-view', () => ({
    MapView: () => <div data-testid="map-view">Map View</div>
}));

// Vital mock for SearchResults component execution
jest.mock('@/lib/hooks/use-geolocation', () => ({
    useGeolocation: () => ({
        coordinates: { latitude: 0, longitude: 0 },
        isLoading: false,
        error: null
    })
}));

describe('SearchPage Integration', () => {
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

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock Categories
        (publicApi.getCategories as jest.Mock).mockResolvedValue([
            { id: 'cat1', slug: 'tech', name: 'Tech' },
            { id: 'cat2', slug: 'food', name: 'Food' }
        ]);

        // Mock Search Results
        (publicApi.searchOrganizations as jest.Mock).mockResolvedValue({
            content: [
                {
                    id: '1',
                    name: 'Tech Solution',
                    slug: 'tech-solution',
                    description: 'Best tech provider',
                    category: { name: 'Tech', slug: 'tech' },
                    isVerified: true,
                    averageRating: 4.5,
                    reviewCount: 10
                },
                {
                    id: '2',
                    name: 'Food Court',
                    slug: 'food-court',
                    description: 'Yummy food',
                    category: { name: 'Food', slug: 'food' },
                    isVerified: false,
                    averageRating: 3.0,
                    reviewCount: 5
                }
            ],
            totalPages: 1,
            totalElements: 2,
            number: 0,
            size: 20
        });
    });

    it('renders category filters correctly', async () => {
        render(<SearchPage />, { wrapper: Wrapper });

        await waitFor(() => {
            expect(screen.getByText('Tech')).toBeInTheDocument();
            expect(screen.getByText('Food')).toBeInTheDocument();
        });
    });

    it('displays search results', async () => {
        render(<SearchPage />, { wrapper: Wrapper });

        // Extended timeout to ensure react-query resolves and renders
        await waitFor(() => {
            expect(screen.getByText('Tech Solution')).toBeInTheDocument();
            expect(screen.getByText('Food Court')).toBeInTheDocument();
        }, { timeout: 3000 });

        expect(screen.getByText(/2 résultats/)).toBeInTheDocument();
    });

    it('handles empty results', async () => {
        (publicApi.searchOrganizations as jest.Mock).mockResolvedValue({
            content: [],
            totalPages: 0,
            totalElements: 0
        });

        render(<SearchPage />, { wrapper: Wrapper });

        await waitFor(() => {
            expect(screen.getByText('Aucun résultat trouvé')).toBeInTheDocument();
        }, { timeout: 3000 });
    });
});
