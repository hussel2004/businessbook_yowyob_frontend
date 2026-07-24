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
    Eye,
    Send,
    Archive,
    FileText,
    Calendar,
    ThumbsUp,
    MessageSquare,
    MoreVertical,
    Image as ImageIcon,
    ExternalLink,
} from 'lucide-react';
import type { Post, CreatePostInput } from '@/types/organization';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { uploadMedia } from '@/lib/api/organization';
import { getAssetUrl } from '@/lib/api/endpoints';

const postSchema = z.object({
    postType: z.string().min(1, 'Type requis'),
    title: z.string().min(3, 'Titre trop court').max(200, 'Titre trop long'),
    content: z.string().min(10, 'Contenu trop court'),
    excerpt: z.string().max(300, 'Résumé trop long').optional(),
    coverImageUrl: z.string().url().optional().or(z.literal('')),
});

type PostFormData = z.infer<typeof postSchema>;

interface PostsManagerProps {
    posts: Post[];
    isLoading?: boolean;
    organizationId: string;
    onCreatePost: (data: CreatePostInput) => Promise<void>;
    onUpdatePost: (postId: string, data: Partial<CreatePostInput>) => Promise<void>;
    onPublishPost: (postId: string) => Promise<void>;
    onArchivePost: (postId: string) => Promise<void>;
    onDeletePost: (postId: string) => Promise<void>;
}

const POST_TYPES = [
    { value: 'article', label: 'Article', icon: '📝' },
    { value: 'news', label: 'Actualité', icon: '📰' },
    { value: 'announcement', label: 'Annonce', icon: '📢' },
    { value: 'event', label: 'Événement', icon: '🎉' },
];

const STATUS_COLORS: Record<string, string> = {
    draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    published: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
};

const STATUS_LABELS: Record<string, string> = {
    draft: 'Brouillon',
    published: 'Publié',
    archived: 'Archivé',
};

export function PostsManager({
    posts,
    isLoading,
    organizationId,
    onCreatePost,
    onUpdatePost,
    onPublishPost,
    onArchivePost,
    onDeletePost,
}: PostsManagerProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<PostFormData>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            postType: 'article',
        },
    });

    const openCreateModal = () => {
        setEditingPost(null);
        reset({
            postType: 'article',
            title: '',
            content: '',
            excerpt: '',
            coverImageUrl: '',
        });
        setCoverFile(null);
        setCoverPreview(null);
        setIsModalOpen(true);
    };

    const openEditModal = (post: Post) => {
        setEditingPost(post);
        reset({
            postType: post.postType,
            title: post.title,
            content: post.content,
            excerpt: post.excerpt || '',
            coverImageUrl: post.coverImageUrl || '',
        });
        setCoverFile(null);
        setCoverPreview(post.coverImageUrl || null);
        setIsModalOpen(true);
    };

    const onSubmit = async (data: PostFormData) => {
        try {
            let coverImageUrl = data.coverImageUrl || undefined;

            // Upload cover image if a new file was selected
            if (coverFile) {
                setIsUploading(true);
                try {
                    const uploadedMedia = await uploadMedia(organizationId, coverFile);
                    coverImageUrl = getAssetUrl(uploadedMedia.fileUrl);
                } catch (uploadError) {
                    toast.error('Erreur lors du téléversement de l\'image');
                    setIsUploading(false);
                    return;
                }
                setIsUploading(false);
            }

            const postData: CreatePostInput = {
                postType: data.postType,
                title: data.title,
                content: data.content,
                excerpt: data.excerpt || undefined,
                coverImageUrl: coverImageUrl,
            };

            if (editingPost) {
                await onUpdatePost(editingPost.id, postData);
                toast.success('Publication mise à jour');
            } else {
                await onCreatePost(postData);
                toast.success('Publication créée');
            }
            setIsModalOpen(false);
            setCoverFile(null);
            setCoverPreview(null);
            reset();
        } catch (error) {
            toast.error('Une erreur est survenue');
        }
    };

    const handleDelete = async (postId: string) => {
        try {
            await onDeletePost(postId);
            toast.success('Publication supprimée');
            setDeleteConfirm(null);
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const handlePublish = async (postId: string) => {
        try {
            await onPublishPost(postId);
            toast.success('Publication publiée');
        } catch (error) {
            toast.error('Erreur lors de la publication');
        }
    };

    const handleArchive = async (postId: string) => {
        try {
            await onArchivePost(postId);
            toast.success('Publication archivée');
        } catch (error) {
            toast.error('Erreur lors de l\'archivage');
        }
    };

    const filteredPosts = posts.filter((post) => {
        if (filter === 'all') return true;
        return post.status === filter;
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    {(['all', 'draft', 'published', 'archived'] as const).map((status) => (
                        <Button
                            key={status}
                            variant={filter === status ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter(status)}
                        >
                            {status === 'all' ? 'Tous' : STATUS_LABELS[status]}
                            {status !== 'all' && (
                                <span className="ml-1 text-xs opacity-70">
                                    ({posts.filter((p) => p.status === status).length})
                                </span>
                            )}
                        </Button>
                    ))}
                </div>
                <Button onClick={openCreateModal}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle publication
                </Button>
            </div>

            {/* Posts List */}
            {filteredPosts.length === 0 ? (
                <EmptyState
                    icon={FileText}
                    title="Aucune publication"
                    description={
                        filter === 'all'
                            ? 'Créez votre première publication pour informer vos clients.'
                            : `Aucune publication avec le statut "${STATUS_LABELS[filter]}".`
                    }
                    action={
                        filter === 'all' ? (
                            <Button onClick={openCreateModal}>
                                <Plus className="h-4 w-4 mr-2" />
                                Créer une publication
                            </Button>
                        ) : undefined
                    }
                />
            ) : (
                <div className="space-y-4">
                    {filteredPosts.map((post) => (
                        <div
                            key={post.id}
                            className="group flex gap-4 p-4 border rounded-xl bg-card hover:shadow-lg transition-all"
                        >
                            {/* Cover Image */}
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                {post.coverImageUrl ? (
                                    <img
                                        src={post.coverImageUrl}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-lg">
                                                {POST_TYPES.find((t) => t.value === post.postType)?.icon}
                                            </span>
                                            <Badge className={STATUS_COLORS[post.status]}>
                                                {STATUS_LABELS[post.status]}
                                            </Badge>
                                        </div>
                                        <h3 className="font-semibold text-lg line-clamp-1">{post.title}</h3>
                                    </div>
                                </div>

                                {post.excerpt && (
                                    <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                                        {post.excerpt}
                                    </p>
                                )}

                                {/* Stats */}
                                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Eye className="h-4 w-4" />
                                        {post.viewCount}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <ThumbsUp className="h-4 w-4" />
                                        {post.likeCount}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageSquare className="h-4 w-4" />
                                        {post.commentCount}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {post.publishedAt
                                            ? format(new Date(post.publishedAt), 'dd MMM yyyy', { locale: fr })
                                            : formatDistanceToNow(new Date(post.createdAt), { locale: fr, addSuffix: true })}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {post.status === 'draft' && (
                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => handlePublish(post.id)}
                                    >
                                        <Send className="h-4 w-4 mr-1" />
                                        Publier
                                    </Button>
                                )}
                                {post.status === 'published' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleArchive(post.id)}
                                    >
                                        <Archive className="h-4 w-4 mr-1" />
                                        Archiver
                                    </Button>
                                )}
                                <Button variant="outline" size="sm" onClick={() => openEditModal(post)}>
                                    <Edit2 className="h-4 w-4 mr-1" />
                                    Modifier
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-500 hover:text-red-600"
                                    onClick={() => setDeleteConfirm(post.id)}
                                >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Supprimer
                                </Button>
                            </div>

                            {/* Delete Confirm */}
                            {deleteConfirm === post.id && (
                                <Modal open onOpenChange={() => setDeleteConfirm(null)}>
                                    <div className="p-6 text-center">
                                        <Trash2 className="h-12 w-12 mx-auto mb-4 text-red-500" />
                                        <h3 className="text-lg font-semibold mb-2">Supprimer cette publication ?</h3>
                                        <p className="text-muted-foreground mb-4">
                                            Cette action est irréversible.
                                        </p>
                                        <div className="flex justify-center gap-2">
                                            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                                                Annuler
                                            </Button>
                                            <Button variant="destructive" onClick={() => handleDelete(post.id)}>
                                                Supprimer
                                            </Button>
                                        </div>
                                    </div>
                                </Modal>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            <Modal open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    <h2 className="text-xl font-semibold">
                        {editingPost ? 'Modifier la publication' : 'Nouvelle publication'}
                    </h2>

                    {/* Type */}
                    <div className="space-y-2">
                        <Label htmlFor="postType">Type de publication</Label>
                        <Select {...register('postType')}>
                            {POST_TYPES.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.icon} {type.label}
                                </option>
                            ))}
                        </Select>
                        {errors.postType && (
                            <p className="text-sm text-red-500">{errors.postType.message}</p>
                        )}
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Titre</Label>
                        <Input
                            id="title"
                            placeholder="Titre de votre publication"
                            {...register('title')}
                            error={!!errors.title}
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-2">
                        <Label htmlFor="excerpt">Résumé (optionnel)</Label>
                        <Textarea
                            id="excerpt"
                            placeholder="Court résumé de votre publication..."
                            rows={2}
                            {...register('excerpt')}
                        />
                        {errors.excerpt && (
                            <p className="text-sm text-red-500">{errors.excerpt.message}</p>
                        )}
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <Label htmlFor="content">Contenu</Label>
                        <Textarea
                            id="content"
                            placeholder="Rédigez votre publication..."
                            rows={8}
                            {...register('content')}
                            error={!!errors.content}
                        />
                        {errors.content && (
                            <p className="text-sm text-red-500">{errors.content.message}</p>
                        )}
                    </div>

                    {/* Cover Image Upload */}
                    <div className="space-y-2">
                        <Label>Image de couverture (optionnel)</Label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setCoverFile(file);
                                    setCoverPreview(URL.createObjectURL(file));
                                }
                            }}
                        />
                        {coverPreview ? (
                            <div className="relative w-full h-40 rounded-lg overflow-hidden bg-muted">
                                <img
                                    src={coverPreview}
                                    alt="Aperçu"
                                    className="w-full h-full object-cover"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2"
                                    onClick={() => {
                                        setCoverFile(null);
                                        setCoverPreview(null);
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div
                                className="w-full h-40 rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">Cliquez pour ajouter une image</p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isSubmitting || isUploading}>
                            {isUploading
                                ? 'Téléversement...'
                                : isSubmitting
                                    ? 'Enregistrement...'
                                    : editingPost
                                        ? 'Mettre à jour'
                                        : 'Créer (brouillon)'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default PostsManager;
