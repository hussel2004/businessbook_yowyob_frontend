/**
 * Loading Page
 * Displayed while routes are loading
 */
export default function Loading() {
    return (
        <main className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="flex flex-col items-center gap-4">
                {/* Spinner */}
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-primary/20 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
                </div>

                {/* Text */}
                <p className="text-foreground-muted animate-pulse">
                    Chargement...
                </p>
            </div>
        </main>
    );
}
