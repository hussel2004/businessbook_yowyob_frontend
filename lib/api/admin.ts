/**
 * Admin API functions
 * For SUPER_ADMIN operations
 */

import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type {
    AdminDashboardStats,
    VerificationRequest,
    VerificationListResponse,
    ApproveVerificationRequest,
    RejectVerificationRequest,
    AdminUser,
    AdminUserListResponse,
    SuspendUserRequest,
    AdminOrganization,
    AdminOrganizationListResponse,
    AdminCategory,
    CategoryFormData,
    ContentReport,
    ReportListResponse,
    ResolveReportRequest,
    ChartDataPoint,
    DistributionItem,
} from '@/types/admin';

// ============================
// Dashboard
// ============================

/**
 * Get admin dashboard stats
 */
export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
    const response = await apiClient.get<AdminDashboardStats>('/admin/dashboard/stats');
    return response.data;
}

/**
 * Get new signups chart data
 */
export async function getSignupsChartData(days: number = 30): Promise<ChartDataPoint[]> {
    const response = await apiClient.get<ChartDataPoint[]>('/admin/dashboard/signups', {
        params: { days }
    });
    return response.data;
}

/**
 * Get category distribution
 */
export async function getCategoryDistribution(): Promise<DistributionItem[]> {
    const response = await apiClient.get<DistributionItem[]>('/admin/dashboard/categories');
    return response.data;
}

/**
 * Get city distribution
 */
export async function getCityDistribution(): Promise<DistributionItem[]> {
    const response = await apiClient.get<DistributionItem[]>('/admin/dashboard/cities');
    return response.data;
}

// ============================
// Verifications
// ============================

/**
 * Get pending verifications
 */
export async function getPendingVerifications(params?: {
    page?: number;
    size?: number;
    status?: string;
}): Promise<VerificationListResponse> {
    const response = await apiClient.get<VerificationListResponse>(ENDPOINTS.ADMIN.VERIFICATIONS, {
        params
    });
    return response.data;
}

/**
 * Get verification count
 */
export async function getVerificationCount(): Promise<{ count: number }> {
    const response = await apiClient.get<{ count: number }>(ENDPOINTS.ADMIN.VERIFICATIONS_COUNT);
    return response.data;
}

/**
 * Get single verification
 */
export async function getVerification(id: string): Promise<VerificationRequest> {
    const response = await apiClient.get<VerificationRequest>(`/admin/verifications/${id}`);
    return response.data;
}

/**
 * Approve verification
 */
export async function approveVerification(
    id: string,
    data?: ApproveVerificationRequest
): Promise<VerificationRequest> {
    const response = await apiClient.post<VerificationRequest>(
        ENDPOINTS.ADMIN.APPROVE(id),
        data || {}
    );
    return response.data;
}

/**
 * Reject verification
 */
export async function rejectVerification(
    id: string,
    data: RejectVerificationRequest
): Promise<VerificationRequest> {
    const response = await apiClient.post<VerificationRequest>(
        ENDPOINTS.ADMIN.REJECT(id),
        data
    );
    return response.data;
}

// ============================
// Users
// ============================

/**
 * Get all users (admin)
 */
export async function getAdminUsers(params?: {
    page?: number;
    size?: number;
    search?: string;
    role?: string;
    status?: string;
}): Promise<AdminUserListResponse> {
    const response = await apiClient.get<AdminUserListResponse>('/admin/users', { params });
    return response.data;
}

/**
 * Get user details (admin)
 */
export async function getAdminUser(id: string): Promise<AdminUser> {
    const response = await apiClient.get<AdminUser>(`/admin/users/${id}`);
    return response.data;
}

/**
 * Suspend user
 */
export async function suspendUser(id: string, data: SuspendUserRequest): Promise<AdminUser> {
    const response = await apiClient.post<AdminUser>(`/admin/users/${id}/suspend`, data);
    return response.data;
}

/**
 * Reactivate user
 */
export async function reactivateUser(id: string): Promise<AdminUser> {
    const response = await apiClient.post<AdminUser>(`/admin/users/${id}/reactivate`);
    return response.data;
}

/**
 * Update user role (promote/demote)
 */
export async function updateUserRole(id: string, role: string): Promise<AdminUser> {
    const response = await apiClient.patch<AdminUser>(`/admin/users/${id}/role`, { role });
    return response.data;
}

/**
 * Manually verify user email
 */
export async function verifyUserEmail(id: string): Promise<AdminUser> {
    const response = await apiClient.post<AdminUser>(`/admin/users/${id}/verify-email`);
    return response.data;
}

/**
 * Delete user
 */
export async function deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/admin/users/${id}`);
}

// ============================
// Organizations
// ============================

/**
 * Get all organizations (admin)
 */
export async function getAdminOrganizations(params?: {
    page?: number;
    size?: number;
    search?: string;
    status?: string;
    verified?: boolean;
    category?: string;
}): Promise<AdminOrganizationListResponse> {
    const response = await apiClient.get<AdminOrganizationListResponse>('/admin/organizations', { params });
    return response.data;
}

/**
 * Quick verify organization
 */
export async function quickVerifyOrganization(id: string): Promise<AdminOrganization> {
    const response = await apiClient.post<AdminOrganization>(`/admin/organizations/${id}/verify`);
    return response.data;
}

/**
 * Remove verification from organization
 */
export async function unverifyOrganization(id: string): Promise<AdminOrganization> {
    const response = await apiClient.delete<AdminOrganization>(`/admin/organizations/${id}/verify`);
    return response.data;
}

/**
 * Suspend organization
 */
export async function suspendOrganization(id: string, reason: string): Promise<AdminOrganization> {
    const response = await apiClient.post<AdminOrganization>(`/admin/organizations/${id}/suspend`, { reason });
    return response.data;
}

/**
 * Grant Business Booster to organization
 */
export async function boostOrganization(id: string, days?: number): Promise<void> {
    await apiClient.post(`/admin/organizations/${id}/boost`, { days });
}

// ============================
// Categories
// ============================

/**
 * Get all categories (admin)
 */
export async function getAdminCategories(): Promise<AdminCategory[]> {
    const response = await apiClient.get<AdminCategory[]>('/admin/categories');
    return response.data;
}

/**
 * Create category
 */
export async function createCategory(data: CategoryFormData): Promise<AdminCategory> {
    const response = await apiClient.post<AdminCategory>('/admin/categories', data);
    return response.data;
}

/**
 * Update category
 */
export async function updateCategory(id: string, data: CategoryFormData): Promise<AdminCategory> {
    const response = await apiClient.put<AdminCategory>(`/admin/categories/${id}`, data);
    return response.data;
}

/**
 * Delete category
 */
export async function deleteCategory(id: string): Promise<void> {
    await apiClient.delete(`/admin/categories/${id}`);
}

/**
 * Reorder categories
 */
export async function reorderCategories(
    orders: { id: string; displayOrder: number }[]
): Promise<void> {
    await apiClient.post('/admin/categories/reorder', { orders });
}

// ============================
// Reports / Moderation
// ============================

/**
 * Get content reports
 */
export async function getContentReports(params?: {
    page?: number;
    size?: number;
    type?: string;
    status?: string;
}): Promise<ReportListResponse> {
    const response = await apiClient.get<ReportListResponse>('/admin/reports', { params });
    return response.data;
}

/**
 * Get single report
 */
export async function getReport(id: string): Promise<ContentReport> {
    const response = await apiClient.get<ContentReport>(`/admin/reports/${id}`);
    return response.data;
}

/**
 * Resolve report
 */
export async function resolveReport(id: string, data: ResolveReportRequest): Promise<ContentReport> {
    const response = await apiClient.post<ContentReport>(`/admin/reports/${id}/resolve`, data);
    return response.data;
}

/**
 * Get pending reports count
 */
export async function getPendingReportsCount(): Promise<{ count: number }> {
    const response = await apiClient.get<{ count: number }>('/admin/reports/count');
    return response.data;
}
/**
 * Reindex all organizations (Search)
 */
export async function reindexOrganizations(): Promise<{ indexedCount: number; message: string }> {
    const response = await apiClient.post<{ indexedCount: number; message: string }>('/search/reindex');
    return response.data;
}
