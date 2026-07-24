'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Layers, X } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getCategories, Category } from '@/lib/api/public';
import { getAssetUrl } from '@/lib/api/endpoints';

interface MapSidebarProps {
    className?: string;
}

export function MapSidebar({ className }: MapSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category');

    // Fetch categories
    const { data: categories = [], isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        staleTime: 60 * 60 * 1000, // 1 hour
    });

    const handleCategorySelect = (slug: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (slug) {
            params.set('category', slug);
        } else {
            params.delete('category');
        }
        router.push(`/map?${params.toString()}`);
    };

    if (isLoading) {
        return <MapSidebarSkeleton className={className} />;
    }

    return (
        <div className={cn("w-20 md:w-64 bg-background/95 backdrop-blur-sm border-r h-full flex flex-col shadow-xl z-[400]", className)}>
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-semibold text-sm md:text-base hidden md:block">Catégories</h2>
                <Layers className="h-5 w-5 md:hidden mx-auto" />
                {currentCategory && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hidden md:flex"
                        onClick={() => handleCategorySelect(null)}
                        title="Tout effacer"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-2 space-y-1">
                    {/* All Categories */}
                    <button
                        onClick={() => handleCategorySelect(null)}
                        className={cn(
                            "w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors hover:bg-muted",
                            !currentCategory ? "bg-primary/10 text-primary" : "text-muted-foreground"
                        )}
                    >
                        <div className={cn(
                            "w-10 h-10 rounded-md flex items-center justify-center shrink-0 border",
                            !currentCategory ? "bg-background border-primary/20" : "bg-muted/50 border-transparent"
                        )}>
                            <Layers className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium leading-none hidden md:block">Toutes les catégories</span>
                    </button>

                    {/* Mapping */}
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleCategorySelect(category.slug)}
                            className={cn(
                                "w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors hover:bg-muted group",
                                currentCategory === category.slug ? "bg-primary/10 text-primary" : "text-muted-foreground"
                            )}
                        >
                            <div className="w-10 h-10 rounded-md overflow-hidden shrink-0 border relative bg-muted">
                                {category.imageUrl ? (
                                    <Image
                                        src={getAssetUrl(category.imageUrl) || category.imageUrl}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-110"
                                        sizes="40px"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <Layers className="h-4 w-4 opacity-50" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0 hidden md:block">
                                <p className="text-sm font-medium truncate leading-snug">{category.name}</p>
                                <p className="text-[10px] text-muted-foreground truncate">
                                    {category.organizationCount} lieux
                                </p>
                            </div>
                            {currentCategory === category.slug && (
                                <ChevronRight className="h-4 w-4 hidden md:block" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function MapSidebarSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn("w-20 md:w-64 bg-background border-r h-full p-2 space-y-2", className)}>
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 overflow-hidden">
                    <Skeleton className="w-10 h-10 rounded-md shrink-0" />
                    <div className="space-y-1 flex-1 hidden md:block">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}
