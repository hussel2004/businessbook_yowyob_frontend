'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { useAuthStore } from '@/lib/auth/auth-store';
import { ApiException } from '@/lib/api/client';
import { discoverContexts, selectContext, getCurrentUser } from '@/lib/api/auth';
import { ContextSelector } from './context-selector';
import type { KernelContext } from '@/types/user';

type Step = 'credentials' | 'select-context';

interface PendingSelection {
    selectionToken: string;
    contexts: KernelContext[];
}

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/dashboard';

    const setUser = useAuthStore((s) => s.setUser);

    const [step, setStep] = useState<Step>('credentials');
    const [pending, setPending] = useState<PendingSelection | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    const onSuccess = async (tenantId: string, organizationId: string | null) => {
        try {
            const userData = await getCurrentUser();
            setUser(userData);
        } catch {
            setUser({
                id: tenantId,
                tenantId,
                organizationId: organizationId ?? undefined,
                emailVerified: true,
            } as never);
        }
        router.push(redirectTo);
    };

    const onSubmit = async (data: LoginFormData) => {
        setError(null);
        setIsLoading(true);
        try {
            const discovered = await discoverContexts(data.email, data.password);

            if (!discovered.success || !discovered.data?.contexts?.length) {
                setError(discovered.message || 'Identifiants invalides');
                return;
            }

            const { selectionToken, contexts } = discovered.data;
            const firstCtx = contexts[0];

            // Un seul contexte sans organisation → sélection automatique
            if (firstCtx && contexts.length === 1 && !firstCtx.organizations?.length) {
                const result = await selectContext(selectionToken, firstCtx.contextId);
                if (!result.success) throw new Error(result.message || 'Connexion échouée');
                onSuccess(result.data.selectedTenantId, result.data.selectedOrganizationId ?? null);
                return;
            }

            // Un seul contexte avec une seule organisation → auto
            if (firstCtx && contexts.length === 1 && firstCtx.organizations?.length === 1) {
                const orgId = firstCtx.organizations[0]?.id;
                const result = await selectContext(selectionToken, firstCtx.contextId, orgId);
                if (!result.success) throw new Error(result.message || 'Connexion échouée');
                onSuccess(result.data.selectedTenantId, result.data.selectedOrganizationId ?? null);
                return;
            }

            // Plusieurs contextes ou organisations → afficher le sélecteur
            setPending({ selectionToken, contexts });
            setStep('select-context');
        } catch (err) {
            if (err instanceof ApiException) {
                setError(err.message);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Une erreur est survenue. Veuillez réessayer.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (step === 'select-context' && pending) {
        return (
            <ContextSelector
                selectionToken={pending.selectionToken}
                contexts={pending.contexts}
                onSuccess={onSuccess}
            />
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <Alert variant="error">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="email"
                        type="email"
                        placeholder="votre@email.com"
                        className="pl-10"
                        {...register('email')}
                    />
                </div>
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                        Mot de passe oublié ?
                    </Link>
                </div>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        {...register('password')}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" fullWidth isLoading={isLoading}>
                {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
                Pas encore de compte ?{' '}
                <Link href="/register" className="text-primary font-medium hover:underline">
                    Inscrivez-vous
                </Link>
            </p>
        </form>
    );
}
