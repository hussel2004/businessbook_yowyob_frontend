'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrganizationBySlug } from '@/lib/api/public';
import {
    getVerificationDocuments,
    submitVerificationDocument,
    deleteVerificationDocument,
    checkOrganizationVerified,
} from '@/lib/api/organization';
import { upload } from '@/lib/api/client';
import { VerificationManager } from '@/components/features/dashboard';
import type { CreateVerificationInput } from '@/types/organization';

export default function VerificationPage() {
    const params = useParams();
    const slug = params.slug as string;
    const queryClient = useQueryClient();

    // Get organization first
    const { data: org } = useQuery({
        queryKey: ['organization', slug],
        queryFn: () => getOrganizationBySlug(slug),
    });

    // Check if verified
    const { data: verificationStatus } = useQuery({
        queryKey: ['organization-verified', org?.id],
        queryFn: () => checkOrganizationVerified(org!.id),
        enabled: !!org?.id,
    });

    // Get verification documents
    const { data: documents, isLoading } = useQuery({
        queryKey: ['organization-verification', org?.id],
        queryFn: () => getVerificationDocuments(org!.id),
        enabled: !!org?.id,
    });

    // Submit document mutation
    const submitMutation = useMutation({
        mutationFn: async (data: CreateVerificationInput) => {
            if (!org?.id) throw new Error('Organization not found');
            return submitVerificationDocument(org.id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organization-verification', org?.id] });
        },
    });

    // Delete document mutation
    const deleteMutation = useMutation({
        mutationFn: deleteVerificationDocument,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organization-verification', org?.id] });
        },
    });

    // Upload file handler
    const handleUploadFile = async (file: File): Promise<string> => {
        if (!org?.id) throw new Error('Organization not found');
        // Upload to a general media endpoint and get URL back
        const result = await upload<{ fileUrl: string }>(`/organizations/${org.id}/media`, file, {
            mediableType: 'verification',
        });
        return result.fileUrl;
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Vérification</h2>
                <p className="text-muted-foreground mt-1">
                    Soumettez vos documents officiels pour obtenir le badge de vérification
                </p>
            </div>

            <VerificationManager
                documents={documents || []}
                isLoading={isLoading}
                organizationId={org?.id || ''}
                isVerified={org?.isVerified || verificationStatus?.verified || false}
                onSubmitDocument={async (data) => { await submitMutation.mutateAsync(data); }}
                onDeleteDocument={async (docId) => { await deleteMutation.mutateAsync(docId); }}
                onUploadFile={handleUploadFile}
            />
        </div>
    );
}
