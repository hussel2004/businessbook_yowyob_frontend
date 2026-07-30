import type { Locale } from '@/i18n/config';
import { cookiesDoc } from './cookies';
import { privacyDoc } from './privacy';
import { termsDoc } from './terms';
import type { LegalDoc, LegalDocSet, LegalSlug } from './types';

export * from './types';
export * from './contacts';
export { EXTENSION_CLAUSE, LEGAL_EFFECTIVE_DATE, LEGAL_STATUS, LEGAL_VERSION } from './common';

const DOCS: Record<LegalSlug, LegalDocSet> = {
    terms: termsDoc,
    privacy: privacyDoc,
    cookies: cookiesDoc,
};

/** Renvoie le document légal du package v1.0 pour la locale demandée. */
export function getLegalDoc(slug: LegalSlug, locale: Locale): LegalDoc {
    return DOCS[slug][locale];
}

/** Les trois documents du package, dans l'ordre de publication. */
export function getLegalPackage(locale: Locale): LegalDoc[] {
    return (Object.keys(DOCS) as LegalSlug[]).map((key) => DOCS[key][locale]);
}
