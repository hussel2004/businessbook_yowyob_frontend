import { post, get, put, del } from './client';
import type { AdPlacementCode } from './billing';

export interface Advertisement {
    id: string;
    organizationId: string;
    title: string;
    imageUrl: string;
    linkUrl: string;
    slot: 'HOME_HERO' | 'HOME_SIDEBAR' | 'SEARCH_SIDEBAR' | 'ORG_DETAIL_SIDEBAR';
}

/**
 * Publicité d'une organisation (réponse du backend AdvertisementController).
 */
export interface OrganizationAd {
    id: string;
    organizationId: string;
    title: string;
    description?: string;
    imageUrl?: string;
    targetUrl?: string;
    adType: string;
    startDate?: string;
    endDate?: string;
    isActive: boolean;
    impressions: number;
    clicks: number;
}

export interface CreateAdPayload {
    title: string;
    description?: string;
    imageUrl?: string;
    targetUrl?: string;
    /** Emplacement / niveau de visibilité choisi */
    adType: AdPlacementCode;
    startDate?: string;
    endDate?: string;
}

export const adsApi = {
    getAdsForSlot: async (slot: string, limit: number = 1): Promise<Advertisement[]> => {
        return get<Advertisement[]>(`/ads/slot/${slot}?limit=${limit}`);
    },

    trackImpression: async (id: string): Promise<void> => {
        return post(`/ads/${id}/impression`, {});
    },

    trackClick: async (id: string): Promise<void> => {
        return post(`/ads/${id}/click`, {});
    },

    // ============================
    // Gestion des campagnes (dashboard organisation)
    // ============================

    getOrganizationAds: async (orgId: string): Promise<OrganizationAd[]> => {
        return get<OrganizationAd[]>(`/organizations/${orgId}/ads`);
    },

    /**
     * Crée une publicité après paiement.
     * TODO(payment-api): transmettre la référence de transaction au backend
     * quand l'API de paiement sera branchée.
     */
    createAd: async (orgId: string, data: CreateAdPayload): Promise<OrganizationAd> => {
        return post<OrganizationAd>(`/organizations/${orgId}/ads`, data);
    },

    updateAd: async (
        orgId: string,
        adId: string,
        data: Partial<Pick<OrganizationAd, 'title' | 'description' | 'imageUrl' | 'targetUrl' | 'isActive' | 'endDate'>>
    ): Promise<OrganizationAd> => {
        return put<OrganizationAd>(`/organizations/${orgId}/ads/${adId}`, data);
    },

    deleteAd: async (orgId: string, adId: string): Promise<void> => {
        return del(`/organizations/${orgId}/ads/${adId}`);
    },
};
