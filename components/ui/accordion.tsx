'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

interface AccordionContextValue {
    openItems: string[];
    toggleItem: (value: string) => void;
    type: 'single' | 'multiple';
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

const useAccordion = () => {
    const context = React.useContext(AccordionContext);
    if (!context) {
        throw new Error('Accordion components must be wrapped in <Accordion />');
    }
    return context;
};

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
    type?: 'single' | 'multiple';
    defaultValue?: string | string[];
    collapsible?: boolean;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
    ({ className, type = 'single', defaultValue, collapsible = true, children, ...props }, ref) => {
        const [openItems, setOpenItems] = React.useState<string[]>(() => {
            if (!defaultValue) return [];
            return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
        });

        const toggleItem = (value: string) => {
            if (type === 'single') {
                if (openItems.includes(value)) {
                    if (collapsible) {
                        setOpenItems([]);
                    }
                } else {
                    setOpenItems([value]);
                }
            } else {
                if (openItems.includes(value)) {
                    setOpenItems(openItems.filter((item) => item !== value));
                } else {
                    setOpenItems([...openItems, value]);
                }
            }
        };

        return (
            <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
                <div
                    ref={ref}
                    className={cn('space-y-1', className)}
                    {...props}
                >
                    {children}
                </div>
            </AccordionContext.Provider>
        );
    }
);
Accordion.displayName = 'Accordion';

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
    disabled?: boolean;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
    ({ className, value, disabled, children, ...props }, ref) => {
        const { openItems, toggleItem } = useAccordion();
        const isOpen = openItems.includes(value);

        return (
            <div
                ref={ref}
                data-state={isOpen ? 'open' : 'closed'}
                data-disabled={disabled ? '' : undefined}
                className={cn('border rounded-lg', className)}
                {...props}
            >
                {React.Children.map(children, (child) => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child as React.ReactElement<{
                            isOpen: boolean;
                            onToggle: () => void;
                            disabled?: boolean;
                        }>, {
                            isOpen,
                            onToggle: () => !disabled && toggleItem(value),
                            disabled,
                        });
                    }
                    return child;
                })}
            </div>
        );
    }
);
AccordionItem.displayName = 'AccordionItem';

interface AccordionTriggerInternalProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isOpen?: boolean;
    onToggle?: () => void;
}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerInternalProps>(
    ({ className, isOpen, onToggle, disabled, children, ...props }, ref) => (
        <button
            ref={ref}
            type="button"
            onClick={onToggle}
            disabled={disabled}
            aria-expanded={isOpen}
            className={cn(
                'flex flex-1 items-center justify-between w-full p-4 font-medium transition-all text-left',
                'hover:bg-muted/50',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'disabled:pointer-events-none disabled:opacity-50',
                isOpen && 'border-b',
                className
            )}
            {...props}
        >
            {children}
            <ChevronDown
                className={cn(
                    'h-4 w-4 shrink-0 transition-transform duration-200',
                    isOpen && 'rotate-180'
                )}
            />
        </button>
    )
);
AccordionTrigger.displayName = 'AccordionTrigger';

interface AccordionContentInternalProps extends React.HTMLAttributes<HTMLDivElement> {
    isOpen?: boolean;
}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentInternalProps>(
    ({ className, isOpen, children, ...props }, ref) => {
        const contentRef = React.useRef<HTMLDivElement>(null);
        const [height, setHeight] = React.useState<number | undefined>(0);

        React.useEffect(() => {
            if (contentRef.current) {
                setHeight(isOpen ? contentRef.current.scrollHeight : 0);
            }
        }, [isOpen, children]);

        return (
            <div
                ref={ref}
                style={{ height }}
                className={cn(
                    'overflow-hidden transition-all duration-200 ease-in-out',
                    className
                )}
                {...props}
            >
                <div ref={contentRef} className="p-4">
                    {children}
                </div>
            </div>
        );
    }
);
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
