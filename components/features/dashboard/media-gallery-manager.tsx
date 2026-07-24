'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import {
    Upload,
    Image as ImageIcon,
    Video,
    FileText,
    Trash2,
    Star,
    GripVertical,
    X,
    Check,
    Eye,
    Edit2,
} from 'lucide-react';
import type { OrganizationMedia } from '@/types/organization';
import toast from 'react-hot-toast';
import { getAssetUrl } from '@/lib/api/endpoints';

interface MediaGalleryManagerProps {
    media: OrganizationMedia[];
    isLoading?: boolean;
    organizationId: string;
    onUpload: (file: File) => Promise<void>;
    onDelete: (mediaId: string) => Promise<void>;
    onSetCover: (mediaId: string) => Promise<void>;
    onUpdate: (mediaId: string, data: Partial<OrganizationMedia>) => Promise<void>;
    onReorder?: (mediaIds: string[]) => Promise<void>;
    maxFiles?: number;
    acceptedTypes?: string[];
}

export function MediaGalleryManager({
    media,
    isLoading,
    // organizationId,
    onUpload,
    onDelete,
    onSetCover,
    onUpdate,
    onReorder,
    maxFiles = 20,
    acceptedTypes = ['image/*', 'video/*'],
}: MediaGalleryManagerProps) {
    const getImageUrl = (path: string | null | undefined) => getAssetUrl(path) || '';

    const [uploading, setUploading] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<OrganizationMedia | null>(null);
    const [editingMedia, setEditingMedia] = useState<OrganizationMedia | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [draggedItem, setDraggedItem] = useState<string | null>(null);

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            if (media.length + acceptedFiles.length > maxFiles) {
                toast.error(`Maximum ${maxFiles} fichiers autorisés`);
                return;
            }

            setUploading(true);
            try {
                for (const file of acceptedFiles) {
                    await onUpload(file);
                }
                toast.success(`${acceptedFiles.length} fichier(s) uploadé(s)`);
            } catch (error) {
                toast.error('Erreur lors de l\'upload');
            } finally {
                setUploading(false);
            }
        },
        [media.length, maxFiles, onUpload]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
        disabled: uploading || media.length >= maxFiles,
        maxSize: 10 * 1024 * 1024, // 10MB
    });

    const handleDelete = async (mediaId: string) => {
        try {
            await onDelete(mediaId);
            toast.success('Fichier supprimé');
            setDeleteConfirm(null);
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const handleSetCover = async (mediaId: string) => {
        try {
            await onSetCover(mediaId);
            toast.success('Image de couverture définie');
        } catch (error) {
            toast.error('Erreur lors de la mise à jour');
        }
    };

    const handleUpdate = async (mediaId: string, data: Partial<OrganizationMedia>) => {
        try {
            await onUpdate(mediaId, data);
            toast.success('Informations mises à jour');
            setEditingMedia(null);
        } catch (error) {
            toast.error('Erreur lors de la mise à jour');
        }
    };

    const handleDragStart = (mediaId: string) => {
        setDraggedItem(mediaId);
    };

    const handleDragOver = (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        if (!draggedItem || draggedItem === targetId || !onReorder) return;

        const newOrder = [...media];
        const draggedIndex = newOrder.findIndex((m) => m.id === draggedItem);
        const targetIndex = newOrder.findIndex((m) => m.id === targetId);

        if (draggedIndex !== -1 && targetIndex !== -1) {
            const [removed] = newOrder.splice(draggedIndex, 1);
            if (removed) {
                newOrder.splice(targetIndex, 0, removed);
            }
            // We don't immediately call onReorder here to avoid too many API calls
        }
    };

    const handleDragEnd = async () => {
        if (draggedItem && onReorder) {
            const newOrder = media.map((m) => m.id);
            try {
                await onReorder(newOrder);
            } catch (error) {
                // Revert on error
            }
        }
        setDraggedItem(null);
    };

    const getMediaIcon = (fileType: string) => {
        switch (fileType) {
            case 'video':
                return <Video className="h-6 w-6" />;
            case 'document':
                return <FileText className="h-6 w-6" />;
            default:
                return <ImageIcon className="h-6 w-6" />;
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="aspect-square rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Upload Zone */}
            <div
                {...getRootProps()}
                className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border hover:border-primary/50'}
          ${uploading || media.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}
        `}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-3">
                    <div className="p-4 rounded-full bg-primary/10">
                        <Upload className={`h-8 w-8 text-primary ${uploading ? 'animate-bounce' : ''}`} />
                    </div>
                    {isDragActive ? (
                        <p className="text-lg font-medium text-primary">Déposez les fichiers ici...</p>
                    ) : uploading ? (
                        <p className="text-lg font-medium">Upload en cours...</p>
                    ) : (
                        <>
                            <p className="text-lg font-medium">
                                Glissez vos images ici ou <span className="text-primary">parcourez</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                                PNG, JPG, WEBP ou MP4 jusqu&apos;à 10MB ({media.length}/{maxFiles} fichiers)
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Gallery Grid */}
            {media.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {media.map((item) => (
                        <div
                            key={item.id}
                            draggable={!!onReorder}
                            onDragStart={() => handleDragStart(item.id)}
                            onDragOver={(e) => handleDragOver(e, item.id)}
                            onDragEnd={handleDragEnd}
                            className={`
                group relative aspect-square rounded-xl overflow-hidden border bg-card
                transition-all duration-200
                ${draggedItem === item.id ? 'opacity-50 scale-95' : ''}
                ${item.isCover ? 'ring-2 ring-primary ring-offset-2' : ''}
              `}
                        >
                            {/* Media Preview */}
                            {item.fileType?.toLowerCase() === 'image' ? (
                                <img
                                    src={getImageUrl(item.thumbnailUrl || item.fileUrl)}
                                    alt={item.altText || item.fileName}
                                    className="w-full h-full object-cover"
                                />
                            ) : item.fileType?.toLowerCase() === 'video' ? (
                                <video
                                    src={getImageUrl(item.fileUrl)}
                                    className="w-full h-full object-cover"
                                    muted
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-muted">
                                    {getMediaIcon(item.fileType)}
                                </div>
                            )}

                            {/* Cover Badge */}
                            {item.isCover && (
                                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-current" />
                                    Couverture
                                </div>
                            )}

                            {/* Drag Handle */}
                            {onReorder && (
                                <div className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                                    <GripVertical className="h-4 w-4 text-white" />
                                </div>
                            )}

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 text-white hover:bg-white/20"
                                    onClick={() => setSelectedMedia(item)}
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 text-white hover:bg-white/20"
                                    onClick={() => setEditingMedia(item)}
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                {!item.isCover && item.fileType === 'image' && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 text-white hover:bg-white/20"
                                        onClick={() => handleSetCover(item.id)}
                                    >
                                        <Star className="h-4 w-4" />
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 text-red-400 hover:bg-red-500/20"
                                    onClick={() => setDeleteConfirm(item.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Delete Confirm */}
                            {deleteConfirm === item.id && (
                                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 p-4">
                                    <p className="text-white text-sm text-center">Supprimer ce fichier ?</p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            <Check className="h-4 w-4 mr-1" />
                                            Oui
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setDeleteConfirm(null)}
                                        >
                                            <X className="h-4 w-4 mr-1" />
                                            Non
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {media.length === 0 && !isLoading && (
                <div className="text-center py-12 text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune image dans la galerie</p>
                    <p className="text-sm">Ajoutez des photos pour présenter votre entreprise</p>
                </div>
            )}

            {/* Preview Modal */}
            <Modal open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
                {selectedMedia && (
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">{selectedMedia.fileName}</h3>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedMedia(null)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="max-h-[70vh] overflow-auto rounded-lg">
                            {selectedMedia.fileType?.toLowerCase() === 'image' ? (
                                <img
                                    src={getImageUrl(selectedMedia.fileUrl)}
                                    alt={selectedMedia.altText || selectedMedia.fileName}
                                    className="w-full h-auto"
                                />
                            ) : selectedMedia.fileType?.toLowerCase() === 'video' ? (
                                <video src={getImageUrl(selectedMedia.fileUrl)} controls className="w-full" />
                            ) : (
                                <div className="p-8 text-center">
                                    <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                                    <p>{selectedMedia.fileName}</p>
                                </div>
                            )}
                        </div>
                        {selectedMedia.caption && (
                            <p className="mt-4 text-muted-foreground">{selectedMedia.caption}</p>
                        )}
                    </div>
                )}
            </Modal>

            {/* Edit Modal */}
            <Modal open={!!editingMedia} onOpenChange={() => setEditingMedia(null)}>
                {editingMedia && (
                    <div className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Modifier les informations</h3>

                        <div className="flex gap-4">
                            <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                {editingMedia.fileType?.toLowerCase() === 'image' ? (
                                    <img
                                        src={getImageUrl(editingMedia.thumbnailUrl || editingMedia.fileUrl)}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        {getMediaIcon(editingMedia.fileType)}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 space-y-3">
                                <div>
                                    <Label htmlFor="altText">Texte alternatif</Label>
                                    <Input
                                        id="altText"
                                        placeholder="Description de l'image"
                                        defaultValue={editingMedia.altText || ''}
                                        onChange={(e) =>
                                            setEditingMedia({ ...editingMedia, altText: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="caption">Légende</Label>
                                    <Input
                                        id="caption"
                                        placeholder="Légende visible sous l'image"
                                        defaultValue={editingMedia.caption || ''}
                                        onChange={(e) =>
                                            setEditingMedia({ ...editingMedia, caption: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={() => setEditingMedia(null)}>
                                Annuler
                            </Button>
                            <Button
                                onClick={() =>
                                    handleUpdate(editingMedia.id, {
                                        altText: editingMedia.altText,
                                        caption: editingMedia.caption,
                                    })
                                }
                            >
                                Enregistrer
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default MediaGalleryManager;
