import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { LegalDocument } from '@/components/features/legal/legal-document';
import { getLegalDoc, getLegalPackage } from '@/lib/legal';
import type { Locale } from '@/i18n/config';

export async function generateMetadata(): Promise<Metadata> {
    const locale = (await getLocale()) as Locale;
    const doc = getLegalDoc('privacy', locale);

    return {
        title: `${doc.title} - BusinessBook`,
        description: doc.purpose,
    };
}

export default async function PrivacyPage() {
    const locale = (await getLocale()) as Locale;

    return <LegalDocument doc={getLegalDoc('privacy', locale)} package={getLegalPackage(locale)} />;
}
