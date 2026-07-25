'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { OrganizationSummary } from '@/lib/api/public';
import { Badge } from '@/components/ui/badge';
import { BadgeCheck, Star, MapPin } from 'lucide-react';
import { getAssetUrl } from '@/lib/api/endpoints';

interface YouTubeResultCardProps {
    org: OrganizationSummary;
}

export function YouTubeResultCard({ org }: YouTubeResultCardProps) {
    const t = useTranslations('search');
    // Use the appropriate name fields from backend
    const displayName = org.shortName || org.longName || org.name || 'Sans nom';
    const fullName = org.longName || org.name || displayName;
    const description = org.shortDescription || '';

    return (
        <div className="group flex flex-col md:flex-row gap-4 p-4 rounded-xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50 bg-background">
            {/* Thumbnail Section */}
            <div className="relative w-full md:w-[360px] flex-shrink-0 aspect-video md:aspect-[16/9] rounded-xl overflow-hidden bg-muted">
                <img
                    src={getAssetUrl(org.coverImageUrl) || '/api/placeholder/400/320'}
                    alt={displayName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Verified Badge - Top Right with Blue Checkmark */}
                {org.isVerified && (
                    <div className="absolute top-2 right-2">
                        <div className="bg-blue-500 text-white p-1.5 rounded-full shadow-lg" title={t('verifiedBusiness')}>
                            <BadgeCheck className="h-4 w-4" />
                        </div>
                    </div>
                )}

                {/* Rating Overlay (Bottom Right) */}
                {(org.averageRating ?? 0) > 0 && (
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {(org.averageRating ?? 0).toFixed(1)}
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0 py-1">
                <div className="flex items-start justify-between gap-2">
                    <Link href={`/business/${org.slug}`} className="block">
                        <h3 className="text-lg md:text-xl font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                            {fullName}
                        </h3>
                        {org.shortName && org.longName && org.shortName !== org.longName && (
                            <p className="text-sm text-muted-foreground mt-0.5">{org.shortName}</p>
                        )}
                    </Link>
                </div>

                {/* Category and inline badges */}
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        {org.logoUrl && (
                            <img
                                src={getAssetUrl(org.logoUrl) || ''}
                                alt={displayName}
                                className="w-6 h-6 rounded-full object-cover bg-muted"
                            />
                        )}
                        <span className="font-medium">{org.categoryName}</span>
                    </div>

                    {/* Inline Verified Icon */}
                    {org.isVerified && (
                        <span title={t('verified')}>
                            <BadgeCheck className="h-4 w-4 text-blue-500" />
                        </span>
                    )}

                </div>

                {/* Metadata Row */}
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>{t('reviewsCount', { count: org.reviewCount ?? 0 })}</span>
                    <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/50" />
                    {org.city && (
                        <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {org.city}
                        </span>
                    )}
                </div>

                {/* Description Snippet */}
                {description && (
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                        {description}
                    </p>
                )}

                {/* Action Button */}
                <div className="mt-3 flex items-center gap-2">
                    <Link href={`/business/${org.slug}`}>
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 font-medium">
                            {t('viewProfile')}
                        </Badge>
                    </Link>
                </div>
            </div>
        </div>
    );
}

