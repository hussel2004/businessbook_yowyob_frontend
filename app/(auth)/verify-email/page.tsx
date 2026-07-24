'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2, ArrowRight, RefreshCw, Mail } from 'lucide-react';
import { confirmEmailVerification } from '@/lib/api/auth';
import { Button, buttonVariants } from '@/components/ui/button';
import { useAuthStore } from '@/lib/auth/auth-store';
import { ApiException } from '@/lib/api/client';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    const { isAuthenticated, updateUser } = useAuthStore();

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Vérification de votre email en cours...');

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Jeton de vérification manquant ou invalide.');
                return;
            }

            try {
                const response = await confirmEmailVerification(token);
                if (!response.success) {
                    throw new Error(response.message || 'Le lien de vérification a expiré ou est invalide.');
                }
                setStatus('success');
                setMessage(response.message || 'Votre email a été vérifié avec succès !');

                // If user is logged in, update their state
                if (isAuthenticated) {
                    updateUser({ emailVerified: true });
                }

                // Redirect to login or dashboard after delay
                setTimeout(() => {
                    router.push(isAuthenticated ? '/dashboard' : '/login');
                }, 3000);
            } catch (error) {
                setStatus('error');
                if (error instanceof ApiException || error instanceof Error) {
                    setMessage(error.message || 'Le lien de vérification a expiré ou est invalide.');
                } else {
                    setMessage('Le lien de vérification a expiré ou est invalide.');
                }
            }
        };

        verify();
    }, [token, router, isAuthenticated, updateUser]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
            <div className={`rounded-full p-4 mb-6 ${status === 'loading' ? 'bg-primary/10' :
                status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                {status === 'loading' && <Loader2 className="h-10 w-10 animate-spin text-primary" />}
                {status === 'success' && <CheckCircle className="h-10 w-10" />}
                {status === 'error' && <XCircle className="h-10 w-10" />}
            </div>

            <h1 className="text-2xl font-bold mb-2">
                {status === 'loading' && 'Vérification en cours'}
                {status === 'success' && 'Email Vérifié'}
                {status === 'error' && 'Échec de la vérification'}
            </h1>

            <p className="text-muted-foreground max-w-md mb-8">
                {message}
            </p>

            <div className="flex flex-col gap-3 w-full max-w-xs">
                {status === 'success' && (
                    <Link
                        href={isAuthenticated ? "/dashboard" : "/login"}
                        className={buttonVariants()}
                    >
                        Continuer vers {isAuthenticated ? "le tableau de bord" : "la connexion"}
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                )}

                {status === 'error' && (
                    <>
                        <Link href="/resend-verification" className={buttonVariants()}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Renvoyer le lien
                        </Link>
                        <Link href="/contact" className={buttonVariants({ variant: 'ghost' })}>
                            Contacter le support
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Chargement...</p>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
