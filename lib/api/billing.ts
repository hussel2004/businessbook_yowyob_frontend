import { get, post } from './client';

/**
 * Tarifs et paiements — servis par le backend, qui les relaie au kernel.
 *
 * Le frontend n'envoie jamais de montant : il choisit une formule ou un
 * emplacement, le serveur recalcule le prix. Le catalogue ci-dessous ne sert
 * qu'à l'affichage.
 */

export type BoostPlanCode = 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

export type AdPlacementCode =
    | 'POPUP'
    | 'HOME_HERO'
    | 'HOME_SIDEBAR'
    | 'SEARCH_SIDEBAR'
    | 'ORG_DETAIL_SIDEBAR';

export type PaymentMethod = 'MOBILE_MONEY' | 'CARD';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';

export interface BoostPlanOffer {
    plan: BoostPlanCode;
    months: number;
    totalPrice: number;
    discountPercent: number;
    monthlyEquivalent: number;
}

export interface AdPlacementOffer {
    placement: AdPlacementCode;
    dailyRate: number;
    visibilityLevel: number;
}

export interface AdDurationOffer {
    days: number;
    discountPercent: number;
}

export interface BillingCatalog {
    currency: string;
    boostPlans: BoostPlanOffer[];
    adPlacements: AdPlacementOffer[];
    adDurations: AdDurationOffer[];
}

export interface CheckoutResponse {
    paymentOrderId: string;
    /** Page de paiement du fournisseur — y rediriger l'utilisateur */
    redirectUrl: string | null;
    status: PaymentStatus;
    amount: number;
    currency: string;
}

export interface AdCheckoutResponse extends CheckoutResponse {
    advertisementId: string;
}

export interface BoostSubscription {
    id: string;
    organizationId: string;
    billingCycle: BoostPlanCode;
    amountPaid: number;
    currency: string;
    status: 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'FAILED' | 'CANCELLED';
    active: boolean;
    startedAt?: string;
    expiresAt?: string;
}

export const billingApi = {
    /** Catalogue tarifaire (public). */
    getCatalog: async (): Promise<BillingCatalog> => {
        return get<BillingCatalog>('/public/billing/catalog');
    },

    // ============================
    // Boost
    // ============================

    getBoostSubscription: async (orgId: string): Promise<BoostSubscription | null> => {
        // 204 quand l'organisation n'a jamais souscrit
        const data = await get<BoostSubscription | ''>(`/organizations/${orgId}/boost`);
        return data ? (data as BoostSubscription) : null;
    },

    checkoutBoost: async (
        orgId: string,
        params: { plan: BoostPlanCode; method: PaymentMethod; payerReference: string }
    ): Promise<CheckoutResponse> => {
        return post<CheckoutResponse>(`/organizations/${orgId}/boost/checkout`, params);
    },

    /** Relit le statut auprès du fournisseur et active l'abonnement si le paiement a abouti. */
    confirmBoost: async (orgId: string, paymentOrderId: string): Promise<BoostSubscription> => {
        return post<BoostSubscription>(`/organizations/${orgId}/boost/confirm/${paymentOrderId}`, {});
    },

    // ============================
    // Publicités
    // ============================

    checkoutAd: async (
        orgId: string,
        params: {
            title: string;
            description?: string;
            imageUrl?: string;
            targetUrl: string;
            placement: AdPlacementCode;
            days: number;
            method: PaymentMethod;
            payerReference: string;
        }
    ): Promise<AdCheckoutResponse> => {
        return post<AdCheckoutResponse>(`/organizations/${orgId}/ads/checkout`, params);
    },

    confirmAd: async (orgId: string, paymentOrderId: string): Promise<unknown> => {
        return post(`/organizations/${orgId}/ads/confirm/${paymentOrderId}`, {});
    },
};
