import { conversationService } from '../services/conversationService.js'
import { success, created } from '../utils/response.js'

export const conversationController = {
  async getConversations(req, res, next) {
    try {
      const conversations = await conversationService.findUserConversations(req.user._id)
      return success(res, conversations)
    } catch (error) {
      next(error)
    }
  },

  async getConversation(req, res, next) {
    try {
      const conversation = await conversationService.findById(req.params.conversationId)
      return success(res, conversation)
    } catch (error) {
      next(error)
    }
  },

  async createConversation(req, res, next) {
    try {
      const { type, participants, name } = req.body
      const conversation = await conversationService.create(
        req.user._id,
        type,
        participants,
        name
      )
      return created(res, conversation, 'Conversation created')
    } catch (error) {
      next(error)
    }
  },

  async updateConversation(req, res, next) {
    try {
      const conversation = await conversationService.update(
        req.params.conversationId,
        req.user._id,
        req.body
      )
      return success(res, conversation, 'Conversation updated')
    } catch (error) {
      next(error)
    }
  },

  async addParticipant(req, res, next) {
    try {
      const conversation = await conversationService.addParticipant(
        req.params.conversationId,
        req.body.userId,
        req.user._id
      )
      return success(res, conversation, 'Participant added')
    } catch (error) {
      next(error)
    }
  },

  async removeParticipant(req, res, next) {
    try {
      const conversation = await conversationService.removeParticipant(
        req.params.conversationId,
        req.body.userId,
        req.user._id
      )
      return success(res, conversation, 'Participant removed')
    } catch (error) {
      next(error)
    }
  },

  async getStats(req, res, next) {
    try {
      const stats = await conversationService.getConversationStats(req.params.conversationId)
      return success(res, stats)
    } catch (error) {
      next(error)
    }
  },
}
