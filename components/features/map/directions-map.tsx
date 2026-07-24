'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Car, PersonStanding, Loader2, MapPin, Clock, Route } from 'lucide-react';
import { useGeolocation } from '@/lib/hooks/use-geolocation';

interface DirectionsMapProps {
    destination: {
        lat: number;
        lng: number;
        name: string;
        address?: string;
    };
    className?: string;
}

type TravelMode = 'driving-car' | 'foot-walking' | 'cycling-regular';

interface RouteInfo {
    distance: number; // meters
    duration: number; // seconds
    geometry: [number, number][];
}

// OpenRouteService API (free tier: 2000 requests/day)
const ORS_API_KEY = process.env.NEXT_PUBLIC_ORS_API_KEY || '';

async function fetchRoute(
    start: [number, number],
    end: [number, number],
    mode: TravelMode
): Promise<RouteInfo | null> {
    try {
        // If no API key, use direct line (fallback)
        if (!ORS_API_KEY) {
            console.warn('No OpenRouteService API key, using direct line');
            return {
                distance: calculateDistance(start[0], start[1], end[0], end[1]) * 1000,
                duration: calculateDistance(start[0], start[1], end[0], end[1]) * 60 * 1000 / 50, // ~50km/h avg
                geometry: [start, end],
            };
        }

        const response = await fetch(
            `https://api.openrouteservice.org/v2/directions/${mode}?api_key=${ORS_API_KEY}&start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`,
            { headers: { Accept: 'application/json, application/geo+json' } }
        );

        if (!response.ok) {
            console.error('ORS API error:', response.status);
            return null;
        }

        const data = await response.json();
        const route = data.features?.[0];

        if (!route) return null;

        return {
            distance: route.properties.segments[0].distance,
            duration: route.properties.segments[0].duration,
            geometry: route.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]),
        };
    } catch (error) {
        console.error('Route fetch error:', error);
        return null;
    }
}

// Haversine distance calculation (km)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function formatDistance(meters: number): string {
    if (meters < 1000) {
        return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
}

function formatDuration(seconds: number): string {
    if (seconds < 60) {
        return `${Math.round(seconds)} sec`;
    }
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
        return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
}

export function DirectionsMap({ destination, className }: DirectionsMapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const routeLayerRef = useRef<L.Polyline | null>(null);
    const userMarkerRef = useRef<L.Marker | null>(null);

    const [travelMode, setTravelMode] = useState<TravelMode>('driving-car');
    const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [showRoute, setShowRoute] = useState(false);

    const geo = useGeolocation();

    // Initialize map
    useEffect(() => {
        if (!mapContainerRef.current) return;
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }

        const map = L.map(mapContainerRef.current, {
            center: [destination.lat, destination.lng],
            zoom: 15,
            scrollWheelZoom: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        // Destination marker
        const destIcon = L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
        });

        L.marker([destination.lat, destination.lng], { icon: destIcon })
            .addTo(map)
            .bindPopup(
                `<div class="font-medium">${destination.name}</div>
                 ${destination.address ? `<div class="text-sm text-gray-600">${destination.address}</div>` : ''}`
            );

        mapInstanceRef.current = map;

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [destination]);

    // Calculate and display route
    const calculateRoute = useCallback(async () => {
        if (!geo.coordinates.latitude || !geo.coordinates.longitude) {
            geo.requestLocation();
            return;
        }

        if (!mapInstanceRef.current) return;

        setIsCalculating(true);
        setShowRoute(true);

        const start: [number, number] = [geo.coordinates.latitude, geo.coordinates.longitude];
        const end: [number, number] = [destination.lat, destination.lng];

        // Add/update user marker
        if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng(start);
        } else {
            const userIcon = L.divIcon({
                className: 'user-location-marker',
                html: `<div style="
                    width: 16px; height: 16px; 
                    background: #3b82f6; 
                    border: 3px solid white;
                    border-radius: 50%;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                "></div>`,
                iconSize: [16, 16],
                iconAnchor: [8, 8],
            });
            userMarkerRef.current = L.marker(start, { icon: userIcon })
                .addTo(mapInstanceRef.current)
                .bindPopup('Votre position');
        }

        // Fetch route
        const route = await fetchRoute(start, end, travelMode);

        if (route) {
            setRouteInfo(route);

            // Remove old route
            if (routeLayerRef.current) {
                routeLayerRef.current.remove();
            }

            // Draw new route
            routeLayerRef.current = L.polyline(route.geometry, {
                color: '#3b82f6',
                weight: 5,
                opacity: 0.8,
            }).addTo(mapInstanceRef.current);

            // Fit bounds to show entire route
            const bounds = L.latLngBounds([start, end]);
            mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
        }

        setIsCalculating(false);
    }, [geo, destination, travelMode]);

    // Recalculate when travel mode changes
    useEffect(() => {
        if (showRoute && geo.coordinates.latitude) {
            calculateRoute();
        }
    }, [travelMode]);

    const travelModes: { mode: TravelMode; icon: React.ReactNode; label: string }[] = [
        { mode: 'driving-car', icon: <Car className="h-4 w-4" />, label: 'Voiture' },
        { mode: 'foot-walking', icon: <PersonStanding className="h-4 w-4" />, label: 'À pied' },
    ];

    return (
        <div className={`relative rounded-xl overflow-hidden border ${className || ''}`}>
            {/* Map */}
            <div ref={mapContainerRef} className="w-full h-64 md:h-80" />

            {/* Controls Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
                {/* Route Info */}
                {showRoute && routeInfo && (
                    <div className="bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 text-sm">
                                    <Route className="h-4 w-4 text-primary" />
                                    <span className="font-medium">{formatDistance(routeInfo.distance)}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span>{formatDuration(routeInfo.duration)}</span>
                                </div>
                            </div>
                            {/* Travel Mode Selector */}
                            <div className="flex gap-1">
                                {travelModes.map(({ mode, icon, label }) => (
                                    <button
                                        key={mode}
                                        onClick={() => setTravelMode(mode)}
                                        title={label}
                                        className={`p-2 rounded-lg transition-colors ${travelMode === mode
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted hover:bg-muted/80'
                                            }`}
                                    >
                                        {icon}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Calculate Button */}
                {!showRoute && (
                    <button
                        onClick={calculateRoute}
                        disabled={isCalculating || geo.loading}
                        className="flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-lg"
                    >
                        {isCalculating || geo.loading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Calcul en cours...
                            </>
                        ) : (
                            <>
                                <Navigation className="h-5 w-5" />
                                Calculer l'itinéraire
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* External Maps Links */}
            {showRoute && routeInfo && (
                <div className="absolute top-4 right-4 flex gap-2">
                    <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-medium shadow border hover:bg-muted transition-colors"
                    >
                        Google Maps
                    </a>
                    <a
                        href={`https://www.openstreetmap.org/directions?from=&to=${destination.lat},${destination.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-medium shadow border hover:bg-muted transition-colors"
                    >
                        OSM
                    </a>
                </div>
            )}
        </div>
    );
}
