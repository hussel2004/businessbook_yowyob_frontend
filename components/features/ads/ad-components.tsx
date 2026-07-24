'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X, ExternalLink } from 'lucide-react';

// Mockup ad data - using local images for faster loading
const mockAds = {
    banner: [
        {
            id: 'ad-1',
            title: 'MTN Mobile Money',
            description: 'Envoyez et recevez de l\'argent en toute sécurité',
            imageUrl: '/images/ads/mtn-mobile-money.jpg',
            link: '#',
            sponsor: 'MTN Cameroun',
            bgColor: 'from-yellow-400 to-yellow-600',
        },
        {
            id: 'ad-2',
            title: 'Orange Money',
            description: 'Vos transactions financières simplifiées',
            imageUrl: '/images/ads/orange-money.jpg',
            link: '#',
            sponsor: 'Orange Cameroun',
            bgColor: 'from-orange-400 to-orange-600',
        },
        {
            id: 'ad-3',
            title: 'Brasseries du Cameroun',
            description: 'La qualité, notre passion depuis 1948',
            imageUrl: '/images/ads/brasseries-cameroun.jpg',
            link: '#',
            sponsor: 'SABC',
            bgColor: 'from-red-500 to-red-700',
        },
    ],
    sidebar: [
        {
            id: 'side-1',
            title: 'Assurance Activa',
            description: 'Protégez ce qui compte',
            imageUrl: '/images/ads/activa-assurance.jpg',
            link: '#',
            sponsor: 'Activa Assurances',
        },
        {
            id: 'side-2',
            title: 'Express Union',
            description: 'Transfert d\'argent rapide',
            imageUrl: '/images/ads/express-union.jpg',
            link: '#',
            sponsor: 'Express Union',
        },
    ],
    square: [
        {
            id: 'sq-1',
            title: 'Camtel Fibre',
            description: 'Internet très haut débit',
            imageUrl: '/images/ads/camtel-fibre.jpg',
            link: '#',
            sponsor: 'CAMTEL',
        },
        {
            id: 'sq-2',
            title: 'Afriland First Bank',
            description: 'Votre banque partenaire',
            imageUrl: '/images/ads/afriland-bank.jpg',
            link: '#',
            sponsor: 'Afriland Bank',
        },
    ],
};

// Get random ad from category
function getRandomAd(category: 'banner' | 'sidebar' | 'square') {
    const ads = mockAds[category];
    return ads[Math.floor(Math.random() * ads.length)];
}

interface AdBannerProps {
    className?: string;
}

export function AdBanner({ className = '' }: AdBannerProps) {
    const ad = mockAds.banner[0]!;

    return (
        <div className={`relative overflow-hidden rounded-2xl ${className}`}>
            <Link href={ad.link} className="block relative h-48 md:h-64 group">
                {/* Background Image */}
                <Image
                    src={ad.imageUrl}
                    alt={ad.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${ad.bgColor} opacity-85`} />

                {/* Sponsored Badge */}
                <div className="absolute top-4 right-4 z-10">
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/30">
                        ✨ Sponsorisé
                    </span>
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex items-center p-6 md:p-10">
                    <div className="max-w-xl">
                        <p className="text-sm uppercase tracking-widest text-white/80 mb-2 font-medium">
                            {ad.sponsor}
                        </p>
                        <h3 className="text-2xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg">
                            {ad.title}
                        </h3>
                        <p className="text-white/90 text-base md:text-lg mb-4 drop-shadow">
                            {ad.description}
                        </p>
                        <span className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg">
                            En savoir plus <ExternalLink className="h-4 w-4" />
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
}

interface AdSidebarProps {
    className?: string;
}

export function AdSidebar({ className = '' }: AdSidebarProps) {
    const ad = mockAds.sidebar[0]!;

    return (
        <div className={`relative overflow-hidden rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-background to-primary/5 ${className}`}>
            <div className="absolute top-2 right-2 z-10">
                <span className="text-[10px] uppercase tracking-wider font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                    Pub
                </span>
            </div>

            <Link href={ad.link} className="block p-5">
                {/* Logo placeholder */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-4 shadow-lg">
                    <span className="text-2xl font-bold text-white">A</span>
                </div>

                <p className="text-xs text-muted-foreground font-medium mb-1">{ad.sponsor}</p>
                <h4 className="font-bold text-lg mb-2 text-foreground">{ad.title}</h4>
                <p className="text-sm text-muted-foreground mb-4">{ad.description}</p>

                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                    En savoir plus <ExternalLink className="h-3 w-3" />
                </span>
            </Link>
        </div>
    );
}

interface AdSquareProps {
    index?: number;
    className?: string;
}

export function AdSquare({ index = 0, className = '' }: AdSquareProps) {
    const ad = mockAds.square[index % mockAds.square.length]!;

    return (
        <div className={`relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow ${className}`}>
            {/* Animated Sponsored Badge */}
            <div className="absolute top-3 right-3 z-10">
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full shadow-md animate-pulse">
                    ⭐ Pub
                </span>
            </div>

            <Link href={ad.link} className="block group">
                <div className="relative aspect-square overflow-hidden">
                    <Image
                        src={ad.imageUrl}
                        alt={ad.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Stronger gradient for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                    {/* Content with better typography */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <p className="text-xs text-amber-300 font-medium mb-1">{ad.sponsor}</p>
                        <h4 className="font-bold text-lg leading-tight mb-1 drop-shadow-lg">{ad.title}</h4>
                        <p className="text-sm text-white/90 mb-3">{ad.description}</p>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30 group-hover:bg-white/30 transition-colors">
                            Découvrir <ExternalLink className="h-3 w-3" />
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
}

interface AdInlineProps {
    className?: string;
}

export function AdInline({ className = '' }: AdInlineProps) {
    const ad = mockAds.banner[1]!;

    return (
        <div className={`relative overflow-hidden rounded-lg border bg-muted/30 ${className}`}>
            <Link href={ad.link} className="flex items-center gap-4 p-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                        src={ad.imageUrl}
                        alt={ad.title}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            Pub
                        </span>
                        <span className="text-xs text-muted-foreground">{ad.sponsor}</span>
                    </div>
                    <h4 className="font-medium text-sm truncate">{ad.title}</h4>
                    <p className="text-xs text-muted-foreground truncate">{ad.description}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </Link>
        </div>
    );
}

// AdPopup removed - moved to ad-popup.tsx

// ===== SKYSCRAPER AD - Tall vertical banner for sidebars =====
interface AdSkyscraperProps {
    className?: string;
    variant?: 'left' | 'right';
}

export function AdSkyscraper({ className = '', variant = 'right' }: AdSkyscraperProps) {
    const ad = mockAds.sidebar[variant === 'left' ? 0 : 1]!;

    return (
        <div className={`fixed top-1/2 -translate-y-1/2 z-40 hidden 2xl:block ${variant === 'left' ? 'left-4' : 'right-4'} ${className}`}>
            <div className="relative w-40 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10">
                {/* Sponsored badge */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[9px] uppercase tracking-wider font-bold px-2 py-1 rounded-full shadow-md">
                        ⭐ Pub
                    </span>
                </div>

                <Link href={ad.link} className="block group">
                    {/* Tall vertical image */}
                    <div className="relative h-[500px]">
                        <Image
                            src={ad.imageUrl}
                            alt={ad.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                        {/* Content at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-center">
                            <p className="text-[10px] text-amber-300 font-medium mb-1">{ad.sponsor}</p>
                            <h4 className="font-bold text-sm leading-tight mb-2">{ad.title}</h4>
                            <p className="text-xs text-white/80 mb-3 line-clamp-2">{ad.description}</p>
                            <span className="inline-flex items-center justify-center gap-1 text-[10px] font-semibold bg-white/20 backdrop-blur-sm w-full py-2 rounded-lg border border-white/30 group-hover:bg-white/30 transition-colors">
                                Découvrir <ExternalLink className="h-3 w-3" />
                            </span>
                        </div>
                    </div>
                </Link>

                {/* Close button */}
                <button className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
                    <X className="h-3 w-3" />
                </button>
            </div>
        </div>
    );
}

// ===== AD SECTION - Dedicated ad section for landing page =====
interface AdSectionProps {
    className?: string;
}

export function AdSection({ className = '' }: AdSectionProps) {
    return (
        <section className={`py-12 ${className}`}>
            <div className="container-wrapper">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-medium mb-3">
                        <span className="text-lg">📢</span>
                        Publicité
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                        Nos partenaires
                    </h2>
                    <p className="text-muted-foreground">
                        Découvrez les marques qui font confiance à BusinessBook
                    </p>
                </div>

                {/* Ads grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockAds.banner.map((ad) => (
                        <Link
                            key={ad.id}
                            href={ad.link}
                            className="group relative h-48 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <Image
                                src={ad.imageUrl}
                                alt={ad.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-r ${ad.bgColor} opacity-80`} />

                            {/* Badge */}
                            <div className="absolute top-3 right-3">
                                <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full">
                                    Sponsorisé
                                </span>
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                                <p className="text-xs uppercase tracking-wider text-white/80 mb-1">{ad.sponsor}</p>
                                <h3 className="text-xl font-bold mb-1 drop-shadow">{ad.title}</h3>
                                <p className="text-sm text-white/90">{ad.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Need React import for hooks
import React from 'react';

// Export all components and mock data
export { mockAds };
