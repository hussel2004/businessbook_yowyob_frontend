import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, CheckCircle2, Info, XCircle, X } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

const alertVariants = cva(
    'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
    {
        variants: {
            variant: {
                default: 'bg-background text-foreground',
                info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100 [&>svg]:text-blue-600',
                success: 'border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100 [&>svg]:text-green-600',
                warning: 'border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100 [&>svg]:text-yellow-600',
                error: 'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100 [&>svg]:text-red-600',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

const iconMap = {
    default: Info,
    info: Info,
    success: CheckCircle2,
    warning: AlertCircle,
    error: XCircle,
};

export interface AlertProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
    dismissible?: boolean;
    onDismiss?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({ className, variant, dismissible, onDismiss, children, ...props }, ref) => {
        const Icon = iconMap[variant ?? 'default'];

        return (
            <div
                ref={ref}
                role="alert"
                className={cn(alertVariants({ variant }), className)}
                {...props}
            >
                <Icon className="h-5 w-5" />
                {children}
                {dismissible && (
                    <button
                        onClick={onDismiss}
                        className="absolute right-2 top-2 rounded-md p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Fermer</span>
                    </button>
                )}
            </div>
        );
    }
);
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h5
        ref={ref}
        className={cn('mb-1 font-medium leading-none tracking-tight', className)}
        {...props}
    />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('text-sm [&_p]:leading-relaxed', className)}
        {...props}
    />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription, alertVariants };
