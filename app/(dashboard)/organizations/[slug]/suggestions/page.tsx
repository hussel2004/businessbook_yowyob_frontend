'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrganizationBySlug } from '@/lib/api/public';
import {
    getOrganizationSuggestions,
    getNewSuggestionsCount,
    markSuggestionAsRead,
    markSuggestionAsNoted,
    markSuggestionAsDone,
    deleteSuggestion,
    type Suggestion,
} from '@/lib/api/suggestions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import {
    Lightbulb,
    Trash2,
    Check,
    Eye,
    ChevronDown,
    ChevronUp,
    User,
    Calendar,
    Mail,
    BookCheck,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils/cn';

const STATUS_CONFIG: Record<'new' | 'read' | 'noted' | 'done', { label: string; color: string }> = {
    new: {
        label: 'Nouvelle',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    },
    read: {
        label: 'Lue',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-800/60 dark:text-gray-400',
    },
    noted: {
        label: 'Notée',
        color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    },
    done: {
        label: 'Traitée',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    },
};

const CATEGORY_LABELS: Record<string, string> = {
    amelioration: 'Amélioration',
    produit: 'Produit ou service',
    service: 'Expérience client',
    autre: 'Autre',
};

const FILTERS = [
    { value: '', label: 'Toutes' },
    { value: 'new', label: 'Nouvelles' },
    { value: 'read', label: 'Lues' },
    { value: 'noted', label: 'Notées' },
    { value: 'done', label: 'Traitées' },
];

function SuggestionCard({ suggestion, onStatusChange, onDelete }: {
    suggestion: Suggestion;
    onStatusChange: (id: string, action: 'read' | 'noted' | 'done') => void;
    onDelete: (id: string) => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const config = STATUS_CONFIG[suggestion.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.new;

    return (
        <div className={cn(
            'rounded-xl border bg-card transition-shadow hover:shadow-sm',
            suggestion.status === 'new' && 'border-blue-200 dark:border-blue-800'
        )}>
            <div className="p-4">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold', config.color)}>
                                {config.label}
                            </span>
                            {suggestion.category && (
                                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                    {CATEGORY_LABELS[suggestion.category] ?? suggestion.category}
                                </span>
                            )}
                        </div>
                        {/* Preview */}
                        <p className={cn('text-sm text-foreground', !expanded && 'line-clamp-2')}>
                            {suggestion.content}
                        </p>
                        {suggestion.content.length > 120 && (
                            <button
                                onClick={() => setExpanded(v => !v)}
                                className="mt-1 text-xs text-primary hover:underline flex items-center gap-0.5"
                            >
                                {expanded ? (
                                    <><ChevronUp className="h-3 w-3" /> Réduire</>
                                ) : (
                                    <><ChevronDown className="h-3 w-3" /> Lire la suite</>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                        {suggestion.status === 'new' && (
                            <button
                                onClick={() => onStatusChange(suggestion.id, 'read')}
                                title="Marquer comme lue"
                                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            >
                                <Eye className="h-4 w-4" />
                            </button>
                        )}
                        {(suggestion.status === 'new' || suggestion.status === 'read') && (
                            <button
                                onClick={() => onStatusChange(suggestion.id, 'noted')}
                                title="Marquer comme notée"
                                className="p-1.5 rounded-md text-muted-foreground hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                            >
                                <BookCheck className="h-4 w-4" />
                            </button>
                        )}
                        {suggestion.status !== 'done' && (
                            <button
                                onClick={() => onStatusChange(suggestion.id, 'done')}
                                title="Marquer comme traitée"
                                className="p-1.5 rounded-md text-muted-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                            >
                                <Check className="h-4 w-4" />
                            </button>
                        )}
                        <button
                            onClick={() => onDelete(suggestion.id)}
                            title="Supprimer"
                            className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Meta */}
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        {suggestion.senderName}
                    </span>
                    {suggestion.senderEmail && (
                        <span className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5" />
                            {suggestion.senderEmail}
                        </span>
                    )}
                    <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDistanceToNow(new Date(suggestion.createdAt), { addSuffix: true, locale: fr })}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function SuggestionsPage() {
    const params = useParams();
    const slug = params.slug as string;
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState('');

    const { data: org } = useQuery({
        queryKey: ['organization', slug],
        queryFn: () => getOrganizationBySlug(slug),
    });

    const { data: suggestionsData, isLoading } = useQuery({
        queryKey: ['org-suggestions', org?.id, filter],
        queryFn: () => getOrganizationSuggestions(org!.id, { size: 100, status: filter || undefined }),
        enabled: !!org?.id,
    });

    const { data: countData } = useQuery({
        queryKey: ['org-suggestions-count', org?.id],
        queryFn: () => getNewSuggestionsCount(org!.id),
        enabled: !!org?.id,
    });

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ['org-suggestions', org?.id] });
        queryClient.invalidateQueries({ queryKey: ['org-suggestions-count', org?.id] });
    };

    const readMutation = useMutation({
        mutationFn: markSuggestionAsRead,
        onSuccess: () => { toast.success('Marquée comme lue'); invalidate(); },
        onError: () => toast.error('Erreur'),
    });

    const notedMutation = useMutation({
        mutationFn: markSuggestionAsNoted,
        onSuccess: () => { toast.success('Marquée comme notée'); invalidate(); },
        onError: () => toast.error('Erreur'),
    });

    const doneMutation = useMutation({
        mutationFn: markSuggestionAsDone,
        onSuccess: () => { toast.success('Marquée comme traitée'); invalidate(); },
        onError: () => toast.error('Erreur'),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteSuggestion,
        onSuccess: () => { toast.success('Suggestion supprimée'); invalidate(); },
        onError: () => toast.error('Erreur lors de la suppression'),
    });

    const handleStatusChange = (id: string, action: 'read' | 'noted' | 'done') => {
        if (action === 'read') readMutation.mutate(id);
        else if (action === 'noted') notedMutation.mutate(id);
        else doneMutation.mutate(id);
    };

    const handleDelete = (id: string) => {
        if (confirm('Supprimer cette suggestion ?')) deleteMutation.mutate(id);
    };

    const suggestions = suggestionsData?.content ?? [];
    const newCount = countData?.count ?? 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Lightbulb className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Boîte à suggestions</h1>
                        <p className="text-sm text-muted-foreground">
                            Suggestions laissées par les visiteurs de votre page
                        </p>
                    </div>
                </div>
                {newCount > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 text-sm font-semibold">
                        <Lightbulb className="h-4 w-4" />
                        {newCount} nouvelle{newCount > 1 ? 's' : ''}
                    </span>
                )}
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
                {FILTERS.map(f => (
                    <button
                        key={f.value}
                        onClick={() => setFilter(f.value)}
                        className={cn(
                            'px-4 py-1.5 rounded-full text-sm font-medium transition-colors border',
                            filter === f.value
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                        )}
                    >
                        {f.label}
                        {f.value === 'new' && newCount > 0 && (
                            <span className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                                {newCount > 9 ? '9+' : newCount}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* List */}
            {isLoading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
                </div>
            ) : suggestions.length === 0 ? (
                <EmptyState
                    icon={Lightbulb}
                    title="Aucune suggestion"
                    description={filter ? 'Aucune suggestion dans cette catégorie.' : 'Les visiteurs de votre page pourront laisser des suggestions ici.'}
                />
            ) : (
                <div className="space-y-3">
                    {suggestions.map(suggestion => (
                        <SuggestionCard
                            key={suggestion.id}
                            suggestion={suggestion}
                            onStatusChange={handleStatusChange}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
