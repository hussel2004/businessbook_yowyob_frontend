'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { SearchResults } from '@/components/features/search/search-results';
import { FilterChips } from '@/components/ui/filter-chips';
import { Search, Loader2 } from 'lucide-react';
import { getCategories } from '@/lib/api/public';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Get category from URL param
    const categoryParam = searchParams.get('category');
    const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');

    // Fetch categories from backend
    const { data: categories, isLoading: categoriesLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
    });

    // Build filter options from backend categories
    const filterOptions = [
        { id: 'all', label: 'Tout' },
        ...(categories?.map(cat => ({
            id: cat.slug,
            label: cat.name
        })) || [])
    ];

    // Sync URL param with state
    useEffect(() => {
        if (categoryParam && categoryParam !== selectedCategory) {
            setSelectedCategory(categoryParam);
        }
    }, [categoryParam]);

    const handleFilterSelect = (id: string) => {
        setSelectedCategory(id);

        // Update URL
        const params = new URLSearchParams(searchParams.toString());
        if (id === 'all') {
            params.delete('category');
        } else {
            params.set('category', id);
        }
        router.push(`/search?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="bg-background min-h-screen">
            {/* Top Filter Bar (YouTube Style) */}
            <div className="sticky top-16 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
                <div className="container-wrapper py-3 space-y-3">
                    {/* Search Input Area */}
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const query = formData.get('q') as string;
                        const params = new URLSearchParams(searchParams.toString());
                        if (query) {
                            params.set('q', query);
                        } else {
                            params.delete('q');
                        }
                        router.push(`/search?${params.toString()}`, { scroll: false });
                    }} className="flex gap-2 max-w-2xl mx-auto w-full">
                        <div className="relative flex-1">
                            <input
                                name="q"
                                type="text"
                                placeholder="Rechercher une entreprise, un service..."
                                className="w-full h-10 pl-4 pr-10 rounded-full border bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                defaultValue={searchParams.get('q') || ''}
                            />
                            <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        </div>
                        <button type="submit" className="h-10 px-6 rounded-full bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors hidden sm:block">
                            Rechercher
                        </button>
                    </form>

                    {/* Category Filters */}
                    {categoriesLoading ? (
                        <div className="flex items-center gap-2 text-muted-foreground py-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Chargement des catégories...</span>
                        </div>
                    ) : (
                        <FilterChips
                            options={filterOptions}
                            selectedIds={[selectedCategory]}
                            onSelect={handleFilterSelect}
                            className="flex-1 min-w-0"
                        />
                    )}
                </div>
            </div>

            <div className="container-wrapper py-6">
                <div className="max-w-6xl mx-auto">
                    <SearchResults viewMode="list" filterModes={[selectedCategory]} />
                </div>
            </div>
        </div>
    );
}
