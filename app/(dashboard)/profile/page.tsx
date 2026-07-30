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
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

type ProfileFormValues = {
    firstName: string;
    lastName: string;
};

export default function ProfilePage() {
    const t = useTranslations('profile');
    const { user, updateUser } = useAuthStore();

    // Messages de validation résolus à chaque rendu pour suivre la langue active
    const profileSchema = z.object({
        firstName: z.string().min(1, t('firstNameRequired')),
        lastName: z.string().min(1, t('lastNameRequired')),
    });

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
            toast.success(t('updated'));
            if (user) {
                updateUser(updatedUser);
            }
        },
        onError: () => {
            toast.error(t('updateError'));
        }
    });

    const onSubmit = (data: ProfileFormValues) => {
        mutation.mutate(data);
    };

    return (
        <div className="max-w-xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
                <p className="text-muted-foreground">
                    {t('subtitle')}
                </p>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">{t('firstName')}</Label>
                            <Input id="firstName" {...register('firstName')} />
                            {errors.firstName && <span className="text-xs text-destructive">{errors.firstName.message}</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">{t('lastName')}</Label>
                            <Input id="lastName" {...register('lastName')} />
                            {errors.lastName && <span className="text-xs text-destructive">{errors.lastName.message}</span>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">{t('email')}</Label>
                        <Input id="email" value={user?.email || ''} disabled className="bg-muted" />
                        <p className="text-xs text-muted-foreground">{t('emailLocked')}</p>
                    </div>

                    <div className="pt-4">
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? t('saving') : t('saveChanges')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
