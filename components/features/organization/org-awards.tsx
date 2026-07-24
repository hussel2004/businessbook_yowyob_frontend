'use client';

import Image from 'next/image';
import { Award as AwardIcon, Calendar } from 'lucide-react';

interface Award {
    id: string;
    organizationId: string;
    name: string;
    year?: number;
    description?: string;
    imageUrl?: string;
    displayOrder: number;
}

interface OrgAwardsProps {
    awards: Award[];
}

export function OrgAwards({ awards }: OrgAwardsProps) {
    if (awards.length === 0) return null;

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <AwardIcon className="h-5 w-5 text-amber-500" />
                Récompenses & Distinctions
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {awards.map((award) => (
                    <div
                        key={award.id}
                        className="rounded-xl border bg-card overflow-hidden group hover:shadow-md transition-shadow"
                    >
                        {/* Award Image */}
                        {award.imageUrl && (
                            <div className="aspect-video relative bg-muted">
                                <Image
                                    src={award.imageUrl}
                                    alt={award.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        )}

                        {/* Award Info */}
                        <div className="p-4">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <h4 className="font-semibold line-clamp-2">{award.name}</h4>
                                {award.year && (
                                    <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full whitespace-nowrap">
                                        <Calendar className="h-3 w-3" />
                                        {award.year}
                                    </span>
                                )}
                            </div>
                            {award.description && (
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {award.description}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
