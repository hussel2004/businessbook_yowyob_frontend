'use client';

import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import {
    Plus,
    Edit2,
    Trash2,
    Play,
    Pause,
    Tag,
    Calendar,
    Percent,
    DollarSign,
    Users,
    Copy,
    Check,
    Image as ImageIcon,
} from 'lucide-react';
import type { Promotion, CreatePromotionInput } from '@/types/organization';
import { format, isPast, isFuture, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { uploadMedia } from '@/lib/api/organization';
import { getAssetUrl } from '@/lib/api/endpoints';

const promotionSchema = z.object({
    title: z.string().min(3, 'Titre trop court').max(100, 'Titre trop long'),
    description: z.string().max(500, 'Description trop longue').optional(),
    promoType: z.string().min(1, 'Type requis'),
    discountType: z.string().optional(),
    discountValue: z.coerce.number().min(0).optional(),
    promoCode: z.string().max(20, 'Code trop long').optional(),
    imageUrl: z.string().url().optional().or(z.literal('')),
    termsConditions: z.string().max(1000).optional(),
    startDate: z.string().min(1, 'Date de début requise'),
    endDate: z.string().min(1, 'Date de fin requise'),
    maxUses: z.coerce.number().min(0).optional(),
});

type PromotionFormData = z.infer<typeof promotionSchema>;

interface PromotionsManagerProps {
    promotions: Promotion[];
    isLoading?: boolean;
    organizationId: string;
    onCreatePromotion: (data: CreatePromotionInput) => Promise<void>;
    onUpdatePromotion: (promotionId: string, data: Partial<CreatePromotionInput>) => Promise<void>;
    onActivatePromotion: (promotionId: string) => Promise<void>;
    onPausePromotion: (promotionId: string) => Promise<void>;
    onDeletePromotion: (promotionId: string) => Promise<void>;
}

const PROMO_TYPES = [
    { value: 'discount', label: 'Réduction', icon: <Percent className="h-4 w-4" /> },
    { value: 'offer', label: 'Offre spéciale', icon: <Tag className="h-4 w-4" /> },
    { value: 'flash_sale', label: 'Vente flash', icon: <DollarSign className="h-4 w-4" /> },
    { value: 'bundle', label: 'Pack', icon: <Tag className="h-4 w-4" /> },
    { value: 'loyalty', label: 'Fidélité', icon: <Users className="h-4 w-4" /> },
    { value: 'other', label: 'Autre', icon: <Tag className="h-4 w-4" /> },
];

const DISCOUNT_TYPES = [
    { value: 'percentage', label: 'Pourcentage (%)' },
    { value: 'fixed_amount', label: 'Montant fixe (XAF)' },
    { value: 'buy_x_get_y', label: 'Achetez X, obtenez Y' },
];

const STATUS_COLORS: Record<string, string> = {
    draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    paused: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    expired: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const STATUS_LABELS: Record<string, string> = {
    draft: 'Brouillon',
    active: 'Active',
    paused: 'En pause',
    expired: 'Expirée',
    cancelled: 'Annulée',
};

export function PromotionsManager({
    promotions,
    isLoading,
    organizationId,
    onCreatePromotion,
    onUpdatePromotion,
    onActivatePromotion,
    onPausePromotion,
    onDeletePromotion,
}: PromotionsManagerProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'active' | 'draft' | 'expired'>('all');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<PromotionFormData>({
        resolver: zodResolver(promotionSchema),
        defaultValues: {
            promoType: 'discount',
            discountType: 'percentage',
        },
    });

    const selectedPromoType = watch('promoType');

    const openCreateModal = () => {
        setEditingPromotion(null);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        reset({
            promoType: 'discount',
            discountType: 'percentage',
            title: '',
            description: '',
            promoCode: '',
            imageUrl: '',
            termsConditions: '',
            startDate: format(tomorrow, 'yyyy-MM-dd'),
            endDate: format(nextMonth, 'yyyy-MM-dd'),
            maxUses: undefined,
            discountValue: undefined,
        });
        setImageFile(null);
        setImagePreview(null);
        setIsModalOpen(true);
    };

    const openEditModal = (promo: Promotion) => {
        setEditingPromotion(promo);
        reset({
            promoType: promo.promoType,
            discountType: promo.discountType || 'percentage',
            title: promo.title,
            description: promo.description || '',
            promoCode: promo.promoCode || '',
            imageUrl: promo.imageUrl || '',
            termsConditions: promo.termsConditions || '',
            startDate: format(new Date(promo.startDate), 'yyyy-MM-dd'),
            endDate: format(new Date(promo.endDate), 'yyyy-MM-dd'),
            maxUses: promo.maxUses || undefined,
            discountValue: promo.discountValue || undefined,
        });
        setImageFile(null);
        setImagePreview(promo.imageUrl || null);
        setIsModalOpen(true);
    };

    const onSubmit = async (data: PromotionFormData) => {
        try {
            let imageUrl = data.imageUrl || undefined;

            // Upload image if a new file was selected
            if (imageFile) {
                setIsUploading(true);
                try {
                    const uploadedMedia = await uploadMedia(organizationId, imageFile);
                    imageUrl = getAssetUrl(uploadedMedia.fileUrl);
                } catch (uploadError) {
                    toast.error('Erreur lors du téléversement de l\'image');
                    setIsUploading(false);
                    return;
                }
                setIsUploading(false);
            }

            const promoData: CreatePromotionInput = {
                title: data.title,
                description: data.description || undefined,
                promoType: data.promoType,
                discountType: data.discountType || undefined,
                discountValue: data.discountValue || undefined,
                promoCode: data.promoCode || undefined,
                imageUrl: imageUrl,
                termsConditions: data.termsConditions || undefined,
                startDate: new Date(data.startDate).toISOString(),
                endDate: new Date(data.endDate).toISOString(),
                maxUses: data.maxUses || undefined,
            };

            if (editingPromotion) {
                await onUpdatePromotion(editingPromotion.id, promoData);
                toast.success('Promotion mise à jour');
            } else {
                await onCreatePromotion(promoData);
                toast.success('Promotion créée');
            }
            setIsModalOpen(false);
            setImageFile(null);
            setImagePreview(null);
            reset();
        } catch (error) {
            toast.error('Une erreur est survenue');
        }
    };

    const handleDelete = async (promoId: string) => {
        try {
            await onDeletePromotion(promoId);
            toast.success('Promotion supprimée');
            setDeleteConfirm(null);
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const handleActivate = async (promoId: string) => {
        try {
            await onActivatePromotion(promoId);
            toast.success('Promotion activée');
        } catch (error) {
            toast.error('Erreur lors de l\'activation');
        }
    };

    const handlePause = async (promoId: string) => {
        try {
            await onPausePromotion(promoId);
            toast.success('Promotion mise en pause');
        } catch (error) {
            toast.error('Erreur lors de la mise en pause');
        }
    };

    const copyPromoCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        toast.success('Code copié!');
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const getPromoStatus = (promo: Promotion): string => {
        if (promo.status === 'active' && isPast(new Date(promo.endDate))) {
            return 'expired';
        }
        return promo.status;
    };

    const filteredPromos = promotions.filter((promo) => {
        if (filter === 'all') return true;
        const status = getPromoStatus(promo);
        return status === filter;
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-40 w-full rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                    {(['all', 'active', 'draft', 'expired'] as const).map((status) => (
                        <Button
                            key={status}
                            variant={filter === status ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter(status)}
                        >
                            {status === 'all' ? 'Toutes' : STATUS_LABELS[status] || status}
                        </Button>
                    ))}
                </div>
                <Button onClick={openCreateModal}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle promotion
                </Button>
            </div>

            {/* Promotions List */}
            {filteredPromos.length === 0 ? (
                <EmptyState
                    icon={Tag}
                    title="Aucune promotion"
                    description="Créez des promotions pour attirer de nouveaux clients."
                    action={
                        <Button onClick={openCreateModal}>
                            <Plus className="h-4 w-4 mr-2" />
                            Créer une promotion
                        </Button>
                    }
                />
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {filteredPromos.map((promo) => {
                        const status = getPromoStatus(promo);
                        const promoType = PROMO_TYPES.find((t) => t.value === promo.promoType);
                        const isExpired = isPast(new Date(promo.endDate));
                        const startsInFuture = isFuture(new Date(promo.startDate));

                        return (
                            <div
                                key={promo.id}
                                className={`group relative overflow-hidden border rounded-xl bg-card transition-all hover:shadow-lg ${isExpired ? 'opacity-60' : ''
                                    }`}
                            >
                                {/* Header with Image */}
                                <div className="relative h-32 bg-gradient-to-r from-primary/20 to-secondary/20">
                                    {promo.imageUrl && (
                                        <img
                                            src={getAssetUrl(promo.imageUrl) || ''}
                                            alt={promo.title}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                    {/* Status Badge */}
                                    <Badge className={`absolute top-3 left-3 ${STATUS_COLORS[status]}`}>
                                        {STATUS_LABELS[status]}
                                    </Badge>

                                    {/* Discount Display */}
                                    {promo.discountValue && (
                                        <div className="absolute top-3 right-3 bg-white dark:bg-gray-900 px-3 py-1 rounded-full font-bold text-lg shadow-lg">
                                            {promo.discountType === 'percentage' ? (
                                                <span className="text-green-600">-{promo.discountValue}%</span>
                                            ) : (
                                                <span className="text-green-600">-{promo.discountValue.toLocaleString()} XAF</span>
                                            )}
                                        </div>
                                    )}

                                    {/* Title on Image */}
                                    <div className="absolute bottom-3 left-3 right-3">
                                        <h3 className="font-bold text-white text-lg line-clamp-1">{promo.title}</h3>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 space-y-3">
                                    {promo.description && (
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {promo.description}
                                        </p>
                                    )}

                                    {/* Promo Code */}
                                    {promo.promoCode && (
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-muted/50 border-2 border-dashed border-primary/30 rounded-lg px-3 py-2 font-mono font-bold text-center">
                                                {promo.promoCode}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => copyPromoCode(promo.promoCode!)}
                                            >
                                                {copiedCode === promo.promoCode ? (
                                                    <Check className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    )}

                                    {/* Dates */}
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            {format(new Date(promo.startDate), 'dd MMM', { locale: fr })} →{' '}
                                            {format(new Date(promo.endDate), 'dd MMM yyyy', { locale: fr })}
                                        </span>
                                        {startsInFuture && (
                                            <Badge variant="outline" className="text-xs">
                                                Commence {formatDistanceToNow(new Date(promo.startDate), { locale: fr, addSuffix: true })}
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Usage Stats */}
                                    {promo.maxUses && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <div className="flex-1 bg-muted rounded-full h-2">
                                                <div
                                                    className="bg-primary h-2 rounded-full transition-all"
                                                    style={{ width: `${Math.min((promo.usedCount / promo.maxUses) * 100, 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-muted-foreground">
                                                {promo.usedCount}/{promo.maxUses}
                                            </span>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 pt-2 border-t">
                                        {status === 'draft' || status === 'paused' ? (
                                            <Button
                                                size="sm"
                                                onClick={() => handleActivate(promo.id)}
                                                disabled={isExpired}
                                            >
                                                <Play className="h-4 w-4 mr-1" />
                                                Activer
                                            </Button>
                                        ) : status === 'active' ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlePause(promo.id)}
                                            >
                                                <Pause className="h-4 w-4 mr-1" />
                                                Pause
                                            </Button>
                                        ) : null}
                                        <Button variant="outline" size="sm" onClick={() => openEditModal(promo)}>
                                            <Edit2 className="h-4 w-4 mr-1" />
                                            Modifier
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-600 ml-auto"
                                            onClick={() => setDeleteConfirm(promo.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Delete Confirm */}
                                {deleteConfirm === promo.id && (
                                    <Modal open onOpenChange={() => setDeleteConfirm(null)}>
                                        <div className="p-6 text-center">
                                            <Trash2 className="h-12 w-12 mx-auto mb-4 text-red-500" />
                                            <h3 className="text-lg font-semibold mb-2">Supprimer cette promotion ?</h3>
                                            <p className="text-muted-foreground mb-4">Cette action est irréversible.</p>
                                            <div className="flex justify-center gap-2">
                                                <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                                                    Annuler
                                                </Button>
                                                <Button variant="destructive" onClick={() => handleDelete(promo.id)}>
                                                    Supprimer
                                                </Button>
                                            </div>
                                        </div>
                                    </Modal>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create/Edit Modal */}
            <Modal open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
                    <h2 className="text-xl font-semibold">
                        {editingPromotion ? 'Modifier la promotion' : 'Nouvelle promotion'}
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {/* Type */}
                        <div className="space-y-2">
                            <Label htmlFor="promoType">Type</Label>
                            <Select {...register('promoType')}>
                                {PROMO_TYPES.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        {/* Title */}
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="title">Titre</Label>
                            <Input
                                id="title"
                                placeholder="Ex: Soldes d'été -30%"
                                {...register('title')}
                                error={!!errors.title}
                            />
                            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                        </div>

                        {/* Discount Type & Value */}
                        {selectedPromoType === 'discount' && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="discountType">Type de réduction</Label>
                                    <Select {...register('discountType')}>
                                        {DISCOUNT_TYPES.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="discountValue">Valeur</Label>
                                    <Input
                                        id="discountValue"
                                        type="number"
                                        min="0"
                                        placeholder="Ex: 30"
                                        {...register('discountValue')}
                                    />
                                </div>
                            </>
                        )}

                        {/* Promo Code */}
                        <div className="space-y-2">
                            <Label htmlFor="promoCode">Code promo (optionnel)</Label>
                            <Input
                                id="promoCode"
                                placeholder="Ex: ETE2026"
                                className="font-mono uppercase"
                                {...register('promoCode')}
                            />
                        </div>

                        {/* Max Uses */}
                        <div className="space-y-2">
                            <Label htmlFor="maxUses">Nombre max d&apos;utilisations</Label>
                            <Input
                                id="maxUses"
                                type="number"
                                min="0"
                                placeholder="Illimité si vide"
                                {...register('maxUses')}
                            />
                        </div>

                        {/* Dates */}
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Date de début</Label>
                            <Input id="startDate" type="date" {...register('startDate')} error={!!errors.startDate} />
                            {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endDate">Date de fin</Label>
                            <Input id="endDate" type="date" {...register('endDate')} error={!!errors.endDate} />
                            {errors.endDate && <p className="text-sm text-red-500">{errors.endDate.message}</p>}
                        </div>

                        {/* Description */}
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Décrivez votre promotion..."
                                rows={3}
                                {...register('description')}
                            />
                        </div>

                        {/* Terms */}
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="termsConditions">Conditions (optionnel)</Label>
                            <Textarea
                                id="termsConditions"
                                placeholder="Conditions d'utilisation..."
                                rows={2}
                                {...register('termsConditions')}
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2 sm:col-span-2">
                            <Label>Image (optionnel)</Label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setImageFile(file);
                                        setImagePreview(URL.createObjectURL(file));
                                    }
                                }}
                            />
                            {imagePreview ? (
                                <div className="relative w-full h-32 rounded-lg overflow-hidden bg-muted">
                                    <img
                                        src={imagePreview}
                                        alt="Aperçu"
                                        className="w-full h-full object-cover"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={() => {
                                            setImageFile(null);
                                            setImagePreview(null);
                                            if (fileInputRef.current) fileInputRef.current.value = '';
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div
                                    className="w-full h-32 rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">Cliquez pour ajouter une image</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isSubmitting || isUploading}>
                            {isUploading
                                ? 'Téléversement...'
                                : isSubmitting
                                    ? 'Enregistrement...'
                                    : editingPromotion
                                        ? 'Mettre à jour'
                                        : 'Créer (brouillon)'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default PromotionsManager;
