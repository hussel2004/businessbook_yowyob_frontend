import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and tailwind-merge.
 * This utility handles conditional classes and automatically resolves
 * Tailwind CSS class conflicts.
 *
 * @example
 * cn('px-4 py-2', condition && 'bg-blue-500', 'px-6')
 * // => 'py-2 bg-blue-500 px-6' (px-4 is replaced by px-6)
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}
