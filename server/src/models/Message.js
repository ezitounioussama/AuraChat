import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    content: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
    type: {
      type: String,
      enum: ['text', 'image', 'file', 'audio', 'video', 'system'],
      default: 'text',
      required: true,
    },
    attachments: [
      {
        url: { type: String, required: true },
        name: { type: String, required: true },
        type: { type: String, required: true },
        size: { type: Number, required: true },
      },
    ],
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    editedAt: {
      type: Date,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

messageSchema.index({ conversation: 1, createdAt: -1 })
messageSchema.index({ sender: 1, createdAt: -1 })

messageSchema.virtual('isEdited').get(function () {
  return this.editedAt !== null
})

messageSchema.virtual('isRead').get(function () {
  return this.readBy.length > 0
})

messageSchema.statics.findByConversation = function (conversationId, limit = 50, before = null) {
  const query = { conversation: conversationId, isDeleted: false }
  if (before) {
    query.createdAt = { $lt: new Date(before) }
  }
  return this.find(query)
    .populate('sender', 'displayName avatar')
    .populate('replyTo')
    .sort({ createdAt: -1 })
    .limit(limit)
}

messageSchema.statics.findMessageById = function (messageId) {
  return this.findById(messageId)
    .populate('sender', 'displayName avatar')
    .populate('replyTo')
}

messageSchema.methods.markAsRead = function (userId) {
  if (!this.readBy.some((id) => id.equals(userId))) {
    this.readBy.push(userId)
    return this.save()
  }
  return Promise.resolve(this)
}

messageSchema.methods.softDelete = function () {
  this.isDeleted = true
  this.deletedAt = new Date()
  this.content = null
  this.attachments = []
  return this.save()
}

messageSchema.methods.edit = function (newContent) {
  this.content = newContent
  this.editedAt = new Date()
  return this.save()
}

export const Message = mongoose.model('Message', messageSchema)
export default Message
