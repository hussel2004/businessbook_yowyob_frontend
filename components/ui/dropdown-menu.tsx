'use client';

import * as React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/lib/utils/cn';

interface DropdownContextValue {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

const useDropdown = () => {
    const context = React.useContext(DropdownContext);
    if (!context) {
        throw new Error('Dropdown components must be wrapped in <DropdownMenu />');
    }
    return context;
};

export interface DropdownMenuProps {
    children: React.ReactNode;
}

const DropdownMenu = ({ children }: DropdownMenuProps) => {
    const [open, setOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [open]);

    return (
        <DropdownContext.Provider value={{ open, setOpen }}>
            <div ref={containerRef} className="relative inline-block text-left">
                {children}
            </div>
        </DropdownContext.Provider>
    );
};

export interface DropdownTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
    hideIcon?: boolean;
}

const DropdownTrigger = React.forwardRef<HTMLButtonElement, DropdownTriggerProps>(
    ({ className, children, asChild = false, hideIcon, ...props }, ref) => {
        const { open, setOpen } = useDropdown();
        const Comp = asChild ? Slot : 'button';

        return (
            <Comp
                ref={ref}
                type="button"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-haspopup="true"
                className={cn(
                    'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    className
                )}
                {...props}
            >
                {asChild ? (
                    children
                ) : (
                    <>
                        {children}
                        {!hideIcon && (
                            <ChevronDown
                                className={cn(
                                    'h-4 w-4 transition-transform duration-200',
                                    open && 'rotate-180'
                                )}
                            />
                        )}
                    </>
                )}
            </Comp>
        );
    }
);
DropdownTrigger.displayName = 'DropdownTrigger';

export interface DropdownContentProps extends React.HTMLAttributes<HTMLDivElement> {
    align?: 'start' | 'center' | 'end';
}

const DropdownContent = React.forwardRef<HTMLDivElement, DropdownContentProps>(
    ({ className, align = 'start', children, ...props }, ref) => {
        const { open } = useDropdown();

        if (!open) return null;

        const alignClass = {
            start: 'left-0',
            center: 'left-1/2 -translate-x-1/2',
            end: 'right-0',
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg',
                    'animate-in fade-in-0 zoom-in-95 duration-150',
                    alignClass[align],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
DropdownContent.displayName = 'DropdownContent';

export interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    selected?: boolean;
    destructive?: boolean;
    asChild?: boolean;
}

const DropdownItem = React.forwardRef<HTMLButtonElement, DropdownItemProps>(
    ({ className, children, selected, destructive, disabled, onClick, asChild = false, ...props }, ref) => {
        const { setOpen } = useDropdown();
        const Comp = asChild ? Slot : 'button';

        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (!disabled) {
                onClick?.(e);
                setOpen(false);
            }
        };

        return (
            <Comp
                ref={ref}
                type="button"
                onClick={handleClick}
                disabled={disabled}
                className={cn(
                    'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                    'focus:bg-accent focus:text-accent-foreground',
                    'hover:bg-accent hover:text-accent-foreground',
                    destructive && 'text-destructive focus:text-destructive hover:text-destructive',
                    disabled && 'pointer-events-none opacity-50',
                    className
                )}
                {...props}
            >
                {asChild ? (
                    children
                ) : (
                    <>
                        {children}
                        {selected && <Check className="ml-auto h-4 w-4" />}
                    </>
                )}
            </Comp>
        );
    }
);
DropdownItem.displayName = 'DropdownItem';

const DropdownSeparator = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('-mx-1 my-1 h-px bg-muted', className)}
        {...props}
    />
));
DropdownSeparator.displayName = 'DropdownSeparator';

const DropdownLabel = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('px-2 py-1.5 text-xs font-semibold text-muted-foreground', className)}
        {...props}
    />
));
DropdownLabel.displayName = 'DropdownLabel';

export {
    DropdownMenu,
    DropdownTrigger,
    DropdownContent,
    DropdownItem,
    DropdownSeparator,
    DropdownLabel,
    // Aliases for naming consistency with Radix UI naming convention
    DropdownTrigger as DropdownMenuTrigger,
    DropdownContent as DropdownMenuContent,
    DropdownItem as DropdownMenuItem,
    DropdownSeparator as DropdownMenuSeparator,
    DropdownLabel as DropdownMenuLabel,
};

