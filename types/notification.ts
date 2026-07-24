import type { BaseEntity, PageResponse } from './api';

/**
 * Notification types
 */
export type NotificationType =
    | 'SYSTEM'
    | 'REVIEW'
    | 'VERIFICATION'
    | 'ORGANIZATION_STATUS'
    | 'PROMOTION'
    | 'INQUIRY';

/**
 * Notification entity
 */
export interface Notification extends BaseEntity {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    referenceId?: string; // id of related entity (review, org, etc.)
    referenceType?: string; // entity type name
    isRead: boolean;
    readAt?: string;
    createdAt: string;
    actionUrl?: string; // Optional direct link to action
}

/**
 * Notification list response
 */
export type NotificationListResponse = PageResponse<Notification>;
