'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { searchAgencies } from '@/lib/api/public';
import { MapView } from '@/components/features/map/map-view';
import { MapSidebar } from '@/components/features/map/map-sidebar';
import { SearchBar } from '@/components/features/search/search-bar';
import { Button, buttonVariants } from '@/components/ui/button';
import { ArrowLeft, Crosshair, List, Map } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

export default function MapPage() {
    const searchParams = useSearchParams();
    // Default search for map
    const [queryParams, setQueryParams] = useState({
        q: searchParams.get('q') || '',
        city: searchParams.get('city') || '',
        categoryId: searchParams.get('category') || '',
    });

    const handleLocateMe = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                alert(`Position trouvée: ${position.coords.latitude}, ${position.coords.longitude}`);
                // In a real app we would update the map center here
            });
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: ['search-map', queryParams],
        queryFn: () => searchAgencies({
            ...queryParams,
            size: 50 // Load more points for map
        }),
    });

    const agencies = data?.content || [];

    return (
        <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden flex">
            {/* Sidebar */}
            <MapSidebar className="shrink-0 border-r" />

            {/* Map Area */}
            <div className="flex-1 relative h-full">
                {/* Top Bar with Search */}
                <div className="absolute top-4 left-4 right-4 z-[400] flex items-center justify-center pointer-events-none">
                    <div className="flex items-center gap-2 max-w-2xl w-full pointer-events-auto">
                        <div className="flex bg-background/95 backdrop-blur p-1 rounded-lg border shadow-md shrink-0">
                            <Link href={`/search?${searchParams.toString()}`}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-9 px-3 rounded-md text-muted-foreground hover:text-foreground transition-all flex items-center"
                                >
                                    <List className="h-4 w-4 mr-2" />
                                    <span className="text-xs font-medium">Liste</span>
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 px-3 rounded-md bg-background shadow-sm text-foreground transition-all flex items-center"
                            >
                                <Map className="h-4 w-4 mr-2" />
                                <span className="text-xs font-medium">Carte</span>
                            </Button>
                        </div>
                        <SearchBar
                            className="shadow-md rounded-full bg-background/95 backdrop-blur border-0"
                            placeholder="Rechercher sur la carte..."
                            onSearch={(term) => setQueryParams({ ...queryParams, q: term })}
                            value={queryParams.q}
                        />
                        <Button
                            variant="secondary"
                            size="icon"
                            className="shrink-0 rounded-full shadow-md"
                            onClick={handleLocateMe}
                            type="button"
                        >
                            <Crosshair className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Map */}
                <div className="w-full h-full">
                    <MapView
                        agencies={agencies}
                        center={[4.0511, 9.7679]}
                        zoom={13}
                        className="w-full h-full rounded-none"
                    />
                </div>

                {/* Bottom Info / Status */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[400] pointer-events-none">
                    <div className="bg-background/90 backdrop-blur px-4 py-2 rounded-full text-sm font-medium shadow-md border pointer-events-auto">
                        {agencies.length} agence{agencies.length !== 1 ? 's' : ''} trouvée{agencies.length !== 1 ? 's' : ''}
                    </div>
                </div>
            </div>
        </div>
    );
}
