'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getOrganizationBySlug } from '@/lib/api/public';
import { getAnalyticsSummary } from '@/lib/api/analytics';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { Eye, MousePointer, Search, Users, ArrowRight, Plus, Megaphone, BarChart3 } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { cn } from '@/lib/utils/cn';

export default function OrganizationDashboardPage() {
    const params = useParams();
    const slug = params.slug as string;

    const { data: org, isLoading } = useQuery({
        queryKey: ['organization', slug],
        queryFn: () => getOrganizationBySlug(slug),
    });

    // Fetch analytics summary for the last 30 days
    const { data: analytics, isLoading: analyticsLoading } = useQuery({
        queryKey: ['analytics-summary', org?.id, '30d'],
        queryFn: () => getAnalyticsSummary(
            org!.id,
            format(subDays(new Date(), 30), 'yyyy-MM-dd'),
            format(new Date(), 'yyyy-MM-dd')
        ),
        enabled: !!org?.id,
    });

    if (isLoading) return <div>Chargement...</div>;
    if (!org) return <div>Entreprise non trouvée</div>;

    const stats = [
        { label: 'Vues', value: analytics?.totalViews ?? 0, icon: Eye, color: 'text-blue-500' },
        { label: 'Clics', value: analytics?.totalClicks ?? 0, icon: MousePointer, color: 'text-green-500' },
        { label: 'Impressions', value: analytics?.totalSearchImpressions ?? 0, icon: Search, color: 'text-purple-500' },
        { label: 'Visiteurs', value: analytics?.uniqueVisitors ?? 0, icon: Users, color: 'text-orange-500' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{org.longName}</h1>
                    <p className="text-muted-foreground">Tableau de bord de l'entreprise</p>
                </div>
                <div className="flex gap-2">
                    <Link
                        href={`/business/${org.slug}`}
                        target="_blank"
                        className={buttonVariants({ variant: 'outline' })}
                    >
                        Voir la page publique
                    </Link>
                    <Link
                        href={`/organizations/${org.slug}/edit`}
                        className={buttonVariants()}
                    >
                        Modifier les infos
                    </Link>
                </div>
            </div>

            {/* Analytics Overview */}
            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Statistiques (30 derniers jours)</h3>
                    </div>
                    <Link
                        href={`/organizations/${org.slug}/analytics`}
                        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), "gap-1")}
                    >
                        Voir tout
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
                            <div className={`rounded-full bg-background p-2 ${stat.color}`}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {analyticsLoading ? '...' : stat.value.toLocaleString('fr-FR')}
                                </p>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Quick Actions */}
                <div className="rounded-xl border bg-card p-6 shadow-sm space-y-2">
                    <h3 className="font-semibold mb-4">Actions rapides</h3>
                    <Link
                        href={`/organizations/${org.slug}/posts`}
                        className={cn(buttonVariants({ variant: 'ghost' }), "w-full justify-start gap-2")}
                    >
                        <Plus className="h-4 w-4" />
                        Créer un post
                    </Link>
                    <Link
                        href={`/organizations/${org.slug}/promotions`}
                        className={cn(buttonVariants({ variant: 'ghost' }), "w-full justify-start gap-2")}
                    >
                        <Megaphone className="h-4 w-4" />
                        Lancer une promotion
                    </Link>
                    <Link
                        href={`/organizations/${org.slug}/analytics`}
                        className={cn(buttonVariants({ variant: 'ghost' }), "w-full justify-start gap-2")}
                    >
                        <BarChart3 className="h-4 w-4" />
                        Voir les statistiques
                    </Link>
                </div>

                {/* Recent Activity Placeholder */}
                <div className="rounded-xl border bg-card p-6 shadow-sm lg:col-span-2">
                    <h3 className="font-semibold mb-4">Activité récente</h3>
                    <p className="text-sm text-muted-foreground">
                        Les dernières activités de votre entreprise apparaîtront ici.
                    </p>
                </div>
            </div>
        </div>
    );
}

