'use client';

import Link from 'next/link';
import { AlertTriangle, X } from 'lucide-react';
import { useAuthStore } from '@/lib/auth/auth-store';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function UnverifiedBanner() {
    const { isAuthenticated, user } = useAuthStore();
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);

    // Don't show on auth pages or if not authenticated or if already verified
    if (!isAuthenticated || !user || user.emailVerified || !isVisible) {
        return null;
    }

    // Don't show on verification pages
    if (pathname.includes('/verify-email') || pathname.includes('/resend-verification')) {
        return null;
    }

    return (
        <div className="bg-yellow-100 dark:bg-yellow-900/30 border-b border-yellow-200 dark:border-yellow-900/50 px-4 py-2 relative">
            <div className="container-wrapper flex items-start sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3 text-sm text-yellow-800 dark:text-yellow-200">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5 sm:mt-0" />
                    <p>
                        Votre adresse email <strong>{user.email}</strong> n'est pas vérifiée.
                        Certaines fonctionnalités sont limitées.
                    </p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                    <Link
                        href="/resend-verification"
                        className="text-sm font-medium text-yellow-800 dark:text-yellow-200 hover:underline whitespace-nowrap"
                    >
                        Vérifier maintenant
                    </Link>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-yellow-800 dark:text-yellow-200 hover:opacity-75"
                        aria-label="Masquer"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
