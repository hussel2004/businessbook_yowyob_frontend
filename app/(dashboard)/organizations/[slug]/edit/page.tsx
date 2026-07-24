'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getOrganizationBySlug, getCategories } from '@/lib/api/public';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import { useEffect, useRef } from 'react';
import { put } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { TagInput } from '@/components/ui/tag-input';
import { ImageUpload } from '@/components/ui/image-upload';

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

const updateOrgSchema = z.object({
    longName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    shortName: z.string().min(2, 'Le nom court doit contenir au moins 2 caractères'),
    tagline: z.string().optional(),
    description: z.string().optional(),
    categoryId: z.string().min(1, 'Catégorie requise'),
    websiteUrl: z.string().url('URL invalide').optional().or(z.literal('')),
    logoUrl: z.string().optional(),
    coverImageUrl: z.string().optional(),
    // Legal
    legalForm: z.string().optional(),
    registrationNumber: z.string().optional(),
    taxNumber: z.string().optional(),
    yearFounded: z.number().optional(),
    // Business
    employeeCountRange: z.string().optional(),
    annualRevenueRange: z.string().optional(),
    capital: z.number().optional(),
    keywords: z.array(z.string()).optional(),
    contacts: z.array(contactSchema).optional(),
});

type UpdateOrgFormValues = z.infer<typeof updateOrgSchema>;

export default function EditOrganizationPage() {
    const params = useParams();
    const slug = params.slug as string;
    const queryClient = useQueryClient();
    const initialCategoryIdRef = useRef<string | null>(null);

    const { data: org, isLoading: orgLoading } = useQuery({
        queryKey: ['organization', slug],
        queryFn: () => getOrganizationBySlug(slug),
    });

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
    });

    const { register, handleSubmit, reset, watch, control, formState: { errors } } = useForm<UpdateOrgFormValues>({
        resolver: zodResolver(updateOrgSchema),
    });

    const selectedCategoryId = watch('categoryId');

    // Reset form when org data loads
    useEffect(() => {
        if (org) {
            // Get the primary category ID from the categories if available
            const categoryId = (org as any).categoryId || '';
            initialCategoryIdRef.current = categoryId;

            // Convert comma-separated string to array for TagInput
            const keywordsArray = org.keywords ? org.keywords.split(',').filter(Boolean) : [];

            reset({
                longName: org.longName,
                shortName: org.shortName,
                tagline: org.tagline || '',
                description: org.description || '',
                categoryId: categoryId,
                websiteUrl: org.websiteUrl || '',
                logoUrl: org.logoUrl || '',
                coverImageUrl: org.coverImageUrl || '',
                legalForm: org.legalForm || '',
                registrationNumber: org.registrationNumber || '',
                taxNumber: org.taxNumber || '',
                yearFounded: org.yearFounded,
                employeeCountRange: org.employeeCountRange || '',
                annualRevenueRange: org.annualRevenueRange || '',
                capital: org.capital,
                keywords: keywordsArray,
                contacts: org.contacts || [],
            });
        }
    }, [org, reset]);

    // Mutation for updating basic organization info
    const updateOrgMutation = useMutation({
        mutationFn: async (data: Omit<UpdateOrgFormValues, 'categoryId'> & { keywords?: string }) => {
            if (!org?.id) throw new Error("ID manquant");
            return put(`/organizations/${org.id}`, data);
        },
    });

    // Mutation for updating category
    const updateCategoryMutation = useMutation({
        mutationFn: async (categoryId: string) => {
            if (!org?.id) throw new Error("ID manquant");
            return put(ENDPOINTS.ORGANIZATIONS.CATEGORY(org.id), { categoryId });
        },
    });

    const onSubmit = async (data: UpdateOrgFormValues) => {
        try {
            if (!org?.id) {
                toast.error("ID de l'organisation manquant");
                return;
            }

            const { categoryId, keywords, ...basicInfo } = data;

            const payload = {
                ...basicInfo,
                keywords: keywords ? keywords.join(',') : '',
                // Address and contacts will be included in basicInfo
            };

            await updateOrgMutation.mutateAsync(payload as any);

            if (categoryId && categoryId !== initialCategoryIdRef.current) {
                await updateCategoryMutation.mutateAsync(categoryId);
                initialCategoryIdRef.current = categoryId;
            }

            queryClient.invalidateQueries({ queryKey: ['organization', slug] });
            queryClient.invalidateQueries({ queryKey: ['categories'] });

            toast.success('Informations mises à jour');
        } catch (error) {
            console.error('Update error:', error);
            toast.error('Erreur lors de la mise à jour');
        }
    };

    const isPending = updateOrgMutation.isPending || updateCategoryMutation.isPending;

    if (orgLoading) return <div>Chargement...</div>;

    return (
        <div className="max-w-3xl">
            <h2 className="text-xl font-semibold mb-6">Informations générales</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Identité */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">Identité</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="longName">Nom de l'entreprise</Label>
                            <Input id="longName" {...register('longName')} />
                            {errors.longName && <span className="text-xs text-destructive">{errors.longName.message}</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="shortName">Nom court</Label>
                            <Input id="shortName" {...register('shortName')} />
                            {errors.shortName && <span className="text-xs text-destructive">{errors.shortName.message}</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tagline">Slogan (Tagline)</Label>
                            <Input id="tagline" placeholder="La qualité avant tout" {...register('tagline')} />
                            {errors.tagline && <span className="text-xs text-destructive">{errors.tagline.message}</span>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="categoryId">Catégorie</Label>
                        <select
                            id="categoryId"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            {...register('categoryId')}
                        >
                            <option value="">Sélectionner une catégorie</option>
                            {categories?.map((cat: any) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        {errors.categoryId && <span className="text-xs text-destructive">{errors.categoryId.message}</span>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Bio)</Label>
                        <Textarea id="description" rows={5} {...register('description')} />
                        {errors.description && <span className="text-xs text-destructive">{errors.description.message}</span>}
                    </div>
                </div>

                {/* Contacts Section - Address is on Agency only */}
                <div className="space-y-6 pt-4 border-t">
                    <h3 className="text-lg font-medium border-b pb-2">Informations de Contact</h3>
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
                    <h3 className="text-lg font-medium border-b pb-2">Images</h3>
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

                {/* Info Légales */}
                <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium border-b pb-2">Informations Légales</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="legalForm">Forme Juridique</Label>
                            <Input id="legalForm" placeholder="Ex: SARL" {...register('legalForm')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="yearFounded">Année de création</Label>
                            <Input id="yearFounded" type="number" placeholder="Ex: 2020" {...register('yearFounded', { valueAsNumber: true })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="registrationNumber">N° Registre Commerce</Label>
                            <Input id="registrationNumber" placeholder="RC/..." {...register('registrationNumber')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="taxNumber">N° Contribuable (NIU)</Label>
                            <Input id="taxNumber" placeholder="M..." {...register('taxNumber')} />
                        </div>
                    </div>
                </div>

                {/* Info Commerciales */}
                <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium border-b pb-2">Informations Commerciales</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="employeeCountRange">Effectif</Label>
                            <select
                                id="employeeCountRange"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                {...register('employeeCountRange')}
                            >
                                <option value="">Non renseigné</option>
                                <option value="1-10">1-10 employés</option>
                                <option value="11-50">11-50 employés</option>
                                <option value="51-200">51-200 employés</option>
                                <option value="200+">Plus de 200 employés</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="annualRevenueRange">Chiffre d'affaires</Label>
                            <select
                                id="annualRevenueRange"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                {...register('annualRevenueRange')}
                            >
                                <option value="">Non renseigné</option>
                                <option value="0-10M">Moins de 10M XAF</option>
                                <option value="10M-50M">10M - 50M XAF</option>
                                <option value="50M-200M">50M - 200M XAF</option>
                                <option value="200M+">Plus de 200M XAF</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="capital">Capital Social</Label>
                            <Input id="capital" type="number" placeholder="Montant en XAF" {...register('capital', { valueAsNumber: true })} />
                        </div>
                    </div>
                </div>

                {/* Visibilité */}
                <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium border-b pb-2">Visibilité</h3>
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

                    <div className="space-y-2">
                        <Label htmlFor="websiteUrl">Site Web</Label>
                        <Input id="websiteUrl" placeholder="https://" {...register('websiteUrl')} />
                        {errors.websiteUrl && <span className="text-xs text-destructive">{errors.websiteUrl.message}</span>}
                    </div>
                </div>

                <div className="pt-4 border-t">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </Button>
                </div>
            </form>

            <div className="mt-12 border-t pt-8">
                <h3 className="text-lg font-medium text-destructive mb-4">Zone de danger</h3>
                <Button variant="destructive" className="border-destructive text-destructive hover:bg-destructive hover:text-white">
                    Supprimer cette entreprise
                </Button>
            </div>
        </div>
    );
}
