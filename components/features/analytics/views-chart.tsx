'use client';

import {
    LineChart,
    Line,
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

interface ViewsChartProps {
    data: AnalyticsDaily[];
    isLoading?: boolean;
}

export function ViewsChart({ data, isLoading }: ViewsChartProps) {
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
    }));

    return (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Évolution des vues</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                        <defs>
                            <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                        </defs>
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
                        <Line
                            type="monotone"
                            dataKey="views"
                            name="Vues"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6, strokeWidth: 2 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="uniqueVisitors"
                            name="Visiteurs uniques"
                            stroke="hsl(var(--secondary))"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6, strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
