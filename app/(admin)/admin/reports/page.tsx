'use client';

import { useState, useEffect } from 'react';
import {
    MoreHorizontal,
    AlertTriangle,
    EyeOff,
    Trash2,
    CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { showToast } from '@/components/ui/toast';

import type { ContentReport } from '@/types/admin';
import { getContentReports, resolveReport } from '@/lib/api/admin';

export default function ReportsPage() {
    const [statusFilter, setStatusFilter] = useState<string>('PENDING');
    const [reports, setReports] = useState<ContentReport[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    const loadReports = async () => {
        setIsLoading(true);
        try {
            const res = await getContentReports({
                status: statusFilter,
                page: currentPage - 1,
                size: pageSize
            });
            setReports(res.content);
            setTotalPages(res.totalPages || 1);
        } catch (error) {
            console.error("Failed to load reports", error);
            showToast.error("Erreur lors du chargement des signalements");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter]);

    useEffect(() => {
        loadReports();
    }, [currentPage, statusFilter]);

    const handleAction = async (id: string, action: 'DISMISS' | 'DELETE' | 'WARN') => {
        if (action === 'DELETE' && !confirm("Voulez-vous vraiment supprimer ce contenu ?")) return;

        try {
            await resolveReport(id, { action });
            showToast.success(action === 'DISMISS' ? "Signalement ignoré" : "Action effectuée");
            loadReports();
        } catch (error) {
            showToast.error("Erreur lors de l'action");
        }
    };

    const getReasonLabel = (reason: string) => {
        switch (reason) {
            case 'SPAM': return 'Spam';
            case 'INAPPROPRIATE': return 'Contenu inapproprié';
            case 'HARASSMENT': return 'Harcèlement';
            case 'FALSE_INFORMATION': return 'Fausse information';
            default: return reason;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Modération</h1>
                    <p className="text-muted-foreground">
                        Gestion des signalements et contenus inappropriés
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="w-[180px]">
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        options={[
                            { value: "PENDING", label: "En attente" },
                            { value: "RESOLVED", label: "Résolu" },
                            { value: "DISMISSED", label: "Ignoré" },
                        ]}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Raison</TableHead>
                            <TableHead className="w-[300px]">Contenu signalé</TableHead>
                            <TableHead>Signalé par</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">Chargement...</TableCell>
                            </TableRow>
                        ) : reports.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    Aucun signalement trouvé.
                                </TableCell>
                            </TableRow>
                        ) : (
                            reports.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {report.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium text-red-600">
                                        {getReasonLabel(report.reason)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="truncate max-w-[300px]">
                                            {report.targetTitle && <span className="font-bold block">{report.targetTitle}</span>}
                                            <span className="text-muted-foreground text-sm">{report.targetContent}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{report.reporterName}</TableCell>
                                    <TableCell>
                                        {format(new Date(report.createdAt), 'dd MMM', { locale: fr })}
                                    </TableCell>
                                    <TableCell>
                                        {report.status === 'PENDING' ? (
                                            <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                                                En attente
                                            </Badge>
                                        ) : report.status === 'RESOLVED' ? (
                                            <Badge className="bg-green-600">Résolu</Badge>
                                        ) : (
                                            <Badge variant="secondary">Ignoré</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {report.status === 'PENDING' && (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleAction(report.id, 'DISMISS')}
                                                    title="Ignorer"
                                                >
                                                    <EyeOff className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleAction(report.id, 'DELETE')}
                                                    title="Supprimer contenu"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col items-center gap-2 py-4 border-t">
                <p className="text-sm text-muted-foreground">
                    Page {currentPage} sur {totalPages} | {reports.length} signalements affichés
                </p>
                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>
        </div>
    );
}
