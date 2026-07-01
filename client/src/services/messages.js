import { api } from './api'

export const messageService = {
  getByConversation(conversationId, limit = 50, before = null) {
    let url = `/messages/${conversationId}?limit=${limit}`
    if (before) url += `&before=${before}`
    return api.get(url)
  },

  getById(messageId) {
    return api.get(`/messages/${messageId}`)
  },

  send(data) {
    return api.post('/messages', data)
  },

  edit(messageId, content) {
    return api.patch(`/messages/${messageId}`, { content })
  },

  delete(messageId) {
    return api.delete(`/messages/${messageId}`)
  },

  markAsRead(messageId) {
    return api.post(`/messages/${messageId}/read`)
  },

  getUnreadCount(conversationId) {
    return api.get(`/messages/${conversationId}/unread`)
  },

  search(query, conversationId = null, limit = 20) {
    let url = `/messages/search?q=${encodeURIComponent(query)}&limit=${limit}`
    if (conversationId) url += `&conversationId=${conversationId}`
    return api.get(url)
  },
}
