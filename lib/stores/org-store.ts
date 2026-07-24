import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Selected organization state for dashboard
 * When a user has multiple organizations, this stores the currently selected one
 */
interface OrgState {
    // Selected organization ID
    selectedOrgId: string | null;

    // Actions
    setSelectedOrgId: (id: string | null) => void;
    clearSelection: () => void;
}

/**
 * Organization selection store with persistence
 */
export const useOrgStore = create<OrgState>()(
    persist(
        (set) => ({
            selectedOrgId: null,

            setSelectedOrgId: (id) => set({ selectedOrgId: id }),
            clearSelection: () => set({ selectedOrgId: null }),
        }),
        {
            name: 'businessbook-org',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

/**
 * Selector: Get selected organization ID
 */
export const selectSelectedOrgId = (state: OrgState) => state.selectedOrgId;
