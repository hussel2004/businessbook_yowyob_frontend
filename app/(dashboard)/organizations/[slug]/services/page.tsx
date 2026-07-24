'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getOrganizationBySlug } from '@/lib/api/public';
import {
    getOrganizationServices,
    createService,
    updateService,
    deleteService,
} from '@/lib/api/organization';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Switch } from '@/components/ui/switch';
import {
    Plus,
    Edit2,
    Trash2,
    Briefcase,
    DollarSign,
    Clock,
    GripVertical,
    Image as ImageIcon,
} from 'lucide-react';
import type { Service } from '@/types/organization';
import toast from 'react-hot-toast';
import { ImageUpload } from '@/components/ui/image-upload';
import { getAssetUrl } from '@/lib/api/endpoints';

const serviceSchema = z.object({
    name: z.string().min(2, 'Nom trop court').max(100, 'Nom trop long'),
    description: z.string().optional(),
    priceType: z.string().min(1, 'Type requis'),
    priceMin: z.coerce.number().min(0).optional(),
    priceMax: z.coerce.number().min(0).optional(),
    currency: z.string().default('XAF'),
    priceUnit: z.string().optional(),
    durationMinutes: z.preprocess(
        (val) => (val === '' ? undefined : val),
        z.coerce.number().min(0).optional()
    ),
    imageUrl: z.string().optional(),
    isActive: z.boolean().default(true),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

const PRICE_TYPES = [
    { value: 'fixed', label: 'Prix fixe', description: 'Un tarif unique' },
    { value: 'range', label: 'Fourchette', description: 'Prix min - max' },
    { value: 'starting_from', label: 'À partir de', description: 'Prix minimum' },
    { value: 'by_quote', label: 'Sur devis', description: 'Prix personnalisé' },
    { value: 'free', label: 'Gratuit', description: 'Service offert' },
];

const PRICE_UNITS = [
    { value: 'hour', label: 'par heure' },
    { value: 'day', label: 'par jour' },
    { value: 'week', label: 'par semaine' },
    { value: 'month', label: 'par mois' },
    { value: 'project', label: 'par projet' },
    { value: 'unit', label: 'à l\'unité' },
    { value: 'person', label: 'par personne' },
];

export default function ServicesPage() {
    const params = useParams();
    const slug = params.slug as string;
    const queryClient = useQueryClient();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ServiceFormData>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            priceType: 'fixed',
            currency: 'XAF',
            isActive: true,
        },
    });

    const selectedPriceType = watch('priceType');

    // Get organization
    const { data: org } = useQuery({
        queryKey: ['organization', slug],
        queryFn: () => getOrganizationBySlug(slug),
    });

    // Get services
    const { data: services, isLoading } = useQuery({
        queryKey: ['organization-services', org?.id],
        queryFn: () => getOrganizationServices(org!.id),
        enabled: !!org?.id,
    });

    // Create mutation
    const createMutation = useMutation({
        mutationFn: async (data: Partial<Service>) => {
            if (!org?.id) throw new Error('Organization not found');
            return createService(org.id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organization-services', org?.id] });
            setIsModalOpen(false);
            reset();
            toast.success('Service créé');
        },
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: async ({ serviceId, data }: { serviceId: string; data: Partial<Service> }) => {
            return updateService(serviceId, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organization-services', org?.id] });
            setIsModalOpen(false);
            setEditingService(null);
            reset();
            toast.success('Service mis à jour');
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: deleteService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organization-services', org?.id] });
            setDeleteConfirm(null);
            toast.success('Service supprimé');
        },
    });

    const openCreateModal = () => {
        setEditingService(null);
        reset({
            priceType: 'fixed',
            currency: 'XAF',
            isActive: true,
            name: '',
            description: '',
            priceMin: undefined,
            priceMax: undefined,
            priceUnit: '',
            durationMinutes: undefined,
            imageUrl: '',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (service: Service) => {
        setEditingService(service);
        reset({
            name: service.name,
            description: service.description || '',
            priceType: service.priceType,
            priceMin: service.priceMin || undefined,
            priceMax: service.priceMax || undefined,
            currency: service.currency,
            priceUnit: service.priceUnit || '',
            durationMinutes: service.durationMinutes || undefined,
            imageUrl: service.imageUrl || '',
            isActive: service.isActive,
        });
        setIsModalOpen(true);
    };

    const onSubmit = async (data: ServiceFormData) => {
        console.log('Submitting form data:', data);
        try {
            const serviceData: Partial<Service> = {
                name: data.name,
                description: data.description || undefined,
                priceType: data.priceType as Service['priceType'],
                priceMin: data.priceMin || undefined,
                priceMax: data.priceMax || undefined,
                currency: data.currency,
                priceUnit: data.priceUnit || undefined,
                durationMinutes: data.durationMinutes || undefined,
                imageUrl: data.imageUrl || undefined,
                isActive: data.isActive,
            };

            if (editingService) {
                await updateMutation.mutateAsync({ serviceId: editingService.id, data: serviceData });
            } else {
                await createMutation.mutateAsync(serviceData);
            }
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('Erreur lors de la création');
        }
    };

    const formatPrice = (service: Service): string => {
        const formatAmount = (amount: number) => {
            return new Intl.NumberFormat('fr-FR').format(amount) + ' ' + service.currency;
        };

        switch (service.priceType) {
            case 'fixed':
                return service.priceMin ? formatAmount(service.priceMin) : '-';
            case 'range':
                return `${service.priceMin ? formatAmount(service.priceMin) : '?'} - ${service.priceMax ? formatAmount(service.priceMax) : '?'
                    }`;
            case 'starting_from':
                return `À partir de ${service.priceMin ? formatAmount(service.priceMin) : '?'}`;
            case 'by_quote':
                return 'Sur devis';
            case 'free':
                return 'Gratuit';
            default:
                return '-';
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Services</h2>
                    <p className="text-muted-foreground mt-1">
                        Gérez les services que vous proposez à vos clients
                    </p>
                </div>
                <Button onClick={openCreateModal}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un service
                </Button>
            </div>

            {/* Services List */}
            {!services || services.length === 0 ? (
                <EmptyState
                    icon={Briefcase}
                    title="Aucun service"
                    description="Ajoutez vos services pour informer les clients de ce que vous proposez."
                    action={
                        <Button onClick={openCreateModal}>
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter un service
                        </Button>
                    }
                />
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className={`group relative border rounded-xl bg-card overflow-hidden transition-all hover:shadow-lg ${!service.isActive ? 'opacity-60' : ''
                                }`}
                        >
                            {/* Image */}
                            <div className="h-32 bg-gradient-to-br from-primary/10 to-secondary/10 relative">
                                {service.imageUrl ? (
                                    <img
                                        src={getAssetUrl(service.imageUrl) || ''}
                                        alt={service.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Briefcase className="h-10 w-10 text-muted-foreground/50" />
                                    </div>
                                )}

                                {/* Status Badge */}
                                {!service.isActive && (
                                    <Badge className="absolute top-2 left-2 bg-gray-500">Inactif</Badge>
                                )}

                                {/* Price Badge */}
                                <div className="absolute bottom-2 right-2 bg-white dark:bg-gray-900 px-3 py-1 rounded-full font-medium text-sm shadow-lg">
                                    {formatPrice(service)}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-semibold text-lg line-clamp-1">{service.name}</h3>
                                {service.description && (
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                        {service.description}
                                    </p>
                                )}

                                {/* Meta */}
                                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                                    {service.durationMinutes && (
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {service.durationMinutes >= 60
                                                ? `${Math.floor(service.durationMinutes / 60)}h${service.durationMinutes % 60 > 0 ? service.durationMinutes % 60 : ''
                                                }`
                                                : `${service.durationMinutes}min`}
                                        </span>
                                    )}
                                    {service.priceUnit && (
                                        <span className="text-xs bg-muted px-2 py-0.5 rounded">
                                            {PRICE_UNITS.find((u) => u.value === service.priceUnit)?.label}
                                        </span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => openEditModal(service)}
                                    >
                                        <Edit2 className="h-4 w-4 mr-1" />
                                        Modifier
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-600"
                                        onClick={() => setDeleteConfirm(service.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Delete Confirm */}
                            {deleteConfirm === service.id && (
                                <Modal open onOpenChange={() => setDeleteConfirm(null)}>
                                    <div className="p-6 text-center">
                                        <Trash2 className="h-12 w-12 mx-auto mb-4 text-red-500" />
                                        <h3 className="text-lg font-semibold mb-2">Supprimer ce service ?</h3>
                                        <p className="text-muted-foreground mb-4">Cette action est irréversible.</p>
                                        <div className="flex justify-center gap-2">
                                            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                                                Annuler
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() => deleteMutation.mutateAsync(service.id)}
                                            >
                                                Supprimer
                                            </Button>
                                        </div>
                                    </div>
                                </Modal>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            <Modal open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
                <form onSubmit={handleSubmit(onSubmit, (errors) => console.error('Form validation errors:', errors))} className="p-6 space-y-6">
                    <h2 className="text-xl font-semibold">
                        {editingService ? 'Modifier le service' : 'Nouveau service'}
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {/* Name */}
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="name">Nom du service</Label>
                            <Input
                                id="name"
                                placeholder="Ex: Consultation IT"
                                {...register('name')}
                                error={!!errors.name}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                        </div>

                        {/* Description */}
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="description">Description (optionnel)</Label>
                            <Textarea
                                id="description"
                                placeholder="Décrivez votre service..."
                                rows={3}
                                {...register('description')}
                            />
                        </div>

                        {/* Price Type */}
                        <div className="space-y-2">
                            <Label htmlFor="priceType">Type de tarification</Label>
                            <Select {...register('priceType')}>
                                {PRICE_TYPES.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label} - {type.description}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        {/* Currency */}
                        <div className="space-y-2">
                            <Label htmlFor="currency">Devise</Label>
                            <Select {...register('currency')}>
                                <option value="XAF">XAF (FCFA)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="USD">USD ($)</option>
                            </Select>
                        </div>

                        {/* Price Min */}
                        {selectedPriceType !== 'free' && selectedPriceType !== 'by_quote' && (
                            <div className="space-y-2">
                                <Label htmlFor="priceMin">
                                    {selectedPriceType === 'range' ? 'Prix minimum' : 'Prix'}
                                </Label>
                                <Input
                                    id="priceMin"
                                    type="number"
                                    min="0"
                                    placeholder="Ex: 25000"
                                    {...register('priceMin')}
                                />
                            </div>
                        )}

                        {/* Price Max (only for range) */}
                        {selectedPriceType === 'range' && (
                            <div className="space-y-2">
                                <Label htmlFor="priceMax">Prix maximum</Label>
                                <Input
                                    id="priceMax"
                                    type="number"
                                    min="0"
                                    placeholder="Ex: 50000"
                                    {...register('priceMax')}
                                />
                            </div>
                        )}

                        {/* Price Unit */}
                        <div className="space-y-2">
                            <Label htmlFor="priceUnit">Unité (optionnel)</Label>
                            <Select {...register('priceUnit')}>
                                <option value="">Aucune</option>
                                {PRICE_UNITS.map((unit) => (
                                    <option key={unit.value} value={unit.value}>
                                        {unit.label}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        {/* Duration */}
                        <div className="space-y-2">
                            <Label htmlFor="durationMinutes">Durée (minutes) (optionnel)</Label>
                            <Input
                                id="durationMinutes"
                                type="number"
                                min="0"
                                placeholder="Ex: 60"
                                {...register('durationMinutes')}
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2 sm:col-span-2">
                            <Label>Image du service (optionnel)</Label>
                            <ImageUpload
                                value={watch('imageUrl')}
                                onChange={(url) => setValue('imageUrl', url || '')}
                                category="services"
                            />
                        </div>

                        {/* Is Active */}
                        <div className="space-y-2 sm:col-span-2 flex items-center justify-between p-3 border rounded-lg">
                            <div>
                                <Label>Service actif</Label>
                                <p className="text-xs text-muted-foreground">
                                    Les services inactifs ne sont pas visibles sur votre profil public
                                </p>
                            </div>
                            <Switch
                                checked={watch('isActive')}
                                onCheckedChange={(checked) => setValue('isActive', checked)}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Enregistrement...' : editingService ? 'Mettre à jour' : 'Créer'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
