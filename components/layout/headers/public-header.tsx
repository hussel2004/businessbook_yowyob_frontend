'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X } from 'lucide-react';
import { useState } from 'react';

import { Logo } from '@/components/layout/logo';
import { Button, buttonVariants } from '@/components/ui/button';
import { useAuthStore } from '@/lib/auth/auth-store';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { cn } from '@/lib/utils/cn';
import { LocationDisplay } from '@/components/features/location';

// Note: ThemeToggle will be implemented later, mocked for now
// or implemented inline if simple.

export function PublicHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { isAuthenticated, user } = useAuthStore();

    const navItems = [
        { label: 'Accueil', href: '/' },
        { label: 'Explorer', href: '/search' },
        { label: 'Catégories', href: '/categories' },
{ label: 'Promotions', href: '/promotions' },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
            <div className="container-wrapper h-20 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-8">
                    <Logo />

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'text-sm font-medium transition-colors hover:text-primary',
                                    pathname === item.href
                                        ? 'text-foreground'
                                        : 'text-muted-foreground'
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {/* Location Display */}
                    <div className="hidden md:block">
                        <LocationDisplay />
                    </div>

                    <Link
                        href="/search"
                        className={cn(
                            buttonVariants({ variant: 'ghost', size: 'icon' }),
                            "hidden sm:flex"
                        )}
                    >
                        <Search className="h-5 w-5" />
                        <span className="sr-only">Rechercher</span>
                    </Link>

                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {isAuthenticated ? (
                        <Link
                            href="/dashboard"
                            className={buttonVariants()}
                        >
                            Mon Tableau de bord
                        </Link>
                    ) : (
                        <div className="hidden sm:flex items-center gap-2">
                            <Link
                                href="/login"
                                className={buttonVariants({ variant: 'ghost' })}
                            >
                                Connexion
                            </Link>
                            <Link
                                href="/register"
                                className={buttonVariants()}
                            >
                                Inscription
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t p-4 bg-background">
                    <nav className="flex flex-col gap-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-sm font-medium py-2 hover:text-primary"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <hr className="my-2" />
                        {!isAuthenticated ? (
                            <div className="flex flex-col gap-2">
                                <Link
                                    href="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(buttonVariants({ variant: 'outline' }), "w-full")}
                                >
                                    Connexion
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(buttonVariants(), "w-full")}
                                >
                                    Inscription
                                </Link>
                            </div>
                        ) : (
                            <Link
                                href="/dashboard"
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(buttonVariants(), "w-full")}
                            >
                                Mon Tableau de bord
                            </Link>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
