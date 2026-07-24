'use client';

import { DashboardSidebar } from '@/components/layout/sidebars/dashboard-sidebar';
import { DashboardHeader } from '@/components/layout/headers/dashboard-header';
import { useUIStore } from '@/lib/stores/ui-store';
import { cn } from '@/lib/utils/cn';
import { useAuthStore } from '@/lib/auth/auth-store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { sidebarCollapsed, mobileNavOpen, closeMobileUI } = useUIStore();
    const { isAuthenticated, isLoading, user } = useAuthStore();
    const router = useRouter();

    // Basic check - ProtectedRoute wrapper is better for individual pages, 
    // but Layout check prevents flash of unstyled content sometimes
    const pathname = usePathname(); // Need to add import

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
            return;
        }

        // Restrict Visitor access (check accountType, not role). /dashboard reste
        // accessible : c'est là que vit le CTA "Devenir business owner".
        const accountType = user?.accountType;
        if (!isLoading && accountType === 'VISITOR') {
            const allowedPaths = ['/dashboard', '/profile', '/favorites'];
            const isAllowed = allowedPaths.some(path => pathname.startsWith(path));

            if (!isAllowed) {
                router.push('/dashboard');
            }
        }
    }, [isAuthenticated, isLoading, router, user, pathname]);

    if (isLoading) {
        return <div className="flex min-h-screen items-center justify-center">Chargement...</div>;
    }

    if (!isAuthenticated) return null;

    // Ne pas monter les pages restreintes le temps que le useEffect ci-dessus redirige
    // (sinon un visiteur voit brièvement, et peut interagir avec, la page interdite).
    if (user?.accountType === 'VISITOR') {
        const allowedPaths = ['/dashboard', '/profile', '/favorites'];
        if (!allowedPaths.some(path => pathname.startsWith(path))) {
            return null;
        }
    }

    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar */}
            <DashboardSidebar />

            {/* Overlay for mobile */}
            {mobileNavOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 md:hidden"
                    onClick={closeMobileUI}
                />
            )}

            {/* Main Content Area */}
            <div
                className={cn(
                    "flex flex-1 flex-col transition-all duration-300 ease-in-out",
                    sidebarCollapsed ? "md:pl-[70px]" : "md:pl-64"
                )}
            >
                <DashboardHeader />
                <main className="flex-1 p-4 md:p-8">
                    <div className="mx-auto max-w-6xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
