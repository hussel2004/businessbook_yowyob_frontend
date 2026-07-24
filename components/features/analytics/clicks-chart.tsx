'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { AnalyticsDaily } from '@/types/analytics';

interface ClicksChartProps {
    data: AnalyticsDaily[];
    isLoading?: boolean;
}

export function ClicksChart({ data, isLoading }: ClicksChartProps) {
    if (isLoading) {
        return (
            <div className="flex h-80 items-center justify-center rounded-xl border bg-card">
                <div className="h-full w-full animate-pulse bg-muted" />
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="flex h-80 items-center justify-center rounded-xl border bg-card">
                <p className="text-muted-foreground">Aucune donnée disponible</p>
            </div>
        );
    }

    const chartData = data.map((item) => ({
        ...item,
        dateFormatted: format(parseISO(item.date), 'd MMM', { locale: fr }),
        totalClicks:
            item.phoneClicks +
            item.websiteClicks +
            item.whatsappClicks +
            item.directionsClicks +
            item.emailClicks,
    }));

    return (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Clics par jour</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            className="stroke-muted"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="dateFormatted"
                            tick={{ fontSize: 12 }}
                            className="fill-muted-foreground"
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            className="fill-muted-foreground"
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            }}
                            labelStyle={{ fontWeight: 600 }}
                        />
                        <Legend />
                        <Bar
                            dataKey="phoneClicks"
                            name="Téléphone"
                            fill="hsl(142, 76%, 36%)"
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            dataKey="websiteClicks"
                            name="Site web"
                            fill="hsl(217, 91%, 60%)"
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            dataKey="whatsappClicks"
                            name="WhatsApp"
                            fill="hsl(142, 70%, 45%)"
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            dataKey="directionsClicks"
                            name="Itinéraire"
                            fill="hsl(25, 95%, 53%)"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
