import Link from 'next/link';

/**
 * 404 Not Found Page
 */
export default function NotFound() {
    return (
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="max-w-md mx-auto">
                {/* 404 Icon */}
                <div className="text-8xl mb-6">🔍</div>

                {/* Title */}
                <h1 className="text-4xl font-bold text-foreground mb-4">
                    Page non trouvée
                </h1>

                {/* Description */}
                <p className="text-lg text-foreground-muted mb-8">
                    Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 font-semibold text-white bg-primary rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        ← Retour à l'accueil
                    </Link>
                    <Link
                        href="/search"
                        className="inline-flex items-center justify-center px-6 py-3 font-semibold text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors"
                    >
                        Rechercher
                    </Link>
                </div>
            </div>
        </main>
    );
}
