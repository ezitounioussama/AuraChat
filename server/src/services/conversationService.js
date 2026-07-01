import { Conversation } from '../models/Conversation.js'
import { Message } from '../models/Message.js'
import { NotFoundError, ForbiddenError, ConflictError } from '../middleware/error.js'

class ConversationService {
  async findById(id) {
    const conversation = await Conversation.findById(id)
      .populate('participants', 'displayName avatar status lastSeen')
      .populate('lastMessage')
      .populate('admins', 'displayName avatar')
    if (!conversation) throw new NotFoundError('Conversation')
    return conversation
  }

  async findDirect(userId1, userId2) {
    return Conversation.findDirectConversation(userId1, userId2)
  }

  async findUserConversations(userId) {
    return Conversation.findUserConversations(userId)
  }

  async create(creatorId, type, participantIds, name = null) {
    const uniqueParticipants = [...new Set([creatorId, ...participantIds])]

    if (type === 'direct' && uniqueParticipants.length !== 2) {
      throw new ForbiddenError('Direct conversations must have exactly 2 participants')
    }

    if (type === 'direct') {
      const existing = await this.findDirect(uniqueParticipants[0], uniqueParticipants[1])
      if (existing) return existing
    }

    const conversation = await Conversation.create({
      type,
      name,
      participants: uniqueParticipants,
      admins: [creatorId],
      createdBy: creatorId,
    })

    return this.findById(conversation._id)
  }

  async update(conversationId, userId, updateData) {
    const conversation = await Conversation.findById(conversationId)
    if (!conversation) throw new NotFoundError('Conversation')

    if (!conversation.isParticipant(userId)) {
      throw new ForbiddenError('Not a participant')
    }

    if (!conversation.admins.some((id) => id.equals(userId))) {
      throw new ForbiddenError('Only admins can update conversation')
    }

    Object.assign(conversation, updateData)
    await conversation.save()
    return this.findById(conversationId)
  }

  async addParticipant(conversationId, userId, requesterId) {
    const conversation = await Conversation.findById(conversationId)
    if (!conversation) throw new NotFoundError('Conversation')

    if (!conversation.admins.some((id) => id.equals(requesterId))) {
      throw new ForbiddenError('Only admins can add participants')
    }

    await conversation.addParticipant(userId)
    return this.findById(conversationId)
  }

  async removeParticipant(conversationId, userId, requesterId) {
    const conversation = await Conversation.findById(conversationId)
    if (!conversation) throw new NotFoundError('Conversation')

    if (!conversation.admins.some((id) => id.equals(requesterId))) {
      throw new ForbiddenError('Only admins can remove participants')
    }

    if (userId.equals(requesterId)) {
      throw new ForbiddenError('Cannot remove yourself')
    }

    await conversation.removeParticipant(userId)
    return this.findById(conversationId)
  }

  async updateLastMessage(conversationId, messageId) {
    return Conversation.findByIdAndUpdate(
      conversationId,
      { lastMessage: messageId },
      { new: true }
    )
  }

  async getConversationStats(conversationId) {
    const messageCount = await Message.countDocuments({
      conversation: conversationId,
      isDeleted: false,
    })

    const participantCount = await Conversation.findById(conversationId).select('participants')

    return {
      messageCount,
      participantCount: participantCount?.participants?.length || 0,
    }
  }
}

export const conversationService = new ConversationService()
export default conversationService
