'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    Shield,
    Users,
    Building2,
    FolderTree,
    Flag,
    ChevronLeft,
    LogOut,
    Home
} from 'lucide-react';

import { useAuthStore } from '@/lib/auth/auth-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/layout/logo';

const adminNavItems = [
    {
        title: 'Tableau de bord',
        href: '/admin',
        icon: LayoutDashboard,
    },
    {
        title: 'Vérifications',
        href: '/admin/verifications',
        icon: Shield,
        badge: true, // Show pending count
    },
    {
        title: 'Utilisateurs',
        href: '/admin/users',
        icon: Users,
    },
    {
        title: 'Entreprises',
        href: '/admin/organizations',
        icon: Building2,
    },
    {
        title: 'Catégories',
        href: '/admin/categories',
        icon: FolderTree,
    },
    {
        title: 'Signalements',
        href: '/admin/reports',
        icon: Flag,
        badge: true, // Show pending count
    },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAuthenticated, isLoading, logout } = useAuthStore();
    const { sidebarCollapsed, mobileNavOpen, closeMobileUI, toggleSidebarCollapsed } = useUIStore();

    // Basé sur les permissions kernel réelles (BUSINESSBOOK_PLATFORM_ADMIN /
    // BUSINESSBOOK_PLATFORM_SUPER_ADMIN), pas sur `user.role` qui n'est jamais
    // peuplé par le backend (kernel-based /api/auth/me).
    const isAdmin = user?.isPlatformAdmin === true || user?.isPlatformSuperAdmin === true;

    // Redirect non-admins
    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !isAdmin)) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, isLoading, isAdmin, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-muted-foreground">Chargement...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !isAdmin) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Admin Sidebar */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-slate-900 text-white transition-all duration-300',
                    sidebarCollapsed ? 'w-[70px]' : 'w-64',
                    mobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                )}
            >
                {/* Header */}
                <div className={cn(
                    "flex h-16 items-center border-b border-slate-800 px-4",
                    sidebarCollapsed ? "justify-center" : "justify-between"
                )}>
                    {!sidebarCollapsed && (
                        <div className="flex items-center gap-2">
                            <Shield className="h-6 w-6 text-red-400" />
                            <span className="font-bold text-lg">Admin</span>
                        </div>
                    )}
                    {sidebarCollapsed && <Shield className="h-6 w-6 text-red-400" />}

                    {!sidebarCollapsed && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="hidden md:flex text-slate-400 hover:text-white hover:bg-slate-800"
                            onClick={toggleSidebarCollapsed}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="grid gap-1 px-2">
                        {adminNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                    'text-slate-300 hover:bg-slate-800 hover:text-white',
                                    pathname === item.href && 'bg-red-600/20 text-red-400',
                                    sidebarCollapsed && 'justify-center px-2'
                                )}
                                title={sidebarCollapsed ? item.title : undefined}
                                onClick={closeMobileUI}
                            >
                                <item.icon className="h-5 w-5" />
                                {!sidebarCollapsed && <span>{item.title}</span>}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-800 p-4 space-y-2">
                    <Link
                        href="/dashboard"
                        className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                            'text-slate-400 hover:bg-slate-800 hover:text-white',
                            sidebarCollapsed && 'justify-center px-2'
                        )}
                        title={sidebarCollapsed ? 'Retour au tableau de bord' : undefined}
                    >
                        <Home className="h-5 w-5" />
                        {!sidebarCollapsed && <span>Retour Dashboard</span>}
                    </Link>

                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-900/20",
                            sidebarCollapsed && "justify-center px-2"
                        )}
                        onClick={logout}
                        title="Se déconnecter"
                    >
                        <LogOut className="h-5 w-5 mr-2" />
                        {!sidebarCollapsed && "Déconnexion"}
                    </Button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {mobileNavOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 md:hidden"
                    onClick={closeMobileUI}
                />
            )}

            {/* Main Content */}
            <div
                className={cn(
                    "flex flex-1 flex-col transition-all duration-300 ease-in-out",
                    sidebarCollapsed ? "md:pl-[70px]" : "md:pl-64"
                )}
            >
                {/* Admin Header */}
                <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-4 md:px-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => useUIStore.getState().toggleMobileNav()}
                    >
                        <LayoutDashboard className="h-5 w-5" />
                    </Button>

                    <div className="flex-1">
                        <h1 className="text-lg font-semibold">
                            Panel d'Administration
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Gestionnaire BusinessBook
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                            <Shield className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                            <p className="text-xs text-muted-foreground">
                                {user?.isPlatformSuperAdmin ? 'Super Admin' : 'Admin'}
                            </p>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-8">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
