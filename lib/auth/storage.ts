import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'bb_access_token';
const REFRESH_TOKEN_KEY = 'bb_refresh_token';
const TENANT_ID_KEY = 'bb_tenant_id';
const ORGANIZATION_ID_KEY = 'bb_organization_id';

// Cookie options
const ACCESS_TOKEN_OPTIONS: Cookies.CookieAttributes = {
    expires: 1 / 96, // 15 minutes (1/96 of a day)
    sameSite: 'lax',
    secure: typeof window !== 'undefined' ? window.location.protocol === 'https:' : process.env.NODE_ENV === 'production',
};

const REFRESH_TOKEN_OPTIONS: Cookies.CookieAttributes = {
    expires: 7, // 7 days
    sameSite: 'lax',
    secure: typeof window !== 'undefined' ? window.location.protocol === 'https:' : process.env.NODE_ENV === 'production',
};

/**
 * Get the access token from cookies
 */
export function getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return Cookies.get(ACCESS_TOKEN_KEY) || null;
}

/**
 * Get the refresh token from cookies
 */
export function getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return Cookies.get(REFRESH_TOKEN_KEY) || null;
}

/**
 * Store both tokens in cookies
 */
/**
 * Helper to determine if cookies should be secure
 */
const isSecure = (): boolean => {
    return process.env.NODE_ENV === 'production' &&
        typeof window !== 'undefined' &&
        window.location.protocol === 'https:';
};

/**
 * Store both tokens in cookies
 */
export function setTokens(accessToken: string, refreshToken: string): void {
    const secure = isSecure();
    Cookies.set(ACCESS_TOKEN_KEY, accessToken, { ...ACCESS_TOKEN_OPTIONS, secure });
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { ...REFRESH_TOKEN_OPTIONS, secure });
}

/**
 * Store only the access token (for refresh)
 */
export function setAccessToken(accessToken: string): void {
    const secure = isSecure();
    Cookies.set(ACCESS_TOKEN_KEY, accessToken, { ...ACCESS_TOKEN_OPTIONS, secure });
}

/**
 * Persist tenant and organization resolved by the kernel after select-context.
 */
export function setKernelContext(tenantId: string, organizationId: string | null): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TENANT_ID_KEY, tenantId);
    if (organizationId) {
        localStorage.setItem(ORGANIZATION_ID_KEY, organizationId);
    } else {
        localStorage.removeItem(ORGANIZATION_ID_KEY);
    }
}

export function getKernelTenantId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TENANT_ID_KEY);
}

export function getKernelOrganizationId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ORGANIZATION_ID_KEY);
}

/**
 * Clear all authentication tokens
 */
export function clearTokens(): void {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    if (typeof window !== 'undefined') {
        localStorage.removeItem(TENANT_ID_KEY);
        localStorage.removeItem(ORGANIZATION_ID_KEY);
    }
}

/**
 * Check if user has tokens (basic auth check)
 * Le kernel YowYob est stateless (pas de refresh token) — on vérifie uniquement l'access token
 */
export function hasTokens(): boolean {
    return !!getAccessToken();
}

/**
 * Parse JWT token payload (without verification)
 * Note: This is only for reading claims, not for security validation
 */
export function parseToken<T = Record<string, unknown>>(token: string): T | null {
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;

        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload) as T;
    } catch {
        return null;
    }
}

/**
 * Check if the access token is expired
 */
export function isTokenExpired(token: string): boolean {
    const payload = parseToken<{ exp: number }>(token);
    if (!payload?.exp) return true;

    // Add 30 second buffer
    return Date.now() >= (payload.exp * 1000) - 30000;
}

/**
 * Get remaining time until token expires (in seconds)
 */
export function getTokenExpiresIn(token: string): number {
    const payload = parseToken<{ exp: number }>(token);
    if (!payload?.exp) return 0;

    const remainingMs = (payload.exp * 1000) - Date.now();
    return Math.max(0, Math.floor(remainingMs / 1000));
}
