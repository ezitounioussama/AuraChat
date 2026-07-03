import { api } from './api'

export const authService = {
  getAll() {
    return api.get('/users')
  },

  getMe() {
    return api.get('/users/me')
  },

  updateProfile(data) {
    return api.patch('/users/me', data)
  },

  updateStatus(status) {
    return api.patch('/users/status', { status })
  },

  searchUsers(query, limit = 10) {
    return api.get(`/users/search?q=${encodeURIComponent(query)}&limit=${limit}`)
  },

  getUserById(id) {
    return api.get(`/users/${id}`)
  },
}
