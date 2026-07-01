import { api } from './api'

export const conversationService = {
  getAll() {
    return api.get('/conversations')
  },

  getById(id) {
    return api.get(`/conversations/${id}`)
  },

  create(data) {
    return api.post('/conversations', data)
  },

  update(id, data) {
    return api.patch(`/conversations/${id}`, data)
  },

  addParticipant(id, userId) {
    return api.post(`/conversations/${id}/participants`, { userId })
  },

  removeParticipant(id, userId) {
    return api.delete(`/conversations/${id}/participants`, {
      body: JSON.stringify({ userId }),
    })
  },

  getStats(id) {
    return api.get(`/conversations/${id}/stats`)
  },
}
