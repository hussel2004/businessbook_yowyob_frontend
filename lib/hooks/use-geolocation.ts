import { useState, useEffect, useCallback } from 'react';

interface Address {
    quartier: string | null;
    ville: string | null;
    pays: string | null;
    displayName: string | null;
}

interface GeolocationState {
    coordinates: {
        latitude: number | null;
        longitude: number | null;
    };
    address: Address | null;
    loading: boolean;
    error: string | null;
    isSupported: boolean;
    permissionStatus: 'prompt' | 'granted' | 'denied' | 'unknown';
}

/**
 * Reverse geocode coordinates using Nominatim (OpenStreetMap)
 */
async function reverseGeocode(lat: number, lon: number): Promise<Address | null> {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&accept-language=fr`,
            {
                headers: {
                    'User-Agent': 'BusinessBook/1.0 (https://businessbook.cm)',
                },
            }
        );

        if (!response.ok) {
            console.error('Nominatim API error:', response.status);
            return null;
        }

        const data = await response.json();
        const address = data.address;

        return {
            quartier: address.suburb || address.neighbourhood || address.quarter || null,
            ville: address.city || address.town || address.village || address.municipality || null,
            pays: address.country || null,
            displayName: data.display_name || null,
        };
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        return null;
    }
}

export function useGeolocation() {
    const [state, setState] = useState<GeolocationState>({
        coordinates: {
            latitude: null,
            longitude: null,
        },
        address: null,
        loading: true,
        error: null,
        isSupported: true,
        permissionStatus: 'unknown',
    });

    const requestLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setState((prev) => ({
                ...prev,
                loading: false,
                error: "La géolocalisation n'est pas supportée par votre navigateur.",
                isSupported: false,
            }));
            return;
        }

        setState((prev) => ({ ...prev, loading: true, error: null }));

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                // Perform reverse geocoding
                const address = await reverseGeocode(latitude, longitude);

                setState({
                    coordinates: { latitude, longitude },
                    address,
                    loading: false,
                    error: null,
                    isSupported: true,
                    permissionStatus: 'granted',
                });
            },
            (error) => {
                let errorMessage = 'Une erreur est survenue lors de la géolocalisation.';
                let permissionStatus: 'prompt' | 'granted' | 'denied' | 'unknown' = 'unknown';

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "L'accès à la géolocalisation a été refusé.";
                        permissionStatus = 'denied';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Les informations de géolocalisation sont indisponibles.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'La demande de géolocalisation a expiré.';
                        break;
                }

                setState((prev) => ({
                    ...prev,
                    loading: false,
                    error: errorMessage,
                    permissionStatus,
                }));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 5 * 60 * 1000, // Cache for 5 minutes
            }
        );
    }, []);

    // Check permission status on mount
    useEffect(() => {
        if (!navigator.permissions) {
            // Fallback: directly request location
            requestLocation();
            return;
        }

        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
            setState((prev) => ({
                ...prev,
                permissionStatus: result.state as 'prompt' | 'granted' | 'denied',
            }));

            if (result.state === 'granted') {
                // Already granted, fetch location
                requestLocation();
            } else if (result.state === 'prompt') {
                // Will prompt - don't auto-request, wait for user action
                setState((prev) => ({ ...prev, loading: false }));
            } else {
                // Denied
                setState((prev) => ({
                    ...prev,
                    loading: false,
                    error: "L'accès à la géolocalisation a été refusé.",
                }));
            }

            // Listen for permission changes
            result.onchange = () => {
                setState((prev) => ({
                    ...prev,
                    permissionStatus: result.state as 'prompt' | 'granted' | 'denied',
                }));
                if (result.state === 'granted') {
                    requestLocation();
                }
            };
        }).catch(() => {
            // Fallback if permissions API fails
            requestLocation();
        });
    }, [requestLocation]);

    return {
        ...state,
        requestLocation,
        // Convenience getters
        locationString: state.address
            ? [state.address.quartier, state.address.ville, state.address.pays]
                .filter(Boolean)
                .join(', ')
            : null,
        shortLocation: state.address
            ? [state.address.quartier, state.address.ville].filter(Boolean).join(', ')
            : null,
    };
}
