/**
 * API Endpoints Configuration
 * All API endpoints are defined here for consistency and easy maintenance.
 */

// Base URL des appels API.
// - Navigateur : toujours un chemin relatif (même origine que la page). Ça
//   marche sur n'importe quel domaine/déploiement sans AUCUNE variable
//   NEXT_PUBLIC_* — celles-ci sont inlinées dans le JS au build, donc tout
//   changement exigerait un rebuild. Un chemin relatif n'a pas ce problème.
// - Serveur (SSR/Server Components) : a besoin d'une URL absolue. On lit
//   BACKEND_URL, une variable serveur classique (pas NEXT_PUBLIC_) déjà
//   utilisée par next.config.js pour les rewrites — lue au runtime,
//   modifiable sans rebuild.
//
// On distingue les deux via la présence de BACKEND_URL plutôt que
// `typeof window` : BACKEND_URL n'est jamais exposé au navigateur par
// Next.js (seules les variables NEXT_PUBLIC_* le sont), donc sa présence
// signale sans ambiguïté un contexte serveur.
export const getApiBaseUrl = (): string => {
    const backendUrl = process.env.BACKEND_URL;
    if (backendUrl) {
        return `${backendUrl.replace(/\/$/, '')}/api`;
    }
    return process.env.NEXT_PUBLIC_API_URL || '/api';
};

/**
 * Convert a relative asset URL (like /uploads/logos/...) to a URL the browser can fetch.
 * Renvoie un chemin relatif par défaut : le navigateur le résout contre
 * l'origine de la page, aucune variable d'environnement requise.
 */
export function getAssetUrl(path: string | null | undefined): string | undefined {
    if (!path) return undefined;
    // If already absolute URL or blob URL, return as-is
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:')) return path;

    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    // BACKEND_URL n'est jamais exposé au navigateur par Next.js (seules les
    // variables NEXT_PUBLIC_* le sont) — sa présence signale sans ambiguïté
    // qu'on est côté serveur (SSR/génération du HTML).
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
        return cleanPath;
    }
    const baseUrl = backendUrl;
    return `${baseUrl.replace(/\/$/, '')}${cleanPath}`;
}

export const ENDPOINTS = {
    // ============================
    // Authentication
    // ============================
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        REFRESH: '/auth/refresh',
        LOGOUT: '/auth/logout',
        ME: '/auth/me',
    },

    // ============================
    // Actors (User Profiles)
    // ============================
    ACTORS: {
        ME: '/actors/me',
        BY_ID: (id: string) => `/actors/${id}`,
        AVATAR: '/actors/me/avatar',
        BECOME_BUSINESS_OWNER: '/actors/me/become-business-owner',
    },

    // ============================
    // Organizations
    // ============================
    ORGANIZATIONS: {
        BASE: '/organizations',
        BY_ID: (id: string) => `/organizations/${id}`,
        BY_SLUG: (slug: string) => `/organizations/slug/${slug}`,
        MY: '/organizations/my',
        SEARCH: '/organizations/search',

        // Agencies
        AGENCIES: (orgId: string) => `/organizations/${orgId}/agencies`,
        AGENCY_BY_ID: (agencyId: string) => `/organizations/agencies/${agencyId}`,
        AGENCY_HOURS: (agencyId: string) => `/organizations/agencies/${agencyId}/hours`,

        // Services
        SERVICES: (orgId: string) => `/organizations/${orgId}/services`,

        // Addresses & Contacts
        ADDRESSES: (orgId: string) => `/organizations/${orgId}/addresses`,
        CONTACTS: (orgId: string) => `/organizations/${orgId}/contacts`,

        // Members
        MEMBERS: (orgId: string) => `/organizations/${orgId}/members`,
        INVITE_MEMBER: (orgId: string) => `/organizations/${orgId}/members/invite`,

        // Posts
        POSTS: (orgId: string) => `/organizations/${orgId}/posts`,

        // Promotions
        PROMOTIONS: (orgId: string) => `/organizations/${orgId}/promotions`,

        // Reviews
        REVIEWS: (orgId: string) => `/organizations/${orgId}/reviews`,
        REVIEWS_STATS: (orgId: string) => `/organizations/${orgId}/reviews/stats`,
        QUICK_RATE: (orgId: string) => `/organizations/${orgId}/quick-rate`,
        RATING_SUMMARY: (orgId: string) => `/organizations/${orgId}/rating-summary`,
        HAS_REVIEWED: (orgId: string) => `/organizations/${orgId}/has-reviewed`,

        // Media
        MEDIA: (orgId: string) => `/organizations/${orgId}/media`,
        GALLERY: (orgId: string) => `/organizations/${orgId}/gallery`,

        // Inquiries
        INQUIRIES: (orgId: string) => `/organizations/${orgId}/inquiries`,

        // Verification
        VERIFICATION: (orgId: string) => `/organizations/${orgId}/verification`,
        VERIFIED: (orgId: string) => `/organizations/${orgId}/verified`,

        // Category
        CATEGORY: (orgId: string) => `/organizations/${orgId}/category`,

        // Awards
        AWARDS: (orgId: string) => `/organizations/${orgId}/awards`,
    },

    // ============================
    // Agencies (Public Search)
    // ============================
    AGENCIES: {
        SEARCH: '/agencies/search',
        BY_ID: (id: string) => `/agencies/${id}`,
    },

    // ============================
    // Services
    // ============================
    SERVICES: {
        BY_ID: (id: string) => `/services/${id}`,
    },

    // ============================
    // Addresses & Contacts
    // ============================
    ADDRESSES: {
        BY_ID: (id: string) => `/addresses/${id}`,
    },
    CONTACTS: {
        BY_ID: (id: string) => `/contacts/${id}`,
    },

    // ============================
    // Categories
    // ============================
    CATEGORIES: {
        BASE: '/categories',
        BY_ID: (id: string) => `/categories/${id}`,
        BY_SLUG: (slug: string) => `/categories/slug/${slug}`,
        ORGANIZATIONS: (id: string) => `/categories/${id}/organizations`,
    },

    // ============================
    // Posts
    // ============================
    POSTS: {
        BY_ID: (id: string) => `/posts/${id}`,
        BY_SLUG: (slug: string) => `/posts/slug/${slug}`,
        PUBLISH: (id: string) => `/posts/${id}/publish`,
        ARCHIVE: (id: string) => `/posts/${id}/archive`,
        LIKE: (id: string) => `/posts/${id}/like`,
    },

    // ============================
    // Promotions
    // ============================
    PROMOTIONS: {
        BASE: '/promotions',
        FEATURED: '/promotions/featured',
        BY_ID: (id: string) => `/promotions/${id}`,
        ACTIVATE: (id: string) => `/promotions/${id}/activate`,
        PAUSE: (id: string) => `/promotions/${id}/pause`,
        REDEEM: (id: string) => `/promotions/${id}/redeem`,
        VALIDATE: '/promotions/validate',
    },

    // ============================
    // Reviews
    // ============================
    REVIEWS: {
        BY_ID: (id: string) => `/reviews/${id}`,
        MY: '/reviews/my',
        VOTE: (id: string) => `/reviews/${id}/vote`,
        REPORT: (id: string) => `/reviews/${id}/report`,
        RESPOND: (id: string) => `/reviews/${id}/respond`,
        RESPONSE: (id: string) => `/reviews/${id}/response`,
    },

    // ============================
    // Favorites
    // ============================
    FAVORITES: {
        BASE: '/favorites',
        BY_ID: (id: string) => `/favorites/${id}`,
        CHECK: '/favorites/check',
        COUNT: '/favorites/count',
    },

    // ============================
    // Search
    // ============================
    SEARCH: {
        BASE: '/search',
        NEARBY: '/search/nearby',
        SUGGESTIONS: '/search/suggestions',
    },

    // ============================
    // Inquiries
    // ============================
    INQUIRIES: {
        BY_ID: (id: string) => `/inquiries/${id}`,
        READ: (id: string) => `/inquiries/${id}/read`,
        REPLY: (id: string) => `/inquiries/${id}/reply`,
        SPAM: (id: string) => `/inquiries/${id}/spam`,
        CLOSE: (id: string) => `/inquiries/${id}/close`,
    },

    // ============================
    // Notifications
    // ============================
    NOTIFICATIONS: {
        BASE: '/notifications',
        UNREAD_COUNT: '/notifications/unread-count',
        BY_ID: (id: string) => `/notifications/${id}`,
        READ: (id: string) => `/notifications/${id}/read`,
        READ_ALL: '/notifications/read-all',
    },

    // ============================
    // Media
    // ============================
    MEDIA: {
        BY_ID: (id: string) => `/media/${id}`,
        SET_COVER: (id: string) => `/media/${id}/cover`,
        REORDER: '/media/reorder',
    },

    // ============================
    // Analytics
    // ============================
    ANALYTICS: {
        VIEW: '/analytics/view',
        CLICK: (type: string) => `/analytics/click/${type}`,
        ORGANIZATION: (id: string) => `/analytics/organizations/${id}`,
        DAILY: (id: string) => `/analytics/organizations/${id}/daily`,
    },

    // ============================
    // Verification
    // ============================
    VERIFICATION: {
        BY_ID: (id: string) => `/verification/${id}`,
    },

    // ============================
    // Admin
    // ============================
    ADMIN: {
        // Dashboard
        DASHBOARD_STATS: '/admin/dashboard/stats',
        DASHBOARD_SIGNUPS: '/admin/dashboard/signups',
        DASHBOARD_CATEGORIES: '/admin/dashboard/categories',
        DASHBOARD_CITIES: '/admin/dashboard/cities',

        // Verifications
        VERIFICATIONS: '/admin/verifications',
        VERIFICATIONS_COUNT: '/admin/verifications/count',
        VERIFICATION_BY_ID: (id: string) => `/admin/verifications/${id}`,
        APPROVE: (id: string) => `/admin/verifications/${id}/approve`,
        REJECT: (id: string) => `/admin/verifications/${id}/reject`,

        // Users
        USERS: '/admin/users',
        USER_BY_ID: (id: string) => `/admin/users/${id}`,
        USER_SUSPEND: (id: string) => `/admin/users/${id}/suspend`,
        USER_REACTIVATE: (id: string) => `/admin/users/${id}/reactivate`,
        USER_ROLE: (id: string) => `/admin/users/${id}/role`,

        // Organizations
        ORGANIZATIONS: '/admin/organizations',
        ORG_VERIFY: (id: string) => `/admin/organizations/${id}/verify`,
        ORG_UNVERIFY: (id: string) => `/admin/organizations/${id}/unverify`,
        ORG_SUSPEND: (id: string) => `/admin/organizations/${id}/suspend`,

        // Categories
        CATEGORIES: '/admin/categories',
        CATEGORY_BY_ID: (id: string) => `/admin/categories/${id}`,
        CATEGORIES_REORDER: '/admin/categories/reorder',

        // Reports
        REPORTS: '/admin/reports',
        REPORTS_COUNT: '/admin/reports/count',
        REPORT_BY_ID: (id: string) => `/admin/reports/${id}`,
        REPORT_RESOLVE: (id: string) => `/admin/reports/${id}/resolve`,
    },

    // ============================
    // Health
    // ============================
    HEALTH: {
        BASE: '/health',
        DETAILED: '/health/detailed',
        LIVE: '/health/live',
        READY: '/health/ready',
    },
} as const;
