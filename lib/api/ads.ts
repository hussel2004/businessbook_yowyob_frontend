import { post, get } from './client';

export interface Advertisement {
    id: string;
    organizationId: string;
    title: string;
    imageUrl: string;
    linkUrl: string;
    slot: 'HOME_HERO' | 'HOME_SIDEBAR' | 'SEARCH_SIDEBAR' | 'ORG_DETAIL_SIDEBAR';
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

    createCampaign: async (data: any): Promise<Advertisement> => {
        return post('/ads', data);
    }
};
