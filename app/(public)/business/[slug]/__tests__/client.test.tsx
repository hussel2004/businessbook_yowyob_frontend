import { render, screen, waitFor } from '@testing-library/react';
import BusinessPageClient from '../client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as api from '@/lib/api/public';
import { useAuthStore } from '@/lib/auth';

// Mock API
jest.mock('@/lib/api/public', () => ({
    getOrganizationBySlug: jest.fn(),
    getOrganizationAgencies: jest.fn(),
    getOrganizationGallery: jest.fn(),
    getOrganizationReviews: jest.fn(),
    getOrganizationRatingSummary: jest.fn(),
    getOrganizationServices: jest.fn(),
    checkFavorite: jest.fn(),
    addFavorite: jest.fn(),
    removeFavorite: jest.fn(),
    getOrganizationPosts: jest.fn(),
    getOrganizationPromotions: jest.fn(),
    getSimilarOrganizations: jest.fn(),
    getOrganizationAwards: jest.fn(),
    getOrganizationContacts: jest.fn(),
}));

// Mock Auth Store
jest.mock('@/lib/auth', () => ({
    useAuthStore: jest.fn(),
}));

// Mock Next Navigation
jest.mock('next/navigation', () => ({
    notFound: jest.fn(),
}));

describe('BusinessPageClient', () => {
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
        id: '1',
        name: 'TechCorp',
        slug: 'tech-corp',
        description: 'Best tech company',
        reviewCount: 10,
        averageRating: 4.5,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useAuthStore as unknown as jest.Mock).mockReturnValue({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            isInitialized: true,
            setUser: jest.fn(),
            updateUser: jest.fn(),
            setLoading: jest.fn(),
            setInitialized: jest.fn(),
            logout: jest.fn(),
            reset: jest.fn()
        });
        (api.getOrganizationBySlug as jest.Mock).mockResolvedValue(mockOrg);
        (api.getOrganizationAgencies as jest.Mock).mockResolvedValue([]);
        (api.getOrganizationServices as jest.Mock).mockResolvedValue([]);
        (api.getOrganizationGallery as jest.Mock).mockResolvedValue([]);
        (api.getOrganizationReviews as jest.Mock).mockResolvedValue({ content: [] });
        (api.getOrganizationRatingSummary as jest.Mock).mockResolvedValue({ averageRating: 4.5, totalReviews: 10, distribution: {} });
        (api.checkFavorite as jest.Mock).mockResolvedValue({ isFavorite: false });
    });

    it('renders organization details', async () => {
        render(<BusinessPageClient params={{ slug: 'tech-corp' }} />, { wrapper: Wrapper });

        // Should verify loading state initially? React Query often handles this fast or we skip it in tests if we resolve immediately.
        // Actually, waitFor is best.

        await waitFor(() => {
            expect(screen.getByText('TechCorp')).toBeInTheDocument();
        });

        expect(screen.getByText('Best tech company')).toBeInTheDocument();
    });

    it('shows tabs', async () => {
        render(<BusinessPageClient params={{ slug: 'tech-corp' }} />, { wrapper: Wrapper });

        await waitFor(() => expect(screen.getByText('TechCorp')).toBeInTheDocument());

        expect(screen.getByText(/À propos/i)).toBeInTheDocument();
        expect(screen.getByText(/Services/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Avis/i)[0]).toBeInTheDocument();
        expect(screen.getByText(/Contact/i)).toBeInTheDocument();
    });
});
