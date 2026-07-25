'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { useTranslations, useLocale } from 'next-intl';
import { Tag, Calendar, ArrowRight, Percent, Gift } from 'lucide-react';

import { getFeaturedPromotions, type Promotion } from '@/lib/api/public';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { getAssetUrl } from '@/lib/api/endpoints';

function PromotionCard({ promo }: { promo: Promotion }) {
    const t = useTranslations('home.promotions');
    const locale = useLocale();

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString(locale === 'en' ? 'en-GB' : 'fr-FR', {
            day: 'numeric',
            month: 'short',
        });

    const discountLabel = (() => {
        switch (promo.discountType) {
            case 'PERCENTAGE':
                return `-${promo.discountValue}%`;
            case 'FIXED_AMOUNT':
                return `-${promo.discountValue} FCFA`;
            case 'BOGO':
                return t('bogo');
            case 'FREE_ITEM':
                return t('freeItem');
            default:
                return t('specialOffer');
        }
    })();

    const daysLeft = Math.ceil((new Date(promo.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    return (
        <Link
            href={`/business/${promo.organizationSlug}`}
            className="group relative flex-shrink-0 w-80 rounded-xl border bg-card overflow-hidden hover:shadow-soft transition-all"
        >
            {/* Promo Image */}
            <div className="relative h-44 bg-gradient-to-br from-primary/20 to-secondary/20">
                {promo.imageUrl ? (
                    <Image
                        src={getAssetUrl(promo.imageUrl) || ''}
                        alt={promo.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Gift className="h-16 w-16 text-primary/30" />
                    </div>
                )}

                {/* Discount Badge */}
                <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-primary-foreground font-bold text-sm px-3 py-1">
                        {discountLabel}
                    </Badge>
                </div>

                {/* Days Left Badge */}
                {daysLeft > 0 && daysLeft <= 7 && (
                    <div className="absolute top-4 right-4">
                        <Badge variant="destructive" className="text-xs">
                            {t('daysLeft', { count: daysLeft })}
                        </Badge>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                    {promo.organizationLogo && (
                        <div className="w-6 h-6 rounded overflow-hidden">
                            <Image
                                src={getAssetUrl(promo.organizationLogo) || ''}
                                alt={promo.organizationName}
                                width={24}
                                height={24}
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                    )}
                    <span className="text-xs text-muted-foreground">{promo.organizationName}</span>
                </div>

                <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {promo.title}
                </h3>

                {promo.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {promo.description}
                    </p>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {t('until', { date: formatDate(promo.endDate) })}
                    </div>
                    {promo.code && (
                        <div className="flex items-center gap-1 font-mono bg-muted px-2 py-0.5 rounded">
                            <Tag className="h-3 w-3" />
                            {promo.code}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}

function PromotionSkeleton() {
    return (
        <div className="flex-shrink-0 w-80 rounded-xl border bg-card overflow-hidden">
            <Skeleton className="h-44 w-full" />
            <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="w-6 h-6 rounded" />
                    <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-3" />
                <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-5 w-16" />
                </div>
            </div>
        </div>
    );
}

export function PromotionsSection() {
    const t = useTranslations('home.promotions');
    const { data: promotions, isLoading, error } = useQuery({
        queryKey: ['promotions', 'featured'],
        queryFn: () => getFeaturedPromotions(6),
        staleTime: 5 * 60 * 1000,
    });

    if (!isLoading && (!promotions || promotions.length === 0)) {
        return null; // Don't show section if no promotions
    }

    return (
        <section className="py-16 md:py-24">
            <div className="container-wrapper">
                {/* Section Header */}
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-3">
                            <Percent className="h-4 w-4" />
                            {t('badge')}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">
                            {t('title')}
                        </h2>
                        <p className="text-muted-foreground">
                            {t('subtitle')}
                        </p>
                    </div>
                    <Link
                        href="/promotions"
                        className="hidden md:flex items-center gap-2 text-primary font-medium hover:underline"
                    >
                        {t('seeAll')}
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {/* Promotions Scroll */}
                {isLoading ? (
                    <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <PromotionSkeleton key={i} />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-muted-foreground">
                        {t('loadError')}
                    </div>
                ) : (
                    <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                        {promotions?.map((promo) => (
                            <PromotionCard key={promo.id} promo={promo} />
                        ))}
                    </div>
                )}

                {/* Mobile View All Link */}
                <div className="mt-8 text-center md:hidden">
                    <Link
                        href="/promotions"
                        className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                    >
                        {t('seeAll')}
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
