'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getOrganizationBySlug } from '@/lib/api/public';
import {
    getAgencies,
    createAgency,
    updateAgency,
    deleteAgency,
    getOpeningHours,
    setOpeningHours,
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
import { OpeningHoursEditor } from '@/components/features/dashboard';
import { OrgAddressForm } from '@/components/features/organization/org-address-form';
import { OrgContactListForm } from '@/components/features/organization/org-contact-list-form';
import {
    Plus,
    MapPin,
    Clock,
    Phone,
    Mail,
    Edit2,
    Trash2,
    Building,
    ChevronDown,
    ChevronUp,
    Check,
    X,
} from 'lucide-react';
import type { Agency, OpeningHour, CreateAgencyInput } from '@/types/organization';
import toast from 'react-hot-toast';

const contactSchema = z.object({
    contactType: z.string(),
    value: z.string().min(1, "Valeur requise"),
    label: z.string().optional(),
    isPrimary: z.boolean().default(false),
    isPublic: z.boolean().default(true),
});

const agencySchema = z.object({
    name: z.string().min(1, 'Nom requis').max(100),
    description: z.string().max(500).optional(),
    agencyType: z.string().min(1, 'Type requis'),
    isHeadquarters: z.boolean(),
    address: z.object({
        streetLine1: z.string().min(1, 'Adresse requise'),
        neighborhood: z.string().optional(),
        city: z.string().min(1, 'Ville requise'),
        postalCode: z.string().optional(),
        countryCode: z.string().default('CM'),
        landmark: z.string().optional(),
        directions: z.string().optional(),
        latitude: z.coerce.number().optional(),
        longitude: z.coerce.number().optional(),
    }),
    contacts: z.array(contactSchema).optional(),
});

type AgencyFormData = z.infer<typeof agencySchema>;

const AGENCY_TYPES = [
    { value: 'headquarters', label: 'Siège social', icon: '🏛️' },
    { value: 'office', label: 'Bureau', icon: '🏢' },
    { value: 'store', label: 'Boutique', icon: '🏪' },
    { value: 'warehouse', label: 'Entrepôt', icon: '📦' },
    { value: 'factory', label: 'Usine', icon: '🏭' },
    { value: 'other', label: 'Autre', icon: '📍' },
];

export default function BranchesPage() {
    const params = useParams();
    const slug = params.slug as string;
    const queryClient = useQueryClient();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAgency, setEditingAgency] = useState<Agency | null>(null);
    const [expandedAgency, setExpandedAgency] = useState<string | null>(null);
    const [editingHours, setEditingHours] = useState<string | null>(null);
    const [hoursData, setHoursData] = useState<OpeningHour[]>([]);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        control,
        formState: { errors, isSubmitting },
    } = useForm<AgencyFormData>({
        resolver: zodResolver(agencySchema),
        defaultValues: {
            agencyType: 'office',
            isHeadquarters: false,
        },
    });

    // Get organization
    const { data: org } = useQuery({
        queryKey: ['organization', slug],
        queryFn: () => getOrganizationBySlug(slug),
    });

    // Get agencies
    const { data: agencies, isLoading } = useQuery({
        queryKey: ['organization-agencies', org?.id],
        queryFn: () => getAgencies(org!.id),
        enabled: !!org?.id,
    });

    // Get opening hours for expanded agency
    const { data: agencyHours, isLoading: hoursLoading } = useQuery({
        queryKey: ['agency-hours', expandedAgency],
        queryFn: () => getOpeningHours(expandedAgency!),
        enabled: !!expandedAgency,
    });

    // Create agency mutation
    const createMutation = useMutation({
        mutationFn: async (data: CreateAgencyInput) => {
            if (!org?.id) throw new Error('Organization not found');
            return createAgency(org.id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organization-agencies', org?.id] });
            setIsModalOpen(false);
            reset();
            toast.success('Agence créée');
        },
    });

    // Update agency mutation
    const updateMutation = useMutation({
        mutationFn: async ({ agencyId, data }: { agencyId: string; data: Partial<CreateAgencyInput> }) => {
            return updateAgency(agencyId, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organization-agencies', org?.id] });
            setIsModalOpen(false);
            setEditingAgency(null);
            reset();
            toast.success('Agence mise à jour');
        },
    });

    // Delete agency mutation
    const deleteMutation = useMutation({
        mutationFn: deleteAgency,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organization-agencies', org?.id] });
            setDeleteConfirm(null);
            toast.success('Agence supprimée');
        },
    });

    // Set opening hours mutation
    const setHoursMutation = useMutation({
        mutationFn: async ({ agencyId, hours }: { agencyId: string; hours: OpeningHour[] }) => {
            return setOpeningHours(agencyId, hours);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agency-hours', expandedAgency] });
            setEditingHours(null);
            toast.success('Horaires enregistrés');
        },
    });

    const openCreateModal = () => {
        setEditingAgency(null);
        reset({
            agencyType: 'office',
            isHeadquarters: false,
            name: '',
            description: '',
            address: {
                streetLine1: '',
                neighborhood: '',
                city: '',
                countryCode: 'CM',
            },
            contacts: [],
        });
        setIsModalOpen(true);
    };

    const openEditModal = (agency: Agency) => {
        setEditingAgency(agency);
        reset({
            agencyType: agency.agencyType,
            isHeadquarters: agency.isHeadquarters,
            name: agency.name || '',
            description: agency.description || '',
            address: {
                streetLine1: agency.address?.streetLine1 || '',
                neighborhood: agency.address?.neighborhood || '',
                city: agency.address?.city || '',
                postalCode: agency.address?.postalCode || '',
                countryCode: agency.address?.countryCode || 'CM',
                landmark: agency.address?.landmark || '',
                directions: agency.address?.directions || '',
                latitude: agency.address?.latitude,
                longitude: agency.address?.longitude,
            },
            contacts: agency.contacts || [],
        });
        setIsModalOpen(true);
    };

    const onSubmit = async (data: AgencyFormData) => {
        const agencyData: CreateAgencyInput = {
            agencyType: data.agencyType,
            isHeadquarters: data.isHeadquarters,
            name: data.name,
            description: data.description || undefined,
            address: {
                ...data.address,
                addressType: 'office', // Default or derive from agencyType
                isDefault: data.isHeadquarters,
                isPublic: true,
                // Sanitize numbers
                latitude: data.address.latitude ? Number(data.address.latitude) : undefined,
                longitude: data.address.longitude ? Number(data.address.longitude) : undefined,
            },
            contacts: data.contacts?.map(c => ({
                ...c,
                value: c.value || '',
                label: c.label || undefined,
            })) || [],
        };

        if (editingAgency) {
            await updateMutation.mutateAsync({ agencyId: editingAgency.id, data: agencyData });
        } else {
            await createMutation.mutateAsync(agencyData);
        }
    };

    const toggleAgencyExpand = (agencyId: string) => {
        if (expandedAgency === agencyId) {
            setExpandedAgency(null);
            setEditingHours(null);
        } else {
            setExpandedAgency(agencyId);
            setEditingHours(null);
        }
    };

    const startEditingHours = (agency: Agency) => {
        setEditingHours(agency.id);
        setHoursData(agencyHours || []);
    };

    const saveHours = async (agencyId: string) => {
        await setHoursMutation.mutateAsync({ agencyId, hours: hoursData });
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Agences & Adresses</h2>
                    <p className="text-muted-foreground mt-1">
                        Gérez vos différentes adresses et horaires d&apos;ouverture
                    </p>
                </div>
                <Button onClick={openCreateModal}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une agence
                </Button>
            </div>

            {/* Agencies List */}
            {!agencies || agencies.length === 0 ? (
                <EmptyState
                    icon={MapPin}
                    title="Aucune agence"
                    description="Ajoutez des agences pour montrer où vous trouver."
                    action={
                        <Button onClick={openCreateModal}>
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter une agence
                        </Button>
                    }
                />
            ) : (
                <div className="space-y-4">
                    {agencies.map((agency) => {
                        const agencyType = AGENCY_TYPES.find((t) => t.value === agency.agencyType);
                        const isExpanded = expandedAgency === agency.id;

                        return (
                            <div
                                key={agency.id}
                                className={`border rounded-xl bg-card overflow-hidden transition-all ${isExpanded ? 'ring-2 ring-primary' : ''
                                    }`}
                            >
                                {/* Agency Header */}
                                <div
                                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                                    onClick={() => toggleAgencyExpand(agency.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="text-2xl">{agencyType?.icon || '📍'}</div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-medium">
                                                    {agency.name || agencyType?.label || 'Agence'}
                                                </h3>
                                                {agency.isHeadquarters && (
                                                    <Badge className="bg-primary/10 text-primary">Siège</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {agency.address?.neighborhood ? `${agency.address.neighborhood}, ` : ''}
                                                    {agency.address?.city || 'Adresse non définie'}
                                                </span>
                                                {agency.contacts && agency.contacts.length > 0 ? (
                                                    agency.contacts.slice(0, 2).map((contact) => (
                                                        <span key={contact.id} className="flex items-center gap-1" title={contact.value}>
                                                            {contact.contactType === 'email' ? <Mail className="h-3 w-3" /> : <Phone className="h-3 w-3" />}
                                                            <span className="truncate max-w-[150px]">{contact.value}</span>
                                                        </span>
                                                    ))
                                                ) : agency.phoneNumber ? (
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="h-3 w-3" />
                                                        {agency.phoneNumber}
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openEditModal(agency);
                                            }}
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-600"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeleteConfirm(agency.id);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        {isExpanded ? (
                                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                        )}
                                    </div>
                                </div>

                                {/* Expanded Content - Opening Hours */}
                                {isExpanded && (
                                    <div className="border-t bg-muted/20 p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-5 w-5 text-primary" />
                                                <h4 className="font-medium">Horaires d&apos;ouverture</h4>
                                            </div>
                                            {editingHours !== agency.id ? (
                                                <Button variant="outline" size="sm" onClick={() => startEditingHours(agency)}>
                                                    <Edit2 className="h-4 w-4 mr-1" />
                                                    Modifier
                                                </Button>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setEditingHours(null)}
                                                    >
                                                        <X className="h-4 w-4 mr-1" />
                                                        Annuler
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => saveHours(agency.id)}
                                                        disabled={setHoursMutation.isPending}
                                                    >
                                                        <Check className="h-4 w-4 mr-1" />
                                                        Enregistrer
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        {hoursLoading ? (
                                            <div className="space-y-2">
                                                {[...Array(7)].map((_, i) => (
                                                    <Skeleton key={i} className="h-12 w-full" />
                                                ))}
                                            </div>
                                        ) : editingHours === agency.id ? (
                                            <OpeningHoursEditor
                                                hours={hoursData}
                                                onChange={setHoursData}
                                                disabled={setHoursMutation.isPending}
                                            />
                                        ) : (
                                            <div className="grid gap-2">
                                                {agencyHours && agencyHours.length > 0 ? (
                                                    agencyHours.map((hour) => {
                                                        const dayNames = ['', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
                                                        return (
                                                            <div
                                                                key={hour.dayOfWeek}
                                                                className="flex items-center justify-between py-2 px-3 rounded-lg bg-card"
                                                            >
                                                                <span className="font-medium w-16">{dayNames[hour.dayOfWeek]}</span>
                                                                {hour.isClosed ? (
                                                                    <span className="text-red-500">Fermé</span>
                                                                ) : hour.is24h ? (
                                                                    <span className="text-green-500">24h/24</span>
                                                                ) : (
                                                                    <span className="text-muted-foreground">
                                                                        {hour.opensAt} - {hour.closesAt}
                                                                        {hour.opensAt2 && hour.closesAt2 && (
                                                                            <span> | {hour.opensAt2} - {hour.closesAt2}</span>
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <p className="text-muted-foreground text-center py-4">
                                                        Aucun horaire défini. Cliquez sur &quot;Modifier&quot; pour ajouter des horaires.
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Delete Confirm */}
                                {deleteConfirm === agency.id && (
                                    <Modal open onOpenChange={() => setDeleteConfirm(null)}>
                                        <div className="p-6 text-center">
                                            <Trash2 className="h-12 w-12 mx-auto mb-4 text-red-500" />
                                            <h3 className="text-lg font-semibold mb-2">Supprimer cette agence ?</h3>
                                            <p className="text-muted-foreground mb-4">
                                                Cette action supprimera aussi les horaires et contacts associés.
                                            </p>
                                            <div className="flex justify-center gap-2">
                                                <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                                                    Annuler
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    onClick={() => deleteMutation.mutateAsync(agency.id)}
                                                >
                                                    Supprimer
                                                </Button>
                                            </div>
                                        </div>
                                    </Modal>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create/Edit Modal */}
            <Modal open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    <h2 className="text-xl font-semibold">
                        {editingAgency ? 'Modifier l\'agence' : 'Nouvelle agence'}
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {/* Type */}
                        <div className="space-y-2">
                            <Label htmlFor="agencyType">Type</Label>
                            <Select {...register('agencyType')}>
                                {AGENCY_TYPES.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.icon} {type.label}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        {/* Is Headquarters */}
                        <div className="space-y-2 flex items-center justify-between p-3 border rounded-lg">
                            <div>
                                <Label>Siège social</Label>
                                <p className="text-xs text-muted-foreground">Cette adresse est le siège principal</p>
                            </div>
                            <Switch
                                checked={watch('isHeadquarters')}
                                onCheckedChange={(checked) => setValue('isHeadquarters', checked)}
                            />
                        </div>

                        {/* Name */}
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="name">Nom (optionnel)</Label>
                            <Input id="name" placeholder="Ex: Agence Akwa" {...register('name')} />
                        </div>

                        {/* Address Form */}
                        <div className="col-span-2 border-t pt-4 mt-2">
                            <h3 className="font-medium mb-4">Adresse</h3>
                            <OrgAddressForm register={register} errors={errors} setValue={setValue} watch={watch} prefix="address" />
                        </div>

                        {/* Contacts */}
                        <div className="col-span-2 border-t pt-4 mt-2">
                            <h3 className="font-medium mb-4">Contacts</h3>
                            <OrgContactListForm
                                register={register}
                                control={control}
                                errors={errors}
                                name="contacts"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="description">Description (optionnel)</Label>
                            <Textarea
                                id="description"
                                placeholder="Description de cette agence..."
                                rows={3}
                                {...register('description')}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Enregistrement...' : editingAgency ? 'Mettre à jour' : 'Créer'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
