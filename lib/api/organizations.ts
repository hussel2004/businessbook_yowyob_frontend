import { post, get, upload } from './client';
import { ENDPOINTS } from './endpoints';

export interface CreateOrganizationRequest {
    longName: string;
    shortName: string;
    description?: string;
    logoUrl?: string; // We might upload first then pass URL, or handle internally
    websiteUrl?: string;
    categoryId: string;
    keywords?: string; // Comma separated
    // Add other fields as per backend DTO
}

export interface CreateOrganizationResponse {
    id: string;
    slug: string;
}

export async function createOrganization(data: CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
    return post(ENDPOINTS.ORGANIZATIONS.BASE, data);
}

export async function getSimilarOrganizations(id: string, limit: number = 3): Promise<any[]> {
    return get(`${ENDPOINTS.ORGANIZATIONS.BASE}/${id}/similar?limit=${limit}`);
}

export async function getMyOrganizations(): Promise<any[]> {
    return get(ENDPOINTS.ORGANIZATIONS.MY);
}
// Helper to upload logo and return URL (if backend returns URL)
export async function uploadOrganizationLogo(file: File): Promise<{ url: string }> {
    // Assuming a generic upload endpoint or specific one
    // We don't have a specific 'upload logo' endpoint in ENDPOINTS.MEDIA yet
    // but typically it's POST /media
    // ENDPOINTS.MEDIA.BY_ID is GET.
    // Let's assume generic media upload returns an ID or URL.
    // For now, let's mock or use the avatar/media logic.
    // If we use 'upload' helper to '/api/media', it returns Media object.

    // Placeholder to use generic endpoint
    return upload('/media', file);
}
