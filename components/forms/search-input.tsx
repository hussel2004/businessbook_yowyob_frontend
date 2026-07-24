'use client';

import * as React from 'react';
import { Search, X, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { Button } from '../ui/button';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    value?: string;
    onChange?: (value: string) => void;
    onSearch?: (value: string) => void;
    suggestions?: string[];
    onSuggestionSelect?: (suggestion: string) => void;
    isLoading?: boolean;
    showClear?: boolean;
    debounceMs?: number;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
    ({
        className,
        value,
        onChange,
        onSearch,
        suggestions = [],
        onSuggestionSelect,
        isLoading,
        showClear = true,
        debounceMs = 300,
        placeholder = 'Rechercher...',
        ...props
    }, ref) => {
        const [internalValue, setInternalValue] = React.useState(value ?? '');
        const [showSuggestions, setShowSuggestions] = React.useState(false);
        const [selectedIndex, setSelectedIndex] = React.useState(-1);
        const containerRef = React.useRef<HTMLDivElement>(null);
        const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

        React.useEffect(() => {
            if (value !== undefined) {
                setInternalValue(value);
            }
        }, [value]);

        React.useEffect(() => {
            const handleClickOutside = (e: MouseEvent) => {
                if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                    setShowSuggestions(false);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            setInternalValue(newValue);
            setShowSuggestions(true);
            setSelectedIndex(-1);

            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            debounceRef.current = setTimeout(() => {
                onChange?.(newValue);
            }, debounceMs);
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                    handleSuggestionSelect(suggestions[selectedIndex]);
                } else {
                    onSearch?.(internalValue);
                    setShowSuggestions(false);
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
            } else if (e.key === 'Escape') {
                setShowSuggestions(false);
            }
        };

        const handleSuggestionSelect = (suggestion: string) => {
            setInternalValue(suggestion);
            onChange?.(suggestion);
            onSuggestionSelect?.(suggestion);
            setShowSuggestions(false);
        };

        const handleClear = () => {
            setInternalValue('');
            onChange?.('');
            setShowSuggestions(false);
        };

        const handleSubmit = () => {
            onSearch?.(internalValue);
            setShowSuggestions(false);
        };

        return (
            <div ref={containerRef} className="relative w-full">
                <div className="relative flex items-center">
                    <div className="absolute left-3 text-muted-foreground pointer-events-none">
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Search className="h-4 w-4" />
                        )}
                    </div>
                    <input
                        ref={ref}
                        type="text"
                        value={internalValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                        placeholder={placeholder}
                        className={cn(
                            'flex h-10 w-full rounded-lg border border-input bg-background pl-10 pr-20 py-2 text-sm ring-offset-background',
                            'placeholder:text-muted-foreground',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                            className
                        )}
                        {...props}
                    />
                    <div className="absolute right-1 flex items-center gap-1">
                        {showClear && internalValue && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={handleClear}
                            >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Effacer</span>
                            </Button>
                        )}
                        <Button
                            type="button"
                            size="sm"
                            className="h-8"
                            onClick={handleSubmit}
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Suggestions dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95">
                        <ul className="max-h-60 overflow-auto p-1">
                            {suggestions.map((suggestion, idx) => (
                                <li
                                    key={suggestion}
                                    onClick={() => handleSuggestionSelect(suggestion)}
                                    className={cn(
                                        'flex items-center gap-2 px-3 py-2 text-sm cursor-pointer rounded-sm',
                                        'hover:bg-accent hover:text-accent-foreground',
                                        selectedIndex === idx && 'bg-accent text-accent-foreground'
                                    )}
                                >
                                    <Search className="h-3.5 w-3.5 text-muted-foreground" />
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    }
);
SearchInput.displayName = 'SearchInput';

export { SearchInput };
