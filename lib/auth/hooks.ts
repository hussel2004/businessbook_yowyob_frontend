'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuthStore, type User } from './auth-store';
import { getAccessToken, hasTokens } from './storage';
import * as authApi from '@/lib/api/auth';
import { becomeBusinessOwner as becomeBusinessOwnerApi } from '@/lib/api/profile';

/**
 * Query keys for auth-related queries
 */
export const authQueryKeys = {
    user: ['auth', 'user'] as const,
};

/**
 * Main auth hook - provides all auth functionality
 */
export function useAuth() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const {
        user,
        isAuthenticated,
        isLoading,
        isInitialized,
        setUser,
        setLoading,
        setInitialized,
        logout: storeLogout,
    } = useAuthStore();

    /**
     * Fetch current user on mount if tokens exist
     */
    const { refetch: refetchUser } = useQuery({
        queryKey: authQueryKeys.user,
        queryFn: authApi.getCurrentUser,
        enabled: false, // Manual fetch only
        retry: false,
    });

    /**
     * Initialize auth state
     */
    const initializeAuth = useCallback(async () => {
        if (isInitialized) return;

        setLoading(true);

        if (!hasTokens()) {
            setInitialized(true);
            return;
        }

        try {
            const userData = await authApi.getCurrentUser();
            setUser(userData as User);
        } catch {
            // Token invalid or expired, clear state
            storeLogout();
        }
    }, [isInitialized, setLoading, setInitialized, setUser, storeLogout]);

    /**
     * Login mutation — flux kernel discover-contexts/select-context (géré dans LoginForm).
     * Ce hook expose logout et l'état d'auth uniquement.
     */
    const loginMutation = useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) =>
            authApi.login(email, password),
    });

    /**
     * Register mutation — création de compte via le kernel sign-up.
     */
    const registerMutation = useMutation({
        mutationFn: authApi.register,
    });

    /**
     * Logout mutation
     */
    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        onSettled: () => {
            // Always clear state, even on error
            storeLogout();
            queryClient.removeQueries({ queryKey: authQueryKeys.user });
            queryClient.clear();
            router.push('/login');
        },
    });

    /**
     * Login handler — délégué au LoginForm (flux multi-contexte).
     * Conservé pour backward-compat éventuel.
     */
    const login = useCallback(
        async (email: string, password: string) => loginMutation.mutateAsync({ email, password }),
        [loginMutation]
    );

    /**
     * Logout handler
     */
    const logout = useCallback(async () => {
        await logoutMutation.mutateAsync();
    }, [logoutMutation]);

    /**
     * Passage self-service "devenir business owner" : appelle le backend puis
     * re-fetch /me pour rafraîchir accountType dans le store (le token JWT kernel
     * n'est pas réémis, seul actor.accountType change côté serveur).
     */
    const becomeBusinessOwnerMutation = useMutation({
        mutationFn: becomeBusinessOwnerApi,
        onSuccess: async () => {
            const freshUser = await authApi.getCurrentUser();
            setUser(freshUser as User);
            queryClient.setQueryData(authQueryKeys.user, freshUser);
        },
    });

    /**
     * Update user data
     */
    const updateUserData = useCallback(
        (userData: Partial<User>) => {
            const currentUser = useAuthStore.getState().user;
            if (currentUser) {
                const updatedUser = { ...currentUser, ...userData };
                setUser(updatedUser);
                queryClient.setQueryData(authQueryKeys.user, updatedUser);
            }
        },
        [setUser, queryClient]
    );

    // Initialize auth on mount
    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    return {
        // State
        user,
        isAuthenticated,
        isLoading,
        isInitialized,

        // Actions
        login,
        logout,
        updateUserData,
        initializeAuth,

        // Mutation states for UI feedback
        isLoggingIn: loginMutation.isPending,
        isLoggingOut: logoutMutation.isPending,
        loginError: loginMutation.error,

        // Register
        register: registerMutation.mutateAsync,
        isRegistering: registerMutation.isPending,
        registerError: registerMutation.error,

        // Become business owner
        becomeBusinessOwner: becomeBusinessOwnerMutation.mutateAsync,
        isBecomingBusinessOwner: becomeBusinessOwnerMutation.isPending,
        becomeBusinessOwnerError: becomeBusinessOwnerMutation.error,
    };
}

/**
 * Hook to require authentication
 * Redirects to login if not authenticated
 */
export function useRequireAuth(redirectTo = '/login') {
    const router = useRouter();
    const { isAuthenticated, isInitialized, isLoading } = useAuthStore();

    useEffect(() => {
        if (isInitialized && !isLoading && !isAuthenticated) {
            const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
            const redirectUrl = currentPath ? `${redirectTo}?redirect=${encodeURIComponent(currentPath)}` : redirectTo;
            router.replace(redirectUrl);
        }
    }, [isAuthenticated, isInitialized, isLoading, redirectTo, router]);

    return { isAuthenticated, isLoading: isLoading || !isInitialized };
}

/**
 * Hook for guest-only routes (login, register)
 * Redirects to dashboard if already authenticated
 */
export function useGuestOnly(redirectTo = '/dashboard') {
    const router = useRouter();
    const { isAuthenticated, isInitialized, isLoading } = useAuthStore();

    useEffect(() => {
        if (isInitialized && !isLoading && isAuthenticated) {
            router.replace(redirectTo);
        }
    }, [isAuthenticated, isInitialized, isLoading, redirectTo, router]);

    return { isAuthenticated, isLoading: isLoading || !isInitialized };
}
