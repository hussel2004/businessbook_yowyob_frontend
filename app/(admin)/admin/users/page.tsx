'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    MoreHorizontal,
    ShieldAlert,
    Ban,
    CheckCircle,
    Mail
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
import { showToast } from '@/components/ui/toast';

import type { AdminUser } from '@/types/admin';
import type { UserRole } from '@/types/user';
import { getAdminUsers, suspendUser, reactivateUser, verifyUserEmail, deleteUser } from '@/lib/api/admin';

export default function UsersPage() {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('ALL');
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    const loadUsers = async () => {
        setIsLoading(true);
        try {
            const res = await getAdminUsers({
                search: search || undefined,
                role: roleFilter !== 'ALL' ? roleFilter : undefined,
                page: currentPage - 1,
                size: pageSize
            });
            setUsers(res?.content || []);
            setTotalPages(res?.totalPages || 1);
        } catch (error) {
            console.error("Failed to load users", error);
            showToast.error("Erreur lors du chargement des utilisateurs");
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [roleFilter, search]);

    useEffect(() => {
        loadUsers();
    }, [currentPage, roleFilter]); // Search triggers reset to page 1, which triggers this via currentPage or separate Effect?
    // If search changes -> setCurrentPage(1). If page IS 1, this effect won't fire.
    // So we need to ensure loadUsers fires if search changes even if page is 1.
    // The previous debounce effect on search was:
    // useEffect(() => { ... loadUsers() ... }, [search])

    // Let's keep the debounce effect for search, and the simple effect for pagination.

    // Debounce search could be added here, for now just firing on effect or enter key?
    // Let's just reload on effect for simplicity if search changes, maybe add delay or search button.
    // For MVP, letting user hit enter or just rely on manual refresh for search if not debounced.
    // Actually best to add search button or debounce. I'll rely on a manual effect trigger or just trigger on search change with debounce.
    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage === 1) {
                loadUsers();
            } else {
                setCurrentPage(1);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);


    const handleSuspend = async (user: AdminUser) => {
        const reason = window.prompt("Motif de la suspension :");
        if (!reason) return;

        try {
            await suspendUser(user.id, { reason });
            showToast.success("Utilisateur suspendu");
            loadUsers();
        } catch (error) {
            showToast.error("Erreur lors de la suspension");
        }
    };

    const handleReactivate = async (user: AdminUser) => {
        if (!confirm("Voulez-vous réactiver ce compte ?")) return;

        try {
            await reactivateUser(user.id);
            showToast.success("Utilisateur réactivé");
            loadUsers();
        } catch (error) {
            showToast.error("Erreur lors de la réactivation");
        }
    };

    const handleVerifyEmail = async (user: AdminUser) => {
        if (!confirm("Marquer l'email de cet utilisateur comme vérifié ?")) return;
        try {
            await verifyUserEmail(user.id);
            showToast.success("Email vérifié");
            loadUsers();
        } catch (error) {
            showToast.error("Erreur lors de la vérification");
        }
    };

    const handleDelete = async (user: AdminUser) => {
        if (!confirm("Êtes-vous sûr de vouloir SUPPRIMER définitivement cet utilisateur ? Cette action est irréversible.")) return;

        try {
            await deleteUser(user.id);
            showToast.success("Utilisateur supprimé");
            loadUsers();
        } catch (error) {
            showToast.error("Erreur lors de la suppression");
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'SUPER_ADMIN':
                return <Badge className="bg-red-600">Super Admin</Badge>;
            case 'ADMIN':
                return <Badge className="bg-purple-600">Admin</Badge>;
            case 'BUSINESS_OWNER':
                return <Badge className="bg-blue-600">Propriétaire</Badge>;
            case 'VISITOR':
                return <Badge variant="secondary">Visiteur</Badge>;
            case 'MANAGER': // Legacy or other role
                return <Badge className="bg-blue-600">Manager</Badge>;
            default:
                return <Badge variant="outline">{role}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
                    <p className="text-muted-foreground">
                        Gestion des comptes utilisateurs ({users.length})
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Rechercher nom, email..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="w-[180px]">
                    <Select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        options={[
                            { value: "ALL", label: "Tous les rôles" },
                            { value: "VISITOR", label: "Visiteur" },
                            { value: "BUSINESS_OWNER", label: "Propriétaire" },
                            { value: "ADMIN", label: "Admin" },
                            { value: "SUPER_ADMIN", label: "Super Admin" },
                        ]}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Utilisateur</TableHead>
                            <TableHead>Rôle</TableHead>
                            <TableHead>Entreprises</TableHead>
                            <TableHead>Avis</TableHead>
                            <TableHead>Dernière connexion</TableHead>
                            <TableHead>Vérifié</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8">Chargement...</TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8">Aucun utilisateur trouvé</TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar
                                                src={user.avatarUrl}
                                                fallback={`${(user.firstName || '?')[0]}${(user.lastName || '?')[0]}`}
                                            />
                                            <div>
                                                <div className="font-medium">
                                                    {user.firstName} {user.lastName}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                                    <TableCell>{user.organizationCount}</TableCell>
                                    <TableCell>{user.reviewCount}</TableCell>
                                    <TableCell>
                                        {user.lastLoginAt ? (
                                            format(new Date(user.lastLoginAt), 'dd MMM yyyy', { locale: fr })
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {user.emailVerified ? (
                                            <Badge variant="outline" className="border-green-500 text-green-500 gap-1">
                                                <CheckCircle className="h-3 w-3" /> Vérifié
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="text-muted-foreground">Non</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {user.isSuspended ? (
                                            <Badge variant="destructive">Suspendu</Badge>
                                        ) : user.isActive ? (
                                            <Badge variant="outline" className="border-green-500 text-green-500">
                                                Actif
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">Inactif</Badge>
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
                                                <DropdownItem>
                                                    <Mail className="mr-2 h-4 w-4" /> Envoyer email
                                                </DropdownItem>
                                                <DropdownItem onClick={() => handleVerifyEmail(user)}>
                                                    <CheckCircle className="mr-2 h-4 w-4" /> Vérifier Email
                                                </DropdownItem>
                                                <DropdownSeparator />
                                                <DropdownLabel>Administration</DropdownLabel>
                                                {user.isSuspended ? (
                                                    <DropdownItem
                                                        className="text-green-600"
                                                        onClick={() => handleReactivate(user)}
                                                    >
                                                        <CheckCircle className="mr-2 h-4 w-4" /> Réactiver compte
                                                    </DropdownItem>
                                                ) : (
                                                    <DropdownItem
                                                        className="text-red-600"
                                                        destructive
                                                        onClick={() => handleSuspend(user)}
                                                    >
                                                        <Ban className="mr-2 h-4 w-4" /> Suspendre compte
                                                    </DropdownItem>
                                                )}
                                                {user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN' && (
                                                    <DropdownItem
                                                        className="text-red-600"
                                                        destructive
                                                        onClick={() => handleDelete(user)}
                                                    >
                                                        <Ban className="mr-2 h-4 w-4" /> Supprimer compte
                                                    </DropdownItem>
                                                )}
                                                {user.role !== 'SUPER_ADMIN' && (
                                                    <DropdownItem>
                                                        <ShieldAlert className="mr-2 h-4 w-4" /> Changer rôle
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
            </div>
            {/* Pagination - Debug Mode */}
            <div className="flex flex-col items-center gap-2 py-4 border-t">
                <p className="text-sm text-muted-foreground">
                    Page {currentPage} sur {totalPages} | {users.length} utilisateurs affichés
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
