'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BadgeCheck, MapPin, Globe, Phone, Mail, Share2, Heart, ArrowLeft, MessageCircle, Lightbulb } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/star-rating';
import type { OrganizationDetail } from '@/lib/api/public';
import { getAssetUrl } from '@/lib/api/endpoints';

interface OrgHeaderProps {
    org: OrganizationDetail;
    onShare?: () => void;
    onFavorite?: () => void;
    onMessage?: () => void;
    onSuggestion?: () => void;
    isFavorite?: boolean;
}

export function OrgHeader({ org, onShare, onFavorite, onMessage, onSuggestion, isFavorite }: OrgHeaderProps) {
    return (
        <div className="relative">
            {/* Cover Image */}
            <div className="relative h-48 md:h-64 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                {org.coverImageUrl ? (
                    <Image
                        src={getAssetUrl(org.coverImageUrl) || ''}
                        alt={`${org.longName} cover`}
                        fill
                        className="object-cover"
                        priority
                        unoptimized
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-secondary/30" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>

            {/* Back button */}
            <Link
                href="/search"
                className="absolute top-4 left-4 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
            >
                <ArrowLeft className="h-5 w-5" />
            </Link>

            {/* Main Content */}
            <div className="container-wrapper relative -mt-16 md:-mt-20 pb-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl border-4 border-background bg-card shadow-soft overflow-hidden">
                            {org.logoUrl ? (
                                <Image
                                    src={getAssetUrl(org.logoUrl) || ''}
                                    alt={`${org.longName} logo`}
                                    width={128}
                                    height={128}
                                    className="w-full h-full object-cover"
                                    unoptimized
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                                    <span className="text-4xl font-bold text-primary">
                                        {org.longName?.charAt(0) || 'E'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <h1 className="text-2xl md:text-3xl font-bold">{org.longName}</h1>
                                    {org.isVerified && (
                                        <BadgeCheck className="h-6 w-6 text-primary flex-shrink-0" />
                                    )}
                                </div>
                                {org.tagline && (
                                    <p className="text-muted-foreground text-lg mb-2">{org.tagline}</p>
                                )}

                                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                                    {org.categoryName && <Badge variant="secondary">{org.categoryName}</Badge>}
                                    {org.yearFounded && (
                                        <span>Depuis {org.yearFounded}</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <StarRating rating={org.averageRating ?? 0} size="default" />
                                        <span className="font-semibold">{(org.averageRating ?? 0).toFixed(1)}</span>
                                        <span className="text-muted-foreground">
                                            ({org.reviewCount ?? 0} avis)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onShare}
                                >
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Partager
                                </Button>
                                <Button
                                    variant={isFavorite ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={onFavorite}
                                >
                                    <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                                    {isFavorite ? 'Favoris' : 'Ajouter'}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onSuggestion}
                                    title="Faire une suggestion"
                                    className="px-2.5"
                                >
                                    <Lightbulb className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={onMessage}
                                >
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    Envoyer un message
                                </Button>
                            </div>
                        </div>

                        {/* Quick Contact Info */}
                        <div className="flex flex-wrap gap-4 text-sm">
                            {org.primaryPhone && (
                                <a
                                    href={`tel:${org.primaryPhone}`}
                                    className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Phone className="h-4 w-4" />
                                    {org.primaryPhone}
                                </a>
                            )}
                            {org.primaryEmail && (
                                <a
                                    href={`mailto:${org.primaryEmail}`}
                                    className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Mail className="h-4 w-4" />
                                    {org.primaryEmail}
                                </a>
                            )}
                            {org.websiteUrl && (
                                <a
                                    href={org.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Globe className="h-4 w-4" />
                                    Site web
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
