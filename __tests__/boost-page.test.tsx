import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextIntlClientProvider } from 'next-intl';

import BoostPage from '@/app/(dashboard)/organizations/[slug]/boost/page';
import { getOrganizationBySlug } from '@/lib/api/public';
import { billingApi } from '@/lib/api/billing';
import frMessages from '@/messages/fr.json';

jest.mock('next/navigation', () => ({
    useParams: () => ({ slug: 'my-org' }),
    useRouter: () => ({ replace: jest.fn() }),
    useSearchParams: () => new URLSearchParams(),
}));

jest.mock('@/lib/api/public');
jest.mock('@/lib/api/billing', () => ({
    billingApi: {
        getCatalog: jest.fn(),
        getBoostSubscription: jest.fn(),
        checkoutBoost: jest.fn(),
        confirmBoost: jest.fn(),
    },
}));

/** Catalogue tel que servi par le backend (tarifs alignés sur le kernel). */
const catalog = {
    currency: 'XAF',
    boostPlans: [
        { plan: 'MONTHLY', months: 1, totalPrice: 1000, discountPercent: 0, monthlyEquivalent: 1000 },
        { plan: 'QUARTERLY', months: 3, totalPrice: 2800, discountPercent: 7, monthlyEquivalent: 933 },
        { plan: 'YEARLY', months: 12, totalPrice: 10000, discountPercent: 17, monthlyEquivalent: 833 },
    ],
    adPlacements: [{ placement: 'POPUP', dailyRate: 500, visibilityLevel: 5 }],
    adDurations: [{ days: 7, discountPercent: 0 }],
};

describe('Boost Page', () => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => {
        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });
        return (
            <NextIntlClientProvider locale="fr" messages={frMessages}>
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            </NextIntlClientProvider>
        );
    };

    const mockOrg = { id: 'org-1', longName: 'My Org', slug: 'my-org' };

    beforeEach(() => {
        jest.clearAllMocks();
        (getOrganizationBySlug as jest.Mock).mockResolvedValue(mockOrg);
        (billingApi.getCatalog as jest.Mock).mockResolvedValue(catalog);
    });

    it('affiche les formules servies par le backend', async () => {
        (billingApi.getBoostSubscription as jest.Mock).mockResolvedValue(null);

        render(<BoostPage />, { wrapper: Wrapper });

        await waitFor(() => {
            expect(screen.getByText('Mensuel')).toBeInTheDocument();
        });
        expect(screen.getByText('Trimestriel')).toBeInTheDocument();
        expect(screen.getByText('Annuel')).toBeInTheDocument();
        expect(screen.getAllByRole('button', { name: /S'abonner/i })).toHaveLength(3);
    });

    it('affiche les remises calculees par le backend', async () => {
        (billingApi.getBoostSubscription as jest.Mock).mockResolvedValue(null);

        render(<BoostPage />, { wrapper: Wrapper });

        await waitFor(() => {
            expect(screen.getByText('-7%')).toBeInTheDocument();
        });
        expect(screen.getByText('-17%')).toBeInTheDocument();
    });

    it("affiche l'abonnement actif", async () => {
        (billingApi.getBoostSubscription as jest.Mock).mockResolvedValue({
            id: 'sub-1',
            organizationId: 'org-1',
            billingCycle: 'MONTHLY',
            amountPaid: 1000,
            currency: 'XAF',
            status: 'ACTIVE',
            active: true,
            startedAt: '2026-07-01T00:00:00Z',
            expiresAt: '2099-08-01T00:00:00Z',
        });

        render(<BoostPage />, { wrapper: Wrapper });

        await waitFor(() => {
            expect(screen.getByText(/Abonnement actuel/i)).toBeInTheDocument();
        });
        expect(screen.getByText(/Actif jusqu'au/i)).toBeInTheDocument();
    });

    it("n'affiche pas comme actif un abonnement en attente de paiement", async () => {
        (billingApi.getBoostSubscription as jest.Mock).mockResolvedValue({
            id: 'sub-2',
            organizationId: 'org-1',
            billingCycle: 'YEARLY',
            amountPaid: 10000,
            currency: 'XAF',
            status: 'PENDING',
            active: false,
        });

        render(<BoostPage />, { wrapper: Wrapper });

        await waitFor(() => {
            expect(screen.getByText(/Abonnement actuel/i)).toBeInTheDocument();
        });
        expect(screen.queryByText(/Actif jusqu'au/i)).not.toBeInTheDocument();
    });
});
