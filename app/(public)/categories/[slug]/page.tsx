'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, Building2, MapPin } from 'lucide-react';

import { getCategoryBySlug, getOrganizationsByCategory, type OrganizationSummary } from '@/lib/api/public';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/star-rating';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { useState } from 'react';
import { getAssetUrl } from '@/lib/api/endpoints';

function OrganizationCard({ org }: { org: OrganizationSummary }) {
    return (
        <Link
            href={`/business/${org.slug}`}
            className="group flex gap-4 p-4 rounded-xl border bg-card hover:shadow-soft transition-all"
        >
            {/* Logo */}
            <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                {org.logoUrl ? (
                    <img src={getAssetUrl(org.logoUrl) || ''} alt={org.name} className="w-full h-full object-cover" />
                ) : (
                    <Building2 className="h-8 w-8 text-muted-foreground" />
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                        {org.name}
                    </h3>
                    {org.isVerified && (
                        <Badge variant="success" className="flex-shrink-0 text-xs">
                            Certifié
                        </Badge>
                    )}
                </div>

                {org.shortDescription && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {org.shortDescription}
                    </p>
                )}

                <div className="flex items-center gap-4 text-sm">
                    {org.city && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5" />
                            {org.city}
                        </span>
                    )}
                    <div className="flex items-center gap-1">
                        <StarRating rating={org.averageRating ?? 0} size="sm" />
                        <span className="text-muted-foreground">({org.reviewCount ?? 0})</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
    const [page, setPage] = useState(0);
    const pageSize = 12;

    const { data: category, isLoading: categoryLoading } = useQuery({
        queryKey: ['category', params.slug],
        queryFn: () => getCategoryBySlug(params.slug),
    });

    const { data: orgsData, isLoading: orgsLoading } = useQuery({
        queryKey: ['category', params.slug, 'organizations', page],
        queryFn: () => getOrganizationsByCategory(category?.id || '', page, pageSize),
        enabled: !!category?.id,
    });

    const isLoading = categoryLoading || orgsLoading;
    const organizations = orgsData?.content || [];
    const totalPages = orgsData?.totalPages || 0;

    return (
        <div className="py-12">
            <div className="container-wrapper">
                {/* Back Link */}
                <Link
                    href="/categories"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Toutes les catégories
                </Link>

                {/* Header */}
                {categoryLoading ? (
                    <div className="mb-8">
                        <Skeleton className="h-10 w-48 mb-2" />
                        <Skeleton className="h-5 w-96" />
                    </div>
                ) : category ? (
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
                        <p className="text-muted-foreground">
                            {category.description || `Découvrez les entreprises dans la catégorie ${category.name}`}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            {orgsData?.totalElements || 0} entreprises trouvées
                        </p>
                    </div>
                ) : null}

                {/* Organizations List */}
                {isLoading ? (
                    <div className="grid gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-xl border bg-card">
                                <Skeleton className="w-16 h-16 rounded-lg" />
                                <div className="flex-1">
                                    <Skeleton className="h-5 w-48 mb-2" />
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : organizations.length === 0 ? (
                    <EmptyState
                        icon="search"
                        title="Aucune entreprise trouvée"
                        description="Il n'y a pas encore d'entreprises dans cette catégorie."
                        action={{
                            label: 'Voir toutes les catégories',
                            onClick: () => window.location.href = '/categories',
                        }}
                    />
                ) : (
                    <>
                        <div className="grid gap-4">
                            {organizations.map((org: OrganizationSummary) => (
                                <OrganizationCard key={org.id} org={org} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex justify-center">
                                <Pagination
                                    currentPage={page + 1}
                                    totalPages={totalPages}
                                    onPageChange={(p) => setPage(p - 1)}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
