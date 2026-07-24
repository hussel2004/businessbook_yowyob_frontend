'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import type { AgencySummary } from '@/lib/api/public';

// Loading component
function MapSkeleton() {
    return (
        <div className="w-full h-full rounded-xl bg-muted/50 flex items-center justify-center border">
            <div className="text-muted-foreground flex flex-col items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <p className="text-sm">Chargement de la carte...</p>
            </div>
        </div>
    );
}

// Dynamic import with no SSR
const ClientMap = dynamic(
    () => import('@/components/features/map/client-map'),
    {
        ssr: false,
        loading: () => <MapSkeleton />
    }
);

interface MapViewProps {
    agencies: AgencySummary[];
    center?: [number, number];
    zoom?: number;
    className?: string;
}

export function MapView(props: MapViewProps) {
    return <ClientMap {...props} />;
}
