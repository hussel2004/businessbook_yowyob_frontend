'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin, SlidersHorizontal, Navigation, Map as MapIcon } from 'lucide-react';
import dynamic from 'next/dynamic';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Modal, ModalHeader, ModalTitle, ModalBody } from '@/components/ui/modal';
import { useDebounce } from '@/lib/hooks/use-debounce';

import { getCategories } from '@/lib/api/public';

const LocationPicker = dynamic(() => import('../map/location-picker'), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-muted animate-pulse rounded-md" />
});

interface SearchFiltersProps {
    className?: string;
    onClose?: () => void;
}

export function SearchFilters({ className, onClose }: SearchFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Local state for filters
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [location, setLocation] = useState(searchParams.get('city') || '');
    const [categoryId, setCategoryId] = useState(searchParams.get('category') || '');
    const [verified, setVerified] = useState(searchParams.get('verified') === 'true');
    const [lat, setLat] = useState(searchParams.get('lat') || '');
    const [lng, setLng] = useState(searchParams.get('lon') || '');
    const [radius, setRadius] = useState(searchParams.get('radius') || '10');
    const [isMapOpen, setIsMapOpen] = useState(false);

    const debouncedQuery = useDebounce(query, 500);
    const debouncedLocation = useDebounce(location, 500);

    // Fetch categories
    const { data: categories = [], isLoading: loadingCategories } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        staleTime: 60 * 60 * 1000,
    });

    // Sync with URL params when they change externally (e.g. navigation)
    // Sync with URL params when they change externally
    useEffect(() => {
        setQuery(searchParams.get('q') || '');
        setLocation(searchParams.get('city') || '');
        setCategoryId(searchParams.get('category') || '');
        setVerified(searchParams.get('verified') === 'true');
        setLat(searchParams.get('lat') || '');
        setLng(searchParams.get('lon') || '');
        setRadius(searchParams.get('radius') || '10');
    }, [searchParams]);

    // Auto-apply filters on debounce or immediate change
    useEffect(() => {
        applyFilters();
    }, [debouncedQuery, debouncedLocation, categoryId, verified, lat, lng, radius]);

    const applyFilters = () => {
        const params = new URLSearchParams();

        if (debouncedQuery) params.set('q', debouncedQuery);
        if (debouncedLocation) params.set('city', debouncedLocation);
        if (categoryId && categoryId !== 'all') params.set('category', categoryId);
        if (verified) params.set('verified', 'true');
        if (lat && lng) {
            params.set('lat', lat);
            params.set('lon', lng);
            params.set('radius', radius);
        }

        // Preserve view mode if present? No, view mode is local to page usually.
        // But router.push might reset it. 
        // Ideally we merge with current params but SearchPage handles viewMode locally.

        router.push(`/search?${params.toString()}`);
    };

    const handleGeolocation = () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLat(position.coords.latitude.toString());
                setLng(position.coords.longitude.toString());
                setLocation('Ma position'); // Visual feedback
            },
            (error) => console.error(error)
        );
    };

    const handleMapSelect = (loc: { lat: number, lng: number }) => {
        setLat(loc.lat.toString());
        setLng(loc.lng.toString());
        setLocation('Position sélectionnée');
        setIsMapOpen(false);
    };

    const handleApplyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (query) params.set('q', query);
        else params.delete('q');

        if (location) params.set('city', location);
        else params.delete('city');

        if (categoryId && categoryId !== 'all') params.set('category', categoryId);
        else params.delete('category');

        if (verified) params.set('verified', 'true');
        else params.delete('verified');

        // Clean up unused params
        params.delete('minRating');
        params.delete('keywords');

        // Reset page on filter change
        params.delete('page');

        router.push(`/search?${params.toString()}`);
        onClose?.(); // Close mobile drawer if applicable
    };

    const handleClearFilters = () => {
        setQuery('');
        setLocation('');
        setCategoryId('');
        setVerified(false);
        setLat('');
        setLng('');
        setRadius('10');
        router.push('/search');
        onClose?.();
    };

    const activeFilterCount = [
        query,
        location,
        categoryId,
        verified
    ].filter(Boolean).length;

    const categoryOptions = [
        { value: 'all', label: 'Toutes les catégories' },
        ...categories.map(cat => ({ value: cat.slug, label: cat.name }))
    ];

    return (
        <div className={`space-y-6 ${className}`}>
            <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filtres
                </h3>
                {activeFilterCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="text-xs h-8 text-muted-foreground hover:text-foreground"
                    >
                        Réinitialiser
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                {/* Keywords */}
                <div className="space-y-2">
                    <Label htmlFor="q">Nom de l'entreprise</Label>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="q"
                            placeholder="Ex: Boulangerie, TechSolutions..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="pl-9"
                            onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                        />
                    </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                    <Label htmlFor="city">Lieu</Label>
                    <div className="relative">
                        <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="city"
                            placeholder="Ville ou 'Ma position'"
                            value={location}
                            onChange={(e) => {
                                setLocation(e.target.value);
                                // Clear coordinates if user types manually
                                if (lat || lng) {
                                    setLat('');
                                    setLng('');
                                }
                            }}
                            className="pl-9 pr-20"
                        />
                        <div className="absolute right-1 top-1 flex gap-1">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                title="Autour de moi"
                                onClick={handleGeolocation}
                            >
                                <Navigation className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                title="Choisir sur la carte"
                                onClick={() => setIsMapOpen(true)}
                            >
                                <MapIcon className="h-4 w-4" />
                            </Button>

                            <Modal open={isMapOpen} onOpenChange={setIsMapOpen}>
                                <ModalHeader>
                                    <ModalTitle>Choisir une position</ModalTitle>
                                </ModalHeader>
                                <ModalBody className="p-0">
                                    <LocationPicker onLocationSelect={handleMapSelect} />
                                </ModalBody>
                            </Modal>
                        </div>
                    </div>
                    {(lat && lng) && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <CheckIcon /> Coordonnées appliquées ({Number(lat).toFixed(4)}, {Number(lng).toFixed(4)})
                        </div>
                    )}
                </div>

                {/* Categories */}
                <div className="space-y-2">
                    <Label>Catégorie</Label>
                    {loadingCategories ? (
                        <Skeleton className="h-10 w-full" />
                    ) : (
                        <Select
                            value={categoryId || 'all'}
                            onChange={(e) => setCategoryId(e.target.value)}
                            options={categoryOptions}
                        />
                    )}
                </div>

                <div className="h-px bg-border my-4" />

                {/* Verified */}
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="verified"
                        checked={verified}
                        onChange={(e) => setVerified(e.target.checked)}
                    />
                    <div className="grid gap-1.5 leading-none">
                        <Label
                            htmlFor="verified"
                            className="text-sm font-medium leading-none cursor-pointer"
                        >
                            Entreprises certifiées uniquement
                        </Label>
                    </div>
                </div>

                {/* <Button onClick={handleApplyFilters} className="w-full">
                    Appliquer les filtres
                </Button> */}
            </div>
        </div>
    );
}

function CheckIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-green-500"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    )
}
