'use client';

import { Building2, Users, Star, BadgeCheck } from 'lucide-react';

interface StatItem {
    icon: React.ReactNode;
    value: string;
    label: string;
    color: string;
}

const stats: StatItem[] = [
    {
        icon: <Building2 className="h-6 w-6" />,
        value: '5,000+',
        label: 'Entreprises enregistrées',
        color: 'text-primary',
    },
    {
        icon: <BadgeCheck className="h-6 w-6" />,
        value: '1,000+',
        label: 'Entreprises certifiées',
        color: 'text-emerald-600 dark:text-emerald-400',
    },
    {
        icon: <Star className="h-6 w-6" />,
        value: '25,000+',
        label: 'Avis vérifiés',
        color: 'text-yellow-600 dark:text-yellow-400',
    },
    {
        icon: <Users className="h-6 w-6" />,
        value: '50,000+',
        label: 'Utilisateurs actifs',
        color: 'text-secondary',
    },
];

export function StatsSection() {
    return (
        <section className="py-16 md:py-24 bg-muted/30">
            <div className="container-wrapper">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                        La confiance en chiffres
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        BusinessBook est la plateforme de référence pour découvrir et connecter
                        avec des entreprises africaines de confiance
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, idx) => (
                        <div
                            key={idx}
                            className="text-center p-6 rounded-xl bg-card border hover:shadow-soft transition-all"
                        >
                            <div className={`inline-flex p-3 rounded-xl bg-muted mb-4 ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <div className={`text-3xl md:text-4xl font-bold mb-1 ${stat.color}`}>
                                {stat.value}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
