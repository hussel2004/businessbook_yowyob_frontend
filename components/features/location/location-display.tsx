'use client';

import { useEffect, useState } from 'react';
import { MapPin, ChevronDown, X, Loader2 } from 'lucide-react';
import { useGeolocation } from '@/lib/hooks/use-geolocation';
import { useLocationStore, getLocationDisplay } from '@/lib/stores/location-store';

// Common Cameroonian cities for quick selection
const CAMEROON_CITIES = [
    'Douala',
    'Yaoundé',
    'Garoua',
    'Bamenda',
    'Maroua',
    'Bafoussam',
    'Ngaoundéré',
    'Bertoua',
    'Limbé',
    'Kribi',
    'Buea',
    'Edéa',
];

export function LocationDisplay() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const geolocation = useGeolocation();
    const locationStore = useLocationStore();
    const displayLocation = getLocationDisplay(locationStore);

    // Sync geolocation to store when it changes
    useEffect(() => {
        if (
            geolocation.coordinates.latitude &&
            geolocation.coordinates.longitude &&
            geolocation.permissionStatus === 'granted'
        ) {
            locationStore.setLocation(
                {
                    latitude: geolocation.coordinates.latitude,
                    longitude: geolocation.coordinates.longitude,
                },
                geolocation.address
            );
        }
    }, [geolocation.coordinates, geolocation.address, geolocation.permissionStatus]);

    const handleRequestLocation = () => {
        geolocation.requestLocation();
    };

    const handleSelectCity = (city: string) => {
        locationStore.setManualCity(city);
        setIsOpen(false);
        setSearchQuery('');
    };

    const handleClearLocation = () => {
        locationStore.clearLocation();
        setIsOpen(false);
    };

    const filteredCities = CAMEROON_CITIES.filter((city) =>
        city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="relative">
            {/* Location Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full bg-muted/50 hover:bg-muted transition-colors"
            >
                <MapPin className="h-4 w-4 text-primary" />
                {geolocation.loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : displayLocation ? (
                    <span className="max-w-[150px] truncate">{displayLocation}</span>
                ) : (
                    <span className="text-muted-foreground">Localisation</span>
                )}
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown Menu */}
                    <div className="absolute top-full right-0 mt-2 w-72 bg-card border rounded-xl shadow-lg z-50 overflow-hidden">
                        {/* Header */}
                        <div className="p-3 border-b">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Votre localisation</span>
                                {locationStore.isLocationSet && (
                                    <button
                                        onClick={handleClearLocation}
                                        className="text-xs text-muted-foreground hover:text-foreground"
                                    >
                                        Effacer
                                    </button>
                                )}
                            </div>

                            {/* Geolocation button */}
                            {geolocation.permissionStatus !== 'granted' && (
                                <button
                                    onClick={handleRequestLocation}
                                    disabled={geolocation.loading}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50"
                                >
                                    {geolocation.loading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <MapPin className="h-4 w-4" />
                                    )}
                                    Utiliser ma position
                                </button>
                            )}

                            {geolocation.error && (
                                <p className="text-xs text-muted-foreground mt-2">
                                    {geolocation.error}
                                </p>
                            )}
                        </div>

                        {/* City Search */}
                        <div className="p-3 border-b">
                            <input
                                type="text"
                                placeholder="Rechercher une ville..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        {/* City List */}
                        <div className="max-h-48 overflow-y-auto">
                            {filteredCities.length > 0 ? (
                                filteredCities.map((city) => (
                                    <button
                                        key={city}
                                        onClick={() => handleSelectCity(city)}
                                        className="w-full px-4 py-2.5 text-sm text-left hover:bg-muted transition-colors flex items-center gap-2"
                                    >
                                        <MapPin className="h-3 w-3 text-muted-foreground" />
                                        {city}
                                        {locationStore.manualCity === city && (
                                            <span className="ml-auto text-primary text-xs">✓</span>
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                                    Aucune ville trouvée
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
