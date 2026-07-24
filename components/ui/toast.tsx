'use client';

import toast, { Toaster as HotToaster, ToastOptions } from 'react-hot-toast';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

// Re-export toast functions with custom styling
export const showToast = {
    success: (message: string, options?: ToastOptions) =>
        toast.custom(
            (t) => (
                <div
                    className={cn(
                        'flex items-center gap-3 max-w-md px-4 py-3 bg-background border rounded-lg shadow-lg',
                        'animate-in slide-in-from-top-5 fade-in-0 duration-300',
                        !t.visible && 'animate-out slide-out-to-right fade-out-0'
                    )}
                >
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                    <p className="text-sm font-medium">{message}</p>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ),
            { duration: 4000, ...options }
        ),

    error: (message: string, options?: ToastOptions) =>
        toast.custom(
            (t) => (
                <div
                    className={cn(
                        'flex items-center gap-3 max-w-md px-4 py-3 bg-background border border-red-200 rounded-lg shadow-lg',
                        'animate-in slide-in-from-top-5 fade-in-0 duration-300',
                        !t.visible && 'animate-out slide-out-to-right fade-out-0'
                    )}
                >
                    <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                    <p className="text-sm font-medium">{message}</p>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ),
            { duration: 5000, ...options }
        ),

    warning: (message: string, options?: ToastOptions) =>
        toast.custom(
            (t) => (
                <div
                    className={cn(
                        'flex items-center gap-3 max-w-md px-4 py-3 bg-background border border-yellow-200 rounded-lg shadow-lg',
                        'animate-in slide-in-from-top-5 fade-in-0 duration-300',
                        !t.visible && 'animate-out slide-out-to-right fade-out-0'
                    )}
                >
                    <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0" />
                    <p className="text-sm font-medium">{message}</p>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ),
            { duration: 4000, ...options }
        ),

    info: (message: string, options?: ToastOptions) =>
        toast.custom(
            (t) => (
                <div
                    className={cn(
                        'flex items-center gap-3 max-w-md px-4 py-3 bg-background border border-blue-200 rounded-lg shadow-lg',
                        'animate-in slide-in-from-top-5 fade-in-0 duration-300',
                        !t.visible && 'animate-out slide-out-to-right fade-out-0'
                    )}
                >
                    <Info className="h-5 w-5 text-blue-500 shrink-0" />
                    <p className="text-sm font-medium">{message}</p>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ),
            { duration: 4000, ...options }
        ),

    loading: (message: string, options?: ToastOptions) =>
        toast.loading(message, options),

    dismiss: (toastId?: string) => toast.dismiss(toastId),

    promise: <T,>(
        promise: Promise<T>,
        messages: { loading: string; success: string; error: string },
        options?: ToastOptions
    ) => toast.promise(promise, messages, options),
};

// Toaster component to be placed in providers
export function Toaster() {
    return (
        <HotToaster
            position="top-right"
            toastOptions={{
                duration: 4000,
                style: {
                    background: 'transparent',
                    boxShadow: 'none',
                    padding: 0,
                },
            }}
        />
    );
}

// Re-export base toast for advanced usage
export { toast };
