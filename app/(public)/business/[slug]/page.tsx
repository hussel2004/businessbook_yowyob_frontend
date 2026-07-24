import { Metadata } from 'next';
import { getOrganizationBySlug } from '@/lib/api/public';
import BusinessPageClient from '@/app/(public)/business/[slug]/client';

interface Props {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const org = await getOrganizationBySlug(params.slug);

        const title = `${org.longName} - BusinessBook Cameroun`;
        const description = org.shortDescription || org.description?.slice(0, 160) || `Découvrez ${org.longName} sur BusinessBook Cameroun.`;
        const images = org.coverImageUrl ? [org.coverImageUrl] : undefined;

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                images,
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                images,
            },
        };
    } catch (error) {
        return {
            title: 'Entreprise - BusinessBook Cameroun',
            description: 'Annuaire des entreprises camerounaises.',
        };
    }
}

export default function BusinessPage({ params }: Props) {
    return <BusinessPageClient params={params} />;
}
