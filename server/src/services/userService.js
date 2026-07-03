import { User } from '../models/User.js'
import { NotFoundError, ConflictError } from '../middleware/error.js'

class UserService {
  async findById(id) {
    const user = await User.findById(id)
    if (!user) throw new NotFoundError('User')
    return user
  }

  async findByClerkId(clerkId) {
    return User.findByClerkId(clerkId)
  }

  async createOrUpdate(clerkId, userData) {
    let user = await User.findByClerkId(clerkId)

    if (user) {
      Object.assign(user, userData)
      await user.save()
      return user
    }

    user = await User.create({ clerkId, ...userData })
    return user
  }

  async updateProfile(userId, updateData) {
    const user = await User.findById(userId)
    if (!user) throw new NotFoundError('User')

    if (updateData.username && updateData.username !== user.username) {
      const existing = await User.findOne({
        username: updateData.username,
        _id: { $ne: userId },
      })
      if (existing) throw new ConflictError('Username already taken')
    }

    Object.assign(user, updateData)
    await user.save()
    return user
  }

  async getAll(excludeUserId = null) {
    const filter = excludeUserId ? { _id: { $ne: excludeUserId } } : {}
    return User.find(filter).select('displayName username avatar status lastSeen')
  }

  async search(query, limit = 10) {
    return User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { displayName: { $regex: query, $options: 'i' } },
      ],
    })
      .select('displayName username avatar status')
      .limit(limit)
  }

  async updateStatus(userId, status) {
    const user = await User.findById(userId)
    if (!user) throw new NotFoundError('User')
    return user.updateStatus(status)
  }

  async getOnlineUsers(userIds) {
    return User.find({
      _id: { $in: userIds },
      status: 'online',
    }).select('displayName avatar status lastSeen')
  }
}

export const userService = new UserService()
export default userService
