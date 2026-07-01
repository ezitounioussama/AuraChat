import { create } from 'zustand'

export const useUIStore = create((set, get) => ({
  activeSessionId: null,
  sidebarOpen: false,
  searchQuery: '',
  sessions: [],
  messages: {},
  userStatuses: {},

  setActiveSession: (id) => set({ activeSessionId: id }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  setSessions: (sessions) => set({ sessions }),

  addMessage: (message) => {
    const conversationId = message.conversation?._id || message.conversation
    if (!conversationId) return

    set((state) => {
      const convMessages = state.messages[conversationId] || []
      const exists = convMessages.some((m) => m._id === message._id)
      if (exists) return state

      return {
        messages: {
          ...state.messages,
          [conversationId]: [...convMessages, message],
        },
      }
    })
  },

  setMessages: (conversationId, messages) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: messages,
      },
    }))
  },

  updateMessageRead: (data) => {
    const { messageId, userId, conversationId } = data
    set((state) => {
      const convMessages = state.messages[conversationId] || []
      return {
        messages: {
          ...state.messages,
          [conversationId]: convMessages.map((m) =>
            m._id === messageId
              ? { ...m, readBy: [...(m.readBy || []), userId] }
              : m
          ),
        },
      }
    })
  },

  updateUserStatus: (userId, status) => {
    set((state) => ({
      userStatuses: {
        ...state.userStatuses,
        [userId]: { status, lastSeen: new Date() },
      },
    }))
  },

  getUserStatus: (userId) => {
    return get().userStatuses[userId] || { status: 'offline' }
  },
}))
