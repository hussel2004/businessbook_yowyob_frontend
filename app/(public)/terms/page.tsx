import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { LegalDocument } from '@/components/features/legal/legal-document';
import { getLegalDoc, getLegalPackage } from '@/lib/legal';
import type { Locale } from '@/i18n/config';

export async function generateMetadata(): Promise<Metadata> {
    const locale = (await getLocale()) as Locale;
    const doc = getLegalDoc('terms', locale);

    return {
        title: `${doc.title} - BusinessBook`,
        description: doc.purpose,
    };
}

export default async function TermsPage() {
    const locale = (await getLocale()) as Locale;

    return <LegalDocument doc={getLegalDoc('terms', locale)} package={getLegalPackage(locale)} />;
}
