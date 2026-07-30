import type { Locale } from '@/i18n/config';

/**
 * Identité de l'éditeur et canaux de contact officiels, tels que publiés dans le
 * package légal BusinessBook v1.0. Source unique consommée par le pied de page,
 * la page contact et les pages juridiques — ne pas dupliquer ailleurs.
 */

export const COMPANY = {
    name: 'Yowyob Inc. Ltd',
    rccm: 'RC/YAO/2020/B/1614',
    taxId: 'M102015282478U',
    capital: { fr: '1 000 000 FCFA', en: 'XAF 1,000,000' },
    form: {
        fr: 'Société à responsabilité limitée de droit camerounais',
        en: 'Limited liability company incorporated under Cameroonian law',
    },
    address: {
        street: 'Carrefour Anguissa, S/C Yaoundé 1er, Rue 1.121 Djoungolo',
        city: 'Yaoundé',
        country: { fr: 'Cameroun', en: 'Cameroon' },
    },
} as const;

export const COMPANY_ADDRESS_LINE = `${COMPANY.address.street}, ${COMPANY.address.city}`;

export type ContactPurpose = 'general' | 'legal' | 'privacy' | 'support';

export interface ContactChannel {
    purpose: ContactPurpose;
    email: string;
    /** Adresse Yowyob de repli lorsque le canal BusinessBook n'existe pas. */
    fallbackEmail?: string;
    label: Record<Locale, string>;
    description: Record<Locale, string>;
}

export const CONTACT_CHANNELS: ContactChannel[] = [
    {
        purpose: 'general',
        email: 'contact@businessbook.cm',
        label: { fr: 'Informations générales', en: 'General information' },
        description: {
            fr: 'Questions sur l’annuaire, une fiche, une catégorie ou un partenariat.',
            en: 'Questions about the directory, a listing, a category or a partnership.',
        },
    },
    {
        purpose: 'legal',
        email: 'legal@businessbook.cm',
        fallbackEmail: 'legal@yowyob.com',
        label: { fr: 'Juridique', en: 'Legal' },
        description: {
            fr: 'Conditions, signalements de contenu, revendications contestées et droits des tiers.',
            en: 'Terms, content reports, disputed claims and third-party rights.',
        },
    },
    {
        purpose: 'privacy',
        email: 'privacy@businessbook.cm',
        fallbackEmail: 'privacy@yowyob.com',
        label: { fr: 'Vie privée', en: 'Privacy' },
        description: {
            fr: 'Accès, rectification, effacement, opposition et autres droits sur vos données.',
            en: 'Access, rectification, erasure, objection and other rights over your data.',
        },
    },
    {
        purpose: 'support',
        email: 'support@yowyob.com',
        label: { fr: 'Support et sécurité', en: 'Support and security' },
        description: {
            fr: 'Incident technique, compte compromis, session ou document suspect.',
            en: 'Technical incident, compromised account, suspicious session or document.',
        },
    },
];

export function getContactChannel(purpose: ContactPurpose): ContactChannel {
    return CONTACT_CHANNELS.find((channel) => channel.purpose === purpose)!;
}

export const PHONE_NUMBERS = [
    { display: '+237 675 518 880', href: 'tel:+237675518880' },
    { display: '+237 656 168 129', href: 'tel:+237656168129' },
] as const;

export const SOCIAL_LINKS = [
    { name: 'Facebook', href: 'https://www.facebook.com/YowyobInc' },
    { name: 'X', href: 'https://twitter.com/yowyob' },
    { name: 'Instagram', href: 'https://www.instagram.com/yowyob' },
] as const;

/**
 * Plateformes listées dans le « périmètre » du package légal, ramenées aux
 * routes réelles de l'application plutôt qu'aux URL absolues du document.
 */
export interface PlatformEntry {
    href: string;
    external?: boolean;
    label: Record<Locale, string>;
    description: Record<Locale, string>;
}

export const PLATFORM_SCOPE: PlatformEntry[] = [
    {
        href: '/',
        label: { fr: 'Portail BusinessBook', en: 'BusinessBook portal' },
        description: {
            fr: 'Annuaire public, recherche, catégories, fiches, avis et mise en relation.',
            en: 'Public directory, search, categories, listings, reviews and connections.',
        },
    },
    {
        href: '/search',
        label: { fr: 'Recherche et catégories', en: 'Search and categories' },
        description: {
            fr: 'Recherche par nom, service, secteur et localisation.',
            en: 'Search by name, service, sector and location.',
        },
    },
    {
        href: '/register',
        label: { fr: 'Espace d’inscription', en: 'Registration area' },
        description: {
            fr: 'Comptes visiteurs et professionnels.',
            en: 'Visitor and professional accounts.',
        },
    },
    {
        href: '/promotions',
        label: { fr: 'Promotions', en: 'Promotions' },
        description: {
            fr: 'Offres, campagnes, contenus sponsorisés et mise en avant.',
            en: 'Offers, campaigns, sponsored content and visibility boosts.',
        },
    },
    {
        href: '/dashboard',
        label: {
            fr: 'Interfaces professionnelles et administratives',
            en: 'Professional and administrative interfaces',
        },
        description: {
            fr: 'Gestion des fiches, revendications, vérification, avis, statistiques et modération.',
            en: 'Listing management, claims, verification, reviews, analytics and moderation.',
        },
    },
];
