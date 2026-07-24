'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { createReview } from '@/lib/api/reviews';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils/cn';

const reviewSchema = z.object({
    rating: z.number().min(1, 'La note est requise').max(5),
    title: z.string().min(3, 'Le titre doit faire au moins 3 caractères').max(100),
    content: z.string().min(10, 'Votre avis doit faire au moins 10 caractères').max(2000),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
    organizationId: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function ReviewForm({ organizationId, onSuccess, onCancel }: ReviewFormProps) {
    const [hoveredRating, setHoveredRating] = useState(0);
    const queryClient = useQueryClient();

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ReviewFormValues>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: 0,
        }
    });

    const currentRating = watch('rating');

    const mutation = useMutation({
        mutationFn: (data: ReviewFormValues) => createReview(organizationId, data),
        onSuccess: () => {
            toast.success('Votre avis a été publié !');
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
            queryClient.invalidateQueries({ queryKey: ['has-reviewed', organizationId] });
            onSuccess?.();
        },
        onError: (error: any) => {
            console.error('Review submission error:', error);
            toast.error(error?.response?.data?.message || 'Une erreur est survenue.');
        }
    });

    const onSubmit = (data: ReviewFormValues) => {
        console.log('Submitting review:', data);
        mutation.mutate(data);
    };

    const onError = (formErrors: any) => {
        console.log('Form validation errors:', formErrors);
        const errorMessages = Object.values(formErrors).map((e: any) => e.message).join(', ');
        toast.error(`Veuillez corriger: ${errorMessages}`);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
            <div className="space-y-2">
                <Label>Note globale</Label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className="focus:outline-none transition-transform hover:scale-110"
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => setValue('rating', star, { shouldValidate: true })}
                        >
                            <Star
                                className={cn(
                                    "h-8 w-8",
                                    star <= (hoveredRating || currentRating)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-muted-foreground/30"
                                )}
                            />
                        </button>
                    ))}
                </div>
                {errors.rating && <span className="text-xs text-destructive">{errors.rating.message}</span>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="title">Titre de votre avis</Label>
                <Input id="title" placeholder="Ex: Excellente expérience !" {...register('title')} />
                {errors.title && <span className="text-xs text-destructive">{errors.title.message}</span>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="content">Votre avis détaillé</Label>
                <Textarea
                    id="content"
                    placeholder="Racontez votre expérience..."
                    rows={4}
                    {...register('content')}
                />
                {errors.content && <span className="text-xs text-destructive">{errors.content.message}</span>}
            </div>

            <div className="flex justify-end gap-3 pt-2">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Annuler
                    </Button>
                )}
                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Envoi...' : 'Publier mon avis'}
                </Button>
            </div>
        </form>
    );
}
