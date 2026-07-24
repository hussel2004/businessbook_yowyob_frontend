'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrganizationBySlug } from '@/lib/api/public';
import {
    getOrganizationPosts,
    createPost,
    updatePost,
    publishPost,
    archivePost,
    deletePost,
} from '@/lib/api/organization';
import { PostsManager } from '@/components/features/dashboard';
import type { CreatePostInput } from '@/types/organization';

export default function PostsPage() {
    const params = useParams();
    const slug = params.slug as string;
    const queryClient = useQueryClient();

    // Get organization first
    const { data: org } = useQuery({
        queryKey: ['organization', slug],
        queryFn: () => getOrganizationBySlug(slug),
    });

    // Get posts
    const { data: postsData, isLoading } = useQuery({
        queryKey: ['organization-posts', org?.id],
        queryFn: () => getOrganizationPosts(org!.id, { size: 50 }),
        enabled: !!org?.id,
    });

    // Create mutation
    const createMutation = useMutation({
        mutationFn: async (data: CreatePostInput) => {
            if (!org?.id) throw new Error('Organization not found');
            return createPost(org.id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organization-posts', org?.id] });
        },
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: async ({ postId, data }: { postId: string; data: Partial<CreatePostInput> }) => {
            return updatePost(postId, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organization-posts', org?.id] });
        },
    });

    // Publish mutation
    const publishMutation = useMutation({
        mutationFn: publishPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organization-posts', org?.id] });
        },
    });

    // Archive mutation
    const archiveMutation = useMutation({
        mutationFn: archivePost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organization-posts', org?.id] });
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: deletePost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organization-posts', org?.id] });
        },
    });

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Publications</h2>
                <p className="text-muted-foreground mt-1">
                    Partagez des actualités, articles et annonces avec vos clients
                </p>
            </div>

            <PostsManager
                posts={postsData?.content || []}
                isLoading={isLoading}
                organizationId={org?.id || ''}
                onCreatePost={async (data) => { await createMutation.mutateAsync(data); }}
                onUpdatePost={async (postId, data) => { await updateMutation.mutateAsync({ postId, data }); }}
                onPublishPost={async (postId) => { await publishMutation.mutateAsync(postId); }}
                onArchivePost={async (postId) => { await archiveMutation.mutateAsync(postId); }}
                onDeletePost={async (postId) => { await deleteMutation.mutateAsync(postId); }}
            />
        </div>
    );
}
