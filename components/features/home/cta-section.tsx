'use client';

import Link from 'next/link';
import { Building2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

const benefits = [
    'Visibilité auprès de milliers de clients potentiels',
    'Badge de certification pour gagner la confiance',
    'Outils de gestion des avis et interactions',
    'Analytics détaillés sur votre audience',
];

export function CTASection() {
    return (
        <section className="py-16 md:py-24">
            <div className="container-wrapper">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 p-8 md:p-16">
                    {/* Background patterns */}
                    <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />

                    <div className="relative z-10 max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium mb-6">
                            <Building2 className="h-4 w-4" />
                            Pour les entreprises
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Inscrivez votre entreprise et atteignez de nouveaux clients
                        </h2>

                        <p className="text-lg text-white/80 mb-8">
                            Rejoignez l'annuaire BusinessBook et bénéficiez d'une visibilité accrue
                            auprès de milliers de clients à la recherche de services de qualité.
                        </p>

                        <ul className="grid md:grid-cols-2 gap-3 mb-8">
                            {benefits.map((benefit, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-white/90">
                                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/register"
                                className={cn(
                                    buttonVariants({ size: 'lg' }),
                                    "bg-white text-primary hover:bg-white/90"
                                )}
                            >
                                Inscrire mon entreprise
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                href="/about"
                                className={cn(
                                    buttonVariants({ variant: 'outline', size: 'lg' }),
                                    "bg-transparent border-white/30 text-white hover:bg-white/10"
                                )}
                            >
                                En savoir plus
                            </Link>
                        </div>
                    </div>

                    {/* Decorative Building Icon */}
                    <div className="hidden lg:block absolute right-12 bottom-0 opacity-20">
                        <Building2 className="w-64 h-64 text-white" />
                    </div>
                </div>
            </div>
        </section>
    );
}
