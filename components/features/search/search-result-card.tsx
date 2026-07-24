import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { BadgeCheck, MapPin } from 'lucide-react';
import type { OrganizationSummary } from '@/lib/api/public';
import { StarRating } from '@/components/ui/star-rating';
import { getAssetUrl } from '@/lib/api/endpoints';

interface SearchResultCardProps {
    org: OrganizationSummary;
    viewMode: 'grid' | 'list';
}

export function SearchResultCard({ org, viewMode }: SearchResultCardProps) {
    if (viewMode === 'list') {
        return (
            <Link
                href={`/business/${org.slug}`}
                className="group flex gap-4 p-4 rounded-xl border bg-card hover:shadow-soft transition-all"
            >
                {/* Logo */}
                <div className="flex-shrink-0 w-24 h-24 rounded-lg bg-muted overflow-hidden">
                    {org.logoUrl ? (
                        <img src={getAssetUrl(org.logoUrl) || ''} alt={org.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-2xl">
                            {org.name.charAt(0)}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                {org.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">{org.categoryName || org.categories?.[0]}</p>
                        </div>
                        {org.isVerified && (
                            <BadgeCheck className="h-5 w-5 text-primary flex-shrink-0" />
                        )}
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                        <StarRating rating={org.averageRating ?? 0} size="sm" />
                        <span className="text-sm text-muted-foreground">({org.reviewCount ?? 0} avis)</span>
                    </div>

                    {org.shortDescription && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {org.shortDescription}
                        </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {org.city && (
                            <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {org.city}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        );
    }

    // Grid View
    return (
        <Link
            href={`/business/${org.slug}`}
            className="group flex flex-col rounded-xl border bg-card overflow-hidden hover:shadow-soft transition-all h-full"
        >
            {/* Cover Image */}
            <div className="relative h-40 bg-muted">
                {org.coverImageUrl ? (
                    <img
                        src={getAssetUrl(org.coverImageUrl) || ''}
                        alt={org.name}
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

                {org.isVerified && (
                    <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full p-1">
                        <BadgeCheck className="h-4 w-4 text-primary" />
                    </div>
                )}

                {org.distance && (
                    <Badge variant="secondary" className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm shadow-sm flex items-center gap-1 text-xs">
                        <MapPin className="h-3 w-3 text-primary" />
                        {org.distance} km
                    </Badge>
                )}
            </div>

            <div className="flex-1 p-4 pt-8">
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-1">
                    {org.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{org.categoryName || org.categories?.[0]}</p>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1">
                        <StarRating rating={org.averageRating ?? 0} size="sm" />
                        <span className="text-xs text-muted-foreground">({org.reviewCount ?? 0})</span>
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
    );
}
