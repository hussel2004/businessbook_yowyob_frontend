'use client';

import { Phone, Mail, Globe, MapPin, MessageSquare } from 'lucide-react';
import type { Contact } from '@/lib/api/public';

interface OrgContactListProps {
    contacts: Contact[];
    address?: {
        streetLine1?: string;
        streetLine2?: string;
        neighborhood?: string;
        city?: string;
        postalCode?: string;
        countryCode?: string;
    };
}

export function OrgContactList({ contacts, address }: OrgContactListProps) {
    // Filter out social media (handled by OrgSocialLinks)
    const directContacts = contacts.filter(c =>
        ['phone', 'email', 'website'].includes(c.contactType)
    );

    if (directContacts.length === 0 && !address) return null;

    return (
        <div className="grid gap-6 md:grid-cols-2 mb-8">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Coordonnées</h3>
                <div className="space-y-3">
                    {address && (
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                                <p className="font-medium">Adresse</p>
                                <p className="text-muted-foreground">
                                    {[
                                        address.streetLine1,
                                        address.streetLine2,
                                        address.neighborhood,
                                        address.city && address.postalCode ? `${address.city}, ${address.postalCode}` : address.city,
                                        address.countryCode
                                    ].filter(Boolean).join(', ')}
                                </p>
                            </div>
                        </div>
                    )}

                    {directContacts.map((contact) => (
                        <div key={contact.id} className="flex items-start gap-3">
                            {contact.contactType === 'phone' && <Phone className="h-5 w-5 text-primary mt-0.5" />}
                            {contact.contactType === 'email' && <Mail className="h-5 w-5 text-primary mt-0.5" />}
                            {contact.contactType === 'website' && <Globe className="h-5 w-5 text-primary mt-0.5" />}

                            <div>
                                <p className="font-medium">
                                    {contact.label || (
                                        contact.contactType === 'phone' ? 'Téléphone' :
                                            contact.contactType === 'email' ? 'Email' : 'Site Web'
                                    )}
                                </p>
                                {contact.contactType === 'website' ? (
                                    <a
                                        href={contact.value.startsWith('http') ? contact.value : `https://${contact.value}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        {contact.value}
                                    </a>
                                ) : (
                                    <p className="text-muted-foreground">
                                        {contact.contactType === 'phone' ? (
                                            <a href={`tel:${contact.value}`} className="hover:text-primary transition-colors">
                                                {contact.value}
                                            </a>
                                        ) : contact.contactType === 'email' ? (
                                            <a href={`mailto:${contact.value}`} className="hover:text-primary transition-colors">
                                                {contact.value}
                                            </a>
                                        ) : contact.value}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
