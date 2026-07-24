'use client';

import { useState } from 'react';
import { Building2, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { selectContext } from '@/lib/api/auth';
import type { KernelContext } from '@/types/user';

interface Props {
    selectionToken: string;
    contexts: KernelContext[];
    onSuccess: (tenantId: string, organizationId: string | null) => void;
}

interface ContextOption {
    label: string;
    contextId: string;
    tenantId: string;
    organizationId?: string;
    isPersonal: boolean;
}

function buildOptions(contexts: KernelContext[]): ContextOption[] {
    const options: ContextOption[] = [];
    for (const ctx of contexts) {
        if (!ctx.organizations || ctx.organizations.length === 0) {
            options.push({
                label: 'Espace personnel',
                contextId: ctx.contextId,
                tenantId: ctx.tenantId,
                isPersonal: true,
            });
        } else {
            for (const org of ctx.organizations) {
                options.push({
                    label: org.displayName,
                    contextId: ctx.contextId,
                    tenantId: ctx.tenantId,
                    organizationId: org.id,
                    isPersonal: false,
                });
            }
        }
    }
    return options;
}

export function ContextSelector({ selectionToken, contexts, onSuccess }: Props) {
    const [pending, setPending] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const options = buildOptions(contexts);

    const handleSelect = async (option: ContextOption) => {
        setPending(option.contextId + (option.organizationId ?? ''));
        setError(null);
        try {
            const result = await selectContext(selectionToken, option.contextId, option.organizationId);
            if (!result.success) throw new Error(result.message || 'Connexion échouée');
            onSuccess(result.data.selectedTenantId, result.data.selectedOrganizationId ?? null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setPending(null);
        }
    };

    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
                Sélectionnez l&apos;espace auquel vous souhaitez accéder
            </p>

            {error && (
                <Alert variant="error">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-2">
                {options.map((option) => {
                    const key = option.contextId + (option.organizationId ?? '');
                    const isLoading = pending === key;
                    return (
                        <button
                            key={key}
                            onClick={() => handleSelect(option)}
                            disabled={!!pending}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {option.isPersonal
                                ? <User className="h-5 w-5 shrink-0 text-muted-foreground" />
                                : <Building2 className="h-5 w-5 shrink-0 text-primary" />}
                            <span className="flex-1 text-left font-medium">{option.label}</span>
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
