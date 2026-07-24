'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search,
    MoreHorizontal,
    Globe,
    Building2,
    CheckCircle,
    XCircle,
    Ban,
    ShieldCheck,
    ShieldAlert,
    Rocket
} from 'lucide-react';

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
import { Avatar } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownContent,
    DropdownItem,
    DropdownLabel,
    DropdownSeparator,
    DropdownTrigger,
} from '@/components/ui/dropdown-menu';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalDescription,
    ModalBody,
    ModalFooter
} from '@/components/ui/modal';
import { showToast } from '@/components/ui/toast';

import type { AdminOrganization } from '@/types/admin';
import {
    getAdminOrganizations,
    suspendOrganization,
    quickVerifyOrganization,
    unverifyOrganization,
    boostOrganization
} from '@/lib/api/admin';
import { getAssetUrl } from '@/lib/api/endpoints';

export default function OrganizationsPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [orgs, setOrgs] = useState<AdminOrganization[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    // Boost Modal State
    const [boostModalOpen, setBoostModalOpen] = useState(false);
    const [selectedOrgForBoost, setSelectedOrgForBoost] = useState<AdminOrganization | null>(null);
    const [boostDuration, setBoostDuration] = useState<string>("30");

    const loadOrgs = async () => {
        setIsLoading(true);
        try {
            const res = await getAdminOrganizations({
                search: search || undefined,
                status: statusFilter !== 'ALL' ? statusFilter : undefined,
                page: currentPage - 1,
                size: pageSize
            });
            setOrgs(res.content);
            setTotalPages(res.totalPages || 1);
        } catch (error) {
            console.error("Failed to load organizations", error);
            showToast.error("Erreur lors du chargement des entreprises");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter, search]);

    useEffect(() => {
        loadOrgs();
    }, [currentPage, statusFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage === 1) {
                loadOrgs();
            } else {
                setCurrentPage(1);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleSuspend = async (org: AdminOrganization) => {
        const reason = window.prompt("Motif de la suspension :");
        if (!reason) return;

        try {
            await suspendOrganization(org.id, reason);
            showToast.success("Entreprise suspendue");
            loadOrgs();
        } catch (error) {
            showToast.error("Erreur lors de la suspension");
        }
    };

    const handleVerify = async (org: AdminOrganization) => {
        if (!confirm("Confirmer la vérification rapide de cette entreprise ?")) return;
        try {
            await quickVerifyOrganization(org.id);
            showToast.success("Entreprise vérifiée");
            loadOrgs();
        } catch (error) {
            showToast.error("Erreur lors de la vérification");
        }
    };

    const handleUnverify = async (org: AdminOrganization) => {
        if (!confirm("Retirer le statut vérifié de cette entreprise ?")) return;
        try {
            await unverifyOrganization(org.id);
            showToast.success("Statut vérifié retiré");
            loadOrgs();
        } catch (error) {
            showToast.error("Erreur lors de l'action");
        }
    };

    const handleBoost = (org: AdminOrganization) => {
        setSelectedOrgForBoost(org);
        setBoostDuration("30"); // Reset to default
        setBoostModalOpen(true);
    };

    const confirmBoost = async () => {
        if (!selectedOrgForBoost) return;

        try {
            await boostOrganization(selectedOrgForBoost.id, parseInt(boostDuration));
            showToast.success(`Boost activé pour ${selectedOrgForBoost.longName} (${boostDuration} jours)`);
            setBoostModalOpen(false);
            loadOrgs();
        } catch (error) {
            showToast.error("Erreur lors de l'activation du boost");
        }
    };

    const getVerificationBadge = (isVerified: boolean) => {
        if (isVerified) {
            return <Badge className="bg-blue-500 hover:bg-blue-600">Vérifié</Badge>;
        }
        return null;
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge variant="outline" className="text-green-600 border-green-600">Actif</Badge>;
            case 'suspended':
                return <Badge variant="destructive">Suspendu</Badge>;
            case 'archived':
                return <Badge variant="secondary">Archivé</Badge>;
            default:
                return <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200">En attente</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Entreprises</h1>
                    <p className="text-muted-foreground">
                        Gestion des entreprises inscrites
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
                            { value: "active", label: "Actif" },
                            { value: "suspended", label: "Suspendu" },
                            { value: "pending", label: "En attente" },
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
                            <TableHead>Propriétaire</TableHead>
                            <TableHead>Avis</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Booster</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">Chargement...</TableCell>
                            </TableRow>
                        ) : orgs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">Aucune entreprise trouvée</TableCell>
                            </TableRow>
                        ) : (
                            orgs.map((org) => (
                                <TableRow key={org.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                                                {org.logoUrl ? (
                                                    <img src={getAssetUrl(org.logoUrl) || ''} alt={org.longName} className="h-full w-full object-cover" />
                                                ) : (
                                                    <Building2 className="h-5 w-5 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium flex items-center gap-2">
                                                    {org.longName}
                                                    {getVerificationBadge(org.isVerified)}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {org.slug}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar
                                                className="h-6 w-6"
                                                fallback={org.ownerName?.[0] || 'U'}
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{org.ownerName}</span>
                                                <span className="text-xs text-muted-foreground">{org.ownerEmail}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <span className="font-medium">{org.reviewCount}</span> avis
                                            <span className="mx-1">•</span>
                                            <span className="font-medium">{org.averageRating}</span> ★
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(org.status)}
                                    </TableCell>
                                    <TableCell>
                                        {org.isFeatured && org.featuredUntil ? (
                                            <div className="flex flex-col">
                                                <Badge className="w-fit bg-purple-600 hover:bg-purple-700">
                                                    <Rocket className="mr-1 h-3 w-3" /> Actif
                                                </Badge>
                                                <span className="text-xs text-muted-foreground mt-1">
                                                    {new Date(org.featuredUntil) > new Date()
                                                        ? `${Math.ceil((new Date(org.featuredUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}j restants`
                                                        : 'Expiré'}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownTrigger>
                                            <DropdownContent align="end">
                                                <DropdownLabel>Actions</DropdownLabel>
                                                <DropdownItem onClick={() => window.open(`/business/${org.slug}`, '_blank')}>
                                                    <Globe className="mr-2 h-4 w-4" /> Voir profil public
                                                </DropdownItem>
                                                <DropdownItem onClick={() => handleBoost(org)}>
                                                    <Rocket className="mr-2 h-4 w-4 text-purple-600" /> Offrir Booster
                                                </DropdownItem>
                                                <DropdownSeparator />

                                                {/* Verification Actions */}
                                                {!org.isVerified ? (
                                                    <DropdownItem onClick={() => handleVerify(org)}>
                                                        <ShieldCheck className="mr-2 h-4 w-4 text-blue-600" /> Vérifier rapidement
                                                    </DropdownItem>
                                                ) : (
                                                    <DropdownItem onClick={() => handleUnverify(org)}>
                                                        <ShieldAlert className="mr-2 h-4 w-4 text-orange-600" /> Retirer vérification
                                                    </DropdownItem>
                                                )}

                                                <DropdownSeparator />

                                                {/* Suspension */}
                                                {org.status !== 'suspended' && (
                                                    <DropdownItem
                                                        className="text-red-600"
                                                        destructive
                                                        onClick={() => handleSuspend(org)}
                                                    >
                                                        <Ban className="mr-2 h-4 w-4" /> Suspendre
                                                    </DropdownItem>
                                                )}
                                            </DropdownContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                {/* Pagination */}
                <div className="flex flex-col items-center gap-2 py-4 border-t">
                    <p className="text-sm text-muted-foreground">
                        Page {currentPage} sur {totalPages} | {orgs.length} entreprises affichées
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
            {/* Boost Modal */}
            <Modal open={boostModalOpen} onOpenChange={setBoostModalOpen}>
                <ModalHeader>
                    <ModalTitle>Offrir un Boost Business</ModalTitle>
                    <ModalDescription>
                        Configuration de la durée du boost pour <strong>{selectedOrgForBoost?.longName}</strong>
                    </ModalDescription>
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Durée du boost</Label>
                            <Select
                                value={boostDuration}
                                onChange={(e) => setBoostDuration(e.target.value)}
                                options={[
                                    { value: "7", label: "7 Jours (Semaine)" },
                                    { value: "14", label: "14 Jours (2 Semaines)" },
                                    { value: "30", label: "30 Jours (1 Mois)" },
                                    { value: "90", label: "90 Jours (3 Mois)" },
                                    { value: "180", label: "180 Jours (6 Mois)" },
                                    { value: "365", label: "365 Jours (1 An)" }
                                ]}
                            />
                            <p className="text-sm text-muted-foreground">
                                L'entreprise bénéficiera de tous les avantages Premium pendant cette période.
                            </p>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="outline" onClick={() => setBoostModalOpen(false)}>
                        Annuler
                    </Button>
                    <Button onClick={confirmBoost} className="bg-purple-600 hover:bg-purple-700">
                        <Rocket className="mr-2 h-4 w-4" /> Confirmer le Boost
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}
