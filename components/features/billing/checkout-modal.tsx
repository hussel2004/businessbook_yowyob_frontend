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
import {
    initiatePayment,
    isValidMomoNumber,
    PAYMENTS_DEMO_MODE,
    type PaymentMethod,
    type PaymentResult,
} from '@/lib/api/payments';

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
    /** Montant total en XAF */
    total: number;
    /** Référence de paiement (ex: BOOST-xxx) */
    reference: string;
    /** Appelé après un paiement réussi */
    onPaid: (payment: PaymentResult) => Promise<void> | void;
    /** Note affichée sous le récapitulatif (ex: info renouvellement) */
    footnote?: string;
}

/**
 * Récapitulatif de commande + paiement Mobile Money.
 * En mode démo (API paiement non branchée), le paiement est simulé.
 */
export function CheckoutModal({
    open,
    onOpenChange,
    title,
    lines,
    total,
    reference,
    onPaid,
    footnote,
}: CheckoutModalProps) {
    const t = useTranslations('payment');
    const tCommon = useTranslations('common');

    const [method, setMethod] = useState<PaymentMethod>('MTN_MOMO');
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState(false);
    const [processing, setProcessing] = useState(false);

    const methods: { id: PaymentMethod; label: string }[] = [
        { id: 'MTN_MOMO', label: t('mtnMomo') },
        { id: 'ORANGE_MONEY', label: t('orangeMoney') },
    ];

    const handlePay = async () => {
        if (!isValidMomoNumber(phone)) {
            setPhoneError(true);
            return;
        }
        setPhoneError(false);
        setProcessing(true);
        try {
            const result = await initiatePayment({
                amount: total,
                method,
                phoneNumber: phone,
                reference,
            });
            if (result.status === 'SUCCESS') {
                await onPaid(result);
                toast.success(t('success'));
                onOpenChange(false);
            } else {
                toast.error(t('failed'));
            }
        } catch {
            toast.error(t('failed'));
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Modal open={open} onOpenChange={processing ? () => undefined : onOpenChange}>
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
                        disabled={processing}
                    />
                    {phoneError && (
                        <p className="text-xs text-destructive">{t('phoneInvalid')}</p>
                    )}
                </div>

                {/* Notice mode démo */}
                {PAYMENTS_DEMO_MODE && (
                    <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-400">
                        <Info className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>{t('demoNotice')}</span>
                    </div>
                )}
            </ModalBody>
            <ModalFooter className="gap-2">
                <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={processing}
                >
                    {tCommon('cancel')}
                </Button>
                <Button onClick={handlePay} disabled={processing}>
                    {processing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t('processing')}
                        </>
                    ) : (
                        t('payNow')
                    )}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
