import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Address {
    quartier: string | null;
    ville: string | null;
    pays: string | null;
    displayName: string | null;
}

interface LocationState {
    // User's current location
    coordinates: {
        latitude: number | null;
        longitude: number | null;
    } | null;
    address: Address | null;

    // Manual city selection (fallback when geolocation denied)
    manualCity: string | null;

    // State flags
    isLocationSet: boolean;
    source: 'geolocation' | 'manual' | null;
    hasDismissedPrompt: boolean;

    // Actions
    setLocation: (
        coords: { latitude: number; longitude: number },
        address: Address | null
    ) => void;
    setManualCity: (city: string) => void;
    clearLocation: () => void;
    dismissPrompt: () => void;
}

export const useLocationStore = create<LocationState>()(
    persist(
        (set) => ({
            coordinates: null,
            address: null,
            manualCity: null,
            isLocationSet: false,
            source: null,

            hasDismissedPrompt: false, // Default value

            setLocation: (coords, address) =>
                set({
                    coordinates: coords,
                    address,
                    manualCity: null,
                    isLocationSet: true,
                    source: 'geolocation',
                }),

            setManualCity: (city) =>
                set({
                    coordinates: null,
                    address: { quartier: null, ville: city, pays: 'Cameroun', displayName: city },
                    manualCity: city,
                    isLocationSet: true,
                    source: 'manual',
                }),

            clearLocation: () =>
                set({
                    coordinates: null,
                    address: null,
                    manualCity: null,
                    isLocationSet: false,
                    source: null,
                }),

            dismissPrompt: () =>
                set({
                    hasDismissedPrompt: true,
                }),
        }),
        {
            name: 'businessbook-location',
            partialize: (state) => ({
                manualCity: state.manualCity,
                source: state.source,
                hasDismissedPrompt: state.hasDismissedPrompt,
                // Don't persist coordinates for privacy
            }),
        }
    )
);

// Selector for getting a display-friendly location string
export const getLocationDisplay = (state: LocationState): string | null => {
    if (!state.isLocationSet) return null;

    if (state.source === 'manual' && state.manualCity) {
        return state.manualCity;
    }

    if (state.address) {
        const parts = [state.address.quartier, state.address.ville].filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : null;
    }

    return null;
};
