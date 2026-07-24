import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
    Info,
    Star,
    ShieldCheck,
    Building2,
    Tag,
    MessageSquare,
    Trash2,
    Check
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button, buttonVariants } from '@/components/ui/button';
import type { Notification } from '@/types/notification';

interface NotificationItemProps {
    notification: Notification;
    onRead: (id: string) => void;
    onDelete: (id: string) => void;
    className?: string;
}

export function NotificationItem({ notification, onRead, onDelete, className }: NotificationItemProps) {
    const getIcon = () => {
        switch (notification.type) {
            case 'REVIEW': return <Star className="h-5 w-5 text-yellow-500" />;
            case 'VERIFICATION': return <ShieldCheck className="h-5 w-5 text-blue-500" />;
            case 'ORGANIZATION_STATUS': return <Building2 className="h-5 w-5 text-purple-500" />;
            case 'PROMOTION': return <Tag className="h-5 w-5 text-green-500" />;
            case 'INQUIRY': return <MessageSquare className="h-5 w-5 text-orange-500" />;
            default: return <Info className="h-5 w-5 text-gray-500" />;
        }
    };

    return (
        <div className={cn(
            "flex gap-4 p-4 rounded-lg border transition-colors",
            notification.isRead ? "bg-card" : "bg-muted/30 border-primary/20",
            className
        )}>
            <div className="mt-1 flex-shrink-0">
                {getIcon()}
            </div>
            <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between">
                    <p className={cn("text-sm font-medium leading-none", !notification.isRead && "font-bold")}>
                        {notification.title}
                    </p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: fr })}
                    </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {notification.message}
                </p>
                {notification.actionUrl && (
                    <a
                        href={notification.actionUrl}
                        className={cn(
                            buttonVariants({ variant: 'link' }),
                            "px-0 h-auto text-xs mt-2"
                        )}
                    >
                        Voir les détails
                    </a>
                )}
            </div>
            <div className="flex flex-col gap-1">
                {!notification.isRead && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => onRead(notification.id)}
                        title="Marquer comme lu"
                    >
                        <Check className="h-4 w-4" />
                    </Button>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete(notification.id)}
                    title="Supprimer"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
