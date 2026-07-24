'use client';

import * as React from 'react';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: React.ReactNode;
    description?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, label, description, id, disabled, checked, onChange, ...props }, ref) => {
        const [isChecked, setIsChecked] = React.useState(checked ?? false);
        const checkboxId = id ?? React.useId();

        React.useEffect(() => {
            if (checked !== undefined) {
                setIsChecked(checked);
            }
        }, [checked]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!disabled) {
                setIsChecked(e.target.checked);
                onChange?.(e);
            }
        };

        return (
            <div className={cn('flex items-start gap-3', className)}>
                <div className="relative flex items-center justify-center">
                    <input
                        type="checkbox"
                        ref={ref}
                        id={checkboxId}
                        checked={isChecked}
                        onChange={handleChange}
                        disabled={disabled}
                        className="sr-only peer"
                        {...props}
                    />
                    <div
                        className={cn(
                            'h-5 w-5 rounded-md border-2 transition-all duration-200 cursor-pointer',
                            'flex items-center justify-center',
                            'border-muted-foreground/40 bg-background',
                            'peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2',
                            isChecked && 'bg-primary border-primary',
                            disabled && 'opacity-50 cursor-not-allowed'
                        )}
                        onClick={() => !disabled && document.getElementById(checkboxId)?.click()}
                    >
                        {isChecked && (
                            <Check className="h-3.5 w-3.5 text-primary-foreground animate-in zoom-in-50 duration-150" />
                        )}
                    </div>
                </div>
                {(label || description) && (
                    <div className="flex flex-col gap-0.5">
                        {label && (
                            <label
                                htmlFor={checkboxId}
                                className={cn(
                                    'text-sm font-medium leading-none cursor-pointer',
                                    disabled && 'cursor-not-allowed opacity-50'
                                )}
                            >
                                {label}
                            </label>
                        )}
                        {description && (
                            <p className="text-xs text-muted-foreground">{description}</p>
                        )}
                    </div>
                )}
            </div>
        );
    }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
