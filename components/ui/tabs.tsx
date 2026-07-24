'use client';

import * as React from 'react';

import { cn } from '@/lib/utils/cn';

interface TabsContextValue {
    value: string;
    onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

const useTabs = () => {
    const context = React.useContext(TabsContext);
    if (!context) {
        throw new Error('Tabs components must be wrapped in <Tabs />');
    }
    return context;
};

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
    ({ className, value, defaultValue, onValueChange, children, ...props }, ref) => {
        const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');

        const isControlled = value !== undefined;
        const currentValue = isControlled ? value : internalValue;
        const setValue = isControlled
            ? (v: string) => onValueChange?.(v)
            : setInternalValue;

        return (
            <TabsContext.Provider value={{ value: currentValue, onValueChange: setValue }}>
                <div
                    ref={ref}
                    className={cn('w-full', className)}
                    {...props}
                >
                    {children}
                </div>
            </TabsContext.Provider>
        );
    }
);
Tabs.displayName = 'Tabs';

const TabsList = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        role="tablist"
        className={cn(
            'inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
            className
        )}
        {...props}
    />
));
TabsList.displayName = 'TabsList';

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
    ({ className, value, children, ...props }, ref) => {
        const { value: selectedValue, onValueChange } = useTabs();
        const isSelected = selectedValue === value;

        return (
            <button
                ref={ref}
                type="button"
                role="tab"
                aria-selected={isSelected}
                data-state={isSelected ? 'active' : 'inactive'}
                onClick={() => onValueChange(value)}
                className={cn(
                    'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    'disabled:pointer-events-none disabled:opacity-50',
                    isSelected
                        ? 'bg-background text-foreground shadow-sm'
                        : 'hover:bg-background/50 hover:text-foreground',
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);
TabsTrigger.displayName = 'TabsTrigger';

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
    ({ className, value, children, ...props }, ref) => {
        const { value: selectedValue } = useTabs();
        const isSelected = selectedValue === value;

        if (!isSelected) return null;

        return (
            <div
                ref={ref}
                role="tabpanel"
                data-state={isSelected ? 'active' : 'inactive'}
                className={cn(
                    'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    'animate-in fade-in-0 zoom-in-95 duration-200',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
