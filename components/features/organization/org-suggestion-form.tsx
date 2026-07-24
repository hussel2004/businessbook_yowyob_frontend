'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createSuggestion } from '@/lib/api/suggestions';
import { ApiException } from '@/lib/api/client';

const CATEGORIES = [
    { value: 'amelioration', label: 'Amélioration' },
    { value: 'produit', label: 'Produit ou service' },
    { value: 'service', label: 'Expérience client' },
    { value: 'autre', label: 'Autre' },
] as const;

const suggestionSchema = z.object({
    senderName: z.string().min(2, 'Le nom est requis'),
    senderEmail: z.string().email('Email invalide').optional().or(z.literal('')),
    category: z.string().default('autre'),
    content: z.string().min(10, 'La suggestion doit contenir au moins 10 caractères').max(2000),
});

type SuggestionFormData = z.infer<typeof suggestionSchema>;

interface OrgSuggestionFormProps {
    organizationId: string;
}

export function OrgSuggestionForm({ organizationId }: OrgSuggestionFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SuggestionFormData>({
        resolver: zodResolver(suggestionSchema),
        defaultValues: { category: 'autre' },
    });

    const onSubmit = async (data: SuggestionFormData) => {
        setError(null);
        setIsSubmitting(true);
        try {
            await createSuggestion(organizationId, {
                senderName: data.senderName,
                senderEmail: data.senderEmail || undefined,
                category: data.category,
                content: data.content,
            });
            setIsSuccess(true);
            reset();
        } catch (err) {
            if (err instanceof ApiException) {
                setError(err.message);
            } else {
                setError('Une erreur est survenue. Veuillez réessayer.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="max-w-xl mx-auto p-8 rounded-xl border bg-card text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-7 w-7 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Suggestion envoyée !</h3>
                <p className="text-sm text-muted-foreground mb-6">
                    Merci pour votre retour. Votre suggestion a été transmise à l&apos;équipe de l&apos;entreprise.
                </p>
                <Button variant="outline" onClick={() => setIsSuccess(false)}>
                    Envoyer une autre suggestion
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Boîte à suggestions</h3>
                    <p className="text-sm text-muted-foreground">
                        Partagez une idée ou une suggestion pour améliorer cette entreprise
                    </p>
                </div>
            </div>

            {error && (
                <Alert variant="error" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6 rounded-xl border bg-card">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="senderName">Nom *</Label>
                        <Input
                            id="senderName"
                            placeholder="Votre nom"
                            {...register('senderName')}
                        />
                        {errors.senderName && (
                            <p className="text-sm text-destructive">{errors.senderName.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="senderEmail">Email <span className="text-muted-foreground">(optionnel)</span></Label>
                        <Input
                            id="senderEmail"
                            type="email"
                            placeholder="votre@email.com"
                            {...register('senderEmail')}
                        />
                        {errors.senderEmail && (
                            <p className="text-sm text-destructive">{errors.senderEmail.message}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category">Catégorie</Label>
                    <select
                        id="category"
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        {...register('category')}
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="content">Votre suggestion *</Label>
                    <Textarea
                        id="content"
                        placeholder="Décrivez votre suggestion ou idée d'amélioration..."
                        rows={5}
                        {...register('content')}
                    />
                    {errors.content && (
                        <p className="text-sm text-destructive">{errors.content.message}</p>
                    )}
                </div>

                <Button type="submit" fullWidth isLoading={isSubmitting}>
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Envoyer la suggestion
                </Button>
            </form>
        </div>
    );
}
