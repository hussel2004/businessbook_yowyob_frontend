import { render, screen, waitFor } from '@testing-library/react';
import { SearchResults } from '../search-results';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as publicApi from '@/lib/api/public';

// Mock dependencies
jest.mock('@/lib/api/public');
jest.mock('next/navigation', () => ({
    useSearchParams: () => new URLSearchParams('q=test'),
    useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/lib/hooks/use-geolocation', () => ({
    useGeolocation: () => ({
        coordinates: { latitude: 0, longitude: 0 },
        isLoading: false,
        error: null
    })
}));

jest.mock('@/components/features/map/map-view', () => ({
    MapView: () => <div data-testid="map-view">Map View</div>
}));

describe('SearchResults Unit', () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    it('renders list of results', async () => {
        (publicApi.searchOrganizations as jest.Mock).mockResolvedValue({
            content: [
                {
                    id: '1',
                    name: 'Unit Test Corp',
                    slug: 'unit-test',
                    category: { name: 'Tech' },
                    isVerified: true
                }
            ],
            totalPages: 1
        });

        render(<SearchResults viewMode="list" filterModes={['all']} />, { wrapper: Wrapper });

        await waitFor(() => {
            expect(screen.getByText('Unit Test Corp')).toBeInTheDocument();
        });
    });
});
