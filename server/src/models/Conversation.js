import mongoose from 'mongoose'

const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['direct', 'group'],
      required: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    pinnedMessages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
      },
    ],
    settings: {
      muted: { type: Boolean, default: false },
      archived: { type: Boolean, default: false },
      pinned: { type: Boolean, default: false },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

conversationSchema.index({ participants: 1 })
conversationSchema.index({ updatedAt: -1 })

conversationSchema.virtual('participantCount').get(function () {
  return this.participants.length
})

conversationSchema.statics.findDirectConversation = function (userId1, userId2) {
  return this.findOne({
    type: 'direct',
    participants: { $all: [userId1, userId2], $size: 2 },
  })
}

conversationSchema.statics.findUserConversations = function (userId) {
  return this.find({ participants: userId })
    .populate('participants', 'displayName avatar status lastSeen')
    .populate('lastMessage')
    .sort({ updatedAt: -1 })
}

conversationSchema.methods.addParticipant = function (userId) {
  if (!this.participants.includes(userId)) {
    this.participants.push(userId)
    return this.save()
  }
  return Promise.resolve(this)
}

conversationSchema.methods.removeParticipant = function (userId) {
  this.participants = this.participants.filter((id) => !id.equals(userId))
  return this.save()
}

conversationSchema.methods.isParticipant = function (userId) {
  return this.participants.some((id) => id.equals(userId))
}

export const Conversation = mongoose.model('Conversation', conversationSchema)
export default Conversation
