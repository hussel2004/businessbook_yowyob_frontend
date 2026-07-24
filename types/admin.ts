import type { BaseEntity, PageResponse } from './api';
import type { User } from './user';
import type { Organization } from './organization';

/**
 * Verification status types
 */
export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

/**
 * Verification document types
 */
export type DocumentType =
    | 'BUSINESS_LICENSE'
    | 'TAX_CERTIFICATE'
    | 'ID_CARD'
    | 'UTILITY_BILL'
    | 'REGISTRATION_CERTIFICATE'
    | 'OTHER';

/**
 * Verification request from organization
 */
export interface VerificationRequest extends BaseEntity {
    organizationId: string;
    organizationName: string;
    organizationSlug?: string;
    documentType: DocumentType;
    documentUrl: string;
    status: VerificationStatus;
    notes?: string;
    submittedAt: string;
    reviewedAt?: string;
    reviewedBy?: string;
    rejectionReason?: string;
}

/**
 * Admin verification list response
 */
export type VerificationListResponse = PageResponse<VerificationRequest>;

/**
 * Approve verification request
 */
export interface ApproveVerificationRequest {
    notes?: string;
}

/**
 * Reject verification request
 */
export interface RejectVerificationRequest {
    reason: string;
}

/**
 * Admin dashboard stats
 */
export interface AdminDashboardStats {
    totalOrganizations: number;
    verifiedOrganizations: number;
    pendingVerifications: number;
    totalUsers: number;
    totalReviews: number;
    activePromotions: number;
    newUsersThisMonth: number;
    newOrgsThisMonth: number;
    pendingReports?: number;
}

/**
 * Admin user list item
 */
export interface AdminUser extends User {
    organizationCount: number;
    reviewCount: number;
    lastLoginAt?: string;
    isSuspended: boolean;
    suspendedAt?: string;
    suspensionReason?: string;
}

/**
 * Admin user list response
 */
export type AdminUserListResponse = PageResponse<AdminUser>;

/**
 * Suspend user request
 */
export interface SuspendUserRequest {
    reason: string;
    duration?: number; // days, null = permanent
}

/**
 * Admin organization list item
 */
export interface AdminOrganization extends Organization {
    ownerEmail: string;
    ownerName: string;
    reviewCount: number;
    averageRating: number;
    viewsThisMonth: number;
}

/**
 * Admin organization list response
 */
export type AdminOrganizationListResponse = PageResponse<AdminOrganization>;

/**
 * Category management
 */
export interface AdminCategory extends BaseEntity {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    imageUrl?: string;
    color?: string;
    parentId?: string;
    parentName?: string;
    organizationCount: number;
    displayOrder: number;
    isActive: boolean;
}

/**
 * Create/Update category request
 */
export interface CategoryFormData {
    name: string;
    slug?: string;
    description?: string;
    icon?: string;
    imageUrl?: string;
    color?: string;
    parentId?: string;
    displayOrder?: number;
    isActive?: boolean;
}

/**
 * Report types
 */
export type ReportType = 'REVIEW' | 'POST' | 'ORGANIZATION' | 'USER';

/**
 * Report status
 */
export type ReportStatus = 'PENDING' | 'RESOLVED' | 'DISMISSED';

/**
 * Report reason
 */
export type ReportReason =
    | 'SPAM'
    | 'INAPPROPRIATE'
    | 'HARASSMENT'
    | 'FALSE_INFORMATION'
    | 'COPYRIGHT'
    | 'OTHER';

/**
 * Content report
 */
export interface ContentReport extends BaseEntity {
    type: ReportType;
    targetId: string;
    targetTitle?: string;
    targetContent?: string;
    reason: ReportReason;
    description?: string;
    reporterId: string;
    reporterName: string;
    status: ReportStatus;
    moderatorId?: string;
    moderatorNotes?: string;
    resolvedAt?: string;
}

/**
 * Report list response
 */
export type ReportListResponse = PageResponse<ContentReport>;

/**
 * Resolve report request
 */
export interface ResolveReportRequest {
    action: 'DELETE' | 'WARN' | 'DISMISS';
    notes?: string;
}

/**
 * Chart data for admin dashboard
 */
export interface ChartDataPoint {
    date: string;
    value: number;
    label?: string;
}

/**
 * Distribution data
 */
export interface DistributionItem {
    name: string;
    value: number;
    percentage: number;
    color?: string;
}
