import React from 'react';
import { Mail, Phone, Globe, MessageSquare, Facebook, Instagram, Twitter, Linkedin, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Contact } from '@/lib/api/public';

interface OrgContactListPublicProps {
    contacts: Contact[];
}

export function OrgContactListPublic({ contacts }: OrgContactListPublicProps) {
    if (!contacts || contacts.length === 0) {
        return (
            <div className="p-8 text-center border rounded-xl bg-card text-muted-foreground">
                Aucun contact public disponible.
            </div>
        );
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'email': return <Mail className="h-5 w-5" />;
            case 'phone': return <Phone className="h-5 w-5" />;
            case 'website': return <Globe className="h-5 w-5" />;
            case 'whatsapp': return <MessageSquare className="h-5 w-5" />;
            case 'telegram': return <MessageSquare className="h-5 w-5" />;
            case 'facebook': return <Facebook className="h-5 w-5" />;
            case 'instagram': return <Instagram className="h-5 w-5" />;
            case 'twitter': return <Twitter className="h-5 w-5" />;
            case 'linkedin': return <Linkedin className="h-5 w-5" />;
            default: return <Phone className="h-5 w-5" />;
        }
    };

    const getLabel = (type: string) => {
        switch (type) {
            case 'email': return 'Email';
            case 'phone': return 'Téléphone';
            case 'website': return 'Site Web';
            case 'whatsapp': return 'WhatsApp';
            case 'telegram': return 'Telegram';
            case 'facebook': return 'Facebook';
            case 'instagram': return 'Instagram';
            case 'twitter': return 'Twitter';
            case 'linkedin': return 'LinkedIn';
            default: return 'Contact';
        }
    };

    const getHref = (type: string, value: string) => {
        switch (type) {
            case 'email': return `mailto:${value}`;
            case 'phone': return `tel:${value}`;
            case 'website': return value.startsWith('http') ? value : `https://${value}`;
            case 'whatsapp': return `https://wa.me/${value.replace(/[^0-9]/g, '')}`;
            default: return '#';
        }
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact) => (
                <div key={contact.id} className="p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-primary/10 text-primary">
                            {getIcon(contact.contactType)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-muted-foreground mb-1">
                                {contact.label || getLabel(contact.contactType)}
                            </h4>
                            <div className="font-semibold text-base break-words">
                                {contact.value}
                            </div>
                            {['email', 'phone', 'website', 'whatsapp'].includes(contact.contactType) && (
                                <a
                                    href={getHref(contact.contactType, contact.value)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-2 text-sm text-primary hover:underline"
                                >
                                    {contact.contactType === 'email' ? 'Envoyer un email' :
                                        contact.contactType === 'phone' ? 'Appeler' :
                                            contact.contactType === 'whatsapp' ? 'Ouvrir WhatsApp' : 'Visiter'}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
