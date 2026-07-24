'use client';

import * as React from 'react';
import { Star } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

export interface RatingInputProps {
    value?: number;
    onChange?: (value: number) => void;
    max?: number;
    size?: 'sm' | 'default' | 'lg';
    disabled?: boolean;
    label?: string;
    error?: string;
    required?: boolean;
}

const sizeClasses = {
    sm: 'h-5 w-5',
    default: 'h-7 w-7',
    lg: 'h-9 w-9',
};

const RatingInput = React.forwardRef<HTMLDivElement, RatingInputProps>(
    ({ value = 0, onChange, max = 5, size = 'default', disabled, label, error, required }, ref) => {
        const [hoverValue, setHoverValue] = React.useState<number | null>(null);
        const [internalValue, setInternalValue] = React.useState(value);

        React.useEffect(() => {
            setInternalValue(value);
        }, [value]);

        const displayValue = hoverValue ?? internalValue;

        const handleClick = (rating: number) => {
            if (!disabled) {
                setInternalValue(rating);
                onChange?.(rating);
            }
        };

        const handleKeyDown = (e: React.KeyboardEvent, rating: number) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick(rating);
            }
            if (e.key === 'ArrowRight' && internalValue < max) {
                handleClick(internalValue + 1);
            }
            if (e.key === 'ArrowLeft' && internalValue > 1) {
                handleClick(internalValue - 1);
            }
        };

        return (
            <div ref={ref} className="space-y-2">
                {label && (
                    <label className="text-sm font-medium leading-none">
                        {label}
                        {required && <span className="text-destructive ml-1">*</span>}
                    </label>
                )}
                <div
                    className={cn(
                        'flex items-center gap-1',
                        disabled && 'opacity-50 cursor-not-allowed'
                    )}
                    role="radiogroup"
                    aria-label={label || 'Note'}
                >
                    {Array.from({ length: max }).map((_, idx) => {
                        const rating = idx + 1;
                        const isFilled = rating <= displayValue;

                        return (
                            <button
                                key={rating}
                                type="button"
                                role="radio"
                                aria-checked={rating === internalValue}
                                aria-label={`${rating} étoile${rating > 1 ? 's' : ''}`}
                                disabled={disabled}
                                onClick={() => handleClick(rating)}
                                onKeyDown={(e) => handleKeyDown(e, rating)}
                                onMouseEnter={() => !disabled && setHoverValue(rating)}
                                onMouseLeave={() => setHoverValue(null)}
                                className={cn(
                                    'transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm',
                                    !disabled && 'cursor-pointer hover:scale-110'
                                )}
                            >
                                <Star
                                    className={cn(
                                        sizeClasses[size],
                                        'transition-colors duration-150',
                                        isFilled
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-muted-foreground/40 hover:text-yellow-400/60'
                                    )}
                                />
                            </button>
                        );
                    })}
                    {internalValue > 0 && (
                        <span className="ml-2 text-sm font-medium text-muted-foreground">
                            {internalValue}/{max}
                        </span>
                    )}
                </div>
                {error && (
                    <p className="text-sm text-destructive">{error}</p>
                )}
            </div>
        );
    }
);
RatingInput.displayName = 'RatingInput';

export { RatingInput };
