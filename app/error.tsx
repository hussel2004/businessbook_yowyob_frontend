'use client';

import { useEffect } from 'react';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

/**
 * Error Boundary Page
 * Catches errors in the app and displays a fallback UI
 */
export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application error:', error);
    }, [error]);

    return (
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="max-w-md mx-auto">
                {/* Error Icon */}
                <div className="text-8xl mb-6">⚠️</div>

                {/* Title */}
                <h1 className="text-4xl font-bold text-foreground mb-4">
                    Oups ! Une erreur est survenue
                </h1>

                {/* Description */}
                <p className="text-lg text-foreground-muted mb-8">
                    Nous nous excusons pour le désagrément. Notre équipe a été notifiée et travaille à résoudre le problème.
                </p>

                {/* Error Details (dev only) */}
                {process.env.NODE_ENV === 'development' && error.message && (
                    <div className="mb-8 p-4 bg-error/10 border border-error/20 rounded-lg text-left">
                        <p className="text-sm font-mono text-error break-all">
                            {error.message}
                        </p>
                        {error.digest && (
                            <p className="text-xs text-foreground-muted mt-2">
                                Digest: {error.digest}
                            </p>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={reset}
                        className="inline-flex items-center justify-center px-6 py-3 font-semibold text-white bg-primary rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        🔄 Réessayer
                    </button>
                    <a
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 font-semibold text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors"
                    >
                        ← Retour à l'accueil
                    </a>
                </div>
            </div>
        </main>
    );
}
