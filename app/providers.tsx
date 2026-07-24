'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { useState, type ReactNode } from 'react';

/**
 * Query Client configuration
 */
function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // Data considered fresh for 5 minutes
                staleTime: 5 * 60 * 1000,
                // Keep unused data in cache for 30 minutes
                gcTime: 30 * 60 * 1000,
                // Retry failed requests once
                retry: 1,
                // Don't refetch on window focus by default
                refetchOnWindowFocus: false,
                // Refetch on reconnect
                refetchOnReconnect: true,
            },
            mutations: {
                // Don't retry mutations
                retry: 0,
            },
        },
    });
}

// Browser-side query client
let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
    if (typeof window === 'undefined') {
        // Server: always make a new query client
        return makeQueryClient();
    } else {
        // Browser: make a new query client if we don't already have one
        if (!browserQueryClient) browserQueryClient = makeQueryClient();
        return browserQueryClient;
    }
}

/**
 * Toast configuration
 */
const toastOptions = {
    duration: 4000,
    position: 'top-right' as const,
    style: {
        background: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))',
        border: '1px solid hsl(var(--border))',
        borderRadius: '0.75rem',
        padding: '1rem',
    },
    success: {
        iconTheme: {
            primary: '#10B981',
            secondary: '#ECFDF5',
        },
    },
    error: {
        iconTheme: {
            primary: '#EF4444',
            secondary: '#FEF2F2',
        },
    },
};

interface ProvidersProps {
    children: ReactNode;
}

/**
 * Application Providers
 * Wraps the app with all necessary context providers
 */
export function Providers({ children }: ProvidersProps) {
    // This ensures that data is not shared between different users and requests,
    // while still only creating the QueryClient once per component lifecycle.
    const [queryClient] = useState(() => getQueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
                <Toaster toastOptions={toastOptions} />
            </ThemeProvider>
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
            )}
        </QueryClientProvider>
    );
}
