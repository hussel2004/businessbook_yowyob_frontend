import { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/components/features/auth/login-form';
import { Spinner } from '@/components/ui/spinner';

export const metadata: Metadata = {
    title: 'Connexion - BusinessBook',
    description: 'Connectez-vous à votre compte BusinessBook pour gérer votre entreprise et découvrir des entreprises locales.',
};

export default function LoginPage() {
    return (
        <>
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-2">Bon retour !</h1>
                <p className="text-muted-foreground">
                    Connectez-vous à votre compte
                </p>
            </div>
            <Suspense fallback={<div className="flex justify-center py-8"><Spinner /></div>}>
                <LoginForm />
            </Suspense>
        </>
    );
}
