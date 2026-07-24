import { Metadata } from 'next';
import { getOrganizationBySlug } from '@/lib/api/public';
import AgencyPageClient from './client';
import { notFound } from 'next/navigation';

interface PageProps {
    params: { slug: string };
}

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: `Agence | BusinessBook`,
        description: `Détails de l'agence`,
    };
}

export default async function AgencyPage({ params }: PageProps) {
    return <AgencyPageClient slug={params.slug} />;
}
