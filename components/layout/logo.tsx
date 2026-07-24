import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

interface LogoProps {
    className?: string;
    iconOnly?: boolean;
}

export function Logo({ className, iconOnly = false }: LogoProps) {
    return (
        <Link href="/" className={cn('flex items-center gap-2', className)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/businessbook_logo.png"
                alt="BusinessBook Logo"
                width={48}
                height={48}
                className="rounded-lg"
            />
            {!iconOnly && (
                <span className="text-xl font-bold tracking-tight text-foreground">
                    BusinessBook
                </span>
            )}
        </Link>
    );
}

