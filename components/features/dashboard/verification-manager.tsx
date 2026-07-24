'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import {
    Upload,
    FileText,
    Shield,
    ShieldCheck,
    ShieldX,
    Clock,
    Trash2,
    Eye,
    Calendar,
    Building,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Plus,
    ExternalLink,
} from 'lucide-react';
import type { VerificationDocument, CreateVerificationInput } from '@/types/organization';
import { format, isPast } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

const verificationSchema = z.object({
    documentType: z.string().min(1, 'Type requis'),
    documentNumber: z.string().max(50).optional(),
    fileUrl: z.string().url('URL invalide'),
    fileName: z.string().min(1, 'Nom de fichier requis'),
    issueDate: z.string().optional(),
    expiryDate: z.string().optional(),
    issuingAuthority: z.string().max(100).optional(),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

interface VerificationManagerProps {
    documents: VerificationDocument[];
    isLoading?: boolean;
    organizationId: string;
    isVerified: boolean;
    onSubmitDocument: (data: CreateVerificationInput) => Promise<void>;
    onDeleteDocument: (documentId: string) => Promise<void>;
    onUploadFile?: (file: File) => Promise<string>; // Returns file URL
}

const DOCUMENT_TYPES = [
    { value: 'business_license', label: 'Licence commerciale', icon: '📜' },
    { value: 'tax_certificate', label: 'Attestation fiscale', icon: '🧾' },
    { value: 'id_card', label: 'Pièce d\'identité du gérant', icon: '🪪' },
    { value: 'ownership_proof', label: 'Preuve de propriété', icon: '📋' },
    { value: 'other', label: 'Autre document', icon: '📄' },
];

const STATUS_CONFIG = {
    pending: {
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        icon: Clock,
        label: 'En attente de vérification',
    },
    approved: {
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        icon: CheckCircle,
        label: 'Approuvé',
    },
    rejected: {
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        icon: XCircle,
        label: 'Rejeté',
    },
};

export function VerificationManager({
    documents,
    isLoading,
    isVerified,
    onSubmitDocument,
    onDeleteDocument,
    onUploadFile,
}: VerificationManagerProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadedFileUrl, setUploadedFileUrl] = useState<string>('');
    const [uploadedFileName, setUploadedFileName] = useState<string>('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [previewDoc, setPreviewDoc] = useState<VerificationDocument | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<VerificationFormData>({
        resolver: zodResolver(verificationSchema),
        defaultValues: {
            documentType: 'business_license',
        },
    });

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            if (acceptedFiles.length === 0) return;

            const file = acceptedFiles[0];
            if (!file) return;

            setUploading(true);

            try {
                if (onUploadFile) {
                    const url = await onUploadFile(file);
                    setUploadedFileUrl(url);
                    setUploadedFileName(file.name);
                    setValue('fileUrl', url);
                    setValue('fileName', file.name);
                    toast.success('Fichier uploadé');
                } else {
                    // Fallback: create object URL (for demo)
                    const url = URL.createObjectURL(file);
                    setUploadedFileUrl(url);
                    setUploadedFileName(file.name);
                    setValue('fileUrl', url);
                    setValue('fileName', file.name);
                }
            } catch (error) {
                toast.error('Erreur lors de l\'upload');
            } finally {
                setUploading(false);
            }
        },
        [onUploadFile, setValue]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
        },
        maxSize: 5 * 1024 * 1024, // 5MB
        maxFiles: 1,
        disabled: uploading,
    });

    const openCreateModal = () => {
        setUploadedFileUrl('');
        setUploadedFileName('');
        reset({
            documentType: 'business_license',
            documentNumber: '',
            fileUrl: '',
            fileName: '',
            issueDate: '',
            expiryDate: '',
            issuingAuthority: '',
        });
        setIsModalOpen(true);
    };

    const onSubmit = async (data: VerificationFormData) => {
        try {
            await onSubmitDocument({
                documentType: data.documentType,
                documentNumber: data.documentNumber || undefined,
                fileUrl: data.fileUrl,
                fileName: data.fileName,
                issueDate: data.issueDate || undefined,
                expiryDate: data.expiryDate || undefined,
                issuingAuthority: data.issuingAuthority || undefined,
            });
            toast.success('Document soumis pour vérification');
            setIsModalOpen(false);
            reset();
        } catch (error) {
            toast.error('Erreur lors de la soumission');
        }
    };

    const handleDelete = async (docId: string) => {
        try {
            await onDeleteDocument(docId);
            toast.success('Document supprimé');
            setDeleteConfirm(null);
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const pendingCount = documents.filter((d) => d.status === 'pending').length;
    const approvedCount = documents.filter((d) => d.status === 'approved').length;
    const rejectedCount = documents.filter((d) => d.status === 'rejected').length;

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Verification Status Banner */}
            <div
                className={`p-6 rounded-2xl border-2 ${isVerified
                    ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                    : 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800'
                    }`}
            >
                <div className="flex items-start gap-4">
                    <div
                        className={`p-3 rounded-full ${isVerified ? 'bg-green-100 dark:bg-green-900' : 'bg-yellow-100 dark:bg-yellow-900'
                            }`}
                    >
                        {isVerified ? (
                            <ShieldCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
                        ) : (
                            <Shield className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                        )}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold">
                            {isVerified ? 'Entreprise vérifiée ✓' : 'Vérification en cours'}
                        </h3>
                        <p className="text-muted-foreground mt-1">
                            {isVerified
                                ? 'Votre entreprise a été vérifiée. Le badge de vérification est visible sur votre profil.'
                                : 'Soumettez vos documents officiels pour obtenir le badge de vérification et augmenter la confiance des clients.'}
                        </p>
                        {!isVerified && (
                            <div className="flex items-center gap-4 mt-3 text-sm">
                                {pendingCount > 0 && (
                                    <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                                        <Clock className="h-4 w-4" />
                                        {pendingCount} en attente
                                    </span>
                                )}
                                {approvedCount > 0 && (
                                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                        <CheckCircle className="h-4 w-4" />
                                        {approvedCount} approuvé(s)
                                    </span>
                                )}
                                {rejectedCount > 0 && (
                                    <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                                        <XCircle className="h-4 w-4" />
                                        {rejectedCount} rejeté(s)
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    {!isVerified && (
                        <Button onClick={openCreateModal}>
                            <Plus className="h-4 w-4 mr-2" />
                            Soumettre un document
                        </Button>
                    )}
                </div>
            </div>

            {/* Why Verify Section */}
            {!isVerified && documents.length === 0 && (
                <div className="grid gap-4 md:grid-cols-3">
                    {[
                        {
                            icon: ShieldCheck,
                            title: 'Confiance accrue',
                            description: 'Les clients préfèrent les entreprises vérifiées',
                        },
                        {
                            icon: Building,
                            title: 'Visibilité améliorée',
                            description: 'Apparaissez en priorité dans les résultats',
                        },
                        {
                            icon: CheckCircle,
                            title: 'Badge officiel',
                            description: 'Affichez le badge vérifié sur votre profil',
                        },
                    ].map((item, index) => (
                        <div key={index} className="p-4 rounded-xl border bg-card text-center">
                            <item.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                            <h4 className="font-medium">{item.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Documents List */}
            {documents.length > 0 && (
                <div className="space-y-4">
                    <h3 className="font-semibold">Documents soumis</h3>
                    <div className="grid gap-4">
                        {documents.map((doc) => {
                            const docType = DOCUMENT_TYPES.find((t) => t.value === doc.documentType);
                            const statusConfig = STATUS_CONFIG[doc.status] || STATUS_CONFIG.pending;
                            const StatusIcon = statusConfig.icon;
                            const isExpired = doc.expiryDate && isPast(new Date(doc.expiryDate));

                            return (
                                <div
                                    key={doc.id}
                                    className={`flex items-start gap-4 p-4 border rounded-xl bg-card ${doc.status === 'rejected' ? 'border-red-200 dark:border-red-900' : ''
                                        }`}
                                >
                                    {/* Icon */}
                                    <div className="p-3 rounded-lg bg-muted">
                                        <FileText className="h-6 w-6 text-muted-foreground" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-lg">{docType?.icon}</span>
                                            <h4 className="font-medium">{docType?.label || doc.documentType}</h4>
                                            <Badge className={statusConfig.color}>
                                                <StatusIcon className="h-3 w-3 mr-1" />
                                                {statusConfig.label}
                                            </Badge>
                                            {isExpired && (
                                                <Badge variant="destructive">
                                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                                    Expiré
                                                </Badge>
                                            )}
                                        </div>

                                        <p className="text-sm text-muted-foreground truncate">{doc.fileName}</p>

                                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                            {doc.documentNumber && <span>N° {doc.documentNumber}</span>}
                                            {doc.issueDate && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    Émis le {format(new Date(doc.issueDate), 'dd MMM yyyy', { locale: fr })}
                                                </span>
                                            )}
                                            {doc.expiryDate && (
                                                <span className={isExpired ? 'text-red-500' : ''}>
                                                    Expire le {format(new Date(doc.expiryDate), 'dd MMM yyyy', { locale: fr })}
                                                </span>
                                            )}
                                        </div>

                                        {/* Rejection Reason */}
                                        {doc.status === 'rejected' && doc.rejectionReason && (
                                            <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-sm">
                                                <p className="font-medium">Motif du rejet :</p>
                                                <p>{doc.rejectionReason}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => window.open(doc.fileUrl, '_blank')}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        {doc.status !== 'approved' && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-600"
                                                onClick={() => setDeleteConfirm(doc.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>

                                    {/* Delete Confirm */}
                                    {deleteConfirm === doc.id && (
                                        <Modal open onOpenChange={() => setDeleteConfirm(null)}>
                                            <div className="p-6 text-center">
                                                <Trash2 className="h-12 w-12 mx-auto mb-4 text-red-500" />
                                                <h3 className="text-lg font-semibold mb-2">Supprimer ce document ?</h3>
                                                <p className="text-muted-foreground mb-4">
                                                    Vous devrez le soumettre à nouveau pour la vérification.
                                                </p>
                                                <div className="flex justify-center gap-2">
                                                    <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                                                        Annuler
                                                    </Button>
                                                    <Button variant="destructive" onClick={() => handleDelete(doc.id)}>
                                                        Supprimer
                                                    </Button>
                                                </div>
                                            </div>
                                        </Modal>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {documents.length === 0 && !isVerified && (
                <EmptyState
                    icon={Shield}
                    title="Aucun document soumis"
                    description="Soumettez vos documents officiels pour faire vérifier votre entreprise."
                    action={
                        <Button onClick={openCreateModal}>
                            <Upload className="h-4 w-4 mr-2" />
                            Soumettre un document
                        </Button>
                    }
                />
            )}

            {/* Submit Document Modal */}
            <Modal open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    <h2 className="text-xl font-semibold">Soumettre un document</h2>

                    {/* File Upload */}
                    <div className="space-y-2">
                        <Label>Document (PDF ou Image)</Label>
                        <div
                            {...getRootProps()}
                            className={`
                border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
                ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                ${uploading ? 'opacity-50 cursor-wait' : ''}
              `}
                        >
                            <input {...getInputProps()} />
                            {uploadedFileName ? (
                                <div className="flex items-center justify-center gap-2">
                                    <FileText className="h-6 w-6 text-green-500" />
                                    <span className="font-medium">{uploadedFileName}</span>
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                </div>
                            ) : (
                                <>
                                    <Upload className={`h-8 w-8 mx-auto mb-2 text-muted-foreground ${uploading ? 'animate-bounce' : ''}`} />
                                    <p className="font-medium">
                                        {uploading ? 'Upload en cours...' : 'Glissez votre fichier ici'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">PDF, JPG, PNG jusqu&apos;à 5MB</p>
                                </>
                            )}
                        </div>
                        <input type="hidden" {...register('fileUrl')} />
                        <input type="hidden" {...register('fileName')} />
                        {errors.fileUrl && <p className="text-sm text-red-500">{errors.fileUrl.message}</p>}
                    </div>

                    {/* Document Type */}
                    <div className="space-y-2">
                        <Label htmlFor="documentType">Type de document</Label>
                        <Select {...register('documentType')}>
                            {DOCUMENT_TYPES.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.icon} {type.label}
                                </option>
                            ))}
                        </Select>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {/* Document Number */}
                        <div className="space-y-2">
                            <Label htmlFor="documentNumber">Numéro du document (optionnel)</Label>
                            <Input
                                id="documentNumber"
                                placeholder="Ex: BL-2026-12345"
                                {...register('documentNumber')}
                            />
                        </div>

                        {/* Issuing Authority */}
                        <div className="space-y-2">
                            <Label htmlFor="issuingAuthority">Autorité émettrice (optionnel)</Label>
                            <Input
                                id="issuingAuthority"
                                placeholder="Ex: Ministère du Commerce"
                                {...register('issuingAuthority')}
                            />
                        </div>

                        {/* Issue Date */}
                        <div className="space-y-2">
                            <Label htmlFor="issueDate">Date d&apos;émission (optionnel)</Label>
                            <Input id="issueDate" type="date" {...register('issueDate')} />
                        </div>

                        {/* Expiry Date */}
                        <div className="space-y-2">
                            <Label htmlFor="expiryDate">Date d&apos;expiration (optionnel)</Label>
                            <Input id="expiryDate" type="date" {...register('expiryDate')} />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isSubmitting || !uploadedFileUrl}>
                            {isSubmitting ? 'Envoi...' : 'Soumettre pour vérification'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default VerificationManager;
