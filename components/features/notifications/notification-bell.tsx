'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownContent,
    DropdownItem,
    DropdownLabel,
    DropdownSeparator,
    DropdownTrigger
} from '@/components/ui/dropdown-menu';
import { getUnreadNotificationCount } from '@/lib/api/notifications';

export function NotificationBell() {
    const [unreadCount, setUnreadCount] = useState(0);

    const checkNotifications = async () => {
        try {
            const res = await getUnreadNotificationCount();
            setUnreadCount(res.count);
        } catch (error) {
            console.error("Failed to check notifications", error);
        }
    };

    useEffect(() => {
        checkNotifications();
        const interval = setInterval(checkNotifications, 60000); // Poll every minute
        return () => clearInterval(interval);
    }, []);

    return (
        <DropdownMenu>
            <DropdownTrigger
                hideIcon
                className="relative h-10 w-10 p-0 hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-md"
            >
                <span className="relative inline-flex items-center justify-center">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                </span>
            </DropdownTrigger>
            <DropdownContent align="end" className="w-80">
                <DropdownLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                        <Badge variant="secondary" className="ml-2">{unreadCount} nouvelles</Badge>
                    )}
                </DropdownLabel>
                <DropdownSeparator />
                <DropdownItem className="p-0" asChild>
                    <Link href="/notifications" className="w-full text-center py-2 font-medium block">
                        Voir toutes les notifications
                    </Link>
                </DropdownItem>
            </DropdownContent>
        </DropdownMenu>
    );
}
