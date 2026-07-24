import { Metadata } from 'next';
import { getOrganizationAgencies, getOrganizationBySlug } from '@/lib/api/public';
import BranchPageClient from './client';
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

export default async function BranchPage({ params }: PageProps) {
    return <BranchPageClient slug={params.slug} />;
}
