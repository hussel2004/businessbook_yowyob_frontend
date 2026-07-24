'use client';

import { useState } from 'react';
import { AdSkyscraper } from './ad-components';

export function AdSkyscraperWrapper() {
    const [showLeftAd, setShowLeftAd] = useState(true);
    const [showRightAd, setShowRightAd] = useState(true);

    return (
        <>
            {showLeftAd && (
                <div className="relative">
                    <AdSkyscraper variant="left" />
                    <button
                        onClick={() => setShowLeftAd(false)}
                        className="fixed left-4 top-[calc(50%-250px+12px)] z-50 hidden 2xl:flex w-6 h-6 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                        aria-label="Fermer la publicité"
                    >
                        ×
                    </button>
                </div>
            )}
            {showRightAd && (
                <div className="relative">
                    <AdSkyscraper variant="right" />
                    <button
                        onClick={() => setShowRightAd(false)}
                        className="fixed right-4 top-[calc(50%-250px+12px)] z-50 hidden 2xl:flex w-6 h-6 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                        aria-label="Fermer la publicité"
                    >
                        ×
                    </button>
                </div>
            )}
        </>
    );
}
