import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Logo } from '@/components/layout/logo';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export function PublicFooter() {
    const currentYear = new Date().getFullYear();
    const t = useTranslations('footer');

    return (
        <footer className="bg-muted/50 border-t pt-16 pb-8">
            <div className="container-wrapper">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand & Introduction */}
                    <div className="md:col-span-1">
                        <Logo className="mb-4" />
                        <p className="text-sm text-foreground-muted mb-6">
                            {t('tagline')}
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
                        <h3 className="font-semibold mb-4">{t('navigation')}</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="text-foreground-muted hover:text-primary">
                                    {t('home')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/search" className="text-foreground-muted hover:text-primary">
                                    {t('searchLink')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories" className="text-foreground-muted hover:text-primary">
                                    {t('allCategories')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/promotions" className="text-foreground-muted hover:text-primary">
                                    {t('promotions')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="font-semibold mb-4">{t('legal')}</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/terms" className="text-foreground-muted hover:text-primary">
                                    {t('terms')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-foreground-muted hover:text-primary">
                                    {t('privacy')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/cookies" className="text-foreground-muted hover:text-primary">
                                    {t('cookies')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold mb-4">{t('contact')}</h3>
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
                    <p>&copy; {currentYear} YowYob Inc. Ltd. {t('rights')}</p>
                </div>
            </div>
        </footer>
    );
}
