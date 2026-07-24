import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils/cn';

const progressVariants = cva(
    'relative h-2 w-full overflow-hidden rounded-full bg-muted',
    {
        variants: {
            size: {
                sm: 'h-1',
                default: 'h-2',
                lg: 'h-3',
            },
        },
        defaultVariants: {
            size: 'default',
        },
    }
);

const indicatorVariants = cva(
    'h-full w-full flex-1 transition-all duration-300 ease-in-out',
    {
        variants: {
            variant: {
                default: 'bg-primary',
                success: 'bg-green-500',
                warning: 'bg-yellow-500',
                error: 'bg-red-500',
                info: 'bg-blue-500',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

export interface ProgressProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants>,
    VariantProps<typeof indicatorVariants> {
    value?: number;
    max?: number;
    showValue?: boolean;
    label?: string;
    indeterminate?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    ({ className, value = 0, max = 100, size, variant, showValue, label, indeterminate, ...props }, ref) => {
        const percentage = Math.min(100, Math.max(0, (value / max) * 100));

        return (
            <div className="w-full space-y-1">
                {(label || showValue) && (
                    <div className="flex items-center justify-between text-sm">
                        {label && <span className="text-muted-foreground">{label}</span>}
                        {showValue && !indeterminate && (
                            <span className="font-medium">{Math.round(percentage)}%</span>
                        )}
                    </div>
                )}
                <div
                    ref={ref}
                    role="progressbar"
                    aria-valuenow={indeterminate ? undefined : value}
                    aria-valuemin={0}
                    aria-valuemax={max}
                    className={cn(progressVariants({ size }), className)}
                    {...props}
                >
                    <div
                        className={cn(
                            indicatorVariants({ variant }),
                            indeterminate && 'animate-progress-indeterminate'
                        )}
                        style={{
                            transform: indeterminate ? undefined : `translateX(-${100 - percentage}%)`,
                        }}
                    />
                </div>
            </div>
        );
    }
);
Progress.displayName = 'Progress';

export { Progress, progressVariants };
