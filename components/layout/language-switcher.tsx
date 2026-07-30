'use client';

import { useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LOCALE_COOKIE, type Locale } from '@/i18n/config';
import { cn } from '@/lib/utils/cn';

/**
 * Bascule FR/EN : écrit le cookie NEXT_LOCALE puis rafraîchit
 * le rendu serveur (pas de préfixe de locale dans l'URL).
 */
export function LanguageSwitcher({ className }: { className?: string }) {
    const locale = useLocale() as Locale;
    const router = useRouter();
    const t = useTranslations('common');
    const [isPending, startTransition] = useTransition();

    const nextLocale: Locale = locale === 'fr' ? 'en' : 'fr';

    const switchLocale = () => {
        // Cookie 1 an, valable sur tout le site
        document.cookie = `${LOCALE_COOKIE}=${nextLocale};path=/;max-age=31536000;samesite=lax`;
        startTransition(() => {
            router.refresh();
        });
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={switchLocale}
            disabled={isPending}
            title={t('changeLanguage')}
            className={cn('gap-1.5 px-2 font-semibold uppercase', className)}
        >
            <Globe className="h-4 w-4" />
            <span className="text-xs">{locale}</span>
            <span className="sr-only">{t('changeLanguage')}</span>
        </Button>
    );
}
