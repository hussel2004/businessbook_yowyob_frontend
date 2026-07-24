'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface FilterOption {
    id: string;
    label: string;
}

interface FilterChipsProps {
    options: FilterOption[];
    selectedIds: string[];
    onSelect: (id: string) => void;
    className?: string;
}

export function FilterChips({ options, selectedIds, onSelect, className }: FilterChipsProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 200;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
            setTimeout(checkScroll, 300);
        }
    };

    return (
        <div className={cn("relative group", className)}>
            {canScrollLeft && (
                <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-background to-transparent w-16 z-10 flex items-center">
                    <button
                        onClick={() => scroll('left')}
                        className="rounded-full bg-background/90 p-1.5 shadow-md hover:bg-muted border border-border/50 ml-1"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                </div>
            )}

            <div
                ref={scrollRef}
                onScroll={checkScroll}
                className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-2 px-1 scroll-smooth"
            >
                {options.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => onSelect(option.id)}
                        className={cn(
                            "whitespace-nowrap px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border",
                            selectedIds.includes(option.id)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
                        )}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {canScrollRight && (
                <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-background to-transparent w-16 z-10 flex items-center justify-end">
                    <button
                        onClick={() => scroll('right')}
                        className="rounded-full bg-background/90 p-1.5 shadow-md hover:bg-muted border border-border/50 mr-1"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
