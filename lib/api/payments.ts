/**
 * API de paiement — MODE DÉMO.
 *
 * TODO(payment-api) : le Swagger de l'API de paiement YowYob n'est pas
 * encore disponible. Toutes les fonctions de ce fichier simulent un
 * paiement réussi après un court délai. Quand l'API sera disponible :
 *   1. Remplacer `initiatePayment` par un appel réel (init + polling/webhook).
 *   2. Supprimer le délai simulé et le flag `PAYMENTS_DEMO_MODE`.
 *   3. Déplacer la tarification (lib/constants/billing.ts) côté backend.
 */

export const PAYMENTS_DEMO_MODE = true;

export type PaymentMethod = 'MTN_MOMO' | 'ORANGE_MONEY';

export interface PaymentRequest {
    /** Montant en XAF */
    amount: number;
    method: PaymentMethod;
    /** Numéro Mobile Money (9 chiffres, format camerounais) */
    phoneNumber: string;
    /** Référence lisible de l'achat (ex: BOOST-<orgId>, AD-<orgId>) */
    reference: string;
    description?: string;
}

export interface PaymentResult {
    transactionId: string;
    status: 'SUCCESS' | 'FAILED' | 'PENDING';
    amount: number;
    method: PaymentMethod;
    completedAt: string;
}

export function isValidMomoNumber(phone: string): boolean {
    const digits = phone.replace(/\D/g, '');
    return /^6\d{8}$/.test(digits) || /^2376\d{8}$/.test(digits);
}

/**
 * Initie un paiement Mobile Money.
 * DÉMO : résout toujours en SUCCESS après ~2s.
 */
export async function initiatePayment(request: PaymentRequest): Promise<PaymentResult> {
    // TODO(payment-api): remplacer par l'appel réel
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return {
        transactionId: `DEMO-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        status: 'SUCCESS',
        amount: request.amount,
        method: request.method,
        completedAt: new Date().toISOString(),
    };
}
