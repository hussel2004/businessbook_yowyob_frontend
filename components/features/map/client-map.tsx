'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import { Star } from 'lucide-react';

import type { AgencySummary } from '@/lib/api/public';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { useGeolocation } from '@/lib/hooks/use-geolocation';

// Fix for default Leaflet marker icons in Next.js
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface ClientMapProps {
    agencies: AgencySummary[];
    center?: [number, number];
    zoom?: number;
    className?: string;
}

// Component to update map center when props change
function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}


export default function ClientMap({
    agencies = [],
    center = [4.0511, 9.7679], // Douala default
    zoom = 13,
    className
}: ClientMapProps) {
    // State for routing
    const [routePath, setRoutePath] = useState<[number, number][]>([]);
    const [isRouting, setIsRouting] = useState(false);
    const [targetAgencyId, setTargetAgencyId] = useState<string | null>(null);

    // Geolocation for user position
    const { coordinates, requestLocation, loading: locationLoading } = useGeolocation();

    const handleGetDirections = async (destLat: number, destLng: number, agencyId: string) => {
        setTargetAgencyId(agencyId);
        setIsRouting(true);

        // 1. Get User Location if missing
        if (!coordinates.latitude || !coordinates.longitude) {
            requestLocation();
            // We'll rely on useEffect to trigger route fetch once coords are available
            return;
        }

        fetchRoute(coordinates.latitude, coordinates.longitude, destLat, destLng);
    };

    // Trigger route fetch when coordinates become available if we were trying to route
    useEffect(() => {
        if (isRouting && targetAgencyId && coordinates.latitude && coordinates.longitude) {
            const agency = agencies.find(a => a.id === targetAgencyId);
            if (agency) {
                const lat = agency.latitude || agency.address?.latitude || center[0] + (Math.random() - 0.5) * 0.1;
                const lng = agency.longitude || agency.address?.longitude || center[1] + (Math.random() - 0.5) * 0.1;
                fetchRoute(coordinates.latitude, coordinates.longitude, lat, lng);
            }
        }
    }, [coordinates, isRouting, targetAgencyId, agencies, center]);


    const fetchRoute = async (userLat: number, userLon: number, destLat: number, destLon: number) => {
        try {
            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${userLon},${userLat};${destLon},${destLat}?overview=full&geometries=geojson`
            );
            const data = await response.json();

            if (data.routes && data.routes.length > 0) {
                // OSRM returns [lon, lat], Leaflet needs [lat, lon]
                const coordinates = data.routes[0].geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]] as [number, number]);
                setRoutePath(coordinates);
            } else {
                console.error("No route found");
            }
        } catch (error) {
            console.error("Error fetching route:", error);
        } finally {
            setIsRouting(false);
        }
    };

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom={true}
            dragging={true}
            className={`w-full h-full rounded-xl ${className}`}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapController center={center} zoom={zoom} />

            {/* User Location Marker */}
            {coordinates.latitude && coordinates.longitude && (
                <Marker position={[coordinates.latitude, coordinates.longitude]} icon={DefaultIcon}>
                    <Popup>
                        <div className="text-sm font-semibold">Votre position</div>
                    </Popup>
                </Marker>
            )}

            {/* The Route Line */}
            {routePath.length > 0 && <Polyline positions={routePath} color="blue" weight={4} opacity={0.7} />}

            {agencies.map((agency) => {
                // Get coordinates from agency or address
                const lat = agency.latitude || agency.address?.latitude || center[0] + (Math.random() - 0.5) * 0.1;
                const lng = agency.longitude || agency.address?.longitude || center[1] + (Math.random() - 0.5) * 0.1;

                return (
                    <Marker key={agency.id} position={[lat, lng]}>
                        <Popup>
                            <div className="p-1 min-w-[200px]">
                                <h3 className="font-semibold text-sm mb-1">{agency.name}</h3>
                                {agency.isHeadquarters && <span className="text-[10px] bg-primary/10 text-primary px-1 rounded ml-1">Siège</span>}
                                <p className="text-xs text-muted-foreground mb-1">{agency.organizationName}</p>
                                <p className="text-xs text-muted-foreground mb-2">{agency.categoryName}</p>
                                <div className="flex items-center gap-1 mb-2">
                                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                    <span className="text-xs font-medium">{(agency.averageRating ?? 0).toFixed(1)}</span>
                                    <span className="text-xs text-muted-foreground">({agency.reviewCount})</span>
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/business/${agency.organizationSlug}`}
                                        className={cn(
                                            buttonVariants({ size: 'sm', variant: 'outline' }),
                                            "flex-1 h-8 text-xs"
                                        )}
                                    >
                                        Profil
                                    </Link>
                                    <Button
                                        size="sm"
                                        className="flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                                        onClick={() => handleGetDirections(lat, lng, agency.id)}
                                        disabled={isRouting && targetAgencyId === agency.id}
                                    >
                                        {(isRouting && targetAgencyId === agency.id) || locationLoading ? '...' : 'Itinéraire'}
                                    </Button>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}
