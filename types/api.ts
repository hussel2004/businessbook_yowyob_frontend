/**
 * Common API types used across the application
 */

/**
 * Pagination request parameters
 */
export interface PaginationParams {
    page?: number;
    size?: number;
    sort?: string;
}

/**
 * Paginated response from the API
 */
export interface PageResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

/**
 * API Success response wrapper
 */
export interface ApiResponse<T> {
    data: T;
    message?: string;
}

/**
 * Standard error response from API
 */
export interface ErrorResponse {
    code: string;
    message: string;
    details?: Record<string, string>;
    timestamp: string;
    path: string;
}

/**
 * Generic ID response
 */
export interface IdResponse {
    id: string;
}

/**
 * Common status types
 */
export type Status = 'active' | 'inactive' | 'pending' | 'suspended' | 'deleted';

/**
 * Audit fields present on most entities
 */
export interface AuditFields {
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
    updatedBy?: string;
}

/**
 * Base entity with ID and audit fields
 */
export interface BaseEntity extends AuditFields {
    id: string;
}

/**
 * Sorting options
 */
export interface SortOption {
    field: string;
    direction: 'asc' | 'desc';
}

/**
 * Filter for search/list operations
 */
export interface BaseFilter extends PaginationParams {
    search?: string;
    status?: Status;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
}

/**
 * File upload result
 */
export interface UploadResult {
    id: string;
    url: string;
    thumbnailUrl?: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
}
