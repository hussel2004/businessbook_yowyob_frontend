import { post, get, del } from './client';
import { ENDPOINTS } from './endpoints';

// Types
export interface Review {
    id: string;
    organizationId: string;
    userId: string;
    userName: string;
    userAvatarUrl?: string;
    rating: number;
    title: string;
    content: string;
    pros?: string;
    cons?: string;
    visitDate?: string;
    isAnonymous?: boolean;
    helpfulCount: number;
    unhelpfulCount: number;
    userVote?: 'helpful' | 'unhelpful' | null;
    response?: ReviewResponse;
    status: 'pending' | 'published' | 'hidden' | 'flagged';
    createdAt: string;
    updatedAt: string;
}

export interface ReviewResponse {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface ReviewSummary {
    averageRating: number;
    totalReviews: number;
    distribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
}

export interface CreateReviewRequest {
    title: string;
    content: string;
    rating: number;
    pros?: string;
    cons?: string;
    visitDate?: string;
    isAnonymous?: boolean;
}

export interface ReportReviewRequest {
    reason: 'spam' | 'offensive' | 'fake' | 'inappropriate' | 'other';
    details?: string;
}

// API Functions

/**
 * Get reviews for an organization with pagination
 */
export async function getOrganizationReviews(
    orgId: string,
    params?: { page?: number; size?: number; sort?: string }
): Promise<{ content: Review[]; totalPages: number; totalElements: number }> {
    return get(`/organizations/${orgId}/reviews`, params);
}

/**
 * Get review summary (stats) for an organization
 */
export async function getReviewSummary(orgId: string): Promise<ReviewSummary> {
    const response = await get<any>(`/organizations/${orgId}/reviews/stats`);
    return {
        averageRating: response.averageRating,
        totalReviews: response.totalReviews,
        distribution: {
            1: response.rating1Count,
            2: response.rating2Count,
            3: response.rating3Count,
            4: response.rating4Count,
            5: response.rating5Count,
        }
    };
}

/**
 * Create a new review
 */
export async function createReview(
    orgId: string,
    data: CreateReviewRequest
): Promise<Review> {
    const url = ENDPOINTS.ORGANIZATIONS.REVIEWS(orgId);
    // Map frontend request to backend expected format
    return post(url, {
        reviewableType: 'organization',
        reviewableId: orgId,
        rating: data.rating,
        title: data.title,
        content: data.content,
        isVerifiedPurchase: false,
        visitDate: data.visitDate || null
    });
}

/**
 * Check if user has already reviewed an organization
 */
export async function hasUserReviewed(orgId: string): Promise<{ hasReviewed: boolean }> {
    return get(ENDPOINTS.ORGANIZATIONS.HAS_REVIEWED(orgId));
}

/**
 * Vote on a review (helpful/unhelpful)
 */
export async function voteOnReview(
    reviewId: string,
    vote: 'helpful' | 'unhelpful'
): Promise<{ helpfulCount: number; unhelpfulCount: number }> {
    return post(`/reviews/${reviewId}/vote`, { vote });
}

/**
 * Remove vote from a review
 */
export async function removeVote(reviewId: string): Promise<void> {
    return del(`/reviews/${reviewId}/vote`);
}

/**
 * Report a review
 */
export async function reportReview(
    reviewId: string,
    data: ReportReviewRequest
): Promise<void> {
    return post(`/reviews/${reviewId}/report`, data);
}

/**
 * Respond to a review (organization owner only)
 */
export async function respondToReview(
    reviewId: string,
    content: string
): Promise<ReviewResponse> {
    return post(`/reviews/${reviewId}/respond`, { content });
}

/**
 * Update a review response (organization owner only)
 */
export async function updateReviewResponse(
    reviewId: string,
    content: string
): Promise<ReviewResponse> {
    return post(`/reviews/${reviewId}/respond`, { content });
}

/**
 * Delete a review response (organization owner only)
 */
export async function deleteReviewResponse(reviewId: string): Promise<void> {
    return del(`/reviews/${reviewId}/respond`);
}

/**
 * Get reviews for owner's organization (includes flagged ones)
 */
export async function getOwnerReviews(
    orgId: string,
    params?: { page?: number; size?: number; status?: string }
): Promise<{ content: Review[]; totalPages: number; totalElements: number }> {
    return get(`/organizations/${orgId}/reviews/manage`, params);
}

