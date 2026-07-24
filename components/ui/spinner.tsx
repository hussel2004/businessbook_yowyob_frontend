import { cn } from '@/lib/utils/cn';
import { Loader2, type LucideProps } from 'lucide-react';

export interface SpinnerProps extends LucideProps {
    size?: number | string;
}

export function Spinner({ className, size = 24, ...props }: SpinnerProps) {
    return (
        <Loader2
            className={cn('animate-spin text-primary', className)}
            size={size}
            {...props}
        />
    );
}
