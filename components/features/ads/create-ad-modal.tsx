'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, ArrowLeft, ArrowRight, Building2, Link2 } from 'lucide-react';
import toast from 'react-hot-toast';

import {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalBody,
    ModalFooter,
} from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ImageUpload } from '@/components/ui/image-upload';
import { CheckoutModal } from '@/components/features/billing/checkout-modal';
import { billingApi, type AdPlacementCode } from '@/lib/api/billing';
import { formatPrice } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

interface CreateAdModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    organizationId: string;
    /** Slug de l'entreprise, pour proposer sa page publique comme destination */
    organizationSlug: string;
}

type DestinationKind = 'own_page' | 'external';

/**
 * Complète une URL saisie sans protocole ("mon-site.cm" → "https://mon-site.cm")
 * pour que le lien reste cliquable depuis la publicité.
 */
function normalizeUrl(raw: string): string {
    const trimmed = raw.trim();
    if (!trimmed) return '';
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
}

function isValidUrl(raw: string): boolean {
    try {
        const url = new URL(normalizeUrl(raw));
        // Un hôte réel comporte au moins un point (exclut "https://abc")
        return url.hostname.includes('.');
    } catch {
        return false;
    }
}

/**
 * Création d'une publicité payante en 3 temps :
 * 1. Contenu (titre, description, image, lien)
 * 2. Visibilité (emplacement) + durée → montant calculé en direct
 * 3. Paiement (CheckoutModal) puis création via l'API
 */
export function CreateAdModal({
    open,
    onOpenChange,
    organizationId,
    organizationSlug,
}: CreateAdModalProps) {
    const t = useTranslations('ads');
    const tCommon = useTranslations('common');
    const queryClient = useQueryClient();

    const [step, setStep] = useState<1 | 2>(1);
    const [checkoutOpen, setCheckoutOpen] = useState(false);

    // Contenu
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
    const [destinationKind, setDestinationKind] = useState<DestinationKind>('own_page');
    const [externalUrl, setExternalUrl] = useState('');
    const [contentError, setContentError] = useState<string | null>(null);

    // Page publique de l'entreprise — absolue pour rester valide hors du site
    const ownPageUrl =
        typeof window !== 'undefined'
            ? `${window.location.origin}/business/${organizationSlug}`
            : `/business/${organizationSlug}`;

    const targetUrl =
        destinationKind === 'own_page' ? ownPageUrl : normalizeUrl(externalUrl);

    // Visibilité & durée
    const [placement, setPlacement] = useState<AdPlacementCode>('HOME_SIDEBAR');
    const [days, setDays] = useState(7);

    // Tarifs servis par le backend — le montant encaissé est de toute façon
    // recalculé par le serveur, ce catalogue ne sert qu'à l'affichage.
    const { data: catalog } = useQuery({
        queryKey: ['billing-catalog'],
        queryFn: billingApi.getCatalog,
        staleTime: 30 * 60 * 1000,
    });

    const placements = catalog?.adPlacements ?? [];
    const durations = catalog?.adDurations ?? [];

    const quote = (() => {
        const rate = placements.find((p) => p.placement === placement)?.dailyRate ?? 0;
        const discountPercent = durations.find((d) => d.days === days)?.discountPercent ?? 0;
        const basePrice = rate * days;
        const discountAmount = Math.round((basePrice * discountPercent) / 100);
        return { basePrice, discountPercent, discountAmount, totalPrice: basePrice - discountAmount };
    })();

    const resetAndClose = () => {
        setStep(1);
        setTitle('');
        setDescription('');
        setImageUrl(undefined);
        setDestinationKind('own_page');
        setExternalUrl('');
        setContentError(null);
        setCheckoutOpen(false);
        onOpenChange(false);
    };

    const goToStep2 = () => {
        if (!title.trim()) {
            setContentError(t('form.titleRequired'));
            return;
        }
        if (!imageUrl) {
            setContentError(t('form.imageRequired'));
            return;
        }
        if (destinationKind === 'external') {
            if (!externalUrl.trim()) {
                setContentError(t('form.targetUrlRequired'));
                return;
            }
            if (!isValidUrl(externalUrl)) {
                setContentError(t('form.targetUrlInvalid'));
                return;
            }
        }
        setContentError(null);
        setStep(2);
    };

    const placementName = (id: AdPlacementCode) => t(`placements.${id}.name`);

    return (
        <>
            <Modal open={open && !checkoutOpen} onOpenChange={onOpenChange} size="lg">
                <ModalHeader>
                    <ModalTitle>
                        {t('createAd')} — {step === 1 ? t('form.stepContent') : t('form.stepVisibility')}
                    </ModalTitle>
                </ModalHeader>
                <ModalBody className="space-y-5">
                    {step === 1 ? (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="ad-title">{t('form.adTitle')} *</Label>
                                <Input
                                    id="ad-title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder={t('form.adTitlePlaceholder')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ad-desc">{t('form.description')}</Label>
                                <Textarea
                                    id="ad-desc"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder={t('form.descriptionPlaceholder')}
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('form.image')} *</Label>
                                <ImageUpload
                                    value={imageUrl}
                                    onChange={setImageUrl}
                                    category="ads"
                                />
                                <p className="text-xs text-muted-foreground">{t('form.imageHint')}</p>
                            </div>

                            {/* Destination : page BusinessBook ou lien externe */}
                            <div className="space-y-2">
                                <Label>{t('form.targetUrl')} *</Label>
                                <p className="text-xs text-muted-foreground">{t('form.targetUrlHint')}</p>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    <button
                                        type="button"
                                        onClick={() => setDestinationKind('own_page')}
                                        className={cn(
                                            'flex items-start gap-2 rounded-lg border p-3 text-left transition-colors',
                                            destinationKind === 'own_page'
                                                ? 'border-primary bg-primary/5'
                                                : 'hover:bg-muted'
                                        )}
                                    >
                                        <Building2 className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                                        <span className="min-w-0">
                                            <span className="block text-sm font-medium">
                                                {t('form.destinationOwnPage')}
                                            </span>
                                            <span className="block text-xs text-muted-foreground">
                                                {t('form.destinationOwnPageHint')}
                                            </span>
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDestinationKind('external')}
                                        className={cn(
                                            'flex items-start gap-2 rounded-lg border p-3 text-left transition-colors',
                                            destinationKind === 'external'
                                                ? 'border-primary bg-primary/5'
                                                : 'hover:bg-muted'
                                        )}
                                    >
                                        <Link2 className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                                        <span className="min-w-0">
                                            <span className="block text-sm font-medium">
                                                {t('form.destinationExternal')}
                                            </span>
                                            <span className="block text-xs text-muted-foreground">
                                                {t('form.destinationExternalHint')}
                                            </span>
                                        </span>
                                    </button>
                                </div>

                                {destinationKind === 'own_page' ? (
                                    <p className="rounded-lg bg-muted/50 border px-3 py-2 text-xs text-muted-foreground break-all">
                                        {ownPageUrl}
                                    </p>
                                ) : (
                                    <Input
                                        id="ad-target"
                                        value={externalUrl}
                                        onChange={(e) => setExternalUrl(e.target.value)}
                                        placeholder={t('form.targetUrlPlaceholder')}
                                        autoFocus
                                    />
                                )}
                            </div>
                            {contentError && (
                                <p className="text-sm text-destructive">{contentError}</p>
                            )}
                        </>
                    ) : (
                        <>
                            {/* Emplacements */}
                            <div className="space-y-2">
                                <Label>{t('form.chooseVisibility')}</Label>
                                <div className="grid gap-2">
                                    {placements.map((p) => (
                                        <button
                                            key={p.placement}
                                            type="button"
                                            onClick={() => setPlacement(p.placement)}
                                            className={cn(
                                                'flex items-center justify-between rounded-lg border p-3 text-left transition-colors',
                                                placement === p.placement
                                                    ? 'border-primary bg-primary/5'
                                                    : 'hover:bg-muted'
                                            )}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium">
                                                        {t(`placements.${p.placement}.name`)}
                                                    </span>
                                                    <span className="flex items-center gap-0.5">
                                                        {Array.from({ length: p.visibilityLevel }).map((_, i) => (
                                                            <Eye key={i} className="h-3 w-3 text-primary" />
                                                        ))}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {t(`placements.${p.placement}.description`)}
                                                </p>
                                            </div>
                                            <span className="ml-3 text-sm font-semibold whitespace-nowrap">
                                                {formatPrice(p.dailyRate)}{tCommon('perDay')}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Durée */}
                            <div className="space-y-2">
                                <Label>{t('form.duration')}</Label>
                                <div className="flex flex-wrap gap-2">
                                    {durations.map((d) => (
                                        <button
                                            key={d.days}
                                            type="button"
                                            onClick={() => setDays(d.days)}
                                            className={cn(
                                                'relative rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                                                days === d.days
                                                    ? 'border-primary bg-primary/5 text-primary'
                                                    : 'hover:bg-muted'
                                            )}
                                        >
                                            {t('form.durationDays', { count: d.days })}
                                            {d.discountPercent > 0 && (
                                                <Badge className="absolute -top-2 -right-2 h-5 px-1.5 text-[10px] bg-emerald-600 hover:bg-emerald-600">
                                                    -{d.discountPercent}%
                                                </Badge>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Montant estimé */}
                            <div className="rounded-lg bg-muted/50 border p-4 space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        {placementName(placement)} × {t('form.durationDays', { count: days })}
                                    </span>
                                    <span>{formatPrice(quote.basePrice)}</span>
                                </div>
                                {quote.discountAmount > 0 && (
                                    <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
                                        <span>{t('form.longDurationDiscount')} (-{quote.discountPercent}%)</span>
                                        <span>-{formatPrice(quote.discountAmount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-semibold pt-2 border-t mt-2">
                                    <span>{t('form.estimatedPrice')}</span>
                                    <span className="text-primary text-lg">{formatPrice(quote.totalPrice)}</span>
                                </div>
                            </div>
                        </>
                    )}
                </ModalBody>
                <ModalFooter className="gap-2">
                    {step === 1 ? (
                        <>
                            <Button variant="outline" onClick={resetAndClose}>
                                {tCommon('cancel')}
                            </Button>
                            <Button onClick={goToStep2}>
                                {tCommon('next')}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" onClick={() => setStep(1)}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {tCommon('back')}
                            </Button>
                            <Button onClick={() => setCheckoutOpen(true)}>
                                {tCommon('next')}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </>
                    )}
                </ModalFooter>
            </Modal>

            <CheckoutModal
                open={checkoutOpen}
                onOpenChange={setCheckoutOpen}
                title={t('checkoutTitle')}
                lines={[
                    { label: t('campaign'), value: title || '—' },
                    { label: t('placement'), value: placementName(placement) },
                    { label: t('form.duration'), value: t('form.durationDays', { count: days }) },
                    ...(quote.discountAmount > 0
                        ? [{
                            label: t('form.longDurationDiscount'),
                            value: `-${formatPrice(quote.discountAmount)}`,
                            highlight: true,
                        }]
                        : []),
                ]}
                total={quote.totalPrice}
                onCheckout={(method, payerReference) =>
                    billingApi.checkoutAd(organizationId, {
                        title,
                        description: description || undefined,
                        imageUrl: imageUrl || undefined,
                        targetUrl,
                        placement,
                        days,
                        method,
                        payerReference,
                    })
                }
                onPaid={async () => {
                    await queryClient.invalidateQueries({ queryKey: ['organization-ads', organizationId] });
                    toast.success(t('successToast'));
                    resetAndClose();
                }}
            />
        </>
    );
}
