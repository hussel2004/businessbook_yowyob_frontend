'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { X, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { mockAds } from './ad-components';
import { getAssetUrl } from '@/lib/api/endpoints';

interface Advertisement {
    id: string;
    organizationId: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    targetUrl: string;
    adType: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface AdPopupProps {
    onClose?: () => void;
    autoCloseDelay?: number;
}

export function AdPopup({ onClose }: AdPopupProps) {
    const pathname = usePathname();
    const [ad, setAd] = useState<Advertisement | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [countdown, setCountdown] = useState(15);
    const [canClose, setCanClose] = useState(false);
    // Removed deduplication state to show every time

    // Show ad on route change for specific public paths
    useEffect(() => {
        // Target specific public paths: Home, Search, Categories
        const isPublicTarget =
            pathname === '/' ||
            pathname.startsWith('/search') ||
            pathname.startsWith('/categories') ||
            pathname.startsWith('/explore');

        if (!isPublicTarget) {
            setIsVisible(false);
            return;
        }

        // Reset state for new navigation
        setIsVisible(false);
        setCanClose(false);
        setCountdown(15); // Force 15 seconds

        console.log('AdPopup checking pathname:', pathname);

        // Select a random mock ad to ensure it always shows (fictitious mode)
        // detailed in ad-components.tsx
        const banners = mockAds.banner;
        if (!banners || banners.length === 0) return;

        const randomAd = banners[Math.floor(Math.random() * banners.length)];

        if (!randomAd) return;

        // Transform to Advertisement interface if needed, or just use as is if compatible
        // The interfaces are slightly different, adapting here:
        const adData: Advertisement = {
            id: randomAd.id,
            organizationId: 'mock',
            title: randomAd.title,
            description: randomAd.description,
            imageUrl: randomAd.imageUrl,
            targetUrl: randomAd.link,
            adType: 'popup'
        };

        setAd(adData);

        // Small delay to allow page transition to start
        const showTimer = setTimeout(() => {
            console.log('AdPopup settig isVisible to true');
            setIsVisible(true);
        }, 1000);

        return () => clearTimeout(showTimer);
    }, [pathname]);

    // Countdown timer
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isVisible && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => {
                    const newValue = prev - 1;

                    // Allow skipping after 3 seconds (when countdown <= 12)
                    if (newValue <= 12) {
                        setCanClose(true);
                    }

                    // Auto-close when countdown reaches 0
                    if (newValue <= 0) {
                        setIsVisible(false);
                        setAd(null);
                        return 0;
                    }
                    return newValue;
                });
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isVisible, countdown]);

    const handleClose = () => {
        if (!canClose) return;
        setIsVisible(false);
        setAd(null);
        if (onClose) onClose();
    };

    const handleAdClick = () => {
        if (ad) {
            window.open(ad.targetUrl, '_blank');
        }
    };

    if (!isVisible || !ad) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg mx-4 bg-card rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/10">
                {/* Close button container */}
                <div className="absolute top-4 right-4 z-20">
                    <button
                        onClick={handleClose}
                        disabled={!canClose}
                        className={cn(
                            "flex items-center justify-center rounded-full transition-all duration-300 shadow-lg backdrop-blur-md",
                            canClose
                                ? "bg-white text-black px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                : "bg-black/60 text-white h-12 px-4 cursor-not-allowed border border-white/20"
                        )}
                    >
                        {canClose ? (
                            <div className="flex items-center gap-2 font-medium text-sm">
                                <span>Passer l'annonce</span>
                                <span className="flex items-center justify-center bg-black/10 rounded-full w-5 h-5">
                                    <X className="h-3 w-3" />
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-lg">{countdown - 12 > 0 ? countdown - 12 : 0}s</span>
                                <span className="text-xs uppercase tracking-wider opacity-80">avant de passer</span>
                            </div>
                        )}
                    </button>
                </div>

                {/* Sponsor badge */}
                <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-lg">
                        Publicité - Sponsorisé
                    </span>
                </div>

                {/* Ad Content */}
                <div className="relative group cursor-pointer" onClick={handleAdClick}>
                    {/* Image Container with 15s progress bar at bottom */}
                    <div className="relative w-full h-[400px]">
                        {ad.imageUrl && (
                            <img
                                src={ad.imageUrl}
                                alt={ad.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

                        {/* Text Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                            <h3 className="text-3xl font-extrabold mb-3 leading-tight drop-shadow-xl transform transition-transform group-hover:-translate-y-1">
                                {ad.title}
                            </h3>
                            {ad.description && (
                                <p className="text-lg text-white/90 mb-6 line-clamp-3 font-medium drop-shadow-md">
                                    {ad.description}
                                </p>
                            )}

                            <div className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-xl">
                                Découvrir l'offre
                                <ExternalLink className="h-5 w-5" />
                            </div>
                        </div>

                        {/* Progress Bar */}
                        {!canClose && (
                            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
                                <div
                                    className="h-full bg-primary shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-1000 ease-linear"
                                    style={{ width: `${(countdown / 15) * 100}%` }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
