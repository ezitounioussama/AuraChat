import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: '',
      maxlength: 200,
    },
    status: {
      type: String,
      enum: ['online', 'offline', 'away', 'busy'],
      default: 'offline',
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    settings: {
      notifications: { type: Boolean, default: true },
      readReceipts: { type: Boolean, default: true },
      typingIndicators: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

userSchema.virtual('conversations', {
  ref: 'Conversation',
  localField: '_id',
  foreignField: 'participants',
})

userSchema.index({ username: 'text', displayName: 'text' })

userSchema.statics.findByClerkId = function (clerkId) {
  return this.findOne({ clerkId })
}

userSchema.statics.findOrCreateByClerkId = async function (clerkId, userData) {
  let user = await this.findOne({ clerkId })
  if (!user) {
    user = await this.create({ clerkId, ...userData })
  }
  return user
}

userSchema.methods.updateStatus = function (status) {
  this.status = status
  this.lastSeen = new Date()
  return this.save()
}

userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.clerkId
  delete obj.__v
  return obj
}

export const User = mongoose.model('User', userSchema)
export default User
