import mongoose from 'mongoose'
import { Message } from '../models/Message.js'
import { Conversation } from '../models/Conversation.js'
import { NotFoundError, ForbiddenError } from '../middleware/error.js'

class MessageService {
  async findById(id) {
    const message = await Message.findMessageById(id)
    if (!message) throw new NotFoundError('Message')
    return message
  }

  async findByConversation(conversationId, limit = 50, before = null) {
    return Message.findByConversation(conversationId, limit, before)
  }

  async send(senderId, conversationId, content, type = 'text', attachments = [], replyTo = null) {
    const conversation = await Conversation.findById(conversationId)
    if (!conversation) throw new NotFoundError('Conversation')

    if (!conversation.isParticipant(senderId)) {
      throw new ForbiddenError('Not a participant in this conversation')
    }

    if (replyTo) {
      const replyMessage = await Message.findById(replyTo)
      if (!replyMessage || !replyMessage.conversation.equals(conversationId)) {
        throw new NotFoundError('Reply message')
      }
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const [message] = await Message.create(
        [
          {
            conversation: conversationId,
            sender: senderId,
            content,
            type,
            attachments,
            replyTo,
          },
        ],
        { session }
      )

      await Conversation.findByIdAndUpdate(
        conversationId,
        { lastMessage: message._id },
        { session }
      )

      await session.commitTransaction()

      return Message.findById(message._id)
        .populate('sender', '_id displayName avatar')
        .populate('replyTo')
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  async edit(messageId, userId, newContent) {
    const message = await Message.findById(messageId)
    if (!message) throw new NotFoundError('Message')

    if (!message.sender.equals(userId)) {
      throw new ForbiddenError('Can only edit your own messages')
    }

    if (message.isDeleted) {
      throw new ForbiddenError('Cannot edit deleted messages')
    }

    await message.edit(newContent)
    return Message.findById(messageId)
      .populate('sender', '_id displayName avatar')
      .populate('replyTo')
  }

  async delete(messageId, userId) {
    const message = await Message.findById(messageId)
    if (!message) throw new NotFoundError('Message')

    if (!message.sender.equals(userId)) {
      throw new ForbiddenError('Can only delete your own messages')
    }

    await message.softDelete()
    return { deleted: true }
  }

  async markAsRead(messageId, userId) {
    const message = await Message.findById(messageId)
    if (!message) throw new NotFoundError('Message')

    await message.markAsRead(userId)
    return Message.findById(messageId)
      .populate('sender', '_id displayName avatar')
  }

  async getUnreadCount(conversationId, userId) {
    return Message.countDocuments({
      conversation: conversationId,
      sender: { $ne: userId },
      readBy: { $ne: userId },
      isDeleted: false,
    })
  }

  async search(query, conversationId = null, limit = 20) {
    const match = {
      content: { $regex: query, $options: 'i' },
      isDeleted: false,
    }

    if (conversationId) {
      match.conversation = new mongoose.Types.ObjectId(conversationId)
    }

    return Message.aggregate([
      { $match: match },
      { $lookup: { from: 'users', localField: 'sender', foreignField: '_id', as: 'sender' } },
      { $unwind: '$sender' },
      { $project: { content: 1, type: 1, createdAt: 1, sender: { displayName: 1, avatar: 1 } } },
      { $sort: { createdAt: -1 } },
      { $limit: limit },
    ])
  }
}

export const messageService = new MessageService()
export default messageService
