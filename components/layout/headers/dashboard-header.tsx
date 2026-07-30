'use client';

import { Menu } from 'lucide-react';
import { useUIStore } from '@/lib/stores/ui-store';
import { useAuthStore } from '@/lib/auth/auth-store';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { Avatar } from '@/components/ui/avatar';
import { Logo } from '@/components/layout/logo';
import { NotificationBell } from '@/components/features/notifications/notification-bell';

export function DashboardHeader() {
    const { toggleMobileNav, toggleSidebarCollapsed, sidebarCollapsed } = useUIStore();
    const { user } = useAuthStore();

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background px-4 md:px-6">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Trigger */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={toggleMobileNav}
                >
                    <Menu className="h-6 w-6" />
                </Button>

                {/* Desktop Collapse Trigger (if not in sidebar) */}
                {sidebarCollapsed && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hidden md:flex"
                        onClick={toggleSidebarCollapsed}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                )}

                {/* Breadcrumbs or Page Title could go here */}
                <div className="md:hidden">
                    <Logo iconOnly />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Notifications */}
                <NotificationBell />

                {/* Language */}
                <LanguageSwitcher />

                {/* Theme */}
                <ThemeToggle />

                {/* User Profile */}
                <div className="flex items-center gap-3 border-l pl-4">
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-muted-foreground capitalize">{user?.role?.toLowerCase()}</p>
                    </div>
                    <Avatar
                        src={user?.avatarUrl}
                        alt={`${user?.firstName} ${user?.lastName}`}
                        fallback={user ? undefined : 'U'}
                    />
                </div>
            </div>
        </header>
    );
}
