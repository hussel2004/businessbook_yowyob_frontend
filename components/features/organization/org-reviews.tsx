'use client';

import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageSquare, PenLine } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/star-rating';
import { Progress } from '@/components/ui/progress';
import { Modal, ModalHeader, ModalTitle, ModalBody } from '@/components/ui/modal';
import { ReviewForm } from '@/components/features/reviews/review-form';
import { useAuthStore } from '@/lib/auth/auth-store';
import { useRouter } from 'next/navigation';
import type { Review, RatingSummary } from '@/lib/api/public';

interface RatingSummaryCardProps {
    summary: RatingSummary;
}

export function RatingSummaryCard({ summary }: RatingSummaryCardProps) {
    const distribution = summary.distribution ?? {};
    const maxCount = Math.max(...Object.values(distribution), 1);

    return (
        <div className="p-6 rounded-xl border bg-card">
            <div className="flex items-center gap-6 mb-6">
                <div className="text-center">
                    <div className="text-4xl font-bold mb-1">{(summary.averageRating ?? 0).toFixed(1)}</div>
                    <StarRating rating={summary.averageRating ?? 0} size="default" />
                    <div className="text-sm text-muted-foreground mt-1">
                        {summary.totalReviews ?? 0} avis
                    </div>
                </div>
                <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = distribution[star] || 0;
                        const percentage = (count / maxCount) * 100;
                        return (
                            <div key={star} className="flex items-center gap-2">
                                <span className="text-sm w-3">{star}</span>
                                <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                                <Progress value={percentage} className="flex-1 h-2" />
                                <span className="text-sm text-muted-foreground w-8">
                                    {count}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

interface ReviewCardProps {
    review: Review;
    onHelpful?: () => void;
    onUnhelpful?: () => void;
}

function ReviewCard({ review, onHelpful, onUnhelpful }: ReviewCardProps) {
    const formattedDate = new Date(review.createdAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="p-4 rounded-xl border bg-card">
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
                <Avatar
                    src={review.actorAvatar}
                    alt={review.actorName || 'Anonyme'}
                    fallback={(review.actorName || 'A').charAt(0)}
                />
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{review.actorName || 'Anonyme'}</span>
                        {review.isVerifiedPurchase && (
                            <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
                                Client vérifié
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <StarRating rating={review.rating} size="sm" />
                        <span>•</span>
                        <span>{formattedDate}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            {review.title && (
                <h4 className="font-semibold mb-1">{review.title}</h4>
            )}
            {review.content && (
                <p className="text-muted-foreground mb-4">{review.content}</p>
            )}

            {/* Response */}
            {review.responseContent && (
                <div className="bg-muted/50 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 text-sm font-medium mb-1">
                        <MessageSquare className="h-4 w-4" />
                        Réponse de l'entreprise
                    </div>
                    <p className="text-sm text-muted-foreground">{review.responseContent}</p>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 text-sm">
                <button
                    onClick={onHelpful}
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ThumbsUp className="h-4 w-4" />
                    Utile ({review.helpfulCount ?? 0})
                </button>
                <button
                    onClick={onUnhelpful}
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ThumbsDown className="h-4 w-4" />
                    ({review.unhelpfulCount ?? 0})
                </button>
            </div>
        </div>
    );
}

interface OrgReviewsProps {
    reviews: Review[];
    summary?: RatingSummary;
    onLoadMore?: () => void;
    hasMore?: boolean;
    isLoading?: boolean;
    organizationId: string;
    ownerId?: string; // Optional for backward compatibility, but required for ownership check
}

export function OrgReviews({ reviews, summary, onLoadMore, hasMore, isLoading, organizationId, ownerId }: OrgReviewsProps) {
    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
    const { isAuthenticated, user } = useAuthStore();
    const router = useRouter();

    const isOwner = user && ownerId && user.actorId === ownerId;

    console.log('[DEBUG] OrgReviews Check:', {
        userId: user?.id,
        userActorId: user?.actorId,
        ownerId,
        isOwner,
        isAuthenticated
    });

    const handleWriteReview = () => {
        if (!isAuthenticated) {
            router.push(`/login?redirect=/business/${organizationId}`);
            return;
        }

        if (user && !user.emailVerified) {
            router.push('/resend-verification');
            return;
        }

        setIsWriteModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Avis clients</h3>
                {!isOwner && (
                    <Button onClick={handleWriteReview}>
                        <PenLine className="h-4 w-4 mr-2" />
                        Écrire un avis
                    </Button>
                )}
            </div>

            {summary && <RatingSummaryCard summary={summary} />}

            <div className="space-y-4">
                {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                ))}
            </div>

            {hasMore && (
                <div className="text-center">
                    <Button variant="outline" onClick={onLoadMore} isLoading={isLoading}>
                        Voir plus d'avis
                    </Button>
                </div>
            )}

            {reviews.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    Aucun avis pour le moment. Soyez le premier à donner votre avis !
                </div>
            )}

            {/* Review Modal */}
            <Modal open={isWriteModalOpen} onOpenChange={setIsWriteModalOpen}>
                <ModalHeader>
                    <ModalTitle>Donner votre avis</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <ReviewForm
                        organizationId={organizationId}
                        onSuccess={() => setIsWriteModalOpen(false)}
                        onCancel={() => setIsWriteModalOpen(false)}
                    />
                </ModalBody>
            </Modal>
        </div>
    );
}
