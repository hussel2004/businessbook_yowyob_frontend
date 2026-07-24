'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, User, Check, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { registerSchema, type RegisterFormData, getPasswordStrength } from '@/lib/validations/auth';
import { useAuth } from '@/lib/auth/hooks';
import { ApiException } from '@/lib/api/client';
import { cn } from '@/lib/utils/cn';

export function RegisterForm() {
    const { register: registerUser, isRegistering } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [passwordValue, setPasswordValue] = useState('');
    const [verificationSent, setVerificationSent] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            accountType: 'VISITOR',
            acceptTerms: false,
        },
    });

    const watchPassword = watch('password');
    const passwordStrength = getPasswordStrength(watchPassword || '');

    const passwordRequirements = [
        { label: '10 caractères minimum', met: (watchPassword?.length || 0) >= 10 },
        { label: 'Une majuscule', met: /[A-Z]/.test(watchPassword || '') },
        { label: 'Une minuscule', met: /[a-z]/.test(watchPassword || '') },
        { label: 'Un chiffre', met: /[0-9]/.test(watchPassword || '') },
        { label: 'Un caractère spécial', met: /[^A-Za-z0-9]/.test(watchPassword || '') },
    ];

    const onSubmit = async (data: RegisterFormData) => {
        setError(null);
        try {
            await registerUser({
                email: data.email,
                username: data.username,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                accountType: data.accountType,
            });
            setRegisteredEmail(data.email);
            setVerificationSent(true);
        } catch (err) {
            if (err instanceof ApiException) {
                setError(err.message);
            } else {
                setError('Une erreur est survenue. Veuillez réessayer.');
            }
        }
    };

    if (verificationSent) {
        return (
            <div className="space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-6 w-6 text-green-600" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Compte créé avec succès !</h3>
                    <p className="text-sm text-muted-foreground">
                        Un email de vérification a été envoyé à{' '}
                        <span className="font-medium text-foreground">{registeredEmail}</span>.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Vérifiez votre boîte mail et cliquez sur le lien pour activer votre compte.
                    </p>
                </div>
                <Link href="/login" className="inline-block text-sm text-primary font-medium hover:underline">
                    Retour à la connexion
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
                <Alert variant="error">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-3">
                <Label>Type de compte</Label>
                <div className="grid grid-cols-2 gap-4">
                    <div
                        className={cn(
                            "cursor-pointer rounded-lg border-2 p-4 transition-all hover:bg-muted/50",
                            watch('accountType') === 'VISITOR'
                                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                : "border-muted-foreground/20 hover:border-primary/50"
                        )}
                        onClick={() => setValue('accountType', 'VISITOR')}
                    >
                        <div className="font-semibold">Visiteur</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Pour découvrir et noter des entreprises
                        </p>
                    </div>
                    <div
                        className={cn(
                            "cursor-pointer rounded-lg border-2 p-4 transition-all hover:bg-muted/50",
                            watch('accountType') === 'BUSINESS'
                                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                : "border-muted-foreground/20 hover:border-primary/50"
                        )}
                        onClick={() => setValue('accountType', 'BUSINESS')}
                    >
                        <div className="font-semibold">Professionnel</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Pour inscrire et gérer votre entreprise
                        </p>
                    </div>
                </div>
                {errors.accountType && (
                    <p className="text-sm text-destructive">{errors.accountType.message}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="firstName"
                            placeholder="Jean"
                            className="pl-10"
                            {...register('firstName')}
                        />
                    </div>
                    {errors.firstName && (
                        <p className="text-sm text-destructive">{errors.firstName.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                        id="lastName"
                        placeholder="Dupont"
                        {...register('lastName')}
                    />
                    {errors.lastName && (
                        <p className="text-sm text-destructive">{errors.lastName.message}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="email"
                        type="email"
                        placeholder="votre@email.com"
                        className="pl-10"
                        {...register('email')}
                    />
                </div>
                {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="username"
                        placeholder="jeandupont"
                        className="pl-10"
                        {...register('username')}
                    />
                </div>
                {errors.username && (
                    <p className="text-sm text-destructive">{errors.username.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        {...register('password')}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                )}

                {/* Password strength indicator */}
                {watchPassword && (
                    <div className="space-y-2 mt-2">
                        <div className="flex items-center gap-2">
                            <Progress
                                value={(passwordStrength.score / 6) * 100}
                                className="h-1.5 flex-1"
                            />
                            <span className="text-xs font-medium">{passwordStrength.label}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                            {passwordRequirements.map((req, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 text-xs">
                                    {req.met ? (
                                        <Check className="h-3 w-3 text-green-500" />
                                    ) : (
                                        <X className="h-3 w-3 text-muted-foreground" />
                                    )}
                                    <span className={cn(
                                        req.met ? 'text-green-600' : 'text-muted-foreground'
                                    )}>
                                        {req.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        {...register('confirmPassword')}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
                {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Checkbox
                    id="acceptTerms"
                    label={
                        <span>
                            J'accepte les{' '}
                            <Link href="/terms" className="text-primary hover:underline">
                                conditions d'utilisation
                            </Link>{' '}
                            et la{' '}
                            <Link href="/privacy" className="text-primary hover:underline">
                                politique de confidentialité
                            </Link>
                        </span>
                    }
                    {...register('acceptTerms')}
                    onChange={(e) => setValue('acceptTerms', e.target.checked)}
                />
                {errors.acceptTerms && (
                    <p className="text-sm text-destructive">{errors.acceptTerms.message}</p>
                )}
            </div>

            <Button type="submit" fullWidth isLoading={isRegistering}>
                {isRegistering ? 'Inscription...' : 'Créer mon compte'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
                Déjà un compte ?{' '}
                <Link href="/login" className="text-primary font-medium hover:underline">
                    Connectez-vous
                </Link>
            </p>
        </form>
    );
}
