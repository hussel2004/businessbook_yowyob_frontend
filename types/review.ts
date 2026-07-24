import type { BaseEntity } from './api';

/**
 * Review response
 */
export interface Review extends BaseEntity {
    organizationId: string;
    authorId: string;
    authorName: string;
    authorAvatarUrl?: string;
    rating: number;
    title?: string;
    content?: string;
    pros?: string;
    cons?: string;
    visitDate?: string;
    isAnonymous: boolean;
    isVerifiedPurchase: boolean;
    helpfulCount: number;
    unhelpfulCount: number;
    hasOwnerResponse: boolean;
    ownerResponse?: ReviewResponse;
    userVote?: 'helpful' | 'unhelpful' | null;
}

/**
 * Review response from owner
 */
export interface ReviewResponse {
    id: string;
    reviewId: string;
    responderId: string;
    responderName: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Review statistics
 */
export interface ReviewStats {
    totalCount: number;
    averageRating: number;
    distribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
    verifiedCount: number;
    withPhotoCount: number;
}

/**
 * Create review request
 */
export interface CreateReviewRequest {
    rating: number;
    title?: string;
    content?: string;
    pros?: string;
    cons?: string;
    visitDate?: string;
    isAnonymous?: boolean;
}

/**
 * Review vote request
 */
export interface ReviewVoteRequest {
    isHelpful: boolean;
}

/**
 * Quick rating request
 */
export interface QuickRatingRequest {
    rating: number;
}
