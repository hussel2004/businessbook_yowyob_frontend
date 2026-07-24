import { Metadata } from 'next';
import { RegisterForm } from '@/components/features/auth/register-form';

export const metadata: Metadata = {
    title: 'Inscription - BusinessBook',
    description: 'Créez votre compte BusinessBook pour inscrire votre entreprise et rejoindre l\'annuaire des entreprises africaines.',
};

export default function RegisterPage() {
    return (
        <>
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-2">Créer un compte</h1>
                <p className="text-muted-foreground">
                    Rejoignez BusinessBook dès aujourd'hui
                </p>
            </div>
            <RegisterForm />
        </>
    );
}
