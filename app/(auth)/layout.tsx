import { ReactNode } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/layout/logo';
import { ThemeToggle } from '@/components/layout/theme-toggle';

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Background gradient */}
            <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 -z-10" />
            <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center opacity-30 -z-10" />

            {/* Header */}
            <header className="container-wrapper py-6 flex items-center justify-between">
                <Logo />
                <ThemeToggle />
            </header>

            {/* Main content */}
            <main className="flex-1 container-wrapper flex items-center justify-center py-8">
                <div className="w-full max-w-md">
                    <div className="bg-card border rounded-xl shadow-soft p-8">
                        {children}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="container-wrapper py-6 text-center text-sm text-muted-foreground">
                <p>
                    © {new Date().getFullYear()} YowYob Inc. Ltd. Tous droits réservés.
                </p>
                <div className="flex items-center justify-center gap-4 mt-2">
                    <Link href="/terms" className="hover:text-foreground transition-colors">
                        Conditions d'utilisation
                    </Link>
                    <Link href="/privacy" className="hover:text-foreground transition-colors">
                        Confidentialité
                    </Link>
                    <Link href="/contact" className="hover:text-foreground transition-colors">
                        Contact
                    </Link>
                </div>
            </footer>
        </div>
    );
}
