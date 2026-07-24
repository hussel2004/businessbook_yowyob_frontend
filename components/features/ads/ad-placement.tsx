'use client';

import { AdBanner, AdFormat } from './ad-banner';

interface AdPlacementProps {
    slotId: string;
    format: AdFormat;
    className?: string;
    label?: string;
}

export function AdPlacement({ slotId, format, className, label }: AdPlacementProps) {
    // In the future, this component could handle:
    // - Checking if ads are enabled for user
    // - Fetching specific ad for this slot
    // - Layout shift protection

    return (
        <div className={className}>
            {label && (
                <div className="text-xs text-muted-foreground mb-2 uppercase tracking-widest font-semibold opacity-70">
                    {label}
                </div>
            )}
            <AdBanner format={format} slotId={slotId} />
        </div>
    );
}
