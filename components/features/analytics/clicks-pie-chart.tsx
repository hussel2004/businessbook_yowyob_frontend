'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import type { AnalyticsSummary } from '@/types/analytics';

interface ClicksPieChartProps {
    data: AnalyticsSummary;
    isLoading?: boolean;
}

const COLORS = [
    'hsl(142, 76%, 36%)',  // Phone - Green
    'hsl(217, 91%, 60%)',  // Website - Blue
    'hsl(142, 70%, 45%)',  // WhatsApp - Light Green
    'hsl(25, 95%, 53%)',   // Directions - Orange
    'hsl(280, 67%, 51%)',  // Email - Purple
];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = (props: PieLabelRenderProps) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;

    // Handle optional values
    if (
        typeof cx !== 'number' ||
        typeof cy !== 'number' ||
        typeof midAngle !== 'number' ||
        typeof innerRadius !== 'number' ||
        typeof outerRadius !== 'number' ||
        typeof percent !== 'number'
    ) {
        return null;
    }

    if (percent < 0.05) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor="middle"
            dominantBaseline="central"
            className="text-xs font-medium"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export function ClicksPieChart({ data, isLoading }: ClicksPieChartProps) {
    if (isLoading) {
        return (
            <div className="flex h-80 items-center justify-center rounded-xl border bg-card">
                <div className="h-48 w-48 animate-pulse rounded-full bg-muted" />
            </div>
        );
    }

    const pieData = [
        { name: 'Téléphone', value: data.phoneClicks },
        { name: 'Site web', value: data.websiteClicks },
        { name: 'WhatsApp', value: data.whatsappClicks },
        { name: 'Itinéraire', value: data.directionsClicks },
        { name: 'Email', value: data.emailClicks },
    ].filter(item => item.value > 0);

    const totalClicks = pieData.reduce((acc, item) => acc + item.value, 0);

    if (totalClicks === 0) {
        return (
            <div className="flex h-80 items-center justify-center rounded-xl border bg-card">
                <p className="text-muted-foreground">Aucun clic enregistré</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Répartition des clics</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={100}
                            innerRadius={40}
                            fill="#8884d8"
                            dataKey="value"
                            strokeWidth={2}
                            stroke="hsl(var(--background))"
                        >
                            {pieData.map((_entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            }}
                            formatter={(value) => {
                                const numValue = typeof value === 'number' ? value : 0;
                                return [`${numValue} clics (${((numValue / totalClicks) * 100).toFixed(1)}%)`];
                            }}
                        />
                        <Legend
                            layout="vertical"
                            align="right"
                            verticalAlign="middle"
                            iconType="circle"
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
