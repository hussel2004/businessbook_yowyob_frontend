'use client';

import { useAuthStore } from '@/lib/auth/auth-store';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { get } from '@/lib/api/client';
import { ENDPOINTS, getAssetUrl } from '@/lib/api/endpoints';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Building2, MapPin, MoreHorizontal } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { OrganizationSummary } from '@/lib/api/public';

export default function OrganizationsPage() {
    const t = useTranslations('organizations');
    const { user } = useAuthStore();
    const { data: organizations, isLoading } = useQuery({
        queryKey: ['my-organizations'],
        queryFn: () => get<OrganizationSummary[]>(ENDPOINTS.ORGANIZATIONS.MY),
    });

    const { data: stats } = useQuery({
        queryKey: ['dashboard-stats', user?.id],
        queryFn: async () => {
            const { getDashboardStats } = await import('@/lib/api/dashboard');
            return getDashboardStats();
        },
        enabled: !!user,
    });

    // Only BUSINESS accounts can create organizations
    // VISITOR accounts cannot create organizations
    const canCreateOrganization = user?.accountType === 'BUSINESS';

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
                    <p className="text-muted-foreground">
                        {t('subtitle')}
                    </p>
                </div>
                {canCreateOrganization && (
                    <Link
                        href="/organizations/create"
                        className={buttonVariants()}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        {t('addBusiness')}
                    </Link>
                )}
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            ) : organizations?.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border rounded-xl bg-card text-center">
                    <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{t('emptyTitle')}</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm">
                        {t('emptyDescription')}
                    </p>
                    <Link
                        href="/organizations/create"
                        className={buttonVariants()}
                    >
                        {t('addBusiness')}
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {organizations?.map((org) => (
                        <div key={org.id} className="flex items-center justify-between p-6 border rounded-xl bg-card hover:shadow-sm transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    {org.logoUrl ? (
                                        <img src={getAssetUrl(org.logoUrl) || ''} alt={org.longName} className="h-full w-full object-cover" />
                                    ) : (
                                        <Building2 className="h-8 w-8 text-muted-foreground" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg hover:underline">
                                        <Link href={`/organizations/${org.slug}`}>{org.longName}</Link>
                                    </h3>
                                    <div className="flex gap-2 text-sm text-muted-foreground mb-1">
                                        <span>{org.categoryName}</span>
                                        <span>•</span>
                                        <span className={org.isVerified ? "text-green-600" : "text-amber-600"}>
                                            {org.isVerified ? t('verified') : t('pending')}
                                        </span>
                                    </div>
                                    {org.city && (
                                        <div className="flex items-center text-xs text-muted-foreground">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            {org.city}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/organizations/${org.slug}`}
                                    className={buttonVariants({ variant: "outline", size: "sm" })}
                                >
                                    Gérer
                                </Link>
                                <DropdownMenu>
                                    <DropdownMenuTrigger
                                        className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <Link
                                            href={`/business/${org.slug}`}
                                            target="_blank"
                                            className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                                        >
                                            Voir la page publique
                                        </Link>
                                        <DropdownMenuSeparator />
                                        <Link
                                            href={`/organizations/${org.slug}/edit`}
                                            className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                                        >
                                            Modifier
                                        </Link>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
