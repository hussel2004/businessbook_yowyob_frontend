'use client';

import Image from 'next/image';
import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import type { MediaItem } from '@/lib/api/public';
import { getAssetUrl } from '@/lib/api/endpoints';

interface OrgGalleryProps {
    media: MediaItem[];
    organizationName: string;
}

export function OrgGallery({ media, organizationName }: OrgGalleryProps) {
    const getImageUrl = (path: string | null | undefined) => getAssetUrl(path) || '';

    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const images = media.filter((m) => m.fileType?.toLowerCase() === 'image');

    if (images.length === 0) return null;

    const openLightbox = (index: number) => setSelectedIndex(index);
    const closeLightbox = () => setSelectedIndex(null);

    const goNext = () => {
        if (selectedIndex !== null) {
            setSelectedIndex((selectedIndex + 1) % images.length);
        }
    };

    const goPrev = () => {
        if (selectedIndex !== null) {
            setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Galerie photos</h3>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {images.slice(0, 8).map((image, index) => (
                    <button
                        key={image.id}
                        onClick={() => openLightbox(index)}
                        className="relative aspect-square rounded-lg overflow-hidden group"
                    >
                        <Image
                            src={getImageUrl(image.thumbnailUrl || image.fileUrl)}
                            alt={image.altText || image.fileName || `${organizationName} photo ${index + 1}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            unoptimized
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {index === 7 && images.length > 8 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="text-white text-lg font-semibold">
                                    +{images.length - 8}
                                </span>
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Lightbox */}
            {selectedIndex !== null && (
                (() => {
                    const selectedImage = images[selectedIndex];
                    if (!selectedImage) return null;
                    return (
                        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
                            {/* Close button */}
                            <button
                                onClick={closeLightbox}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                <X className="h-6 w-6 text-white" />
                            </button>

                            {/* Navigation */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={goPrev}
                                        className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                    >
                                        <ChevronLeft className="h-6 w-6 text-white" />
                                    </button>
                                    <button
                                        onClick={goNext}
                                        className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                    >
                                        <ChevronRight className="h-6 w-6 text-white" />
                                    </button>
                                </>
                            )}

                            {/* Image */}
                            <div className="relative w-full max-w-4xl max-h-[80vh] mx-4">
                                <Image
                                    src={getImageUrl(selectedImage.fileUrl)}
                                    alt={selectedImage.altText || selectedImage.fileName || `${organizationName} photo`}
                                    width={1200}
                                    height={800}
                                    className="object-contain max-h-[80vh] mx-auto"
                                    unoptimized
                                />
                                {(selectedImage.caption || selectedImage.fileName) && (
                                    <p className="text-white text-center mt-4">
                                        {selectedImage.caption || selectedImage.fileName}
                                    </p>
                                )}
                            </div>

                            {/* Counter */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                                {selectedIndex + 1} / {images.length}
                            </div>
                        </div>
                    );
                })()
            )}
        </div>
    );
}
