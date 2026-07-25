import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextIntlClientProvider } from 'next-intl';

import BoostPage from '@/app/(dashboard)/organizations/[slug]/boost/page';
import { getOrganizationBySlug } from '@/lib/api/public';
import { getBoostSubscription } from '@/lib/api/boost';
import {
    BOOST_PLANS,
    getBoostTotalPrice,
    getBoostMonthlyEquivalent,
    getBoostDiscountPercent,
    getAdPriceQuote,
} from '@/lib/constants/billing';
import frMessages from '@/messages/fr.json';

// Mock dependencies
jest.mock('next/navigation', () => ({
    useParams: () => ({ slug: 'my-org' }),
}));

jest.mock('@/lib/api/public');
jest.mock('@/lib/api/boost', () => ({
    getBoostSubscription: jest.fn(),
    activateBoost: jest.fn(),
}));

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

    const mockOrg = {
        id: 'org-1',
        longName: 'My Org',
        slug: 'my-org',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (getOrganizationBySlug as jest.Mock).mockResolvedValue(mockOrg);
    });

    it('affiche les trois formules quand aucun abonnement', async () => {
        (getBoostSubscription as jest.Mock).mockResolvedValue(null);

        render(<BoostPage />, { wrapper: Wrapper });

        await waitFor(() => {
            expect(screen.getByText('Mensuel')).toBeInTheDocument();
        });
        expect(screen.getByText('Trimestriel')).toBeInTheDocument();
        expect(screen.getByText('Annuel')).toBeInTheDocument();
        expect(screen.getAllByRole('button', { name: /S'abonner/i })).toHaveLength(3);
    });

    it("affiche l'abonnement actif", async () => {
        (getBoostSubscription as jest.Mock).mockResolvedValue({
            organizationId: 'org-1',
            cycle: 'monthly',
            amountPaid: 10000,
            startedAt: '2026-07-01T00:00:00Z',
            expiresAt: '2099-08-01T00:00:00Z',
            transactionId: 'DEMO-1',
            status: 'ACTIVE',
        });

        render(<BoostPage />, { wrapper: Wrapper });

        await waitFor(() => {
            expect(screen.getByText(/Abonnement actuel/i)).toBeInTheDocument();
        });
        expect(screen.getByText(/Actif jusqu'au/i)).toBeInTheDocument();
    });
});

describe('Tarification Boost', () => {
    it('reprend les tarifs du catalogue kernel', () => {
        const [monthly, quarterly, yearly] = BOOST_PLANS;

        // Catalogue kernel : 1 000 XAF/mois, 10 000 XAF/an
        expect(getBoostTotalPrice(monthly!)).toBe(1_000);
        expect(getBoostTotalPrice(yearly!)).toBe(10_000);
        // Palier intermédiaire propre à BusinessBook (absent du kernel)
        expect(getBoostTotalPrice(quarterly!)).toBe(2_800);
    });

    it('dérive la remise affichée du prix réel', () => {
        const [monthly, quarterly, yearly] = BOOST_PLANS;

        expect(getBoostDiscountPercent(monthly!)).toBe(0);
        // 3 000 -> 2 800 = -6,67 % arrondi à 7 %
        expect(getBoostDiscountPercent(quarterly!)).toBe(7);
        // 12 000 -> 10 000 = -16,67 % arrondi à 17 %
        expect(getBoostDiscountPercent(yearly!)).toBe(17);

        expect(getBoostMonthlyEquivalent(yearly!)).toBe(833);
    });
});

describe('Tarification Publicités', () => {
    it('calcule le montant selon emplacement et durée', () => {
        // POPUP 500/j × 7 jours, pas de réduction
        const q1 = getAdPriceQuote('POPUP', 7);
        expect(q1.totalPrice).toBe(3_500);
        expect(q1.discountPercent).toBe(0);

        // HOME_SIDEBAR 200/j × 30 jours = 6 000, -10% → 5 400
        const q2 = getAdPriceQuote('HOME_SIDEBAR', 30);
        expect(q2.basePrice).toBe(6_000);
        expect(q2.discountAmount).toBe(600);
        expect(q2.totalPrice).toBe(5_400);
    });
});
