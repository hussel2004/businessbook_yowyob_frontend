'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth/hooks';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { getDashboardStats } from '@/lib/api/dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, Heart, MessageSquare, Star } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
    const { user, becomeBusinessOwner, isBecomingBusinessOwner } = useAuth();
    const router = useRouter();
    const isBusinessOwner = user?.accountType === 'BUSINESS';
    const { data: stats, isLoading } = useQuery({
        queryKey: ['dashboard-stats', user?.id],
        queryFn: getDashboardStats,
        enabled: !!user,
    });

    useEffect(() => {
        if (!isLoading && stats && isBusinessOwner) {
            // Force redirect for Business Owners
            if (stats.organizationCount === 0) {
                router.replace('/organizations/create');
            } else if (stats.organizationCount === 1 && stats.firstOrganizationId) {
                // TODO: Check for Diamond subscription to allow staying on dashboard
                // For now, redirect standard business owners to their org
                router.replace(`/organizations/${stats.firstOrganizationId}`);
            }
        }
    }, [isLoading, stats, isBusinessOwner, router]);

    const handleBecomeBusinessOwner = async () => {
        try {
            await becomeBusinessOwner();
            toast.success('Vous êtes maintenant business owner !');
        } catch {
            toast.error('Impossible de passer business owner pour le moment.');
        }
    };

    if (isLoading) {
        return <div className="p-8"><Skeleton className="h-32 w-full" /></div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
                <p className="text-muted-foreground">
                    Bienvenue sur votre espace de gestion BusinessBook.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Cards content... */}
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm text-muted-foreground">Mes Entreprises</h3>
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                        </div>
                        {isBusinessOwner ? (
                            <>
                                <div className="text-3xl font-bold">{stats?.organizationCount || 0}</div>

                                {/* Hide "Add" button if limit reached (1 for standard) */}
                                {/* For now simplified logic: show only if 0 or Diamond (logic to add later) */}
                                {stats?.organizationCount === 0 && (
                                    <Link
                                        href="/organizations/create"
                                        className={cn(buttonVariants({ size: 'sm' }), "w-full mt-4")}
                                    >
                                        Ajouter une entreprise
                                    </Link>
                                )}
                            </>
                        ) : (
                            <>
                                <p className="text-xs text-muted-foreground">
                                    Référencez votre activité sur BusinessBook.
                                </p>
                                <Button
                                    size="sm"
                                    className="w-full mt-4"
                                    onClick={handleBecomeBusinessOwner}
                                    disabled={isBecomingBusinessOwner}
                                >
                                    {isBecomingBusinessOwner ? 'Chargement...' : 'Devenir business owner'}
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Rest of the cards */}
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm text-muted-foreground">Avis reçus</h3>
                            <Star className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="text-3xl font-bold">{stats?.totalReviews || 0}</div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Avis cumulés sur vos pages
                        </p>
                    </div>
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm text-muted-foreground">Favoris</h3>
                            <Heart className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="text-3xl font-bold">{stats?.favoritesCount || 0}</div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Pages enregistrées
                        </p>
                    </div>
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm text-muted-foreground">Notifications</h3>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="text-3xl font-bold">{stats?.unreadNotifications || 0}</div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Non lues
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
