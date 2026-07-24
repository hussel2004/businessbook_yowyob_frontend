'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Clock, Sun, Moon, Copy, Check } from 'lucide-react';
import type { OpeningHour } from '@/types/organization';

interface OpeningHoursEditorProps {
    hours: OpeningHour[];
    onChange: (hours: OpeningHour[]) => void;
    disabled?: boolean;
}

const DAYS = [
    { value: 1, label: 'Lundi', short: 'Lun' },
    { value: 2, label: 'Mardi', short: 'Mar' },
    { value: 3, label: 'Mercredi', short: 'Mer' },
    { value: 4, label: 'Jeudi', short: 'Jeu' },
    { value: 5, label: 'Vendredi', short: 'Ven' },
    { value: 6, label: 'Samedi', short: 'Sam' },
    { value: 7, label: 'Dimanche', short: 'Dim' },
];

const DEFAULT_HOURS: OpeningHour[] = DAYS.map((day) => ({
    dayOfWeek: day.value,
    opensAt: '08:00',
    closesAt: '18:00',
    isClosed: day.value === 7, // Sunday closed by default
    is24h: false,
}));

export function OpeningHoursEditor({ hours, onChange, disabled }: OpeningHoursEditorProps) {
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [copiedDay, setCopiedDay] = useState<number | null>(null);

    // Ensure all days are represented
    const normalizedHours: OpeningHour[] = DAYS.map((day) => {
        const existing = hours.find((h) => h.dayOfWeek === day.value);
        return existing || { ...DEFAULT_HOURS[day.value - 1]!, dayOfWeek: day.value };
    });

    const updateDay = (dayOfWeek: number, updates: Partial<OpeningHour>) => {
        const newHours = normalizedHours.map((h) => {
            if (h.dayOfWeek === dayOfWeek) {
                return { ...h, ...updates };
            }
            return h;
        }) as OpeningHour[];
        onChange(newHours);
    };

    const copyToAllDays = (sourceDayOfWeek: number) => {
        const sourceDay = normalizedHours.find((h) => h.dayOfWeek === sourceDayOfWeek);
        if (!sourceDay) return;

        const newHours = normalizedHours.map((h) => ({
            ...h,
            opensAt: sourceDay.opensAt,
            closesAt: sourceDay.closesAt,
            opensAt2: sourceDay.opensAt2,
            closesAt2: sourceDay.closesAt2,
            isClosed: sourceDay.isClosed,
            is24h: sourceDay.is24h,
        }));
        onChange(newHours);
        setCopiedDay(sourceDayOfWeek);
        setTimeout(() => setCopiedDay(null), 2000);
    };

    const copyToWeekdays = (sourceDayOfWeek: number) => {
        const sourceDay = normalizedHours.find((h) => h.dayOfWeek === sourceDayOfWeek);
        if (!sourceDay) return;

        const newHours = normalizedHours.map((h) => {
            // Only copy to weekdays (Mon-Fri = 1-5)
            if (h.dayOfWeek >= 1 && h.dayOfWeek <= 5) {
                return {
                    ...h,
                    opensAt: sourceDay.opensAt,
                    closesAt: sourceDay.closesAt,
                    opensAt2: sourceDay.opensAt2,
                    closesAt2: sourceDay.closesAt2,
                    isClosed: sourceDay.isClosed,
                    is24h: sourceDay.is24h,
                };
            }
            return h;
        });
        onChange(newHours);
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Définissez vos horaires d&apos;ouverture</span>
                </div>
            </div>

            {/* Days Grid */}
            <div className="space-y-2">
                {normalizedHours.map((dayHours) => {
                    const day = DAYS.find((d) => d.value === dayHours.dayOfWeek)!;
                    const isWeekend = dayHours.dayOfWeek >= 6;
                    const isExpanded = selectedDay === dayHours.dayOfWeek;

                    return (
                        <div
                            key={dayHours.dayOfWeek}
                            className={`rounded-xl border bg-card overflow-hidden transition-all ${isExpanded ? 'ring-2 ring-primary' : ''
                                } ${isWeekend ? 'bg-muted/30' : ''}`}
                        >
                            {/* Day Row */}
                            <div
                                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => setSelectedDay(isExpanded ? null : dayHours.dayOfWeek)}
                            >
                                {/* Day Name */}
                                <div className="w-28 flex items-center gap-2">
                                    {isWeekend ? (
                                        <Moon className="h-4 w-4 text-purple-500" />
                                    ) : (
                                        <Sun className="h-4 w-4 text-yellow-500" />
                                    )}
                                    <span className="font-medium">{day.label}</span>
                                </div>

                                {/* Status */}
                                <div className="flex-1">
                                    {dayHours.isClosed ? (
                                        <span className="text-red-500 font-medium">Fermé</span>
                                    ) : dayHours.is24h ? (
                                        <span className="text-green-500 font-medium">Ouvert 24h/24</span>
                                    ) : (
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-md font-mono">
                                                {dayHours.opensAt}
                                            </span>
                                            <span className="text-muted-foreground">→</span>
                                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-md font-mono">
                                                {dayHours.closesAt}
                                            </span>
                                            {dayHours.opensAt2 && dayHours.closesAt2 && (
                                                <>
                                                    <span className="text-muted-foreground mx-2">|</span>
                                                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-md font-mono">
                                                        {dayHours.opensAt2}
                                                    </span>
                                                    <span className="text-muted-foreground">→</span>
                                                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-md font-mono">
                                                        {dayHours.closesAt2}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Toggle */}
                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                    <span className="text-xs text-muted-foreground">Ouvert</span>
                                    <Switch
                                        checked={!dayHours.isClosed}
                                        onCheckedChange={(checked) => updateDay(dayHours.dayOfWeek, { isClosed: !checked })}
                                        disabled={disabled}
                                    />
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {isExpanded && !dayHours.isClosed && (
                                <div className="border-t bg-muted/20 p-4 space-y-4">
                                    {/* 24h Toggle */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Ouvert 24h/24</span>
                                        <Switch
                                            checked={dayHours.is24h}
                                            onCheckedChange={(checked) => updateDay(dayHours.dayOfWeek, { is24h: checked })}
                                            disabled={disabled}
                                        />
                                    </div>

                                    {!dayHours.is24h && (
                                        <>
                                            {/* Primary Hours */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Ouverture</label>
                                                    <Input
                                                        type="time"
                                                        value={dayHours.opensAt || ''}
                                                        onChange={(e) => updateDay(dayHours.dayOfWeek, { opensAt: e.target.value })}
                                                        disabled={disabled}
                                                        className="font-mono"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Fermeture</label>
                                                    <Input
                                                        type="time"
                                                        value={dayHours.closesAt || ''}
                                                        onChange={(e) => updateDay(dayHours.dayOfWeek, { closesAt: e.target.value })}
                                                        disabled={disabled}
                                                        className="font-mono"
                                                    />
                                                </div>
                                            </div>

                                            {/* Secondary Hours (for lunch break) */}
                                            <div className="border-t pt-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-sm font-medium text-muted-foreground">
                                                        Deuxième plage horaire (ex: après pause déjeuner)
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            if (dayHours.opensAt2) {
                                                                updateDay(dayHours.dayOfWeek, { opensAt2: undefined, closesAt2: undefined });
                                                            } else {
                                                                updateDay(dayHours.dayOfWeek, { opensAt2: '14:00', closesAt2: '18:00' });
                                                            }
                                                        }}
                                                        disabled={disabled}
                                                    >
                                                        {dayHours.opensAt2 ? 'Supprimer' : 'Ajouter'}
                                                    </Button>
                                                </div>

                                                {dayHours.opensAt2 && (
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Réouverture</label>
                                                            <Input
                                                                type="time"
                                                                value={dayHours.opensAt2 || ''}
                                                                onChange={(e) => updateDay(dayHours.dayOfWeek, { opensAt2: e.target.value })}
                                                                disabled={disabled}
                                                                className="font-mono"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Fermeture</label>
                                                            <Input
                                                                type="time"
                                                                value={dayHours.closesAt2 || ''}
                                                                onChange={(e) => updateDay(dayHours.dayOfWeek, { closesAt2: e.target.value })}
                                                                disabled={disabled}
                                                                className="font-mono"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Notes */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Notes (optionnel)</label>
                                                <Input
                                                    placeholder="Ex: Fermé le 1er lundi du mois"
                                                    value={dayHours.notes || ''}
                                                    onChange={(e) => updateDay(dayHours.dayOfWeek, { notes: e.target.value })}
                                                    disabled={disabled}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {/* Copy Actions */}
                                    <div className="flex items-center gap-2 pt-2 border-t">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => copyToWeekdays(dayHours.dayOfWeek)}
                                            disabled={disabled}
                                        >
                                            <Copy className="h-3 w-3 mr-1" />
                                            Copier en semaine
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => copyToAllDays(dayHours.dayOfWeek)}
                                            disabled={disabled}
                                        >
                                            {copiedDay === dayHours.dayOfWeek ? (
                                                <>
                                                    <Check className="h-3 w-3 mr-1 text-green-500" />
                                                    Copié!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-3 w-3 mr-1" />
                                                    Copier tous les jours
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 pt-4 border-t">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        const standardHours = DAYS.map((day) => ({
                            dayOfWeek: day.value,
                            opensAt: '08:00',
                            closesAt: '18:00',
                            isClosed: day.value === 7,
                            is24h: false,
                        }));
                        onChange(standardHours);
                    }}
                    disabled={disabled}
                >
                    🏢 Horaires bureau (8h-18h, dim fermé)
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        const shopHours = DAYS.map((day) => ({
                            dayOfWeek: day.value,
                            opensAt: '09:00',
                            closesAt: '13:00',
                            opensAt2: '15:00',
                            closesAt2: '19:00',
                            isClosed: day.value === 7,
                            is24h: false,
                        }));
                        onChange(shopHours);
                    }}
                    disabled={disabled}
                >
                    🏪 Horaires boutique (pause déjeuner)
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        const allDaysOpen = DAYS.map((day) => ({
                            dayOfWeek: day.value,
                            isClosed: false,
                            is24h: true,
                        }));
                        onChange(allDaysOpen);
                    }}
                    disabled={disabled}
                >
                    ⏰ 24h/24, 7j/7
                </Button>
            </div>
        </div>
    );
}

export default OpeningHoursEditor;
