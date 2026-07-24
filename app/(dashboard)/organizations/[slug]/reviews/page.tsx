'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrganizationBySlug } from '@/lib/api/public';
import {
    getOwnerReviews,
    getReviewSummary,
    respondToReview,
    deleteReviewResponse,
    type Review,
    type ReviewSummary,
} from '@/lib/api/reviews';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Avatar } from '@/components/ui/avatar';
import {
    Star,
    MessageSquare,
    Send,
    Edit2,
    Trash2,
    ThumbsUp,
    ThumbsDown,
    Flag,
    Eye,
    Filter,
    ChevronDown,
    User,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils/cn';

export default function ReviewsManagementPage() {
    const params = useParams();
    const slug = params.slug as string;
    const queryClient = useQueryClient();

    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [responseText, setResponseText] = useState('');
    const [filter, setFilter] = useState<'all' | 'pending' | 'published' | 'flagged'>('all');
    const [editingResponse, setEditingResponse] = useState<string | null>(null);

    // Get organization
    const { data: org } = useQuery({
        queryKey: ['organization', slug],
        queryFn: () => getOrganizationBySlug(slug),
    });

    // Get reviews
    const { data: reviewsData, isLoading } = useQuery({
        queryKey: ['owner-reviews', org?.id, filter],
        queryFn: () => getOwnerReviews(org!.id, {
            size: 50,
            status: filter !== 'all' ? filter : undefined
        }),
        enabled: !!org?.id,
    });

    // Get summary
    const { data: summary } = useQuery({
        queryKey: ['review-summary', org?.id],
        queryFn: () => getReviewSummary(org!.id),
        enabled: !!org?.id,
    });

    // Respond mutation
    const respondMutation = useMutation({
        mutationFn: async ({ reviewId, content }: { reviewId: string; content: string }) => {
            return respondToReview(reviewId, content);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['owner-reviews', org?.id] });
            setSelectedReview(null);
            setResponseText('');
            setEditingResponse(null);
            toast.success('Réponse publiée');
        },
        onError: () => {
            toast.error('Erreur lors de la publication');
        },
    });

    // Delete response mutation
    const deleteResponseMutation = useMutation({
        mutationFn: deleteReviewResponse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['owner-reviews', org?.id] });
            toast.success('Réponse supprimée');
        },
        onError: () => {
            toast.error('Erreur lors de la suppression');
        },
    });

    const handleRespond = () => {
        if (!selectedReview || !responseText.trim()) return;
        respondMutation.mutate({ reviewId: selectedReview.id, content: responseText });
    };

    const openResponseModal = (review: Review, editMode = false) => {
        setSelectedReview(review);
        if (editMode && review.response) {
            setResponseText(review.response.content);
            setEditingResponse(review.id);
        } else {
            setResponseText('');
            setEditingResponse(null);
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={cn(
                            'h-4 w-4',
                            star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground/30'
                        )}
                    />
                ))}
            </div>
        );
    };

    const reviews = reviewsData?.content || [];

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-semibold">Avis clients</h2>
                <p className="text-muted-foreground mt-1">
                    Gérez et répondez aux avis de vos clients
                </p>
            </div>

            {/* Summary Card */}
            {summary && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="p-4 rounded-xl border bg-card">
                        <p className="text-sm text-muted-foreground">Note moyenne</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-3xl font-bold">
                                {(summary.averageRating || 0).toFixed(1)}
                            </span>
                            {renderStars(Math.round(summary.averageRating))}
                        </div>
                    </div>
                    <div className="p-4 rounded-xl border bg-card">
                        <p className="text-sm text-muted-foreground">Total des avis</p>
                        <span className="text-3xl font-bold">{summary.totalReviews}</span>
                    </div>
                    <div className="p-4 rounded-xl border bg-card col-span-2">
                        <p className="text-sm text-muted-foreground mb-2">Répartition</p>
                        <div className="space-y-1">
                            {[5, 4, 3, 2, 1].map((rating) => {
                                const count = summary.distribution[rating as keyof typeof summary.distribution] || 0;
                                const percentage = summary.totalReviews > 0
                                    ? (count / summary.totalReviews) * 100
                                    : 0;
                                return (
                                    <div key={rating} className="flex items-center gap-2 text-sm">
                                        <span className="w-3">{rating}</span>
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-yellow-400 transition-all"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="w-8 text-muted-foreground text-xs">
                                            {count}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex items-center gap-2">
                {(['all', 'published', 'pending', 'flagged'] as const).map((status) => (
                    <Button
                        key={status}
                        variant={filter === status ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter(status)}
                    >
                        {status === 'all' && 'Tous'}
                        {status === 'published' && 'Publiés'}
                        {status === 'pending' && 'En attente'}
                        {status === 'flagged' && (
                            <>
                                <Flag className="h-3 w-3 mr-1" />
                                Signalés
                            </>
                        )}
                    </Button>
                ))}
            </div>

            {/* Reviews List */}
            {reviews.length === 0 ? (
                <EmptyState
                    icon={MessageSquare}
                    title="Aucun avis"
                    description="Vous n'avez pas encore reçu d'avis de clients."
                />
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className={cn(
                                'p-4 border rounded-xl bg-card',
                                review.status === 'flagged' && 'border-red-200 dark:border-red-900'
                            )}
                        >
                            {/* Review Header */}
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <Avatar className="h-10 w-10">
                                        {review.userAvatarUrl ? (
                                            <img src={review.userAvatarUrl} alt={review.userName} />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-medium">
                                                {review.isAnonymous ? '?' : review.userName.charAt(0)}
                                            </div>
                                        )}
                                    </Avatar>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">
                                                {review.isAnonymous ? 'Anonyme' : review.userName}
                                            </span>
                                            {review.status === 'flagged' && (
                                                <Badge variant="destructive" className="text-xs">
                                                    <Flag className="h-3 w-3 mr-1" />
                                                    Signalé
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            {renderStars(review.rating)}
                                            <span className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(review.createdAt), {
                                                    locale: fr,
                                                    addSuffix: true,
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <ThumbsUp className="h-3 w-3" />
                                        {review.helpfulCount}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <ThumbsDown className="h-3 w-3" />
                                        {review.unhelpfulCount}
                                    </span>
                                </div>
                            </div>

                            {/* Review Content */}
                            <div className="mt-3">
                                <h4 className="font-medium">{review.title}</h4>
                                <p className="text-muted-foreground mt-1">{review.content}</p>
                                {(review.pros || review.cons) && (
                                    <div className="grid gap-2 sm:grid-cols-2 mt-3 text-sm">
                                        {review.pros && (
                                            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/30">
                                                <span className="font-medium text-green-700 dark:text-green-400">
                                                    👍 Points positifs
                                                </span>
                                                <p className="text-green-600 dark:text-green-300 mt-1">
                                                    {review.pros}
                                                </p>
                                            </div>
                                        )}
                                        {review.cons && (
                                            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/30">
                                                <span className="font-medium text-red-700 dark:text-red-400">
                                                    👎 Points négatifs
                                                </span>
                                                <p className="text-red-600 dark:text-red-300 mt-1">
                                                    {review.cons}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Owner Response */}
                            {review.response ? (
                                <div className="mt-4 p-4 rounded-lg bg-primary/5 border-l-4 border-primary">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-primary">
                                            Votre réponse
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openResponseModal(review, true)}
                                            >
                                                <Edit2 className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500"
                                                onClick={() => deleteResponseMutation.mutate(review.id)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-sm mt-2">{review.response.content}</p>
                                    <span className="text-xs text-muted-foreground mt-2 block">
                                        {format(new Date(review.response.createdAt), 'dd MMM yyyy à HH:mm', {
                                            locale: fr,
                                        })}
                                    </span>
                                </div>
                            ) : (
                                <div className="mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openResponseModal(review)}
                                    >
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Répondre
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Response Modal */}
            <Modal
                open={!!selectedReview}
                onOpenChange={(open) => !open && setSelectedReview(null)}
            >
                {selectedReview && (
                    <div className="p-6 space-y-4">
                        <h2 className="text-xl font-semibold">
                            {editingResponse ? 'Modifier votre réponse' : 'Répondre à l\'avis'}
                        </h2>

                        {/* Original Review Preview */}
                        <div className="p-3 rounded-lg bg-muted/50 text-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">
                                    {selectedReview.isAnonymous ? 'Anonyme' : selectedReview.userName}
                                </span>
                                {renderStars(selectedReview.rating)}
                            </div>
                            <p className="text-muted-foreground line-clamp-2">
                                {selectedReview.content}
                            </p>
                        </div>

                        {/* Response Input */}
                        <div className="space-y-2">
                            <Textarea
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                                placeholder="Écrivez votre réponse..."
                                rows={4}
                            />
                            <p className="text-xs text-muted-foreground">
                                Votre réponse sera publique et visible par tous les utilisateurs.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                variant="outline"
                                onClick={() => setSelectedReview(null)}
                            >
                                Annuler
                            </Button>
                            <Button
                                onClick={handleRespond}
                                disabled={respondMutation.isPending || !responseText.trim()}
                            >
                                <Send className="h-4 w-4 mr-2" />
                                {respondMutation.isPending ? 'Envoi...' : 'Publier'}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
