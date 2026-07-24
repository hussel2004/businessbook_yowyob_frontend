'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrganizationBySlug } from '@/lib/api/public';
import {
    getOrganizationInquiries,
    getUnreadInquiriesCount,
    markInquiryAsRead,
    replyToInquiry,
    archiveInquiry,
    deleteInquiry,
    type Inquiry,
} from '@/lib/api/inquiries';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    MessageSquare,
    Mail,
    Phone,
    Send,
    Archive,
    Trash2,
    Check,
    Clock,
    Reply,
    Eye,
    ChevronRight,
    User,
    Calendar,
    Filter,
    Search,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils/cn';

const STATUS_CONFIG = {
    new: {
        label: 'Nouveau',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        icon: MessageSquare,
    },
    read: {
        label: 'Lu',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
        icon: Eye,
    },
    replied: {
        label: 'Répondu',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        icon: Check,
    },
    archived: {
        label: 'Archivé',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        icon: Archive,
    },
};

export default function InquiriesManagementPage() {
    const params = useParams();
    const slug = params.slug as string;
    const queryClient = useQueryClient();

    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [replyText, setReplyText] = useState('');
    const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied' | 'archived'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Get organization
    const { data: org } = useQuery({
        queryKey: ['organization', slug],
        queryFn: () => getOrganizationBySlug(slug),
    });

    // Get inquiries
    const { data: inquiriesData, isLoading } = useQuery({
        queryKey: ['organization-inquiries', org?.id, filter],
        queryFn: () => getOrganizationInquiries(org!.id, {
            size: 50,
            status: filter !== 'all' ? filter : undefined,
        }),
        enabled: !!org?.id,
    });

    // Get unread count
    const { data: unreadData } = useQuery({
        queryKey: ['unread-inquiries', org?.id],
        queryFn: () => getUnreadInquiriesCount(org!.id),
        enabled: !!org?.id,
    });

    // Mark as read mutation
    const markReadMutation = useMutation({
        mutationFn: markInquiryAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organization-inquiries', org?.id] });
            queryClient.invalidateQueries({ queryKey: ['unread-inquiries', org?.id] });
        },
    });

    // Reply mutation
    const replyMutation = useMutation({
        mutationFn: async ({ inquiryId, content }: { inquiryId: string; content: string }) => {
            return replyToInquiry(inquiryId, { content, sendVia: 'email' });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organization-inquiries', org?.id] });
            setSelectedInquiry(null);
            setReplyText('');
            toast.success('Réponse envoyée par email');
        },
        onError: () => {
            toast.error("Erreur lors de l'envoi");
        },
    });

    // Archive mutation
    const archiveMutation = useMutation({
        mutationFn: archiveInquiry,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organization-inquiries', org?.id] });
            toast.success('Message archivé');
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: deleteInquiry,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organization-inquiries', org?.id] });
            setDeleteConfirm(null);
            toast.success('Message supprimé');
        },
    });

    const handleSelectInquiry = (inquiry: Inquiry) => {
        setSelectedInquiry(inquiry);
        if (!inquiry.isRead) {
            markReadMutation.mutate(inquiry.id);
        }
    };

    const handleReply = () => {
        if (!selectedInquiry || !replyText.trim()) return;
        replyMutation.mutate({ inquiryId: selectedInquiry.id, content: replyText });
    };

    const inquiries = inquiriesData?.content || [];
    const filteredInquiries = inquiries.filter((inq) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            inq.senderName.toLowerCase().includes(query) ||
            inq.senderEmail.toLowerCase().includes(query) ||
            inq.subject.toLowerCase().includes(query) ||
            inq.message.toLowerCase().includes(query)
        );
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold">Messages</h2>
                        {unreadData && unreadData.count > 0 && (
                            <Badge className="bg-primary text-primary-foreground">
                                {unreadData.count} nouveau{unreadData.count > 1 ? 'x' : ''}
                            </Badge>
                        )}
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Gérez les demandes de renseignements de vos clients
                    </p>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto">
                    {(['all', 'new', 'read', 'replied', 'archived'] as const).map((status) => (
                        <Button
                            key={status}
                            variant={filter === status ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter(status)}
                        >
                            {status === 'all' ? 'Tous' : STATUS_CONFIG[status].label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Inquiries List */}
            {filteredInquiries.length === 0 ? (
                <EmptyState
                    icon={MessageSquare}
                    title="Aucun message"
                    description={
                        filter === 'all'
                            ? "Vous n'avez pas encore reçu de demandes de renseignements."
                            : `Aucun message avec le statut "${STATUS_CONFIG[filter as keyof typeof STATUS_CONFIG]?.label || filter}".`
                    }
                />
            ) : (
                <div className="space-y-2">
                    {filteredInquiries.map((inquiry) => {
                        const statusConfig = STATUS_CONFIG[inquiry.status];
                        const StatusIcon = statusConfig.icon;

                        return (
                            <div
                                key={inquiry.id}
                                onClick={() => handleSelectInquiry(inquiry)}
                                className={cn(
                                    'flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all hover:shadow-md',
                                    !inquiry.isRead && 'bg-primary/5 border-primary/30',
                                    selectedInquiry?.id === inquiry.id && 'ring-2 ring-primary'
                                )}
                            >
                                {/* Unread Indicator */}
                                <div className="flex-shrink-0 pt-1">
                                    {!inquiry.isRead ? (
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                    ) : (
                                        <div className="w-2.5 h-2.5 rounded-full bg-transparent" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className={cn('font-medium', !inquiry.isRead && 'font-semibold')}>
                                                    {inquiry.senderName}
                                                </span>
                                                <Badge className={cn('text-xs', statusConfig.color)}>
                                                    <StatusIcon className="h-3 w-3 mr-1" />
                                                    {statusConfig.label}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{inquiry.senderEmail}</p>
                                        </div>
                                        <span className="text-xs text-muted-foreground flex-shrink-0">
                                            {formatDistanceToNow(new Date(inquiry.createdAt), {
                                                locale: fr,
                                                addSuffix: true,
                                            })}
                                        </span>
                                    </div>

                                    <h4 className={cn('mt-2', !inquiry.isRead && 'font-medium')}>
                                        {inquiry.subject}
                                    </h4>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                        {inquiry.message}
                                    </p>

                                    {/* Quick Actions */}
                                    <div className="flex items-center gap-2 mt-3">
                                        {inquiry.status !== 'replied' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelectInquiry(inquiry);
                                                }}
                                            >
                                                <Reply className="h-3 w-3 mr-1" />
                                                Répondre
                                            </Button>
                                        )}
                                        {inquiry.status !== 'archived' && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    archiveMutation.mutate(inquiry.id);
                                                }}
                                            >
                                                <Archive className="h-3 w-3 mr-1" />
                                                Archiver
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-600"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeleteConfirm(inquiry.id);
                                            }}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>

                                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Inquiry Detail / Reply Modal */}
            <Modal
                open={!!selectedInquiry}
                onOpenChange={(open) => !open && setSelectedInquiry(null)}
                size="lg"
            >
                {selectedInquiry && (
                    <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">{selectedInquiry.subject}</h2>
                                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        {selectedInquiry.senderName}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {format(new Date(selectedInquiry.createdAt), 'dd MMM yyyy à HH:mm', {
                                            locale: fr,
                                        })}
                                    </span>
                                </div>
                            </div>
                            <Badge className={STATUS_CONFIG[selectedInquiry.status].color}>
                                {STATUS_CONFIG[selectedInquiry.status].label}
                            </Badge>
                        </div>

                        {/* Sender Info */}
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <a
                                    href={`mailto:${selectedInquiry.senderEmail}`}
                                    className="text-primary hover:underline"
                                >
                                    {selectedInquiry.senderEmail}
                                </a>
                            </div>
                            {selectedInquiry.senderPhone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <a
                                        href={`tel:${selectedInquiry.senderPhone}`}
                                        className="text-primary hover:underline"
                                    >
                                        {selectedInquiry.senderPhone}
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Message */}
                        <div className="p-4 rounded-lg border bg-card">
                            <p className="whitespace-pre-wrap">{selectedInquiry.message}</p>
                        </div>

                        {/* Previous Reply */}
                        {selectedInquiry.reply && (
                            <div className="p-4 rounded-lg bg-primary/5 border-l-4 border-primary">
                                <div className="flex items-center gap-2 mb-2">
                                    <Check className="h-4 w-4 text-primary" />
                                    <span className="font-medium text-primary">Votre réponse</span>
                                    <span className="text-xs text-muted-foreground">
                                        {format(new Date(selectedInquiry.reply.createdAt), 'dd MMM yyyy à HH:mm', {
                                            locale: fr,
                                        })}
                                    </span>
                                </div>
                                <p className="text-sm whitespace-pre-wrap">{selectedInquiry.reply.content}</p>
                            </div>
                        )}

                        {/* Reply Form */}
                        {selectedInquiry.status !== 'replied' && !selectedInquiry.reply && (
                            <div className="space-y-3 pt-4 border-t">
                                <Label>Votre réponse</Label>
                                <Textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Écrivez votre réponse..."
                                    rows={5}
                                />
                                <p className="text-xs text-muted-foreground">
                                    La réponse sera envoyée par email à {selectedInquiry.senderEmail}
                                </p>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setSelectedInquiry(null)}>
                                        Annuler
                                    </Button>
                                    <Button
                                        onClick={handleReply}
                                        disabled={replyMutation.isPending || !replyText.trim()}
                                    >
                                        <Send className="h-4 w-4 mr-2" />
                                        {replyMutation.isPending ? 'Envoi...' : 'Envoyer'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <Modal open onOpenChange={() => setDeleteConfirm(null)}>
                    <div className="p-6 text-center">
                        <Trash2 className="h-12 w-12 mx-auto mb-4 text-red-500" />
                        <h3 className="text-lg font-semibold mb-2">Supprimer ce message ?</h3>
                        <p className="text-muted-foreground mb-4">Cette action est irréversible.</p>
                        <div className="flex justify-center gap-2">
                            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                                Annuler
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => deleteMutation.mutate(deleteConfirm)}
                            >
                                Supprimer
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
