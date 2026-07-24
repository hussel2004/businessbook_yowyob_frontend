'use client';

import { useState, useEffect } from 'react';
import { BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationItem } from './notification-item';
import type { Notification } from '@/types/notification';
import { getNotifications, markNotificationAsRead, deleteNotification, markAllNotificationsAsRead } from '@/lib/api/notifications';
import { showToast } from '@/components/ui/toast';
import { Skeleton } from '@/components/ui/skeleton';

export function NotificationList() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const loadNotifications = async (isRefresh = false) => {
        setIsLoading(true);
        try {
            const res = await getNotifications({ page: isRefresh ? 0 : page, size: 20 });
            if (isRefresh) {
                setNotifications(res.content);
                setPage(1);
            } else {
                setNotifications(prev => [...prev, ...res.content]);
                setPage(prev => prev + 1);
            }
            setHasMore(!res.last);
        } catch (error) {
            console.error("Failed to load notifications", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications(true);
    }, []);

    const handleRead = async (id: string) => {
        try {
            await markNotificationAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            showToast.success("Notification supprimée");
        } catch (error) {
            showToast.error("Erreur, impossible de supprimer");
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            showToast.success("Toutes les notifications marquées comme lues");
        } catch (error) {
            showToast.error("Erreur");
        }
    }

    if (isLoading && notifications.length === 0) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
            </div>
        );
    }

    if (notifications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <BellOff className="h-12 w-12 mb-4 opacity-50" />
                <p>Vous n'avez aucune notification</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end mb-4">
                <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
                    Tout marquer comme lu
                </Button>
            </div>
            <div className="space-y-3">
                {notifications.map(notification => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onRead={handleRead}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
            {hasMore && (
                <div className="pt-4 text-center">
                    <Button variant="ghost" onClick={() => loadNotifications()}>
                        Charger plus
                    </Button>
                </div>
            )}
        </div>
    );
}
