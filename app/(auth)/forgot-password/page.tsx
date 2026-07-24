import { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/features/auth/forgot-password-form';

export const metadata: Metadata = {
    title: 'Mot de passe oublié - BusinessBook',
    description: 'Réinitialisez votre mot de passe BusinessBook. Nous vous enverrons un lien par email.',
};

export default function ForgotPasswordPage() {
    return (
        <>
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-2">Mot de passe oublié ?</h1>
                <p className="text-muted-foreground">
                    Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>
            </div>
            <ForgotPasswordForm />
        </>
    );
}
