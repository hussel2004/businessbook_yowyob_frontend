'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations/auth';
import { resetPassword } from '@/lib/api/auth';
import { ApiException } from '@/lib/api/client';

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [isPending, setIsPending] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    // Redirect if no token
    useEffect(() => {
        if (!token) {
            router.replace('/forgot-password');
        }
    }, [token, router]);

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!token) return;

        setError(null);
        setIsPending(true);
        try {
            const result = await resetPassword(token, data.password);
            if (!result.success) {
                throw new Error(result.message || 'Le lien a peut-être expiré.');
            }
            setIsSuccess(true);
        } catch (err) {
            if (err instanceof ApiException) {
                setError(err.message);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Une erreur est survenue. Le lien a peut-être expiré.');
            }
        } finally {
            setIsPending(false);
        }
    };

    if (!token) {
        return (
            <div className="flex items-center justify-center py-8">
                <Spinner size="lg" />
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="space-y-6 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-2">Mot de passe modifié !</h2>
                    <p className="text-muted-foreground">
                        Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.
                    </p>
                </div>
                <Link
                    href="/login"
                    className={cn(buttonVariants({ fullWidth: true }))}
                >
                    Se connecter
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-2">Nouveau mot de passe</h1>
                <p className="text-muted-foreground">
                    Créez un nouveau mot de passe pour votre compte.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                    <Alert variant="error">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-2">
                    <Label htmlFor="password">Nouveau mot de passe</Label>
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
                    {errors.password && (
                        <p className="text-sm text-destructive">{errors.password.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="pl-10 pr-10"
                            {...register('confirmPassword')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                    )}
                </div>

                <Button type="submit" fullWidth isLoading={isPending}>
                    {isPending ? 'Modification...' : 'Modifier le mot de passe'}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                    <Link href="/login" className="text-primary hover:underline inline-flex items-center gap-1">
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Retour à la connexion
                    </Link>
                </p>
            </form>
        </>
    );
}
