import { render, screen, waitFor } from '@testing-library/react';
import { CategoriesSection } from '@/components/features/home/categories-section';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getCategories } from '@/lib/api/public';

// Mock dependencies
jest.mock('@/lib/api/public', () => ({
    getCategories: jest.fn(),
}));

describe('CategoriesSection', () => {
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

    it('renders empty state/error when fetch fails', async () => {
        (getCategories as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

        render(<CategoriesSection />, { wrapper: Wrapper });

        await waitFor(() => {
            expect(screen.getByText('Impossible de charger les catégories')).toBeInTheDocument();
        });
    });

    it('renders categories when data loads', async () => {
        const mockCategories = [
            { id: '1', name: 'Restaurants', slug: 'restaurants', organizationCount: 10, imageUrl: '/img.jpg' },
            { id: '2', name: 'Hotels', slug: 'hotels', organizationCount: 5 }
        ];

        (getCategories as jest.Mock).mockResolvedValue(mockCategories);

        render(<CategoriesSection />, { wrapper: Wrapper });

        await waitFor(() => {
            expect(screen.getByText('Restaurants')).toBeInTheDocument();
            expect(screen.getByText('Hotels')).toBeInTheDocument();
            expect(screen.getByText('10 entreprises')).toBeInTheDocument();
        });
    });

    it('renders correct links', async () => {
        const mockCategories = [
            { id: '1', name: 'Tech', slug: 'tech', organizationCount: 10 }
        ];

        (getCategories as jest.Mock).mockResolvedValue(mockCategories);

        render(<CategoriesSection />, { wrapper: Wrapper });

        await waitFor(() => {
            const link = screen.getByRole('link', { name: /Tech/i });
            expect(link).toHaveAttribute('href', '/categories/tech');
        });

        // Check "View All" link
        const viewAllLinks = screen.getAllByRole('link', { name: /Voir toutes les catégories/i });
        expect(viewAllLinks.length).toBeGreaterThan(0);
        expect(viewAllLinks[0]).toHaveAttribute('href', '/categories');
    });
});
