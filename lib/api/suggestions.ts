import { post, get, del } from './client';

// Types
export interface Suggestion {
    id: string;
    organizationId: string;
    senderName: string;
    senderEmail?: string;
    category: 'amelioration' | 'produit' | 'service' | 'autre';
    content: string;
    status: 'new' | 'read' | 'noted' | 'done';
    createdAt: string;
}

export interface CreateSuggestionData {
    senderName: string;
    senderEmail?: string;
    category?: string;
    content: string;
}

// API Functions

/**
 * Submit a suggestion to an organization (public, no auth required)
 */
export async function createSuggestion(
    orgId: string,
    data: CreateSuggestionData
): Promise<Suggestion> {
    return post(`/organizations/${orgId}/suggestions`, data);
}

/**
 * Get suggestions for an organization (owner only)
 */
export async function getOrganizationSuggestions(
    orgId: string,
    params?: { page?: number; size?: number; status?: string }
): Promise<{ content: Suggestion[]; totalElements: number }> {
    const response = await get<any>(`/organizations/${orgId}/suggestions`, params);
    if (Array.isArray(response)) {
        return { content: response, totalElements: response.length };
    }
    return response;
}

/**
 * Get new suggestions count for an organization
 */
export async function getNewSuggestionsCount(orgId: string): Promise<{ count: number }> {
    return get(`/organizations/${orgId}/suggestions/count`);
}

/**
 * Mark a suggestion as read
 */
export async function markSuggestionAsRead(id: string): Promise<Suggestion> {
    return post(`/suggestions/${id}/read`, {});
}

/**
 * Mark a suggestion as noted (pris en compte)
 */
export async function markSuggestionAsNoted(id: string): Promise<Suggestion> {
    return post(`/suggestions/${id}/noted`, {});
}

/**
 * Mark a suggestion as done (traitée)
 */
export async function markSuggestionAsDone(id: string): Promise<Suggestion> {
    return post(`/suggestions/${id}/done`, {});
}

/**
 * Delete a suggestion
 */
export async function deleteSuggestion(id: string): Promise<void> {
    return del(`/suggestions/${id}`);
}
