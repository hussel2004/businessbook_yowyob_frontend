import * as React from 'react';
import { User } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { getInitials } from '@/lib/utils/format';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string | null;
    alt?: string;
    fallback?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base',
    xl: 'h-20 w-20 text-xl',
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
    ({ className, src, alt, fallback, size = 'md', ...props }, ref) => {
        const [hasError, setHasError] = React.useState(false);

        // Reset error state when src changes
        React.useEffect(() => {
            setHasError(false);
        }, [src]);

        const initials = fallback || (alt ? getInitials(alt) : null);

        return (
            <div
                ref={ref}
                className={cn(
                    'relative flex shrink-0 overflow-hidden rounded-full bg-muted',
                    sizeClasses[size],
                    className
                )}
                {...props}
            >
                {src && !hasError ? (
                    // We use simple img tag here to avoid Next.js Image complexity with external URLs for now
                    // In production, Next.js Image is preferred with proper domain config
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={src}
                        alt={alt || 'Avatar'}
                        className="aspect-square h-full w-full object-cover"
                        onError={() => setHasError(true)}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                        {initials ? initials : <User className="h-1/2 w-1/2" />}
                    </div>
                )}
            </div>
        );
    }
);
Avatar.displayName = 'Avatar';

export { Avatar };
