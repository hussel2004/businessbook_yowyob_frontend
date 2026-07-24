'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils/cn';

const modalVariants = cva(
    'relative bg-background rounded-xl shadow-xl border max-h-[85vh] overflow-auto',
    {
        variants: {
            size: {
                sm: 'w-full max-w-sm',
                default: 'w-full max-w-lg',
                lg: 'w-full max-w-2xl',
                xl: 'w-full max-w-4xl',
                full: 'w-full max-w-[95vw] h-[90vh]',
            },
        },
        defaultVariants: {
            size: 'default',
        },
    }
);

interface ModalContextValue {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ModalContext = React.createContext<ModalContextValue | null>(null);

const useModal = () => {
    const context = React.useContext(ModalContext);
    if (!context) {
        throw new Error('Modal components must be wrapped in <Modal />');
    }
    return context;
};

export interface ModalProps extends VariantProps<typeof modalVariants> {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
}

const Modal = ({ open = false, onOpenChange, size, children }: ModalProps) => {
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
        <ModalContext.Provider value={{ open: isOpen, onOpenChange: setIsOpen }}>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-200"
                onClick={() => setIsOpen(false)}
            />
            {/* Content container */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className={cn(
                        modalVariants({ size }),
                        'animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-200'
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    {children}
                </div>
            </div>
        </ModalContext.Provider>
    );
};
Modal.displayName = 'Modal';

const ModalHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    const { onOpenChange } = useModal();

    return (
        <div
            ref={ref}
            className={cn(
                'flex items-center justify-between p-6 border-b',
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
ModalHeader.displayName = 'ModalHeader';

const ModalTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h2
        ref={ref}
        className={cn('text-lg font-semibold', className)}
        {...props}
    />
));
ModalTitle.displayName = 'ModalTitle';

const ModalDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn('text-sm text-muted-foreground', className)}
        {...props}
    />
));
ModalDescription.displayName = 'ModalDescription';

const ModalBody = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('p-6', className)}
        {...props}
    />
));
ModalBody.displayName = 'ModalBody';

const ModalFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 border-t bg-muted/30',
            className
        )}
        {...props}
    />
));
ModalFooter.displayName = 'ModalFooter';

export { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter, modalVariants };
