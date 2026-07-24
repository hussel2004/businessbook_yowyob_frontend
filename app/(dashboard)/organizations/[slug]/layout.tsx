'use client';

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import {
    LayoutDashboard,
    Info,
    MapPin,
    Briefcase,
    Image as ImageIcon,
    PenTool,
    Megaphone,
    ShieldCheck,
    Star,
    MessageSquare,
    BarChart3,
    Share2,
    Lightbulb
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getOrganizationBySlug } from '@/lib/api/public';
import { getAssetUrl } from '@/lib/api/endpoints';
import { Button } from '@/components/ui/button';

export default function OrganizationLayout({ children }: { children: React.ReactNode }) {
    const params = useParams();
    const pathname = usePathname();
    const slug = params.slug as string;

    // We fetch basic org info here for the header/context
    // Ideally we use a cached query or a separate 'manage' endpoint
    const { data: org, isLoading } = useQuery({
        queryKey: ['organization', slug],
        queryFn: () => getOrganizationBySlug(slug),
    });

    if (isLoading) return <div>Chargement...</div>;
    if (!org) return <div>Entreprise introuvable</div>;

    const navItems = [
        { title: 'Vue d\'ensemble', href: `/organizations/${slug}`, icon: LayoutDashboard, exact: true },
        { title: 'Informations', href: `/organizations/${slug}/edit`, icon: Info },
        { title: 'Agences', href: `/organizations/${slug}/branches`, icon: MapPin },
        { title: 'Services', href: `/organizations/${slug}/services`, icon: Briefcase },
        { title: 'Galerie', href: `/organizations/${slug}/gallery`, icon: ImageIcon },
        { title: 'Réseaux sociaux', href: `/organizations/${slug}/social`, icon: Share2 },
        { title: 'Publications', href: `/organizations/${slug}/posts`, icon: PenTool },
        { title: 'Promotions', href: `/organizations/${slug}/promotions`, icon: Megaphone },
        { title: 'Avis', href: `/organizations/${slug}/reviews`, icon: Star },
        { title: 'Suggestions', href: `/organizations/${slug}/suggestions`, icon: Lightbulb },
        { title: 'Statistiques', href: `/organizations/${slug}/analytics`, icon: BarChart3 },
        { title: 'Messages', href: `/organizations/${slug}/inquiries`, icon: MessageSquare },
        { title: 'Vérification', href: `/organizations/${slug}/verification`, icon: ShieldCheck },
    ];

    return (
        <div className="flex flex-col space-y-6">
            {/* Org Header */}
            <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-muted overflow-hidden">
                        {org.logoUrl ? (
                            <img src={getAssetUrl(org.logoUrl) || ''} alt={org.longName} className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                                {org.longName.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">{org.longName}</h2>
                        <a href={`/business/${slug}`} target="_blank" className="text-sm text-primary hover:underline">
                            Voir la page publique
                        </a>
                    </div>
                </div>
            </div>

            {/* Sub Navigation (Horizontal Tabs for simplicity, or we could do nested sidebar) */}
            <div className="border-b overflow-x-auto">
                <nav className="flex space-x-2 pb-2">
                    {navItems.map((item) => {
                        const isActive = item.exact
                            ? pathname === item.href
                            : pathname.startsWith(item.href);

                        const isHighlight = (item as any).highlight;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center whitespace-nowrap px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : isHighlight
                                            ? "bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-600 hover:from-orange-500/30 hover:to-amber-500/30 border border-orange-500/30"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon className={cn("mr-2 h-4 w-4", isHighlight && !isActive && "text-orange-500")} />
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {children}
            </div>
        </div>
    );
}
