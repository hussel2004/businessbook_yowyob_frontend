import type { Locale } from '@/i18n/config';
import type { LegalMetaEntry } from './types';

/**
 * Éléments communs aux trois documents du package
 * BusinessBook_Legal_Package_EN-FR_Published-Beta_v1.0.
 */

export const LEGAL_VERSION = '1.0';

export const LEGAL_EFFECTIVE_DATE: Record<Locale, string> = {
    fr: '25 juillet 2026',
    en: '25 July 2026',
};

export const LEGAL_STATUS: Record<Locale, string> = {
    fr: 'Bêta publiée',
    en: 'Published Beta',
};

export const LEGAL_IMPORTANT: Record<Locale, string> = {
    fr: 'Ce document régit une version bêta publiée susceptible d’évoluer. Il doit être lu avec les informations affichées sur une fiche, une offre, un formulaire, un abonnement, une campagne, une interface professionnelle ou un accord particulier.',
    en: 'This document governs a published beta that may evolve. It must be read together with information shown in a listing, offer, form, subscription, campaign, professional interface or specific agreement.',
};

/** Clause d’extension : ce que couvre le document au-delà des pages listées. */
export const EXTENSION_CLAUSE: Record<Locale, string> = {
    fr: 'Le document couvre aussi les PWA, applications mobiles, interfaces professionnelles et administratives, pages de fiches ou campagnes, widgets, cartes, QR codes, imports, exports, API, SDK, notifications et futures fonctionnalités BusinessBook ou Yowyob qui y renvoient.',
    en: 'The document also covers PWAs, mobile apps, professional and administrative interfaces, listing or campaign pages, widgets, maps, QR codes, imports, exports, APIs, SDKs, notifications and future BusinessBook or Yowyob features that link to it.',
};

export const LEGAL_REFERENCES: Record<Locale, string[]> = {
    fr: [
        'Loi n° 2024/017 du 23 décembre 2024 relative à la protection des données à caractère personnel au Cameroun et textes d’application applicables.',
        'Loi n° 2010/021 du 21 décembre 2010 régissant le commerce électronique au Cameroun et décret n° 2011/1521/PM du 15 juin 2011.',
        'Loi n° 2010/012 du 21 décembre 2010 relative à la cybersécurité et à la cybercriminalité, telle que modifiée ou remplacée.',
        'Loi n° 2011/012 du 6 mai 2011 portant protection du consommateur au Cameroun, selon son champ d’application.',
        'Actes uniformes OHADA applicables et règles camerounaises relatives aux obligations, sociétés, concurrence, publicité, preuve, fiscalité et propriété intellectuelle.',
        'Règles territoriales ou sectorielles applicables à l’entreprise inscrite, notamment licences, autorisations, professions réglementées, santé, finance, tourisme, transport, commerce et communications électroniques.',
    ],
    en: [
        'Law No. 2024/017 of 23 December 2024 relating to personal data protection in Cameroon and applicable implementing instruments.',
        'Law No. 2010/021 of 21 December 2010 governing electronic commerce in Cameroon and Decree No. 2011/1521/PM of 15 June 2011.',
        'Law No. 2010/012 of 21 December 2010 on cybersecurity and cybercrime, as amended or replaced.',
        'Law No. 2011/012 of 6 May 2011 on consumer protection in Cameroon, within its applicable scope.',
        'Applicable OHADA Uniform Acts and Cameroonian rules on obligations, companies, competition, advertising, evidence, taxation and intellectual property.',
        'Territorial or sector-specific rules applicable to the listed business, including licences, permits, regulated professions, health, finance, tourism, transport, trade and electronic communications.',
    ],
};

/** Réserve la plus importante du package : un badge ne vaut pas agrément. */
export const REFERENCES_NOTE: Record<Locale, string> = {
    fr: 'Une inscription ou un badge BusinessBook ne remplace jamais une licence, un agrément, une autorisation, une assurance, un contrôle professionnel ou un audit réglementaire exigé de l’entreprise.',
    en: 'A BusinessBook listing or badge never replaces a licence, accreditation, permit, insurance, professional control or regulatory audit required of the business.',
};

export function buildMeta(locale: Locale, code: string): LegalMetaEntry[] {
    if (locale === 'en') {
        return [
            { label: 'Status', value: LEGAL_STATUS.en },
            { label: 'Version', value: LEGAL_VERSION },
            { label: 'Effective date', value: LEGAL_EFFECTIVE_DATE.en },
            { label: 'Document code', value: code },
            { label: 'Publisher', value: 'Yowyob Inc. Ltd' },
            { label: 'Scope', value: 'BusinessBook and associated services' },
        ];
    }
    return [
        { label: 'Statut', value: LEGAL_STATUS.fr },
        { label: 'Version', value: LEGAL_VERSION },
        { label: 'Entrée en vigueur', value: LEGAL_EFFECTIVE_DATE.fr },
        { label: 'Code document', value: code },
        { label: 'Éditeur', value: 'Yowyob Inc. Ltd' },
        { label: 'Portée', value: 'BusinessBook et services associés' },
    ];
}
