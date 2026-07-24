'use client';

import { useRouter } from 'next/navigation';
import { LogIn, X } from 'lucide-react';

interface AuthPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    action?: string;
    redirectPath?: string;
}

/**
 * Modal prompting unauthenticated users to log in for protected actions.
 */
export function AuthPromptModal({
    isOpen,
    onClose,
    action = 'cette action',
    redirectPath,
}: AuthPromptModalProps) {
    const router = useRouter();

    if (!isOpen) return null;

    const handleLogin = () => {
        const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
        const redirect = redirectPath || currentPath;
        router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
        onClose();
    };

    const handleRegister = () => {
        const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
        const redirect = redirectPath || currentPath;
        router.push(`/register?redirect=${encodeURIComponent(redirect)}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-card border rounded-xl shadow-lg max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Content */}
                <div className="text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <LogIn className="h-6 w-6 text-primary" />
                    </div>

                    <h3 className="text-lg font-semibold mb-2">Connexion requise</h3>
                    <p className="text-muted-foreground mb-6">
                        Vous devez être connecté pour {action}. Créez un compte gratuitement ou connectez-vous.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleLogin}
                            className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                        >
                            Se connecter
                        </button>
                        <button
                            onClick={handleRegister}
                            className="flex-1 px-4 py-2.5 border rounded-lg font-medium hover:bg-muted transition-colors"
                        >
                            Créer un compte
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
