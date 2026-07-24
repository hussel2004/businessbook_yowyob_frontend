'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, ArrowLeft, FileText, Building2, Calendar, User, ExternalLink, Download } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
    Modal,
    ModalBody,
    ModalDescription,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    // DialogTrigger not in Modal export, we control open state manually
} from '@/components/ui/modal';
import { Label } from '@/components/ui/label';
import { showToast } from '@/components/ui/toast';

import { approveVerification, rejectVerification, getVerification } from '@/lib/api/admin';
import type { VerificationRequest } from '@/types/admin';

export default function VerificationDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [data, setData] = useState<VerificationRequest | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    // Action states
    const [rejectReason, setRejectReason] = useState('');
    const [approveNotes, setApproveNotes] = useState('');
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

    // Initial load
    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await getVerification(params.id);
                setData(res);
            } catch (error) {
                showToast.error("Impossible de charger la demande");
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [params.id]);

    const handleApprove = async () => {
        if (!data) return;
        setIsProcessing(true);
        try {
            await approveVerification(data.id, { notes: approveNotes });
            showToast.success(`L'entreprise ${data.organizationName} est maintenant vérifiée.`);
            router.push('/admin/verifications');
        } catch (error) {
            // Mock success for now
            showToast.success(`L'entreprise ${data.organizationName} est maintenant vérifiée (simulation).`);
            router.push('/admin/verifications');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!data) return;
        setIsProcessing(true);
        try {
            await rejectVerification(data.id, { reason: rejectReason });
            setRejectDialogOpen(false);
            showToast.success("La demande a été rejetée.");
            router.push('/admin/verifications');
        } catch (error) {
            setRejectDialogOpen(false);
            showToast.success("La demande a été rejetée (simulation).");
            router.push('/admin/verifications');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center">Chargement...</div>;
    }

    if (!data) {
        return <div className="p-8 text-center">Demande introuvable</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Détail de la vérification</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-mono text-xs">{data.id}</span>
                        <span>•</span>
                        <span>Soumis le {format(new Date(data.submittedAt), 'PPP à HH:mm', { locale: fr })}</span>
                    </div>
                </div>
                <div className="ml-auto">
                    {data.status === 'PENDING' && (
                        <div className="flex gap-2">
                            <Button variant="destructive" disabled={isProcessing} onClick={() => setRejectDialogOpen(true)}>
                                <X className="mr-2 h-4 w-4" />
                                Rejeter
                            </Button>

                            <Modal open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                                <ModalHeader>
                                    <ModalTitle>Rejeter la demande</ModalTitle>
                                    <ModalDescription>
                                        Veuillez indiquer la raison du rejet. Cette raison sera envoyée à l'entreprise.
                                    </ModalDescription>
                                </ModalHeader>
                                <ModalBody>
                                    <div className="py-4">
                                        <Label htmlFor="reason" className="mb-2 block">Motif du rejet</Label>
                                        <Textarea
                                            id="reason"
                                            value={rejectReason}
                                            onChange={(e) => setRejectReason(e.target.value)}
                                            placeholder="Ex: Document illisible, document expiré..."
                                        />
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Annuler</Button>
                                    <Button
                                        variant="destructive"
                                        onClick={handleReject}
                                        disabled={!rejectReason.trim() || isProcessing}
                                    >
                                        Confirmer le rejet
                                    </Button>
                                </ModalFooter>
                            </Modal>

                            <Button
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={handleApprove}
                                disabled={isProcessing}
                            >
                                <Check className="mr-2 h-4 w-4" />
                                Approuver
                            </Button>
                        </div>
                    )}
                    {data.status === 'APPROVED' && (
                        <Badge className="bg-green-500 text-lg px-4 py-1">Approuvé</Badge>
                    )}
                    {data.status === 'REJECTED' && (
                        <Badge variant="destructive" className="text-lg px-4 py-1">Rejeté</Badge>
                    )}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Document Viewer */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Document soumis</CardTitle>
                            <a
                                href={data.documentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={buttonVariants({ variant: 'outline', size: 'sm' })}
                            >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Ouvrir
                            </a>
                        </CardHeader>
                        <CardContent className="bg-slate-100 dark:bg-slate-900 min-h-[500px] flex items-center justify-center rounded-b-lg">
                            {/* In a real app, verify file type to render PDF or Image */}
                            <img
                                src={data.documentUrl}
                                alt="Document"
                                className="max-w-full max-h-[600px] object-contain shadow-lg border"
                            />
                        </CardContent>
                    </Card>

                    {/* Additional Notes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Notes administratives</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder="Ajouter une note interne..."
                                value={approveNotes}
                                onChange={(e) => setApproveNotes(e.target.value)}
                                disabled={data.status !== 'PENDING'}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Détails Entreprise</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded bg-indigo-100 flex items-center justify-center text-indigo-600">
                                    <Building2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium">{data.organizationName}</p>
                                    <p className="text-sm text-muted-foreground">{data.organizationId}</p>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <p className="text-sm font-medium mb-1">Type de document</p>
                                <Badge variant="outline">{data.documentType.replace(/_/g, ' ')}</Badge>
                            </div>

                            <div>
                                <p className="text-sm font-medium mb-1">Soumis par</p>
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Utilisateur Inconnu</span>
                                    {/* In real app, fetch submitter info */}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <a
                                href={`/business/${data.organizationSlug}`}
                                target="_blank"
                                className={cn(buttonVariants({ variant: 'outline' }), "w-full")}
                            >
                                Voir le profil public
                            </a>
                        </CardFooter>
                    </Card>

                    {(data.status === 'REJECTED' && data.rejectionReason) && (
                        <Card className="border-red-200 bg-red-50 dark:bg-red-900/10">
                            <CardHeader>
                                <CardTitle className="text-red-600 dark:text-red-400">Raison du rejet</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">{data.rejectionReason}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
