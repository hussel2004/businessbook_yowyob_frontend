import { z } from 'zod';

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'L\'email est requis')
        .email('Email invalide'),
    password: z
        .string()
        .min(1, 'Le mot de passe est requis')
        .min(8, '8 caractères minimum'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Register form validation schema
 */
export const registerSchema = z.object({
    email: z
        .string()
        .min(1, 'L\'email est requis')
        .email('Email invalide'),
    username: z
        .string()
        .min(3, '3 caractères minimum')
        .max(32, '32 caractères maximum')
        .regex(
            /^[A-Za-z0-9](?:[A-Za-z0-9._-]{1,30}[A-Za-z0-9])$/,
            'Lettres, chiffres, points, tirets ou underscores uniquement (doit commencer et finir par une lettre ou un chiffre)'
        ),
    password: z
        .string()
        .min(10, '10 caractères minimum')
        .regex(/[A-Z]/, 'Une majuscule requise')
        .regex(/[a-z]/, 'Une minuscule requise')
        .regex(/[0-9]/, 'Un chiffre requis')
        .regex(/[^A-Za-z0-9]/, 'Un caractère spécial requis'),
    confirmPassword: z
        .string()
        .min(1, 'Confirmez le mot de passe'),
    firstName: z
        .string()
        .min(2, 'Le prénom doit contenir au moins 2 caractères')
        .max(50, 'Le prénom est trop long'),
    lastName: z
        .string()
        .min(2, 'Le nom doit contenir au moins 2 caractères')
        .max(50, 'Le nom est trop long'),
    accountType: z.enum(['VISITOR', 'BUSINESS'], {
        required_error: 'Veuillez sélectionner un type de compte',
    }),
    acceptTerms: z
        .boolean()
        .refine(val => val === true, 'Vous devez accepter les conditions'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Forgot password form validation schema
 */
export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, 'L\'email est requis')
        .email('Email invalide'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset password form validation schema
 */
export const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(10, '10 caractères minimum')
        .regex(/[A-Z]/, 'Une majuscule requise')
        .regex(/[a-z]/, 'Une minuscule requise')
        .regex(/[0-9]/, 'Un chiffre requis')
        .regex(/[^A-Za-z0-9]/, 'Un caractère spécial requis'),
    confirmPassword: z
        .string()
        .min(1, 'Confirmez le mot de passe'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * Password strength checker
 */
export function getPasswordStrength(password: string): {
    score: number;
    label: string;
    color: string;
} {
    let score = 0;

    if (password.length >= 10) score++;
    if (password.length >= 14) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { score, label: 'Faible', color: 'bg-red-500' };
    if (score <= 4) return { score, label: 'Moyen', color: 'bg-yellow-500' };
    return { score, label: 'Fort', color: 'bg-green-500' };
}
