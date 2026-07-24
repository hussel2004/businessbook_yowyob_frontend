'use client';

import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle, Share2, Eye, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Post } from '@/lib/api/public';
import { getAssetUrl } from '@/lib/api/endpoints';

interface OrgPostsProps {
    posts: Post[];
}

export function OrgPosts({ posts }: OrgPostsProps) {
    if (posts.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p>Aucun article publié pour le moment.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
                <div key={post.id} className="group rounded-xl border bg-card overflow-hidden hover:shadow-md transition-shadow">
                    {/* Image */}
                    <div className="aspect-video relative overflow-hidden bg-muted">
                        {post.coverImageUrl ? (
                            <Image
                                src={getAssetUrl(post.coverImageUrl) || ''}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                                unoptimized
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full bg-muted/50">
                                <span className="text-muted-foreground">Pas d'image</span>
                            </div>
                        )}
                        <div className="absolute top-2 right-2">
                            <Badge variant={post.status === 'published' ? 'default' : 'secondary'} className="capitalize">
                                {post.status === 'published' ? 'Article' : post.status}
                            </Badge>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>
                                    {formatDistanceToNow(new Date(post.publishedAt || post.createdAt), {
                                        addSuffix: true,
                                        locale: fr
                                    })}
                                </span>
                            </div>
                            <Link href={`/posts/${post.slug}`} className="block">
                                <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                                    {post.title}
                                </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {post.excerpt || post.content.substring(0, 100)}...
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    <span>{post.viewsCount}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Heart className="h-4 w-4" />
                                    <span>{post.likesCount}</span>
                                </div>
                            </div>
                            <Link
                                href={`/posts/${post.slug}`}
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                Lire la suite
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
