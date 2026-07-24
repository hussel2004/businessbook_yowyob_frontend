import type { BaseEntity } from './api';

/**
 * Category response
 */
export interface Category {
    id: string;
    parentId?: string;
    code: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    color?: string;
    imageUrl?: string;
    level: number;
    organizationCount: number;
    hasChildren: boolean;
    sortOrder: number;
    children?: Category[];
}

/**
 * Category tree item
 */
export interface CategoryTree extends Category {
    children: CategoryTree[];
}

/**
 * Service offered by organization
 */
export interface Service extends BaseEntity {
    organizationId: string;
    agencyId?: string;
    categoryId?: string;
    name: string;
    description?: string;
    priceType: 'fixed' | 'range' | 'from' | 'negotiable' | 'free';
    priceMin?: number;
    priceMax?: number;
    currency: string;
    priceUnit?: string;
    durationMinutes?: number;
    imageUrl?: string;
    isActive: boolean;
    sortOrder: number;
}

/**
 * Create service request
 */
export interface CreateServiceRequest {
    agencyId?: string;
    categoryId?: string;
    name: string;
    description?: string;
    priceType: Service['priceType'];
    priceMin?: number;
    priceMax?: number;
    currency?: string;
    priceUnit?: string;
    durationMinutes?: number;
    imageUrl?: string;
}
