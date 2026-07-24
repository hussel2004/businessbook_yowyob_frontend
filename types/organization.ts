/**
 * Organization Domain Types
 */

export interface Organization {
    id: string;
    ownerId: string;
    code: string;
    longName: string;
    shortName: string;
    slug: string;
    tagline?: string;
    description?: string;
    logoUrl?: string;
    logoThumbnailUrl?: string;
    coverImageUrl?: string;
    legalForm?: string;
    registrationNumber?: string;
    taxNumber?: string;
    yearFounded?: number;
    employeeCountRange?: string;
    annualRevenueRange?: string;
    capital?: number;
    websiteUrl?: string;
    spokenLanguages?: string[];
    acceptedPaymentMethods?: string[];
    status: 'draft' | 'active' | 'suspended' | 'archived';
    isVerified: boolean;
    verifiedAt?: string;
    isFeatured: boolean;
    featuredUntil?: string;
    keywords?: string[];
    address?: Address;
    contacts?: ContactInfo[];
    profileCompletionPct: number;
    createdAt: string;
    updatedAt: string;
}

export interface Agency {
    id: string;
    organizationId: string;
    name?: string;
    description?: string;
    agencyType: 'headquarters' | 'office' | 'store' | 'warehouse' | 'factory' | 'other';
    isHeadquarters: boolean;

    logoUrl?: string;
    coverImageUrl?: string;
    address?: Address;
    contacts?: ContactInfo[];
    phoneNumber?: string;
    email?: string;
    openingHours?: OpeningHour[];
    createdAt: string;
    updatedAt: string;
}

export interface Address {
    id: string;
    addressType: 'office' | 'store' | 'warehouse' | 'home' | 'other';
    label?: string;
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
    isDefault: boolean;
    isPublic: boolean;
}

export interface OpeningHour {
    id?: string;
    agencyId?: string;
    dayOfWeek: number; // 1 = Monday, 7 = Sunday
    opensAt?: string;  // "HH:mm"
    closesAt?: string; // "HH:mm"
    isClosed: boolean;
    is24h: boolean;
    opensAt2?: string; // For split hours (e.g., lunch break)
    closesAt2?: string;
    notes?: string;
}

export interface Service {
    id: string;
    organizationId: string;
    agencyId?: string;
    categoryId?: string;
    name: string;
    description?: string;
    priceType: 'fixed' | 'range' | 'starting_from' | 'by_quote' | 'free';
    priceMin?: number;
    priceMax?: number;
    currency: string;
    priceUnit?: string;
    durationMinutes?: number;
    imageUrl?: string;
    isActive: boolean;
    displayOrder: number;
    createdAt: string;
    updatedAt: string;
}

export interface ContactInfo {
    id: string;
    contactType: 'phone' | 'email' | 'whatsapp' | 'telegram' | 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube' | 'other';
    label?: string;
    value: string;
    isPrimary: boolean;
    isPublic: boolean;
}

export interface OrganizationMedia {
    id: string;
    mediableType: 'organization' | 'agency' | 'post' | 'promotion' | 'service';
    mediableId: string;
    fileUrl: string;
    fileName: string;
    fileType: 'image' | 'video' | 'document' | 'audio';
    mimeType: string;
    fileSizeBytes: number;
    thumbnailUrl?: string;
    mediumUrl?: string;
    altText?: string;
    caption?: string;
    width?: number;
    height?: number;
    durationSeconds?: number;
    isCover: boolean;
    isPublic: boolean;
    displayOrder: number;
    createdAt: string;
    updatedAt: string;
}

export interface Post {
    id: string;
    organizationId: string;
    authorId: string;
    postType: 'article' | 'news' | 'announcement' | 'event';
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    coverImageUrl?: string;
    status: 'draft' | 'published' | 'archived';
    publishedAt?: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    isLikedByUser?: boolean;
    mediaIds?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface Promotion {
    id: string;
    organizationId: string;
    agencyId?: string;
    title: string;
    description?: string;
    promoType: 'discount' | 'offer' | 'flash_sale' | 'bundle' | 'loyalty' | 'referral' | 'other';
    discountType?: 'percentage' | 'fixed_amount' | 'buy_x_get_y';
    discountValue?: number;
    promoCode?: string;
    imageUrl?: string;
    termsConditions?: string;
    startDate: string;
    endDate: string;
    maxUses?: number;
    usedCount: number;
    status: 'draft' | 'active' | 'paused' | 'expired' | 'cancelled';
    createdAt: string;
    updatedAt: string;
}

export interface VerificationDocument {
    id: string;
    organizationId: string;
    documentType: 'business_license' | 'tax_certificate' | 'id_card' | 'ownership_proof' | 'other';
    documentNumber?: string;
    fileUrl: string;
    fileName: string;
    issueDate?: string;
    expiryDate?: string;
    issuingAuthority?: string;
    status: 'pending' | 'approved' | 'rejected';
    reviewedBy?: string;
    reviewedAt?: string;
    rejectionReason?: string;
    adminNotes?: string;
    createdAt: string;
    updatedAt: string;
}

// Form Input Types
export interface CreateAgencyInput {
    name: string;
    description?: string;
    agencyType: string;
    isHeadquarters: boolean;
    address?: CreateAddressInput;
    contacts?: CreateContactInput[];
    logoUrl?: string;
    coverImageUrl?: string;
}

export interface CreatePostInput {
    postType: string;
    title: string;
    content: string;
    excerpt?: string;
    coverImageUrl?: string;
    mediaIds?: string[];
}

export interface CreatePromotionInput {
    agencyId?: string;
    title: string;
    description?: string;
    promoType: string;
    discountType?: string;
    discountValue?: number;
    promoCode?: string;
    imageUrl?: string;
    termsConditions?: string;
    startDate: string;
    endDate: string;
    maxUses?: number;
}

export interface CreateVerificationInput {
    documentType: string;
    documentNumber?: string;
    fileUrl: string;
    fileName: string;
    issueDate?: string;
    expiryDate?: string;
    issuingAuthority?: string;
}

export interface CreateAddressInput {
    addressType: string;
    label?: string;
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
    isDefault: boolean;
    isPublic: boolean;
}

export interface CreateContactInput {
    contactType: string;
    label?: string;
    value: string;
    isPrimary: boolean;
    isPublic: boolean;
}
