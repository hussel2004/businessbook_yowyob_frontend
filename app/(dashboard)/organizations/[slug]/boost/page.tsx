'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Rocket, Check, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

import { getOrganizationBySlug } from '@/lib/api/public';
import { getBoostSubscription, activateBoost } from '@/lib/api/boost';
import {
    BOOST_PLANS,
    getBoostTotalPrice,
    getBoostMonthlyEquivalent,
    getBoostDiscountPercent,
    type BoostPlan,
} from '@/lib/constants/billing';
import { formatPrice, formatDate } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { CheckoutModal } from '@/components/features/billing/checkout-modal';
import { cn } from '@/lib/utils/cn';

export default function BoostPage() {
    const params = useParams();
    const slug = params.slug as string;
    const t = useTranslations('boost');
    const tCommon = useTranslations('common');
    const queryClient = useQueryClient();

    const [selectedPlan, setSelectedPlan] = useState<BoostPlan | null>(null);
    const [checkoutOpen, setCheckoutOpen] = useState(false);

    const { data: org } = useQuery({
        queryKey: ['organization', slug],
        queryFn: () => getOrganizationBySlug(slug),
    });

    const { data: subscription, isLoading: subLoading } = useQuery({
        queryKey: ['boost-subscription', org?.id],
        queryFn: () => getBoostSubscription(org!.id),
        enabled: !!org?.id,
    });

    if (!org) {
        return (
            <div className="flex justify-center py-12">
                <Spinner />
            </div>
        );
    }

    const features = [
        t('features.searchPriority'),
        t('features.featuredBadge'),
        t('features.homepageSpotlight'),
        t('features.analytics'),
        t('features.support'),
    ];

    const cycleLabel = (cycle: BoostPlan['cycle']) => t(`billing.${cycle}`);
    const billedLabel = (cycle: BoostPlan['cycle']) => {
        if (cycle === 'monthly') return t('billing.billedMonthly');
        if (cycle === 'quarterly') return t('billing.billedQuarterly');
        return t('billing.billedYearly');
    };

    const openCheckout = (plan: BoostPlan) => {
        setSelectedPlan(plan);
        setCheckoutOpen(true);
    };

    const isActive = subscription?.status === 'ACTIVE';

    return (
        <div className="space-y-8">
            {/* En-tête */}
            <div className="text-center max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/15 to-amber-500/15 text-orange-600 text-sm font-medium mb-4">
                    <Rocket className="h-4 w-4" />
                    {t('title')}
                </div>
                <p className="text-muted-foreground">
                    {t('subtitle', { orgName: org.longName })}
                </p>
            </div>

            {/* Abonnement actuel */}
            {!subLoading && subscription && (
                <div
                    className={cn(
                        'rounded-xl border p-4 flex flex-wrap items-center justify-between gap-3 max-w-3xl mx-auto',
                        isActive
                            ? 'border-emerald-500/30 bg-emerald-500/5'
                            : 'border-border bg-muted/30'
                    )}
                >
                    <div className="flex items-center gap-3">
                        <Sparkles className={cn('h-5 w-5', isActive ? 'text-emerald-500' : 'text-muted-foreground')} />
                        <div>
                            <p className="text-sm font-semibold">
                                {t('currentPlan')} : {cycleLabel(subscription.cycle)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {isActive
                                    ? t('activeUntil', { date: formatDate(subscription.expiresAt) })
                                    : tCommon('expired')}
                            </p>
                        </div>
                    </div>
                    <Badge variant={isActive ? 'default' : 'secondary'}>
                        {isActive ? tCommon('active') : tCommon('expired')}
                    </Badge>
                </div>
            )}

            {/* Plans */}
            <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
                {BOOST_PLANS.map((plan) => {
                    const total = getBoostTotalPrice(plan);
                    const monthlyEq = getBoostMonthlyEquivalent(plan);
                    const discountPercent = getBoostDiscountPercent(plan);
                    const isPopular = plan.cycle === 'yearly';

                    return (
                        <div
                            key={plan.cycle}
                            className={cn(
                                'relative flex flex-col rounded-2xl border bg-card p-6 transition-all hover:shadow-soft',
                                isPopular && 'border-primary shadow-soft ring-1 ring-primary/20'
                            )}
                        >
                            {discountPercent > 0 && (
                                <Badge className="absolute -top-3 right-4 bg-emerald-600 hover:bg-emerald-600">
                                    {t('billing.save', { percent: discountPercent })}
                                </Badge>
                            )}

                            <h3 className="text-lg font-semibold mb-1">{cycleLabel(plan.cycle)}</h3>
                            <p className="text-xs text-muted-foreground mb-4">{billedLabel(plan.cycle)}</p>

                            <div className="mb-1">
                                <span className="text-3xl font-bold">{formatPrice(total)}</span>
                            </div>
                            {plan.months > 1 && (
                                <p className="text-xs text-muted-foreground mb-4">
                                    {t('equivalentPerMonth', { price: formatPrice(monthlyEq) })}
                                </p>
                            )}
                            {plan.months === 1 && (
                                <p className="text-xs text-muted-foreground mb-4">{tCommon('perMonth')}</p>
                            )}

                            <ul className="space-y-2 mb-6 flex-1">
                                {features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm">
                                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className="w-full"
                                variant={isPopular ? 'default' : 'outline'}
                                onClick={() => openCheckout(plan)}
                            >
                                {t('subscribe')}
                            </Button>
                        </div>
                    );
                })}
            </div>

            {/* Checkout */}
            {selectedPlan && (
                <CheckoutModal
                    open={checkoutOpen}
                    onOpenChange={setCheckoutOpen}
                    title={t('checkoutTitle')}
                    reference={`BOOST-${org.id}`}
                    lines={[
                        { label: t('plan'), value: `Boost — ${cycleLabel(selectedPlan.cycle)}` },
                        { label: t('period'), value: t('billing.monthsShort', { count: selectedPlan.months }) },
                        ...(getBoostDiscountPercent(selectedPlan) > 0
                            ? [{
                                label: t('discount'),
                                value: `-${getBoostDiscountPercent(selectedPlan)}%`,
                                highlight: true,
                            }]
                            : []),
                    ]}
                    total={getBoostTotalPrice(selectedPlan)}
                    footnote={t('renewalInfo')}
                    onPaid={async (payment) => {
                        await activateBoost({
                            organizationId: org.id,
                            cycle: selectedPlan.cycle,
                            months: selectedPlan.months,
                            amountPaid: getBoostTotalPrice(selectedPlan),
                            payment,
                        });
                        await queryClient.invalidateQueries({ queryKey: ['boost-subscription', org.id] });
                        toast.success(t('successToast'));
                    }}
                />
            )}
        </div>
    );
}
