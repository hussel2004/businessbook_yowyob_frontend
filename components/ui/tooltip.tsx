'use client';

import * as React from 'react';

import { cn } from '@/lib/utils/cn';

export interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactElement;
    side?: 'top' | 'right' | 'bottom' | 'left';
    delayDuration?: number;
}

const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
};

const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-popover border-x-transparent border-b-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-popover border-y-transparent border-l-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-popover border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-popover border-y-transparent border-r-transparent',
};

const Tooltip = ({ content, children, side = 'top', delayDuration = 200 }: TooltipProps) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [shouldRender, setShouldRender] = React.useState(false);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        timeoutRef.current = setTimeout(() => {
            setShouldRender(true);
            // Small delay to allow animation
            requestAnimationFrame(() => {
                setIsVisible(true);
            });
        }, delayDuration);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
        // Wait for animation to complete
        setTimeout(() => {
            setShouldRender(false);
        }, 150);
    };

    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="relative inline-flex">
            {React.cloneElement(children, {
                onMouseEnter: handleMouseEnter,
                onMouseLeave: handleMouseLeave,
                onFocus: handleMouseEnter,
                onBlur: handleMouseLeave,
            })}
            {shouldRender && (
                <div
                    role="tooltip"
                    className={cn(
                        'absolute z-50 px-3 py-1.5 text-xs font-medium text-popover-foreground bg-popover rounded-md shadow-md border whitespace-nowrap',
                        'transition-all duration-150',
                        positionClasses[side],
                        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    )}
                >
                    {content}
                    {/* Arrow */}
                    <div
                        className={cn(
                            'absolute w-0 h-0 border-4',
                            arrowClasses[side]
                        )}
                    />
                </div>
            )}
        </div>
    );
};
Tooltip.displayName = 'Tooltip';

export { Tooltip };
