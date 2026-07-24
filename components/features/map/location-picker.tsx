'use client';

import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Ensure CSS is imported
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';

// Fix for default marker icon in Leaflet is moved to component to avoid SSR/Module init issues


// Since we can't easily rely on valid local image paths for leaflet assets without copying them,
// we might use CDNs or assume they exist. For robustness, let's use a CDN or valid path.
// Or we can simple use a custom DivIcon or standard fix if assets are in public.
// I'll skip the icon fix details for now or use a basic one.

interface Location {
    lat: number;
    lng: number;
}

interface LocationPickerProps {
    initialLocation?: Location;
    onLocationSelect: (location: Location) => void;
    className?: string;
}

function LocationMarker({ location, setLocation, onSelect }: { location: Location | null, setLocation: any, onSelect: any }) {
    const map = useMap();

    useMapEvents({
        click(e) {
            const newLoc = { lat: e.latlng.lat, lng: e.latlng.lng };
            setLocation(newLoc);
            onSelect(newLoc);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    useEffect(() => {
        if (location) {
            map.flyTo([location.lat, location.lng], map.getZoom());
        }
    }, [location, map]);

    return location === null ? null : (
        <Marker position={[location.lat, location.lng]} />
    );
}

export default function LocationPicker({ initialLocation, onLocationSelect, className }: LocationPickerProps) {
    const [location, setLocation] = useState<Location | null>(initialLocation || null);
    const [isMounted, setIsMounted] = useState(false);

    // Default center (e.g., Cameroon or generic)
    const defaultCenter = { lat: 3.8480, lng: 11.5021 }; // Yaounde

    useEffect(() => {
        setIsMounted(true);

        // Fix Leaflet icon on client side only
        // @ts-ignore
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: '/images/leaflet/marker-icon-2x.png',
            iconUrl: '/images/leaflet/marker-icon.png',
            shadowUrl: '/images/leaflet/marker-shadow.png',
        });
    }, []);

    const handleGeolocation = () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newLoc = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setLocation(newLoc);
                onLocationSelect(newLoc);
            },
            (error) => {
                console.error("Error getting location", error);
            }
        );
    };

    if (!isMounted) {
        return <div className="h-[300px] w-full bg-muted animate-pulse rounded-md flex items-center justify-center">Chargement de la carte...</div>;
    }

    return (
        <div className={`relative h-[400px] w-full rounded-md overflow-hidden ${className}`}>
            <MapContainer
                center={[location?.lat || defaultCenter.lat, location?.lng || defaultCenter.lng]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker location={location} setLocation={setLocation} onSelect={onLocationSelect} />
            </MapContainer>

            <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4 z-[1000] shadow-md"
                onClick={handleGeolocation}
            >
                <Navigation className="h-4 w-4 mr-2" />
                Ma position
            </Button>
        </div>
    );
}
