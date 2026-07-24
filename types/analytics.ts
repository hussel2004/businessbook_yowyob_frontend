/**
 * Analytics Types
 * Types for organization analytics data from the backend.
 */

export interface AnalyticsSummary {
    organizationId: string;
    totalViews: number;
    totalClicks: number;
    totalSearchImpressions: number;
    uniqueVisitors: number;
    phoneClicks: number;
    websiteClicks: number;
    whatsappClicks: number;
    directionsClicks: number;
    emailClicks: number;
    profileViews: number;
    averageTimeOnPage?: number;
    bounceRate?: number;
    periodStart: string;
    periodEnd: string;
}

export interface AnalyticsDaily {
    date: string;
    views: number;
    clicks: number;
    searchImpressions: number;
    uniqueVisitors: number;
    phoneClicks: number;
    websiteClicks: number;
    whatsappClicks: number;
    directionsClicks: number;
    emailClicks: number;
}

export interface ClickBreakdown {
    type: string;
    count: number;
    percentage: number;
}

export interface SourceBreakdown {
    source: string;
    count: number;
    percentage: number;
}

export interface AnalyticsDailyResponse {
    organizationId: string;
    data: AnalyticsDaily[];
    periodStart: string;
    periodEnd: string;
}

export type DateRangeOption = '7d' | '30d' | '90d' | 'custom';

export interface DateRange {
    from: string;
    to: string;
}
