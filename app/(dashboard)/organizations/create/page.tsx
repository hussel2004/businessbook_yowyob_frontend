'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createOrganization } from '@/lib/api/organizations';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/auth/auth-store';
import { useEffect } from 'react';

import toast from 'react-hot-toast';
import { getCategories } from '@/lib/api/public';
import { Select } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { TagInput } from '@/components/ui/tag-input';

import { OrgAddressForm } from '@/components/features/organization/org-address-form';
import { OrgContactListForm } from '@/components/features/organization/org-contact-list-form';

// Schema
const contactSchema = z.object({
    contactType: z.string(),
    value: z.string().min(1, "Valeur requise"),
    label: z.string().optional(),
    isPrimary: z.boolean().default(false),
    isPublic: z.boolean().default(true),
});

const createOrgSchema = z.object({
    longName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    shortName: z.string().min(2, 'Le nom court doit contenir au moins 2 caractères'),
    tagline: z.string().optional(),
    description: z.string().optional(),
    categoryId: z.string().min(1, 'Veuillez sélectionner une catégorie'),
    websiteUrl: z.string().url('URL invalide').optional().or(z.literal('')),
    logoUrl: z.string().optional(),
    coverImageUrl: z.string().optional(),
    legalForm: z.string().optional(),
    registrationNumber: z.string().optional(),
    taxNumber: z.string().optional(),
    yearFounded: z.number().optional(),
    keywords: z.array(z.string()).optional(),
    contacts: z.array(contactSchema).optional(),
});

type CreateOrgFormValues = z.infer<typeof createOrgSchema>;

export default function CreateOrganizationPage() {
    const router = useRouter();
    const { isAuthenticated, user, isLoading } = useAuthStore();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (user && !user.emailVerified) {
                toast.error('Veuillez vérifier votre email pour créer une entreprise.');
                router.push('/resend-verification');
            } else if (user && user.accountType !== 'BUSINESS') {
                toast.error('Devenez business owner avant de créer une entreprise.');
                router.push('/dashboard');
            }
        }
    }, [isLoading, isAuthenticated, user, router]);

    // Fetch categories for selection
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
    });

    const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<CreateOrgFormValues>({
        resolver: zodResolver(createOrgSchema),
        defaultValues: {
            keywords: [],
            contacts: []
        }
    });

    // IMPORTANT: All hooks must be called before any conditional returns
    const mutation = useMutation({
        mutationFn: createOrganization,
        onSuccess: (data) => {
            toast.success('Entreprise créée avec succès');
            router.push(`/organizations/${data.slug}`);
        },
        onError: () => {
            toast.error('Erreur lors de la création');
        }
    });

    const onSubmit = (data: CreateOrgFormValues) => {
        const payload = {
            ...data,
            keywords: data.keywords?.join(',') || '' // API expects string
        };
        mutation.mutate(payload as any);
    };

    if (isLoading) {
        return <div className="flex justify-center py-20">Chargement...</div>;
    }

    if (
        !isAuthenticated ||
        (user && !user.emailVerified) ||
        (user && user.accountType !== 'BUSINESS')
    ) {
        return null; // Don't render form while redirecting
    }

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Ajouter une entreprise</h1>
                <p className="text-muted-foreground">
                    Créez une nouvelle page pour votre activité.
                </p>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Identité */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Identité</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="longName">Nom de l'entreprise <span className="text-destructive">*</span></Label>
                                <Input id="longName" placeholder="Ex: Ma Boutique" {...register('longName')} />
                                {errors.longName && <span className="text-xs text-destructive">{errors.longName.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="shortName">Nom court (pour l'URL et l'affichage compact) <span className="text-destructive">*</span></Label>
                                <Input id="shortName" placeholder="Ex: Boutique" {...register('shortName')} />
                                {errors.shortName && <span className="text-xs text-destructive">{errors.shortName.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tagline">Slogan (Tagline)</Label>
                                <Input id="tagline" placeholder="Ex: La qualité avant tout" {...register('tagline')} />
                                {errors.tagline && <span className="text-xs text-destructive">{errors.tagline.message}</span>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="categoryId">Catégorie <span className="text-destructive">*</span></Label>
                            <select
                                id="categoryId"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...register('categoryId')}
                            >
                                <option value="">Sélectionner une catégorie</option>
                                {categories?.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            {errors.categoryId && <span className="text-xs text-destructive">{errors.categoryId.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description courte</Label>
                            <Textarea id="description" placeholder="Présentez votre activité en quelques mots..." {...register('description')} />
                            {errors.description && <span className="text-xs text-destructive">{errors.description.message}</span>}
                        </div>
                    </div>

                    {/* Contacts Section - Address is on Agency only */}
                    <div className="space-y-6 pt-4 border-t">
                        <h2 className="text-xl font-semibold">Informations de Contact</h2>
                        <p className="text-sm text-muted-foreground">L'adresse sera définie au niveau des agences.</p>

                        <div className="pl-2 border-l-2 space-y-4">
                            <OrgContactListForm
                                register={register}
                                control={control}
                                errors={errors}
                                name="contacts"
                            />
                        </div>
                    </div>

                    {/* Médias */}
                    <div className="space-y-4 pt-4 border-t">
                        <h2 className="text-xl font-semibold">Images</h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Logo</Label>
                                <Controller
                                    control={control}
                                    name="logoUrl"
                                    render={({ field }) => (
                                        <ImageUpload
                                            value={field.value}
                                            onChange={field.onChange}
                                            category="logos"
                                            className="w-full"
                                        />
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Image de couverture</Label>
                                <Controller
                                    control={control}
                                    name="coverImageUrl"
                                    render={({ field }) => (
                                        <ImageUpload
                                            value={field.value}
                                            onChange={field.onChange}
                                            category="covers"
                                            className="w-full"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Informations Légales */}
                    <div className="space-y-4 pt-4 border-t">
                        <h2 className="text-xl font-semibold">Informations Légales</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="legalForm">Forme Juridique</Label>
                                <Input id="legalForm" placeholder="Ex: SARL, SA" {...register('legalForm')} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="yearFounded">Année de création</Label>
                                <Input
                                    id="yearFounded"
                                    type="number"
                                    placeholder="Ex: 2020"
                                    {...register('yearFounded', { valueAsNumber: true })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="registrationNumber">N° Registre Commerce</Label>
                                <Input id="registrationNumber" placeholder="RC/..." {...register('registrationNumber')} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="taxNumber">N° Contribuable</Label>
                                <Input id="taxNumber" placeholder="M..." {...register('taxNumber')} />
                            </div>
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="space-y-4 pt-4 border-t">
                        <h2 className="text-xl font-semibold">Visibilité</h2>
                        <div className="space-y-2">
                            <Label htmlFor="websiteUrl">Site Web</Label>
                            <Input id="websiteUrl" placeholder="https://..." {...register('websiteUrl')} />
                            {errors.websiteUrl && <span className="text-xs text-destructive">{errors.websiteUrl.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <Label>Mots-clés</Label>
                            <Controller
                                control={control}
                                name="keywords"
                                render={({ field }) => (
                                    <TagInput
                                        value={field.value || []}
                                        onChange={field.onChange}
                                        placeholder="Ajouter des mots-clés (Entrée pour valider)"
                                        maxTags={10}
                                    />
                                )}
                            />
                            <p className="text-xs text-muted-foreground">Les mots-clés aident les clients à trouver votre entreprise.</p>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button variant="ghost" type="button" onClick={() => router.back()}>Annuler</Button>
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? 'Création...' : 'Créer l\'entreprise'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
