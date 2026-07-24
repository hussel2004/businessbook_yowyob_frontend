'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Search, Loader2 } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/use-debounce'; // I need to check if this hook exists, usually standard.
import { getSearchSuggestions } from '@/lib/api/public';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils/cn';

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onSearch?: (term: string) => void;
    centered?: boolean;
}

export function SearchBar({ className, onSearch, centered, ...props }: SearchBarProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = React.useState(props.value as string || '');
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Update local state if prop changes
    React.useEffect(() => {
        if (props.value !== undefined) {
            setSearchTerm(props.value as string);
        }
    }, [props.value]);

    // Debounce search term
    const debouncedTerm = useDebounce(searchTerm, 300);

    // Fetch suggestions
    const { data: suggestions = [], isLoading } = useQuery({
        queryKey: ['search-suggestions', debouncedTerm],
        queryFn: () => getSearchSuggestions(debouncedTerm),
        enabled: debouncedTerm.length >= 2,
    });

    // Handle clicks outside to close dropdown
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (term: string) => {
        if (!term.trim()) return;
        setIsOpen(false);
        setSearchTerm(term); // Sync input
        if (onSearch) {
            onSearch(term);
        } else {
            router.push(`/search?q=${encodeURIComponent(term)}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch(searchTerm);
        }
    };

    const showSuggestions = isOpen && (isLoading || suggestions.length > 0) && searchTerm.length >= 2;

    return (
        <div
            ref={containerRef}
            className={cn('relative w-full max-w-xl', centered && 'mx-auto', className)}
        >
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    ref={inputRef}
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsOpen(true)}
                    className="pl-10 h-12 text-base rounded-full shadow-sm border-muted-foreground/20 focus-visible:ring-primary"
                    placeholder="Rechercher une entreprise, un service..."
                    {...props}
                />
                {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background rounded-xl border shadow-lg overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                    <ul className="py-2">
                        {suggestions.map((suggestion, index) => (
                            <li key={index}>
                                <button
                                    className="w-full text-left px-4 py-2.5 hover:bg-muted/50 transition-colors flex items-center gap-3 text-sm"
                                    onClick={() => handleSearch(suggestion)}
                                >
                                    <Search className="h-4 w-4 text-muted-foreground" />
                                    <span>{suggestion}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
