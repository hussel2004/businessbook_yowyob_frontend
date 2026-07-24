'use client';

import { cn } from '@/lib/utils/cn';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon?: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

export function StatsCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    className,
}: StatsCardProps) {
    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md',
                className
            )}
        >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />

            <div className="relative">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    {Icon && (
                        <div className="rounded-full bg-primary/10 p-2">
                            <Icon className="h-4 w-4 text-primary" />
                        </div>
                    )}
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                    <p className="text-3xl font-bold tracking-tight">{value}</p>
                    {trend && (
                        <span
                            className={cn(
                                'text-xs font-medium',
                                trend.isPositive ? 'text-green-600' : 'text-red-600'
                            )}
                        >
                            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                        </span>
                    )}
                </div>

                {description && (
                    <p className="mt-1 text-xs text-muted-foreground">{description}</p>
                )}
            </div>
        </div>
    );
}
