'use client';

import dynamic from 'next/dynamic';
import { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const LocationPicker = dynamic(() => import('@/components/features/map/location-picker'), {
    loading: () => <div className="h-[300px] w-full bg-muted animate-pulse rounded-md flex items-center justify-center text-sm text-muted-foreground">Chargement de la carte...</div>,
    ssr: false,
});

interface OrgAddressFormProps {
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
    control?: any; // Kept for future use (Select)
    setValue?: UseFormSetValue<any>;
    watch?: UseFormWatch<any>;
    prefix?: string;
}

export function OrgAddressForm({ register, errors, setValue, watch, prefix = 'address' }: OrgAddressFormProps) {
    // Helper to access nested errors
    const getError = (field: string) => {
        const fieldPath = `${prefix}.${field}`;
        const parts = fieldPath.split('.');
        // Deep access attempt or just simplified check (React Hook Form errors object is nested)
        // For simplicity assuming one level prefix is common: errors[prefix]?.[field]
        // But if prefix is nested "a.b", it gets complex.
        // Let's assume generic loose checking or use lodash.get if installed (probably not).

        // Simpler: use the errors object provided which might be scoped or root.
        // If root, we traverse.
        // TODO: correct traversal
        return (errors as any)?.[prefix]?.[field];
    };

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor={`${prefix}.streetLine1`}>Adresse (Rue/Quartier) *</Label>
                    <Input
                        id={`${prefix}.streetLine1`}
                        placeholder="Ex: Rue de la République"
                        {...register(`${prefix}.streetLine1`)}
                    />
                    {getError('streetLine1') && (
                        <p className="text-sm text-destructive">{getError('streetLine1').message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`${prefix}.neighborhood`}>Quartier / Secteur</Label>
                    <Input
                        id={`${prefix}.neighborhood`}
                        placeholder="Ex: Akwa"
                        {...register(`${prefix}.neighborhood`)}
                    />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor={`${prefix}.city`}>Ville *</Label>
                    <Input
                        id={`${prefix}.city`}
                        placeholder="Ex: Douala"
                        {...register(`${prefix}.city`)}
                    />
                    {getError('city') && (
                        <p className="text-sm text-destructive">{getError('city').message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`${prefix}.postalCode`}>Code Postal</Label>
                    <Input
                        id={`${prefix}.postalCode`}
                        placeholder="Ex: 8000"
                        {...register(`${prefix}.postalCode`)}
                    />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor={`${prefix}.countryCode`}>Pays</Label>
                    <select
                        id={`${prefix}.countryCode`}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...register(`${prefix}.countryCode`)}
                        defaultValue="CM"
                    >
                        <option value="CM">Cameroun</option>
                        <option value="GA">Gabon</option>
                        <option value="TD">Tchad</option>
                        <option value="CG">Congo</option>
                        <option value="GQ">Guinée Équatoriale</option>
                        <option value="CF">RCA</option>
                        {/* Add more as needed */}
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`${prefix}.landmark`}>Point de repère</Label>
                    <Input
                        id={`${prefix}.landmark`}
                        placeholder="Ex: En face de la pharmacie"
                        {...register(`${prefix}.landmark`)}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor={`${prefix}.directions`}>Instructions d'accès</Label>
                <Textarea
                    id={`${prefix}.directions`}
                    placeholder="Instructions supplémentaires pour trouver le lieu..."
                    {...register(`${prefix}.directions`)}
                />
            </div>

            {/* Localisation GPS — carte cliquable en priorité, champs numériques en repli/precision */}
            <div className="space-y-2">
                <Label>Localisation sur la carte</Label>
                {setValue ? (
                    <>
                        <p className="text-sm text-muted-foreground">
                            Cliquez sur la carte pour positionner précisément le lieu (ou utilisez le bouton "Ma position").
                        </p>
                        <LocationPicker
                            initialLocation={
                                watch?.(`${prefix}.latitude`) && watch?.(`${prefix}.longitude`)
                                    ? { lat: watch(`${prefix}.latitude`), lng: watch(`${prefix}.longitude`) }
                                    : undefined
                            }
                            onLocationSelect={(loc) => {
                                setValue(`${prefix}.latitude`, loc.lat, { shouldValidate: true, shouldDirty: true });
                                setValue(`${prefix}.longitude`, loc.lng, { shouldValidate: true, shouldDirty: true });
                            }}
                        />
                    </>
                ) : (
                    <p className="text-sm text-muted-foreground">Renseignez les coordonnées manuellement ci-dessous.</p>
                )}
                <div className="grid gap-4 md:grid-cols-2 pt-2">
                    <div className="space-y-2">
                        <Label htmlFor={`${prefix}.latitude`}>Latitude</Label>
                        <Input
                            type="number"
                            step="any"
                            id={`${prefix}.latitude`}
                            {...register(`${prefix}.latitude`, { valueAsNumber: true })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`${prefix}.longitude`}>Longitude</Label>
                        <Input
                            type="number"
                            step="any"
                            id={`${prefix}.longitude`}
                            {...register(`${prefix}.longitude`, { valueAsNumber: true })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
