/**
 * Organization API Functions
 * Dashboard management APIs for organizations
 */

import { get, post, put, del, upload } from './client';
import type {
    Organization,
    Agency,
    OpeningHour,
    OrganizationMedia,
    Post,
    Promotion,
    VerificationDocument,
    Service,
    CreateAgencyInput,
    CreatePostInput,
    CreatePromotionInput,
    CreateVerificationInput,
} from '@/types/organization';

// ============================================
// Organizations
// ============================================

export async function getMyOrganizations(): Promise<Organization[]> {
    return get<Organization[]>('/organizations/my');
}

export async function getOrganization(id: string): Promise<Organization> {
    return get<Organization>(`/organizations/${id}`);
}

export async function updateOrganization(id: string, data: Partial<Organization>): Promise<Organization> {
    return put<Organization>(`/organizations/${id}`, data);
}

// ============================================
// Agencies
// ============================================

export async function getAgencies(organizationId: string): Promise<Agency[]> {
    return get<Agency[]>(`/organizations/${organizationId}/agencies`);
}

export async function getAgency(agencyId: string): Promise<Agency> {
    return get<Agency>(`/organizations/agencies/${agencyId}`);
}

export async function createAgency(organizationId: string, data: CreateAgencyInput): Promise<Agency> {
    return post<Agency>(`/organizations/${organizationId}/agencies`, data);
}

export async function updateAgency(agencyId: string, data: Partial<CreateAgencyInput>): Promise<Agency> {
    return put<Agency>(`/organizations/agencies/${agencyId}`, data);
}

export async function deleteAgency(agencyId: string): Promise<void> {
    return del(`/organizations/agencies/${agencyId}`);
}

// ============================================
// Opening Hours
// ============================================

export async function getOpeningHours(agencyId: string): Promise<OpeningHour[]> {
    return get<OpeningHour[]>(`/organizations/agencies/${agencyId}/hours`);
}

export async function setOpeningHours(agencyId: string, hours: OpeningHour[]): Promise<OpeningHour[]> {
    return put<OpeningHour[]>(`/organizations/agencies/${agencyId}/hours`, hours);
}

// ============================================
// Media / Gallery
// ============================================

export async function getOrganizationGallery(organizationId: string): Promise<OrganizationMedia[]> {
    return get<OrganizationMedia[]>(`/organizations/${organizationId}/gallery`);
}

export async function uploadMedia(organizationId: string, file: File, metadata?: Partial<OrganizationMedia>): Promise<OrganizationMedia> {
    return upload<OrganizationMedia>(`/organizations/${organizationId}/media`, file, metadata);
}

export async function updateMedia(mediaId: string, data: Partial<OrganizationMedia>): Promise<OrganizationMedia> {
    return put<OrganizationMedia>(`/media/${mediaId}`, data);
}

export async function setMediaAsCover(mediaId: string): Promise<OrganizationMedia> {
    return post<OrganizationMedia>(`/media/${mediaId}/cover`);
}

export async function reorderMedia(type: string, ownerId: string, mediaIds: string[]): Promise<void> {
    return post(`/media/reorder?type=${type}&ownerId=${ownerId}`, { mediaIds });
}

export async function deleteMedia(mediaId: string): Promise<void> {
    return del(`/media/${mediaId}`);
}

// ============================================
// Posts
// ============================================

export async function getOrganizationPosts(organizationId: string, params?: { status?: string; page?: number; size?: number }): Promise<{ content: Post[]; totalElements: number; totalPages: number }> {
    return get(`/organizations/${organizationId}/posts`, params);
}

export async function getPost(postId: string): Promise<Post> {
    return get<Post>(`/posts/${postId}`);
}

export async function createPost(organizationId: string, data: CreatePostInput): Promise<Post> {
    return post<Post>(`/organizations/${organizationId}/posts`, data);
}

export async function updatePost(postId: string, data: Partial<CreatePostInput>): Promise<Post> {
    return put<Post>(`/posts/${postId}`, data);
}

export async function publishPost(postId: string): Promise<Post> {
    return post<Post>(`/posts/${postId}/publish`);
}

export async function archivePost(postId: string): Promise<Post> {
    return post<Post>(`/posts/${postId}/archive`);
}

export async function deletePost(postId: string): Promise<void> {
    return del(`/posts/${postId}`);
}

// ============================================
// Promotions
// ============================================

export async function getOrganizationPromotions(organizationId: string, params?: { page?: number; size?: number }): Promise<{ content: Promotion[]; totalElements: number; totalPages: number }> {
    return get(`/organizations/${organizationId}/promotions`, params);
}

export async function getPromotion(promotionId: string): Promise<Promotion> {
    return get<Promotion>(`/promotions/${promotionId}`);
}

export async function createPromotion(organizationId: string, data: CreatePromotionInput): Promise<Promotion> {
    return post<Promotion>(`/organizations/${organizationId}/promotions`, data);
}

export async function updatePromotion(promotionId: string, data: Partial<CreatePromotionInput>): Promise<Promotion> {
    return put<Promotion>(`/promotions/${promotionId}`, data);
}

export async function activatePromotion(promotionId: string): Promise<Promotion> {
    return post<Promotion>(`/promotions/${promotionId}/activate`);
}

export async function pausePromotion(promotionId: string): Promise<Promotion> {
    return post<Promotion>(`/promotions/${promotionId}/pause`);
}

export async function deletePromotion(promotionId: string): Promise<void> {
    return del(`/promotions/${promotionId}`);
}

// ============================================
// Services
// ============================================

export async function getOrganizationServices(organizationId: string): Promise<Service[]> {
    return get<Service[]>(`/organizations/${organizationId}/services`);
}

export async function createService(organizationId: string, data: Partial<Service>): Promise<Service> {
    return post<Service>(`/organizations/${organizationId}/services`, data);
}

export async function updateService(serviceId: string, data: Partial<Service>): Promise<Service> {
    return put<Service>(`/services/${serviceId}`, data);
}

export async function deleteService(serviceId: string): Promise<void> {
    return del(`/services/${serviceId}`);
}

// ============================================
// Verification
// ============================================

export async function getVerificationDocuments(organizationId: string): Promise<VerificationDocument[]> {
    return get<VerificationDocument[]>(`/organizations/${organizationId}/verification`);
}

export async function submitVerificationDocument(organizationId: string, data: CreateVerificationInput): Promise<VerificationDocument> {
    return post<VerificationDocument>(`/organizations/${organizationId}/verification`, data);
}

export async function deleteVerificationDocument(documentId: string): Promise<void> {
    return del(`/verification/${documentId}`);
}

export async function checkOrganizationVerified(organizationId: string): Promise<{ verified: boolean }> {
    return get<{ verified: boolean }>(`/organizations/${organizationId}/verified`);
}
