'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/lib/auth/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateProfile } from '@/lib/api/profile';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const profileSchema = z.object({
    firstName: z.string().min(1, 'Prénom requis'),
    lastName: z.string().min(1, 'Nom requis'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
    const { user, updateUser } = useAuthStore();

    const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
        },
    });

    const mutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: (updatedUser) => {
            toast.success('Profil mis à jour');
            if (user) {
                updateUser(updatedUser);
            }
        },
        onError: () => {
            toast.error('Erreur lors de la mise à jour');
        }
    });

    const onSubmit = (data: ProfileFormValues) => {
        mutation.mutate(data);
    };

    return (
        <div className="max-w-xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>
                <p className="text-muted-foreground">
                    Gérez vos informations personnelles.
                </p>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">Prénom</Label>
                            <Input id="firstName" {...register('firstName')} />
                            {errors.firstName && <span className="text-xs text-destructive">{errors.firstName.message}</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Nom</Label>
                            <Input id="lastName" {...register('lastName')} />
                            {errors.lastName && <span className="text-xs text-destructive">{errors.lastName.message}</span>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={user?.email || ''} disabled className="bg-muted" />
                        <p className="text-xs text-muted-foreground">L'email ne peut pas être modifié.</p>
                    </div>

                    <div className="pt-4">
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
