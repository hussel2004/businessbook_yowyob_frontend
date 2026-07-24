'use client';

import { useState, useEffect } from 'react';
import {
    Plus,
    FolderTree,
    Edit,
    Trash,
    RefreshCw
} from 'lucide-react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Pagination } from '@/components/ui/pagination';
import {
    Modal,
    ModalBody,
    ModalDescription,
    ModalFooter,
    ModalHeader,
    ModalTitle,
} from '@/components/ui/modal';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { showToast } from '@/components/ui/toast';

import type { AdminCategory, CategoryFormData } from '@/types/admin';
import {
    getAdminCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from '@/lib/api/admin';
import { getAccessToken } from '@/lib/auth/storage';
import { getApiBaseUrl } from '@/lib/api/endpoints';
import { getAssetUrl } from '@/lib/api/endpoints';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<AdminCategory[]>([]);
    const [allCategories, setAllCategories] = useState<AdminCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
    const [formData, setFormData] = useState<CategoryFormData>({
        name: '',
        description: '',
        icon: '',
        imageUrl: '',
        parentId: undefined,
        displayOrder: 0,
        isActive: true
    });

    const loadCategories = async () => {
        setIsLoading(true);
        try {
            const data = await getAdminCategories();
            setAllCategories(data);
            // Calculate pagination
            const total = data.length;
            const pages = Math.ceil(total / pageSize);
            setTotalPages(pages);
            // Get current page data
            const start = (currentPage - 1) * pageSize;
            const end = start + pageSize;
            setCategories(data.slice(start, end));
        } catch (error) {
            console.error("Failed to load categories", error);
            showToast.error("Erreur lors du chargement des catégories");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, [currentPage]);

    const handleOpenCreate = () => {
        setEditingCategory(null);
        setFormData({
            name: '',
            description: '',
            icon: '',
            imageUrl: '',
            parentId: undefined,
            displayOrder: allCategories.length + 1,
            isActive: true
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (category: AdminCategory) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description,
            icon: category.icon,
            imageUrl: category.imageUrl,
            parentId: category.parentId,
            displayOrder: category.displayOrder,
            isActive: category.isActive
        });
        setIsModalOpen(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);

        try {
            const token = getAccessToken();
            if (!token) {
                showToast.error("Vous devez être connecté");
                setIsUploading(false);
                return;
            }

            // 1. Get Cloudinary signature from backend
            const signatureResponse = await fetch(`${getApiBaseUrl()}/uploads/signature?folder=categories`, {
                headers: { 'Authorization': `Bearer ${token}` }
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
                const localForm = new FormData();
                localForm.append('file', file);

                const uploadResponse = await fetch(`${getApiBaseUrl()}/uploads/categories`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: localForm
                });

                if (!uploadResponse.ok) {
                    throw new Error('Local upload failed');
                }

                const data = await uploadResponse.json();
                finalUrl = data.url;
            }

            // 3. Store URL
            setFormData(prev => ({ ...prev, imageUrl: finalUrl }));
            showToast.success("Image téléchargée");
        } catch (error) {
            console.error("Upload failed", error);
            showToast.error("Erreur lors du téléchargement de l'image");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, formData);
                showToast.success("Catégorie mise à jour");
            } else {
                await createCategory(formData);
                showToast.success("Catégorie créée");
            }
            setIsModalOpen(false);
            loadCategories();
        } catch (error) {
            console.error("Failed to save category", error);
            showToast.error("Erreur lors de l'enregistrement");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
            return;
        }
        try {
            await deleteCategory(id);
            showToast.success("Catégorie supprimée");
            loadCategories();
        } catch (error) {
            showToast.error("Erreur lors de la suppression");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Catégories</h1>
                    <p className="text-muted-foreground">
                        Gestion de la taxonomie du site
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={loadCategories}>
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleOpenCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nouvelle catégorie
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>Nom</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Entreprises</TableHead>
                            <TableHead>Ordre</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">Chargement...</TableCell>
                            </TableRow>
                        ) : categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">Aucune catégorie trouvée</TableCell>
                            </TableRow>
                        ) : (
                            categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>
                                        <div className="h-8 w-8 rounded flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                                            {category.imageUrl ? (
                                                <img src={getAssetUrl(category.imageUrl) || ''} alt={category.name} className="h-full w-full object-cover rounded" />
                                            ) : (
                                                <FolderTree className="h-4 w-4" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{category.name}</TableCell>
                                    <TableCell className="text-muted-foreground font-mono text-xs">
                                        {category.slug}
                                    </TableCell>
                                    <TableCell>{category.organizationCount}</TableCell>
                                    <TableCell>{category.displayOrder}</TableCell>
                                    <TableCell>
                                        {category.isActive ? (
                                            <Badge variant="outline" className="border-green-500 text-green-500">
                                                Active
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">Inactive</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleOpenEdit(category)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => handleDelete(category.id)}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
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
                    Page {currentPage} sur {totalPages} | {categories.length} catégories affichées (Total: {allCategories.length})
                </p>
                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>

            {/* Create/Edit Modal */}
            <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
                <ModalHeader>
                    <ModalTitle>{editingCategory ? 'Modifier la catégorie' : 'Créer une catégorie'}</ModalTitle>
                    <ModalDescription>
                        {editingCategory ? 'Modifiez les informations de la catégorie.' : 'Ajoutez une nouvelle catégorie principale ou sous-catégorie.'}
                    </ModalDescription>
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nom</Label>
                            <Input
                                id="name"
                                placeholder="Ex: Restaurants"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                placeholder="Courte description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="icon">Icône (Lucide)</Label>
                            <Input
                                id="icon"
                                placeholder="Ex: utensils"
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">Image de catégorie</Label>
                            <div className="flex items-center gap-4">
                                {formData.imageUrl && (
                                    <div className="relative h-16 w-16 rounded overflow-hidden border">
                                        <img
                                            src={getAssetUrl(formData.imageUrl) || ''}
                                            alt="Aperçu"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <Input
                                        id="imageUrl"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={isUploading}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Format recommandé : JPG, PNG. Max 5Mo.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="parentId">Catégorie parente (optionnel)</Label>
                            <Select
                                id="parentId"
                                value={formData.parentId || ''}
                                onChange={(e) => setFormData({ ...formData, parentId: e.target.value || undefined })}
                                options={[
                                    { value: '', label: 'Aucune (Catégorie principale)' },
                                    ...allCategories
                                        .filter(c => !c.parentId && c.id !== editingCategory?.id)
                                        .map(c => ({ value: c.id, label: c.name }))
                                ]}
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="displayOrder">Ordre d'affichage</Label>
                                <Input
                                    id="displayOrder"
                                    type="number"
                                    value={formData.displayOrder}
                                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="isActive">Statut</Label>
                                <div className="flex items-center gap-2 h-10">
                                    <Switch
                                        id="isActive"
                                        checked={formData.isActive}
                                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                    />
                                    <span className="text-sm text-muted-foreground">
                                        {formData.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                    <Button onClick={handleSubmit} disabled={!formData.name}>
                        {editingCategory ? 'Mettre à jour' : 'Créer'}
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}
