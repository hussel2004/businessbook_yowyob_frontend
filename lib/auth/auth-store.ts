import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { clearTokens, hasTokens } from './storage';

import { type User, type UserRole } from '@/types/user';
export type { User, UserRole };

/**
 * Auth store state
 */
interface AuthState {
    // State
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialized: boolean;

    // Actions
    setUser: (user: User) => void;
    updateUser: (updates: Partial<User>) => void;
    setLoading: (loading: boolean) => void;
    setInitialized: (initialized: boolean) => void;
    logout: () => void;
    reset: () => void;
}

/**
 * Initial state
 */
const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isInitialized: false,
};

/**
 * Auth store with persistence
 */
export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            ...initialState,

            /**
             * Set the authenticated user
             */
            setUser: (user: User) => {
                set({
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                    isInitialized: true,
                });
            },

            /**
             * Update user properties
             */
            updateUser: (updates: Partial<User>) => {
                const currentUser = get().user;
                if (currentUser) {
                    set({
                        user: { ...currentUser, ...updates },
                    });
                }
            },

            /**
             * Set loading state
             */
            setLoading: (loading: boolean) => {
                set({ isLoading: loading });
            },

            /**
             * Set initialization state
             */
            setInitialized: (initialized: boolean) => {
                set({ isInitialized: initialized, isLoading: false });
            },

            /**
             * Logout - clear tokens and reset state
             */
            logout: () => {
                clearTokens();
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    isInitialized: true,
                });
            },

            /**
             * Reset to initial state
             */
            reset: () => {
                clearTokens();
                set(initialState);
            },
        }),
        {
            name: 'businessbook-auth',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
            onRehydrateStorage: () => (state) => {
                // After rehydration, check if tokens exist
                if (state) {
                    const tokensExist = hasTokens();
                    if (!tokensExist) {
                        state.logout();
                    } else {
                        state.setInitialized(true);
                    }
                }
            },
        }
    )
);

/**
 * Selector: Get current user
 */
export const selectUser = (state: AuthState) => state.user;

/**
 * Selector: Check if authenticated
 */
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;

/**
 * Selector: Check if loading
 */
export const selectIsLoading = (state: AuthState) => state.isLoading;

/**
 * Selector: Check if user has specific role
 * @deprecated `user.role` n'est jamais peuplé par le backend (kernel) — utiliser
 * selectIsAdmin / selectIsSuperAdmin, dérivés des permissions kernel réelles.
 */
export const selectHasRole = (role: UserRole) => (state: AuthState) =>
    state.user?.role === role;

/**
 * Selector: Check if user is platform admin (admin BusinessBook ou super-admin)
 * Basé sur les permissions kernel réelles (isPlatformAdmin/isPlatformSuperAdmin
 * renvoyés par GET /api/auth/me), pas sur le champ `role` (jamais peuplé).
 */
export const selectIsAdmin = (state: AuthState) =>
    state.user?.isPlatformAdmin === true || state.user?.isPlatformSuperAdmin === true;

/**
 * Selector: Check if user is platform super admin
 */
export const selectIsSuperAdmin = (state: AuthState) =>
    state.user?.isPlatformSuperAdmin === true;

/**
 * Selector: Check if user has upgraded to a business owner account
 * (accountType === 'BUSINESS', dérivé côté backend depuis les permissions kernel
 * OU le passage self-service "devenir business owner"). Seule source de vérité pour
 * conditionner l'accès à "Mes entreprises" / la création d'organisation.
 */
export const selectIsBusinessOwner = (state: AuthState) =>
    state.user?.accountType === 'BUSINESS';
