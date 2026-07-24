'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Modal } from '@/components/ui/modal';
import {
    OrgHeader,
    OrgAgencies,
    OrgContactForm,
    OrgGallery,
    OrgReviews,
    OrgPosts,
    OrgPromotions,
    OrgLegalInfo,
    OrgBusinessInfo,
    OrgAwards,
    OrgSocialLinks
} from '@/components/features/organization';
import { OrgContactListPublic } from '@/components/features/organization/org-contact-list-public';
import { OrgSuggestionForm } from '@/components/features/organization/org-suggestion-form';
import { SimilarOrganizations } from '@/components/features/organizations/similar-organizations';
import {
    getOrganizationBySlug,
    getOrganizationAgencies,
    getOrganizationGallery,
    getOrganizationReviews,
    getOrganizationRatingSummary,
    getOrganizationServices,
    getOrganizationPosts,
    getOrganizationPromotions,
    checkFavorite,
    addFavorite,
    removeFavorite,
    getSimilarOrganizations,
    getOrganizationAwards,
    getOrganizationContacts,
} from '@/lib/api/public';
import React, { useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { toast } from 'react-hot-toast';
import type { Service } from '@/lib/api/public';
import { getAssetUrl } from '@/lib/api/endpoints';
import { AuthPromptModal } from '@/components/ui/auth-prompt-modal';
import { useAuthPrompt } from '@/lib/hooks/use-auth-prompt';
import { AdPlacement } from '@/components/features/ads/ad-placement';

const getImageUrl = (path: string | null | undefined) => getAssetUrl(path) || '';

function ServiceCard({ service }: { service: Service }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasLongDescription = service.description && service.description.length > 100;

    return (
        <div className="group border rounded-lg bg-card overflow-hidden hover:shadow-md transition-all">
            {/* Service Image */}
            <div className="h-40 bg-muted/30 relative overflow-hidden">
                {service.imageUrl ? (
                    <img
                        src={getImageUrl(service.imageUrl)}
                        alt={service.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-accent/20">
                        <span className="text-4xl">🛠️</span>
                    </div>
                )}
                {/* Price Tag Overlay */}
                {service.price && (
                    <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold shadow-sm border">
                        {service.price.toLocaleString()} {service.currency || 'FCFA'}
                    </div>
                )}
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start gap-2 mb-2">
                    <h4 className="font-semibold text-lg leading-tight">{service.name}</h4>
                </div>

                {service.duration && (
                    <div className="flex items-center text-xs text-muted-foreground mb-3">
                        <span className="bg-muted px-2 py-1 rounded-md">
                            ⏱️ {service.duration} min
                        </span>
                    </div>
                )}

                {service.description && (
                    <div className="text-sm text-muted-foreground">
                        <p className={!isExpanded ? 'line-clamp-2' : ''}>
                            {service.description}
                        </p>
                        {hasLongDescription && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="text-primary text-xs font-medium mt-1 hover:underline focus:outline-none"
                            >
                                {isExpanded ? 'Voir moins' : 'Voir plus'}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function OrgServices({ services }: { services: Service[] }) {
    if (services.length === 0) return null;

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold">Nos services</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                ))}
            </div>
        </div>
    );
}

export default function BusinessPage({ params }: { params: { slug: string } }) {
    const queryClient = useQueryClient();
    const { isAuthenticated } = useAuthStore();
    const [isFavorite, setIsFavorite] = useState(false);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
    const { showPrompt, promptAction, closePrompt, requireAuth } = useAuthPrompt();

    // Fetch organization data
    const { data: org, isLoading: orgLoading, error } = useQuery({
        queryKey: ['organization', params.slug],
        queryFn: () => getOrganizationBySlug(params.slug),
    });

    // Fetch agencies
    const { data: agencies = [] } = useQuery({
        queryKey: ['organization', params.slug, 'agencies'],
        queryFn: () => getOrganizationAgencies(org?.id || ''),
        enabled: !!org?.id,
    });

    // Fetch services
    const { data: services = [] } = useQuery({
        queryKey: ['organization', params.slug, 'services'],
        queryFn: () => getOrganizationServices(org?.id || ''),
        enabled: !!org?.id,
    });

    // Fetch gallery
    const { data: gallery = [] } = useQuery({
        queryKey: ['organization', params.slug, 'gallery'],
        queryFn: () => getOrganizationGallery(org?.id || ''),
        enabled: !!org?.id,
    });

    // Fetch posts
    const { data: postsData } = useQuery({
        queryKey: ['organization', params.slug, 'posts'],
        queryFn: () => getOrganizationPosts(org?.id || ''),
        enabled: !!org?.id,
    });

    // Fetch promotions
    const { data: promotionsData } = useQuery({
        queryKey: ['organization', params.slug, 'promotions'],
        queryFn: () => getOrganizationPromotions(org?.id || ''),
        enabled: !!org?.id,
    });

    // Fetch reviews
    const { data: reviewsData } = useQuery({
        queryKey: ['organization', params.slug, 'reviews'],
        queryFn: () => getOrganizationReviews(org?.id || '', 0, 5),
        enabled: !!org?.id,
    });

    // Fetch rating summary
    const { data: ratingSummary } = useQuery({
        queryKey: ['organization', params.slug, 'rating-summary'],
        queryFn: () => getOrganizationRatingSummary(org?.id || ''),
        enabled: !!org?.id,
    });

    // Check favorite status
    const { data: favoriteData } = useQuery({
        queryKey: ['favorite', org?.id],
        queryFn: async () => {
            if (!org?.id) return null;
            return await checkFavorite(org.id);
        },
        enabled: !!org?.id && isAuthenticated,
    });

    // Update favorite state when data changes
    React.useEffect(() => {
        if (favoriteData) {
            setIsFavorite(favoriteData.isFavorite);
        }
    }, [favoriteData]);



    // Fetch similar organizations
    const { data: similarOrgs = [] } = useQuery({
        queryKey: ['organization', params.slug, 'similar'],
        queryFn: () => getSimilarOrganizations(org?.id || ''),
        enabled: !!org?.id,
    });

    // Fetch awards
    const { data: awards = [] } = useQuery({
        queryKey: ['organization', params.slug, 'awards'],
        queryFn: () => getOrganizationAwards(org?.id || ''),
        enabled: !!org?.id,
    });

    // Fetch contacts (for social links)
    const { data: contacts = [] } = useQuery({
        queryKey: ['organization', params.slug, 'contacts'],
        queryFn: () => getOrganizationContacts(org?.id || ''),
        enabled: !!org?.id,
    });



    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: org?.longName,
                    text: org?.shortDescription || `Découvrez ${org?.longName} sur BusinessBook`,
                    url: window.location.href,
                });
            } catch {
                // User cancelled or error
            }
        } else {
            await navigator.clipboard.writeText(window.location.href);
            toast.success('Lien copié !');
        }
    };

    const handleFavorite = async () => {
        if (!isAuthenticated) {
            requireAuth('ajouter aux favoris', () => { });
            return;
        }

        if (!org) return;

        try {
            if (isFavorite) {
                await removeFavorite(org.id);
                setIsFavorite(false);
                toast.success('Retiré des favoris');
                // Invalidate cache to ensure state is synced
                queryClient.invalidateQueries({ queryKey: ['favorite', org.id] });
                queryClient.invalidateQueries({ queryKey: ['my-favorites'] });
            } else {
                await addFavorite(org.id);
                setIsFavorite(true);
                toast.success('Ajouté aux favoris');
                // Invalidate cache to ensure state is synced
                queryClient.invalidateQueries({ queryKey: ['favorite', org.id] });
                queryClient.invalidateQueries({ queryKey: ['my-favorites'] });
            }
        } catch (error: any) {
            console.log('FAVORITE ERROR FULL OBJECT:', error);
            console.log('FAVORITE ERROR RESPONSE:', error?.response);
            console.log('FAVORITE ERROR STATUS:', error?.status);

            // Check for conflict (already favorite) - handle both Axios structure and direct status
            const status = error?.response?.status || error?.status;
            if (status === 409) {
                // Conflict means it was already added, so treat as success and sync state
                setIsFavorite(true);
                toast.success('Ajouté aux favoris');
                // Invalidate queries to ensure everything is in sync
                queryClient.invalidateQueries({ queryKey: ['favorite', org.id] });
                queryClient.invalidateQueries({ queryKey: ['my-favorites'] });
                return;
            }
            console.error(error);
            toast.error('Une erreur est survenue');
        }
    };

    if (error) {
        notFound();
    }

    if (orgLoading) {
        return (
            <div>
                <div className="h-64 bg-muted" />
                <div className="container-wrapper py-8">
                    <div className="flex gap-6 -mt-16">
                        <Skeleton className="w-32 h-32 rounded-xl" />
                        <div className="flex-1 pt-8">
                            <Skeleton className="h-8 w-64 mb-2" />
                            <Skeleton className="h-5 w-48 mb-4" />
                            <Skeleton className="h-5 w-32" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!org) return null;

    return (
        <div>
            <OrgHeader
                org={org}
                onShare={handleShare}
                onFavorite={handleFavorite}
                onMessage={() => requireAuth('envoyer un message', () => setIsMessageModalOpen(true))}
                onSuggestion={() => setIsSuggestionModalOpen(true)}
                isFavorite={isFavorite}
            />

            {/* Social Links */}
            <div className="container-wrapper py-4">
                <OrgSocialLinks contacts={contacts} />
            </div>

            <div className="container-wrapper pb-6">
                <AdPlacement slotId="business-detail-top" format="leaderboard" />
            </div>

            <div className="container-wrapper py-8">
                <Tabs defaultValue="about" className="space-y-6">
                    <TabsList className="w-full justify-start overflow-x-auto">
                        <TabsTrigger value="about">À propos</TabsTrigger>
                        <TabsTrigger value="services">Services</TabsTrigger>
                        <TabsTrigger value="gallery">Galerie{gallery.length > 0 ? ` (${gallery.length})` : ''}</TabsTrigger>
                        <TabsTrigger value="posts">Articles {postsData?.totalElements ? `(${postsData.totalElements})` : ''}</TabsTrigger>
                        <TabsTrigger value="promotions">Promotions {promotionsData?.totalElements ? `(${promotionsData.totalElements})` : ''}</TabsTrigger>
                        <TabsTrigger value="reviews">Avis ({org.reviewCount ?? 0})</TabsTrigger>
                        <TabsTrigger value="contact">Contacts</TabsTrigger>
                    </TabsList>

                    <TabsContent value="about" className="space-y-8">
                        {/* Description */}
                        {org.description && (
                            <div className="prose dark:prose-invert max-w-none">
                                <h3 className="text-lg font-semibold mb-3">Description</h3>
                                <p className="text-muted-foreground">{org.description}</p>
                            </div>
                        )}

                        {/* Legal Info */}
                        <OrgLegalInfo
                            organization={{
                                legalForm: org.legalForm,
                                registrationNumber: org.registrationNumber,
                                taxNumber: org.taxNumber || org.taxId,
                                yearFounded: org.yearFounded,
                            }}
                            headquartersAddress={agencies.find(b => b.isHeadquarters) ? {
                                city: agencies.find(b => b.isHeadquarters)?.address?.city,
                                neighborhood: agencies.find(b => b.isHeadquarters)?.address?.neighborhood,
                                addressLine1: agencies.find(b => b.isHeadquarters)?.address?.streetLine1,
                            } : undefined}
                        />

                        {/* Business Info */}
                        <OrgBusinessInfo
                            organization={{
                                employeeCountRange: org.employeeCountRange || org.employeeCount,
                                annualRevenueRange: org.annualRevenueRange,
                                capital: org.capital,
                            }}
                        />

                        {/* Awards */}
                        <OrgAwards awards={awards} />

                        {/* Agencies */}
                        <OrgAgencies agencies={agencies} />
                    </TabsContent>

                    <TabsContent value="services">
                        <OrgServices services={services} />
                    </TabsContent>

                    <TabsContent value="gallery">
                        <OrgGallery media={gallery} organizationName={org.longName} />
                    </TabsContent>

                    <TabsContent value="posts">
                        <OrgPosts posts={postsData?.content || []} />
                    </TabsContent>

                    <TabsContent value="promotions">
                        <OrgPromotions promotions={promotionsData?.content || []} />
                    </TabsContent>

                    <TabsContent value="reviews">
                        <OrgReviews
                            reviews={reviewsData?.content || []}
                            summary={ratingSummary}
                            organizationId={org.id}
                            ownerId={org.ownerId}
                        />
                    </TabsContent>

                    <TabsContent value="contact">
                        <div className="max-w-4xl">
                            <OrgContactListPublic contacts={contacts} />
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Message Modal */}
                <Modal open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
                    <OrgContactForm
                        organizationId={org.id}
                        organizationName={org.longName}
                        onCancel={() => setIsMessageModalOpen(false)}
                    />
                </Modal>

                {/* Suggestion Modal */}
                <Modal open={isSuggestionModalOpen} onOpenChange={setIsSuggestionModalOpen}>
                    <OrgSuggestionForm organizationId={org.id} />
                </Modal>

                {/* Similar Organizations Section */}
                {similarOrgs.length > 0 && (
                    <SimilarOrganizations organizations={similarOrgs as any} />
                )}

                {/* Auth Prompt Modal */}
                <AuthPromptModal
                    isOpen={showPrompt}
                    onClose={closePrompt}
                    action={promptAction}
                />
            </div>
        </div>
    );
}
