'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import { Flag, AlertTriangle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { reportReview, type ReportReviewRequest } from '@/lib/api/reviews';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils/cn';

const reportSchema = z.object({
    reason: z.enum(['spam', 'offensive', 'fake', 'inappropriate', 'other']),
    details: z.string().max(500).optional(),
});

type ReportFormValues = z.infer<typeof reportSchema>;

interface ReportReviewModalProps {
    reviewId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const REPORT_REASONS = [
    { value: 'spam', label: 'Spam ou publicité', icon: '🚫' },
    { value: 'offensive', label: 'Contenu offensant', icon: '😤' },
    { value: 'fake', label: 'Faux avis', icon: '🎭' },
    { value: 'inappropriate', label: 'Contenu inapproprié', icon: '⚠️' },
    { value: 'other', label: 'Autre raison', icon: '📝' },
] as const;

export function ReportReviewModal({ reviewId, open, onOpenChange }: ReportReviewModalProps) {
    const [selectedReason, setSelectedReason] = useState<string | null>(null);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ReportFormValues>({
        resolver: zodResolver(reportSchema),
    });

    const mutation = useMutation({
        mutationFn: (data: ReportReviewRequest) => reportReview(reviewId, data),
        onSuccess: () => {
            toast.success('Avis signalé. Merci pour votre vigilance.');
            reset();
            setSelectedReason(null);
            onOpenChange(false);
        },
        onError: () => {
            toast.error('Erreur lors du signalement.');
        },
    });

    const onSubmit = (data: ReportFormValues) => {
        mutation.mutate(data);
    };

    const handleReasonSelect = (reason: string) => {
        setSelectedReason(reason);
        setValue('reason', reason as ReportFormValues['reason'], { shouldValidate: true });
    };

    return (
        <Modal open={open} onOpenChange={onOpenChange}>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                        <Flag className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Signaler cet avis</h2>
                        <p className="text-sm text-muted-foreground">
                            Dites-nous pourquoi cet avis pose problème
                        </p>
                    </div>
                </div>

                {/* Reason Selection */}
                <div className="space-y-3">
                    <Label>Raison du signalement</Label>
                    <div className="grid gap-2">
                        {REPORT_REASONS.map((reason) => (
                            <button
                                key={reason.value}
                                type="button"
                                onClick={() => handleReasonSelect(reason.value)}
                                className={cn(
                                    'flex items-center gap-3 p-3 rounded-lg border text-left transition-all',
                                    selectedReason === reason.value
                                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                        : 'hover:border-muted-foreground/50 hover:bg-muted/50'
                                )}
                            >
                                <span className="text-xl">{reason.icon}</span>
                                <span className="font-medium">{reason.label}</span>
                            </button>
                        ))}
                    </div>
                    <input type="hidden" {...register('reason')} />
                    {errors.reason && (
                        <p className="text-sm text-red-500">Veuillez sélectionner une raison</p>
                    )}
                </div>

                {/* Additional Details */}
                <div className="space-y-2">
                    <Label htmlFor="details">Détails (optionnel)</Label>
                    <Textarea
                        id="details"
                        placeholder="Ajoutez des informations supplémentaires..."
                        rows={3}
                        {...register('details')}
                    />
                    {errors.details && (
                        <p className="text-sm text-red-500">{errors.details.message}</p>
                    )}
                </div>

                {/* Warning */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-200 text-sm">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p>
                        Les faux signalements peuvent entraîner des sanctions sur votre compte.
                        Merci de n&apos;utiliser cette fonction que pour des avis réellement problématiques.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        variant="destructive"
                        disabled={mutation.isPending || !selectedReason}
                    >
                        {mutation.isPending ? 'Envoi...' : 'Signaler'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default ReportReviewModal;
