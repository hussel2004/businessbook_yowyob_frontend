'use client';

import { useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useQuery } from '@tanstack/react-query';
import { adsApi, Advertisement } from '@/lib/api/ads';
import { getAssetUrl } from '@/lib/api/endpoints';

export type AdFormat = 'leaderboard' | 'rectangle' | 'skyscraper' | 'card';

interface AdBannerProps {
    format: AdFormat;
    className?: string;
    slotId?: string; // For analytics tracking in future
}

const SLOT_MAPPING: Record<AdFormat, string> = {
    leaderboard: 'HOME_HERO',
    rectangle: 'HOME_SIDEBAR',
    skyscraper: 'SEARCH_SIDEBAR',
    card: 'ORG_DETAIL_SIDEBAR'
};

const DIMENSIONS: Record<AdFormat, string> = {
    leaderboard: 'h-24 md:h-32 w-full',
    rectangle: 'h-64 w-full md:w-80',
    skyscraper: 'h-full min-h-[400px] w-full md:w-64',
    card: 'h-auto w-full'
};

export function AdBanner({ format, className, slotId }: AdBannerProps) {
    const apiSlot = SLOT_MAPPING[format];

    const { data: ads, isLoading } = useQuery({
        queryKey: ['ads', apiSlot],
        queryFn: () => adsApi.getAdsForSlot(apiSlot),
        staleTime: 1000 * 60 * 5, // 5 minutes cache
        enabled: !!apiSlot,
    });

    const ad = useMemo(() => {
        if (!ads || ads.length === 0) return null;
        return ads[0];
    }, [ads]);

    useEffect(() => {
        if (ad) {
            adsApi.trackImpression(ad.id).catch(console.error);
        }
    }, [ad]);

    if (isLoading) {
        return (
            <div className={cn('relative overflow-hidden rounded-lg border bg-muted/20 animate-pulse flex items-center justify-center text-muted-foreground/30 text-xs uppercase tracking-widest', DIMENSIONS[format], className)}>
                Publicité
            </div>
        );
    }

    if (!ad) return null;

    const handleAdClick = () => {
        adsApi.trackClick(ad.id).catch(console.error);
    };

    return (
        <div data-slot-id={slotId} className={cn('relative overflow-hidden rounded-lg border bg-card/50 shadow-sm group', DIMENSIONS[format], className)}>
            <div className="absolute top-1 right-1 z-20">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70 bg-background/80 px-1.5 py-0.5 rounded shadow-sm border">
                    Sponsorisé
                </span>
            </div>

            <Link
                href={ad.linkUrl || '#'}
                className="block w-full h-full relative"
                target={ad.linkUrl?.startsWith('http') ? '_blank' : undefined}
                onClick={handleAdClick}
            >
                {ad.imageUrl ? (
                    <>
                        <Image
                            src={getAssetUrl(ad.imageUrl) || ''}
                            alt={ad.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 p-6 flex items-center justify-center text-center" />
                )}

                <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
                    <p className="text-xs font-medium text-white/80 mb-1 flex items-center gap-1">
                        Partenaire
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                    <h4 className={cn("font-bold leading-tight", format === 'leaderboard' ? "text-xl md:text-2xl" : "text-lg")}>
                        {ad.title}
                    </h4>
                </div>
            </Link>
        </div>
    );
}
