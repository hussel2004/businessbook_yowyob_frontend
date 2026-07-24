import Link from 'next/link';
import { Logo } from '@/components/layout/logo';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export function PublicFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-muted/50 border-t pt-16 pb-8">
            <div className="container-wrapper">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand & Inteoduction */}
                    <div className="md:col-span-1">
                        <Logo className="mb-4" />
                        <p className="text-sm text-foreground-muted mb-6">
                            La plateforme de référence pour trouver les meilleures entreprises et services au Cameroun.
                            Vérifiées, notées et approuvées par la communauté.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-foreground-muted hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-foreground-muted hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-foreground-muted hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-foreground-muted hover:text-primary transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Navigation</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="text-foreground-muted hover:text-primary">
                                    Accueil
                                </Link>
                            </li>
                            <li>
                                <Link href="/search" className="text-foreground-muted hover:text-primary">
                                    Rechercher
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories" className="text-foreground-muted hover:text-primary">
                                    Toutes les catégories
                                </Link>
                            </li>
                            <li>
                                <Link href="/promotions" className="text-foreground-muted hover:text-primary">
                                    Promotions
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Légal</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/terms" className="text-foreground-muted hover:text-primary">
                                    Conditions d'utilisation
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-foreground-muted hover:text-primary">
                                    Politique de confidentialité
                                </Link>
                            </li>
                            <li>
                                <Link href="/cookies" className="text-foreground-muted hover:text-primary">
                                    Gestion des cookies
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold mb-4">Contact</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-primary shrink-0" />
                                <span className="text-foreground-muted">Akwa, Douala, Cameroun</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-primary shrink-0" />
                                <span className="text-foreground-muted">+237 6XX XX XX XX</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-primary shrink-0" />
                                <span className="text-foreground-muted">contact@businessbook.cm</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t pt-8 text-center text-sm text-foreground-muted">
                    <p>&copy; {currentYear} YowYob Inc. Ltd. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
}
