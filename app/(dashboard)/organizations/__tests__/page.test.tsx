import { render, screen, waitFor } from '@testing-library/react';
import OrganizationsPage from '../page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/auth/auth-store';
import * as client from '@/lib/api/client';
import * as dashboardApi from '@/lib/api/dashboard';

// Mock dependencies
jest.mock('@/lib/auth/auth-store');
jest.mock('@/lib/api/client');
jest.mock('@/lib/api/dashboard');
jest.mock('@/components/ui/button', () => ({
    buttonVariants: jest.fn(() => 'mock-button-class'),
}));

describe('OrganizationsPage', () => {
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
    });

    it('shows "Add Organization" button when limit not reached', async () => {
        // Mock User
        (useAuthStore as unknown as jest.Mock).mockReturnValue({
            user: { id: 'user1', accountType: 'BUSINESS' },
        });

        // Mock Organizations (Empty)
        (client.get as jest.Mock).mockResolvedValue([]);

        // Mock Dashboard Stats
        (dashboardApi.getDashboardStats as jest.Mock).mockResolvedValue({
            organizationCount: 0
        });

        render(<OrganizationsPage />, { wrapper: Wrapper });

        await waitFor(() => {
            expect(screen.getByText('Ajouter une entreprise')).toBeInTheDocument();
        });
    });

    it('shows "Passer Diamond" button when limit reached (Business + 1 org)', async () => {
        // Mock User
        (useAuthStore as unknown as jest.Mock).mockReturnValue({
            user: { id: 'user1', accountType: 'BUSINESS' },
        });

        // Mock Organizations (1 existing)
        (client.get as jest.Mock).mockResolvedValue([
            { id: 'org1', name: 'My Org', slug: 'my-org', isVerified: true }
        ]);

        // Mock Dashboard Stats
        (dashboardApi.getDashboardStats as jest.Mock).mockResolvedValue({
            organizationCount: 1
        });

        render(<OrganizationsPage />, { wrapper: Wrapper });

        await waitFor(() => {
            expect(screen.getByText('Passez Diamond pour ajouter')).toBeInTheDocument();
            expect(screen.queryByText('Ajouter une entreprise', { selector: 'a' })).not.toBeInTheDocument();
        });
    });
});
