'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils/cn';

const drawerVariants = cva(
    'fixed z-50 bg-background shadow-xl border transition-transform duration-300 ease-in-out',
    {
        variants: {
            side: {
                left: 'inset-y-0 left-0 h-full w-3/4 max-w-sm border-r',
                right: 'inset-y-0 right-0 h-full w-3/4 max-w-sm border-l',
                top: 'inset-x-0 top-0 w-full h-auto max-h-[80vh] border-b rounded-b-xl',
                bottom: 'inset-x-0 bottom-0 w-full h-auto max-h-[80vh] border-t rounded-t-xl',
            },
        },
        defaultVariants: {
            side: 'right',
        },
    }
);

const slideInClasses = {
    left: '-translate-x-full data-[state=open]:translate-x-0',
    right: 'translate-x-full data-[state=open]:translate-x-0',
    top: '-translate-y-full data-[state=open]:translate-y-0',
    bottom: 'translate-y-full data-[state=open]:translate-y-0',
};

interface DrawerContextValue {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DrawerContext = React.createContext<DrawerContextValue | null>(null);

const useDrawer = () => {
    const context = React.useContext(DrawerContext);
    if (!context) {
        throw new Error('Drawer components must be wrapped in <Drawer />');
    }
    return context;
};

export interface DrawerProps extends VariantProps<typeof drawerVariants> {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
}

const Drawer = ({ open = false, onOpenChange, side = 'right', children }: DrawerProps) => {
    const [internalOpen, setInternalOpen] = React.useState(open);

    const isControlled = onOpenChange !== undefined;
    const isOpen = isControlled ? open : internalOpen;
    const setIsOpen = isControlled ? onOpenChange : setInternalOpen;

    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, setIsOpen]);

    if (!isOpen) return null;

    return (
        <DrawerContext.Provider value={{ open: isOpen, onOpenChange: setIsOpen }}>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-200"
                onClick={() => setIsOpen(false)}
            />
            {/* Drawer panel */}
            <div
                data-state={isOpen ? 'open' : 'closed'}
                className={cn(
                    drawerVariants({ side }),
                    slideInClasses[side ?? 'right'],
                    'overflow-auto'
                )}
            >
                {children}
            </div>
        </DrawerContext.Provider>
    );
};
Drawer.displayName = 'Drawer';

const DrawerHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    const { onOpenChange } = useDrawer();

    return (
        <div
            ref={ref}
            className={cn(
                'flex items-center justify-between p-4 border-b sticky top-0 bg-background z-10',
                className
            )}
            {...props}
        >
            <div>{children}</div>
            <button
                onClick={() => onOpenChange(false)}
                className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
                <X className="h-5 w-5" />
                <span className="sr-only">Fermer</span>
            </button>
        </div>
    );
});
DrawerHeader.displayName = 'DrawerHeader';

const DrawerTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h2
        ref={ref}
        className={cn('text-lg font-semibold', className)}
        {...props}
    />
));
DrawerTitle.displayName = 'DrawerTitle';

const DrawerBody = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('p-4 flex-1', className)}
        {...props}
    />
));
DrawerBody.displayName = 'DrawerBody';

const DrawerFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'flex flex-col gap-2 p-4 border-t sticky bottom-0 bg-background',
            className
        )}
        {...props}
    />
));
DrawerFooter.displayName = 'DrawerFooter';

export { Drawer, DrawerHeader, DrawerTitle, DrawerBody, DrawerFooter, drawerVariants };
