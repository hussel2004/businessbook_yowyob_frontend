/**
 * Tarification Boost & Publicités — montants en XAF (FCFA).
 *
 * Alignée sur le catalogue du kernel (`GET /api/service-pricing`), qui facture
 * chaque service 1 000 XAF/mois et 10 000 XAF/an. Le kernel ne connaît que
 * MONTHLY et YEARLY : le palier trimestriel est propre à BusinessBook et
 * s'intercale entre les deux.
 *
 * NOTE : tarifs encore définis côté frontend pour l'affichage. La doc du kernel
 * impose que le montant réellement encaissé ne vienne JAMAIS du front — au
 * branchement du paiement, ces valeurs devront être servies (et surtout
 * revalidées) par le backend. Voir TODO(payment-api).
 */

// ============================
// Abonnement Boost
// ============================

export type BillingCycle = 'monthly' | 'quarterly' | 'yearly';

export interface BoostPlan {
    cycle: BillingCycle;
    /** Nombre de mois couverts */
    months: number;
    /** Prix total de la période (XAF), déjà remisé */
    totalPrice: number;
}

/** Tarif de référence mensuel, repris du catalogue kernel. */
export const BOOST_MONTHLY_PRICE = 1_000;

export const BOOST_PLANS: BoostPlan[] = [
    { cycle: 'monthly', months: 1, totalPrice: BOOST_MONTHLY_PRICE },
    // Palier intermédiaire BusinessBook (le kernel n'a pas de trimestriel)
    { cycle: 'quarterly', months: 3, totalPrice: 2_800 },
    // Tarif annuel du kernel
    { cycle: 'yearly', months: 12, totalPrice: 10_000 },
];

export function getBoostPlan(cycle: BillingCycle): BoostPlan {
    return BOOST_PLANS.find((p) => p.cycle === cycle) ?? BOOST_PLANS[0]!;
}

/** Prix total de la période, réduction incluse */
export function getBoostTotalPrice(plan: BoostPlan): number {
    return plan.totalPrice;
}

/** Prix mensuel équivalent, réduction incluse */
export function getBoostMonthlyEquivalent(plan: BoostPlan): number {
    return Math.round(plan.totalPrice / plan.months);
}

/**
 * Économie réalisée par rapport au paiement mensuel, en % arrondi.
 * Dérivée du prix réel plutôt que l'inverse : les tarifs kernel sont des
 * montants ronds, pas des remises rondes (10 000 €/an = -16,67 %).
 */
export function getBoostDiscountPercent(plan: BoostPlan): number {
    const withoutDiscount = BOOST_MONTHLY_PRICE * plan.months;
    if (withoutDiscount <= 0) return 0;
    return Math.round((1 - plan.totalPrice / withoutDiscount) * 100);
}

// ============================
// Publicités
// ============================

/**
 * Emplacements publicitaires, du plus visible au moins visible.
 * `id` correspond au champ `adType`/`slot` du backend.
 */
export type AdPlacementId =
    | 'POPUP'
    | 'HOME_HERO'
    | 'HOME_SIDEBAR'
    | 'SEARCH_SIDEBAR'
    | 'ORG_DETAIL_SIDEBAR';

export interface AdPlacement {
    id: AdPlacementId;
    /** Tarif journalier en XAF */
    dailyRate: number;
    /** Niveau de visibilité (1 à 5) — pour l'affichage */
    visibilityLevel: number;
}

/**
 * Tarifs journaliers calés sur l'échelle du kernel : une semaine de l'emplacement
 * le plus visible (3 500 XAF) reste sous le prix d'un abonnement Boost annuel.
 */
export const AD_PLACEMENTS: AdPlacement[] = [
    { id: 'POPUP', dailyRate: 500, visibilityLevel: 5 },
    { id: 'HOME_HERO', dailyRate: 300, visibilityLevel: 4 },
    { id: 'HOME_SIDEBAR', dailyRate: 200, visibilityLevel: 3 },
    { id: 'SEARCH_SIDEBAR', dailyRate: 150, visibilityLevel: 2 },
    { id: 'ORG_DETAIL_SIDEBAR', dailyRate: 100, visibilityLevel: 1 },
];

/** Durées proposées (jours) avec réduction longue durée */
export const AD_DURATIONS: { days: number; discountPercent: number }[] = [
    { days: 7, discountPercent: 0 },
    { days: 14, discountPercent: 5 },
    { days: 30, discountPercent: 10 },
    { days: 60, discountPercent: 15 },
    { days: 90, discountPercent: 20 },
];

export function getAdPlacement(id: AdPlacementId): AdPlacement {
    return AD_PLACEMENTS.find((p) => p.id === id) ?? AD_PLACEMENTS[0]!;
}

export interface AdPriceQuote {
    dailyRate: number;
    days: number;
    basePrice: number;
    discountPercent: number;
    discountAmount: number;
    totalPrice: number;
}

export function getAdPriceQuote(placementId: AdPlacementId, days: number): AdPriceQuote {
    const placement = getAdPlacement(placementId);
    const duration = AD_DURATIONS.find((d) => d.days === days);
    const discountPercent = duration?.discountPercent ?? 0;
    const basePrice = placement.dailyRate * days;
    const discountAmount = Math.round(basePrice * (discountPercent / 100));
    return {
        dailyRate: placement.dailyRate,
        days,
        basePrice,
        discountPercent,
        discountAmount,
        totalPrice: basePrice - discountAmount,
    };
}
