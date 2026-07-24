'use client';

import { OrganizationSummary } from "@/lib/api/public";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Star } from "lucide-react";

interface SimilarOrganizationsProps {
    organizations: OrganizationSummary[];
}

export function SimilarOrganizations({ organizations }: SimilarOrganizationsProps) {
    if (!organizations || organizations.length === 0) {
        return null;
    }

    return (
        <div className="space-y-6 mt-12">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Entreprises similaires</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {organizations.map((org) => (
                    <Card key={org.id} className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
                        <div className="aspect-video w-full bg-muted relative overflow-hidden">
                            {org.coverImageUrl ? (
                                <img
                                    src={org.coverImageUrl}
                                    alt={org.name}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                    No Image
                                </div>
                            )}
                        </div>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="line-clamp-1 text-lg">
                                        <Link href={`/business/${org.slug}`} className="hover:underline">
                                            {org.name}
                                        </Link>
                                    </CardTitle>
                                    {org.city && (
                                        <span className="text-sm text-muted-foreground">{org.city}</span>
                                    )}
                                </div>
                                {org.averageRating !== undefined && org.averageRating > 0 && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-primary text-primary" />
                                        {org.averageRating.toFixed(1)}
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 pb-4">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {org.shortDescription}
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Link href={`/business/${org.slug}`} className="w-full">
                                <Button variant="outline" className="w-full">Voir la fiche</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
