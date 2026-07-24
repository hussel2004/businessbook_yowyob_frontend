import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchBar } from '@/components/features/search/search-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getSearchSuggestions } from '@/lib/api/public';

// Mock dependencies
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('@/lib/api/public');

describe('SearchBar', () => {
    let queryClient: QueryClient;
    const mockPush = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
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

    it('renders correctly', () => {
        render(<SearchBar />, { wrapper: Wrapper });
        expect(screen.getByPlaceholderText('Rechercher une entreprise, un service...')).toBeInTheDocument();
    });

    it('updates input value on change', () => {
        render(<SearchBar />, { wrapper: Wrapper });
        const input = screen.getByPlaceholderText('Rechercher une entreprise, un service...');
        fireEvent.change(input, { target: { value: 'test' } });
        expect(input).toHaveValue('test');
    });

    it('navigates on enter key', async () => {
        render(<SearchBar />, { wrapper: Wrapper });
        const input = screen.getByPlaceholderText('Rechercher une entreprise, un service...');

        fireEvent.change(input, { target: { value: 'search term' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        expect(mockPush).toHaveBeenCalledWith('/search?q=search%20term');
    });

    it('shows suggestions', async () => {
        (getSearchSuggestions as jest.Mock).mockResolvedValue(['suggestion 1', 'suggestion 2']);

        render(<SearchBar />, { wrapper: Wrapper });
        const input = screen.getByPlaceholderText('Rechercher une entreprise, un service...');

        fireEvent.change(input, { target: { value: 'su' } });

        // Wait for debounce and query
        await waitFor(() => {
            expect(screen.getByText('suggestion 1')).toBeInTheDocument();
        });

        expect(screen.getByText('suggestion 2')).toBeInTheDocument();
    });

    it('navigates when suggestion clicked', async () => {
        (getSearchSuggestions as jest.Mock).mockResolvedValue(['suggestion 1']);

        render(<SearchBar />, { wrapper: Wrapper });
        const input = screen.getByPlaceholderText('Rechercher une entreprise, un service...');

        fireEvent.change(input, { target: { value: 'su' } });

        await waitFor(() => {
            expect(screen.getByText('suggestion 1')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('suggestion 1'));

        // Default behavior (no onSearch prop) pushes to router
        // But logic calls router.push if onSearch NOT present? 
        // SearchBar logic: 
        // if (onSearch) onSearch(term) else router.push(...)

        expect(mockPush).toHaveBeenCalledWith('/search?q=suggestion%201');
    });
});
