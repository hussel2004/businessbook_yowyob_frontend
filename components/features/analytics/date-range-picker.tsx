'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { Calendar, ChevronDown } from 'lucide-react';
import { subDays, format } from 'date-fns';
import type { DateRangeOption } from '@/types/analytics';

interface DateRangePickerProps {
    value: DateRangeOption;
    onChange: (value: DateRangeOption, from: string, to: string) => void;
}

const OPTIONS: { value: DateRangeOption; label: string; days: number }[] = [
    { value: '7d', label: '7 derniers jours', days: 7 },
    { value: '30d', label: '30 derniers jours', days: 30 },
    { value: '90d', label: '90 derniers jours', days: 90 },
];

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
    const [isOpen, setIsOpen] = useState(false);

    const currentOption = OPTIONS.find((opt) => opt.value === value) ?? { value: '30d' as DateRangeOption, label: '30 derniers jours', days: 30 };

    const handleSelect = (option: typeof OPTIONS[0]) => {
        const to = format(new Date(), 'yyyy-MM-dd');
        const from = format(subDays(new Date(), option.days), 'yyyy-MM-dd');
        onChange(option.value, from, to);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <Button
                variant="outline"
                onClick={() => setIsOpen(!isOpen)}
                className="justify-between gap-2"
            >
                <Calendar className="h-4 w-4" />
                <span>{currentOption.label}</span>
                <ChevronDown
                    className={cn(
                        'h-4 w-4 transition-transform',
                        isOpen && 'rotate-180'
                    )}
                />
            </Button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border bg-card p-1 shadow-lg">
                        {OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleSelect(option)}
                                className={cn(
                                    'flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors',
                                    value === option.value
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-muted'
                                )}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
