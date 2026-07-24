'use client';

import { useQuery } from '@tanstack/react-query';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Building,
    ArrowLeft,
    Navigation,
    ChevronDown,
    ChevronUp,
    BadgeCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { get } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamic import for map to avoid SSR issues
// Dynamic import for map to avoid SSR issues
const AgencyMap = dynamic(
    () => import('@/components/features/organization/agency-map'),
    {
        loading: () => <div className="w-full h-64 bg-muted animate-pulse rounded-lg" />,
        ssr: false
    }
);

import type { Agency, Organization, Contact, OpeningHour } from '@/lib/api/public';

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

export default function AgencyPageClient({ slug }: { slug: string }) {
    const router = useRouter();
    const [showHours, setShowHours] = useState(false);

    // Fetch agency by ID (slug is the agency ID in this case, or actual slug if supported)
    const { data: agency, isLoading: agencyLoading, error: agencyError } = useQuery({
        queryKey: ['agency', slug],
        queryFn: async () => {
            return get<Agency>(`${ENDPOINTS.ORGANIZATIONS.BASE}/agencies/${slug}`);
        },
    });

    // Fetch parent organization
    const { data: organization } = useQuery({
        queryKey: ['organization', agency?.organizationId],
        queryFn: async () => {
            if (!agency?.organizationId) throw new Error('No org ID');
            return get<Organization>(ENDPOINTS.ORGANIZATIONS.BY_ID(agency.organizationId));
        },
        enabled: !!agency?.organizationId,
    });

    if (agencyError) {
        notFound();
    }

    if (agencyLoading) {
        return (
            <div className="container-wrapper py-8">
                <Skeleton className="h-8 w-48 mb-4" />
                <Skeleton className="h-64 w-full mb-4" />
                <div className="grid gap-4 md:grid-cols-2">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </div>
            </div>
        );
    }

    if (!agency) return null;

    const openingHours = agency.openingHours ?? [];
    const isOpen = isOpenNow(openingHours);
    const today = new Date().getDay();
    const todayHours = openingHours.find((h) => h.dayOfWeek === today || (today === 0 && h.dayOfWeek === 7));

    // Hours map for display
    const hoursMap = new Map<number, OpeningHour>();
    openingHours.forEach(h => {
        const dayIdx = h.dayOfWeek === 7 ? 0 : h.dayOfWeek;
        hoursMap.set(dayIdx, h);
    });
    const displayOrder = [1, 2, 3, 4, 5, 6, 0];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border-b">
                <div className="container-wrapper py-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour
                    </Button>

                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl bg-card border flex items-center justify-center overflow-hidden">
                            {agency.logoUrl || organization?.logoUrl ? (
                                <img
                                    src={agency.logoUrl || organization?.logoUrl}
                                    alt={agency.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Building className="h-8 w-8 text-muted-foreground" />
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-2xl font-bold">{agency.name || 'Agence'}</h1>
                                {agency.isHeadquarters && (
                                    <Badge variant="secondary">Siège principal</Badge>
                                )}
                            </div>
                            {organization && (
                                <div>
                                    <Link
                                        href={`/business/${organization.slug}`}
                                        className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 inline-flex"
                                    >
                                        <Building className="h-4 w-4" />
                                        <span className="font-medium">{organization.longName}</span>
                                        {organization.categoryName && (
                                            <span className="text-xs">• {organization.categoryName}</span>
                                        )}
                                        {organization.isVerified && (
                                            <BadgeCheck className="h-4 w-4 text-primary flex-shrink-0" />
                                        )}
                                    </Link>
                                    {organization.tagline && (
                                        <p className="text-sm text-muted-foreground mt-0.5">{organization.tagline}</p>
                                    )}
                                </div>
                            )}
                        </div>
                        <span
                            className={`px-3 py-1.5 rounded-full text-sm font-medium ${isOpen
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                }`}
                        >
                            {isOpen ? 'Ouvert' : 'Fermé'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container-wrapper py-8">
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Map */}
                        {(agency.address?.latitude && agency.address?.longitude) && (
                            <div className="rounded-xl border overflow-hidden">
                                <div className="h-80">
                                    <AgencyMap agency={{
                                        ...agency,
                                        address: {
                                            ...agency.address!,
                                            latitude: agency.address.latitude!,
                                            longitude: agency.address.longitude!,
                                            city: agency.address.city || '',
                                            neighborhood: agency.address.neighborhood || ''
                                        }
                                    }} />
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        {agency.description && (
                            <div className="rounded-xl border bg-card p-6">
                                <h2 className="text-lg font-semibold mb-3">Description</h2>
                                <p className="text-muted-foreground">{agency.description}</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Address */}
                        <div className="rounded-xl border bg-card p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary" />
                                Localisation
                            </h2>
                            <div className="space-y-3">
                                {agency.address?.neighborhood && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Quartier</p>
                                        <p className="font-medium">{agency.address.neighborhood}</p>
                                    </div>
                                )}
                                {agency.address?.city && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Ville</p>
                                        <p className="font-medium">{agency.address.city}</p>
                                    </div>
                                )}
                                {agency.address?.stateProvince && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Région/Province</p>
                                        <p className="font-medium">{agency.address.stateProvince}</p>
                                    </div>
                                )}
                                {(agency.address?.streetLine1 || agency.address?.streetLine2) && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Adresse</p>
                                        <p className="font-medium">{agency.address?.streetLine1}</p>
                                        {agency.address?.streetLine2 && (
                                            <p className="font-medium">{agency.address.streetLine2}</p>
                                        )}
                                    </div>
                                )}
                                {agency.address?.postalCode && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Code Postal</p>
                                        <p className="font-medium">{agency.address.postalCode}</p>
                                    </div>
                                )}
                                {agency.address?.countryCode && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Pays</p>
                                        <p className="font-medium">{agency.address.countryCode}</p>
                                    </div>
                                )}
                                {agency.address?.landmark && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Point de repère</p>
                                        <p className="font-medium">{agency.address.landmark}</p>
                                    </div>
                                )}
                                {agency.address?.directions && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Instructions d'accès</p>
                                        <p className="font-medium text-sm">{agency.address.directions}</p>
                                    </div>
                                )}
                                {(agency.address?.latitude && agency.address?.longitude) && (
                                    <div className="pt-2 border-t">
                                        <p className="text-sm text-muted-foreground mb-1">Coordonnées GPS (Avancé)</p>
                                        <p className="font-mono text-xs bg-muted p-2 rounded">
                                            {agency.address.latitude}, {agency.address.longitude}
                                        </p>
                                    </div>
                                )}
                                {(agency.address?.latitude && agency.address?.longitude) && (
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${agency.address.latitude},${agency.address.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full mt-2 block"
                                    >
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full"
                                        >
                                            <Navigation className="h-4 w-4 mr-2" />
                                            Itinéraire
                                        </Button>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Contacts */}
                        {agency.contacts && agency.contacts.length > 0 && (
                            <div className="rounded-xl border bg-card p-6">
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Phone className="h-5 w-5 text-primary" />
                                    Contacts
                                </h2>
                                <div className="space-y-4">
                                    {agency.contacts.map((contact) => (
                                        <div key={contact.id} className="flex flex-col">
                                            <span className="text-sm text-muted-foreground capitalize">
                                                {contact.label || contact.contactType}
                                            </span>
                                            <div className="flex items-center gap-2 mt-1">
                                                {contact.contactType === 'email' ? (
                                                    <Mail className="h-4 w-4 text-primary" />
                                                ) : (
                                                    <Phone className="h-4 w-4 text-primary" />
                                                )}
                                                <a
                                                    href={contact.contactType === 'email' ? `mailto:${contact.value}` : `tel:${contact.value}`}
                                                    className="font-medium hover:text-primary transition-colors"
                                                >
                                                    {contact.value}
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Opening Hours */}
                        <div className="rounded-xl border bg-card overflow-hidden">
                            <button
                                onClick={() => setShowHours(!showHours)}
                                className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-primary" />
                                    <span className="font-semibold">Horaires</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">
                                        {todayHours ? (
                                            todayHours.isClosed
                                                ? 'Fermé aujourd\'hui'
                                                : `${formatTime(todayHours.opensAt)} - ${formatTime(todayHours.closesAt)}`
                                        ) : 'Non renseigné'}
                                    </span>
                                    {showHours ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </div>
                            </button>

                            {showHours && (
                                <div className="p-4 pt-0 border-t space-y-2">
                                    {displayOrder.map(dayIdx => {
                                        const h = hoursMap.get(dayIdx);
                                        const isToday = dayIdx === today;
                                        return (
                                            <div
                                                key={dayIdx}
                                                className={`flex justify-between items-center py-1 ${isToday ? 'font-bold text-primary' : 'text-muted-foreground'
                                                    }`}
                                            >
                                                <span>{dayNames[dayIdx]}</span>
                                                <span>
                                                    {h ? (
                                                        h.isClosed
                                                            ? 'Fermé'
                                                            : `${formatTime(h.opensAt)} - ${formatTime(h.closesAt)}`
                                                    ) : '-'}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Back to Organization */}
                        {organization && organization.slug && (
                            <Link href={`/business/${organization.slug}`} className="w-full block">
                                <Button className="w-full">
                                    <Building className="h-4 w-4 mr-2" />
                                    Voir l&apos;entreprise
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
