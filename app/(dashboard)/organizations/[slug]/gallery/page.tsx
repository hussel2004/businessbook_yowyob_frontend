'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrganizationBySlug } from '@/lib/api/public';
import {
    getOrganizationGallery,
    uploadMedia,
    updateMedia,
    deleteMedia,
    setMediaAsCover,
    reorderMedia,
} from '@/lib/api/organization';
import { MediaGalleryManager } from '@/components/features/dashboard';
import type { OrganizationMedia } from '@/types/organization';
import toast from 'react-hot-toast';

export default function GalleryPage() {
    const params = useParams();
    const slug = params.slug as string;
    const queryClient = useQueryClient();

    // Get organization first
    const { data: org } = useQuery({
        queryKey: ['organization', slug],
        queryFn: () => getOrganizationBySlug(slug),
    });

    // Get gallery
    const { data: gallery, isLoading } = useQuery({
        queryKey: ['organization-gallery', org?.id],
        queryFn: () => getOrganizationGallery(org!.id),
        enabled: !!org?.id,
    });

    // Upload mutation
    const uploadMutation = useMutation({
        mutationFn: async (file: File) => {
            if (!org?.id) throw new Error('Organization not found');
            return uploadMedia(org.id, file);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organization-gallery', org?.id] });
        },
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: async ({ mediaId, data }: { mediaId: string; data: Partial<OrganizationMedia> }) => {
            return updateMedia(mediaId, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organization-gallery', org?.id] });
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: deleteMedia,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organization-gallery', org?.id] });
        },
    });

    // Set cover mutation
    const setCoverMutation = useMutation({
        mutationFn: setMediaAsCover,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organization-gallery', org?.id] });
            queryClient.invalidateQueries({ queryKey: ['organization', slug] });
        },
    });

    // Reorder mutation
    const reorderMutation = useMutation({
        mutationFn: async (mediaIds: string[]) => {
            if (!org?.id) throw new Error('Organization not found');
            return reorderMedia('organization', org.id, mediaIds);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organization-gallery', org?.id] });
        },
    });

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Galerie photos</h2>
                <p className="text-muted-foreground mt-1">
                    Ajoutez des photos pour présenter votre entreprise aux visiteurs
                </p>
            </div>

            <MediaGalleryManager
                media={gallery || []}
                isLoading={isLoading}
                organizationId={org?.id || ''}
                onUpload={async (file) => { await uploadMutation.mutateAsync(file); }}
                onDelete={async (mediaId) => { await deleteMutation.mutateAsync(mediaId); }}
                onSetCover={async (mediaId) => { await setCoverMutation.mutateAsync(mediaId); }}
                onUpdate={async (mediaId, data) => { await updateMutation.mutateAsync({ mediaId, data }); }}
                onReorder={async (mediaIds) => { await reorderMutation.mutateAsync(mediaIds); }}
                maxFiles={20}
            />
        </div>
    );
}
