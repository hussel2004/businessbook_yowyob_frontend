import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getApiBaseUrl } from './endpoints';
import { getAccessToken, clearTokens, getKernelTenantId, getKernelOrganizationId } from '@/lib/auth/storage';

/**
 * API Error structure returned by the backend
 */
export interface ApiError {
    status?: number;
    error?: string;
    code?: string;
    message: string;
    details?: Record<string, string>;
    timestamp?: string;
    path?: string;
}

/**
 * Custom error class for API errors
 */
export class ApiException extends Error {
    public readonly code: string;
    public readonly status: number;
    public readonly details?: Record<string, string>;

    constructor(message: string, code: string, status: number, details?: Record<string, string>) {
        super(message);
        this.name = 'ApiException';
        this.code = code;
        this.status = status;
        this.details = details;
    }
}

/**
 * Create and configure the Axios instance
 */
function createApiClient(): AxiosInstance {
    const client = axios.create({
        timeout: 60000,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    });

    // ============================
    // Request Interceptor
    // ============================
    client.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            // Résolu à chaque requête (pas au chargement du module) pour ne
            // jamais figer une valeur calculée côté serveur dans un chunk
            // envoyé au navigateur.
            if (!config.baseURL) {
                config.baseURL = getApiBaseUrl();
            }

            // Add auth token if available
            const token = getAccessToken();
            const isAuthRequest = config.url?.includes('/auth/identify')
                || config.url?.includes('/auth/discover-contexts')
                || config.url?.includes('/auth/select-context')
                || config.url?.includes('/auth/sign-up')
                || config.url?.includes('/auth/forgot-password')
                || config.url?.includes('/auth/reset-password');

            if (token && config.headers && !isAuthRequest) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            // Contexte kernel (tenant + organisation) résolu dynamiquement
            const tenantId = getKernelTenantId();
            const orgId = getKernelOrganizationId();
            if (tenantId && config.headers) config.headers['X-Tenant-Id'] = tenantId;
            if (orgId && config.headers) config.headers['X-Organization-Id'] = orgId;

            // Add request ID for tracing
            config.headers['X-Request-ID'] = generateRequestId();

            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // ============================
    // Response Interceptor
    // ============================
    client.interceptors.response.use(
        (response) => {
            // Return data directly for successful responses
            return response;
        },
        async (error: AxiosError<ApiError>) => {
            // JWT kernel TTL = 900s, pas de refresh token — on vide la session sur 401
            if (error.response?.status === 401) {
                const url = (error.config as InternalAxiosRequestConfig)?.url ?? '';
                if (!url.includes('/auth/')) {
                    clearTokens();
                    // AuthGuard dans le frontend redirigera vers /login
                }
            }

            const apiError = transformError(error);
            return Promise.reject(apiError);
        }
    );

    return client;
}

/**
 * Transform Axios error to ApiException
 */
function transformError(error: AxiosError<ApiError>): ApiException {
    const status = error.response?.status || 500;
    const data = error.response?.data;

    // If backend returned structured error
    if (data?.message) {
        // The message may be a JSON string forwarded from the kernel — extract the inner message
        let userMessage = data.message;
        let errorCode = data.error || data.code || 'ERROR';
        try {
            const kernelPayload = JSON.parse(data.message);
            if (kernelPayload?.message) userMessage = kernelPayload.message;
            if (kernelPayload?.errorCode) errorCode = kernelPayload.errorCode;
        } catch {
            // Not JSON, use as-is
        }
        return new ApiException(userMessage, errorCode, status, data.details);
    }

    // Default error messages by status code
    const errorMessages: Record<number, { code: string; message: string }> = {
        400: { code: 'BAD_REQUEST', message: 'Requête invalide' },
        401: { code: 'UNAUTHORIZED', message: 'Veuillez vous connecter' },
        403: { code: 'FORBIDDEN', message: 'Accès non autorisé' },
        404: { code: 'NOT_FOUND', message: 'Ressource non trouvée' },
        409: { code: 'CONFLICT', message: 'Cette ressource existe déjà' },
        422: { code: 'VALIDATION_ERROR', message: 'Données invalides' },
        429: { code: 'RATE_LIMITED', message: 'Trop de requêtes, veuillez patienter' },
        500: { code: 'SERVER_ERROR', message: 'Erreur serveur, veuillez réessayer' },
        502: { code: 'BAD_GATEWAY', message: 'Service temporairement indisponible' },
        503: { code: 'SERVICE_UNAVAILABLE', message: 'Service en maintenance' },
    };

    const errorInfo = errorMessages[status] || {
        code: 'UNKNOWN_ERROR',
        message: error.message || 'Une erreur est survenue',
    };

    return new ApiException(errorInfo.message, errorInfo.code, status);
}

/**
 * Generate unique request ID for tracing
 */
function generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * The configured API client instance
 */
export const apiClient = createApiClient();

/**
 * Helper for GET requests
 */
export async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await apiClient.get<T>(url, { params });
    return response.data;
}

/**
 * Helper for POST requests
 */
export async function post<T>(url: string, data?: unknown): Promise<T> {
    const response = await apiClient.post<T>(url, data);
    return response.data;
}

/**
 * Helper for PUT requests
 */
export async function put<T>(url: string, data?: unknown): Promise<T> {
    const response = await apiClient.put<T>(url, data);
    return response.data;
}

/**
 * Helper for PATCH requests
 */
export async function patch<T>(url: string, data?: unknown): Promise<T> {
    const response = await apiClient.patch<T>(url, data);
    return response.data;
}

/**
 * Helper for DELETE requests
 */
export async function del<T = void>(url: string): Promise<T> {
    const response = await apiClient.delete<T>(url);
    return response.data;
}

/**
 * Helper for file uploads
 */
export async function upload<T>(
    url: string,
    file: File,
    additionalData?: Record<string, unknown>
): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
            formData.append(key, String(value));
        });
    }

    const response = await apiClient.post<T>(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
}
