import { Metadata } from 'next';
import { PublicHeader } from '@/components/layout/headers/public-header';
import { PublicFooter } from '@/components/layout/footers/public-footer';
import {
    HeroSection,
    CategoriesSection,
    PromotionsSection,
    StatsSection,
    BenchmarkSection,
    CTASection,
} from '@/components/features/home';

import { LocationPermissionModal } from '@/components/features/location/location-permission-modal';

export const metadata: Metadata = {
    title: 'BusinessBook - L\'annuaire des entreprises africaines certifiées',
    description: 'Découvrez, vérifiez et contactez des entreprises camerounaises de confiance. Trouvez des restaurants, hôtels, banques, et plus encore.',
    keywords: ['annuaire', 'entreprises', 'Cameroun', 'Afrique', 'certifié', 'avis'],
    openGraph: {
        title: 'BusinessBook - L\'annuaire des entreprises africaines certifiées',
        description: 'Découvrez, vérifiez et contactez des entreprises camerounaises de confiance.',
        type: 'website',
    },
};

export default function HomePage() {
    return (
        <div className="flex min-h-screen flex-col">
<LocationPermissionModal />
            <PublicHeader />
            <main className="flex-1">
                <HeroSection />
                <CategoriesSection />
                <PromotionsSection />
                <StatsSection />
                <BenchmarkSection />
                <CTASection />
            </main>
            <PublicFooter />
        </div>
    );
}
