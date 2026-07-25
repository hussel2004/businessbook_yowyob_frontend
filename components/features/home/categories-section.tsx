'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Store, ArrowRight } from 'lucide-react';

import { getCategories, type Category } from '@/lib/api/public';
import { Skeleton } from '@/components/ui/skeleton';
import { getAssetUrl } from '@/lib/api/endpoints';

function CategoryCard({ category }: { category: Category }) {
    const t = useTranslations('categories');

    return (
        <Link
            href={`/categories/${category.slug}`}
            className="group relative flex flex-col items-center overflow-hidden rounded-xl border bg-card hover:shadow-soft transition-all hover:-translate-y-1"
        >
            {/* Category Image */}
            <div className="relative w-full h-32 overflow-hidden">
                {category.imageUrl ? (
                    <Image
                        src={getAssetUrl(category.imageUrl) || ''}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                        unoptimized
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <Store className="h-10 w-10 text-primary/50" />
                    </div>
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Category Info */}
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <h3 className="font-semibold text-sm leading-tight mb-0.5 drop-shadow-md">
                    {category.name}
                </h3>
                <p className="text-xs text-white/80">
                    {t('businessCount', { count: category.organizationCount || 0 })}
                </p>
            </div>
        </Link>
    );
}

function CategorySkeleton() {
    return (
        <div className="flex flex-col items-center p-6 rounded-xl border bg-card">
            <Skeleton className="w-14 h-14 rounded-xl mb-4" />
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-4 w-20" />
        </div>
    );
}

export function CategoriesSection() {
    const t = useTranslations('home.categories');
    const { data: categories, isLoading, error } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    return (
        <section className="py-16 md:py-24">
            <div className="container-wrapper">
                {/* Section Header */}
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">
                            {t('title')}
                        </h2>
                        <p className="text-muted-foreground">
                            {t('subtitle')}
                        </p>
                    </div>
                    <Link
                        href="/categories"
                        className="hidden md:flex items-center gap-2 text-primary font-medium hover:underline"
                    >
                        {t('seeAll')}
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {/* Categories Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <CategorySkeleton key={i} />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-muted-foreground">
                        {t('loadError')}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {categories?.slice(0, 12).map((category) => (
                            <CategoryCard key={category.id} category={category} />
                        ))}
                    </div>
                )}

                {/* Mobile View All Link */}
                <div className="mt-8 text-center md:hidden">
                    <Link
                        href="/categories"
                        className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                    >
                        {t('seeAll')}
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
