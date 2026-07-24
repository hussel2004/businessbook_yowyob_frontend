import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchFilters } from '@/components/features/search/search-filters';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock dependencies
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
}));

jest.mock('@/lib/api/public', () => ({
    getCategories: jest.fn().mockResolvedValue([
        { id: '1', name: 'Restaurants', slug: 'restaurants' },
        { id: '2', name: 'Tech', slug: 'tech' }
    ]),
}));

// Mock dynamic import
jest.mock('next/dynamic', () => () => {
    return function MockLocationPicker() {
        return <div data-testid="location-picker">Location Picker</div>;
    }
});

describe('SearchFilters', () => {
    let queryClient: QueryClient;
    const mockPush = jest.fn();
    const mockSearchParams = new URLSearchParams();

    beforeEach(() => {
        jest.clearAllMocks();
        queryClient = new QueryClient();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    });

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    it('renders initial state from props/url', () => {
        mockSearchParams.set('q', 'Pizza');
        mockSearchParams.set('city', 'Paris');

        render(<SearchFilters />, { wrapper: Wrapper });

        expect(screen.getByPlaceholderText(/Ex: Boulangerie/i)).toHaveValue('Pizza');
        expect(screen.getByPlaceholderText(/Ville/i)).toHaveValue('Paris');
    });

    it('updates filters on input change', async () => {
        render(<SearchFilters />, { wrapper: Wrapper });

        const input = screen.getByPlaceholderText(/Ex: Boulangerie/i);
        fireEvent.change(input, { target: { value: 'Burger' } });

        // Wait for debounce
        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('q=Burger'));
        }, { timeout: 1000 });
    });

    it('applies verified filter', async () => {
        render(<SearchFilters />, { wrapper: Wrapper });

        const checkbox = screen.getByLabelText(/Entreprises certifiées uniquement/i);
        fireEvent.click(checkbox);

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('verified=true'));
        });
    });

    it('clears filters', async () => {
        mockSearchParams.set('q', 'Test');

        render(<SearchFilters />, { wrapper: Wrapper });

        const clearBtn = screen.getByText('Réinitialiser');
        fireEvent.click(clearBtn);

        expect(mockPush).toHaveBeenCalledWith('/search');
        expect(screen.getByPlaceholderText(/Ex: Boulangerie/i)).toHaveValue('');
    });
});
