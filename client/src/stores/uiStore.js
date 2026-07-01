import { create } from 'zustand'

export const useUIStore = create()((set) => ({
  activeSessionId: null,
  sidebarOpen: false,
  searchQuery: '',
  sessions: [],
  setActiveSession: (id) => set({ activeSessionId: id }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}))
