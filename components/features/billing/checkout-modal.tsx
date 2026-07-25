'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Smartphone, Info, Loader2 } from 'lucide-react';
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
import { cn } from '@/lib/utils/cn';
import { formatPrice } from '@/lib/utils/format';
import type { CheckoutResponse, PaymentMethod } from '@/lib/api/billing';

export interface CheckoutLine {
    label: string;
    value: string;
    highlight?: boolean;
}

interface CheckoutModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    /** Lignes du récapitulatif (formule, période, réduction…) */
    lines: CheckoutLine[];
    /**
     * Montant affiché, à titre indicatif. Le montant réellement encaissé est
     * recalculé par le serveur — le client n'en envoie jamais.
     */
    total: number;
    /**
     * Lance l'encaissement côté serveur. Renvoie l'ordre de paiement, dont la
     * redirectUrl vers le fournisseur.
     */
    onCheckout: (method: PaymentMethod, payerReference: string) => Promise<CheckoutResponse>;
    /** Appelé quand le paiement est acquitté sans redirection (cas rare). */
    onPaid?: () => Promise<void> | void;
    /** Note affichée sous le récapitulatif (ex: info renouvellement) */
    footnote?: string;
}

function isValidMomoNumber(phone: string): boolean {
    const digits = phone.replace(/\D/g, '');
    return /^6\d{8}$/.test(digits) || /^2376\d{8}$/.test(digits);
}

/**
 * Récapitulatif de commande puis paiement Mobile Money.
 *
 * Le paiement se conclut chez le fournisseur : on récupère une URL de paiement
 * auprès du serveur et on y redirige l'utilisateur. La confirmation se fait au
 * retour, côté page, en relisant le statut — jamais sur la seule redirection.
 */
export function CheckoutModal({
    open,
    onOpenChange,
    title,
    lines,
    total,
    onCheckout,
    onPaid,
    footnote,
}: CheckoutModalProps) {
    const t = useTranslations('payment');
    const tCommon = useTranslations('common');

    const [method, setMethod] = useState<PaymentMethod>('MOBILE_MONEY');
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [redirecting, setRedirecting] = useState(false);

    const handlePay = async () => {
        if (method === 'MOBILE_MONEY' && !isValidMomoNumber(phone)) {
            setPhoneError(true);
            return;
        }
        setPhoneError(false);
        setProcessing(true);
        try {
            const order = await onCheckout(method, phone.replace(/\D/g, ''));

            if (order.redirectUrl) {
                // Le fournisseur prend la main : on quitte l'application.
                setRedirecting(true);
                window.location.href = order.redirectUrl;
                return;
            }

            if (order.status === 'SUCCESS') {
                await onPaid?.();
                toast.success(t('success'));
                onOpenChange(false);
            } else if (order.status === 'CANCELLED') {
                toast.error(t('cancelled'));
            } else if (order.status === 'PENDING') {
                toast(t('pending'));
                onOpenChange(false);
            } else {
                toast.error(t('failed'));
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : t('failed');
            toast.error(message || t('failed'));
        } finally {
            setProcessing(false);
        }
    };

    const busy = processing || redirecting;

    const methods: { id: PaymentMethod; label: string }[] = [
        { id: 'MOBILE_MONEY', label: t('mtnMomo') },
    ];

    return (
        <Modal open={open} onOpenChange={busy ? () => undefined : onOpenChange}>
            <ModalHeader>
                <ModalTitle>{title}</ModalTitle>
            </ModalHeader>
            <ModalBody className="space-y-6">
                {/* Récapitulatif */}
                <div className="rounded-lg border divide-y">
                    {lines.map((line, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                'flex items-center justify-between px-4 py-3 text-sm',
                                line.highlight && 'text-emerald-600 dark:text-emerald-400'
                            )}
                        >
                            <span className="text-muted-foreground">{line.label}</span>
                            <span className="font-medium">{line.value}</span>
                        </div>
                    ))}
                    <div className="flex items-center justify-between px-4 py-3">
                        <span className="font-semibold">{tCommon('total')}</span>
                        <span className="text-lg font-bold text-primary">{formatPrice(total)}</span>
                    </div>
                </div>

                {footnote && (
                    <p className="text-xs text-muted-foreground">{footnote}</p>
                )}

                {/* Moyen de paiement */}
                <div className="space-y-2">
                    <Label>{t('method')}</Label>
                    <div className="grid grid-cols-2 gap-3">
                        {methods.map((m) => (
                            <button
                                key={m.id}
                                type="button"
                                onClick={() => setMethod(m.id)}
                                disabled={busy}
                                className={cn(
                                    'flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors',
                                    method === m.id
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'hover:bg-muted'
                                )}
                            >
                                <Smartphone className="h-4 w-4 shrink-0" />
                                {m.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Numéro */}
                <div className="space-y-2">
                    <Label htmlFor="momo-phone">{t('phoneNumber')}</Label>
                    <Input
                        id="momo-phone"
                        type="tel"
                        placeholder={t('phonePlaceholder')}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={busy}
                    />
                    {phoneError && (
                        <p className="text-xs text-destructive">{t('phoneInvalid')}</p>
                    )}
                </div>

                {/* Le paiement se finalise chez l'opérateur */}
                <div className="flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs text-muted-foreground">
                    <Info className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                    <span>{t('redirectNotice')}</span>
                </div>
            </ModalBody>
            <ModalFooter className="gap-2">
                <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={busy}
                >
                    {tCommon('cancel')}
                </Button>
                <Button onClick={handlePay} disabled={busy}>
                    {busy ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {redirecting ? t('redirecting') : t('processing')}
                        </>
                    ) : (
                        t('payNow')
                    )}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
