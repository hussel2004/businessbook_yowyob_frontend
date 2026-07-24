import React, { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Input } from './input';
import { Badge } from './badge';
import { cn } from '@/lib/utils/cn';

interface TagInputProps {
    placeholder?: string;
    value: string[];
    onChange: (tags: string[]) => void;
    className?: string;
    maxTags?: number;
}

export function TagInput({
    placeholder = 'Appuyez sur Entrée pour ajouter...',
    value = [],
    onChange,
    className,
    maxTags = 10
}: TagInputProps) {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
        } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
            removeTag(value.length - 1);
        }
    };

    const addTag = () => {
        const tag = inputValue.trim();
        if (tag && !value.includes(tag)) {
            if (value.length < maxTags) {
                onChange([...value, tag]);
                setInputValue('');
            }
        }
    };

    const removeTag = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <div className="flex flex-wrap gap-2 mb-2 min-h-[2rem]">
                {value.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="px-2 py-1 text-sm flex items-center gap-1">
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="ml-1 hover:text-destructive focus:outline-none"
                        >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove {tag}</span>
                        </button>
                    </Badge>
                ))}
            </div>
            <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={addTag}
                placeholder={value.length >= maxTags ? 'Limite atteinte' : placeholder}
                disabled={value.length >= maxTags}
            />
            <p className="text-xs text-muted-foreground">
                {value.length}/{maxTags} mots-clés
            </p>
        </div>
    );
}
