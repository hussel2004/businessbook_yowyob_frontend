'use client';

import { useState, useCallback } from 'react';
import { useAuthStore } from '@/lib/auth/auth-store';

interface UseAuthPromptReturn {
    showPrompt: boolean;
    promptAction: string;
    openPrompt: (action: string) => void;
    closePrompt: () => void;
    requireAuth: (action: string, callback: () => void) => void;
}

/**
 * Hook to manage authentication prompts for protected actions.
 * Returns methods to check auth and show login prompt if needed.
 */
export function useAuthPrompt(): UseAuthPromptReturn {
    const { isAuthenticated } = useAuthStore();
    const [showPrompt, setShowPrompt] = useState(false);
    const [promptAction, setPromptAction] = useState('');

    const openPrompt = useCallback((action: string) => {
        setPromptAction(action);
        setShowPrompt(true);
    }, []);

    const closePrompt = useCallback(() => {
        setShowPrompt(false);
        setPromptAction('');
    }, []);

    /**
     * Require authentication for an action.
     * If authenticated, execute the callback.
     * If not, show the login prompt.
     */
    const requireAuth = useCallback((action: string, callback: () => void) => {
        if (isAuthenticated) {
            callback();
        } else {
            openPrompt(action);
        }
    }, [isAuthenticated, openPrompt]);

    return {
        showPrompt,
        promptAction,
        openPrompt,
        closePrompt,
        requireAuth,
    };
}
