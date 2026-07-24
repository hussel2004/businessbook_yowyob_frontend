'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth/auth-store';
import { Spinner } from '@/components/ui/spinner';

interface AuthGuardProps {
    children: ReactNode;
    fallback?: ReactNode;
}

/**
 * Auth Guard - Protects routes that require authentication
 * Redirects to login if not authenticated
 */
export function AuthGuard({ children, fallback }: AuthGuardProps) {
    const router = useRouter();
    const { isAuthenticated, isInitialized, isLoading } = useAuthStore();

    useEffect(() => {
        if (isInitialized && !isLoading && !isAuthenticated) {
            const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
            const redirectUrl = currentPath
                ? `/login?redirect=${encodeURIComponent(currentPath)}`
                : '/login';
            router.replace(redirectUrl);
        }
    }, [isAuthenticated, isInitialized, isLoading, router]);

    // Show loading state while checking auth
    if (!isInitialized || isLoading) {
        return fallback ?? (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-4">
                    <Spinner size="lg" />
                    <p className="text-muted-foreground">Chargement...</p>
                </div>
            </div>
        );
    }

    // Don't render content if not authenticated (will redirect)
    if (!isAuthenticated) {
        return fallback ?? (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-4">
                    <Spinner size="lg" />
                    <p className="text-muted-foreground">Redirection...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

/**
 * Guest Guard - Protects routes that should only be accessible to non-authenticated users
 * Redirects to dashboard if already authenticated
 */
export function GuestGuard({ children, fallback }: AuthGuardProps) {
    const router = useRouter();
    const { isAuthenticated, isInitialized, isLoading } = useAuthStore();

    useEffect(() => {
        if (isInitialized && !isLoading && isAuthenticated) {
            router.replace('/dashboard');
        }
    }, [isAuthenticated, isInitialized, isLoading, router]);

    // Show loading state while checking auth
    if (!isInitialized || isLoading) {
        return fallback ?? (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-4">
                    <Spinner size="lg" />
                    <p className="text-muted-foreground">Chargement...</p>
                </div>
            </div>
        );
    }

    // Don't render content if authenticated (will redirect)
    if (isAuthenticated) {
        return fallback ?? (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-4">
                    <Spinner size="lg" />
                    <p className="text-muted-foreground">Redirection...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

/**
 * Role Guard - Protects routes that require specific roles
 */
interface RoleGuardProps extends AuthGuardProps {
    allowedRoles: string[];
    unauthorizedFallback?: ReactNode;
}

export function RoleGuard({ children, fallback, allowedRoles, unauthorizedFallback }: RoleGuardProps) {
    const router = useRouter();
    const { user, isAuthenticated, isInitialized, isLoading } = useAuthStore();

    useEffect(() => {
        if (isInitialized && !isLoading) {
            if (!isAuthenticated) {
                const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
                router.replace(`/login?redirect=${encodeURIComponent(currentPath)}`);
            } else if (user && !allowedRoles.includes(user.role)) {
                router.replace('/dashboard');
            }
        }
    }, [isAuthenticated, isInitialized, isLoading, user, allowedRoles, router]);

    // Show loading state while checking auth
    if (!isInitialized || isLoading) {
        return fallback ?? (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    // Not authenticated
    if (!isAuthenticated) {
        return fallback ?? (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    // Authenticated but wrong role
    if (user && !allowedRoles.includes(user.role)) {
        return unauthorizedFallback ?? (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Accès refusé</h1>
                    <p className="text-muted-foreground">Vous n'avez pas les permissions nécessaires.</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
