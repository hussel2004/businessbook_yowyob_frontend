'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/lib/utils/cn';
import { buttonVariants } from './button-variants';

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, fullWidth, isLoading, asChild = false, children, disabled, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, fullWidth, className }))}
                ref={ref}
                disabled={disabled || isLoading}
                {...props}
            >
                {/* Only show loader for non-asChild buttons since Slot requires single child */}
                {isLoading && !asChild && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </Comp>
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
