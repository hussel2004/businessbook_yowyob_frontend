import type { BillingCycle } from '@/lib/constants/billing';
import type { PaymentResult } from './payments';

/**
 * Abonnement Boost d'une organisation.
 *
 * TODO(payment-api) : en attendant les endpoints backend
 * (`GET/POST /organizations/{orgId}/boost`), l'abonnement est persisté
 * en localStorage pour permettre de tester le parcours complet.
 * Le backend pourra s'appuyer sur `Organization.isFeatured` /
 * `featuredUntil` pour prioriser les résultats de recherche.
 */

export interface BoostSubscription {
    organizationId: string;
    cycle: BillingCycle;
    /** Montant payé pour la période (XAF) */
    amountPaid: number;
    startedAt: string;
    /** Fin de la période en cours */
    expiresAt: string;
    transactionId: string;
    status: 'ACTIVE' | 'EXPIRED';
}

const STORAGE_KEY = 'bb_boost_subscriptions';

function readAll(): Record<string, BoostSubscription> {
    if (typeof window === 'undefined') return {};
    try {
        return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}');
    } catch {
        return {};
    }
}

function writeAll(data: Record<string, BoostSubscription>): void {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function getBoostSubscription(
    organizationId: string
): Promise<BoostSubscription | null> {
    // TODO(payment-api): GET /organizations/{orgId}/boost
    const sub = readAll()[organizationId];
    if (!sub) return null;

    if (new Date(sub.expiresAt).getTime() < Date.now()) {
        return { ...sub, status: 'EXPIRED' };
    }
    return sub;
}

export async function activateBoost(params: {
    organizationId: string;
    cycle: BillingCycle;
    months: number;
    amountPaid: number;
    payment: PaymentResult;
}): Promise<BoostSubscription> {
    // TODO(payment-api): POST /organizations/{orgId}/boost après paiement confirmé
    const now = new Date();
    const expires = new Date(now);
    expires.setMonth(expires.getMonth() + params.months);

    const sub: BoostSubscription = {
        organizationId: params.organizationId,
        cycle: params.cycle,
        amountPaid: params.amountPaid,
        startedAt: now.toISOString(),
        expiresAt: expires.toISOString(),
        transactionId: params.payment.transactionId,
        status: 'ACTIVE',
    };

    const all = readAll();
    all[params.organizationId] = sub;
    writeAll(all);

    return sub;
}
