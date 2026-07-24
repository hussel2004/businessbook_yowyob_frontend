import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * UI Store State
 * Manages UI-related state like sidebar visibility, modals, etc.
 */
interface UIState {
    // Sidebar
    sidebarOpen: boolean;
    sidebarCollapsed: boolean;

    // Mobile nav
    mobileNavOpen: boolean;

    // Search
    searchOpen: boolean;

    // Actions
    setSidebarOpen: (open: boolean) => void;
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
    toggleSidebarCollapsed: () => void;
    setMobileNavOpen: (open: boolean) => void;
    toggleMobileNav: () => void;
    setSearchOpen: (open: boolean) => void;
    toggleSearch: () => void;
    closeMobileUI: () => void;
}

/**
 * UI Store with persistence for sidebar collapsed state
 */
export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            // Initial state
            sidebarOpen: true,
            sidebarCollapsed: false,
            mobileNavOpen: false,
            searchOpen: false,

            // Sidebar actions
            setSidebarOpen: (open) => set({ sidebarOpen: open }),
            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
            setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
            toggleSidebarCollapsed: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

            // Mobile nav actions
            setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
            toggleMobileNav: () => set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),

            // Search actions
            setSearchOpen: (open) => set({ searchOpen: open }),
            toggleSearch: () => set((state) => ({ searchOpen: !state.searchOpen })),

            // Close all mobile UI elements
            closeMobileUI: () => set({ mobileNavOpen: false, searchOpen: false }),
        }),
        {
            name: 'businessbook-ui',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                sidebarCollapsed: state.sidebarCollapsed,
            }),
        }
    )
);
