import { userService } from '../services/userService.js'
import { success, created } from '../utils/response.js'

export const userController = {
  async getProfile(req, res, next) {
    try {
      const user = await userService.findById(req.user._id)
      return success(res, user)
    } catch (error) {
      next(error)
    }
  },

  async updateProfile(req, res, next) {
    try {
      const user = await userService.updateProfile(req.user._id, req.body)
      return success(res, user, 'Profile updated')
    } catch (error) {
      next(error)
    }
  },

  async getUserById(req, res, next) {
    try {
      const user = await userService.findById(req.params.id)
      return success(res, user)
    } catch (error) {
      next(error)
    }
  },

  async getAllUsers(req, res, next) {
    try {
      console.log('[Users] getAllUsers called by:', req.user._id.toString(), req.user.displayName, req.user.email)
      const users = await userService.getAll(req.user._id)
      console.log('[Users] Returning', users.length, 'users:', users.map(u => u.displayName + '(' + u._id + ')'))
      return success(res, users)
    } catch (error) {
      next(error)
    }
  },

  async searchUsers(req, res, next) {
    try {
      const { q, limit } = req.query
      const users = await userService.search(q, parseInt(limit) || 10)
      return success(res, users)
    } catch (error) {
      next(error)
    }
  },

  async updateStatus(req, res, next) {
    try {
      const user = await userService.updateStatus(req.user._id, req.body.status)
      return success(res, user)
    } catch (error) {
      next(error)
    }
  },

  async getOnlineUsers(req, res, next) {
    try {
      const { userIds } = req.body
      const users = await userService.getOnlineUsers(userIds)
      return success(res, users)
    } catch (error) {
      next(error)
    }
  },
}
