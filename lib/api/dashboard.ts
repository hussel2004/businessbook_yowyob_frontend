import { get } from './client';
import { ENDPOINTS } from './endpoints';
import type { OrganizationSummary } from './public';

export interface DashboardStats {
    organizationCount: number;
    favoritesCount: number;
    unreadNotifications: number;
    totalReviews: number;
    firstOrganizationId?: string;
}

export async function getDashboardStats(): Promise<DashboardStats> {
    // Parallel fetching for dashboard overview
    const [orgs, favoritesCount, notificationsCount] = await Promise.all([
        get<any[]>(ENDPOINTS.ORGANIZATIONS.MY),
        get<{ count: number }>(ENDPOINTS.FAVORITES.COUNT).then(res => res.count).catch(() => 0),
        get<{ count: number }>(ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT).then(res => res.count).catch(() => 0),
    ]);

    // Mocking reviews count for now until we have an aggregation endpoint
    // or calculate from orgs (if orgs response includes reviewCount)
    const totalReviews = orgs?.reduce((acc: number, org: any) => acc + (org.reviewCount || 0), 0) || 0;

    return {
        organizationCount: orgs?.length || 0,
        favoritesCount,
        unreadNotifications: notificationsCount,
        totalReviews,
        firstOrganizationId: orgs?.[0]?.id,
    };
}
