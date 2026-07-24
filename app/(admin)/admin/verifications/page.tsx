'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';

import type { VerificationRequest } from '@/types/admin';
import { getPendingVerifications } from '@/lib/api/admin';

export default function VerificationsPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    const loadVerifications = async () => {
        setIsLoading(true);
        try {
            const res = await getPendingVerifications({
                status: statusFilter !== 'ALL' ? statusFilter : undefined,
                page: currentPage - 1,
                size: pageSize
            });
            setVerifications(res.content);
            setTotalPages(res.totalPages || 1);
        } catch (error) {
            console.error("Failed to load verifications", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter]);

    useEffect(() => {
        loadVerifications();
    }, [currentPage, statusFilter]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return <Badge className="bg-green-600 hover:bg-green-700"><CheckCircle className="mr-1 h-3 w-3" /> Approuvé</Badge>;
            case 'REJECTED':
                return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" /> Rejeté</Badge>;
            default:
                return <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200"><Clock className="mr-1 h-3 w-3" /> En attente</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Vérifications</h1>
                    <p className="text-muted-foreground">
                        Gestion des demandes de vérification d'entreprise
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Rechercher entreprise..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="w-[180px]">
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        options={[
                            { value: "ALL", label: "Tous les statuts" },
                            { value: "PENDING", label: "En attente" },
                            { value: "APPROVED", label: "Approuvé" },
                            { value: "REJECTED", label: "Rejeté" },
                        ]}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Entreprise</TableHead>
                            <TableHead>Type Document</TableHead>
                            <TableHead>Date soumission</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">Chargement...</TableCell>
                            </TableRow>
                        ) : verifications.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">Aucune demande trouvée</TableCell>
                            </TableRow>
                        ) : (
                            verifications.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">
                                        {item.organizationName}
                                        <div className="text-xs text-muted-foreground">{item.organizationSlug}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{item.documentType.replace(/_/g, ' ')}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(item.submittedAt), 'dd MMM yyyy', { locale: fr })}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(item.status)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => router.push(`/admin/verifications/${item.id}`)}
                                        >
                                            <Eye className="mr-2 h-4 w-4" />
                                            Examiner
                                        </Button>
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
                    Page {currentPage} sur {totalPages} | {verifications.length} demandes affichées
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
