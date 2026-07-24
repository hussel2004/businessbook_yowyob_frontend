'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { getCategories, type Category } from '@/lib/api/public';
import { Skeleton } from '@/components/ui/skeleton';
import { getAssetUrl } from '@/lib/api/endpoints';

function CategoryCardSkeleton() {
    return (
        <div className="rounded-2xl border bg-card overflow-hidden">
            <Skeleton className="h-48 w-full" />
        </div>
    );
}

function CategoryCard({ category }: { category: Category }) {
    return (
        <Link
            href={`/search?category=${category.slug}`}
            className="group p-4 rounded-2xl border bg-card hover:shadow-lg transition-all hover:-translate-y-1 block h-full overflow-hidden"
        >
            <div className="relative h-48 mb-4 rounded-xl overflow-hidden bg-muted">
                <Image
                    src={getAssetUrl(category.imageUrl) || 'https://images.unsplash.com/photo-1497366216548-375206845664?auto=format&fit=crop&w=800&q=80'}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h2 className="text-xl font-bold leading-tight line-clamp-2 drop-shadow-md">
                        {category.name}
                    </h2>
                    <p className="text-xs text-white/80 mt-1 font-medium">
                        {category.organizationCount ?? 0} entreprises
                    </p>
                </div>
            </div>
        </Link>
    );
}

export default function CategoriesPage() {
    const { data: categories, isLoading, error } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
    });

    return (
        <div className="py-12">
            <div className="container-wrapper">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        Toutes les catégories
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Explorez notre annuaire par secteur d'activité et trouvez
                        l'entreprise idéale pour vos besoins.
                    </p>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <CategoryCardSkeleton key={i} />
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-12">
                        <p className="text-destructive mb-4">
                            Une erreur est survenue lors du chargement des catégories.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-primary hover:underline"
                        >
                            Réessayer
                        </button>
                    </div>
                )}

                {/* Categories Grid */}
                {!isLoading && !error && categories && categories.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {categories.map((category: Category) => (
                            <CategoryCard key={category.id} category={category} />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && (!categories || categories.length === 0) && (
                    <div className="text-center py-20 border-2 border-dashed rounded-2xl">
                        <h3 className="text-xl font-semibold mb-2">Aucune catégorie disponible</h3>
                        <p className="text-muted-foreground">
                            Les catégories seront bientôt disponibles.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
