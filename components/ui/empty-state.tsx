'use client';

import * as React from 'react';
import { Inbox, Search, FileX, AlertCircle, LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { Button } from './button';

const iconMap: Record<string, LucideIcon> = {
    default: Inbox,
    search: Search,
    file: FileX,
    error: AlertCircle,
};

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
    icon?: 'default' | 'search' | 'file' | 'error' | LucideIcon;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
        variant?: 'default' | 'outline' | 'secondary';
    } | React.ReactNode;
    secondaryAction?: {
        label: string;
        onClick: () => void;
    };
}


const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
    ({ className, icon = 'default', title, description, action, secondaryAction, ...props }, ref) => {
        const IconComponent: LucideIcon = typeof icon === 'string'
            ? (iconMap[icon] ?? Inbox)
            : icon;

        return (
            <div
                ref={ref}
                className={cn(
                    'flex flex-col items-center justify-center text-center p-8 min-h-[300px]',
                    className
                )}
                {...props}
            >
                <div className="rounded-full bg-muted p-4 mb-4">
                    <IconComponent className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                {description && (
                    <p className="text-sm text-muted-foreground max-w-sm mb-6">
                        {description}
                    </p>
                )}
                {(action || secondaryAction) && (
                    <div className="flex flex-col sm:flex-row gap-3">
                        {action && (
                            React.isValidElement(action) ? (
                                action
                            ) : typeof action === 'object' && 'label' in action ? (
                                <Button
                                    variant={action.variant ?? 'default'}
                                    onClick={action.onClick}
                                >
                                    {action.label}
                                </Button>
                            ) : null
                        )}
                        {secondaryAction && (
                            <Button
                                variant="outline"
                                onClick={secondaryAction.onClick}
                            >
                                {secondaryAction.label}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        );
    }
);
EmptyState.displayName = 'EmptyState';

export { EmptyState };
