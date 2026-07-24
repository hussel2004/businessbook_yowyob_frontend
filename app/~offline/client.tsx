'use client';

export default function OfflineClient() {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background px-4 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-12 w-12 text-muted-foreground"
                >
                    <path d="M10.8 5.8a10 10 0 0 1 10.3 12.3" />
                    <path d="M15 15l-3-3" />
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3l18 18" />
                    <path d="M12 21a9 9 0 0 1-5.7-1.7" />
                    <path d="M9 14l-3 3" />
                </svg>
            </div>
            <h1 className="mb-2 text-2xl font-bold tracking-tight">
                Vous êtes hors ligne
            </h1>
            <p className="mb-8 text-muted-foreground">
                Vérifiez votre connexion internet pour continuer à utiliser BusinessBook.
            </p>
            <button
                onClick={() => window.location.reload()}
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
                Réessayer
            </button>
        </div>
    );
}
