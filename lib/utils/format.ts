import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Format a date string or Date object to a readable format
 */
export function formatDate(
    date: string | Date | null | undefined,
    formatString: string = 'dd MMM yyyy'
): string {
    if (!date) return '';

    const dateObj = typeof date === 'string' ? parseISO(date) : date;

    if (!isValid(dateObj)) return '';

    return format(dateObj, formatString, { locale: fr });
}

/**
 * Format a date to relative time (e.g., "il y a 2 heures")
 */
export function formatRelativeTime(date: string | Date | null | undefined): string {
    if (!date) return '';

    const dateObj = typeof date === 'string' ? parseISO(date) : date;

    if (!isValid(dateObj)) return '';

    return formatDistanceToNow(dateObj, { addSuffix: true, locale: fr });
}

/**
 * Format a date for display with time
 */
export function formatDateTime(date: string | Date | null | undefined): string {
    return formatDate(date, 'dd MMM yyyy à HH:mm');
}

/**
 * Format a price in XAF (CFA Franc)
 */
export function formatPrice(
    amount: number | null | undefined,
    currency: string = 'XAF'
): string {
    if (amount === null || amount === undefined) return '';

    // XAF doesn't use decimal places
    if (currency === 'XAF') {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XAF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    }

    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency,
    }).format(amount);
}

/**
 * Format a number with thousand separators
 */
export function formatNumber(value: number | null | undefined): string {
    if (value === null || value === undefined) return '';

    return new Intl.NumberFormat('fr-FR').format(value);
}

/**
 * Format a number as compact (e.g., 1.2K, 3.4M)
 */
export function formatCompactNumber(value: number | null | undefined): string {
    if (value === null || value === undefined) return '';

    return new Intl.NumberFormat('fr-FR', {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(value);
}

/**
 * Format a phone number (Cameroon format)
 */
export function formatPhone(phone: string | null | undefined): string {
    if (!phone) return '';

    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');

    // Cameroon format: +237 6XX XXX XXX
    if (digits.length === 9 && digits.startsWith('6')) {
        return `+237 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    }

    if (digits.length === 12 && digits.startsWith('237')) {
        return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
    }

    return phone;
}

/**
 * Format percentage
 */
export function formatPercent(value: number | null | undefined, decimals: number = 0): string {
    if (value === null || value === undefined) return '';

    return `${value.toFixed(decimals)}%`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string | null | undefined, maxLength: number = 100): string {
    if (!text) return '';

    if (text.length <= maxLength) return text;

    return `${text.slice(0, maxLength).trim()}...`;
}

/**
 * Generate initials from name
 */
export function getInitials(name: string | null | undefined): string {
    if (!name) return '';

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
        return parts[0]?.slice(0, 2).toUpperCase() ?? '';
    }

    return (
        (parts[0]?.charAt(0) ?? '') + (parts[parts.length - 1]?.charAt(0) ?? '')
    ).toUpperCase();
}

/**
 * Slugify a string
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim();
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
    let size = bytes;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

/**
 * Format rating (e.g., "4.5/5")
 */
export function formatRating(rating: number | null | undefined): string {
    if (rating === null || rating === undefined) return '-';

    return `${rating.toFixed(1)}/5`;
}
