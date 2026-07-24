/**
 * Analytics API Functions
 * API calls for organization analytics data.
 */

import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { AnalyticsSummary, AnalyticsDailyResponse } from '@/types/analytics';

/**
 * Get analytics summary for an organization
 */
export async function getAnalyticsSummary(
    organizationId: string,
    startDate?: string,
    endDate?: string
): Promise<AnalyticsSummary> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const queryString = params.toString();
    const url = `${ENDPOINTS.ANALYTICS.ORGANIZATION(organizationId)}${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<AnalyticsSummary>(url);
    return response.data;
}

/**
 * Get daily analytics breakdown for an organization
 */
export async function getAnalyticsDaily(
    organizationId: string,
    startDate?: string,
    endDate?: string
): Promise<AnalyticsDailyResponse> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const queryString = params.toString();
    const url = `${ENDPOINTS.ANALYTICS.DAILY(organizationId)}${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<AnalyticsDailyResponse>(url);
    return response.data;
}

/**
 * Track a page view event
 */
export async function trackView(data: {
    organizationId: string;
    sessionId?: string;
    referrer?: string;
}): Promise<void> {
    await apiClient.post(ENDPOINTS.ANALYTICS.VIEW, data);
}

/**
 * Track a click event
 */
export async function trackClick(
    type: 'phone' | 'website' | 'whatsapp' | 'directions' | 'email',
    data: {
        organizationId: string;
        sessionId?: string;
    }
): Promise<void> {
    await apiClient.post(ENDPOINTS.ANALYTICS.CLICK(type), data);
}
