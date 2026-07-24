'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Building2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { getSearchSuggestions } from '@/lib/api/public';

export function HeroSection() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('');
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
    const containerRef = useState<HTMLDivElement | null>(null); // Placeholder ref via ref callback actually better

    // Debounce search term
    const debouncedTerm = useDebounce(searchQuery, 300);

    // Fetch suggestions
    const { data: suggestions = [], isLoading } = useQuery({
        queryKey: ['search-suggestions', debouncedTerm],
        queryFn: () => getSearchSuggestions(debouncedTerm),
        enabled: debouncedTerm.length >= 2,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery) params.set('q', searchQuery);
        if (location) params.set('city', location);
        router.push(`/search?${params.toString()}`);
        setIsSuggestionsOpen(false);
    };

    const handleSuggestionClick = (term: string) => {
        setSearchQuery(term);
        setIsSuggestionsOpen(false);
        // Optionally auto-search or just fill
    };

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 md:py-32">
            {/* Background patterns */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

            <div className="container-wrapper relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        L'annuaire de confiance
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        Trouvez des entreprises{' '}
                        <span className="text-gradient-primary">africaines certifiées</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                        Découvrez, vérifiez et contactez des entreprises camerounaises de confiance.
                        Recherchez par nom, catégorie ou localisation.
                    </p>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative z-20">
                        <div className="flex flex-col md:flex-row gap-3 p-3 bg-card rounded-2xl border shadow-soft">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Nom d'entreprise, service..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setIsSuggestionsOpen(true);
                                    }}
                                    className="pl-12 h-14 text-base border-0 focus-visible:ring-0 shadow-none bg-transparent"
                                    onBlur={() => setTimeout(() => setIsSuggestionsOpen(false), 200)} // Delay to allow click
                                />
                                {isSuggestionsOpen && (isLoading || suggestions.length > 0) && searchQuery.length >= 2 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border shadow-lg overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                                        <ul className="py-2 text-left">
                                            {suggestions.map((suggestion, index) => (
                                                <li key={index}>
                                                    <button
                                                        type="button"
                                                        className="w-full text-left px-4 py-2.5 hover:bg-muted/50 transition-colors flex items-center gap-3 text-sm"
                                                        onClick={() => handleSuggestionClick(suggestion)}
                                                    >
                                                        <Search className="h-4 w-4 text-muted-foreground" />
                                                        <span>{suggestion}</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div className="relative md:w-64">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Douala, Yaoundé..."
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="pl-12 h-14 text-base border-0 focus-visible:ring-0 shadow-none bg-transparent"
                                />
                            </div>
                            <Button type="submit" size="lg" className="h-14 px-8">
                                <Search className="h-5 w-5 md:mr-2" />
                                <span className="hidden md:inline">Rechercher</span>
                            </Button>
                        </div>
                    </form>

                    {/* Quick Links */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
                        <span>Populaires:</span>
                        <Link href="/search?category=restaurants" className="px-3 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors">
                            Restaurants
                        </Link>
                        <Link href="/search?category=hotels" className="px-3 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors">
                            Hôtels
                        </Link>
                        <Link href="/search?category=banks" className="px-3 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors">
                            Banques
                        </Link>
                        <Link href="/search?category=health" className="px-3 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors">
                            Santé
                        </Link>
                    </div>
                </div>

                {/* CTA Cards */}
                <div className="mt-16 grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <Link
                        href="/search"
                        className="group p-6 rounded-xl border bg-card/50 backdrop-blur-sm hover:bg-card hover:shadow-soft transition-all"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                <Search className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                                    Trouver une entreprise
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Parcourez notre annuaire d'entreprises vérifiées
                                </p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>
                    <Link
                        href="/register"
                        className="group p-6 rounded-xl border bg-card/50 backdrop-blur-sm hover:bg-card hover:shadow-soft transition-all"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-secondary/10 text-secondary">
                                <Building2 className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold mb-1 group-hover:text-secondary transition-colors">
                                    Inscrire mon entreprise
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Rejoignez l'annuaire et atteignez de nouveaux clients
                                </p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
