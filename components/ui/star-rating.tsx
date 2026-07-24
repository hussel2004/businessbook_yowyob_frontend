import * as React from 'react';
import { Star, StarHalf } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

export interface StarRatingProps extends React.HTMLAttributes<HTMLDivElement> {
    rating: number;
    maxRating?: number;
    size?: 'sm' | 'default' | 'lg';
    showValue?: boolean;
    reviewCount?: number;
}

const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    default: 'h-5 w-5',
    lg: 'h-6 w-6',
};

const StarRating = React.forwardRef<HTMLDivElement, StarRatingProps>(
    ({ className, rating, maxRating = 5, size = 'default', showValue = false, reviewCount, ...props }, ref) => {
        const safeRating = rating ?? 0;
        const fullStars = Math.floor(safeRating);
        const hasHalfStar = safeRating % 1 >= 0.5;
        const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div
                ref={ref}
                className={cn('flex items-center gap-1', className)}
                aria-label={`Note: ${safeRating} sur ${maxRating} étoiles`}
                {...props}
            >
                <div className="flex items-center">
                    {/* Full stars */}
                    {Array.from({ length: fullStars }).map((_, idx) => (
                        <Star
                            key={`full-${idx}`}
                            className={cn(sizeClasses[size], 'fill-yellow-400 text-yellow-400')}
                        />
                    ))}

                    {/* Half star */}
                    {hasHalfStar && (
                        <div className="relative">
                            <Star className={cn(sizeClasses[size], 'text-muted-foreground/30')} />
                            <div className="absolute inset-0 overflow-hidden w-1/2">
                                <Star className={cn(sizeClasses[size], 'fill-yellow-400 text-yellow-400')} />
                            </div>
                        </div>
                    )}

                    {/* Empty stars */}
                    {Array.from({ length: emptyStars }).map((_, idx) => (
                        <Star
                            key={`empty-${idx}`}
                            className={cn(sizeClasses[size], 'text-muted-foreground/30')}
                        />
                    ))}
                </div>

                {(showValue || reviewCount !== undefined) && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground ml-1">
                        {showValue && (
                            <span className="font-medium text-foreground">{safeRating.toFixed(1)}</span>
                        )}
                        {reviewCount !== undefined && (
                            <span>({reviewCount} avis)</span>
                        )}
                    </div>
                )}
            </div>
        );
    }
);
StarRating.displayName = 'StarRating';

export { StarRating };
