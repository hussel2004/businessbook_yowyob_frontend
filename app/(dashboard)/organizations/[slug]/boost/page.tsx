'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Rocket, Check, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

import { getOrganizationBySlug } from '@/lib/api/public';
import { billingApi, type BoostPlanOffer } from '@/lib/api/billing';
import { formatPrice, formatDate } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { CheckoutModal } from '@/components/features/billing/checkout-modal';
import { cn } from '@/lib/utils/cn';

/** Ajouté à l'URL de retour pour reprendre la confirmation après le paiement. */
const PAYMENT_PARAM = 'paymentOrderId';

export default function BoostPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const slug = params.slug as string;
    const t = useTranslations('boost');
    const tCommon = useTranslations('common');
    const tPayment = useTranslations('payment');
    const queryClient = useQueryClient();

    const [selectedPlan, setSelectedPlan] = useState<BoostPlanOffer | null>(null);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    // Une seule tentative de confirmation par retour de paiement
    const confirmedRef = useRef<string | null>(null);

    const { data: org } = useQuery({
        queryKey: ['organization', slug],
        queryFn: () => getOrganizationBySlug(slug),
    });

    const { data: catalog } = useQuery({
        queryKey: ['billing-catalog'],
        queryFn: billingApi.getCatalog,
        staleTime: 30 * 60 * 1000,
    });

    const { data: subscription, isLoading: subLoading } = useQuery({
        queryKey: ['boost-subscription', org?.id],
        queryFn: () => billingApi.getBoostSubscription(org!.id),
        enabled: !!org?.id,
    });

    // Retour depuis la page de paiement : on relit le statut auprès du serveur,
    // qui le revérifie lui-même auprès du fournisseur.
    const returnedOrderId = searchParams.get(PAYMENT_PARAM);
    useEffect(() => {
        if (!returnedOrderId || !org?.id || confirmedRef.current === returnedOrderId) return;
        confirmedRef.current = returnedOrderId;

        billingApi
            .confirmBoost(org.id, returnedOrderId)
            .then(async (sub) => {
                if (sub.active) {
                    toast.success(t('successToast'));
                } else if (sub.status === 'PENDING') {
                    toast(tPayment('pending'));
                } else {
                    toast.error(tPayment('failed'));
                }
                await queryClient.invalidateQueries({ queryKey: ['boost-subscription', org.id] });
            })
            .catch(() => toast.error(tPayment('failed')))
            .finally(() => router.replace(`/organizations/${slug}/boost`, { scroll: false }));
    }, [returnedOrderId, org?.id, queryClient, router, slug, t, tPayment]);

    if (!org || !catalog) {
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

    const cycleKey = (plan: BoostPlanOffer['plan']) =>
        plan === 'MONTHLY' ? 'monthly' : plan === 'QUARTERLY' ? 'quarterly' : 'yearly';
    const cycleLabel = (plan: BoostPlanOffer['plan']) => t(`billing.${cycleKey(plan)}`);
    const billedLabel = (plan: BoostPlanOffer['plan']) => {
        if (plan === 'MONTHLY') return t('billing.billedMonthly');
        if (plan === 'QUARTERLY') return t('billing.billedQuarterly');
        return t('billing.billedYearly');
    };

    const isActive = subscription?.active === true;

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
                                {t('currentPlan')} : {cycleLabel(subscription.billingCycle)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {isActive && subscription.expiresAt
                                    ? t('activeUntil', { date: formatDate(subscription.expiresAt) })
                                    : subscription.status === 'PENDING'
                                        ? tPayment('pending')
                                        : tCommon('expired')}
                            </p>
                        </div>
                    </div>
                    <Badge variant={isActive ? 'default' : 'secondary'}>
                        {isActive ? tCommon('active') : subscription.status === 'PENDING'
                            ? tCommon('pending')
                            : tCommon('expired')}
                    </Badge>
                </div>
            )}

            {/* Formules — tarifs servis par le backend */}
            <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
                {catalog.boostPlans.map((plan) => {
                    const isPopular = plan.plan === 'YEARLY';

                    return (
                        <div
                            key={plan.plan}
                            className={cn(
                                'relative flex flex-col rounded-2xl border bg-card p-6 transition-all hover:shadow-soft',
                                isPopular && 'border-primary shadow-soft ring-1 ring-primary/20'
                            )}
                        >
                            {plan.discountPercent > 0 && (
                                <Badge className="absolute -top-3 right-4 bg-emerald-600 hover:bg-emerald-600">
                                    {t('billing.save', { percent: plan.discountPercent })}
                                </Badge>
                            )}

                            <h3 className="text-lg font-semibold mb-1">{cycleLabel(plan.plan)}</h3>
                            <p className="text-xs text-muted-foreground mb-4">{billedLabel(plan.plan)}</p>

                            <div className="mb-1">
                                <span className="text-3xl font-bold">{formatPrice(plan.totalPrice)}</span>
                            </div>
                            {plan.months > 1 ? (
                                <p className="text-xs text-muted-foreground mb-4">
                                    {t('equivalentPerMonth', { price: formatPrice(plan.monthlyEquivalent) })}
                                </p>
                            ) : (
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
                                onClick={() => {
                                    setSelectedPlan(plan);
                                    setCheckoutOpen(true);
                                }}
                            >
                                {t('subscribe')}
                            </Button>
                        </div>
                    );
                })}
            </div>

            {/* Paiement */}
            {selectedPlan && (
                <CheckoutModal
                    open={checkoutOpen}
                    onOpenChange={setCheckoutOpen}
                    title={t('checkoutTitle')}
                    lines={[
                        { label: t('plan'), value: `Boost — ${cycleLabel(selectedPlan.plan)}` },
                        { label: t('period'), value: t('billing.monthsShort', { count: selectedPlan.months }) },
                        ...(selectedPlan.discountPercent > 0
                            ? [{
                                label: t('discount'),
                                value: `-${selectedPlan.discountPercent}%`,
                                highlight: true,
                            }]
                            : []),
                    ]}
                    total={selectedPlan.totalPrice}
                    footnote={t('renewalInfo')}
                    onCheckout={(method, payerReference) =>
                        billingApi.checkoutBoost(org.id, {
                            plan: selectedPlan.plan,
                            method,
                            payerReference,
                        })
                    }
                    onPaid={async () => {
                        await queryClient.invalidateQueries({ queryKey: ['boost-subscription', org.id] });
                    }}
                />
            )}
        </div>
    );
}
