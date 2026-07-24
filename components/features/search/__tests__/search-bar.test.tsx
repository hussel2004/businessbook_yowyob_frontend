import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchBar } from '../search-bar';
import { useRouter } from 'next/navigation';
import * as api from '@/lib/api/public';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock dependencies
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('@/lib/api/public', () => ({
    getSearchSuggestions: jest.fn(),
}));

const mockPush = jest.fn();

describe('SearchBar', () => {
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
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    });

    it('renders correctly', () => {
        render(<SearchBar />, { wrapper: Wrapper });
        expect(screen.getByPlaceholderText(/rechercher/i)).toBeInTheDocument();
    });

    it('updates input value', () => {
        render(<SearchBar />, { wrapper: Wrapper });
        const input = screen.getByPlaceholderText(/rechercher/i);
        fireEvent.change(input, { target: { value: 'test' } });
        expect(input).toHaveValue('test');
    });

    it('triggers search on enter', () => {
        render(<SearchBar />, { wrapper: Wrapper });
        const input = screen.getByPlaceholderText(/rechercher/i);
        fireEvent.change(input, { target: { value: 'restaurant' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
        expect(mockPush).toHaveBeenCalledWith('/search?q=restaurant');
    });

    it('shows suggestions', async () => {
        (api.getSearchSuggestions as jest.Mock).mockResolvedValue(['Restaurant A', 'Restaurant B']);

        render(<SearchBar />, { wrapper: Wrapper });
        const input = screen.getByPlaceholderText(/rechercher/i);

        // Type enough characters to trigger fetch (debounced 300ms)
        fireEvent.change(input, { target: { value: 'res' } });

        // Use fake timers or waitFor (waitFor is easier if we don't control debounce implementation details perfectly in test)
        // But since we use useDebounce, we might need to wait 300ms + query time.
        // Actually, let's just use waitFor which retries assertions.

        await waitFor(() => {
            // Expect suggestions to appear
            expect(screen.getByText('Restaurant A')).toBeInTheDocument();
            expect(screen.getByText('Restaurant B')).toBeInTheDocument();
        }, { timeout: 1000 });
    });

    it('navigates on suggestion click', async () => {
        (api.getSearchSuggestions as jest.Mock).mockResolvedValue(['Restaurant A']);

        render(<SearchBar />, { wrapper: Wrapper });
        const input = screen.getByPlaceholderText(/rechercher/i);
        fireEvent.change(input, { target: { value: 'res' } });

        await waitFor(() => expect(screen.getByText('Restaurant A')).toBeInTheDocument());

        fireEvent.click(screen.getByText('Restaurant A'));
        expect(mockPush).toHaveBeenCalledWith('/search?q=Restaurant%20A');
    });
});
