import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import { Providers } from './providers';
import { UnverifiedBanner } from '@/components/features/auth/unverified-banner';
import './globals.css';

// Load Inter font with optimization
const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
    preload: false,
});

// App metadata
export const metadata: Metadata = {
    title: {
        default: 'BusinessBook - Annuaire des Entreprises Camerounaises',
        template: '%s | BusinessBook',
    },
    description:
        'Découvrez et contactez des entreprises camerounaises vérifiées. Annuaire professionnel avec avis, horaires et localisation.',
    keywords: [
        'annuaire entreprises',
        'cameroun',
        'business directory',
        'entreprises camerounaises',
        'sociétés douala',
        'sociétés yaoundé',
        'commerce local',
        'PME cameroun',
    ],
    authors: [{ name: 'BusinessBook' }],
    creator: 'BusinessBook',
    publisher: 'BusinessBook',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'fr_FR',
        url: process.env.NEXT_PUBLIC_APP_URL,
        siteName: 'BusinessBook',
        title: 'BusinessBook - Annuaire des Entreprises Camerounaises',
        description:
            'Découvrez et contactez des entreprises camerounaises vérifiées. Annuaire professionnel avec avis, horaires et localisation.',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'BusinessBook - Annuaire Cameroun',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'BusinessBook - Annuaire des Entreprises Camerounaises',
        description: 'Découvrez et contactez des entreprises camerounaises vérifiées.',
        images: ['/og-image.png'],
    },
    manifest: '/manifest.json',
    icons: {
        icon: [
            { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        ],
        apple: [
            { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'BusinessBook',
    },
    formatDetection: {
        telephone: true,
        email: true,
        address: true,
    },
    other: {
        'mobile-web-app-capable': 'yes',
    },
};

// Viewport configuration
export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
    ],
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover',
};

/**
 * Root Layout
 * Wraps the entire application with providers and global styles
 */
export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const locale = await getLocale();
    const messages = await getMessages();
    const t = await getTranslations('nav');

    return (
        <html lang={locale} suppressHydrationWarning>
            <head>
                {/* Preconnect to external resources */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

                {/* DNS prefetch for API */}
                <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_URL} />
            </head>
            <body className={`${inter.variable} font-sans antialiased`}>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <Providers>
                        {/* Skip to content link for accessibility */}
                        <a
                            href="#main-content"
                            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md"
                        >
                            {t('skipToContent')}
                        </a>

                        <UnverifiedBanner />

                        {/* Main content */}
                        <div id="main-content" className="min-h-screen flex flex-col">
                            {children}
                        </div>
                    </Providers>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
