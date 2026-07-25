'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Plus, Tv, Eye, MousePointerClick, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { getOrganizationBySlug } from '@/lib/api/public';
import { adsApi, type OrganizationAd } from '@/lib/api/ads';
import { formatDate, formatNumber } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { CreateAdModal } from '@/components/features/ads/create-ad-modal';

export default function OrganizationAdsPage() {
    const params = useParams();
    const slug = params.slug as string;
    const t = useTranslations('ads');
    const tCommon = useTranslations('common');
    const queryClient = useQueryClient();

    const [createOpen, setCreateOpen] = useState(false);

    const { data: org } = useQuery({
        queryKey: ['organization', slug],
        queryFn: () => getOrganizationBySlug(slug),
    });

    const { data: ads, isLoading } = useQuery({
        queryKey: ['organization-ads', org?.id],
        queryFn: () => adsApi.getOrganizationAds(org!.id),
        enabled: !!org?.id,
    });

    const deleteMutation = useMutation({
        mutationFn: (adId: string) => adsApi.deleteAd(org!.id, adId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['organization-ads', org?.id] });
            toast.success(t('deleted'));
        },
    });

    const toggleMutation = useMutation({
        mutationFn: (ad: OrganizationAd) =>
            adsApi.updateAd(org!.id, ad.id, { isActive: !ad.isActive }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['organization-ads', org?.id] });
        },
    });

    if (!org || isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Spinner />
            </div>
        );
    }

    const placementName = (adType: string) => {
        const known = ['POPUP', 'HOME_HERO', 'HOME_SIDEBAR', 'SEARCH_SIDEBAR', 'ORG_DETAIL_SIDEBAR'];
        return known.includes(adType) ? t(`placements.${adType}.name`) : adType;
    };

    const isExpired = (ad: OrganizationAd) =>
        !!ad.endDate && new Date(ad.endDate).getTime() < Date.now();

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-semibold">{t('title')}</h3>
                    <p className="text-sm text-muted-foreground">
                        {t('subtitle', { orgName: org.longName })}
                    </p>
                </div>
                <Button onClick={() => setCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('createAd')}
                </Button>
            </div>

            {/* Liste */}
            {!ads || ads.length === 0 ? (
                <EmptyState
                    icon={Tv}
                    title={t('noAds')}
                    description={t('noAdsHint')}
                    action={
                        <Button onClick={() => setCreateOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('createAd')}
                        </Button>
                    }
                />
            ) : (
                <div className="grid gap-4">
                    {ads.map((ad) => {
                        const expired = isExpired(ad);
                        const active = ad.isActive && !expired;
                        return (
                            <div
                                key={ad.id}
                                className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border bg-card p-4"
                            >
                                {/* Aperçu image */}
                                <div className="h-16 w-24 rounded-lg bg-muted overflow-hidden shrink-0">
                                    {ad.imageUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={ad.imageUrl}
                                            alt={ad.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                                            <Tv className="h-6 w-6" />
                                        </div>
                                    )}
                                </div>

                                {/* Infos */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-medium truncate">{ad.title}</p>
                                        <Badge variant={active ? 'default' : 'secondary'}>
                                            {expired
                                                ? tCommon('expired')
                                                : active
                                                    ? tCommon('active')
                                                    : tCommon('inactive')}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {placementName(ad.adType)}
                                        {ad.startDate && ad.endDate && (
                                            <> · {formatDate(ad.startDate)} → {formatDate(ad.endDate)}</>
                                        )}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Eye className="h-3.5 w-3.5" />
                                            {formatNumber(ad.impressions)} {t('impressions').toLowerCase()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MousePointerClick className="h-3.5 w-3.5" />
                                            {formatNumber(ad.clicks)} {t('clicks').toLowerCase()}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0">
                                    {!expired && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => toggleMutation.mutate(ad)}
                                            disabled={toggleMutation.isPending}
                                        >
                                            {ad.isActive ? t('deactivate') : t('activate')}
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:bg-destructive/10"
                                        onClick={() => {
                                            if (window.confirm(t('deleteConfirm'))) {
                                                deleteMutation.mutate(ad.id);
                                            }
                                        }}
                                        disabled={deleteMutation.isPending}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <CreateAdModal
                open={createOpen}
                onOpenChange={setCreateOpen}
                organizationId={org.id}
                organizationSlug={slug}
            />
        </div>
    );
}
