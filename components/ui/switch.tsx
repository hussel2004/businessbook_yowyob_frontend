'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils/cn';

const switchVariants = cva(
    'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
    {
        variants: {
            size: {
                default: 'h-6 w-11',
                sm: 'h-5 w-9',
                lg: 'h-7 w-14',
            },
        },
        defaultVariants: {
            size: 'default',
        },
    }
);

const thumbVariants = cva(
    'pointer-events-none inline-block rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out',
    {
        variants: {
            size: {
                default: 'h-5 w-5',
                sm: 'h-4 w-4',
                lg: 'h-6 w-6',
            },
        },
        defaultVariants: {
            size: 'default',
        },
    }
);

export interface SwitchProps
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'>,
    VariantProps<typeof switchVariants> {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    label?: string;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
    ({ className, size, checked = false, onCheckedChange, disabled, label, ...props }, ref) => {
        const [isChecked, setIsChecked] = React.useState(checked);

        React.useEffect(() => {
            setIsChecked(checked);
        }, [checked]);

        const handleToggle = () => {
            if (!disabled) {
                const newValue = !isChecked;
                setIsChecked(newValue);
                onCheckedChange?.(newValue);
            }
        };

        const translateClass = {
            default: isChecked ? 'translate-x-5' : 'translate-x-0',
            sm: isChecked ? 'translate-x-4' : 'translate-x-0',
            lg: isChecked ? 'translate-x-7' : 'translate-x-0',
        };

        return (
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    role="switch"
                    aria-checked={isChecked}
                    ref={ref}
                    disabled={disabled}
                    onClick={handleToggle}
                    className={cn(
                        switchVariants({ size }),
                        isChecked ? 'bg-primary' : 'bg-muted',
                        className
                    )}
                    {...props}
                >
                    <span
                        className={cn(
                            thumbVariants({ size }),
                            translateClass[size ?? 'default']
                        )}
                    />
                </button>
                {label && (
                    <span
                        className={cn(
                            'text-sm font-medium',
                            disabled && 'opacity-50'
                        )}
                    >
                        {label}
                    </span>
                )}
            </div>
        );
    }
);
Switch.displayName = 'Switch';

export { Switch, switchVariants };
