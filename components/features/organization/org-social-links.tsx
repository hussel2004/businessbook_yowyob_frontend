'use client';

import {
    Facebook,
    Instagram,
    Linkedin,
    Twitter,
    Youtube,
    MessageCircle,
    ExternalLink
} from 'lucide-react';

interface SocialContact {
    id: string;
    contactType: string;
    value: string;
    label?: string;
}

interface OrgSocialLinksProps {
    contacts: SocialContact[];
    className?: string;
}

const socialIcons: Record<string, React.ElementType> = {
    facebook: Facebook,
    instagram: Instagram,
    linkedin: Linkedin,
    twitter: Twitter,
    youtube: Youtube,
    whatsapp: MessageCircle,
    telegram: MessageCircle,
    tiktok: ExternalLink,
    other: ExternalLink,
};

const socialColors: Record<string, string> = {
    facebook: 'hover:text-[#1877F2] hover:bg-[#1877F2]/10',
    instagram: 'hover:text-[#E4405F] hover:bg-[#E4405F]/10',
    linkedin: 'hover:text-[#0A66C2] hover:bg-[#0A66C2]/10',
    twitter: 'hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10',
    youtube: 'hover:text-[#FF0000] hover:bg-[#FF0000]/10',
    whatsapp: 'hover:text-[#25D366] hover:bg-[#25D366]/10',
    telegram: 'hover:text-[#0088cc] hover:bg-[#0088cc]/10',
    tiktok: 'hover:text-foreground hover:bg-muted',
    other: 'hover:text-primary hover:bg-primary/10',
};

function getSocialUrl(contact: SocialContact): string {
    const value = contact.value;
    switch (contact.contactType) {
        case 'facebook':
            return value.startsWith('http') ? value : `https://facebook.com/${value}`;
        case 'instagram':
            return value.startsWith('http') ? value : `https://instagram.com/${value}`;
        case 'linkedin':
            return value.startsWith('http') ? value : `https://linkedin.com/company/${value}`;
        case 'twitter':
            return value.startsWith('http') ? value : `https://twitter.com/${value}`;
        case 'youtube':
            return value.startsWith('http') ? value : `https://youtube.com/${value}`;
        case 'whatsapp':
            return `https://wa.me/${value.replace(/\D/g, '')}`;
        case 'telegram':
            return value.startsWith('http') ? value : `https://t.me/${value}`;
        case 'tiktok':
            return value.startsWith('http') ? value : `https://tiktok.com/@${value}`;
        default:
            return value.startsWith('http') ? value : `https://${value}`;
    }
}

export function OrgSocialLinks({ contacts, className }: OrgSocialLinksProps) {
    const socialContacts = contacts.filter(c =>
        ['facebook', 'instagram', 'linkedin', 'twitter', 'youtube', 'whatsapp', 'telegram', 'tiktok'].includes(c.contactType)
    );

    if (socialContacts.length === 0) return null;

    return (
        <div className={className}>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Réseaux sociaux</h4>
            <div className="flex flex-wrap gap-2">
                {socialContacts.map((contact) => {
                    const Icon = socialIcons[contact.contactType] || ExternalLink;
                    const colorClass = socialColors[contact.contactType] || socialColors.other;

                    return (
                        <a
                            key={contact.id}
                            href={getSocialUrl(contact)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-2.5 rounded-full bg-muted text-muted-foreground transition-colors ${colorClass}`}
                            title={contact.label || contact.contactType.charAt(0).toUpperCase() + contact.contactType.slice(1)}
                        >
                            <Icon className="h-5 w-5" />
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
