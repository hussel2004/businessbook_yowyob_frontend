import { post, get, del, put } from './client';

// Types
export interface Inquiry {
    id: string;
    organizationId: string;
    organizationName: string;
    senderName: string;
    senderEmail: string;
    senderPhone?: string;
    subject: string;
    message: string;
    status: 'new' | 'read' | 'replied' | 'archived';
    isRead: boolean;
    reply?: InquiryReply;
    createdAt: string;
    updatedAt: string;
}

export interface InquiryReply {
    id: string;
    content: string;
    createdAt: string;
    sentVia?: 'email' | 'sms' | 'both';
}

export interface SendInquiryRequest {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}

export interface ReplyToInquiryRequest {
    content: string;
    sendVia?: 'email' | 'sms' | 'both';
}

// API Functions

/**
 * Get inquiries for an organization (owner only)
 */
export async function getOrganizationInquiries(
    orgId: string,
    params?: { page?: number; size?: number; status?: string }
): Promise<{ content: Inquiry[]; totalPages: number; totalElements: number }> {
    const response = await get<any>(`/organizations/${orgId}/inquiries`, params);
    if (Array.isArray(response)) {
        return { content: response, totalPages: 1, totalElements: response.length };
    }
    return response;
}

/**
 * Get unread inquiries count
 */
export async function getUnreadInquiriesCount(orgId: string): Promise<{ count: number }> {
    return get(`/organizations/${orgId}/inquiries/unread/count`);
}

/**
 * Get a single inquiry by ID
 */
export async function getInquiry(inquiryId: string): Promise<Inquiry> {
    return get(`/inquiries/${inquiryId}`);
}

/**
 * Send an inquiry to an organization (public)
 */
export async function sendInquiry(
    orgId: string,
    data: SendInquiryRequest
): Promise<Inquiry> {
    return post(`/organizations/${orgId}/inquiries`, data);
}

/**
 * Mark an inquiry as read
 */
export async function markInquiryAsRead(inquiryId: string): Promise<void> {
    return post(`/inquiries/${inquiryId}/read`, {});
}

/**
 * Reply to an inquiry
 */
export async function replyToInquiry(
    inquiryId: string,
    data: ReplyToInquiryRequest
): Promise<InquiryReply> {
    return post(`/inquiries/${inquiryId}/reply`, data);
}

/**
 * Archive an inquiry
 */
export async function archiveInquiry(inquiryId: string): Promise<void> {
    return post(`/inquiries/${inquiryId}/archive`, {});
}

/**
 * Delete an inquiry
 */
export async function deleteInquiry(inquiryId: string): Promise<void> {
    return del(`/inquiries/${inquiryId}`);
}
