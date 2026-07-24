'use client';

import Image from 'next/image';
import { Check, Minus, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type Support = 'yes' | 'partial' | 'no';

interface BenchmarkRow {
    feature: string;
    businessbook: Support;
    gmb: Support;
    yelp: Support;
    maligah: Support;
    classic: Support;
}

const rows: BenchmarkRow[] = [
    {
        feature: 'Fiches entreprises vérifiées manuellement par une équipe locale',
        businessbook: 'yes',
        gmb: 'partial',
        yelp: 'partial',
        maligah: 'partial',
        classic: 'no',
    },
    {
        feature: "Couverture dédiée à l'Afrique centrale, villes secondaires incluses",
        businessbook: 'yes',
        gmb: 'partial',
        yelp: 'no',
        maligah: 'partial',
        classic: 'no',
    },
    {
        feature: 'Recherche géolocalisée et filtres par secteur d’activité',
        businessbook: 'yes',
        gmb: 'yes',
        yelp: 'yes',
        maligah: 'yes',
        classic: 'partial',
    },
    {
        feature: 'Avis clients vérifiés et modérés contre les faux avis',
        businessbook: 'yes',
        gmb: 'partial',
        yelp: 'partial',
        maligah: 'partial',
        classic: 'no',
    },
    {
        feature: 'Espace pro pour gérer sa fiche en temps réel',
        businessbook: 'yes',
        gmb: 'yes',
        yelp: 'yes',
        maligah: 'partial',
        classic: 'no',
    },
    {
        feature: 'Statistiques de visibilité et analytics pour les entreprises',
        businessbook: 'yes',
        gmb: 'partial',
        yelp: 'partial',
        maligah: 'no',
        classic: 'no',
    },
    {
        feature: 'Mise en relation directe (appel, WhatsApp, itinéraire)',
        businessbook: 'yes',
        gmb: 'partial',
        yelp: 'partial',
        maligah: 'yes',
        classic: 'partial',
    },
    {
        feature: 'Utilisable en contexte de connexion faible ou instable',
        businessbook: 'yes',
        gmb: 'no',
        yelp: 'no',
        maligah: 'partial',
        classic: 'yes',
    },
    {
        feature: 'Support et accompagnement en français, ancré localement',
        businessbook: 'yes',
        gmb: 'no',
        yelp: 'no',
        maligah: 'partial',
        classic: 'partial',
    },
    {
        feature: "Intégration à un écosystème d'outils de gestion (compta, RH...)",
        businessbook: 'yes',
        gmb: 'no',
        yelp: 'no',
        maligah: 'no',
        classic: 'no',
    },
    {
        feature: 'Indépendance vis-à-vis des plateformes internationales tierces',
        businessbook: 'yes',
        gmb: 'no',
        yelp: 'no',
        maligah: 'partial',
        classic: 'yes',
    },
];

function SupportIcon({ status }: { status: Support }) {
    if (status === 'yes') {
        return (
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                <Check className="h-4 w-4" strokeWidth={3} />
            </span>
        );
    }
    if (status === 'partial') {
        return (
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
                <Minus className="h-4 w-4" strokeWidth={3} />
            </span>
        );
    }
    return (
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-500/15 dark:text-red-400">
            <X className="h-4 w-4" strokeWidth={3} />
        </span>
    );
}

interface CompetitorHeaderProps {
    name: string;
    subtitle: string;
    logoSrc?: string;
    highlighted?: boolean;
}

function CompetitorHeader({ name, subtitle, logoSrc, highlighted }: CompetitorHeaderProps) {
    return (
        <div className="flex flex-col items-center gap-1.5">
            {logoSrc ? (
                <Image
                    src={logoSrc}
                    alt={name}
                    width={28}
                    height={28}
                    className="rounded-md object-contain"
                />
            ) : (
                <span
                    className={cn(
                        'inline-flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold',
                        highlighted
                            ? 'bg-primary/15 text-primary'
                            : 'bg-muted text-muted-foreground'
                    )}
                >
                    {name.charAt(0)}
                </span>
            )}
            <span
                className={cn(
                    'font-bold text-sm',
                    highlighted ? 'text-foreground' : 'text-foreground/80'
                )}
            >
                {name}
            </span>
            <span
                className={cn(
                    'text-xs text-center',
                    highlighted ? 'text-primary font-medium' : 'text-muted-foreground'
                )}
            >
                {subtitle}
            </span>
        </div>
    );
}

export function BenchmarkSection() {
    return (
        <section className="py-16 md:py-24">
            <div className="container-wrapper">
                <div className="text-center mb-12">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        Comparatif
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                        Pourquoi choisir BusinessBook ?
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Comparé à Google My Business, Yelp, Maligah et aux solutions classiques,
                        BusinessBook offre la couverture la plus complète et la plus fiable pour
                        l&apos;Afrique centrale.
                    </p>
                </div>

                <div className="rounded-2xl border bg-card shadow-soft overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1040px] border-collapse">
                            <thead>
                                <tr className="border-b bg-muted/30">
                                    <th className="text-left font-semibold text-sm text-muted-foreground uppercase tracking-wide px-6 py-5 w-[28%]">
                                        Fonctionnalité
                                    </th>
                                    <th className="px-4 py-5 w-[18%]">
                                        <CompetitorHeader
                                            name="BusinessBook"
                                            subtitle="Annuaire certifié"
                                            logoSrc="/businessbook_logo.png"
                                            highlighted
                                        />
                                    </th>
                                    <th className="px-4 py-5 w-[14.5%]">
                                        <CompetitorHeader
                                            name="Google My Business"
                                            subtitle="Fiches Google Maps"
                                            logoSrc="/competitors/google-business-profile.png"
                                        />
                                    </th>
                                    <th className="px-4 py-5 w-[14.5%]">
                                        <CompetitorHeader
                                            name="Yelp"
                                            subtitle="Annuaire & avis"
                                            logoSrc="/competitors/yelp.png"
                                        />
                                    </th>
                                    <th className="px-4 py-5 w-[14.5%]">
                                        <CompetitorHeader
                                            name="Maligah"
                                            subtitle="Annuaire en ligne"
                                            logoSrc="/competitors/maligah.png"
                                        />
                                    </th>
                                    <th className="px-4 py-5 w-[14.5%]">
                                        <CompetitorHeader
                                            name="Solutions classiques"
                                            subtitle="Pages jaunes, bouche-à-oreille"
                                        />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, idx) => (
                                    <tr
                                        key={row.feature}
                                        className={cn(
                                            'border-b last:border-b-0',
                                            idx % 2 === 1 && 'bg-muted/20'
                                        )}
                                    >
                                        <td className="px-6 py-4 text-sm font-medium text-foreground">
                                            {row.feature}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex justify-center bg-primary/5 rounded-lg py-1">
                                                <SupportIcon status={row.businessbook} />
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex justify-center">
                                                <SupportIcon status={row.gmb} />
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex justify-center">
                                                <SupportIcon status={row.yelp} />
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex justify-center">
                                                <SupportIcon status={row.maligah} />
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex justify-center">
                                                <SupportIcon status={row.classic} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <SupportIcon status="yes" />
                        <span>Disponible</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <SupportIcon status="partial" />
                        <span>Partiel / limité</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <SupportIcon status="no" />
                        <span>Indisponible</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
