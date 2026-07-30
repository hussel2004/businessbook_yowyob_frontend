'use client';
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '@/lib/api/dashboard';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Briefcase,
    LayoutDashboard,
    Settings,
    Heart,
    MessageSquare,
    LogOut,
    ChevronLeft,
    ExternalLink,
    ShieldAlert
} from 'lucide-react';

import { useTranslations } from 'next-intl';
import { useUIStore } from '@/lib/stores/ui-store';
import { useAuthStore } from '@/lib/auth/auth-store';
import { cn } from '@/lib/utils/cn';
import { Button, buttonVariants } from '@/components/ui/button';
import { Logo } from '@/components/layout/logo';

export function DashboardSidebar() {
    const pathname = usePathname();
    const t = useTranslations('sidebar');
    const { sidebarCollapsed, toggleSidebarCollapsed, mobileNavOpen, closeMobileUI } = useUIStore();
    const { logout, user } = useAuthStore();

    const sidebarItems = [
        {
            title: t('overview'),
            href: '/dashboard',
            icon: LayoutDashboard,
        },
        {
            title: t('myBusinesses'),
            href: '/organizations',
            icon: Briefcase,
        },
        {
            title: t('favorites'),
            href: '/favorites',
            icon: Heart,
        },
        {
            title: t('messages'),
            href: '/inquiries',
            icon: MessageSquare,
        },
        {
            title: t('settings'),
            href: '/profile',
            icon: Settings,
        },
    ];

    const adminItems = [
        {
            title: t('administration'),
            href: '/admin',
            icon: ShieldAlert,
        },
    ];
    // Basé sur les permissions kernel réelles, pas sur `user.role` (jamais peuplé).
    const isAdmin = user?.isPlatformAdmin === true || user?.isPlatformSuperAdmin === true;

    const isBusinessOwner = user?.accountType === 'BUSINESS';

    const { data: stats } = useQuery({
        queryKey: ['dashboard-stats-sidebar', user?.id],
        queryFn: getDashboardStats,
        enabled: !!user && isBusinessOwner,
    });

    // Desktop + Mobile Overlay logic can be handled in the Layout
    // Here we just render the nav structure

    return (
        <aside
            className={cn(
                'fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-background transition-all duration-300',
                sidebarCollapsed ? 'w-[70px]' : 'w-64',
                mobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            )}
        >
            {/* Header */}
            <div className={cn("flex h-16 items-center border-b px-4", sidebarCollapsed ? "justify-center" : "justify-between")}>
                {!sidebarCollapsed && <Logo />}
                {sidebarCollapsed && <Logo iconOnly />}

                <Button
                    variant="ghost"
                    size="sm"
                    className={cn("hidden md:flex", sidebarCollapsed && "hidden")}
                    onClick={toggleSidebarCollapsed}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
            </div>

            {/* Nav Items */}
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="grid gap-1 px-2">
                    {sidebarItems.map((item) => {
                        const accountType = user?.accountType;

                        // Visiteur non-business : uniquement Vue d'ensemble (CTA "devenir
                        // business owner"), Profil, Favoris. Pas d'accès à "Mes Entreprises".
                        if (accountType === 'VISITOR') {
                            if (!['/dashboard', '/profile', '/favorites'].includes(item.href)) {
                                return null;
                            }
                        }

                        // Logic to hide "Mes Entreprises" for single-org Business users
                        if (item.href === '/organizations') {
                            if (!isBusinessOwner) {
                                return null;
                            }
                            if (stats?.organizationCount === 1) {
                                return null;
                            }
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                                    pathname === item.href && 'bg-accent text-accent-foreground',
                                    sidebarCollapsed && 'justify-center px-2'
                                )}
                                title={sidebarCollapsed ? item.title : undefined}
                                onClick={closeMobileUI}
                            >
                                <item.icon className="h-5 w-5" />
                                {!sidebarCollapsed && <span>{item.title}</span>}
                            </Link>
                        );
                    })}



                    {/* Yowyob Link — application de boosting */}
                    <div className={cn("my-2 h-px bg-border", sidebarCollapsed && "mx-2")} />
                    <a
                        href="https://link-dev.yowyob.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                            'bg-gradient-to-r from-orange-500/10 to-amber-500/10 text-orange-600 hover:from-orange-500/20 hover:to-amber-500/20 border border-orange-500/20',
                            sidebarCollapsed && 'justify-center px-2'
                        )}
                        title="Yowyob Link — Booster"
                        onClick={closeMobileUI}
                    >
                        <ExternalLink className="h-5 w-5 shrink-0" />
                        {!sidebarCollapsed && <span>Yowyob Link</span>}
                    </a>

                    {isAdmin && (
                        <>
                            <div className={cn("my-2 h-px bg-border", sidebarCollapsed && "mx-2")} />
                            {adminItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10',
                                        pathname === item.href && 'bg-destructive/10',
                                        sidebarCollapsed && 'justify-center px-2'
                                    )}
                                    title={sidebarCollapsed ? item.title : undefined}
                                    onClick={closeMobileUI}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {!sidebarCollapsed && <span>{item.title}</span>}
                                </Link>
                            ))}
                        </>
                    )}
                </nav>
            </div>

            {/* Footer / Toggle & Logout */}
            <div className="border-t p-4">
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10",
                        sidebarCollapsed && "justify-center px-2"
                    )}
                    onClick={logout}
                    title={t('logout')}
                >
                    <LogOut className="h-5 w-5 mr-2" />
                    {!sidebarCollapsed && t('logout')}
                </Button>

                {/* Mobile Collapse Button (bottom, visible only on mobile if you want, but strictly Sidebar is hidden on mobile often, let's keep it simple) */}
            </div>
        </aside>
    );
}
