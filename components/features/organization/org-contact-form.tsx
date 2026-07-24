'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { submitInquiry } from '@/lib/api/public';
import { ApiException } from '@/lib/api/client';

const inquirySchema = z.object({
    name: z.string().min(2, 'Le nom est requis'),
    email: z.string().email('Email invalide'),
    phone: z.string().optional(),
    subject: z.string().min(3, 'Le sujet est requis'),
    message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

interface OrgContactFormProps {
    organizationId: string;
    organizationName: string;
    onCancel?: () => void;
}

export function OrgContactForm({ organizationId, organizationName, onCancel }: OrgContactFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<InquiryFormData>({
        resolver: zodResolver(inquirySchema),
    });

    const onSubmit = async (data: InquiryFormData) => {
        setError(null);
        setIsSubmitting(true);

        try {
            await submitInquiry(organizationId, {
                name: data.name,
                email: data.email,
                phone: data.phone,
                subject: data.subject,
                message: data.message,
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
            <div className="p-6 rounded-xl border bg-card text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">Message envoyé !</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    {organizationName} recevra votre message et vous répondra bientôt.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center mt-6">
                    <Button variant="outline" onClick={() => setIsSuccess(false)}>
                        Envoyer un autre message
                    </Button>
                    {onCancel && (
                        <Button onClick={onCancel}>
                            Revenir sur la page de l'entreprise
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 rounded-xl border bg-card">
            <h3 className="text-lg font-semibold mb-4">Contacter {organizationName}</h3>

            {error && (
                <Alert variant="error" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nom complet *</Label>
                        <Input
                            id="name"
                            placeholder="Votre nom"
                            {...register('name')}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="votre@email.com"
                            {...register('email')}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="+237 6XX XXX XXX"
                            {...register('phone')}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subject">Sujet *</Label>
                        <Input
                            id="subject"
                            placeholder="Sujet de votre message"
                            {...register('subject')}
                        />
                        {errors.subject && (
                            <p className="text-sm text-destructive">{errors.subject.message}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                        id="message"
                        placeholder="Décrivez votre demande..."
                        rows={4}
                        {...register('message')}
                    />
                    {errors.message && (
                        <p className="text-sm text-destructive">{errors.message.message}</p>
                    )}
                </div>

                <Button type="submit" fullWidth isLoading={isSubmitting}>
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer le message
                </Button>
                {onCancel && (
                    <Button type="button" variant="outline" fullWidth onClick={onCancel}>
                        Annuler
                    </Button>
                )}
            </form>
        </div>
    );
}
