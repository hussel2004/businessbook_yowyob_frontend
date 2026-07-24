'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrganizationBySlug } from '@/lib/api/public';
import {
    getOrganizationPromotions,
    createPromotion,
    updatePromotion,
    activatePromotion,
    pausePromotion,
    deletePromotion,
} from '@/lib/api/organization';
import { PromotionsManager } from '@/components/features/dashboard';
import type { CreatePromotionInput } from '@/types/organization';

export default function PromotionsPage() {
    const params = useParams();
    const slug = params.slug as string;
    const queryClient = useQueryClient();

    // Get organization first
    const { data: org } = useQuery({
        queryKey: ['organization', slug],
        queryFn: () => getOrganizationBySlug(slug),
    });

    // Get promotions
    const { data: promosData, isLoading } = useQuery({
        queryKey: ['organization-promotions', org?.id],
        queryFn: () => getOrganizationPromotions(org!.id, { size: 50 }),
        enabled: !!org?.id,
    });

    // Create mutation
    const createMutation = useMutation({
        mutationFn: async (data: CreatePromotionInput) => {
            if (!org?.id) throw new Error('Organization not found');
            return createPromotion(org.id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organization-promotions', org?.id] });
        },
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: async ({ promoId, data }: { promoId: string; data: Partial<CreatePromotionInput> }) => {
            return updatePromotion(promoId, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organization-promotions', org?.id] });
        },
    });

    // Activate mutation
    const activateMutation = useMutation({
        mutationFn: activatePromotion,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organization-promotions', org?.id] });
        },
    });

    // Pause mutation
    const pauseMutation = useMutation({
        mutationFn: pausePromotion,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organization-promotions', org?.id] });
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: deletePromotion,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organization-promotions', org?.id] });
        },
    });

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Promotions</h2>
                <p className="text-muted-foreground mt-1">
                    Créez des offres spéciales et promotions pour attirer de nouveaux clients
                </p>
            </div>

            <PromotionsManager
                promotions={promosData?.content || []}
                isLoading={isLoading}
                organizationId={org?.id || ''}
                onCreatePromotion={async (data) => { await createMutation.mutateAsync(data); }}
                onUpdatePromotion={async (promoId, data) => { await updateMutation.mutateAsync({ promoId, data }); }}
                onActivatePromotion={async (promoId) => { await activateMutation.mutateAsync(promoId); }}
                onPausePromotion={async (promoId) => { await pauseMutation.mutateAsync(promoId); }}
                onDeletePromotion={async (promoId) => { await deleteMutation.mutateAsync(promoId); }}
            />
        </div>
    );
}
