'use client';

import { StatsCard } from './stats-card';
import { Eye, MousePointer, Search, Users, Phone, Globe, MessageCircle, MapPin, Mail } from 'lucide-react';
import type { AnalyticsSummary } from '@/types/analytics';

interface StatsGridProps {
    data: AnalyticsSummary;
    isLoading?: boolean;
}

export function StatsGrid({ data, isLoading }: StatsGridProps) {
    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
                ))}
            </div>
        );
    }

    const mainStats = [
        {
            title: 'Vues totales',
            value: (data.totalViews || 0).toLocaleString('fr-FR'),
            description: 'Nombre total de vues de profil',
            icon: Eye,
        },
        {
            title: 'Clics totaux',
            value: (data.totalClicks || 0).toLocaleString('fr-FR'),
            description: 'Interactions avec votre entreprise',
            icon: MousePointer,
        },
        {
            title: 'Impressions recherche',
            value: (data.totalSearchImpressions || 0).toLocaleString('fr-FR'),
            description: 'Apparitions dans les résultats',
            icon: Search,
        },
        {
            title: 'Visiteurs uniques',
            value: (data.uniqueVisitors || 0).toLocaleString('fr-FR'),
            description: 'Personnes différentes',
            icon: Users,
        },
    ];

    const clickStats = [
        {
            title: 'Clics téléphone',
            value: (data.phoneClicks || 0).toLocaleString('fr-FR'),
            icon: Phone,
        },
        {
            title: 'Clics site web',
            value: (data.websiteClicks || 0).toLocaleString('fr-FR'),
            icon: Globe,
        },
        {
            title: 'Clics WhatsApp',
            value: (data.whatsappClicks || 0).toLocaleString('fr-FR'),
            icon: MessageCircle,
        },
        {
            title: 'Clics itinéraire',
            value: (data.directionsClicks || 0).toLocaleString('fr-FR'),
            icon: MapPin,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Main Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {mainStats.map((stat) => (
                    <StatsCard key={stat.title} {...stat} />
                ))}
            </div>

            {/* Click Breakdown */}
            <div>
                <h3 className="mb-4 text-lg font-semibold">Détails des clics</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {clickStats.map((stat) => (
                        <StatsCard key={stat.title} {...stat} />
                    ))}
                </div>
            </div>
        </div>
    );
}
