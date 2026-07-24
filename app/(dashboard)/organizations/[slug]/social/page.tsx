'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { getOrganizationBySlug } from '@/lib/api/public';
import { get, post, put, del } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Facebook,
    Instagram,
    Linkedin,
    Twitter,
    Youtube,
    MessageCircle,
    Plus,
    Trash2,
    ExternalLink,
    Edit2,
    Check,
    X
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SocialContact {
    id: string;
    contactType: string;
    label?: string;
    value: string;
    isPrimary: boolean;
    isPublic: boolean;
}

const socialPlatforms = [
    { type: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'facebook.com/votre-page' },
    { type: 'instagram', label: 'Instagram', icon: Instagram, placeholder: '@votre_compte' },
    { type: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'linkedin.com/company/...' },
    { type: 'twitter', label: 'Twitter / X', icon: Twitter, placeholder: '@votre_compte' },
    { type: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'youtube.com/c/...' },
    { type: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, placeholder: '+237 6XX XXX XXX' },
    { type: 'telegram', label: 'Telegram', icon: MessageCircle, placeholder: '@votre_canal ou +237...' },
    { type: 'tiktok', label: 'TikTok', icon: ExternalLink, placeholder: '@votre_compte' },
];

export default function SocialLinksPage() {
    const params = useParams();
    const slug = params.slug as string;
    const queryClient = useQueryClient();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const [newPlatform, setNewPlatform] = useState<string | null>(null);
    const [newValue, setNewValue] = useState('');

    // Fetch organization
    const { data: org } = useQuery({
        queryKey: ['organization', slug],
        queryFn: () => getOrganizationBySlug(slug),
    });

    // Fetch contacts
    const { data: contacts = [], isLoading } = useQuery({
        queryKey: ['organization', org?.id, 'contacts'],
        queryFn: () => get<SocialContact[]>(ENDPOINTS.ORGANIZATIONS.CONTACTS(org?.id || '')),
        enabled: !!org?.id,
    });

    // Filter social contacts
    const socialContacts = contacts.filter(c =>
        socialPlatforms.some(p => p.type === c.contactType)
    );

    // Get platforms not yet added
    const availablePlatforms = socialPlatforms.filter(
        p => !socialContacts.some(c => c.contactType === p.type)
    );

    // Create contact mutation
    const createMutation = useMutation({
        mutationFn: async ({ contactType, value }: { contactType: string; value: string }) => {
            return post(ENDPOINTS.ORGANIZATIONS.CONTACTS(org?.id || ''), {
                contactType,
                value,
                label: socialPlatforms.find(p => p.type === contactType)?.label,
                isPrimary: false,
                isPublic: true,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organization', org?.id, 'contacts'] });
            toast.success('Lien ajouté');
            setNewPlatform(null);
            setNewValue('');
        },
        onError: () => toast.error("Erreur lors de l'ajout"),
    });

    // Update contact mutation
    const updateMutation = useMutation({
        mutationFn: async ({ id, value }: { id: string; value: string }) => {
            return put(ENDPOINTS.CONTACTS.BY_ID(id), { value });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organization', org?.id, 'contacts'] });
            toast.success('Lien mis à jour');
            setEditingId(null);
        },
        onError: () => toast.error('Erreur lors de la mise à jour'),
    });

    // Delete contact mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return del(ENDPOINTS.CONTACTS.BY_ID(id));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organization', org?.id, 'contacts'] });
            toast.success('Lien supprimé');
        },
        onError: () => toast.error('Erreur lors de la suppression'),
    });

    const handleAdd = () => {
        if (newPlatform && newValue.trim()) {
            createMutation.mutate({ contactType: newPlatform, value: newValue.trim() });
        }
    };

    const handleUpdate = (id: string) => {
        if (editValue.trim()) {
            updateMutation.mutate({ id, value: editValue.trim() });
        }
    };

    const startEdit = (contact: SocialContact) => {
        setEditingId(contact.id);
        setEditValue(contact.value);
    };

    if (isLoading) {
        return <div className="p-6">Chargement...</div>;
    }

    return (
        <div className="max-w-2xl">
            <h2 className="text-xl font-semibold mb-2">Réseaux sociaux</h2>
            <p className="text-muted-foreground mb-6">
                Gérez vos liens vers les réseaux sociaux. Ces informations seront visibles sur votre page publique.
            </p>

            {/* Existing social links */}
            <div className="space-y-3 mb-6">
                {socialContacts.map((contact) => {
                    const platform = socialPlatforms.find(p => p.type === contact.contactType);
                    const Icon = platform?.icon || ExternalLink;
                    const isEditing = editingId === contact.id;

                    return (
                        <div
                            key={contact.id}
                            className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                        >
                            <div className="p-2 rounded-full bg-muted">
                                <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">{platform?.label || contact.contactType}</p>
                                {isEditing ? (
                                    <div className="flex items-center gap-2 mt-1">
                                        <Input
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="h-8 text-sm"
                                            autoFocus
                                        />
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8"
                                            onClick={() => handleUpdate(contact.id)}
                                            disabled={updateMutation.isPending}
                                        >
                                            <Check className="h-4 w-4 text-green-600" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8"
                                            onClick={() => setEditingId(null)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">{contact.value}</p>
                                )}
                            </div>
                            {!isEditing && (
                                <div className="flex items-center gap-1">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8"
                                        onClick={() => startEdit(contact)}
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                        onClick={() => deleteMutation.mutate(contact.id)}
                                        disabled={deleteMutation.isPending}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    );
                })}

                {socialContacts.length === 0 && !newPlatform && (
                    <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                        <p>Aucun lien de réseau social ajouté.</p>
                        <p className="text-sm">Cliquez sur "Ajouter" pour commencer.</p>
                    </div>
                )}
            </div>

            {/* Add new social link */}
            {newPlatform ? (
                <div className="p-4 rounded-lg border bg-muted/50 space-y-3">
                    <div className="flex items-center justify-between">
                        <Label>{socialPlatforms.find(p => p.type === newPlatform)?.label}</Label>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setNewPlatform(null);
                                setNewValue('');
                            }}
                        >
                            Annuler
                        </Button>
                    </div>
                    <Input
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        placeholder={socialPlatforms.find(p => p.type === newPlatform)?.placeholder}
                    />
                    <Button
                        onClick={handleAdd}
                        disabled={!newValue.trim() || createMutation.isPending}
                    >
                        {createMutation.isPending ? 'Ajout...' : 'Ajouter'}
                    </Button>
                </div>
            ) : availablePlatforms.length > 0 ? (
                <div className="space-y-3">
                    <Label>Ajouter un réseau social</Label>
                    <div className="flex flex-wrap gap-2">
                        {availablePlatforms.map((platform) => {
                            const Icon = platform.icon;
                            return (
                                <Button
                                    key={platform.type}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setNewPlatform(platform.type)}
                                    className="gap-2"
                                >
                                    <Icon className="h-4 w-4" />
                                    {platform.label}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
