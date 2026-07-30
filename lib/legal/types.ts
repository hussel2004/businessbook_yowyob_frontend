import type { Locale } from '@/i18n/config';

export type LegalBlock =
    | { type: 'p'; text: string }
    | { type: 'note'; text: string }
    | { type: 'list'; items: string[] }
    | { type: 'table'; head: string[]; rows: string[][] };

export interface LegalSection {
    /** Ancre stable, partagée entre FR et EN pour que les liens profonds survivent au changement de langue. */
    id: string;
    title: string;
    blocks: LegalBlock[];
}

export interface LegalMetaEntry {
    label: string;
    value: string;
}

/** Point clé affiché dans le résumé, avec renvoi vers la section qui fait foi. */
export interface LegalHighlight {
    title: string;
    text: string;
    /** Id de la section correspondante. */
    sectionId: string;
}

export type LegalSlug = 'terms' | 'privacy' | 'cookies';

export interface LegalDoc {
    slug: LegalSlug;
    /** Code document du package légal, ex. BBK-LEGAL-TOU-ENFR-1.0 */
    code: string;
    version: string;
    status: string;
    effectiveDate: string;
    title: string;
    /** Titre court, pour le fil d'ariane et les cartes de navigation. */
    shortTitle: string;
    subtitle: string;
    /** Une phrase : à quoi sert ce document. */
    purpose: string;
    /** Encadré IMPORTANT en tête de document. */
    important: string;
    /** Ce qu'il faut retenir, avant le texte intégral. */
    highlights: LegalHighlight[];
    /** Chapeau de la partie normative. */
    lead: string;
    sections: LegalSection[];
    annexes: LegalSection[];
    /** Références juridiques citées par le document. */
    references: string[];
    /** Réserve affichée sous les références. */
    referencesNote: string;
    /** Ligne « Évolution » du tableau de contrôle du document. */
    change: string;
    /** Fiche signalétique (statut, version, date, code, éditeur, portée). */
    meta: LegalMetaEntry[];
}

export type LegalDocSet = Record<Locale, LegalDoc>;
