import React from 'react';
import { useFormContext, RegisterOptions } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input, InputProps } from '@/components/ui/input';
import { Textarea, TextareaProps } from '@/components/ui/textarea';
import { cn } from '@/lib/utils/cn';

interface BaseFieldProps {
    label?: string;
    description?: string;
    className?: string;
}

// Removing generic constraint complexity for now to ensure build passes across strict TS configurations
// We can re-enable strict typing iteratively
interface FormInputProps extends BaseFieldProps, Omit<InputProps, 'name'> {
    name: string;
    rules?: RegisterOptions;
}

interface FormTextareaProps extends BaseFieldProps, Omit<TextareaProps, 'name'> {
    name: string;
    rules?: RegisterOptions;
}

export function FormInput({
    name,
    label,
    description,
    className,
    rules,
    ...props
}: FormInputProps) {
    const { register, formState: { errors } } = useFormContext();
    const error = errors[name]?.message as string | undefined;

    return (
        <div className={cn('space-y-2', className)}>
            {label && <Label htmlFor={name}>{label}</Label>}
            <Input
                id={name}
                {...register(name, rules)}
                error={!!error}
                aria-invalid={!!error}
                aria-describedby={error ? `${name}-error` : undefined}
                {...props}
            />
            {description && !error && (
                <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {error && (
                <p id={`${name}-error`} className="text-xs font-medium text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
}

export function FormTextarea({
    name,
    label,
    description,
    className,
    rules,
    ...props
}: FormTextareaProps) {
    const { register, formState: { errors } } = useFormContext();
    const error = errors[name]?.message as string | undefined;

    return (
        <div className={cn('space-y-2', className)}>
            {label && <Label htmlFor={name}>{label}</Label>}
            <Textarea
                id={name}
                {...register(name, rules)}
                error={!!error}
                {...props}
            />
            {description && !error && (
                <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {error && (
                <p className="text-xs font-medium text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
}
