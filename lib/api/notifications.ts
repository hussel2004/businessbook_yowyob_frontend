import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { Notification, NotificationListResponse } from '@/types/notification';

/**
 * Get user notifications
 */
export async function getNotifications(params?: {
    page?: number;
    size?: number;
    isRead?: boolean;
}): Promise<NotificationListResponse> {
    const response = await apiClient.get<NotificationListResponse>(ENDPOINTS.NOTIFICATIONS.BASE, { params });
    return response.data;
}

/**
 * Get unread notification count
 */
export async function getUnreadNotificationCount(): Promise<{ count: number }> {
    const response = await apiClient.get<{ count: number }>(ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
    return response.data;
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(id: string): Promise<void> {
    await apiClient.post(ENDPOINTS.NOTIFICATIONS.READ(id));
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<void> {
    await apiClient.post(ENDPOINTS.NOTIFICATIONS.READ_ALL);
}

/**
 * Delete a notification
 */
export async function deleteNotification(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.NOTIFICATIONS.BY_ID(id));
}
