'use client';

import * as React from 'react';
import { Upload, X, Image as ImageIcon, File, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { Button } from '../ui/button';

export interface FileUploadProps {
    value?: File | File[] | null;
    onChange?: (files: File | File[] | null) => void;
    accept?: string;
    multiple?: boolean;
    maxSize?: number; // in bytes
    maxFiles?: number;
    disabled?: boolean;
    label?: string;
    description?: string;
    error?: string;
    showPreview?: boolean;
    className?: string;
}

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
    ({
        value,
        onChange,
        accept = 'image/*',
        multiple = false,
        maxSize = 5 * 1024 * 1024, // 5MB default
        maxFiles = 5,
        disabled,
        label,
        description,
        error,
        showPreview = true,
        className,
    }, ref) => {
        const [isDragging, setIsDragging] = React.useState(false);
        const [previews, setPreviews] = React.useState<string[]>([]);
        const [isUploading, setIsUploading] = React.useState(false);
        const inputRef = React.useRef<HTMLInputElement>(null);

        const files = React.useMemo(() => {
            if (!value) return [];
            return Array.isArray(value) ? value : [value];
        }, [value]);

        React.useEffect(() => {
            // Generate previews for image files
            const newPreviews: string[] = [];
            files.forEach((file) => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        newPreviews.push(e.target?.result as string);
                        if (newPreviews.length === files.filter(f => f.type.startsWith('image/')).length) {
                            setPreviews([...newPreviews]);
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
            if (files.length === 0) {
                setPreviews([]);
            }
        }, [files]);

        const handleFiles = (fileList: FileList | null) => {
            if (!fileList || disabled) return;

            const newFiles = Array.from(fileList);

            // Validate file size
            const validFiles = newFiles.filter((file) => {
                if (file.size > maxSize) {
                    console.warn(`File ${file.name} exceeds max size of ${formatFileSize(maxSize)}`);
                    return false;
                }
                return true;
            });

            if (validFiles.length === 0) return;

            if (multiple) {
                const combined = [...files, ...validFiles].slice(0, maxFiles);
                onChange?.(combined);
            } else {
                const firstFile = validFiles[0];
                if (firstFile) {
                    onChange?.(firstFile);
                }
            }
        };

        const handleDragOver = (e: React.DragEvent) => {
            e.preventDefault();
            if (!disabled) {
                setIsDragging(true);
            }
        };

        const handleDragLeave = (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
        };

        const handleDrop = (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            handleFiles(e.target.files);
        };

        const removeFile = (index: number) => {
            if (multiple) {
                const newFiles = files.filter((_, i) => i !== index);
                onChange?.(newFiles.length > 0 ? newFiles : null);
            } else {
                onChange?.(null);
            }
        };

        const isImage = (file: File) => file.type.startsWith('image/');

        return (
            <div ref={ref} className={cn('space-y-2', className)}>
                {label && (
                    <label className="text-sm font-medium leading-none">
                        {label}
                    </label>
                )}

                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={cn(
                        'relative flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
                        'hover:border-primary/50 hover:bg-muted/30',
                        isDragging && 'border-primary bg-primary/5',
                        disabled && 'opacity-50 cursor-not-allowed',
                        error && 'border-destructive',
                        files.length > 0 && 'border-solid'
                    )}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept={accept}
                        multiple={multiple}
                        onChange={handleChange}
                        disabled={disabled}
                        className="sr-only"
                    />

                    {files.length === 0 ? (
                        <>
                            <div className="rounded-full bg-muted p-3">
                                <Upload className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium">
                                    Glissez-déposez vos fichiers ici
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    ou cliquez pour sélectionner
                                </p>
                            </div>
                            {description && (
                                <p className="text-xs text-muted-foreground">
                                    {description}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Max: {formatFileSize(maxSize)} {multiple && `• ${maxFiles} fichiers max`}
                            </p>
                        </>
                    ) : (
                        <div className="w-full space-y-2">
                            {files.map((file, idx) => (
                                <div
                                    key={`${file.name}-${idx}`}
                                    className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {showPreview && isImage(file) && previews[idx] ? (
                                        <img
                                            src={previews[idx]}
                                            alt={file.name}
                                            className="h-12 w-12 object-cover rounded"
                                        />
                                    ) : (
                                        <div className="h-12 w-12 flex items-center justify-center bg-muted rounded">
                                            {isImage(file) ? (
                                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                            ) : (
                                                <File className="h-6 w-6 text-muted-foreground" />
                                            )}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 shrink-0"
                                        onClick={() => removeFile(idx)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            {multiple && files.length < maxFiles && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        inputRef.current?.click();
                                    }}
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Ajouter plus de fichiers
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {error && (
                    <p className="text-sm text-destructive">{error}</p>
                )}
            </div>
        );
    }
);
FileUpload.displayName = 'FileUpload';

export { FileUpload };
