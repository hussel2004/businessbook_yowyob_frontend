'use client';

import { useQuery } from '@tanstack/react-query';
import { get } from '@/lib/api/client';
import { ENDPOINTS, getAssetUrl } from '@/lib/api/endpoints';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { MessageSquare, Building2, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { OrganizationSummary } from '@/lib/api/public';
import { EmptyState } from '@/components/ui/empty-state';

export default function InquiriesPage() {
    const { data: organizations, isLoading } = useQuery({
        queryKey: ['my-organizations'],
        queryFn: () => get<OrganizationSummary[]>(ENDPOINTS.ORGANIZATIONS.MY),
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
                <p className="text-muted-foreground">
                    Gérez les demandes de renseignements reçues par vos entreprises.
                </p>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
            ) : organizations?.length === 0 ? (
                <EmptyState
                    icon={MessageSquare}
                    title="Aucune entreprise"
                    description="Vous devez d'abord créer une entreprise pour recevoir des messages."
                    action={{
                        label: 'Créer une entreprise',
                        onClick: () => window.location.href = '/organizations/create',
                    }}
                />
            ) : (
                <div className="grid gap-4">
                    {organizations?.map((org) => (
                        <div key={org.id} className="flex items-center justify-between p-6 border rounded-xl bg-card hover:shadow-sm transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    {org.logoUrl ? (
                                        <img src={getAssetUrl(org.logoUrl) || ''} alt={org.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <Building2 className="h-6 w-6 text-muted-foreground" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{org.name}</h3>
                                    <p className="text-sm text-muted-foreground">Voir la boîte de réception</p>
                                </div>
                            </div>
                            <Link
                                href={`/organizations/${org.slug}/inquiries`}
                                className={buttonVariants({ variant: 'outline' })}
                            >
                                Accéder
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
