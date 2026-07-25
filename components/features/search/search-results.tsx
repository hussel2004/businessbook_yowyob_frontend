'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { MapView } from '@/components/features/map/map-view';
import { searchOrganizations } from '@/lib/api/public';
import { useGeolocation } from '@/lib/hooks/use-geolocation';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { YouTubeResultCard } from './youtube-result-card';
import { SearchResultCard } from './search-result-card';

interface SearchResultsProps {
    viewMode: 'grid' | 'list' | 'map';
    filterModes?: string[];
}

function SearchResultsSkeleton({ viewMode }: { viewMode: 'grid' | 'list' | 'map' }) {
    if (viewMode === 'map') {
        return <Skeleton className="w-full h-[600px] rounded-xl" />;
    }
    return (
        <div className="flex flex-col md:flex-row gap-4 p-4 rounded-xl border bg-card">
            <Skeleton className="w-full md:w-[360px] aspect-video rounded-lg" />
            <div className="flex-1 space-y-3 py-2">
                <Skeleton className="h-6 w-3/4" />
                <div className="flex gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        </div>
    );
}

export function SearchResults({ viewMode, filterModes = ['all'] }: SearchResultsProps) {
    const t = useTranslations('search');
    const searchParams = useSearchParams();
    const page = Number(searchParams.get('page')) || 0;
    const pageSize = 12;

    const { coordinates } = useGeolocation();

    // Determine category from filterModes or URL
    const specialFilterModes = ['all', 'verified', 'promos', 'top_rated', 'new', 'nearby'];
    const categoryFromFilter = filterModes.find(m => !specialFilterModes.includes(m));

    // Only include coordinates if explicitly requesting nearby results
    const useNearby = filterModes.includes('nearby');

    const queryParams = {
        q: searchParams.get('q') || undefined,
        keywords: searchParams.get('keywords')?.split(',').filter(Boolean),
        city: searchParams.get('city') || undefined,
        category: categoryFromFilter || searchParams.get('category') || undefined,
        verified: filterModes.includes('verified') ? true : undefined,
        minRating: Number(searchParams.get('minRating')) || undefined,
        page,
        size: 50,
        // Only include geolocation when "nearby" filter is active to prevent query refetch
        lat: useNearby && coordinates.latitude ? coordinates.latitude : undefined,
        lng: useNearby && coordinates.longitude ? coordinates.longitude : undefined,
        radius: useNearby ? 50 : undefined,
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ['search', queryParams],
        queryFn: () => searchOrganizations(queryParams),
        staleTime: 60 * 1000,
    });

    let organizations = data?.content || [];

    // Client-side filtering if needed (mirroring frontend2 logic for demo parity)
    if (!filterModes.includes('all')) {
        if (filterModes.includes('verified')) {
            organizations = organizations.filter(o => o.isVerified);
        }
        if (filterModes.includes('top_rated')) {
            organizations = organizations.filter(o => (o.averageRating || 0) >= 4.5);
        }
        if (filterModes.includes('new')) {
            organizations = organizations.slice(0, 10);
        }
        if (filterModes.includes('nearby')) {
            organizations = organizations.slice(0, 5);
        }
    }

    const totalPages = Math.ceil(organizations.length / pageSize);
    const paginatedOrgs = organizations.slice(page * pageSize, (page + 1) * pageSize);


    if (isLoading) {
        return (
            <div className="grid gap-4 grid-cols-1">
                {Array.from({ length: 4 }).map((_, i) => (
                    <SearchResultsSkeleton key={i} viewMode={viewMode} />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <EmptyState
                icon="error"
                title={t('errorTitle')}
                description={t('loadError')}
            />
        );
    }

    if (organizations.length === 0) {
        return (
            <EmptyState
                icon="search"
                title={t('noResultsTitle')}
                description={t('noResultsHint')}
                action={{
                    label: t('clearFilters'),
                    onClick: () => window.location.href = '/search',
                }}
            />
        );
    }

    if (viewMode === 'map') {
        return (
            <div className="h-[600px] w-full relative">
                <div className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur px-3 py-1 rounded-full text-sm font-medium border shadow-sm">
                    {t('resultsFound', { count: organizations.length })}
                </div>
                <MapView agencies={organizations.map(org => ({
                    id: org.id,
                    organizationId: org.id,
                    organizationName: org.longName,
                    organizationSlug: org.slug,
                    name: org.longName,
                    slug: org.slug,
                    agencyType: 'office',
                    isHeadquarters: true,
                    latitude: org.latitude,
                    longitude: org.longitude,
                    address: {
                        streetLine1: org.city || '',
                        city: org.city || '',
                        countryCode: org.countryCode || 'CM',
                        latitude: org.latitude,
                        longitude: org.longitude
                    },
                    averageRating: org.averageRating,
                    reviewCount: org.reviewCount,
                    categoryName: org.categoryName
                }))} />
            </div>
        );
    }

    const searchQuery = searchParams.get('q') || 'Entreprises au Cameroun';

    return (
        <div className="space-y-4">
            {/* Results Header (Count & Advanced) */}
            <div className="mb-2 px-1 flex items-center justify-between">
                <p className="text-sm text-muted-foreground font-medium">
                    {organizations.length} résultats pour "{searchQuery}"
                </p>
            </div>

            <div className="grid gap-4 grid-cols-1">
                {paginatedOrgs.map((org) => (
                    <YouTubeResultCard key={org.id} org={org} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center pt-8">
                    <Pagination
                        currentPage={page + 1}
                        totalPages={totalPages}
                        onPageChange={(p) => {
                            const params = new URLSearchParams(searchParams.toString());
                            params.set('page', (p - 1).toString());
                            window.history.pushState(null, '', `?${params.toString()}`);
                        }}
                    />
                </div>
            )}
        </div>
    );
}
