import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Building2, Users, Shield, Globe, ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button-variants';

export const metadata: Metadata = {
    title: 'À propos - BusinessBook',
    description: 'Découvrez BusinessBook, l\'annuaire des entreprises africaines certifiées. Notre mission est de connecter les entreprises avec leurs clients.',
};

const values = [
    {
        icon: Shield,
        title: 'Confiance',
        description: 'Nous vérifions chaque entreprise pour garantir l\'authenticité des informations.',
    },
    {
        icon: Globe,
        title: 'Accessibilité',
        description: 'Une plateforme accessible à tous, partout au Cameroun et en Afrique.',
    },
    {
        icon: Users,
        title: 'Communauté',
        description: 'Nous créons des liens durables entre entreprises et clients.',
    },
    {
        icon: Building2,
        title: 'Croissance',
        description: 'Nous aidons les entreprises à développer leur visibilité et leur clientèle.',
    },
];

export default function AboutPage() {
    return (
        <div className="py-12">
            <div className="container-wrapper">
                {/* Hero */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        À propos de <span className="text-gradient-primary">BusinessBook</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        BusinessBook est l'annuaire de référence pour découvrir et connecter
                        avec des entreprises africaines de confiance. Notre mission est de
                        faciliter la mise en relation entre les entreprises et leurs clients potentiels.
                    </p>
                </div>

                {/* Mission */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Notre Mission</h2>
                        <p className="text-muted-foreground mb-4">
                            Nous croyons que chaque entreprise mérite d'être découverte.
                            BusinessBook a été créé pour donner de la visibilité aux
                            entreprises camerounaises et africaines, qu'elles soient grandes ou petites.
                        </p>
                        <p className="text-muted-foreground mb-6">
                            Grâce à notre système de vérification et aux avis authentiques de
                            nos utilisateurs, nous aidons les consommateurs à trouver des
                            entreprises de confiance pour leurs besoins.
                        </p>
                        <Link
                            href="/register"
                            className={buttonVariants()}
                        >
                            Rejoindre BusinessBook
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>
                    <div className="relative h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Building2 className="h-32 w-32 text-primary/30" />
                        </div>
                    </div>
                </div>

                {/* Values */}
                <div className="mb-20">
                    <h2 className="text-2xl font-bold text-center mb-10">Nos Valeurs</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, idx) => (
                            <div key={idx} className="p-6 rounded-xl border bg-card text-center">
                                <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4">
                                    <value.icon className="h-6 w-6" />
                                </div>
                                <h3 className="font-semibold mb-2">{value.title}</h3>
                                <p className="text-sm text-muted-foreground">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="bg-muted/30 rounded-2xl p-8 md:p-12 text-center">
                    <h2 className="text-2xl font-bold mb-8">BusinessBook en chiffres</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-primary mb-1">5,000+</div>
                            <div className="text-muted-foreground">Entreprises</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-secondary mb-1">50,000+</div>
                            <div className="text-muted-foreground">Utilisateurs</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-primary mb-1">12</div>
                            <div className="text-muted-foreground">Catégories</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-secondary mb-1">10</div>
                            <div className="text-muted-foreground">Villes</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
