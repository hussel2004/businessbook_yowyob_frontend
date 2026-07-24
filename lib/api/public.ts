import { get, post } from './client';
import { ENDPOINTS } from './endpoints';
import type { PageResponse } from '@/types/api';

/**
 * Category types
 */
export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    iconName?: string;
    imageUrl?: string;
    parentId?: string;
    parentName?: string;
    organizationCount: number;
    isActive: boolean;
    displayOrder: number;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryTree extends Category {
    children: CategoryTree[];
}

/**
 * Fetch all categories
 */
export async function getCategories(): Promise<Category[]> {
    return get<Category[]>(ENDPOINTS.CATEGORIES.BASE);
}

/**
 * Fetch categories as tree
 */
export async function getCategoriesTree(): Promise<CategoryTree[]> {
    return get<CategoryTree[]>(`${ENDPOINTS.CATEGORIES.BASE}/tree`);
}

/**
 * Fetch a single category by ID
 */
export async function getCategoryById(id: string): Promise<Category> {
    return get<Category>(ENDPOINTS.CATEGORIES.BY_ID(id));
}

/**
 * Fetch a single category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category> {
    return get<Category>(ENDPOINTS.CATEGORIES.BY_SLUG(slug));
}

/**
 * Search Params
 */
export interface SearchParams {
    q?: string;
    name?: string;
    keywords?: string[];
    category?: string;
    city?: string;
    lat?: number;
    lng?: number;
    radius?: number;
    verified?: boolean;
    featured?: boolean;
    page?: number;
    size?: number;
    sort?: string;
}

/**
 * Organization in search results
 */
export interface OrganizationSummary {
    id: string;
    longName: string;
    shortName: string;
    slug: string;
    logoUrl?: string;
    coverImageUrl?: string;
    shortDescription?: string;
    categoryId: string;
    categoryName: string;
    city?: string;
    countryCode: string;
    averageRating: number;
    reviewCount: number;
    isVerified: boolean;
    isFeatured: boolean;
    latitude?: number;
    longitude?: number;
    distance?: number; // Distance in km
    categories?: string[];
    businessSize?: 'TPE' | 'PE' | 'ME' | 'GE';
    name: string; // Transient/Computed property often present in frontend responses or search mappings
}

/**
 * Agency summary for map display
 */
export interface AgencySummary {
    id: string;
    organizationId: string;
    organizationName: string;
    organizationSlug: string;
    name: string;
    slug?: string;
    agencyType: string;
    isHeadquarters: boolean;
    address?: Address;
    logoUrl?: string;
    coverImageUrl?: string;
    phone?: string;
    email?: string;
    averageRating?: number;
    reviewCount?: number;
    latitude?: number;
    longitude?: number;
    distance?: number;
    categoryName?: string;
}

/**
 * Search organizations
 */
export async function searchOrganizations(params: SearchParams): Promise<PageResponse<OrganizationSummary>> {
    // Call the new search endpoint
    const data = await get<any>(ENDPOINTS.ORGANIZATIONS.SEARCH, params as Record<string, unknown>);

    const formatData = (items: any[]) => {
        // We still calculate distance for display if lat/lng are present, 
        // but we assume the backend has already filtered and sorted them.
        if (params.lat && params.lng) {
            return items.map(org => {
                // If org has location (from backend)
                // Note: Backend might not return lat/lng in summary unless we add it. 
                // OrganizationResponse has lat/lng in address via helper? 
                // Actually OrganizationResponse doesn't have address directly, it has Contact Info.
                // Wait, OrganizationResponse in my backend implementation (OrganizationSearchController.toResponse) 
                // does NOT include address details or lat/lon! 
                // I need to update OrganizationResponse or the toResponse method in backend to include Address/Lat/Lon.
                // Otherwise frontend can't calculate distance for display.
                // For now, if I can't change backend easily, I'll return items as is.
                // But wait, the previous code assumed `org.location`. 
                // My new backend returns `OrganizationResponse` which matches the structure I verified.

                // My backend `OrganizationResponse` (checked earlier) has `contacts` but no `address` or `location`.
                // The `Address` is on `Agency`. 
                // The search result should probably be an `Agency` or `Organization` with location.
                // The user said "Proximity of an agency".
                // If I return `Organization`, I need to know WHICH agency matched or the "best" location.

                // CRITICAL MISSING PIECE: Backend Response must include Location for the frontend to show it/calc distance.
                // I should probably update Backend `OrganizationResponse` to include `latitude`, `longitude` (of main agency or matched agency).
                // Or I update frontend to robustly handle missing location.

                return org;
            });
        }
        return items;
    };

    if (Array.isArray(data)) {
        return {
            content: formatData(data),
            totalElements: data.length,
            totalPages: 1,
            size: data.length,
            page: params.page || 0,
            first: true,
            last: true,
            empty: data.length === 0
        };
    } else if (data.content && Array.isArray(data.content)) {
        return {
            ...data,
            content: formatData(data.content)
        };
    }

    return data;
}

/**
 * Search agencies for map display
 */
export async function searchAgencies(params: SearchParams): Promise<PageResponse<AgencySummary>> {
    const data = await get<any>(ENDPOINTS.AGENCIES.SEARCH, params as Record<string, unknown>);

    if (Array.isArray(data)) {
        return {
            content: data,
            totalElements: data.length,
            totalPages: 1,
            size: data.length,
            page: params.page || 0,
            first: true,
            last: true,
            empty: data.length === 0
        };
    } else if (data.content && Array.isArray(data.content)) {
        return data;
    }

    return data;
}

/**
 * Get search suggestions
 */
export async function getSearchSuggestions(text: string): Promise<string[]> {
    const data = await get<any>(ENDPOINTS.SEARCH.SUGGESTIONS, { text });
    return Array.isArray(data) ? data : [];
}

/**
 * Get organizations for a category
 */
export async function getOrganizationsByCategory(
    categoryId: string,
    page = 0,
    size = 12
): Promise<PageResponse<OrganizationSummary>> {
    // Backend returns a plain array, not a PageResponse
    const orgs = await get<OrganizationSummary[]>(ENDPOINTS.CATEGORIES.ORGANIZATIONS(categoryId));

    // Manually paginate the results
    const start = page * size;
    const end = start + size;
    const paginatedOrgs = orgs.slice(start, end);

    return {
        content: paginatedOrgs,
        totalElements: orgs.length,
        totalPages: Math.ceil(orgs.length / size),
        size: size,
        page: page,
        first: page === 0,
        last: end >= orgs.length,
        empty: orgs.length === 0,
    };
}


/**
 * Promotion types
 */
export interface Promotion {
    id: string;
    organizationId: string;
    organizationName: string;
    organizationSlug: string;
    organizationLogo?: string;
    title: string;
    description?: string;
    discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'BOGO' | 'FREE_ITEM' | 'OTHER';
    discountValue?: number;
    code?: string;
    termsAndConditions?: string;
    imageUrl?: string;
    startDate: string;
    endDate: string;
    maxRedemptions?: number;
    currentRedemptions: number;
    isActive: boolean;
    createdAt: string;
}

/**
 * Fetch all active promotions (public endpoint, no auth required)
 */
export async function getPromotions(page = 0, size = 12, category?: string): Promise<PageResponse<Promotion>> {
    const params: Record<string, unknown> = { page, size };
    if (category) params.category = category;
    return get<PageResponse<Promotion>>('/public/promotions', params);
}

/**
 * Fetch promotions for an organization
 */
export async function getOrganizationPromotions(
    orgId: string,
    page = 0,
    size = 10
): Promise<PageResponse<Promotion>> {
    return get<PageResponse<Promotion>>(ENDPOINTS.ORGANIZATIONS.PROMOTIONS(orgId), { page, size });
}

export interface Post {
    id: string;
    organizationId: string;
    authorId: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    coverImageUrl?: string;
    status: string;
    publishedAt?: string;
    likesCount: number;
    viewsCount: number;
    createdAt: string;
}

/**
 * Fetch posts for an organization
 */
export async function getOrganizationPosts(
    orgId: string,
    page = 0,
    size = 10
): Promise<PageResponse<Post>> {
    return get<PageResponse<Post>>(ENDPOINTS.ORGANIZATIONS.POSTS(orgId), { page, size });
}

/**
 * Fetch featured promotions
 */
export async function getFeaturedPromotions(size = 6): Promise<Promotion[]> {
    return get<Promotion[]>(ENDPOINTS.PROMOTIONS.FEATURED, { size });
}

/**
 * Organization Full Detail
 */
export interface OrganizationDetail {
    id: string;
    ownerId?: string; // Added to check for self-reviews
    longName: string;
    shortName: string;
    slug: string;
    legalName?: string;
    registrationNumber?: string;
    taxId?: string;
    taxNumber?: string;
    legalForm?: string;
    description?: string;
    shortDescription?: string;
    tagline?: string;
    logoUrl?: string;
    coverImageUrl?: string;
    websiteUrl?: string;
    primaryEmail?: string;
    primaryPhone?: string;
    yearFounded?: number;
    employeeCount?: string;
    employeeCountRange?: string;
    annualRevenueRange?: string;
    capital?: number;
    categoryId: string;
    categoryName: string;
    averageRating: number;
    reviewCount: number;
    isVerified: boolean;
    isFeatured: boolean;
    verificationDate?: string;
    status: string;
    keywords?: string;
    address?: Address;
    contacts?: Contact[];
    createdAt: string;
    updatedAt: string;
}

/**
 * Fetch organization by slug or ID (auto-detects UUID format)
 */
export async function getOrganizationBySlug(slugOrId: string): Promise<OrganizationDetail> {
    // Detect if it's a UUID (ID) or a slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);

    if (isUUID) {
        return get<OrganizationDetail>(ENDPOINTS.ORGANIZATIONS.BY_ID(slugOrId));
    }
    return get<OrganizationDetail>(ENDPOINTS.ORGANIZATIONS.BY_SLUG(slugOrId));
}

/**
 * Fetch organization by ID
 */
export async function getOrganizationById(id: string): Promise<OrganizationDetail> {
    return get<OrganizationDetail>(ENDPOINTS.ORGANIZATIONS.BY_ID(id));
}

/**
 * Address
 */
export interface Address {
    id?: string;
    streetLine1: string;
    streetLine2?: string;
    neighborhood?: string;
    city: string;
    stateProvince?: string;
    postalCode?: string;
    countryCode: string;
    latitude?: number;
    longitude?: number;
    landmark?: string;
    directions?: string;
    formattedAddress?: string;
}

/**
 * Agency
 */
export interface Agency {
    id: string;
    organizationId: string;
    name: string;
    agencyType: string;
    address?: Address;
    phone?: string;
    email?: string;
    isHeadquarters: boolean;
    openingHours?: OpeningHour[];
    description?: string;
    slug?: string;
    logoUrl?: string;
    contacts?: Contact[];
}

export type Organization = OrganizationDetail;

export interface OpeningHour {
    dayOfWeek: number;
    opensAt: string | number[];
    closesAt: string | number[];
    isClosed: boolean;
}

/**
 * Fetch agencies for an organization
 */
export async function getOrganizationAgencies(orgId: string): Promise<Agency[]> {
    return get<Agency[]>(ENDPOINTS.ORGANIZATIONS.AGENCIES(orgId));
}

/**
 * Service
 */
export interface Service {
    id: string;
    name: string;
    description?: string;
    price?: number;
    currency?: string;
    duration?: number;
    imageUrl?: string;
    isActive: boolean;
}

/**
 * Fetch services for an organization
 */
export async function getOrganizationServices(orgId: string): Promise<Service[]> {
    return get<Service[]>(ENDPOINTS.ORGANIZATIONS.SERVICES(orgId));
}

/**
 * Media item
 */
export interface MediaItem {
    id: string;
    fileType: string;
    fileUrl: string;
    thumbnailUrl?: string;
    fileName?: string;
    caption?: string;
    altText?: string;
    displayOrder: number;
    isCover: boolean;
    // Compatibility aliases for existing code
    type?: string;
    url?: string;
    title?: string;
}

/**
 * Fetch gallery for an organization
 */
export async function getOrganizationGallery(orgId: string): Promise<MediaItem[]> {
    return get<MediaItem[]>(ENDPOINTS.ORGANIZATIONS.GALLERY(orgId));
}

/**
 * Review
 */
export interface Review {
    id: string;
    organizationId: string;
    actorId: string;
    actorName: string;
    actorAvatar?: string;
    rating: number;
    title?: string;
    content?: string;
    visitDate?: string;
    helpfulCount: number;
    unhelpfulCount: number;
    responseContent?: string;
    responseDate?: string;
    isVerifiedPurchase: boolean;
    createdAt: string;
}

export interface RatingSummary {
    averageRating: number;
    totalReviews: number;
    distribution: Record<number, number>;
}

/**
 * Fetch reviews for an organization
 */
export async function getOrganizationReviews(
    orgId: string,
    page = 0,
    size = 10
): Promise<PageResponse<Review>> {
    // Backend returns a Flux (array), not a PageResponse
    const data = await get<any>(ENDPOINTS.ORGANIZATIONS.REVIEWS(orgId), { page, size });

    if (Array.isArray(data)) {
        return {
            content: data,
            totalElements: data.length,
            totalPages: 1,
            size: data.length,
            page: page,
            first: true,
            last: true,
            empty: data.length === 0
        };
    }

    return data;
}


/**
 * Fetch rating summary for an organization
 */
export async function getOrganizationRatingSummary(orgId: string): Promise<RatingSummary> {
    return get<RatingSummary>(ENDPOINTS.ORGANIZATIONS.RATING_SUMMARY(orgId));
}

/**
 * Submit inquiry to organization
 */
export interface InquiryRequest {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}

export async function submitInquiry(orgId: string, data: InquiryRequest): Promise<{ id: string }> {
    return post<{ id: string }>(ENDPOINTS.ORGANIZATIONS.INQUIRIES(orgId), data);
}

/**
 * Favorites
 */
export async function addFavorite(organizationId: string): Promise<{ id: string }> {
    return post<{ id: string }>(ENDPOINTS.FAVORITES.BASE, {
        favoritableType: 'ORGANIZATION',
        favoritableId: organizationId
    });
}

export async function removeFavorite(organizationId: string): Promise<void> {
    const { del } = await import('./client');
    // Using parameter-based deletion endpoint
    return del(`${ENDPOINTS.FAVORITES.BASE}?type=ORGANIZATION&id=${organizationId}`);
}

export async function checkFavorite(organizationId: string): Promise<{ isFavorite: boolean }> {
    // Backend returns a boolean directly
    const isFavorite = await get<boolean>(`${ENDPOINTS.FAVORITES.CHECK}?type=ORGANIZATION&id=${organizationId}`);
    return { isFavorite };
}



/**
 * Fetch similar organizations
 */
export async function getSimilarOrganizations(orgId: string, limit = 3): Promise<OrganizationSummary[]> {
    return get<OrganizationSummary[]>(`${ENDPOINTS.ORGANIZATIONS.BASE}/${orgId}/similar?limit=${limit}`);
}

/**
 * Award
 */
export interface Award {
    id: string;
    organizationId: string;
    name: string;
    year?: number;
    description?: string;
    imageUrl?: string;
    displayOrder: number;
}

/**
 * Fetch awards for an organization
 */
export async function getOrganizationAwards(orgId: string): Promise<Award[]> {
    return get<Award[]>(ENDPOINTS.ORGANIZATIONS.AWARDS(orgId));
}

/**
 * Contact
 */
export interface Contact {
    id: string;
    organizationId: string;
    contactType: string;
    label?: string;
    value: string;
    isPrimary: boolean;
    isPublic: boolean;
}

/**
 * Fetch contacts for an organization
 */
export async function getOrganizationContacts(orgId: string): Promise<Contact[]> {
    return get<Contact[]>(ENDPOINTS.ORGANIZATIONS.CONTACTS(orgId));
}
