'use client';

import Link from 'next/link';
import { MapPin, Clock, Phone, Mail, ChevronDown, ChevronUp, ExternalLink, Navigation } from 'lucide-react';
import type { Agency, OpeningHour } from '@/lib/api/public';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';

const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

function normalizeTime(time: string | number[] | undefined): { h: number, m: number } | null {
    if (!time) return null;
    if (Array.isArray(time)) {
        return { h: time[0] ?? 0, m: time[1] ?? 0 };
    }
    const parts = String(time).split(':');
    return { h: Number(parts[0]), m: Number(parts[1]) || 0 };
}

function formatTime(time: string | number[] | undefined): string {
    const t = normalizeTime(time);
    if (!t) return '';
    return `${String(t.h).padStart(2, '0')}h${String(t.m).padStart(2, '0')}`;
}

function isOpenNow(hours: OpeningHour[] | undefined): boolean {
    if (!hours || hours.length === 0) return false;
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const todayHours = hours.find((h) => h.dayOfWeek === currentDay || (currentDay === 0 && h.dayOfWeek === 7));

    if (!todayHours || todayHours.isClosed) return false;

    const start = normalizeTime(todayHours.opensAt);
    const end = normalizeTime(todayHours.closesAt);

    if (!start || !end) return false;

    const openMinutes = start.h * 60 + start.m;
    const closeMinutes = end.h * 60 + end.m;

    return currentTime >= openMinutes && currentTime <= closeMinutes;
}

const AgencyMap = dynamic(() => import('./agency-map'), {
    loading: () => <div className="w-full h-48 bg-muted animate-pulse rounded-lg" />,
    ssr: false
});

const DirectionsMap = dynamic(() => import('../map/directions-map').then(m => ({ default: m.DirectionsMap })), {
    loading: () => <div className="w-full h-64 bg-muted animate-pulse rounded-lg" />,
    ssr: false
});

interface AgencyCardProps {
    agency: Agency;
}

function AgencyCard({ agency }: AgencyCardProps) {
    const [showHours, setShowHours] = useState(false);
    const [showDirections, setShowDirections] = useState(false);

    const openingHours = agency.openingHours ?? [];
    const isOpen = isOpenNow(openingHours);
    const today = new Date().getDay();
    const todayHours = openingHours.find((h) => h.dayOfWeek === today || (today === 0 && h.dayOfWeek === 7));

    const hoursMap = new Map<number, OpeningHour>();
    openingHours.forEach(h => {
        const dayIdx = h.dayOfWeek === 7 ? 0 : h.dayOfWeek;
        hoursMap.set(dayIdx, h);
    });

    const displayOrder = [1, 2, 3, 4, 5, 6, 0];

    return (
        <div className="rounded-xl border bg-card overflow-hidden">
            {/* Map Section */}
            <div className="h-48 w-full border-b relative z-0">
                <AgencyMap agency={agency} />
            </div>

            {/* Directions Map (expandable) */}
            {showDirections && agency.address?.latitude && agency.address?.longitude && (
                <div className="p-4 border-b bg-muted/30">
                    <DirectionsMap
                        destination={{
                            lat: agency.address.latitude,
                            lng: agency.address.longitude,
                            name: agency.name,
                            address: agency.address.streetLine1,
                        }}
                        className="h-72"
                    />
                </div>
            )}

            <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h4 className="font-semibold text-lg">{agency.name}</h4>
                        {agency.isHeadquarters && (
                            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block mt-1">
                                Siège principal
                            </span>
                        )}
                    </div>
                    <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${isOpen
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}
                    >
                        {isOpen ? 'Ouvert' : 'Fermé'}
                    </span>
                </div>

                {/* Address */}
                {agency.address?.streetLine1 && (
                    <div className="flex items-start gap-2.5 text-sm text-muted-foreground mb-3">
                        <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <div>
                            <p>{agency.address.streetLine1}</p>
                            {agency.address.streetLine2 && <p>{agency.address.streetLine2}</p>}
                            <p className="font-medium text-foreground">
                                {[agency.address.city, agency.address.stateProvince].filter(Boolean).join(', ')}
                            </p>
                        </div>
                    </div>
                )}

                {/* Contact */}
                <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
                    {agency.phone && (
                        <a href={`tel:${agency.phone}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                            <span className="bg-muted p-1.5 rounded-full"><Phone className="h-3.5 w-3.5" /></span>
                            {agency.phone}
                        </a>
                    )}
                    {agency.email && (
                        <a href={`mailto:${agency.email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                            <span className="bg-muted p-1.5 rounded-full"><Mail className="h-3.5 w-3.5" /></span>
                            {agency.email}
                        </a>
                    )}
                </div>

                {/* Hours Section */}
                <div className="text-sm bg-muted/50 rounded-lg overflow-hidden">
                    <button
                        onClick={() => setShowHours(!showHours)}
                        className="w-full flex items-center justify-between p-3 hover:bg-muted/80 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                                {todayHours ? (
                                    todayHours.isClosed ? 'Fermé aujourd\'hui' : `${formatTime(todayHours.opensAt)} - ${formatTime(todayHours.closesAt)}`
                                ) : 'Horaires'}
                            </span>
                        </div>
                        {showHours ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>

                    {showHours && (
                        <div className="p-3 pt-0 border-t border-dashed space-y-2 mt-2">
                            {displayOrder.map(dayIdx => {
                                const h = hoursMap.get(dayIdx);
                                const isToday = dayIdx === today;
                                return (
                                    <div key={dayIdx} className={`flex justify-between items-center ${isToday ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                                        <span className="w-24">{dayNames[dayIdx]}</span>
                                        <span>
                                            {h ? (
                                                h.isClosed ? 'Fermé' : `${formatTime(h.opensAt)} - ${formatTime(h.closesAt)}`
                                            ) : '-'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Directions Button */}
                {agency.address?.latitude && agency.address?.longitude && (
                    <Button
                        variant={showDirections ? 'default' : 'outline'}
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => setShowDirections(!showDirections)}
                    >
                        <Navigation className="h-4 w-4 mr-2" />
                        {showDirections ? 'Masquer l\'itinéraire' : 'Calculer l\'itinéraire'}
                    </Button>
                )}

                {/* View Details Link - Use agency slug (id for now) */}
                {agency.id && ( // Assuming id is used as slug or part of URL
                    <Link href={`/agency/${agency.id}`} className="w-full mt-2 block">
                        <Button variant="ghost" size="sm" className="w-full">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Voir détails
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}


interface OrgAgenciesProps {
    agencies: Agency[];
}

export function OrgAgencies({ agencies }: OrgAgenciesProps) {
    if (!agencies || agencies.length === 0) return null;

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Nos agences</h3>
            <div className="grid gap-4 md:grid-cols-2">
                {agencies.map((agency) => (
                    <AgencyCard key={agency.id} agency={agency} />
                ))}
            </div>
        </div>
    );
}
