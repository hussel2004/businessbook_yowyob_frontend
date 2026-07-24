import { post, get } from './client';
import { setTokens, clearTokens, setKernelContext } from '@/lib/auth/storage';
import type {
    KernelWrapper,
    DiscoverContextsResponse,
    SelectContextResponse,
    ForgotPasswordResponse,
    IssuedAuthChallengeResponse,
    User,
} from '@/types/user';

const AUTH = {
    IDENTIFY: '/auth/identify',
    DISCOVER_CONTEXTS: '/auth/discover-contexts',
    SELECT_CONTEXT: '/auth/select-context',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
} as const;

// ── Flux multi-contexte kernel ──────────────────────────────────────────────

/**
 * Étape 0 (optionnelle) — vérifie si le compte existe dans le kernel.
 */
export async function identifyUser(principal: string): Promise<unknown> {
    return post(AUTH.IDENTIFY, { principal });
}

/**
 * Étape 1 — soumet email+password, le kernel retourne la liste des contextes (tenants).
 * Aucun X-Tenant-Id requis côté client.
 */
export async function discoverContexts(
    email: string,
    password: string
): Promise<KernelWrapper<DiscoverContextsResponse>> {
    return post<KernelWrapper<DiscoverContextsResponse>>(AUTH.DISCOVER_CONTEXTS, { email, password });
}

/**
 * Étape 2 — sélectionne un contexte, reçoit le JWT kernel final.
 * Stocke le token et le contexte (tenantId + organizationId) localement.
 */
export async function selectContext(
    selectionToken: string,
    contextId: string,
    organizationId?: string
): Promise<KernelWrapper<SelectContextResponse>> {
    const response = await post<KernelWrapper<SelectContextResponse>>(AUTH.SELECT_CONTEXT, {
        selectionToken,
        contextId,
        organizationId: organizationId ?? null,
    });

    if (response.success && response.data?.session?.accessToken) {
        // Pas de refreshToken avec le kernel — TTL 900s, re-auth via discover-contexts
        setTokens(response.data.session.accessToken, '');
        setKernelContext(
            response.data.selectedTenantId,
            response.data.selectedOrganizationId ?? null
        );
    }

    return response;
}

/**
 * Login simplifié (mono-tenant) : discover-contexts puis select-context automatique.
 * Utilisé par le LoginForm quand l'utilisateur a un seul contexte.
 */
export async function login(email: string, password: string): Promise<SelectContextResponse> {
    const discovered = await discoverContexts(email, password);

    if (!discovered.success || !discovered.data?.contexts?.length) {
        throw new Error(discovered.message || 'Identifiants invalides');
    }

    const contexts = discovered.data.contexts;

    // Si un seul contexte sans organisation → sélection automatique
    const firstCtx = contexts[0];
    if (contexts.length === 1 && firstCtx && (!firstCtx.organizations || firstCtx.organizations.length <= 1)) {
        const orgId = firstCtx.organizations?.[0]?.id;
        const result = await selectContext(discovered.data.selectionToken, firstCtx.contextId, orgId);
        if (!result.success) throw new Error(result.message || 'Connexion échouée');
        return result.data;
    }

    // Plusieurs contextes → le caller doit afficher le sélecteur
    // On retourne un objet spécial pour signaler ce cas
    return {
        _needsContextSelection: true,
        selectionToken: discovered.data.selectionToken,
        contexts: discovered.data.contexts,
    } as unknown as SelectContextResponse;
}

/**
 * Informations de l'utilisateur courant (extraites du JWT kernel côté backend).
 */
export async function getCurrentUser(): Promise<User> {
    return get<User>(AUTH.ME);
}

/**
 * Logout : supprime les tokens locaux. Le JWT kernel expire naturellement (TTL 900s).
 */
export async function logout(): Promise<void> {
    try {
        await post(AUTH.LOGOUT);
    } finally {
        clearTokens();
    }
}

/**
 * Création de compte via le kernel (sign-up = nouveau tenant owner).
 */
export async function register(data: {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    accountType: string;
}): Promise<unknown> {
    return post('/auth/sign-up', data);
}

/**
 * Étape 1/3 — découvre les comptes (potentiellement dans plusieurs tenants) correspondant à cet
 * email et retourne un selectionToken. N'envoie AUCUN email à ce stade.
 */
export async function forgotPassword(email: string): Promise<KernelWrapper<ForgotPasswordResponse>> {
    return post<KernelWrapper<ForgotPasswordResponse>>('/auth/forgot-password', { email });
}

/**
 * Étape 2/3 — sélectionne le compte (contextId) parmi ceux renvoyés par forgotPassword et
 * déclenche l'envoi effectif de l'email de réinitialisation par le kernel.
 */
export async function issuePasswordReset(
    selectionToken: string,
    contextId: string
): Promise<KernelWrapper<IssuedAuthChallengeResponse>> {
    return post<KernelWrapper<IssuedAuthChallengeResponse>>('/auth/password-reset/issue', {
        selectionToken,
        contextId,
    });
}

/**
 * Étape 3/3 — complète la réinitialisation avec le resetToken reçu par email (distinct du
 * selectionToken de l'étape 1).
 */
export async function resetPassword(resetToken: string, newPassword: string): Promise<KernelWrapper<unknown>> {
    return post<KernelWrapper<unknown>>('/auth/reset-password', { resetToken, newPassword });
}

/**
 * Confirme la vérification d'email avec le verificationToken reçu par email (distinct du
 * resetToken de mot de passe).
 */
export async function confirmEmailVerification(verificationToken: string): Promise<KernelWrapper<unknown>> {
    return post<KernelWrapper<unknown>>('/auth/email-verification/confirm', { verificationToken });
}

/**
 * Découvre le(s) compte(s) (potentiellement plusieurs tenants) correspondant à cet email, afin de
 * connaître le(s) tenantId nécessaire(s) pour déclencher un renvoi (même mécanisme que
 * forgotPassword — réutilisé ici pour un besoin différent : retrouver le tenant d'un compte non
 * encore vérifié, alors qu'aucune session n'existe).
 */
export async function discoverAccountsByEmail(email: string): Promise<KernelWrapper<ForgotPasswordResponse>> {
    return forgotPassword(email);
}

/**
 * Renvoi de l'email de vérification pour un utilisateur non connecté (mode strict — pas de
 * session tant que l'email n'est pas vérifié). Le tenantId doit avoir été découvert au préalable
 * via discoverAccountsByEmail().
 */
export async function resendEmailVerification(
    email: string,
    tenantId: string
): Promise<KernelWrapper<IssuedAuthChallengeResponse>> {
    return post<KernelWrapper<IssuedAuthChallengeResponse>>('/auth/email-verification/resend', {
        email,
        tenantId,
    });
}

// ── Types exportés pour les hooks ──────────────────────────────────────────

export interface LoginResult {
    needsContextSelection: boolean;
    selectionToken?: string;
    contexts?: DiscoverContextsResponse['contexts'];
    session?: SelectContextResponse;
}
