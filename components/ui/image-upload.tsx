'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { getAccessToken } from '@/lib/auth/storage';
import { getApiBaseUrl, getAssetUrl } from '@/lib/api/endpoints';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string | undefined) => void;
    category?: string;
    className?: string;
}

export function ImageUpload({ value, onChange, category = 'services', className }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(value || null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Sync preview with value prop changes (e.g. after form reset)
    useEffect(() => {
        setPreview(value || null);
    }, [value]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Veuillez sélectionner une image');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('L\'image ne doit pas dépasser 5 Mo');
            return;
        }

        // Show local preview
        const localUrl = URL.createObjectURL(file);
        setPreview(localUrl);

        // Upload
        setIsUploading(true);
        try {
            const token = getAccessToken();
            if (!token) {
                toast.error('Vous devez être connecté pour télécharger une image');
                setPreview(value || null);
                setIsUploading(false);
                return;
            }

            // 1. Get Signature from Backend
            const signatureResponse = await fetch(`${getApiBaseUrl()}/uploads/signature?folder=${category}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!signatureResponse.ok) {
                throw new Error('Failed to get upload signature');
            }

            const { signature, timestamp, cloudName, apiKey, folder } = await signatureResponse.json();

            const cloudinaryConfigured = cloudName && apiKey &&
                cloudName !== 'placeholder' && apiKey !== 'placeholder';

            let finalUrl: string;

            if (cloudinaryConfigured) {
                // 2a. Upload directly to Cloudinary
                const formData = new FormData();
                formData.append('file', file);
                formData.append('api_key', apiKey);
                formData.append('timestamp', timestamp.toString());
                formData.append('signature', signature);
                formData.append('folder', folder);

                const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: 'POST',
                    body: formData
                });

                if (!uploadResponse.ok) {
                    const errorData = await uploadResponse.json();
                    throw new Error(errorData.error?.message || 'Cloudinary upload failed');
                }

                const data = await uploadResponse.json();
                finalUrl = data.secure_url;
            } else {
                // 2b. Fallback: upload to local backend storage
                const formData = new FormData();
                formData.append('file', file);

                const uploadResponse = await fetch(`${getApiBaseUrl()}/uploads/${category}`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                });

                if (!uploadResponse.ok) {
                    throw new Error('Local upload failed');
                }

                const data = await uploadResponse.json();
                finalUrl = data.url;
            }

            // 3. Update parent with URL
            onChange(finalUrl);
            setPreview(finalUrl);
            toast.success('Image téléchargée');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Erreur lors du téléchargement');
            setPreview(value || null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onChange(undefined);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <div className={className}>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
                disabled={isUploading}
            />

            {preview ? (
                <div className="relative rounded-lg border overflow-hidden bg-muted">
                    <div className="aspect-video relative">
                        <Image
                            src={getAssetUrl(preview) || preview || ''}
                            alt="Preview"
                            fill
                            className="object-cover"
                            unoptimized={true}
                        />
                    </div>
                    {isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 text-white animate-spin" />
                        </div>
                    )}
                    {!isUploading && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="w-full aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 
                               hover:border-primary/50 hover:bg-muted/50 transition-colors
                               flex flex-col items-center justify-center gap-2 text-muted-foreground"
                    disabled={isUploading}
                >
                    {isUploading ? (
                        <Loader2 className="h-8 w-8 animate-spin" />
                    ) : (
                        <>
                            <div className="p-3 rounded-full bg-muted">
                                <Upload className="h-6 w-6" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium">Cliquez pour télécharger</p>
                                <p className="text-xs">PNG, JPG jusqu'à 5 Mo</p>
                            </div>
                        </>
                    )}
                </button>
            )}
        </div>
    );
}
