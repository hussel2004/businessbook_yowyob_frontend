'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { format, subDays } from 'date-fns';
import { getOrganizationBySlug } from '@/lib/api/public';
import { getAnalyticsSummary, getAnalyticsDaily } from '@/lib/api/analytics';
import {
    StatsGrid,
    ViewsChart,
    ClicksChart,
    ClicksPieChart,
    DateRangePicker,
} from '@/components/features/analytics';
import { BarChart3, TrendingUp, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DateRangeOption, AnalyticsSummary, AnalyticsDailyResponse } from '@/types/analytics';

export default function OrganizationAnalyticsPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [dateRange, setDateRange] = useState<DateRangeOption>('30d');
    const [dateFrom, setDateFrom] = useState(() =>
        format(subDays(new Date(), 30), 'yyyy-MM-dd')
    );
    const [dateTo, setDateTo] = useState(() =>
        format(new Date(), 'yyyy-MM-dd')
    );

    // Get organization info first
    const { data: org, isLoading: orgLoading } = useQuery({
        queryKey: ['organization', slug],
        queryFn: () => getOrganizationBySlug(slug),
    });

    // Get analytics summary
    const { data: summary, isLoading: summaryLoading } = useQuery({
        queryKey: ['analytics-summary', org?.id, dateFrom, dateTo],
        queryFn: () => getAnalyticsSummary(org!.id, dateFrom, dateTo),
        enabled: !!org?.id,
    });

    // Get daily analytics
    const { data: dailyData, isLoading: dailyLoading } = useQuery({
        queryKey: ['analytics-daily', org?.id, dateFrom, dateTo],
        queryFn: () => getAnalyticsDaily(org!.id, dateFrom, dateTo),
        enabled: !!org?.id,
    });

    const handleDateRangeChange = (value: DateRangeOption, from: string, to: string) => {
        setDateRange(value);
        setDateFrom(from);
        setDateTo(to);
    };

    if (orgLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    if (!org) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Entreprise non trouvée</p>
            </div>
        );
    }

    // Create default/mock data for display when no real data
    const defaultSummary: AnalyticsSummary = summary || {
        organizationId: org.id,
        totalViews: 0,
        totalClicks: 0,
        totalSearchImpressions: 0,
        uniqueVisitors: 0,
        phoneClicks: 0,
        websiteClicks: 0,
        whatsappClicks: 0,
        directionsClicks: 0,
        emailClicks: 0,
        profileViews: 0,
        periodStart: dateFrom,
        periodEnd: dateTo,
    };

    const defaultDailyData = dailyData?.data || [];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <BarChart3 className="h-6 w-6 text-primary" />
                        Statistiques
                    </h1>
                    <p className="text-muted-foreground">
                        Analysez les performances de votre entreprise
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <DateRangePicker
                        value={dateRange}
                        onChange={handleDateRangeChange}
                    />
                    <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Exporter</span>
                    </Button>
                </div>
            </div>

            {/* Summary Stats */}
            <StatsGrid data={defaultSummary} isLoading={summaryLoading} />

            {/* Charts Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Views Chart */}
                <ViewsChart data={defaultDailyData} isLoading={dailyLoading} />

                {/* Clicks Pie Chart */}
                <ClicksPieChart data={defaultSummary} isLoading={summaryLoading} />
            </div>

            {/* Clicks Chart (Full Width) */}
            <ClicksChart data={defaultDailyData} isLoading={dailyLoading} />

            {/* Info Banner */}
            <div className="rounded-xl border bg-gradient-to-r from-primary/5 to-primary/10 p-6">
                <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold">Conseil pour améliorer vos statistiques</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Ajoutez des photos de qualité, répondez aux avis clients et publiez régulièrement
                            des posts pour augmenter votre visibilité et attirer plus de visiteurs.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
