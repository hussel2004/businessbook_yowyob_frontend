import type { BaseEntity } from './api';

/**
 * User role types
 */
export type UserRole = 'USER' | 'MANAGER' | 'ADMIN' | 'SUPER_ADMIN';

/**
 * Auth provider types
 */
export type AuthProvider = 'EMAIL' | 'GOOGLE' | 'FACEBOOK' | 'APPLE';

/**
 * User response from API
 */
export interface User extends BaseEntity {
    actorId?: string;
    email: string;
    emailVerified: boolean;
    provider: AuthProvider;
    role: UserRole;
    firstName: string;
    lastName: string;
    displayName?: string;
    avatarUrl?: string;
    bio?: string;
    city?: string;
    countryCode?: string;
    languagePreference: string;
    timezone?: string;
    isActive: boolean;
    lastLoginAt?: string;

    // ── Champs réellement renvoyés par GET /api/auth/me (kernel) ──────────
    // NB : `role` ci-dessus n'est PAS renvoyé par le backend (jamais peuplé
    // par le kernel) — ne pas s'y fier pour des contrôles d'accès. Utiliser
    // isPlatformAdmin / isPlatformSuperAdmin, dérivés des permissions kernel.
    tenantId?: string;
    organizationId?: string;
    permissions?: string[];
    accountType?: 'BUSINESS' | 'VISITOR';
    isPlatformAdmin?: boolean;
    isPlatformSuperAdmin?: boolean;
}

/**
 * Actor profile (public view of user)
 */
export interface Actor {
    id: string;
    displayName: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    bio?: string;
    city?: string;
    countryCode?: string;
    reviewCount: number;
    createdAt: string;
}

/**
 * Update profile request
 */
export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    bio?: string;
    city?: string;
    countryCode?: string;
    languagePreference?: string;
    timezone?: string;
}

/**
 * Login request
 */
export interface LoginRequest {
    email: string;
    password: string;
}

/**
 * Register request
 */
export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    accountType: 'VISITOR' | 'BUSINESS';
}

/**
 * Auth response (login/register)
 */
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: User;
}

/**
 * Token refresh request
 */
export interface RefreshTokenRequest {
    refreshToken: string;
}

/**
 * Token refresh response
 */
export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

// ── Kernel YowYob ──────────────────────────────────────────────────────────

export interface KernelOrganization {
    id: string;
    code: string;
    displayName: string;
    organizationType: string;
    status: string;
}

export interface KernelContext {
    contextId: string;
    tenantId: string;
    userId: string;
    actorId: string | null;
    organizations: KernelOrganization[];
}

export interface DiscoverContextsResponse {
    selectionToken: string;
    expiresInSeconds: number;
    contexts: KernelContext[];
}

export interface KernelSession {
    accessToken: string;
    expiresInSeconds: number;
}

export interface SelectContextResponse {
    selectedTenantId: string;
    selectedOrganizationId: string | null;
    session: KernelSession;
}

// ── Récupération de mot de passe (flux kernel en 3 étapes) ────────────────

export interface PasswordResetContext {
    contextId: string;
    tenantId: string;
    userId: string;
    actorId: string | null;
    username: string | null;
    email: string | null;
}

export interface ForgotPasswordResponse {
    principal: string;
    matchingAccountCount: number;
    selectionToken: string | null;
    selectionTokenExpiresInSeconds: number;
    contexts: PasswordResetContext[];
}

/**
 * Réponse partagée par plusieurs endpoints kernel émettant un challenge par email/SMS
 * (password-reset/issue, email-verification/resend).
 */
export interface IssuedAuthChallengeResponse {
    deliveryMode: string;
    challengeTokenPreview: string | null;
    expiresInSeconds: number;
}

export interface KernelWrapper<T> {
    success: boolean;
    data: T;
    message: string;
}
