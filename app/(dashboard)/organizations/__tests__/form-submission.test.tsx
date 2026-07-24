import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateOrganizationPage from '../create/page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/auth/auth-store';
import * as organizationApi from '@/lib/api/organizations';
import * as publicApi from '@/lib/api/public';
import * as dashboardApi from '@/lib/api/dashboard';

// Mock dependencies
jest.mock('@/lib/auth/auth-store');
jest.mock('@/lib/api/organizations');
jest.mock('@/lib/api/public');
jest.mock('@/lib/api/dashboard');
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        back: jest.fn(),
    }),
}));

// Mock ImageUpload as it's complex
jest.mock('@/components/ui/image-upload', () => ({
    ImageUpload: () => <div data-testid="image-upload">Image Upload Mock</div>
}));

describe('CreateOrganizationPage Form', () => {
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

        // Default mocks
        (useAuthStore as unknown as jest.Mock).mockReturnValue({
            isAuthenticated: true,
            user: { id: 'user1', emailVerified: true },
            isLoading: false
        });

        (publicApi.getCategories as jest.Mock).mockResolvedValue([
            { id: 'cat1', name: 'Restaurant' },
            { id: 'cat2', name: 'Services' }
        ]);

        (dashboardApi.getDashboardStats as jest.Mock).mockResolvedValue({
            organizationCount: 0
        });
    });

    it('validates required fields', async () => {
        render(<CreateOrganizationPage />, { wrapper: Wrapper });

        // Wait for categories to load (form rendering)
        await waitFor(() => {
            expect(screen.getByText('Ajouter une entreprise')).toBeInTheDocument();
        });

        const submitBtn = screen.getByRole('button', { name: /Créer l'entreprise/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(screen.getByText('Le nom doit contenir au moins 2 caractères')).toBeInTheDocument();
            expect(screen.getByText('Le nom court doit contenir au moins 2 caractères')).toBeInTheDocument();
            expect(screen.getByText('Veuillez sélectionner une catégorie')).toBeInTheDocument();
        });
    });

    it('submits valid form data', async () => {
        const createMock = (organizationApi.createOrganization as jest.Mock).mockResolvedValue({
            id: 'new-org-id',
            slug: 'ma-boutique'
        });

        render(<CreateOrganizationPage />, { wrapper: Wrapper });

        await waitFor(() => {
            expect(screen.getByLabelText(/Nom de l'entreprise/i)).toBeInTheDocument();
        });

        // Fill form
        fireEvent.change(screen.getByLabelText(/Nom de l'entreprise/i), { target: { value: 'Ma Boutique' } });
        fireEvent.change(screen.getByLabelText(/Nom court/i), { target: { value: 'Boutique' } });

        // Select category - mimicking user interaction with standard select
        const catSelect = screen.getByLabelText(/Catégorie/i);
        fireEvent.change(catSelect, { target: { value: 'cat1' } });

        // Submit
        const submitBtn = screen.getByRole('button', { name: /Créer l'entreprise/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(createMock).toHaveBeenCalledWith(expect.objectContaining({
                longName: 'Ma Boutique',
                shortName: 'Boutique',
                categoryId: 'cat1'
            }));
        });
    });
});
