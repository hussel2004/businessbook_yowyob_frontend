'use client';

import { NotificationList } from '@/components/features/notifications/notification-list';

export default function NotificationsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                <p className="text-muted-foreground">
                    Restez informé de l'activité sur votre compte
                </p>
            </div>

            <NotificationList />
        </div>
    );
}
