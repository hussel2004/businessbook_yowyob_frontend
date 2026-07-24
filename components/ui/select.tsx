import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options?: SelectOption[];
    error?: boolean;
    placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, options, children, error, placeholder, ...props }, ref) => {
        return (
            <div className="relative">
                <select
                    className={cn(
                        'flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                        error && 'border-error focus-visible:ring-error',
                        // Placeholder styling trick for select
                        !props.value && props.defaultValue === undefined && 'text-muted-foreground',
                        className
                    )}
                    ref={ref}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled selected>
                            {placeholder}
                        </option>
                    )}
                    {options
                        ? options.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                            >
                                {option.label}
                            </option>
                        ))
                        : children}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                    <ChevronDown className="h-4 w-4" />
                </div>
            </div>
        );
    }
);
Select.displayName = 'Select';

export { Select };
