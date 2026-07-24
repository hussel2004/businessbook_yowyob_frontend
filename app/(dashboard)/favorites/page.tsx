'use client';

import { useQuery } from '@tanstack/react-query';
import { get } from '@/lib/api/client';
import { ENDPOINTS, getAssetUrl } from '@/lib/api/endpoints';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart, MapPin, Building2, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import type { OrganizationSummary } from '@/lib/api/public';
import { EmptyState } from '@/components/ui/empty-state';

export default function FavoritesPage() {
    const { data: favorites, isLoading } = useQuery({
        queryKey: ['my-favorites'],
        queryFn: () => get<OrganizationSummary[]>(ENDPOINTS.FAVORITES.BASE),
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Mes Favoris</h1>
                <p className="text-muted-foreground">
                    Retrouvez ici les entreprises que vous avez sauvegardées.
                </p>
            </div>

            {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Skeleton className="h-48 w-full rounded-xl" />
                    <Skeleton className="h-48 w-full rounded-xl" />
                    <Skeleton className="h-48 w-full rounded-xl" />
                </div>
            ) : favorites?.length === 0 ? (
                <EmptyState
                    icon={Heart}
                    title="Aucun favori"
                    description="Vous n'avez pas encore ajouté d'entreprise à vos favoris."
                    action={{
                        label: 'Explorer les entreprises',
                        onClick: () => window.location.href = '/search',
                    }}
                />
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {favorites?.map((org) => (
                        <Link
                            key={org.id}
                            href={`/business/${org.slug}`}
                            className="group flex flex-col rounded-xl border bg-card overflow-hidden hover:shadow-soft transition-all h-full"
                        >
                            {/* Cover Image */}
                            <div className="relative h-40 bg-muted">
                                {org.coverImageUrl ? (
                                    <img
                                        src={getAssetUrl(org.coverImageUrl) || ''}
                                        alt={org.longName}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                                )}

                                {/* Logo Badge */}
                                <div className="absolute -bottom-6 left-4 w-12 h-12 rounded-lg border-2 border-background bg-background overflow-hidden">
                                    {org.logoUrl ? (
                                        <img src={getAssetUrl(org.logoUrl) || ''} alt={org.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                                            {org.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 p-4 pt-8">
                                <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                                    {org.longName}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-3">{org.categoryName}</p>

                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-1 text-sm">
                                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                        <span className="font-medium">{org.averageRating?.toFixed(1) || '0.0'}</span>
                                        <span className="text-muted-foreground">({org.reviewCount})</span>
                                    </div>
                                    {org.city && (
                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <MapPin className="h-3 w-3" />
                                            {org.city}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
