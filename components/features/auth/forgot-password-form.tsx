'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft, CheckCircle2, Building2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations/auth';
import { forgotPassword, issuePasswordReset } from '@/lib/api/auth';
import { ApiException } from '@/lib/api/client';
import type { PasswordResetContext } from '@/types/user';

type Step = 'email' | 'select-context' | 'sent';

interface PendingSelection {
    selectionToken: string;
    contexts: PasswordResetContext[];
}

export function ForgotPasswordForm() {
    const [step, setStep] = useState<Step>('email');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [pending, setPending] = useState<PendingSelection | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    // Déclenche l'envoi effectif de l'email de réinitialisation (étape 2/3 côté kernel).
    const sendResetEmail = async (selectionToken: string, contextId: string) => {
        const result = await issuePasswordReset(selectionToken, contextId);
        if (!result.success) {
            throw new Error(result.message || "Échec de l'envoi de l'email de réinitialisation.");
        }
        setStep('sent');
    };

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setError(null);
        setIsLoading(true);
        try {
            const discovered = await forgotPassword(data.email);
            const contexts = discovered.data?.contexts ?? [];
            const selectionToken = discovered.data?.selectionToken;

            // Aucun compte trouvé : message générique volontaire (ne pas révéler l'existence du
            // compte), on affiche quand même l'écran "email envoyé".
            if (!selectionToken || contexts.length === 0) {
                setStep('sent');
                return;
            }

            // Un seul compte correspondant → déclenche directement l'envoi.
            if (contexts.length === 1 && contexts[0]) {
                await sendResetEmail(selectionToken, contexts[0].contextId);
                return;
            }

            // Plusieurs comptes (même email dans plusieurs tenants) → l'utilisateur choisit.
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

    const handleSelectContext = async (contextId: string) => {
        if (!pending) return;
        setError(null);
        setIsLoading(true);
        try {
            await sendResetEmail(pending.selectionToken, contextId);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
        } finally {
            setIsLoading(false);
        }
    };

    if (step === 'sent') {
        return (
            <div className="space-y-6 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-2">Email envoyé !</h2>
                    <p className="text-muted-foreground">
                        Si un compte existe pour cette adresse,
                        vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.
                    </p>
                </div>
                <div className="space-y-3">
                    <Link
                        href="/login"
                        className={cn(buttonVariants({ variant: 'outline', fullWidth: true }))}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour à la connexion
                    </Link>
                </div>
            </div>
        );
    }

    if (step === 'select-context' && pending) {
        return (
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                    Plusieurs comptes correspondent à cet email. Sélectionnez celui à réinitialiser.
                </p>

                {error && (
                    <Alert variant="error">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-2">
                    {pending.contexts.map((ctx) => (
                        <button
                            key={ctx.contextId}
                            type="button"
                            onClick={() => handleSelectContext(ctx.contextId)}
                            disabled={isLoading}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Building2 className="h-5 w-5 shrink-0 text-primary" />
                            <span className="flex-1 text-left font-medium">
                                {ctx.username ?? ctx.email ?? ctx.contextId}
                            </span>
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        </button>
                    ))}
                </div>
            </div>
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
                {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
            </div>

            <Button type="submit" fullWidth isLoading={isLoading}>
                {isLoading ? 'Envoi en cours...' : 'Envoyer le lien'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
                <Link href="/login" className="text-primary hover:underline inline-flex items-center gap-1">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Retour à la connexion
                </Link>
            </p>
        </form>
    );
}
