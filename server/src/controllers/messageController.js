import { messageService } from '../services/messageService.js'
import { success, created, paginated } from '../utils/response.js'

export const messageController = {
  async getMessages(req, res, next) {
    try {
      const { conversationId } = req.params
      const { limit, before } = req.query
      const messages = await messageService.findByConversation(
        conversationId,
        parseInt(limit) || 50,
        before
      )
      return success(res, messages)
    } catch (error) {
      next(error)
    }
  },

  async getMessage(req, res, next) {
    try {
      const message = await messageService.findById(req.params.messageId)
      return success(res, message)
    } catch (error) {
      next(error)
    }
  },

  async sendMessage(req, res, next) {
    try {
      const { conversationId, content, type, attachments, replyTo } = req.body
      const message = await messageService.send(
        req.user._id,
        conversationId,
        content,
        type,
        attachments,
        replyTo
      )
      return created(res, message, 'Message sent')
    } catch (error) {
      next(error)
    }
  },

  async editMessage(req, res, next) {
    try {
      const message = await messageService.edit(
        req.params.messageId,
        req.user._id,
        req.body.content
      )
      return success(res, message, 'Message edited')
    } catch (error) {
      next(error)
    }
  },

  async deleteMessage(req, res, next) {
    try {
      await messageService.delete(req.params.messageId, req.user._id)
      return success(res, null, 'Message deleted')
    } catch (error) {
      next(error)
    }
  },

  async markAsRead(req, res, next) {
    try {
      const message = await messageService.markAsRead(req.params.messageId, req.user._id)
      return success(res, message)
    } catch (error) {
      next(error)
    }
  },

  async getUnreadCount(req, res, next) {
    try {
      const count = await messageService.getUnreadCount(req.params.conversationId, req.user._id)
      return success(res, { count })
    } catch (error) {
      next(error)
    }
  },

  async searchMessages(req, res, next) {
    try {
      const { q, conversationId, limit } = req.query
      const messages = await messageService.search(q, conversationId, parseInt(limit) || 20)
      return success(res, messages)
    } catch (error) {
      next(error)
    }
  },
}
