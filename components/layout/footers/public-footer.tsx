import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Logo } from '@/components/layout/logo';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import { COMPANY, COMPANY_ADDRESS_LINE, getContactChannel, PHONE_NUMBERS, SOCIAL_LINKS } from '@/lib/legal';

const SOCIAL_ICONS = {
    Facebook,
    X: Twitter,
    Instagram,
} as const;

export function PublicFooter() {
    const currentYear = new Date().getFullYear();
    const t = useTranslations('footer');
    const locale = useLocale() as Locale;
    const generalContact = getContactChannel('general');

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
                            {SOCIAL_LINKS.map((social) => {
                                const Icon = SOCIAL_ICONS[social.name];
                                return (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.name}
                                        className="text-foreground-muted hover:text-primary transition-colors"
                                    >
                                        <Icon className="h-5 w-5" />
                                    </a>
                                );
                            })}
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
                                <span className="text-foreground-muted">
                                    {COMPANY_ADDRESS_LINE}, {COMPANY.address.country[locale]}
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone className="h-5 w-5 text-primary shrink-0" />
                                <span className="flex flex-col">
                                    {PHONE_NUMBERS.map((phone) => (
                                        <a
                                            key={phone.href}
                                            href={phone.href}
                                            className="text-foreground-muted hover:text-primary transition-colors"
                                        >
                                            {phone.display}
                                        </a>
                                    ))}
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-primary shrink-0" />
                                <a
                                    href={`mailto:${generalContact.email}`}
                                    className="text-foreground-muted hover:text-primary transition-colors"
                                >
                                    {generalContact.email}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t pt-8 text-center text-sm text-foreground-muted">
                    <p>&copy; {currentYear} {COMPANY.name}. {t('rights')}</p>
                    <p className="mt-1 text-xs">
                        RCCM {COMPANY.rccm} · NIU {COMPANY.taxId}
                    </p>
                </div>
            </div>
        </footer>
    );
}
