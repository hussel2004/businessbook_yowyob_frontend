'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Loader2, CheckCircle, Building2 } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations/auth';
import { discoverAccountsByEmail, resendEmailVerification } from '@/lib/api/auth';
import { ApiException } from '@/lib/api/client';
import type { PasswordResetContext } from '@/types/user';

type Step = 'email' | 'select-context' | 'sent';

interface PendingSelection {
    email: string;
    contexts: PasswordResetContext[];
}

export default function ResendVerificationPage() {
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
        defaultValues: { email: '' },
    });

    // Déclenche l'envoi effectif d'un nouveau lien de vérification pour le tenant choisi.
    const sendVerificationEmail = async (email: string, tenantId: string) => {
        const result = await resendEmailVerification(email, tenantId);
        if (!result.success) {
            throw new Error(result.message || "Échec de l'envoi de l'email de vérification.");
        }
        setStep('sent');
    };

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setError(null);
        setIsLoading(true);
        try {
            const discovered = await discoverAccountsByEmail(data.email);
            const contexts = discovered.data?.contexts ?? [];

            // Aucun compte trouvé : message générique volontaire (anti-énumération).
            if (contexts.length === 0) {
                setStep('sent');
                return;
            }

            // Un seul compte correspondant → déclenche directement le renvoi.
            if (contexts.length === 1 && contexts[0]) {
                await sendVerificationEmail(data.email, contexts[0].tenantId);
                return;
            }

            // Plusieurs comptes (même email dans plusieurs tenants de l'écosystème) → l'utilisateur choisit.
            setPending({ email: data.email, contexts });
            setStep('select-context');
        } catch (err) {
            if (err instanceof ApiException || err instanceof Error) {
                setError(err.message);
            } else {
                setError('Une erreur est survenue. Veuillez réessayer.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectContext = async (tenantId: string) => {
        if (!pending) return;
        setError(null);
        setIsLoading(true);
        try {
            await sendVerificationEmail(pending.email, tenantId);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
        } finally {
            setIsLoading(false);
        }
    };

    if (step === 'sent') {
        return (
            <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="rounded-full bg-green-100 p-3 text-green-600">
                    <CheckCircle className="h-8 w-8" />
                </div>
                <h1 className="text-2xl font-bold">Email envoyé !</h1>
                <p className="text-muted-foreground max-w-sm">
                    Si un compte non vérifié existe pour cette adresse, vous recevrez un nouveau lien
                    de vérification. Pensez à vérifier vos spams.
                </p>
                <div className="flex flex-col gap-2 w-full max-w-xs mt-4">
                    <Link href="/login" className={buttonVariants({ variant: 'outline' })}>
                        Retour à la connexion
                    </Link>
                </div>
            </div>
        );
    }

    if (step === 'select-context' && pending) {
        return (
            <div className="flex flex-col space-y-6 w-full max-w-md mx-auto">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold">Plusieurs comptes trouvés</h1>
                    <p className="text-muted-foreground">
                        Cet email correspond à plusieurs comptes. Sélectionnez celui à vérifier.
                    </p>
                </div>

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
                            onClick={() => handleSelectContext(ctx.tenantId)}
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
        <div className="flex flex-col space-y-6 w-full max-w-md mx-auto">
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold">Vérifier votre email</h1>
                <p className="text-muted-foreground">
                    Vous n&apos;avez pas reçu le lien ? Entrez votre email pour en recevoir un nouveau.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
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

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Renvoyer le lien de vérification
                </Button>
            </form>

            <div className="text-center text-sm">
                <Link href="/login" className="text-muted-foreground hover:text-primary underline">
                    Retour à la connexion
                </Link>
            </div>
        </div>
    );
}
