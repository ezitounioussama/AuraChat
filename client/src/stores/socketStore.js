import { create } from 'zustand'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'

let socket = null

export const useSocketStore = create((set, get) => ({
  socket: null,
  connected: false,
  typingUsers: {},

  connect: (token) => {
    if (socket?.connected) return

    socket = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    })

    socket.on('connect', () => {
      set({ connected: true })
    })

    socket.on('disconnect', () => {
      set({ connected: false })
    })

    socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error.message)
      set({ connected: false })
    })

    socket.on('message:new', (message) => {
      const handler = get().onMessage
      if (handler) handler(message)
    })

    socket.on('message:read', (data) => {
      const handler = get().onMessageRead
      if (handler) handler(data)
    })

    socket.on('typing:start', (data) => {
      set((state) => ({
        typingUsers: {
          ...state.typingUsers,
          [data.conversationId]: {
            ...(state.typingUsers[data.conversationId] || {}),
            [data.userId]: Date.now(),
          },
        },
      }))
    })

    socket.on('typing:stop', (data) => {
      set((state) => {
        const convTyping = { ...(state.typingUsers[data.conversationId] || {}) }
        delete convTyping[data.userId]
        return {
          typingUsers: {
            ...state.typingUsers,
            [data.conversationId]: convTyping,
          },
        }
      })
    })

    socket.on('user:status', (data) => {
      const handler = get().onUserStatus
      if (handler) handler(data)
    })

    set({ socket })
  },

  disconnect: () => {
    if (socket) {
      socket.disconnect()
      socket = null
      set({ socket: null, connected: false })
    }
  },

  sendMessage: (data, ack) => {
    socket?.emit('message:send', data, ack)
  },

  joinConversation: (conversationId) => {
    socket?.emit('conversation:join', conversationId)
  },

  leaveConversation: (conversationId) => {
    socket?.emit('conversation:leave', conversationId)
  },

  markAsRead: (messageId, conversationId) => {
    socket?.emit('message:read', { messageId, conversationId })
  },

  startTyping: (conversationId) => {
    socket?.emit('typing:start', conversationId)
  },

  stopTyping: (conversationId) => {
    socket?.emit('typing:stop', conversationId)
  },

  setOnMessage: (handler) => set({ onMessage: handler }),
  setOnMessageRead: (handler) => set({ onMessageRead: handler }),
  setOnUserStatus: (handler) => set({ onUserStatus: handler }),
}))
