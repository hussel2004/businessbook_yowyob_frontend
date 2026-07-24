'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { Tag, Calendar, Gift, Percent, ExternalLink, Rocket } from 'lucide-react';

import { getPromotions, getCategories, type Promotion, type Category } from '@/lib/api/public';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

function getDiscountLabel(promo: Promotion): string {
    switch (promo.discountType) {
        case 'PERCENTAGE':
            return `-${promo.discountValue}%`;
        case 'FIXED_AMOUNT':
            return `-${promo.discountValue} FCFA`;
        case 'BOGO':
            return '1+1 Gratuit';
        case 'FREE_ITEM':
            return 'Cadeau offert';
        default:
            return 'Offre spéciale';
    }
}

function PromotionCard({ promo }: { promo: Promotion }) {
    const discountLabel = getDiscountLabel(promo);
    const daysLeft = Math.ceil((new Date(promo.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    return (
        <Link
            href={`/business/${promo.organizationSlug}`}
            className="group rounded-xl border bg-card overflow-hidden hover:shadow-soft transition-all"
        >
            {/* Promo Image */}
            <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20">
                {promo.imageUrl ? (
                    <Image
                        src={promo.imageUrl}
                        alt={promo.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Gift className="h-16 w-16 text-primary/30" />
                    </div>
                )}

                {/* Discount Badge */}
                <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-primary-foreground font-bold text-sm px-3 py-1">
                        {discountLabel}
                    </Badge>
                </div>

                {/* Days Left Badge */}
                {daysLeft > 0 && daysLeft <= 7 && (
                    <div className="absolute top-4 right-4">
                        <Badge variant="destructive" className="text-xs">
                            {daysLeft} jour{daysLeft > 1 ? 's' : ''} restant{daysLeft > 1 ? 's' : ''}
                        </Badge>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                    {promo.organizationLogo && (
                        <div className="w-8 h-8 rounded overflow-hidden">
                            <Image
                                src={promo.organizationLogo}
                                alt={promo.organizationName}
                                width={32}
                                height={32}
                                className="object-cover"
                            />
                        </div>
                    )}
                    <span className="text-sm text-muted-foreground">{promo.organizationName}</span>
                </div>

                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {promo.title}
                </h3>

                {promo.description && (
                    <p className="text-muted-foreground line-clamp-2 mb-4">
                        {promo.description}
                    </p>
                )}

                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Jusqu'au {formatDate(promo.endDate)}
                    </div>
                    {promo.code && (
                        <div className="flex items-center gap-1 font-mono bg-muted px-2 py-1 rounded text-xs">
                            <Tag className="h-3 w-3" />
                            {promo.code}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}

function PromotionSkeleton() {
    return (
        <div className="rounded-xl border bg-card overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                    <Skeleton className="w-8 h-8 rounded" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-20" />
                </div>
            </div>
        </div>
    );
}

export default function PromotionsPage() {
    const [page, setPage] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const pageSize = 12;

    // Fetch categories
    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: () => getCategories(),
        staleTime: 10 * 60 * 1000,
    });

    // Fetch promotions from Business Booster organizations only
    const { data, isLoading, error } = useQuery({
        queryKey: ['promotions', page, selectedCategory],
        queryFn: () => getPromotions(page, pageSize, selectedCategory || undefined),
        staleTime: 5 * 60 * 1000,
    });

    const promotions = data?.content || [];
    const totalPages = data?.totalPages || 0;

    const handleCategoryChange = (categoryId: string | null) => {
        setSelectedCategory(categoryId);
        setPage(0);
    };

    return (
        <div className="py-12">
            <div className="container-wrapper">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Promotions</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Découvrez les offres exclusives publiées par les entreprises sur BusinessBook.
                    </p>
                </div>

                {true && (
                    <>
                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-2 justify-center mb-8 items-center">
                            <Button
                                variant={selectedCategory === null ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleCategoryChange(null)}
                            >
                                Toutes
                            </Button>
                            {categories.slice(0, 5).map((cat) => (
                                <Button
                                    key={cat.id}
                                    variant={selectedCategory === cat.slug ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleCategoryChange(cat.slug)}
                                >
                                    {cat.name}
                                </Button>
                            ))}
                            {categories.length > 5 && (
                                <div className="relative">
                                    <select
                                        className="appearance-none bg-background border border-input rounded-md px-3 py-1.5 text-sm font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        value={selectedCategory && !categories.slice(0, 5).some(c => c.slug === selectedCategory) ? selectedCategory : ''}
                                        onChange={(e) => handleCategoryChange(e.target.value || null)}
                                    >
                                        <option value="">Plus de catégories...</option>
                                        {categories.slice(5).map((cat) => (
                                            <option key={cat.id} value={cat.slug}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Promotions Grid */}
                        {isLoading ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <PromotionSkeleton key={i} />
                                ))}
                            </div>
                        ) : error ? (
                            <EmptyState
                                icon="error"
                                title="Erreur de chargement"
                                description="Impossible de charger les promotions. Veuillez réessayer."
                            />
                        ) : promotions.length === 0 ? (
                            <EmptyState
                                icon={Gift}
                                title="Aucune promotion en cours"
                                description="Les entreprises publieront bientôt de nouvelles offres exclusives !"
                            />
                        ) : (
                            <>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {promotions.map((promo) => (
                                        <PromotionCard key={promo.id} promo={promo} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-12 flex justify-center">
                                        <Pagination
                                            currentPage={page + 1}
                                            totalPages={totalPages}
                                            onPageChange={(p) => setPage(p - 1)}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}

                {/* Yowyob Link CTA */}
                <div className="mt-16 text-center">
                    <Card className="max-w-2xl mx-auto border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
                        <CardContent className="p-8">
                            <Rocket className="h-12 w-12 mx-auto text-orange-500 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Boostez la visibilité de votre entreprise</h3>
                            <p className="text-muted-foreground mb-2">
                                Yowyob Link est notre plateforme de boosting dédiée aux entreprises africaines.
                            </p>
                            <p className="text-muted-foreground mb-6">
                                Campagnes ciblées, publicités vidéo, mise en avant sur BusinessBook et bien plus encore.
                            </p>
                            <a href="https://link-dev.yowyob.com/" target="_blank" rel="noopener noreferrer">
                                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                                    <ExternalLink className="mr-2 h-5 w-5" />
                                    Découvrir Yowyob Link
                                </Button>
                            </a>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
